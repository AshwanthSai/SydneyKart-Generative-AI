import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { createSupportTicket } from '../../src/tools/createSupportTicket.js'

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

runEval('Create Support Ticket', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Create a supportTicket, asking for Refund of order ID5151+15 for product CAN USB FD Adapter (GC-CAN-USB-FD), Mention immediate response',
      expected: createToolCallMessage(createSupportTicket),
    },
  ],
  scorers: [ToolCallMatch],
})
