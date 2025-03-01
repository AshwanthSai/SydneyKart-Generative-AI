  import { tools as allTools } from '../../index.js'
  import { runLLM } from '../../src/llm.js'
  import { ToolCallMatch } from '../scorer.js'
  import { runEval } from '../evalTools.js'
import sendEmail from '../../../utils/sendEmail.js'
  
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
  
  runEval('Send Email', {
    task: (input) => runLLM([{ role: 'user', content: input }], allTools),
    data: [
        {
            input: 'Send email to ashwanth.saie@gmail.com saying happy birthday as subject and a small poem within content.',
            expected: createToolCallMessage(sendEmail),
        },
    ],
    scorers: [ToolCallMatch],
  })
  