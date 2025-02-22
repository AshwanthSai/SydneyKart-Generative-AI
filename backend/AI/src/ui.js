import { generateImagesDefinition } from './tools/generateImages.js'

export const showLoader = ({status, message, socket}) => {
 /*  const spinner = ora({
    text,
    color: 'cyan',
  }).start() */

  /* return {
    stop: () => spinner.stop(),
    succeed: () => spinner.succeed(text),
    fail: () => spinner.fail(text),
    update: () => (spinner.text = text),
  } */
    socket.emit(status, message)
}

export const logMessage = ({message, socket}) => {
  /*   const roleColors = { 
      user: '\x1b[36m', // cyan
      assistant: '\x1b[32m', // green
    }
  */
  // Useful for segregation within front end
  const status = "message"
  // const reset = '\x1b[0m'
  const role = message.role
  // const color = roleColors[role] || '\x1b[37m' 
  // default to white || '\x1b[37m' // default to white

  // Don't log tool messages
  if (role === 'tool') {
    return
  }

  // Log user messages (only have content)
  if (role === 'user') {
    /* console.log(`\n${color}[USER]${reset}`)
    console.log(`${message.content}\n`) */
    // socket.emit(status, "[USER]")
    socket.emit(status, message.content)
    return
  }

  // Log assistant messages
  if (role === 'assistant') {
    // If has tool_calls, log function name and ask for approval if calendar
    if ('tool_calls' in message && message.tool_calls) {
      message.tool_calls.forEach((tool) => {
        // console.log(`\n${color}[ASSISTANT]${reset}`)
        // console.log(`${tool.function.name}\n`)
        // socket.emit(status, "[ASSISTANT]")
        socket.emit(status, `Tool Calling : ${tool.function.name}\n`)

        if (tool.function.name === generateImagesDefinition.name) {
          // console.log('\nDo you approve generating an image? (yes/no)\n')
          socket.emit(status, '\nDo you approve generating an image? (yes/no)\n')
          // process.exit(0)
        }
      })
      return
    }

    // If has content, log it
    if (message.content) {
      // console.log(`\n${color}[ASSISTANT]${reset}`)
      // console.log(`${message.content}\n`)
      // socket.emit(status, "[ASSISTANT]")
      socket.emit(status, `${message.content}\n`)
    }
  }
}


const formatMessage = (message) => {
 return  {
  name: "First incoming with avatar",
    args: {
      model: {
        message: message,
        sentTime: "just now",
        sender: "Joe",
        direction: "incoming",
        position: "first"
      },
      children: `<Avatar
                name="Sai"
                size="md"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                status="available"
              />`
    }
  }
}