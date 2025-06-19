// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useCallback } from 'react'
import { Button, Input, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

const { TextArea } = Input

/**
 * ChatInput component - Handles chat input with send functionality and file uploads
 * Implements responsive design, theme support, and AI integration
 */
const ChatInput = React.memo(
  ({ onSendMessage, onAttachFile, onFileUpload, disabled = false, isTyping = false, maxLength = 4000 }) => {
    const { darkMode } = useTheme()
    const [userInput, setUserInput] = React.useState('')
    const fileInputRef = useRef(null)

    // Internal color palette for Career Match AI
    const colors = {
      shakespeare: '#4A90A4',
      pictonBlue: '#5BA3D4',
      seaGreen: '#16A085',
      emeraldPrimary: '#059669'
    }

    // Handle sending message
    const handleSendMessage = useCallback(() => {
      if (userInput.trim() && !disabled && !isTyping) {
        onSendMessage?.(userInput.trim())
        setUserInput('')
      }
    }, [userInput, disabled, isTyping, onSendMessage])

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

    // Handle file input change
    const handleFileChange = useCallback(
      (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
          // Validate file types
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif'
          ]

          const validFiles = Array.from(files).filter((file) => {
            if (!allowedTypes.includes(file.type)) {
              message.warning(`File type not supported: ${file.name}`)
              return false
            }

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
              message.warning(`File too large: ${file.name} (max 10MB)`)
              return false
            }

            return true
          })

          if (validFiles.length > 0) {
            onFileUpload?.(validFiles)
            onAttachFile?.()
          }
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      [onFileUpload, onAttachFile]
    )

    // Handle attach file button click
    const handleAttachFileClick = useCallback(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }, [])

    // Handle drag and drop
    const handleDragOver = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
          // Validate and process files
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif'
          ]

          const validFiles = Array.from(files).filter((file) => {
            if (!allowedTypes.includes(file.type)) {
              message.warning(`File type not supported: ${file.name}`)
              return false
            }

            if (file.size > 10 * 1024 * 1024) {
              message.warning(`File too large: ${file.name} (max 10MB)`)
              return false
            }

            return true
          })

          if (validFiles.length > 0) {
            onFileUpload?.(validFiles)
          }
        }
      },
      [onFileUpload]
    )

    // Check if input is valid
    const isInputValid = userInput.trim().length > 0 && !disabled && !isTyping
    const isDisabled = disabled || isTyping

    return (
      <>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Dark mode styles for input placeholder */}
        {darkMode && (
          <style>
            {`
            .dark-mode-input::placeholder {
              color: rgba(156, 163, 175, 0.8) !important;
            }
            .dark-mode-input:focus::placeholder {
              color: rgba(156, 163, 175, 0.6) !important;
            }
          `}
          </style>
        )}

        <div
          className='p-2 md:p-4 border-t'
          style={{
            background: darkMode ? '#1F2937' : '#ffffff',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className='flex items-center gap-3'>
            {/* Attachment Button */}
            <Button
              type='text'
              onClick={handleAttachFileClick}
              disabled={isDisabled}
              className='flex items-center justify-center h-auto flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200'
              style={{
                borderRadius: '8px',
                minHeight: '44px',
                width: '44px',
                padding: '0',
                color: darkMode ? colors.shakespeare : colors.seaGreen,
                opacity: isDisabled ? 0.5 : 1
              }}
              icon={<FontAwesomeIcon icon={faPaperclip} className='text-lg' />}
            />

            {/* Text Input */}
            <TextArea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isDisabled}
              maxLength={maxLength}
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{
                background: darkMode ? '#374151' : '#ffffff',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                color: darkMode ? '#ffffff' : '#000000',
                padding: '12px 16px',
                fontSize: '0.875rem',
                boxShadow: 'none',
                resize: 'none',
                borderRadius: '8px',
                opacity: isDisabled ? 0.7 : 1
              }}
              className={`flex-grow ${darkMode ? 'dark-mode-input' : ''}`}
              placeholder={
                isTyping
                  ? 'AI is typing...'
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
              className='flex items-center justify-center h-auto border-0 flex-shrink-0 transition-all duration-200'
              style={{
                background: !isInputValid
                  ? '#9CA3AF'
                  : `linear-gradient(to right, ${colors.emeraldPrimary}, ${colors.seaGreen})`,
                borderRadius: '8px',
                minHeight: '44px',
                width: '44px',
                padding: '0',
                opacity: !isInputValid ? 0.5 : 1
              }}
              icon={<FontAwesomeIcon icon={faPaperPlane} className='text-white' />}
            />
          </div>

          {/* Character count and drag & drop hint */}
          <div className='flex items-center justify-between py-2'>
            {/* Character count */}
            <div className='text-xs text-gray-400 dark:text-gray-300'>
              {userInput.length}/{maxLength}
            </div>

            {/* Drag & Drop Hint */}
            <div className='flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-300'>
              <FontAwesomeIcon icon={faCloudUploadAlt} className='text-xs opacity-60 dark:opacity-80' />
              <span className='opacity-60 dark:opacity-80'>
                Drag & drop files here or click
                <FontAwesomeIcon icon={faPaperclip} className='mx-1 text-xs' />
                to upload
              </span>
            </div>
          </div>
        </div>
      </>
    )
  }
)

ChatInput.displayName = 'ChatInput'

export default ChatInput
