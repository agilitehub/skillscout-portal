// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Avatar, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'

const { Text, Paragraph } = Typography

/**
 * ChatMessages component - Displays chat messages with proper styling
 * Implements responsive design and theme support
 */
const ChatMessages = React.memo(({ messages, isTyping, messagesEndRef, darkMode, colors }) => {
  // Validate props
  if (!messages || !Array.isArray(messages)) {
    return null
  }

  return (
    <div 
      className="h-full overflow-y-auto p-2 md:p-4 flex flex-col-reverse"
      style={{ 
        background: darkMode ? '#1F2937' : '#F9FAFB',
        backgroundImage: darkMode 
          ? 'radial-gradient(circle at 25% 25%, rgba(42, 67, 101, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(66, 99, 149, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 25% 25%, rgba(49, 130, 206, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(176, 153, 86, 0.05) 0%, transparent 50%)',
        scrollbarWidth: 'thin',
        scrollbarColor: `${darkMode ? colors.blueAccent : colors.shakespeare} ${darkMode ? colors.navyDark : '#f1f1f1'}`
      }}
    >
      <div className="max-w-2xl mx-auto w-full">
        {/* This div helps scroll to the bottom when new messages are added */}
        <div ref={messagesEndRef} />
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="mb-3 md:mb-4 flex justify-start">
            <div 
              className="rounded-lg px-3 py-2 md:px-4 md:py-3 shadow-sm"
              style={{
                backgroundColor: darkMode ? colors.navyDark : 'white',
                borderTopLeftRadius: '2px'
              }}
            >
              <div className="flex items-center space-x-1">
                <div className="bg-gray-400 rounded-full h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="bg-gray-400 rounded-full h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="bg-gray-400 rounded-full h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((message, index) => (
          <div key={index} className={`mb-3 md:mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className="rounded-lg px-2 py-2 md:px-4 md:py-3 shadow-sm max-w-[85%]"
              style={{
                backgroundColor: message.type === 'user'
                  ? darkMode ? colors.blueAccent : colors.shakespeare
                  : darkMode ? colors.navyDark : '#E0F2FE',
                borderTopLeftRadius: message.type === 'assistant' ? '2px' : '12px',
                borderTopRightRadius: message.type === 'user' ? '2px' : '12px',
              }}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center mb-1">
                  <Avatar 
                    size="small" 
                    icon={<FontAwesomeIcon icon={faRobot} />} 
                    style={{ 
                      backgroundColor: darkMode ? colors.logoGoldAccent : colors.diSerria,
                      marginRight: '6px'
                    }}
                  />
                  <Text 
                    strong 
                    style={{ 
                      color: darkMode ? '#e0e0e0' : '#505050', 
                      fontSize: '0.75rem' 
                    }} 
                    className="truncate max-w-[100px] sm:max-w-[150px]"
                  >
                    Bounty Coin Assistant
                  </Text>
                </div>
              )}
              
              <Paragraph 
                style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  color: message.type === 'user' ? 'white' : (darkMode ? '#e0e0e0' : '#505050'),
                  fontSize: '0.75rem',
                  lineHeight: '1.4'
                }}
                className="break-words"
              >
                {message.content}
              </Paragraph>
              
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: '0.65rem', 
                  display: 'block', 
                  textAlign: message.type === 'user' ? 'right' : 'left',
                  marginTop: '3px',
                  color: message.type === 'user' 
                    ? 'rgba(255,255,255,0.7)' 
                    : (darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)')
                }}
              >
                {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

ChatMessages.displayName = 'ChatMessages'

export default ChatMessages 