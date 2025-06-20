// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import { Avatar, Typography, Tag, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRobot,
  faUser,
  faFileAlt,
  faFilePdf,
  faFileWord,
  faFileImage,
  faPaperclip,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

const { Text, Paragraph } = Typography

/**
 * Custom markdown renderer for chat messages
 * Handles basic markdown syntax without external dependencies
 */
const renderMarkdown = (text, textColor) => {
  if (!text || typeof text !== 'string') return text

  // Split text into lines to handle multiline content
  const lines = text.split('\n')
  let inCodeBlock = false
  let codeBlockContent = []

  return lines
    .map((line, lineIndex) => {
      // Handle code blocks (```)
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true
          codeBlockContent = []
          return null // Don't render the opening ```
        } else {
          // Ending a code block
          inCodeBlock = false
          const codeContent = codeBlockContent.join('\n')
          return (
            <pre
              key={lineIndex}
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '12px 16px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                margin: '12px 0',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              {codeContent}
            </pre>
          )
        }
      }

      // If we're in a code block, collect content
      if (inCodeBlock) {
        codeBlockContent.push(line)
        return null
      }

      // Skip empty lines
      if (!line.trim()) {
        return <br key={lineIndex} />
      }

      // Handle headers
      if (line.startsWith('### ')) {
        return (
          <h3
            key={lineIndex}
            style={{
              color: textColor,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '8px 0 4px 0'
            }}
          >
            {line.substring(4)}
          </h3>
        )
      }

      if (line.startsWith('## ')) {
        return (
          <h2
            key={lineIndex}
            style={{
              color: textColor,
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: '12px 0 6px 0'
            }}
          >
            {line.substring(3)}
          </h2>
        )
      }

      if (line.startsWith('# ')) {
        return (
          <h1
            key={lineIndex}
            style={{
              color: textColor,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '16px 0 8px 0'
            }}
          >
            {line.substring(2)}
          </h1>
        )
      }

      // Handle inline code
      if (line.includes('`')) {
        const parts = line.split('`')
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                // This is code
                return (
                  <code
                    key={partIndex}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {part}
                  </code>
                )
              }
              return part
            })}
          </span>
        )
      }

      // Handle bold text (check for ** before *)
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return <strong key={partIndex}>{part}</strong>
              }
              return part
            })}
          </span>
        )
      }

      // Handle italic text (only if not already handled by bold)
      if (line.includes('*') && !line.includes('**')) {
        const parts = line.split('*')
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return <em key={partIndex}>{part}</em>
              }
              return part
            })}
          </span>
        )
      }

      // Handle links [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      if (linkRegex.test(line)) {
        const parts = []
        let lastIndex = 0
        let match

        while ((match = linkRegex.exec(line)) !== null) {
          // Add text before the link
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index))
          }

          // Add the link
          parts.push(
            <a
              key={match.index}
              href={match[2]}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: textColor === '#ffffff' ? '#90CAF9' : '#2563EB',
                textDecoration: 'underline'
              }}
            >
              {match[1]}
            </a>
          )

          lastIndex = match.index + match[0].length
        }

        // Add remaining text
        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex))
        }

        return <span key={lineIndex}>{parts}</span>
      }

      // Handle lists
      if (line.match(/^[\s]*[-*+]\s/)) {
        return (
          <div
            key={lineIndex}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              margin: '4px 0'
            }}
          >
            <span
              style={{
                marginRight: '8px',
                color: textColor,
                fontSize: '1.2rem',
                lineHeight: '1.4'
              }}
            >
              •
            </span>
            <span>{line.replace(/^[\s]*[-*+]\s/, '')}</span>
          </div>
        )
      }

      if (line.match(/^[\s]*\d+\.\s/)) {
        return (
          <div
            key={lineIndex}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              margin: '4px 0'
            }}
          >
            <span
              style={{
                marginRight: '8px',
                color: textColor,
                fontWeight: 'bold'
              }}
            >
              {line.match(/^[\s]*(\d+)\.\s/)[1]}.
            </span>
            <span>{line.replace(/^[\s]*\d+\.\s/, '')}</span>
          </div>
        )
      }

      // Regular text
      return <span key={lineIndex}>{line}</span>
    })
    .filter(Boolean) // Remove null values from code block handling
}

