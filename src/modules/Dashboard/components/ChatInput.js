// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Button, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'

const { TextArea } = Input

/**
 * ChatInput component - Handles chat input with send functionality
 * Implements responsive design and theme support
 */
const ChatInput = React.memo(({ 
  userInput, 
  setUserInput, 
  onSendMessage, 
  onKeyPress, 
  onAttachFile,
  darkMode, 
  colors 
}) => {
  // Validate required props
  if (!setUserInput || !onSendMessage || !onKeyPress || !onAttachFile) {
    console.error('ChatInput: Missing required props')
    return null
  }

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
      <div className="flex items-center max-w-2xl mx-auto gap-3">
        <Button
          type="text"
          onClick={onAttachFile}
          className="flex items-center justify-center h-auto flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{
            borderRadius: '8px',
            minHeight: '44px',
            width: '44px',
            padding: '0',
            color: darkMode ? colors.shakespeare : colors.blueAccent
          }}
          icon={<FontAwesomeIcon icon={faPaperclip} className="text-lg" />}
        />
        <TextArea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={onKeyPress}
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ 
            background: darkMode ? '#374151' : '#ffffff',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
            color: darkMode ? '#ffffff' : '#000000',
            padding: '12px 16px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            resize: 'none',
            borderRadius: '8px'
          }}
          className={`flex-grow ${darkMode ? 'dark-mode-input' : ''}`}
          placeholder="Ask about DESO, bounties, or blockchain..."
        />
        <Button
          type="primary"
          onClick={onSendMessage}
          className="flex items-center justify-center h-auto border-0 flex-shrink-0"
          style={{
            background: `linear-gradient(to right, ${darkMode ? colors.blueAccent : colors.shakespeare}, ${darkMode ? colors.blueHighlight : colors.pictonBlue})`,
            borderRadius: '8px',
            minHeight: '44px',
            width: '44px',
            padding: '0'
          }}
          icon={<FontAwesomeIcon icon={faPaperPlane} className="text-white" />}
        />
      </div>
    </div>
    </>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput 