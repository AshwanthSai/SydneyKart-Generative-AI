import { useEffect, useRef, useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, StatusList, Status, InputToolbox, AttachmentButton, SendButton, Avatar, Button } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { io } from "socket.io-client";
import { getBaseUrl } from '../../utils/helper';
import { useSelector } from 'react-redux';


const ChatBot = () => {
    const socketURL = getBaseUrl();
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };
    const credentials = useSelector(state => state.auth.user);
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
      
      // On credential change or socketURL change, reconnect socket
      // Disconnect existing socket if any
      // If user logs out, disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Connect Socket on Component Load
      socketRef.current = io((socketURL), {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        ...(process.env.REACT_APP_ENV === 'production' && {
          path: '/sydneykart/socket.io/',
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          debug: true // Added to debug
        })
      });
      
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
      });


      // Log socket configuration
      console.log('Socket Config:', {
        url: socketURL,
        path: socketRef.current.io.opts.path,
        transport: socketRef.current.io.engine.transport.name
      });

      socketRef.current.onAny((event, ...args) => {
        console.log(`[Socket Event] ${event}:`, args);
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
    }, [credentials, socketURL]);
  
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

  const handleClearChat = () => {
    setMessages([]);
    setShowGreeting(false);
    // Optionally show a system message
    setMessages([{
        message: "Chat history cleared",
        sentTime: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        }),
        sender: "System",
        direction: "incoming"
    }]);
  };

  return (
    <div className={`chatWrapper ${isMinimized ? 'minimized' : ''} ${isFullScreen ? 'expanded' : ''}`}
    >
        <div className="chat-header" >
            <div className="header-left">
                <h5>Sai - AI Assistant</h5>
            </div>
            <div className="header-right">
                {!isMinimized && (
                  <>
                    <button 
                        className="clear-button"
                        onClick={handleClearChat}
                        title="Clear chat history"
                            >
                        🗑️
                    </button>
                    <button 
                        className="control-button"
                        onClick={toggleFullScreen}
                        title={isFullScreen ? "Reduce Size" : "Expand Size"}
                    >
                        {isFullScreen ? '⊟' : '⊞'}
                    </button>
                  </>
                )}
                <Avatar
                    name="Sai"
                    size="md"
                    src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                    status={isMinimized ? "eager" : "available"}
                    onClick={toggleMinimize}
                />
            </div>
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
                fancyScroll={true}
              />
            </ChatContainer>
          </MainContainer>
        </div>
    </div>
  );
};

export default ChatBot;