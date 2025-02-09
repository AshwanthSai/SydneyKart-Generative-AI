import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { getDadJokes } from '../../src/tools/dadJokes.js'

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

runEval('Dad Joke', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Tell me a dad joke',
      expected: createToolCallMessage(getDadJokes),
    },
  ],
  scorers: [ToolCallMatch],
})
