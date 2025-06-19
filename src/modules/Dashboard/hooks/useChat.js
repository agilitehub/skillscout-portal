// Global Instructions Rule Applied!
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { message } from 'antd'
import { useAIController, handleAIError, formatMessage } from '../../../lib/ai-controller'
import { getValidatedConfig, getMockResponses } from '../../../lib/ai-config'
import { getUserThreadId, setUserThreadId } from '../../../lib/supabase-controller'

/**
 * Custom hook for chat functionality with AI integration
 * Provides a clean interface for chat components
 */
export const useChat = (user = null) => {
  // Configuration - memoized to prevent infinite re-renders
  const config = useMemo(() => getValidatedConfig(), [])
  const mockResponses = useMemo(() => getMockResponses(), [])

  // AI Controller
  const {
    isLoading,
    error,
    messages,
    isProcessing,
    sendMessage: aiSendMessage,
    initializeThread,
    loadMessages,
    resumeThread,
    clearMessages,
    controller
  } = useAIController(config.openai.apiKey, config.assistant.id)

  // Local state
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const abortControllerRef = useRef(null)

  // Chat initialization with Supabase thread_id
  useEffect(() => {
    const initializeChat = async () => {
      if (!user?.id) return
      try {
        if (config.development.mockResponses) {
          setChatHistory([mockResponses.welcome])
          setIsInitialized(true)
          return
        }
        if (!config.validation.isValid) {
          message.error('AI configuration is invalid. Please check your settings.')
          return
        }
        // 1. Fetch thread_id from Supabase
        let threadIdFromDb = await getUserThreadId(user.id)
        // 2. If no thread_id, create one and update Supabase
        if (!threadIdFromDb) {
          const thread = await controller.createThread()
          threadIdFromDb = thread.id
          await setUserThreadId(user.id, threadIdFromDb)
        }
        // 3. Set threadId in controller, then fetch messages
        controller.setThreadId(threadIdFromDb)
        const response = await controller.getMessages()
        let formattedMessages = response.data.map(formatMessage)
        // Sort by timestamp ascending (oldest first, latest last)
        formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        if (formattedMessages.length === 0) {
          // Add welcome message if thread is new/empty
          formattedMessages = [
            {
              id: 'welcome',
              type: 'assistant',
              content: `Hello${user?.Username ? ` ${user.Username}` : ''}! I'm your Career Match AI assistant. I'm here to help you with resume building, interview preparation, and career guidance. What would you like to work on today?`,
              timestamp: new Date().toISOString()
            }
          ]
        }
        setChatHistory(formattedMessages)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        message.error('Failed to initialize chat. Please try again.')
      }
    }
    initializeChat()
  }, [user, controller, config, mockResponses])

  // Handle AI errors
  useEffect(() => {
    if (error) {
      const userFriendlyError = handleAIError(error)
      message.error(userFriendlyError)
    }
  }, [error])

  // Send message function
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim()) return
      try {
        controller.setThreadId(controller.getThreadId()) // Ensure correct thread is used (no-op if already set)
        // Add user message to chat history immediately
        const userMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: content.trim(),
          timestamp: new Date().toISOString()
        }
        setChatHistory((prev) => [...prev, userMessage])
        setIsTyping(true)
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()
        if (config.development.mockResponses) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
          let aiResponse
          const lowerContent = content.toLowerCase()
          if (lowerContent.includes('resume') || lowerContent.includes('cv')) {
            aiResponse = mockResponses.resumeHelp
          } else if (lowerContent.includes('interview') || lowerContent.includes('prepare')) {
            aiResponse = mockResponses.interviewPrep
          } else if (lowerContent.includes('career') || lowerContent.includes('advice')) {
            aiResponse = mockResponses.careerAdvice
          } else {
            aiResponse = {
              type: 'assistant',
              content:
                "Thank you for your message! I'm here to help you with your career goals. Could you tell me more about what specific area you'd like to focus on - whether it's resume building, interview preparation, or career guidance?",
              timestamp: new Date().toISOString()
            }
          }
          aiResponse.id = Date.now().toString()
          setChatHistory((prev) => [...prev, aiResponse])
        } else {
          // Use real AI controller
          const aiResponse = await aiSendMessage(content.trim())
          if (aiResponse) {
            const assistantMessage = {
              id: aiResponse.id,
              type: 'assistant',
              content: aiResponse.content[0]?.text?.value || 'No response received',
              timestamp: new Date().toISOString()
            }
            setChatHistory((prev) => [...prev, assistantMessage])
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return // Request was cancelled
        }
        console.error('Failed to send message:', error)
        message.error('Failed to send message. Please try again.')
        setChatHistory((prev) => prev.slice(0, -1))
      }
      setIsTyping(false)
      abortControllerRef.current = null
    },
    [aiSendMessage, controller, config.development.mockResponses, mockResponses]
  )

  // Handle file upload
  const handleFileUpload = useCallback((files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date().toISOString()
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
    const fileMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `Uploaded ${newFiles.length} file(s): ${newFiles.map((f) => f.name).join(', ')}`,
      timestamp: new Date().toISOString()
    }
    setChatHistory((prev) => [...prev, fileMessage])
    message.success(`Successfully uploaded ${newFiles.length} file(s)`)
  }, [])

  // Handle file removal
  const handleFileRemove = useCallback((fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
    message.info('File removed')
  }, [])

  // Clear chat
  const clearChat = useCallback(() => {
    setChatHistory([])
    setUploadedFiles([])
    clearMessages()
    message.info('Chat cleared')
  }, [clearMessages])

  // Resume existing conversation
  const resumeConversation = useCallback(
    async (existingThreadId) => {
      try {
        resumeThread(existingThreadId)
        await loadMessages()
        message.success('Conversation resumed')
      } catch (error) {
        console.error('Failed to resume conversation:', error)
        message.error('Failed to resume conversation')
      }
    },
    [resumeThread, loadMessages]
  )

  // Get chat statistics
  const getChatStats = useCallback(() => {
    const userMessages = chatHistory.filter((msg) => msg.type === 'user').length
    const assistantMessages = chatHistory.filter((msg) => msg.type === 'assistant').length
    const totalMessages = chatHistory.length
    return {
      userMessages,
      assistantMessages,
      totalMessages,
      uploadedFiles: uploadedFiles.length,
      threadId: controller.getThreadId()
    }
  }, [chatHistory, uploadedFiles, controller])

  // Check if chat is ready
  const isChatReady = useCallback(() => {
    return isInitialized && (!config.development.mockResponses ? !!controller.getThreadId() : true)
  }, [isInitialized, controller, config.development.mockResponses])

  return {
    // State
    messages: chatHistory,
    isTyping,
    isLoading,
    error,
    uploadedFiles,
    isInitialized,
    isChatReady: isChatReady(),
    threadId: controller.getThreadId(),
    // Actions
    sendMessage,
    handleFileUpload,
    handleFileRemove,
    clearChat,
    resumeConversation,
    // Utilities
    getChatStats,
    // Configuration
    config
  }
}

export default useChat
