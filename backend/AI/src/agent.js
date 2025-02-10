import { runApprovalCheck, runLLM } from './llm.js'
import {
  addMessagesToDb,
  getMessagesFromDb,
  saveToolResponse,
} from './memory.js'
import { runTool } from './toolRunner.js'
import { generateImagesDefinition } from './tools/generateImages.js'
import { showLoader, logMessage } from './ui.js'

/* 
  If this function is being run, then the history is at the state of 
  an Image generation tool call, all other tool calls do not need an approval and will 
  follow the normal flow
  Since it is in a tool call state, we have to add a tool call result before normal execution
  Remember the Tool Call Flow

  AI says use this tool and provides structured arguments
  We run the tool locally, save the results to DB
  Pass to AI
  AI structures our response and sends it back to us
*/

var userId = '67a8d8d68305f334b067d89c'


export const handleImageApprovalFlow = async ({ userMessage }) => {
  // The UI Spinner on logging the name of the Tool during a Tool Call message by AI
  // Automatically console.logs an approval prompt.
  const history = await getMessagesFromDb(userId)
  const latestMessage = history.at(-1)
  const toolCall = latestMessage?.tool_calls?.[0] // Grab the tool call
  // We only need approval for generateImages tool
  if (!toolCall || toolCall.function.name != generateImagesDefinition.name) {
    return
  }
  const loader = showLoader('Processing Approval')
  const approval = await runApprovalCheck(userMessage)
  if (approval) {
    loader.update(`Executing Tool, ${toolCall.function.name}`)
    const toolCallResult = await runTool(userMessage, toolCall)
    loader.update(`Completed Tool Call, ${toolCall.function.name}`)
    await saveToolResponse(userId, toolCall.id, toolCallResult)
  } else {
    await saveToolResponse(
      userId,
      toolCall.id,
      'User did not approve image generation at this time'
    )
    // Not Approval State, Add user message to db within runAgent
    return false
  }
  loader.stop()
  // Approval State, We have already added tool call result to DB
  // Does not need any user message to be added to db.
  return true
}

export const runAgent = async ({ userMessage, tools }) => {
  // If in a Generate Image tool call state, we will send in a Yes or No as prompt to restart Chat
  const isApprovalState = await handleImageApprovalFlow({ userMessage })

  /* 
    If our present state is not a Generate Image Tool Call State, 
    Continue Normal Flow, Add user message to Context and runLLM 
  */
  if (!isApprovalState) {
    await addMessagesToDb({userId, messages:[{ role: 'user', content: userMessage }]})
  }

  const loader = showLoader('Thinking...\n')

  while (true) {
    // Add present user message to database.
    // Retrieve all messages from memory to pass as context
    const messages = await getMessagesFromDb(userId)
    const response = await runLLM(messages, tools)
    //Save response to memory
    await addMessagesToDb({messages: [response], userId})

    if (response.content) {
      loader.stop()
      logMessage(response)
      await getMessagesFromDb(userId)
      process.exit(0)
    }

    if (response.tool_calls) {
      loader.update(`executing: ${response.tool_calls[0].function.name}`)
      // If response.tool call is generateImages, UI.js will
      // automatically prompt for an approval
      logMessage(response)

      // If the tool call is generateImages, Go to top of While Loop
      // to handle the approval flow
      if (
        response.tool_calls[0].function.name === generateImagesDefinition.name
      ) {
        loader.update(`Sending for Approval`)
        loader.stop()
        return getMessagesFromDb(userId)
      }
      // Run the first suggested tool
      const toolCallResult = await runTool(userMessage, response.tool_calls[0])
      await saveToolResponse(userId, response, toolCallResult)
      loader.update(`done: ${response.tool_calls[0].function.name}`)
    }
    loader.stop()
  }
}
