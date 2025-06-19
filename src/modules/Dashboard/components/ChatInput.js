// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Button, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

const { TextArea } = Input

/**
 * ChatInput component - Handles chat input with send functionality
 * Implements responsive design and theme support
 */
const ChatInput = React.memo(({ 
  onSendMessage,
  onAttachFile,
  disabled = false
}) => {
  const { darkMode } = useTheme()
  const [userInput, setUserInput] = React.useState('')
  
  // Internal color palette for Career Match AI
  const colors = {
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    seaGreen: '#16A085',
    emeraldPrimary: '#059669'
  }

  // Handle sending message
  const handleSendMessage = React.useCallback(() => {
    if (userInput.trim() && !disabled) {
      onSendMessage?.(userInput.trim())
      setUserInput('')
    }
  }, [userInput, disabled, onSendMessage])

  // Handle key press
  const handleKeyPress = React.useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // Handle attach file
  const handleAttachFile = React.useCallback(() => {
    onAttachFile?.()
  }, [onAttachFile])

  return (
    <>
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
        className="p-2 md:p-4 border-t"
        style={{ 
          background: darkMode ? '#1F2937' : '#ffffff',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
      >
      <div className="flex items-center gap-3">
        {/* Attachment Button */}
        <Button
          type="text"
          onClick={handleAttachFile}
          disabled={disabled}
          className="flex items-center justify-center h-auto flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          style={{
            borderRadius: '8px',
            minHeight: '44px',
            width: '44px',
            padding: '0',
            color: darkMode ? colors.shakespeare : colors.seaGreen,
            opacity: disabled ? 0.5 : 1
          }}
          icon={<FontAwesomeIcon icon={faPaperclip} className="text-lg" />}
        />
        
        {/* Text Input */}
        <TextArea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
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
            opacity: disabled ? 0.7 : 1
          }}
          className={`flex-grow ${darkMode ? 'dark-mode-input' : ''}`}
          placeholder={disabled ? "AI is typing..." : "Tell me about your career goals or ask for interview preparation help..."}
        />
        
        {/* Send Button */}
        <Button
          type="primary"
          onClick={handleSendMessage}
          disabled={disabled || !userInput.trim()}
          className="flex items-center justify-center h-auto border-0 flex-shrink-0 transition-all duration-200"
          style={{
            background: disabled 
              ? '#9CA3AF' 
              : `linear-gradient(to right, ${colors.emeraldPrimary}, ${colors.seaGreen})`,
            borderRadius: '8px',
            minHeight: '44px',
            width: '44px',
            padding: '0',
            opacity: disabled ? 0.5 : (!userInput.trim() ? 0.7 : 1)
          }}
          icon={<FontAwesomeIcon icon={faPaperPlane} className="text-white" />}
        />
      </div>
      
      {/* Drag & Drop Hint */}
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-300">
          <FontAwesomeIcon 
            icon={faCloudUploadAlt} 
            className="text-xs opacity-60 dark:opacity-80" 
          />
          <span className="opacity-60 dark:opacity-80">
            Drag & drop files here or click 
            <FontAwesomeIcon icon={faPaperclip} className="mx-1 text-xs" />
            to upload
          </span>
        </div>
      </div>
    </div>
    </>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput 