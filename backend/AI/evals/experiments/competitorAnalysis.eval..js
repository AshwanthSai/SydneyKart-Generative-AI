import { tools as allTools } from '../../index.js'
import { runLLM } from '../../src/llm.js'
import { ToolCallMatch } from '../scorer.js'
import { runEval } from '../evalTools.js'
import { generateImages } from '../../src/tools/generateImages.js'
import { competitorAnalysis } from '../../src/tools/CompetitiveAnalysis.js'

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

runEval('Competitor Analysis', {
  task: (input) => runLLM([{ role: 'user', content: input }], allTools),
  data: [
    {
      input: 'Perform Competitor Analysis on CHARMOUNT Full Motion TV Wall Mount Swivel',
      expected: createToolCallMessage(competitorAnalysis),
    },
  ],
  scorers: [ToolCallMatch],
})
