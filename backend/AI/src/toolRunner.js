import { analyzeSales } from './tools/analyzeSales.js'
import { competitorAnalysis } from './tools/CompetitiveAnalysis.js'
import { marketSegmentation } from './tools/customerSegmentation.js'
import { customerSentimentAnalysis } from './tools/customerSentimentAnalysis.js'
import { generateSalesChart } from './tools/generateImages.js'
import { getProductInformation } from './tools/getProductInformation.js'
import { getUserAndOrderInformation } from './tools/getUserAndOrderInformation.js'
import { productSearch } from './tools/productSearch.js'
import { getRedditPost } from './tools/reddit.js'
import { sendEmail } from './tools/sendEmail.js'

export const runTool = (userMessage, tool, socket) => {
  let input = {
    userMessage,
    tool,
  }
  
  switch (tool.function.name) {
    /* case 'priceComparisonFromInternet':
      return priceComparisonFromInternet(tool.function.arguments, socket) */
    case 'analyzeSales':
      // GPT rewrites your request as a descriptive prompt for your Tool Call Parameter.
      return analyzeSales(tool.function.arguments, socket)
    case 'getRedditPost':
      return getRedditPost(tool.function.arguments, socket)
    case 'generateSalesChart':
      return generateSalesChart(tool.function.arguments, socket)
    case 'getAllProducts':
      return getAllProducts(tool.function.arguments, socket)
    case 'customerSentimentAnalysis':
      return customerSentimentAnalysis(tool.function.arguments, socket)
    case 'competitorAnalysis':
      return competitorAnalysis(tool.function.arguments, socket)
    case 'marketSegmentation':
      return marketSegmentation(tool.function.arguments, socket)
    case 'productSearch':
      return productSearch(tool.function.arguments, socket)
    case 'getProductInformation':
      return getProductInformation(tool.function.arguments, socket)
    case 'getUserAndOrderInformation':
      return getUserAndOrderInformation(tool.function.arguments, socket)
    case 'sendEmail':
      return sendEmail(tool.function.arguments, socket)
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}
