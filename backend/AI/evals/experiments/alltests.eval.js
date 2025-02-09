import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { getDadJokes } from '../../src/tools/dadJokes.js'
import { getRedditPost } from '../../src/tools/reddit.js'
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

runEval('Integration Tests', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Tell me a dad joke',
      expected: createToolCallMessage(getDadJokes),
    },
    {
      input: 'Show me the last 5 posts from Reddit',
      expected: createToolCallMessage(getRedditPost),
    },
    {
      input: 'Generate the image of a monk in a monastery',
      expected: createToolCallMessage(generateImages),
    },
  ],
  scorers: [ToolCallMatch],
})
