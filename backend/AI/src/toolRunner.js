import { analyzeSales } from './tools/analyzeSales.js'
import { churnAnalysis } from './tools/churnUserAnalysis.js'
import { competitorAnalysis } from './tools/CompetitiveAnalysis.js'
import { createSupportTicket } from './tools/createSupportTicket.js'
import { marketSegmentation } from './tools/customerSegmentation.js'
import { customerSentimentAnalysis } from './tools/customerSentimentAnalysis.js'
import { generateSalesChart } from './tools/generateImages.js'
import { getAllProducts } from './tools/getAllProducts.js'
import { getProductInformation } from './tools/getProductInformation.js'
import { getUserAndOrderInformation } from './tools/getUserAndOrderInformation.js'
import { checkInventory } from './tools/inventoryManagement.js'
import { productRecommendations } from './tools/productRecommendations.js'
import { getRedditPost } from './tools/reddit.js'
import { sendEmail } from './tools/sendEmail.js'
import { showLoader } from './ui.js'


export const runTool = (userMessage, tool, socket) => {
  showLoader({status: "status", message : 'Thinking..', socket})
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
/*     case 'getRedditPost':
      return getRedditPost(tool.function.arguments, socket) */
/*     case 'generateSalesChart':
      return generateSalesChart(tool.function.arguments, socket) */
    case 'getAllProducts':
      return getAllProducts(tool.function.arguments, socket)
    case 'createSupportTicket':
      return createSupportTicket(tool.function.arguments, socket)
    case 'customerSentimentAnalysis':
      return customerSentimentAnalysis(tool.function.arguments, socket)
    case 'competitorAnalysis':
      return competitorAnalysis(tool.function.arguments, socket)
    case 'marketSegmentation':
      return marketSegmentation(tool.function.arguments, socket)
    case 'getProductInformation':
      return getProductInformation(tool.function.arguments, socket)
    case 'getUserAndOrderInformation':
      return getUserAndOrderInformation(tool.function.arguments, socket)
    case 'checkInventory':
      return checkInventory(tool.function.arguments, socket)
    case 'sendEmail':
      return sendEmail(tool.function.arguments, socket)
    case 'productRecommendations':
      return productRecommendations(tool.function.arguments, socket)
    case 'churnAnalysis':
      return churnAnalysis(tool.function.arguments, socket)
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}