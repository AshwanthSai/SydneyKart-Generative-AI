import 'dotenv/config'
import { queryVectorDB } from '../rag/query.js'

export const movieSearchDefinition = {
  name: 'movieSearch',
  description: 'Use to get information about movies, directors and actors.',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'Description or features of the Movie, Director or Actor.',
      },
    },
    required: ['prompt'],
  },
}

export const movieSearch = async (prompt) => {
  console.log(`Here`)
  let results
  try {
    results = await queryVectorDB(prompt)
  } catch (e) {
    console.error(e)
    return 'Error: Could not query the db to get movies.'
  }

  const formattedResults = results.map((result) => {
    const { metadata, data } = result
    return { ...metadata, description: data }
  })

  return JSON.stringify(formattedResults, null, 2)
}
