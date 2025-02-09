import { getDadJokes } from './../src/tools/dadJokes.js'
import { generateImages } from './tools/generateImages.js'
import { getRedditPost } from './tools/reddit.js'
import { movieSearch } from './tools/movieSearch.js'

export const runTool = (userMessage, tool) => {
  let input = {
    userMessage,
    tool,
  }

  switch (tool.function.name) {
    case 'getDadJokes':
      return getDadJokes()
    case 'generateImages':
      // GPT rewrites your request as a descriptive prompt for your Tool Call Parameter.
      return generateImages(tool.function.arguments)
    case 'getRedditPost':
      return getRedditPost()
    case 'movieSearch':
      return movieSearch(userMessage)
    default:
      throw new Error(`Tool not found ${tool.function.type}`)
  }
}
