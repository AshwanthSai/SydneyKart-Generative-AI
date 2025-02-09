import { JSONFilePreset } from 'lowdb/node'
import { v4 as uuidv4 } from 'uuid'
import { summarizeMessage } from './llm.js'
import Chat from '../../models/chatMessages.js'


// Add meta data - from AI to DB
export const addMetaData = (message) => {
  return {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
}

// Remove meta data - from DB to AI
export const removeMetaData = (message) => {
  const { id, createdAt, ...messageWithoutMetaData } = message
  return messageWithoutMetaData
}

// Aux database methods
export const getDb = async (userId) => {
  console.log(`Get DB entered`)
  // const defaultData = { messages: [] }
  // const db = await JSONFilePreset('db.json', defaultData)
  let db = await Chat.findOne({ user: userId });
  if(!db){
    db = await Chat.create({
      user: userId,  // Note: it's 'user' not 'userId' according to schema
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
    console.log("New chat created for user");
  }
  console.log("db", db)
  return db
}

// Message will be of the form  [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hello' }]
// Output -> { role: 'user', content: 'Hello' } { role: 'user', content: 'Hello' }
// Messages we receive will not have any meta data
export const addMessagesToDb = async ({messages, userId}) => {
  console.log({messages, userId})
  const db = await getDb(userId)
  // We are supposed to spread messages, let me check
  // db.data.messages.push(...messages.map(addMetaData))
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
      db.data.summary = summary
      db.markModified('summary.parsed');
    } 
  await db.save(); 
}

export const getMessagesFromDb = async (userId) => {
  console.log("Get messages from DB entered")
  // const db = await getDb()
  const db = await getDb(userId)
  const messages = db?.messages.map(removeMetaData)
  console.log(userId)
  console.log(db)
  console.log(messages)
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

export const saveToolResponse = async (response, result) => {
  return addMessagesToDb([
    {
      role: 'tool',
      tool_call_id: response?.tool_calls?.[0]?.id || response,
      content: result.toString(),
    },
  ])
}