/**
 * ChatMessages component - Displays chat messages with proper styling
 * Implements responsive design, theme support, and AI integration
 */
const ChatMessages = React.memo(
  ({
    messages,
    isTyping,
    user,
    uploadedFiles = [],
    showFileInfo = true,
    hasMoreMessages = false,
    isLoadingMore = false,
    isLoadingHistorical = false,
    onLoadMoreMessages = null
  }) => {
    const { darkMode } = useTheme()
    const messagesEndRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(false)
    const prevMessageCountRef = useRef(0)
    
    // Add scroll position tracking for when loading previous messages
    const scrollPositionRef = useRef(null)
    const prevScrollHeightRef = useRef(0)
    const isRestoringScrollRef = useRef(false)
    const prevIsLoadingHistoricalRef = useRef(false)

    // Internal color palette for Career Match AI
    const colors = {
      darkBlue: '#1E3A52',
      shakespeare: '#4A90A4',
      pictonBlue: '#5BA3D4',
      seaGreen: '#16A085',
      emeraldPrimary: '#059669',
      tealGreen: '#14B8A6'
    }

    // Handle scroll detection for showing load more button
    const handleScroll = useCallback(
      (e) => {
        // Don't process scroll events when we're restoring scroll position
        if (isRestoringScrollRef.current) return
        
        const { scrollTop } = e.target
        // Show load more button only when user scrolls near the top (within 100px)
        const shouldShow = scrollTop < 100 && hasMoreMessages
        setShowLoadMoreButton(shouldShow)
      },
      [hasMoreMessages]
    )

    // Enhanced load more messages handler with scroll position preservation
    const handleLoadMoreMessages = useCallback(async () => {
      if (!messagesContainerRef.current || !onLoadMoreMessages) return
      
      const container = messagesContainerRef.current
      
      // Store current scroll position relative to the bottom
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      
      // Store the distance from the bottom
      scrollPositionRef.current = {
        scrollTop,
        scrollHeight,
        clientHeight,
        distanceFromBottom: scrollHeight - scrollTop - clientHeight
      }
      
      prevScrollHeightRef.current = scrollHeight
      
      // Call the load more function
      await onLoadMoreMessages()
    }, [onLoadMoreMessages])

    // Restore scroll position after loading historical messages
    useEffect(() => {
      const prevIsLoadingHistorical = prevIsLoadingHistoricalRef.current
      prevIsLoadingHistoricalRef.current = isLoadingHistorical
      
      // Only restore when isLoadingHistorical just changed from true to false
      if (isLoadingHistorical || !prevIsLoadingHistorical || !scrollPositionRef.current || !messagesContainerRef.current) {
        return
      }

      const container = messagesContainerRef.current
      
      // Wait a bit for the DOM to update with new messages
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight
        const prevScrollHeight = prevScrollHeightRef.current
        
        console.log('Scroll restoration:', {
          newScrollHeight,
          prevScrollHeight,
          storedPosition: scrollPositionRef.current
        })
        
        // Calculate how much the content has grown
        const heightDifference = newScrollHeight - prevScrollHeight
        
        if (heightDifference > 0 && scrollPositionRef.current) {
          // Set flag to prevent scroll event processing during restoration
          isRestoringScrollRef.current = true
          
          // Restore scroll position by adjusting for the new content
          const newScrollTop = scrollPositionRef.current.scrollTop + heightDifference
          
          console.log('Restoring scroll position:', {
            oldScrollTop: scrollPositionRef.current.scrollTop,
            heightDifference,
            newScrollTop
          })
          
          // Set the scroll position
          container.scrollTop = newScrollTop
          
          // Reset flag after a small delay
          setTimeout(() => {
            isRestoringScrollRef.current = false
          }, 100)
        }
        
        // Clear the stored position
        scrollPositionRef.current = null
        prevScrollHeightRef.current = newScrollHeight
      }, 50) // Small delay to ensure DOM is updated
      
    }, [isLoadingHistorical])

    // Auto-scroll to bottom when new messages arrive (but not when loading more)
    useEffect(() => {
      // Completely disable auto-scroll if we're loading historical messages or restoring scroll
      if (isLoadingHistorical || isRestoringScrollRef.current) {
        return
      }

      const currentMessageCount = messages.length
      const prevMessageCount = prevMessageCountRef.current

      // Only auto-scroll if new messages were added (count increased)
      const messagesAdded = currentMessageCount - prevMessageCount

      if (messagesEndRef.current && messagesAdded > 0 && currentMessageCount > 0) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }

      // Update the previous message count
      prevMessageCountRef.current = currentMessageCount
    }, [messages, isTyping, isLoadingHistorical])

    // Add scroll event listener
    useEffect(() => {
      const container = messagesContainerRef.current
      if (container) {
        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
      }
    }, [handleScroll])

    // Get file icon based on type
    const getFileIcon = useCallback((fileName) => {
      const extension = fileName.split('.').pop()?.toLowerCase()
      switch (extension) {
        case 'pdf':
          return faFilePdf
        case 'doc':
        case 'docx':
          return faFileWord
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return faFileImage
        default:
          return faFileAlt
      }
    }, [])

    // Format timestamp
    const formatTimestamp = useCallback((timestamp) => {
      if (!timestamp) return ''

      try {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = (now - date) / (1000 * 60 * 60)

        if (diffInHours < 24) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
      } catch (error) {
        return ''
      }
    }, [])

    // Get message styling based on type
    const getMessageStyle = useCallback(
      (messageType) => {
        switch (messageType) {
          case 'user':
            return {
              justifySelf: 'end',
              backgroundColor: darkMode ? '#3B82F6' : '#3B82F6',
              color: '#ffffff',
              borderColor: darkMode ? '#2563EB' : '#2563EB'
            }
          case 'assistant':
          case 'bot':
            return {
              justifySelf: 'start',
              backgroundColor: darkMode ? '#1F2937' : '#E0F2FE',
              color: darkMode ? '#F9FAFB' : '#0F172A',
              borderColor: darkMode ? '#374151' : '#BAE6FD'
            }
          case 'system':
            return {
              justifySelf: 'center',
              backgroundColor: darkMode ? '#FEF3C7' : '#FEF3C7',
              color: darkMode ? '#92400E' : '#92400E',
              borderColor: darkMode ? '#F59E0B' : '#F59E0B'
            }
          default:
            return {
              justifySelf: 'start',
              backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
              color: darkMode ? '#F9FAFB' : '#1F2937',
              borderColor: darkMode ? '#374151' : '#E5E7EB'
            }
        }
      },
      [darkMode]
    )

    // Debug logging
    console.log('ChatMessages props:', {
      messagesLength: messages?.length,
      hasMoreMessages,
      isLoadingMore,
      isLoadingHistorical,
      showLoadMoreButton
    })

    // Validate props
    if (!messages || !Array.isArray(messages)) {
      return (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <Text>No messages to display</Text>
        </div>
      )
    }

    return (
      <div
        className='h-full overflow-y-auto p-2 md:p-4 flex flex-col'
        style={{
          background: darkMode ? '#1F2937' : '#F9FAFB',
          backgroundImage: darkMode
            ? 'radial-gradient(circle at 25% 25%, rgba(42, 67, 101, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(66, 99, 149, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, rgba(49, 130, 206, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(176, 153, 86, 0.05) 0%, transparent 50%)',
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.shakespeare} ${darkMode ? '#374151' : '#f1f1f1'}`
        }}
        ref={messagesContainerRef}
      >
        <div className='w-full space-y-4 px-4'>
          {/* Load more messages button - moved to top */}
          {showLoadMoreButton && (
            <div className='flex justify-center py-2 sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-blue-200 dark:border-blue-700'>
              <button
                onClick={handleLoadMoreMessages}
                disabled={isLoadingMore}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isLoadingMore
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }
                  flex items-center space-x-2
                `}
                style={{
                  background: isLoadingMore
                    ? undefined
                    : `linear-gradient(135deg, ${colors.shakespeare}, ${colors.pictonBlue})`
                }}
              >
                {isLoadingMore ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faClock} className='text-xs' />
                    <span>Load Previous Messages</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => {
            const messageStyle = getMessageStyle(message.type)
            const isUserMessage = message.type === 'user'
            const isSystemMessage = message.type === 'system'

            return (
              <div key={message.id} className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-lg px-4 py-3 shadow-sm max-w-[75%] border ${
                    isSystemMessage ? 'mx-auto max-w-md' : ''
                  }`}
                  style={{
                    backgroundColor: messageStyle.backgroundColor,
                    color: messageStyle.color,
                    borderColor: messageStyle.borderColor
                  }}
                >
                  {/* Message Header */}
                  {!isUserMessage && !isSystemMessage && (
                    <div className='flex items-center mb-2'>
                      <Avatar
                        size='small'
                        icon={<FontAwesomeIcon icon={faRobot} />}
                        style={{
                          backgroundColor: colors.emeraldPrimary,
                          marginRight: '8px'
                        }}
                      />
                      <Text
                        strong
                        style={{
                          fontSize: '0.875rem',
                          color: messageStyle.color
                        }}
                      >
                        Career Match AI
                      </Text>
                    </div>
                  )}

                  {isUserMessage && (
                    <div className='flex items-center mb-2'>
                      <Avatar
                        size='small'
                        icon={<FontAwesomeIcon icon={faUser} />}
                        style={{
                          backgroundColor: colors.shakespeare,
                          marginRight: '8px'
                        }}
                      />
                      <Text strong className='text-sm text-white'>
                        {user?.Username || 'You'}
                      </Text>
                    </div>
                  )}

                  {isSystemMessage && (
                    <div className='flex items-center mb-2'>
                      <FontAwesomeIcon
                        icon={faPaperclip}
                        className='mr-2 text-sm'
                        style={{ color: messageStyle.color }}
                      />
                      <Text
                        strong
                        style={{
                          fontSize: '0.875rem',
                          color: messageStyle.color
                        }}
                      >
                        System
                      </Text>
                    </div>
                  )}

                  {/* Message Content */}
                  <Paragraph
                    style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: messageStyle.color
                    }}
                    className='break-words'
                  >
                    {renderMarkdown(message.content, messageStyle.color)}
                  </Paragraph>

                  {/* Message Footer */}
                  <div className='flex items-center justify-between mt-2'>
                    {/* Timestamp */}
                    <Text
                      style={{
                        fontSize: '0.75rem',
                        opacity: 0.7,
                        color: messageStyle.color
                      }}
                    >
                      {formatTimestamp(message.timestamp)}
                    </Text>

                    {/* File attachments for system messages */}
                    {isSystemMessage && showFileInfo && uploadedFiles.length > 0 && (
                      <div className='flex items-center space-x-1'>
                        {uploadedFiles.slice(0, 3).map((file, index) => (
                          <Tooltip key={file.id} title={file.name}>
                            <Tag
                              size='small'
                              icon={<FontAwesomeIcon icon={getFileIcon(file.name)} />}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: messageStyle.color
                              }}
                            >
                              {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                            </Tag>
                          </Tooltip>
                        ))}
                        {uploadedFiles.length > 3 && (
                          <Tag
                            size='small'
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              border: 'none',
                              color: messageStyle.color
                            }}
                          >
                            +{uploadedFiles.length - 3} more
                          </Tag>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className='flex justify-start'>
              <div
                className='rounded-lg px-4 py-3 shadow-sm max-w-[75%]'
                style={{
                  backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`
                }}
              >
                <div className='flex items-center space-x-3'>
                  <Avatar
                    size='small'
                    icon={<FontAwesomeIcon icon={faRobot} />}
                    style={{
                      backgroundColor: colors.emeraldPrimary
                    }}
                  />
                  <div className='flex items-center space-x-1'>
                    <div
                      className='rounded-full h-2 w-2 animate-pulse'
                      style={{
                        backgroundColor: colors.emeraldPrimary,
                        animationDelay: '0ms'
                      }}
                    />
                    <div
                      className='rounded-full h-2 w-2 animate-pulse'
                      style={{
                        backgroundColor: colors.emeraldPrimary,
                        animationDelay: '300ms'
                      }}
                    />
                    <div
                      className='rounded-full h-2 w-2 animate-pulse'
                      style={{
                        backgroundColor: colors.emeraldPrimary,
                        animationDelay: '600ms'
                      }}
                    />
                  </div>
                  <Text
                    style={{
                      fontSize: '0.875rem',
                      color: darkMode ? '#F9FAFB' : '#1F2937'
                    }}
                  >
                    ...
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  }
)

ChatMessages.displayName = 'ChatMessages'

export default ChatMessages
