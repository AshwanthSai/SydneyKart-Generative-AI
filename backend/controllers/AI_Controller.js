import FormData from 'form-data';
import https from 'https';

export class OpenAI {
  static createChatBody(body, stream) {
    const messages = []

    // Add the system prompt as the first message
    messages.push({
      role: 'system',
      content: `You are an AI Sales Agent for a company called The Sydney Kart. Provide clear and concise answers to customer queries.`
    })

    // Append the user and assistant messages
    messages.push(
      ...body.messages.map((message) => {
        return {
          role: message.role === 'ai' ? 'assistant' : message.role,
          content: message.text,
        }
      })
    )

    const chatBody = {
      messages,
      model: body.model,
    }
    if (stream) chatBody.stream = true
    return chatBody
  }

  static async chat(body, res, next) {
    console.log(`${process.env.OPENAI_API_KEY}`)
    const chatBody = OpenAI.createChatBody(body)
    const req = https.request(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
      },
      (reqResp) => {
        let data = ''
        reqResp.on('error', next)
        reqResp.on('data', (chunk) => {
          data += chunk
        })
        reqResp.on('end', () => {
          const result = JSON.parse(data)
          if (result.error) {
            next(result.error)
          } else {
            res.json({ text: result.choices[0].message.content })
          }
        })
      }
    )
    req.on('error', next)
    req.write(JSON.stringify(chatBody))
    req.end()
  }

  static async chatStream(body, res, next) {
    const chatBody = OpenAI.createChatBody(body, true)
    const req = https.request(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
      },
      (streamResp) => {
        streamResp.on('error', next)
        streamResp.on('data', (chunk) => {
          try {
            if (chunk?.toString().match(/^\{\n\s+\"error\"\:/)) {
              console.error('Error in the retrieved stream chunk:')
              return next(JSON.parse(chunk?.toString()).error)
            }
            const lines = chunk?.toString()?.split('\n') || []
            const filtredLines = lines.filter((line) => line.trim())
            filtredLines.forEach((line) => {
              const data = line
                .toString()
                .replace('data:', '')
                .replace('[DONE]', '')
                .replace('data: [DONE]', '')
                .trim()
              if (data) {
                try {
                  const result = JSON.parse(data)
                  if (result.choices[0].delta?.content) {
                    res.write(
                      `data: ${JSON.stringify({
                        text: result.choices[0].delta.content,
                      })}\n\n`
                    )
                  }
                } catch (e) {}
              }
            })
          } catch (error) {
            console.error('Error when retrieving a stream chunk')
            return next(error)
          }
        })
        streamResp.on('end', () => {
          res.end()
        })
        streamResp.on('abort', () => {
          res.end()
        })
      }
    )
    req.on('error', next)
    req.write(JSON.stringify(chatBody))
    req.end()
  }

  static async imageVariation(req, res, next) {
    const formData = new FormData()
    if (req.files?.[0]) {
      const imageFile = req.files[0]
      formData.append('image', imageFile.buffer, imageFile.originalname)
    }
    const formReq = https.request(
      'https://api.openai.com/v1/images/variations',
      {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
      },
      (reqResp) => {
        let data = ''
        reqResp.on('error', next)
        reqResp.on('data', (chunk) => {
          data += chunk
        })
        reqResp.on('end', () => {
          const result = JSON.parse(data)
          if (result.error) {
            next(result.error)
          } else {
            res.json({ files: [{ type: 'image', src: result.data[0].url }] })
          }
        })
      }
    )
    formReq.on('error', next)
    formData.pipe(formReq)
    formReq.end()
  }
}

