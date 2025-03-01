  import { tools as allTools } from '../../index.js'
  import { runLLM } from '../../src/llm.js'
  import { ToolCallMatch } from '../scorer.js'
  import { runEval } from '../evalTools.js'
import { checkInventory } from '../../src/tools/inventoryManagement.js'
  
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
  
  runEval('Check Inventory', {
    task: (input) => runLLM([{ role: 'user', content: input }], allTools),
    data: [
        {
          input: 'Perform Inventory Management on all our products, right now',
          expected: createToolCallMessage(checkInventory),
        },
    ],
    scorers: [ToolCallMatch],
  })
  