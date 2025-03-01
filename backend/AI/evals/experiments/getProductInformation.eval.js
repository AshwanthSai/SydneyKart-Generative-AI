import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { getProductInformation } from '../../src/tools/getProductInformation.js'
  
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
  
  runEval('Get Product Information', {
    task: (input) => runLLM([{ role: 'user', content: input }], allTools),
    data: [
        {
          input: 'Give me more information about CAN USB FD Adapter (GC-CAN-USB-FD)',
          expected: createToolCallMessage(getProductInformation),
        },
    ],
    scorers: [ToolCallMatch],
  })
  