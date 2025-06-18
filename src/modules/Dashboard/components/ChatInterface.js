// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Modal, Typography, Upload, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faHistory, faCloudUpload, faFile } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

const { Dragger } = Upload

// Sample welcome messages for the chat
const WELCOME_MESSAGES = [
  'Hello! I\'m your AI Assessment Portal Assistant. How can I help you today?',
  'Welcome to AI Assessment Portal! Ask me anything about DESO, crypto, or bounties.',
  'Hi there! I\'m here to answer your questions about the DESO blockchain and AI Assessment Portal.'
]

// Sample responses for demonstration
const SAMPLE_RESPONSES = {
  deso: 'DESO (Decentralized Social) is a blockchain built for social media applications. It combines the openness of Web3 and cryptocurrency with social features. The platform enables developers to build decentralized social media apps.',
  bounty: 'Bounty Coin lets you create and participate in blockchain-powered bounties. Users can earn rewards for completing tasks, and organizations can incentivize contributions through transparent, secure payments on the DESO blockchain.',
  crypto: 'Cryptocurrency is a digital or virtual currency secured by cryptography. DESO is an example of a cryptocurrency that powers a decentralized social network ecosystem.',
  blockchain: 'Blockchain is a distributed database or ledger shared among computer network nodes. DESO uses blockchain technology to create a decentralized platform for social media applications.',
  wallet: 'In the DESO ecosystem, your wallet holds your DESO coins and manages your digital identity. You can use it to send and receive payments, as well as interact with DESO-powered applications.',
  nft: 'NFTs (Non-Fungible Tokens) on DESO represent unique digital assets. They can be used for digital art, collectibles, access tokens, and more within the DESO ecosystem.'
}

/**
 * ChatInterface component - Handles all chat-related functionality
 * Implements proper state management and error handling
 */
