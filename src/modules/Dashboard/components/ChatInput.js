// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useCallback } from 'react'
import { Input, message, Progress } from 'antd'
import { Button } from '../../../core/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip, faCloudUploadAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../core/context/ThemeContext'
import { BRAND_COLORS } from '../../../core/theme/colors'

const { TextArea } = Input

/**
 * ChatInput component - Handles chat input with send functionality, file uploads, and streaming controls
 * Implements responsive design, theme support, and AI integration with Supabase storage
 */
const ChatInput = React.memo(
  ({
    onSendMessage,
    onAttachFile,
    onFileUpload,
    disabled = false,
    isTyping = false,
    isUploading = false,
    isStreaming = false,
    streamingEnabled = true,
    onToggleStreaming = null,
    onCancelStream = null,
    maxLength = 4000
  }) => {
    const { darkMode } = useTheme()
    const [userInput, setUserInput] = React.useState('')
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [dragError, setDragError] = React.useState(null)
    const [uploadProgress, setUploadProgress] = React.useState({})
    const fileInputRef = useRef(null)

    // Handle sending message
    const handleSendMessage = useCallback(() => {
      if (userInput.trim() && !disabled && !isTyping && !isUploading && !isStreaming) {
        onSendMessage?.(userInput.trim())
        setUserInput('')
      }
    }, [userInput, disabled, isTyping, isUploading, isStreaming, onSendMessage])

    // Handle key press
    const handleKeyPress = useCallback(
      (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSendMessage()
        }
      },
      [handleSendMessage]
    )

    // Enhanced file validation function
    const validateFiles = useCallback((files) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]

      const errors = []
      const validFiles = []
      const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

      Array.from(files).forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: Unsupported file type`)
        } else if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: File too large (max 50MB)`)
        } else {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        setDragError(errors.join(', '))
        setTimeout(() => setDragError(null), 5000)
        message.warning(`Some files were rejected: ${errors.join(', ')}`)
      }

      return validFiles
    }, [])

    // Process files and pass them to the real upload system
    const processFiles = useCallback(
      async (files) => {
        try {
          // Show progress indicators while uploading
          const progressEntries = {}
          files.forEach((file) => {
            progressEntries[file.name] = 0
          })
          setUploadProgress(progressEntries)

          // Simulate visual progress for better UX (since Supabase doesn't provide real progress)
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const updated = { ...prev }
              Object.keys(updated).forEach((filename) => {
                if (updated[filename] < 90) {
                  updated[filename] += Math.random() * 20
                }
              })
              return updated
            })
          }, 200)

          // Call the real upload system that integrates with Supabase
          if (onFileUpload) {
            await onFileUpload(files)
          }

          // Complete progress and clean up
          clearInterval(progressInterval)
          setUploadProgress((prev) => {
            const completed = { ...prev }
            Object.keys(completed).forEach((filename) => {
              completed[filename] = 100
            })
            return completed
          })

          // Clean up progress indicators after a short delay
          setTimeout(() => {
            setUploadProgress({})
          }, 1000)
        } catch (error) {
          console.error('File processing error:', error)
          message.error('File processing failed: ' + error.message)
          setUploadProgress({})
        }
      },
      [onFileUpload]
    )

    // Handle file input change
    const handleFileChange = useCallback(
      (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
          const validFiles = validateFiles(files)

          if (validFiles.length > 0) {
            processFiles(validFiles)
            onAttachFile?.()
          }
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      [onAttachFile, validateFiles, processFiles]
    )

    // Handle attach file button click
    const handleAttachFileClick = useCallback(() => {
      if (fileInputRef.current && !isUploading) {
        fileInputRef.current.click()
      }
    }, [isUploading])

    // Enhanced drag and drop handlers with visual feedback
    const handleDragEnter = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
      // Only set to false if leaving the main container
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragOver(false)
      }
    }, [])

    const handleDragOver = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
      // Ensure drag over state is maintained
      setIsDragOver(true)
    }, [])

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        if (isUploading) {
          message.warning('Please wait for current upload to complete')
          return
        }

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
          const validFiles = validateFiles(files)

          if (validFiles.length > 0) {
            processFiles(validFiles)
          }
        }
      },
      [isUploading, validateFiles, processFiles]
    )

    // Check if input is valid
    const isInputValid = userInput.trim().length > 0 && !disabled && !isTyping && !isUploading
    const isDisabled = disabled || isTyping || isUploading

    return (
      <>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.csv'
          onChange={handleFileChange}
          className='chat-file-input'
        />

        {/* Dark mode styles for input placeholder */}
        {darkMode && (
          <style>
            {`
            .dark-mode-input::placeholder {
              color: rgba(229, 231, 235, 0.9) !important;
            }
            .dark-mode-input:focus::placeholder {
              color: rgba(229, 231, 235, 0.7) !important;
            }
          `}
          </style>
        )}

        <div
          className={`relative p-2 md:p-4 border-t transition-all duration-200 ${
            isDragOver ? 'border-2 border-dashed shadow-lg transform scale-[1.02] chat-drop-zone' : 'border-t'
          }`}
          style={{
            background: !isDragOver ? (darkMode ? '#1F2937' : '#ffffff') : undefined,
            borderColor: isDragOver
              ? BRAND_COLORS.emeraldPrimary
              : darkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)'
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Drag Error Display */}
          {dragError && (
            <div className='mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faCloudUploadAlt} className='text-red-500 mr-2' />
                <span className='text-xs text-red-600 dark:text-red-400'>{dragError}</span>
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className='mb-3'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-xs text-gray-500 dark:text-gray-400 flex items-center'>
                  <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-2' />
                  Uploading files...
                </span>
              </div>
              <Progress
                percent={100}
                status='active'
                showInfo={false}
                strokeColor={{
                  '0%': BRAND_COLORS.shakespeare,
                  '100%': BRAND_COLORS.emeraldPrimary
                }}
                trailColor={darkMode ? '#374151' : '#f3f4f6'}
                size='small'
              />
            </div>
          )}

          {/* Individual File Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className='mb-3 space-y-1'>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className='flex items-center space-x-2'>
                  <span className='text-xs text-gray-500 dark:text-gray-400 min-w-0 flex-1 truncate'>{fileName}</span>
                  <div className='w-16'>
                    <Progress
                      percent={Math.round(progress)}
                      size='small'
                      showInfo={false}
                      strokeColor={{
                        '0%': BRAND_COLORS.shakespeare,
                        '100%': BRAND_COLORS.emeraldPrimary
                      }}
                      trailColor={darkMode ? '#374151' : '#f3f4f6'}
                    />
                  </div>
                  <span className='text-xs text-gray-400 dark:text-gray-300 w-8 text-right'>
                    {Math.round(progress)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className='flex items-center gap-3'>
            {/* Attachment Button */}
            <Button
              type='text'
              onClick={handleAttachFileClick}
              disabled={isDisabled}
              className='flex items-center justify-center h-auto flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 chat-attach-button'
              style={{
                opacity: isDisabled ? 0.5 : 1
              }}
              icon={
                isUploading ? (
                  <FontAwesomeIcon icon={faSpinner} className='text-lg animate-spin' />
                ) : (
                  <FontAwesomeIcon icon={faPaperclip} className='text-lg' />
                )
              }
            />

            {/* Text Input */}
            <TextArea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isDisabled}
              maxLength={maxLength}
              autoSize={{ minRows: 1, maxRows: 3 }}
              className={`chat-textarea flex-grow ${darkMode ? 'dark-mode-input' : ''}`}
              style={{
                boxShadow: 'none',
                opacity: isDisabled ? 0.7 : 1
              }}
              placeholder={
                isUploading
                  ? 'Uploading files...'
                  : isTyping
                    ? '...'
                    : isDisabled
                      ? 'Chat is disabled...'
                      : 'Tell me about your career goals or ask for interview preparation help...'
              }
            />

            {/* Send Button */}
            <Button
              type='primary'
              onClick={handleSendMessage}
              disabled={!isInputValid}
              className='flex items-center justify-center h-auto border-0 flex-shrink-0 transition-all duration-200 chat-send-button'
              style={{
                opacity: !isInputValid ? 0.6 : 1
              }}
              icon={<FontAwesomeIcon icon={faPaperPlane} className='text-white' />}
            />
          </div>

          {/* Drag Overlay */}
          {isDragOver && (
            <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg border-2 border-dashed border-emerald-500'>
              <div className='text-center'>
                <FontAwesomeIcon icon={faCloudUploadAlt} className='text-4xl text-emerald-500 mb-2 animate-bounce' />
                <p className='font-medium chat-drop-text'>Drop files here to upload</p>
                <p className='text-xs mt-1 chat-drop-subtext'>PDF, DOC, Images, CSV files supported</p>
              </div>
            </div>
          )}

          {/* Streaming Controls */}
          <div className='flex items-center justify-between text-xs py-2'>
            {/* Left side - Drag & Drop Hint */}
            <div
              className={`flex items-center space-x-2 transition-opacity duration-200 ${
                isDragOver ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <FontAwesomeIcon icon={faCloudUploadAlt} className='text-xs chat-status-text' />
              <span className='chat-status-text'>
                {isUploading ? (
                  'Uploading files...'
                ) : (
                  <>
                    Drag & drop files or click
                    <FontAwesomeIcon
                      icon={faPaperclip}
                      className='mx-1 text-xs'
                      style={{
                        color: darkMode ? 'rgba(229, 231, 235, 0.9)' : 'rgba(75, 85, 99, 0.8)'
                      }}
                    />
                    to upload
                  </>
                )}
              </span>
            </div>

            {/* Right side - Streaming Controls */}
            <div className='flex items-center space-x-3'>
              {/* Streaming Status */}
              {isStreaming && (
                <div className='flex items-center space-x-2'>
                  <div className='flex space-x-1'>
                    <div className='chat-streaming-dot'></div>
                    <div className='chat-streaming-dot'></div>
                    <div className='chat-streaming-dot'></div>
                  </div>
                  <span className='text-emerald-500'>Streaming...</span>
                  {onCancelStream && (
                    <Button
                      type='text'
                      size='small'
                      onClick={onCancelStream}
                      className='!px-2 !py-0 !h-5 text-xs hover:!bg-red-50 dark:hover:!bg-red-900/20 chat-cancel-button'
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}

              {/* Streaming Toggle */}
              {onToggleStreaming && !isStreaming && (
                <div className='flex items-center space-x-2'>
                  <span
                    className='text-xs'
                    style={{
                      color: darkMode ? 'rgba(229, 231, 235, 0.9)' : 'rgba(75, 85, 99, 0.8)'
                    }}
                  >
                    Streaming:
                  </span>
                  <Button
                    type='text'
                    size='small'
                    onClick={() => onToggleStreaming(!streamingEnabled)}
                    className={`!px-2 !py-0 !h-5 text-xs transition-colors duration-200 ${
                      streamingEnabled
                        ? 'hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20'
                        : 'hover:!bg-gray-50 dark:hover:!bg-gray-800'
                    }`}
                    style={{
                      color: streamingEnabled
                        ? BRAND_COLORS.emeraldPrimary
                        : darkMode
                          ? 'rgba(229, 231, 235, 0.6)'
                          : 'rgba(75, 85, 99, 0.6)'
                    }}
                  >
                    {streamingEnabled ? '✓ ON' : '✗ OFF'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
)

ChatInput.displayName = 'ChatInput'

export default ChatInput
