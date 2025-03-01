import { JSONFilePreset } from 'lowdb/node'
import { v4 as uuidv4 } from 'uuid'
import { summarizeMessage } from './llm.js'
import Chat from '../../models/chatMessages.js'


// Add meta data - from AI to DB
export const addMetaData = (message) => {
  return {
    ...message,
    // Schema has an ID requirement for every message
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
}

// Remove meta data - from DB to AI
export const removeMetaData = (message) => {
  /* 
    When passing messages as history 
    For content messages, the LLM is unhappy with
    an empty tool_calls array.
    For requests for tool calls from LLM
    It wants to see the tool_calls array.
  */

  let messageWithoutMetaData;
  if(message.role == "assistant" && message.content === "") {
    const { id, _id, createdAt, ...rest } = message
    messageWithoutMetaData = rest;
  } else {
    /* Tool call request from LLM */
    // (message.role == "assistant")
    const { id, _id, createdAt, tool_calls, ...rest } = message
    messageWithoutMetaData = rest;
  }
  return messageWithoutMetaData
}

// Aux database methods
/* 
  - Sending MongoDB arrays is a bad idea, since it contains a lot of metadata
*/
export const getDb = async (userId) => {
  try {
    // Get as plain JS object
    let db = await Chat.findOne({ user: userId }).lean();
    
    if(!db){
      // Create new document
      db = await Chat.create({
        user: userId,
        messages: [],
        summary: {
          role: 'assistant',
          content: 'Chat initialized',
          parsed: {
            created: new Date(),
            messageCount: 0
          }
        }
      });
      // Convert the newly created document to plain object
      db = db.toObject();
    }
    /* 
      Self Healing Mechanism
        - If DB is saved in a state, where the last call is a unfullfilled tool call
        - It will break the LLM Context
    */
    if(db?.messages?.at(-1)?.role === 'tool') {
      db.messages.pop()
    }
    return db;
  } catch (error) {
    console.error('Error in getDb:', error);
    throw error;
  }
}

// For saving, create a separate function
export const saveDb = async (userId, data) => {
  try {
    // Find and update the document
    /*  const updated = await Chat.findOneAndUpdate(
      { user: userId },
      data,
      { 
        new: true,        // Return updated document
        runValidators: true // Run schema validators
      }
    ); */
    const updated = await Chat.findOneAndUpdate(
      { user: userId },
      data,
      { 
        new: true,
        validateBeforeSave: false,  // Skip validation
        runValidators: false        // Skip update validators
      }
    );
    
    if (!updated) {
      throw new Error('Chat document not found');
    }
    
    return updated.toObject();
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
};


// Message will be of the form  [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hello' }]
// Output -> { role: 'user', content: 'Hello' } { role: 'user', content: 'Hello' }
// Messages we receive will not have any meta data
export const addMessagesToDb = async ({messages, userId}) => {
  const db = await getDb(userId)
  // We are supposed to spread messages, let me check
  // db.data.messages.push(...messages.map(addMetaData))

  // If content is null, replace the content field
  // i.e, it is a tool call response. Better to not save content as null in DB
  messages = messages.map(message => {
    // If content is null, set it to empty string
    if (message.content === null) {
      return {
        ...message,
        content: ''  // Empty string instead of null
      }
    }
    return removeMetaData(message)
  })

  db.messages.push(...messages.map(addMetaData))

  /* 
    - IF message length more than 10, summarize and add to db.summary field
  */
  /*   
  if (db?.data?.messages?.length >= 10) {
      const oldestMessages = db.data.messages.slice(0, 5).map(removeMetaData)
      const summary = await summarizeMessage(oldestMessages)
      db.data.summary = summary
    } 
  */
  if (db?.messages?.length >= 10) {
      const oldestMessages = db.messages.slice(0, 5).map(removeMetaData)
      const summary = await summarizeMessage(oldestMessages)
      db.summary = summary
      // db.data.summary = summary
      // db.markModified('summary.parsed');
    } 
  // await db.save();
  await saveDb(userId, db); 
}

export const getMessagesFromDb = async (userId) => {
  // const db = await getDb()
  const db = await getDb(userId)
  const messages = await db?.messages.map(removeMetaData)
  const lastFive = messages.slice(-5)

  /* 
    By Design the last message of DB will never be a plain tool call definition.
    You do not want to send a tool call definition, for summarization
    without the user prompt which triggered it.

    So if 1st message of last 5 is a tool call definition
    we need to go back and add one more to ensure that the context is complete
  */
  if (lastFive[0]?.role === 'tool') {
    const sixthMessage = messages[messages.length - 6]
    if (sixthMessage) {
      return [...[sixthMessage], ...lastFive]
    }
  }

  return lastFive
}

export const getSummaryFromDb = async (userId) => {
  // const db = await getDb()
  const db = await getDb(userId)
  return db?.summary
}

export const saveToolResponse = async (userId, response, result) => {
  return addMessagesToDb({userId, messages : [
    {
      role: 'tool',
      tool_call_id: response?.tool_calls?.[0]?.id || response,
      content: result.toString() || "",
    },
  ]})
}
