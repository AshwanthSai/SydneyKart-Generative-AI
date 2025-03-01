import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { createSupportTicket } from '../../src/tools/createSupportTicket.js'
import { customerSentimentAnalysis } from '../../src/tools/customerSentimentAnalysis.js'
import { competitorAnalysis } from '../../src/tools/CompetitiveAnalysis.js'
import { marketSegmentation } from '../../src/tools/customerSegmentation.js'
import { getProductInformation } from '../../src/tools/getProductInformation.js'
import { getUserAndOrderInformation } from '../../src/tools/getUserAndOrderInformation.js'
import { checkInventory } from '../../src/tools/inventoryManagement.js'
import sendEmail from '../../../utils/sendEmail.js'
import { productRecommendations } from '../../src/tools/productRecommendations.js'
import { churnAnalysis } from '../../src/tools/churnUserAnalysis.js'


const createToolCallMessage = (toolName) => {
  return {
    role: 'assistant',
    content: null,
    tool_calls: [
      {
        type: 'function',
        function: {
          name: toolName.name,
        },
      },
    ],
  }
}

runEval('Integration Tests', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Create a supportTicket, asking for Refund of order ID5151+15 for product CAN USB FD Adapter (GC-CAN-USB-FD), Mention immediate response',
      expected: createToolCallMessage(createSupportTicket),
    },
    {
      input: 'Perform Sentiment Analysis on CAN USB FD Adapter (GC-CAN-USB-FD)',
      expected: createToolCallMessage(customerSentimentAnalysis),
    },
    {
      input: 'Perform Competitor Analysis on CHARMOUNT Full Motion TV Wall Mount Swivel',
      expected: createToolCallMessage(competitorAnalysis),
    },
    {
      input: 'Perform Overall Market Segmentation on our Customer Base',
      expected: createToolCallMessage(marketSegmentation),
    },
    {
      input: 'Give me more information about CAN USB FD Adapter (GC-CAN-USB-FD)',
      expected: createToolCallMessage(getProductInformation),
    },
    {
      input: 'Get use purchase history and order details for user with email ashwanth.saie@gmail.com',
      expected: createToolCallMessage(getUserAndOrderInformation),
    },
    {
      input: 'Perform Inventory Management on all our products, right now',
      expected: createToolCallMessage(checkInventory),
    },
    {
      input: 'Send email to ashwanth.saie@gmail.com saying happy birthday as subject and a small poem within content.',
      expected: createToolCallMessage(sendEmail),
    },
    {
      input: 'Give me product recommendations forApple AirPods with Charging Case (Wired)',
      expected: createToolCallMessage(productRecommendations),
    },
    {
      input: 'Perform Churn Analysis on our Customer Base for the last 6 months',
      expected: createToolCallMessage(churnAnalysis),
    },
  ],
  scorers: [ToolCallMatch],
})
