import { runAgent } from './src/agent.js'
import { generateImagesDefinition } from './src/tools/generateImages.js'
import { redditToolDefinition } from './src/tools/reddit.js'
import { connectDatabase } from "../config/dbConnect.js";
import dotenv from "dotenv";
import { productRecommendationsDefinition } from './src/tools/productRecommendations.js';
import { analyzeSalesDefinition } from './src/tools/analyzeSales.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllProductsDefinition } from './src/tools/getAllProducts.js';
import { customerSentimentAnalysisDefinition } from './src/tools/customerSentimentAnalysis.js';
import { competitorAnalysisDefinition } from './src/tools/CompetitiveAnalysis.js';
import { marketSegmentationDefinition } from './src/tools/customerSegmentation.js';
import { getProductInformationDefinition } from './src/tools/getProductInformation.js';
import { getUserAndOrderInformationDefinition } from './src/tools/getUserAndOrderInformation.js';
import { sendEmailDefinition } from './src/tools/sendEmail.js';
import { inventoryManagementDefinition } from './src/tools/inventoryManagement.js';
import { churnAnalysisDefinition } from './src/tools/churnUserAnalysis.js';
import { logMessage, showLoader } from './src/ui.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

// Connecting to database
await connectDatabase();


export const tools = [
  {
    type: 'function',
    function: analyzeSalesDefinition,
  },
  {
    type: 'function',
    function: redditToolDefinition,
  },
  {
    type: 'function',
    function: generateImagesDefinition,
  },
  {
    type: 'function',
    function: productRecommendationsDefinition,
  },
  {
    type: 'function',
    function: getAllProductsDefinition,
  },
  {
    type: 'function',
    function: customerSentimentAnalysisDefinition,
  },
  {
    type: 'function',
    function: competitorAnalysisDefinition,
  },
  {
    type: 'function',
    function: marketSegmentationDefinition,
  },
  {
    type: 'function',
    function: getProductInformationDefinition,
  },
  {
    type: 'function',
    function: getUserAndOrderInformationDefinition,
  },
  {
    type: 'function',
    function: sendEmailDefinition,
  },
  {
    type: 'function',
    function: inventoryManagementDefinition,
  },
  {
    type: 'function',
    function: churnAnalysisDefinition,
  }
]

export const invokeAI =  async(userMessage, socket) => {
  console.log(`Here 0`)
  const response = await runAgent({
    userMessage,
    tools,
    socket
  })
  return response
}