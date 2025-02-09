import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { getRedditPost, redditToolDefinition } from '../../src/tools/reddit.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'

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

runEval('Reddit', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Show me the last 5 posts from Reddit',
      expected: createToolCallMessage(getRedditPost),
    },
  ],
  scorers: [ToolCallMatch],
})
