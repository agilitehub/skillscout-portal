// Global Instructions Rule Applied!
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { message } from 'antd'
import { useAIController, handleAIError, formatMessage } from '../../../lib/ai-controller'
import { getValidatedConfig, getMockResponses } from '../../../lib/ai-config'
import {
  getUserThreadId,
  setUserThreadId,
  uploadMultipleFiles,
  getUserFiles,
  deleteFileFromStorage
} from '../../../core/lib/supabase-controller'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../../utils/globals'

/**
 * Custom hook for chat functionality with AI integration, Supabase file storage, and streaming support
 * Provides a clean interface for chat components with persistent file storage and real-time streaming
 */
export const useChat = (user = null) => {
  // Configuration - memoized to prevent infinite re-renders
  const config = useMemo(() => getValidatedConfig(), [])
  const mockResponses = useMemo(() => getMockResponses(), [])

  // AI Controller with streaming support (using controller directly to avoid dual message state)
  const { isLoading, error, cancelStream, loadMessages, resumeThread, clearMessages, isStreaming, controller } =
    useAIController(config.openai.apiKey, config.assistant.id)

  // Local state
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [messageLimit, setMessageLimit] = useState(5) // Start with 5 messages
  const [hasMoreMessages, setHasMoreMessages] = useState(false) // Track if more messages exist
  const [isLoadingMore, setIsLoadingMore] = useState(false) // Loading state for pagination
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false) // Track historical loading
  const [totalMessageCount, setTotalMessageCount] = useState(0) // Track total messages available
  const [streamingEnabled, setStreamingEnabled] = useState(true) // Control streaming feature
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null) // Local streaming state
  const abortControllerRef = useRef(null)

  // Chat initialization with Supabase thread_id
  useEffect(() => {
    const initializeChat = async () => {
      if (!user?.id) return
      try {
        if (config.development.mockResponses) {
          setChatHistory([mockResponses.welcome])
          setIsInitialized(true)
          setHasMoreMessages(false) // Mock responses don't have pagination
          setTotalMessageCount(1)
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

        // Get messages with the current limit
        const response = await controller.getMessages(messageLimit)
        let formattedMessages = response.data.map(formatMessage)
        // Sort by timestamp ascending (oldest first, latest last)
        formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        // Set total message count based on what we received
        const receivedCount = response.data.length
        setTotalMessageCount(receivedCount)

        // Check if there are more messages available using OpenAI's has_more field
        const hasMore = response.has_more || false
        setHasMoreMessages(hasMore)

        console.log('Chat initialization:', {
          messageLimit,
          receivedCount,
          hasMoreMessages: hasMore,
          hasMoreFromAPI: response.has_more,
          formattedMessagesLength: formattedMessages.length,
          reachedEnd: !hasMore
        })

        if (formattedMessages.length === 0) {
          // Add welcome message if thread is new/empty
          formattedMessages = [
            {
              id: 'welcome',
              type: 'assistant',
              content: `Hello${user?.Username ? ` ${user.Username}` : ''}! I'm your SkillScout assistant. I'm here to help you with resume building, interview preparation, and career guidance. What would you like to work on today?`,
              timestamp: new Date().toISOString()
            }
          ]
          setTotalMessageCount(1)
          setHasMoreMessages(false)
        }
        setChatHistory(formattedMessages)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        message.error('Failed to initialize chat. Please try again.')
      }
    }
    initializeChat()
  }, [user, controller, config, mockResponses, messageLimit])

  // Load messages when messageLimit changes (for pagination) - but not during loadMoreMessages
  useEffect(() => {
    const loadMessagesWithLimit = async () => {
      // Skip if we're currently loading more messages (handled directly in loadMoreMessages)
      if (!user?.id || !isInitialized || !controller.getThreadId() || config.development.mockResponses || isLoadingMore)
        return

      try {
        const response = await controller.getMessages(messageLimit)
        let formattedMessages = response.data.map(formatMessage)
        formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        // Update total count with what we actually received
        const receivedCount = response.data.length
        setTotalMessageCount(receivedCount)

        // Update hasMoreMessages using OpenAI's has_more field
        const hasMore = response.has_more || false
        setHasMoreMessages(hasMore)
        setChatHistory(formattedMessages)

        console.log('Load messages with limit (useEffect):', {
          messageLimit,
          receivedCount,
          hasMoreMessages: hasMore,
          hasMoreFromAPI: response.has_more,
          formattedMessagesLength: formattedMessages.length,
          reachedEnd: !hasMore
        })
      } catch (error) {
        console.error('Failed to load messages with new limit:', error)
      }
    }

    loadMessagesWithLimit()
  }, [messageLimit, user?.id, isInitialized, controller, config.development.mockResponses, isLoadingMore])

  // Handle AI errors
  useEffect(() => {
    if (error) {
      const userFriendlyError = handleAIError(error)
      message.error(userFriendlyError)
    }
  }, [error])

  // Handle completed streaming messages
  useEffect(() => {
    if (currentStreamingMessage && !currentStreamingMessage.isStreaming) {
      // Streaming completed - add final message to chat history
      setChatHistory((prev) => {
        // Make sure we don't duplicate the message
        const messageExists = prev.some((msg) => msg.id === currentStreamingMessage.id)
        if (messageExists) {
          return prev
        }
        return [...prev, currentStreamingMessage]
      })

      // Clear streaming state
      setTimeout(() => setCurrentStreamingMessage(null), 100)
    }
  }, [currentStreamingMessage])

  // Custom streaming handler
  const handleStreamingMessage = useCallback(
    async (content) => {
      try {
        // Initialize streaming message
        const tempStreamingMessage = {
          id: `streaming-${Date.now()}`,
          type: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          isStreaming: true
        }
        setCurrentStreamingMessage(tempStreamingMessage)

        // Track current displayed content and typewriter state
        let currentDisplayedContent = ''
        let typewriterTimeout = null
        let latestTargetContent = ''
        let isStreamingComplete = false

        // Function to animate character-by-character display
        const animateContent = (targetContent, messageId) => {
          latestTargetContent = targetContent

          if (typewriterTimeout) {
            clearTimeout(typewriterTimeout)
          }

          const animate = () => {
            if (currentDisplayedContent.length < latestTargetContent.length) {
              currentDisplayedContent = latestTargetContent.slice(0, currentDisplayedContent.length + 1)

              setCurrentStreamingMessage((prev) => ({
                ...prev,
                id: messageId || prev.id,
                content: currentDisplayedContent,
                isStreaming: true
              }))

              typewriterTimeout = setTimeout(animate, 15) // 15ms delay between characters
            } else if (isStreamingComplete && currentDisplayedContent === latestTargetContent) {
              // All content displayed and streaming is complete, mark as finished
              setCurrentStreamingMessage((prev) => ({
                ...prev,
                id: messageId || prev.id,
                content: latestTargetContent,
                isStreaming: false
              }))
            }
          }

          animate()
        }

        // Stream the response using controller directly
        await controller.streamAssistantResponse(
          content,
          null,
          // onChunk callback
          ({ chunk, fullContent, messageId }) => {
            animateContent(fullContent, messageId)
          },
          // onComplete callback
          (finalMessage) => {
            // Mark streaming as complete but let typewriter finish
            isStreamingComplete = true
            latestTargetContent = finalMessage.content[0]?.text?.value || finalMessage.content || ''

            // Trigger animation to complete any remaining characters
            animateContent(latestTargetContent, finalMessage.id)

            setTotalMessageCount((prev) => prev + 1)
          },
          // onError callback
          (streamError) => {
            // Clear any pending typewriter timeout
            if (typewriterTimeout) {
              clearTimeout(typewriterTimeout)
            }
            console.error('Streaming error:', streamError)
            setCurrentStreamingMessage(null)
            throw streamError
          }
        )
      } catch (error) {
        setCurrentStreamingMessage(null)
        throw error
      }
    },
    [controller]
  )

  // Send message function with streaming support
  const sendMessage = useCallback(
    async (content, useStreaming = null) => {
      if (!content.trim()) return

      // Use the streaming preference if not explicitly set
      const shouldUseStreaming = useStreaming !== null ? useStreaming : streamingEnabled

      try {
        controller.setThreadId(controller.getThreadId()) // Ensure correct thread is used (no-op if already set)

        setIsTyping(true)

        // Update total message count for user message
        setTotalMessageCount((prev) => prev + 1)

        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        if (config.development.mockResponses) {
          // Add user message to chat history immediately for mock mode
          const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString()
          }
          setChatHistory((prev) => [...prev, userMessage])

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
          setTotalMessageCount((prev) => prev + 1)
        } else {
          // Add user message to chat history immediately for both streaming and non-streaming
          const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString()
          }
          setChatHistory((prev) => [...prev, userMessage])

          // Use real AI controller with streaming support
          if (shouldUseStreaming) {
            // Handle streaming directly here
            await handleStreamingMessage(content.trim())
          } else {
            // Handle non-streaming
            const aiResponse = await controller.sendMessageAndGetResponse(content.trim())
            if (aiResponse) {
              const assistantMessage = {
                id: aiResponse.id,
                type: 'assistant',
                content: aiResponse.content[0]?.text?.value || 'No response received',
                timestamp: new Date().toISOString()
              }
              setChatHistory((prev) => [...prev, assistantMessage])
              setTotalMessageCount((prev) => prev + 1) // For assistant message
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return // Request was cancelled
        }
        console.error('Failed to send message:', error)
        message.error('Failed to send message. Please try again.')
        // Revert message count if message failed
        setTotalMessageCount((prev) => Math.max(0, prev - (shouldUseStreaming ? 1 : 2)))
      } finally {
        setIsTyping(false)
        abortControllerRef.current = null
      }
    },
    [controller, config.development.mockResponses, mockResponses, streamingEnabled, handleStreamingMessage]
  )

  // Cancel streaming
  const cancelStreaming = useCallback(() => {
    cancelStream()
    setIsTyping(false)
  }, [cancelStream])

  // Toggle streaming mode
  const toggleStreaming = useCallback((enabled) => {
    setStreamingEnabled(enabled)
    message.info(`Streaming ${enabled ? 'enabled' : 'disabled'}`)
  }, [])

  // Handle file upload with Supabase storage integration
  const handleFileUpload = useCallback(
    async (files) => {
      if (!user?.id) {
        message.error('User not authenticated. Please log in to upload files.')
        return
      }

      setIsUploading(true)

      try {
        // Upload files to Supabase storage
        const uploadResult = await uploadMultipleFiles(files, user.id, DEFAULT_SUPABASE_STORAGE_BUCKET)

        if (uploadResult.success) {
          const newFiles = uploadResult.data.successful.map((fileData) => ({
            id: fileData.id,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            url: fileData.url,
            path: fileData.path,
            uploadedAt: fileData.uploadedAt,
            userId: fileData.userId
          }))

          setUploadedFiles((prev) => [...prev, ...newFiles])

          // Add system message for uploaded files
          const fileMessage = {
            id: Date.now().toString(),
            type: 'system',
            content: `Uploaded ${newFiles.length} file(s): ${newFiles.map((f) => f.name).join(', ')}`,
            timestamp: new Date().toISOString()
          }
          setChatHistory((prev) => [...prev, fileMessage])
          setTotalMessageCount((prev) => prev + 1)

          message.success(`Successfully uploaded ${newFiles.length} file(s)`)

          // Show failed uploads if any
          if (uploadResult.data.failed.length > 0) {
            const failedNames = uploadResult.data.failed.map((f) => f.file).join(', ')
            message.warning(`Failed to upload: ${failedNames}`)
          }
        } else {
          message.error(uploadResult.error || 'Failed to upload files')
        }
      } catch (error) {
        console.error('Error uploading files:', error)
        message.error('An unexpected error occurred while uploading files')
      } finally {
        setIsUploading(false)
      }
    },
    [user?.id]
  )

  // Handle file removal with Supabase storage cleanup
  const handleFileRemove = useCallback(
    async (fileId) => {
      try {
        const fileToRemove = uploadedFiles.find((file) => file.id === fileId)

        if (fileToRemove) {
          // Delete from Supabase storage
          const deleteResult = await deleteFileFromStorage(fileToRemove.path, DEFAULT_SUPABASE_STORAGE_BUCKET)

          if (deleteResult.success) {
            setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
            message.success('File removed successfully')
          } else {
            message.error(deleteResult.error || 'Failed to remove file')
          }
        }
      } catch (error) {
        console.error('Error removing file:', error)
        message.error('An unexpected error occurred while removing file')
      }
    },
    [uploadedFiles]
  )

  // Load user's existing files from Supabase storage
  const loadUserFiles = useCallback(async () => {
    if (!user?.id) return

    try {
      const result = await getUserFiles(user.id, DEFAULT_SUPABASE_STORAGE_BUCKET)

      if (result.success) {
        const filesWithMetadata = result.files.map((file) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          path: `${user.id}/${file.name}`,
          uploadedAt: file.createdAt,
          userId: file.userId
        }))

        setUploadedFiles(filesWithMetadata)
      } else {
        console.error('Failed to load user files:', result.error)
      }
    } catch (error) {
      console.error('Error loading user files:', error)
    }
  }, [user?.id])

  // Initialize chat with user files
  useEffect(() => {
    if (user?.id && isInitialized) {
      loadUserFiles()
    }
  }, [user?.id, isInitialized, loadUserFiles])

  // Clear chat and files
  const clearChat = useCallback(() => {
    setChatHistory([])
    setUploadedFiles([])
    setTotalMessageCount(0)
    setHasMoreMessages(false)
    setMessageLimit(5) // Reset to initial limit
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
      threadId: controller.getThreadId(),
      streamingEnabled,
      isStreaming
    }
  }, [chatHistory, uploadedFiles, controller, streamingEnabled, isStreaming])

  // Check if chat is ready
  const isChatReady = useCallback(() => {
    return isInitialized && (!config.development.mockResponses ? !!controller.getThreadId() : true) && !isStreaming
  }, [isInitialized, controller, config.development.mockResponses, isStreaming])

  // Load more messages - now loads ALL remaining messages
  const loadMoreMessages = useCallback(async () => {
    if (!user?.id || !isInitialized || !hasMoreMessages || isLoadingMore) return

    setIsLoadingMore(true)
    setIsLoadingHistorical(true)

    try {
      console.log('Loading all remaining messages...')

      // Use the getAllMessages function to fetch all messages
      const response = await controller.getAllMessages(20)
      let formattedMessages = response.data.map(formatMessage)
      formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

      const totalCount = formattedMessages.length

      // Update state - since we loaded all messages, there are no more to load
      setTotalMessageCount(totalCount)
      setChatHistory(formattedMessages)
      setHasMoreMessages(false) // No more messages since we loaded them all
      setMessageLimit(totalCount) // Update limit to reflect all messages loaded

      console.log('Load all messages result:', {
        totalMessagesLoaded: totalCount,
        hasMoreMessages: false,
        reachedEnd: true
      })
    } catch (error) {
      console.error('Error loading all messages:', error)
      message.error('Failed to load previous messages. Please try again.')
    } finally {
      setIsLoadingMore(false)
      // Keep isLoadingHistorical true for a bit longer to prevent auto-scroll
      setTimeout(() => setIsLoadingHistorical(false), 500)
    }
  }, [user?.id, isInitialized, hasMoreMessages, isLoadingMore, controller])

  // Combine chat history with current streaming message for display
  const allMessages = useMemo(() => {
    if (currentStreamingMessage && currentStreamingMessage.isStreaming) {
      return [...chatHistory, currentStreamingMessage]
    }
    return chatHistory
  }, [chatHistory, currentStreamingMessage])

  return {
    // State
    messages: allMessages,
    isTyping: isTyping || isStreaming,
    isLoading,
    error,
    uploadedFiles,
    isInitialized,
    isChatReady: isChatReady(),
    isUploading,
    threadId: controller.getThreadId(),
    messageLimit,
    hasMoreMessages,
    isLoadingMore,
    isLoadingHistorical,
    totalMessageCount,

    // Streaming state
    isStreaming,
    streamingEnabled,
    streamingMessage: currentStreamingMessage,

    // Actions
    sendMessage,
    cancelStreaming,
    toggleStreaming,
    handleFileUpload,
    handleFileRemove,
    clearChat,
    resumeConversation,
    loadMoreMessages,

    // Utilities
    getChatStats,

    // Configuration
    config
  }
}

export default useChat
