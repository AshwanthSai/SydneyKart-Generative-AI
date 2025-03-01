import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { customerSentimentAnalysis } from '../../src/tools/customerSentimentAnalysis.js'

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

runEval('Customer Sentiment Analysis', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
        input: 'Perform Sentiment Analysis on CAN USB FD Adapter (GC-CAN-USB-FD)',
        expected: createToolCallMessage(customerSentimentAnalysis),
    },
  ],
  scorers: [ToolCallMatch],
})
