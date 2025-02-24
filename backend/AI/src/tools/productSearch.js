import 'dotenv/config'
import { queryVectorDB } from '../rag/query.js'

export const productSearchDefinition = {
  name: 'productSearch',
  description: 'Search for products in the vector database and get detailed information',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'Search query for products (e.g., "gaming laptop", "wireless headphones", "4K monitor")',
        examples: [
          "Show me gaming laptops under $1000",
          "Find wireless headphones with noise cancellation",
          "Search for 4K monitors with HDR"
        ]
      }
    },
    required: ['prompt']
  }
};


export const productSearch = async (prompt) => {
  let results
  try {
    results = await queryVectorDB(prompt)
  } catch (e) {
    console.error(e)
    return 'Error: Could not query the db to get products.'
  }

  const formattedResults = results.map((result) => {
    const { metadata, data } = result
    return { ...metadata, description: data }
  })

  console.log(formattedResults)
  return JSON.stringify(formattedResults, null, 2)
}
