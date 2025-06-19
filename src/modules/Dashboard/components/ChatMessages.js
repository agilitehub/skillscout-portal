// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useEffect } from 'react'
import { Avatar, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

const { Text, Paragraph } = Typography

/**
 * ChatMessages component - Displays chat messages with proper styling
 * Implements responsive design and theme support
 */
const ChatMessages = React.memo(({ messages, isTyping, user }) => {
  const { darkMode } = useTheme()
  const messagesEndRef = useRef(null)

  // Internal color palette for Career Match AI
  const colors = {
    darkBlue: '#1E3A52',
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    seaGreen: '#16A085',
    emeraldPrimary: '#059669',
    tealGreen: '#14B8A6'
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Validate props
  if (!messages || !Array.isArray(messages)) {
    return null
  }

  return (
    <div 
      className="h-full overflow-y-auto p-2 md:p-4 flex flex-col"
      style={{ 
        background: darkMode ? '#1F2937' : '#F9FAFB',
        backgroundImage: darkMode 
          ? 'radial-gradient(circle at 25% 25%, rgba(42, 67, 101, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(66, 99, 149, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 25% 25%, rgba(49, 130, 206, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(176, 153, 86, 0.05) 0%, transparent 50%)',
        scrollbarWidth: 'thin',
        scrollbarColor: `${colors.shakespeare} ${darkMode ? '#374151' : '#f1f1f1'}`
      }}
    >
      <div className="w-full space-y-4 px-4">
        {/* Chat Messages */}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`rounded-lg px-4 py-3 shadow-sm max-w-[75%] ${
                message.type === 'user' ? 'bg-blue-500 text-white' : 
                message.type === 'system' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                darkMode ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-50 text-emerald-900'
              }`}
            >
              {(message.type === 'bot' || message.type === 'assistant') && (
                <div className="flex items-center mb-2">
                  <Avatar 
                    size="small" 
                    icon={<FontAwesomeIcon icon={faRobot} />} 
                    style={{ 
                      backgroundColor: colors.emeraldPrimary,
                      marginRight: '8px'
                    }}
                  />
                  <Text 
                    strong 
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Career Match AI
                  </Text>
                </div>
              )}
              
              {message.type === 'user' && (
                <div className="flex items-center mb-2">
                  <Avatar 
                    size="small" 
                    icon={<FontAwesomeIcon icon={faUser} />} 
                    style={{ 
                      backgroundColor: colors.shakespeare,
                      marginRight: '8px'
                    }}
                  />
                  <Text 
                    strong 
                    className="text-sm text-white"
                  >
                    {user?.Username || 'You'}
                  </Text>
                </div>
              )}
              
              <Paragraph 
                style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}
                className="break-words"
              >
                {message.content}
              </Paragraph>
              
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: '0.75rem', 
                  display: 'block', 
                  textAlign: message.type === 'user' ? 'right' : 'left',
                  marginTop: '8px',
                  opacity: 0.7
                }}
              >
                {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div 
              className="rounded-lg px-4 py-3 shadow-sm bg-gray-200 dark:bg-gray-700"
            >
              <div className="flex items-center space-x-1">
                <div className="bg-gray-400 rounded-full h-2 w-2 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="bg-gray-400 rounded-full h-2 w-2 animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="bg-gray-400 rounded-full h-2 w-2 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
})

ChatMessages.displayName = 'ChatMessages'

export default ChatMessages 