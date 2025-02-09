import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { generateImages } from '../../src/tools/generateImages.js'

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

runEval('Generate Image', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Generate the image of a monk in a monastery',
      expected: createToolCallMessage(generateImages),
    },
  ],
  scorers: [ToolCallMatch],
})
