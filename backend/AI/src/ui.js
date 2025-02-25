import { generateImagesDefinition } from './tools/generateImages.js'

export const showLoader = ({status, message, socket}) => {
    socket.emit(status, message)
}

export const logMessage = ({message, socket}) => {
  // Useful for segregation within front end
  const status = "message"
  const role = message.role

  // Don't log tool messages
  if (role === 'tool') {
    return
  }

  // Log user messages (only have content)
  if (role === 'user') {
    socket.emit(status, message.content)
    return
  }

  // Adhoc messages send by functions.
  if(message.role == undefined){
    socket.emit(status, message)
    return
  }

  // Log assistant messages
  if (role === 'assistant') {
    // If has tool_calls, log function name and ask for approval if calendar
    if ('tool_calls' in message && message.tool_calls) {
      message.tool_calls.forEach((tool) => {
        socket.emit(status, `Tool Calling : ${tool.function.name}\n`)

        if (tool.function.name === generateImagesDefinition.name) {
          socket.emit(status, '\nDo you approve generating an image? (yes/no)\n')
        }
      })
      return
    }

    // If has content, log it
    if (message.content) {
      socket.emit(status, `${message.content}\n`)
    }
  }
}
