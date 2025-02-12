import { priceComparisonFromInternet } from './../src/tools/priceComparison.js'
import { analyzeSales } from './tools/analyzeSales.js'
import { generateSalesChart } from './tools/generateImages.js'
import { productSearch } from './tools/productSearch.js'
import { getRedditPost } from './tools/reddit.js'

export const runTool = (userMessage, tool) => {
  let input = {
    userMessage,
    tool,
  }

  
  console.log("tool name is", tool.function.name)
  console.log("Argument")
  console.log(tool.function.arguments)

  switch (tool.function.name) {
    case 'priceComparisonFromInternet':
      return priceComparisonFromInternet(tool.function.arguments)
    case 'analyzeSales':
      // GPT rewrites your request as a descriptive prompt for your Tool Call Parameter.
      return analyzeSales(tool.function.arguments)
    case 'getRedditPost':
      return getRedditPost()
    case 'getRedditPost':
      return getRedditPost()
    case 'generateSalesChart':
      return generateSalesChart(tool.function.arguments)
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}
