import { openai } from './ai.js'
import { getMessagesFromDb, getSummaryFromDb } from './memory.js'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { systemPrompt } from './systemPrompt.js'

/* 
  - Remember the summarization flow
  - For each conversion you add to memory, it checks if limit has reached
    On reaching limit, it summarizes the conversation and adds to DB
    Eliminates the first few conversations

    Each run of LLM, we check for a summary, if not present we do not add it. 
*/

var userId = '67a86ba37b3eedd85094120e'

export const runLLM = async (messages, tools) => {
  const summary = await getSummaryFromDb(userId)
  const response = await openai.chat.completions.create({
    // Prefer using 4o-mini
    model: 'gpt-4o-mini',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: `${
          systemPrompt || defaultSystemPrompt
        }. Conversation summary so far: ${summary.content}`,
      },
      ...messages,
    ],
    tools,
    // Choose the appropriate tool for the job from the entire pool.
    tool_choice: 'auto', // You could narrow the selection for pool call here.
    parallel_tool_calls: false,
  })
  /* 
    If it is a tool call response, the response will not have content
  */
  return response.choices[0].message
}

/*  
  For Structured Output, We will need to specify the JSON Schema.
  There is a hack where you make a function and get the LLM to initiate a tool call.
  It will then return the tool name and structure the parameters with the correct data
  Which we can retrieve.
*/
export const runApprovalCheck = async (userMessage) => {
  const result = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: zodResponseFormat(
      z.object({
        approved: z
          .boolean()
          .describe('did the user approve the action or not'),
      }),
      'approval'
    ),
    messages: [
      {
        role: 'system',
        content: `Determine if the user approved the image generation. If you are not sure, then it is not approved.`,
      },
      { role: 'user', content: userMessage },
    ],
  })
  // For structured output, the field from which we extract is
  return result.choices[0].message.parsed?.approved
}

export const summarizeMessage = async (lastSixMessages) => {
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `Summarize the key points of the conversation in a concise way that would be helpful as context for future interactions. Make it like a play by play of the conversation.`,
      },
      ...lastSixMessages,
    ],
  })

  return response.choices[0].message || ''
}