const ChatInterface = React.memo(() => {
  const { darkMode } = useTheme()
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false)
  const [isAttachModalVisible, setIsAttachModalVisible] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const messagesEndRef = useRef(null)

  // Color palette
  const colors = {
    darkBlue: '#0E4173',
    blueAccent: '#2C5282',
    shakespeare: '#3FB1D4',
    pictonBlue: '#1EC9EA',
    logoGoldAccent: '#DCAC55',
    diSerria: '#DCAA55',
    navyDark: '#0A1929',
    blueHighlight: '#3182CE'
  }

  // Sample chat history
  const chatHistory = [
    {
      id: 1,
      title: 'DESO Blockchain Discussion',
      date: '2024-03-10',
      preview: 'Discussion about DESO blockchain technology and its features...'
    },
    {
      id: 2,
      title: 'Bounty Program Questions',
      date: '2024-03-09',
      preview: 'Questions about how to participate in bounty programs...'
    },
    {
      id: 3,
      title: 'Airdrop Eligibility',
      date: '2024-03-08',
      preview: 'Information about upcoming airdrops and eligibility criteria...'
    }
  ]

  // Initialize chat with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      try {
        const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length)
        setChatMessages([
          { 
            type: 'assistant', 
            content: WELCOME_MESSAGES[randomIndex],
            timestamp: new Date()
          }
        ])
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }
  }, [chatMessages])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  // Handle sending messages with proper error handling
  const handleSendMessage = useCallback(() => {
    if (!userInput.trim()) return
    
    try {
      // Add user message
      const newUserMessage = {
        type: 'user',
        content: userInput.trim(),
        timestamp: new Date()
      }
      
      setChatMessages(prevMessages => [...prevMessages, newUserMessage])
      const currentInput = userInput.trim()
      setUserInput('')
      setIsTyping(true)
      
      // Simulate AI response after a delay
      setTimeout(() => {
        try {
          let response = "I'm not sure I understand. Could you clarify your question about DESO or Bounty Coin?"
          
          const input = currentInput.toLowerCase()
          
          // Check for keywords in the input
          if (input.includes('deso')) {
            response = SAMPLE_RESPONSES.deso
          } else if (input.includes('bounty') || input.includes('reward')) {
            response = SAMPLE_RESPONSES.bounty
          } else if (input.includes('crypto') || input.includes('cryptocurrency')) {
            response = SAMPLE_RESPONSES.crypto
          } else if (input.includes('blockchain')) {
            response = SAMPLE_RESPONSES.blockchain
          } else if (input.includes('wallet')) {
            response = SAMPLE_RESPONSES.wallet
          } else if (input.includes('nft')) {
            response = SAMPLE_RESPONSES.nft
          }
          
          const assistantMessage = {
            type: 'assistant',
            content: response,
            timestamp: new Date()
          }
          
          setChatMessages(prevMessages => [...prevMessages, assistantMessage])
        } catch (error) {
          console.error('Error generating response:', error)
          setChatMessages(prevMessages => [...prevMessages, {
            type: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date()
          }])
        } finally {
          setIsTyping(false)
        }
      }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
    }
  }, [userInput])

  // Handle key press for sending messages
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // Handle loading chat history
  const handleLoadChatHistory = useCallback((chat) => {
    try {
      setIsHistoryModalVisible(false)
      // Here you would implement loading the selected chat
      console.log('Loading chat:', chat.title)
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }, [])

  // Handle file attachment
  const handleAttachFile = useCallback(() => {
    setIsAttachModalVisible(true)
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback((info) => {
    const { status, originFileObj } = info.file
    
    if (status === 'uploading') {
      return
    }
    
    if (status === 'done' || originFileObj) {
      const file = originFileObj || info.file
      
      // Simulate file processing
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
      
      setUploadedFiles(prev => [...prev, fileInfo])
      
      // Add file attachment message to chat
      const attachmentMessage = {
        type: 'user',
        content: `📎 Attached file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        timestamp: new Date(),
        isAttachment: true,
        fileInfo
      }
      
      setChatMessages(prevMessages => [...prevMessages, attachmentMessage])
      
      // Simulate server response
      setTimeout(() => {
        const responseMessage = {
          type: 'assistant',
          content: `I've received your file "${file.name}". File analysis:\n\n• File type: ${file.type || 'Unknown'}\n• Size: ${(file.size / 1024).toFixed(1)} KB\n• Upload time: ${new Date().toLocaleTimeString()}\n\nThe file has been successfully uploaded to our servers and is ready for processing. How can I help you with this file?`,
          timestamp: new Date()
        }
        setChatMessages(prevMessages => [...prevMessages, responseMessage])
      }, 1500)
      
      message.success(`${file.name} uploaded successfully`)
      setIsAttachModalVisible(false)
    } else if (status === 'error') {
      message.error(`${info.file.name} upload failed.`)
    }
  }, [])

  // Upload props for Dragger
  const uploadProps = {
    name: 'file',
    multiple: true,
    onChange: handleFileUpload,
    beforeUpload: () => false, // Prevent automatic upload
    showUploadList: false
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full relative">
      {/* Chat Header */}
      <div 
        className="p-2 md:p-4 flex items-center justify-between rounded-t-lg border-b border-white/10 flex-shrink-0"
        style={{ 
          background: `linear-gradient(to right, ${darkMode ? colors.darkBlue : colors.shakespeare}, ${darkMode ? colors.blueAccent : colors.pictonBlue} 85%, ${darkMode ? colors.logoGoldAccent : colors.diSerria})`
        }}
      >
        <div className="flex items-center overflow-hidden">
          <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
            <FontAwesomeIcon icon={faRobot} className="text-white text-xs md:text-base" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white text-sm md:text-lg font-medium m-0 truncate">AI Assessment Portal Assistant</h3>
            <p className="text-white/70 text-[10px] md:text-xs m-0 truncate">Powered by AI Assessment Portal</p>
          </div>
        </div>
        <Button
          type="text"
          onClick={() => setIsHistoryModalVisible(true)}
          icon={<FontAwesomeIcon icon={faHistory} className="text-lg" />}
          className="text-white hover:bg-white/10"
        />
      </div>

      {/* Chat History Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-2 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-white">Chat History</span>
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={null}
        width={600}
        bodyStyle={{ 
          padding: '0',
          maxHeight: '70vh',
          overflow: 'auto'
        }}
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {chatHistory.map((chat) => (
            <div 
              key={chat.id}
              className="p-4 cursor-pointer transition-colors"
              style={{
                ':hover': {
                  backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
              onClick={() => handleLoadChatHistory(chat)}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 
                  className="text-base font-medium text-gray-800"
                  style={{ color: darkMode ? '#000000' : '#1f2937' }}
                >
                  {chat.title}
                </h4>
                <span 
                  className="text-xs text-gray-500"
                  style={{ color: darkMode ? '#333333' : '#6b7280' }}
                >
                  {chat.date}
                </span>
              </div>
              <p 
                className="text-sm text-gray-600 line-clamp-2"
                style={{ color: darkMode ? '#000000' : '#4b5563' }}
              >
                {chat.preview}
              </p>
            </div>
          ))}
        </div>
      </Modal>

      {/* File Attachment Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFile} className="mr-2 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-white">Attach Files</span>
          </div>
        }
        open={isAttachModalVisible}
        onCancel={() => setIsAttachModalVisible(false)}
        footer={null}
        width={500}
        bodyStyle={{ 
          padding: '24px'
        }}
      >
        <Dragger 
          {...uploadProps}
          className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
          style={{
            background: darkMode ? '#374151' : '#F9FAFB',
            borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <div className="text-center py-8">
            <FontAwesomeIcon 
              icon={faCloudUpload} 
              className="text-4xl mb-4"
              style={{ color: darkMode ? colors.shakespeare : colors.blueAccent }}
            />
            <p className="text-lg font-medium mb-2" style={{ color: darkMode ? '#e0e0e0' : '#374151' }}>
              Click to attach or drag files here
            </p>
            <p className="text-sm" style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }}>
              Support for documents, images, and other file types
            </p>
          </div>
        </Dragger>
        
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2" style={{ color: darkMode ? '#e0e0e0' : '#374151' }}>
              Recently Uploaded:
            </h4>
            <div className="space-y-2">
              {uploadedFiles.slice(-3).map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center p-2 rounded-md"
                  style={{ background: darkMode ? '#4B5563' : '#F3F4F6' }}
                >
                  <FontAwesomeIcon icon={faFile} className="mr-2" style={{ color: darkMode ? colors.shakespeare : colors.blueAccent }} />
                  <span className="text-sm truncate" style={{ color: darkMode ? '#e0e0e0' : '#374151' }}>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Messages Container */}
      <div className="flex-1 min-h-0">
        <ChatMessages 
          messages={chatMessages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          darkMode={darkMode}
          colors={colors}
        />
      </div>
      
      {/* Input Area */}
      <div className="flex-shrink-0">
        <ChatInput 
          userInput={userInput}
          setUserInput={setUserInput}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          onAttachFile={handleAttachFile}
          darkMode={darkMode}
          colors={colors}
        />
      </div>
    </div>
  )
})

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface 