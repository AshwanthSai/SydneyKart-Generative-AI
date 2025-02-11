import React, { useState, useEffect } from 'react'
import { DeepChat } from 'deep-chat-react'

export const ChatBot = () => {
  const [mounted, setMounted] = useState(false)
  const [minimized, setMinimized] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMinimize = () => {
    setMinimized((prev) => !prev)
  }

  return (
    <div className={`chat-container ${minimized ? 'minimized' : ''}`}>
      <div className='chat-header'>
        <span>Sai - AI Assistant </span>
        <p onClick={toggleMinimize}>
          {minimized ? 'Maximize' : 'Minimize'}
        </p>
      </div>
      <div className='chat-content'>
        {mounted && (
          <DeepChat
            avatars='true'
            style={{ width: '100%', height: '100%' }}
            introMessage={{
              text: 'Hi, I am Sai, your AI Powered Support Assistant. How can I be of service?',
            }}
            connect={{
              url: `${process.env.REACT_APP_BACKEND_URL}/openai-chat-stream`,
              stream: true,
              additionalBodyProps: { model: 'gpt-3.5-turbo' },
            }}
            requestBodyLimits={{ maxMessages: -1 }}
            errorMessages={{ displayServiceErrorMessages: true }}
          />
        )}
      </div>
    </div>
  )
}
