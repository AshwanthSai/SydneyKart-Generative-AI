import { priceComparisonFromInternet } from './../src/tools/priceComparison.js'
import { analyzeSales } from './tools/analyzeSales.js'
import { generateSalesChart } from './tools/generateImages.js'
import { productSearch } from './tools/productSearch.js'
import { getRedditPost } from './tools/reddit.js'

export const runTool = (userMessage, tool, socket) => {
  let input = {
    userMessage,
    tool,
  }
  
  //* Start from here
  switch (tool.function.name) {
    case 'priceComparisonFromInternet':
      //* Need to fix
      return priceComparisonFromInternet({tools : tool.function.arguments, socket})
    case 'analyzeSales':
      // GPT rewrites your request as a descriptive prompt for your Tool Call Parameter.
      return analyzeSales({tools : tool.function.arguments, socket})
    case 'getRedditPost':
      return getRedditPost({tools : tool.function.arguments, socket})
    case 'generateSalesChart':
      return generateSalesChart({tools : tool.function.arguments, socket})
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}
