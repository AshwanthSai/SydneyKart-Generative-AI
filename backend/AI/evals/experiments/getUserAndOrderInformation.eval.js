  import { tools as allTools } from '../../index.js'
  import { runLLM } from '../../src/llm.js'
  import { ToolCallMatch } from '../scorer.js'
  import { runEval } from '../evalTools.js'
import { getUserAndOrderInformation } from '../../src/tools/getUserAndOrderInformation.js'
  
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
  
  runEval('Get User And Order Information', {
    task: (input) => runLLM([{ role: 'user', content: input }], allTools),
    data: [
      {
        input: 'Get use purchase history and order details for user with email ashwanth.saie@gmail.com',
        expected: createToolCallMessage(getUserAndOrderInformation),
      },
    ],
    scorers: [ToolCallMatch],
  })
  