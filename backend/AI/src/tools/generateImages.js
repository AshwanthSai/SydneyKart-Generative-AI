import 'dotenv/config'
import OpenAI from 'openai'
const openai = new OpenAI()

export const generateImagesDefinition = {
  name: 'generateImages',
  description: 'Use to generate any image from a prompt',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'A description of the image to be generated',
      },
    },
    required: ['prompt'],
  },
}

export const generateImages = async (prompt) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
  })
  return response.data[0].url
}
