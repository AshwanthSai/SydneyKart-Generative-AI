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
  
  switch (tool.function.name) {
    case 'priceComparisonFromInternet':
      return priceComparisonFromInternet(tool.function.arguments, socket)
    case 'analyzeSales':
      // GPT rewrites your request as a descriptive prompt for your Tool Call Parameter.
      return analyzeSales(tool.function.arguments, socket)
    case 'getRedditPost':
      return getRedditPost(tool.function.arguments, socket)
    case 'generateSalesChart':
      return generateSalesChart(tool.function.arguments, socket)
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}
