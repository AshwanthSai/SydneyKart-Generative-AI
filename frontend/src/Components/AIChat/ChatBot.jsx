import { useEffect, useRef, useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, StatusList, Status, InputToolbox, AttachmentButton, SendButton, Avatar } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { io } from "socket.io-client";


const ChatBot = () => {
    const socketURL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_BACKEND_URL : process.env.REACT_APP_DEV_BACKEND_URL;
    // useRef does no re-render on value change + updates synchronously 
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    // To add present message to input message list
    const [inputMessage, setInputMessage] = useState("");
    // To show Typing Indicator
    const [isTyping, setIsTyping] = useState(false);
    const [isTypingContent, setIsTypingContent] = useState("Sai is typing...");
    const [messages, setMessages] = useState([]);
    // For preventing render of Intro Message for 3 seconds
    const [showGreeting, setShowGreeting] = useState(false);
    const [initialTyping, setInitialTyping] = useState(true);
    const [isMinimized, setIsMinimized] = useState(true);
    
    useEffect(() => {
      /* Only show intro after 2 seconds */
      setTimeout(() => {
        setInitialTyping(false);
        setShowGreeting(true);
      }, 3000);

      // Connect Socket on Component Load
      socketRef.current = io((socketURL), {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });
      
      // Current.on is basically an event listener
      socketRef.current.on('message', (message) => {
          setIsTyping(false);
          setIsTypingContent("")
          // Add received message to primary list
          setMessages(prev => [...prev, {
            message: message,
            sentTime: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }),
            sender: "Sai",
            direction: "incoming"
          }]);
      });

      socketRef.current.on('status', (message) => {
          // Show Typing Indicator
          setIsTyping(true);
          setIsTypingContent(message);
      });

      socketRef.current.on('stop', (message) => {
        // Show Typing Indicator
        setIsTyping(false);
        setIsTypingContent("");
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from socket server');
      });
  
      // Cleanup on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }, []);
  
    useEffect(() => {
       console.log(isTyping)
       console.log(isTypingContent)
    }, [isTyping,isTypingContent])

    const handleSend = (innerHtml, textContent, innerText, nodes) => {
      if (socketRef.current) {
        // Add user message to chat
        setMessages(prev => [...prev, {
          message: textContent,
          sentTime: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          sender: "User",
          direction: "outgoing"
        }]);
        
        // Send to socket
        socketRef.current.emit('message', textContent);
      }
      setInputMessage('');
    };



  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleChange = (innerHtml, textContent, innerText, nodes) => {
    setInputMessage(textContent);
  };


  return (
    <div className={`chatWrapper ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header" onClick={toggleMinimize}>
        <h5>Sai - AI Assistant </h5>
          {isMinimized ? 
            (
              <Avatar
                name="Sai"
                size="md"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                status="eager"
              />
            ) : (
              <Avatar
                name="Sai"
                size="md"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                status="available"
              />
            )
          }
      </div>
      <div className="chat-content">
          <MainContainer>
            <ChatContainer>
              <MessageList>
              {initialTyping && <TypingIndicator content={isTypingContent} />}
                {showGreeting && (
                    <Message
                        model={{
                            message: 'Hi, I am Sai, your personal assistant, how can I be of service?',
                            sender: 'Sai',
                            sentTime: 'just now'
                        }}
                    />
                )}
                {messages.map((msg, index) => (
                  <Message 
                    key={index}
                    model={msg}
                  />
                ))}
              {isTyping && <TypingIndicator content={isTypingContent}/>}
              </MessageList>
              <MessageInput 
                placeholder="Type a message..."
                onChange={handleChange}
                onSend={handleSend}
                value={inputMessage}
                attachButton={false}
                autoFocus={true} 
              />
            </ChatContainer>
          </MainContainer>
        </div>
    </div>
  );
};

export default ChatBot;