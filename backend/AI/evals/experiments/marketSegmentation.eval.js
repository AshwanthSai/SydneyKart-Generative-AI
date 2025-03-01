  import { tools as allTools } from '../../index.js'
  import { runLLM } from '../../src/llm.js'
  import { ToolCallMatch } from '../scorer.js'
  import { runEval } from '../evalTools.js'
import { marketSegmentation } from '../../src/tools/customerSegmentation.js'
  
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
  
  runEval('Market Segmentation', {
    task: (input) => runLLM([{ role: 'user', content: input }], allTools),
    data: [
      {
        input: 'Perform Overall Market Segmentation on our Customer Base',
        expected: createToolCallMessage(marketSegmentation),
      },
    ],
    scorers: [ToolCallMatch],
  })
  