import { priceComparisonFromInternet } from './../src/tools/priceComparison.js'
import { generateImages } from './tools/generateImages.js'
import { productSearch } from './tools/productSearch.js'
import { getRedditPost } from './tools/reddit.js'

export const runTool = (userMessage, tool) => {
  let input = {
    userMessage,
    tool,
  }

  console.log("tool name is", tool.function.name)

  switch (tool.function.name) {
    case 'priceComparisonFromInternet':
      return priceComparisonFromInternet(tool.function.arguments)
    case 'generateImages':
      // GPT rewrites your request as a descriptive prompt for your Tool Call Parameter.
      return generateImages(tool.function.arguments)
    case 'getRedditPost':
      return getRedditPost()
    case 'productSearch':
      return productSearch(userMessage)
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}
