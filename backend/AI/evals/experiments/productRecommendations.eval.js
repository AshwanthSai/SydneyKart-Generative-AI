  import { tools as allTools } from '../../index.js'
  import { runLLM } from '../../src/llm.js'
  import { ToolCallMatch } from '../scorer.js'
  import { runEval } from '../evalTools.js'
import { productRecommendations } from '../../src/tools/productRecommendations.js'
  
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
  
  runEval('Product Recommendations', {
    task: (input) => runLLM([{ role: 'user', content: input }], allTools),
    data: [
        {
            input: 'Give me product recommendations forApple AirPods with Charging Case (Wired)',
            expected: createToolCallMessage(productRecommendations),
        },
    ],
    scorers: [ToolCallMatch],
  })
  