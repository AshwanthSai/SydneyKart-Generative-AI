import { runAgent } from './src/agent.js'
import { priceComparisonDefinition } from './src/tools/priceComparison.js'
import { generateImagesDefinition } from './src/tools/generateImages.js'
import { redditToolDefinition } from './src/tools/reddit.js'
import { connectDatabase } from "../config/dbConnect.js";
import dotenv from "dotenv";
import { productSearchDefinition } from './src/tools/productSearch.js';
import { analyzeSalesDefinition } from './src/tools/analyzeSales.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

// Connecting to database
await connectDatabase();

const userMessage = process.argv[2]
/* 
- Adding our present prompt to memory(db)
- Remember, all that the model is doing, is extrapolating 
  text from the last sentence, which is our prompt 
*/

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

export const tools = [
  {
    type: 'function',
    function: priceComparisonDefinition,
  },
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
    function: productSearchDefinition,
  },
]

const response = await runAgent({
  userMessage,
  tools,
})
