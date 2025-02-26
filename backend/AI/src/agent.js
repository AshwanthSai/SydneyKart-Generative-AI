import { runApprovalCheck, runLLM } from './llm.js'
import {
  addMessagesToDb,
  getMessagesFromDb,
  saveToolResponse,
} from './memory.js'
import { runTool } from './toolRunner.js'
import { generateImagesDefinition } from './tools/generateImages.js'
import { sendEmailDefinition } from './tools/sendEmail.js'
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

export let userId;

const setUserId = (id) => {
  userId = id?.toString();
  console.log(`user Id changed`, userId)
  return;
}


export const handleApprovalFlow = async ({ userMessage, socket}) => {
  // The UI Spinner on logging the name of the Tool during a Tool Call message by AI
  // Automatically console.logs an approval prompt.
  const history = await getMessagesFromDb(userId)
  const latestMessage = history.at(-1)
  const toolCall = latestMessage?.tool_calls?.[0] // Grab the tool call
  // We only need approval for generateImages tool
  if (!toolCall || toolCall.function.name != sendEmailDefinition.name) {
    return
  }
  // const loader = showLoader('Processing Approval')
  showLoader({status: "status", message : 'Processing Approval', socket})
  console.log(`User Message`,userMessage)
  // You are using a specific LLM to process approval. Yes or No -> Returns True or False
  const approval = await runApprovalCheck(userMessage)
  if (approval) {
    // loader.update(`Executing Tool, ${toolCall.function.name}`)
    showLoader({status: "status", message : `Executing Tool, ${toolCall.function.name}`, socket})
    const toolCallResult = await runTool(userMessage, toolCall)
    // loader.update(`Completed Tool Call, ${toolCall.function.name}`)
    showLoader({status: "status", message : `Completed Tool Call, ${toolCall.function.name}`, socket})
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
  // loader.stop()
  showLoader({status: "stop", socket})
  // Approval State, We have already added tool call result to DB
  // Does not need any user message to be added to db.
  return true
}


/* 
  RunAgent Entire Flow
    - Check if in Approval State -> 
      Find last message, check the name of the tool call,
        If anything else than Generate Images, Return
      Pass User Message to Approval Check LLM 
    - Add present user message to DB
    - Run LLM with entire context
    - Save Response to DB
      If content response, then return and exit while loop
      If tool call response
        If it is a Generate Image, Ask for Approval, Exit the function
          - On user message, Yes or No then function is triggered again.
        If tool call, 
          Run and save result to DB, Go to Top of While Loop
        Send Tool call result to LLM
        Expect Content Message and Exit Function
*/

export const runAgent = async ({ userMessage, tools, socket}) => {
  if(!userId || userId !== socket?.user?.id) {
    setUserId(socket?.user?.id)
  }
  // If in a Generate Image tool call state, we will send in a Yes or No as prompt to restart Chat
  const isApprovalState = await handleApprovalFlow({ userMessage, socket})
  console.log(`Here 2`)
  /* 
    If our present state is not a Generate Image Tool Call State, 
    Continue Normal Flow, Add user message to Context and runLLM 
  */
  if (!isApprovalState) {
    await addMessagesToDb({userId, messages:[{ role: 'user', content: userMessage }]})
  }

  // const loader = showLoader('Thinking...\n')
  showLoader({status: "status", message : "Thinking ...", socket})

  while (true) {
    // Add present user message to database.
    // Retrieve all messages from memory to pass as context
    const messages = await getMessagesFromDb(userId)
    const response = await runLLM(messages, tools, userId)
    //Save response to memory
    await addMessagesToDb({messages: [response], userId})

    
    if (response.content) {
      // loader.stop()
      showLoader({status: "stop", socket})
      logMessage({message: response, socket})
      return await getMessagesFromDb(userId)
      // process.exit(0)
    }

    if (response.tool_calls) {
      // loader.update(`executing: ${response.tool_calls[0].function.name}`)
      showLoader({status: "status", message : `executing: ${response.tool_calls[0].function.name}`, socket})
      // If response.tool call is generateImages, UI.js will
      // automatically prompt for an approval
      // logMessage(response)
      logMessage({message: response, socket})
      // If the tool call is generateImages, Go to top of While Loop
      // to handle the approval flow
      if (
        response.tool_calls[0].function.name === sendEmailDefinition.name
      ) {
        // loader.update(`Sending for Approval`)
        showLoader({status: "status", message : `Sending for Approval`, socket})
        // loader.stop()
        return getMessagesFromDb(userId)
      }
      // Run the first suggested tool
      const toolCallResult = await runTool(userMessage, response.tool_calls[0], socket)
      await saveToolResponse(userId, response, toolCallResult)
      // loader.update(`done: ${response.tool_calls[0].function.name}`)
      showLoader({status: "status", message : `done: ${response.tool_calls[0].function.name}`, socket})
    }
    // loader.stop()
    showLoader({status: "stop", socket})
  }
}
