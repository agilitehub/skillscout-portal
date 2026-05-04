// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useEffect, useCallback, useState } from 'react'
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
import { useTheme } from '../../../core/context/ThemeContext'
import { BRAND_COLORS, DARK_THEME } from '../../../core/theme/colors'
import { renderChatMarkdown } from '../model/chatMarkdown'

const { Text, Paragraph } = Typography

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
    onLoadMoreMessages = null,
    streamingEnabled = false
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
      if (
        isLoadingHistorical ||
        !prevIsLoadingHistorical ||
        !scrollPositionRef.current ||
        !messagesContainerRef.current
      ) {
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
              backgroundColor: darkMode ? BRAND_COLORS.blueVariant : BRAND_COLORS.blueVariant,
              color: BRAND_COLORS.white,
              borderColor: darkMode ? BRAND_COLORS.mediumBlue : BRAND_COLORS.mediumBlue
            }
          case 'assistant':
          case 'bot':
            return {
              justifySelf: 'start',
              backgroundColor: darkMode ? '#374151' : '#E0F2FE',
              color: darkMode ? '#F9FAFB' : '#0F172A',
              borderColor: darkMode ? '#4B5563' : '#BAE6FD'
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
              backgroundColor: darkMode ? '#374151' : '#F3F4F6',
              color: darkMode ? '#F9FAFB' : '#1F2937',
              borderColor: darkMode ? '#4B5563' : '#E5E7EB'
            }
        }
      },
      [darkMode]
    )

    const typingIndicator = () => {
      return (
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
                  backgroundColor: BRAND_COLORS.emeraldPrimary
                }}
              />
              <div className='flex items-center space-x-1'>
                <div
                  className='rounded-full h-2 w-2 animate-pulse'
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    animationDelay: '0ms'
                  }}
                />
                <div
                  className='rounded-full h-2 w-2 animate-pulse'
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    animationDelay: '300ms'
                  }}
                />
                <div
                  className='rounded-full h-2 w-2 animate-pulse'
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    animationDelay: '600ms'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }

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
          background: darkMode ? BRAND_COLORS.veryDarkSlate : BRAND_COLORS.offWhite,
          backgroundImage: darkMode
            ? 'radial-gradient(circle at 25% 25%, rgba(42, 67, 101, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(66, 99, 149, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, rgba(49, 130, 206, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(176, 153, 86, 0.05) 0%, transparent 50%)',
          scrollbarWidth: 'thin',
          scrollbarColor: `${BRAND_COLORS.shakespeare} ${darkMode ? DARK_THEME.border.primary : BRAND_COLORS.lightGrayAlt}`
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
                    : `linear-gradient(135deg, ${BRAND_COLORS.shakespeare}, ${BRAND_COLORS.pictonBlue})`
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

            if (!message.content && streamingEnabled) {
              return typingIndicator()
            }

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
                          backgroundColor: BRAND_COLORS.emeraldPrimary,
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
                        <span className='text-blue-500'>Skill</span>
                        <span className='text-emerald-500'>Scout</span>
                      </Text>
                    </div>
                  )}

                  {isUserMessage && (
                    <div className='flex items-center mb-2'>
                      <Avatar
                        size='small'
                        icon={<FontAwesomeIcon icon={faUser} />}
                        style={{
                          backgroundColor: BRAND_COLORS.shakespeare,
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
                  <div className='relative'>
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
                      {renderChatMarkdown(message.content, messageStyle.color)}
                    </Paragraph>
                  </div>

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
          {isTyping && !streamingEnabled && typingIndicator()}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  }
)

ChatMessages.displayName = 'ChatMessages'

export default ChatMessages
