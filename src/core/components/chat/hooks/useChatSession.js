// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { message } from 'antd'

const LOAD_MORE_BATCH = 20

/**
 * Generic chat session hook — messaging, streaming, and pagination via a pluggable adapter.
 * @param {{ id?: string, name?: string }|null} user
 * @param {{
 *   chatService: import('../../../../lib/chat/chatServiceAdapter').ChatServiceAdapter,
 *   context?: unknown,
 *   onAfterAssistantReply?: () => void | Promise<void>,
 *   onFileUpload?: (files: FileList | File[], helpers: {
 *     addSystemMessage: (content: string) => void,
 *     setUploadedFiles: React.Dispatch<React.SetStateAction<object[]>>
 *   }) => void | Promise<void>,
 *   onFileRemove?: (fileId: string, uploadedFiles: object[]) => Promise<boolean>,
 *   fetchUploadedFiles?: (userId: string) => Promise<object[]>,
 *   initialVisibleCount?: number
 * }} options
 */
export const useChatSession = (user = null, options = {}) => {
  const {
    chatService,
    context = null,
    onAfterAssistantReply,
    onFileUpload,
    onFileRemove,
    fetchUploadedFiles,
    initialVisibleCount = 20
  } = options

  const contextRef = useRef(context)
  contextRef.current = context

  const [chatHistory, setChatHistory] = useState([])
  const [visibleMessageCount, setVisibleMessageCount] = useState(initialVisibleCount)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [streamingEnabled, setStreamingEnabled] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false)
  const [isClearingSession, setIsClearingSession] = useState(false)
  const abortControllerRef = useRef(null)
  const activeTypewriterRef = useRef(null)

  const hasMoreMessages = chatHistory.length > visibleMessageCount

  const visibleMessages = useMemo(() => {
    if (chatHistory.length <= visibleMessageCount) {
      return chatHistory
    }
    return chatHistory.slice(chatHistory.length - visibleMessageCount)
  }, [chatHistory, visibleMessageCount])

  const addSystemMessage = useCallback((content) => {
    setChatHistory((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        type: 'system',
        content,
        timestamp: new Date().toISOString()
      }
    ])
  }, [])

  useEffect(() => {
    if (!user?.id || !chatService?.fetchHistory) return

    let cancelled = false

    const initializeChat = async () => {
      setIsInitialized(false)

      if (chatService.isMockMode()) {
        if (!cancelled) {
          setChatHistory([chatService.buildWelcomeMessage(user.name)])
          setVisibleMessageCount(initialVisibleCount)
          setIsInitialized(true)
        }
        return
      }

      if (!chatService.isConfigured()) {
        const configMessage =
          chatService.getConfigurationErrorMessage?.() || 'Chat service is not configured.'
        message.error(configMessage)
        if (!cancelled) {
          setChatHistory([chatService.buildWelcomeMessage(user.name)])
          setVisibleMessageCount(initialVisibleCount)
          setIsInitialized(true)
        }
        return
      }

      const historyResult = await chatService.fetchHistory(user.id)
      if (cancelled) return

      if (historyResult.success && historyResult.messages?.length > 0) {
        setChatHistory(historyResult.messages)
        setVisibleMessageCount(Math.min(historyResult.messages.length, initialVisibleCount))
      } else {
        await chatService.ensureSession(user.id)
        if (!cancelled) {
          setChatHistory([chatService.buildWelcomeMessage(user.name)])
          setVisibleMessageCount(initialVisibleCount)
        }
      }

      if (!cancelled) {
        setIsInitialized(true)
      }
    }

    initializeChat()

    return () => {
      cancelled = true
    }
  }, [user?.id, user?.name, chatService, initialVisibleCount])

  useEffect(() => {
    if (currentStreamingMessage && !currentStreamingMessage.isStreaming) {
      setChatHistory((prev) => {
        const exists = prev.some((msg) => msg.id === currentStreamingMessage.id)
        return exists ? prev : [...prev, currentStreamingMessage]
      })
      setTimeout(() => setCurrentStreamingMessage(null), 100)
    }
  }, [currentStreamingMessage])

  const notifyAfterAssistantReply = useCallback(async () => {
    if (!onAfterAssistantReply) return
    await onAfterAssistantReply()
  }, [onAfterAssistantReply])

  const sendMessage = useCallback(
    async (content, useStreaming = null) => {
      if (!content.trim() || isSending || !chatService) return

      const shouldStream = useStreaming !== null ? useStreaming : streamingEnabled

      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString()
      }

      const historyWithUser = [...chatHistory, userMessage]
      setChatHistory(historyWithUser)

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setIsSending(true)

      try {
        if (shouldStream) {
          const streamingId = `assistant-${Date.now()}`
          setIsStreaming(true)

          const typewriter = chatService.createStreamingTypewriter((visibleText, isActive) => {
            setCurrentStreamingMessage({
              id: streamingId,
              type: 'assistant',
              content: visibleText,
              timestamp: new Date().toISOString(),
              isStreaming: isActive
            })
          })
          activeTypewriterRef.current = typewriter

          setCurrentStreamingMessage({
            id: streamingId,
            type: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            isStreaming: true
          })

          const result = await chatService.sendMessage({
            chatHistory: historyWithUser,
            stream: true,
            signal: abortControllerRef.current.signal,
            context: contextRef.current,
            userId: user?.id,
            onChunk: ({ fullContent }) => {
              typewriter.setTarget(fullContent)
            }
          })

          if (!result.success) {
            typewriter.cancel()
            setCurrentStreamingMessage(null)
            message.error(result.error || 'Failed to get a response. Please try again.')
            setChatHistory((prev) => prev.filter((msg) => msg.id !== userMessage.id))
            return
          }

          typewriter.setTarget(result.content || '')
          await typewriter.finish()

          const assistantContent = result.content || ''
          setCurrentStreamingMessage({
            id: streamingId,
            type: 'assistant',
            content: assistantContent,
            timestamp: new Date().toISOString(),
            isStreaming: false
          })

          await notifyAfterAssistantReply()
        } else {
          const result = await chatService.sendMessage({
            chatHistory: historyWithUser,
            stream: false,
            signal: abortControllerRef.current.signal,
            context: contextRef.current,
            userId: user?.id
          })

          if (!result.success) {
            message.error(result.error || 'Failed to get a response. Please try again.')
            setChatHistory((prev) => prev.filter((msg) => msg.id !== userMessage.id))
            return
          }

          const assistantContent = result.content || ''
          setChatHistory((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              type: 'assistant',
              content: assistantContent,
              timestamp: new Date().toISOString()
            }
          ])

          await notifyAfterAssistantReply()
        }
      } catch (error) {
        if (error?.name === 'AbortError') return
        console.error('Failed to send message:', error)
        message.error('Failed to send message. Please try again.')
        setChatHistory((prev) => prev.filter((msg) => msg.id !== userMessage.id))
      } finally {
        setIsSending(false)
        setIsStreaming(false)
        activeTypewriterRef.current = null
        abortControllerRef.current = null
      }
    },
    [chatHistory, isSending, streamingEnabled, notifyAfterAssistantReply, user?.id, chatService]
  )

  const cancelStreaming = useCallback(() => {
    activeTypewriterRef.current?.cancel()
    abortControllerRef.current?.abort()
    setIsStreaming(false)
    setIsSending(false)
    setCurrentStreamingMessage(null)
  }, [])

  const toggleStreaming = useCallback((enabled) => {
    setStreamingEnabled(enabled)
    message.info(`Streaming ${enabled ? 'enabled' : 'disabled'}`)
  }, [])

  const handleFileUpload = useCallback(
    async (files) => {
      if (!onFileUpload) return

      if (!user?.id) {
        message.error('User not authenticated. Please log in to upload files.')
        return
      }

      setIsUploading(true)

      try {
        await onFileUpload(files, { addSystemMessage, setUploadedFiles })
      } catch (error) {
        console.error('Error uploading files:', error)
        message.error('An unexpected error occurred while uploading files')
      } finally {
        setIsUploading(false)
      }
    },
    [user?.id, onFileUpload, addSystemMessage]
  )

  const handleFileRemove = useCallback(
    async (fileId) => {
      if (!onFileRemove) return

      try {
        const removed = await onFileRemove(fileId, uploadedFiles)
        if (removed) {
          setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
          message.success('File removed successfully')
        }
      } catch (error) {
        console.error('Error removing file:', error)
        message.error('An unexpected error occurred while removing file')
      }
    },
    [onFileRemove, uploadedFiles]
  )

  const loadUploadedFiles = useCallback(async () => {
    if (!user?.id || !fetchUploadedFiles) return

    try {
      const files = await fetchUploadedFiles(user.id)
      setUploadedFiles(files)
    } catch (error) {
      console.error('Error loading user files:', error)
    }
  }, [user?.id, fetchUploadedFiles])

  useEffect(() => {
    if (user?.id && isInitialized && fetchUploadedFiles) {
      loadUploadedFiles()
    }
  }, [user?.id, isInitialized, fetchUploadedFiles, loadUploadedFiles])

  const clearChat = useCallback(async () => {
    if (isClearingSession || isSending || !chatService) return

    setIsClearingSession(true)

    try {
      const welcome = chatService.buildWelcomeMessage(user?.name)
      setChatHistory([welcome])
      setVisibleMessageCount(initialVisibleCount)
      setUploadedFiles([])

      if (user?.id && !chatService.isMockMode() && chatService.isConfigured()) {
        const deleted = await chatService.deleteSession(user.id)
        if (!deleted.success) {
          message.error(deleted.error || 'Failed to clear chat session')
          return
        }
        await chatService.ensureSession(user.id)
      }

      message.success('Chat session cleared')
    } catch (error) {
      console.error('clearChat error:', error)
      message.error('Failed to clear chat session')
    } finally {
      setIsClearingSession(false)
    }
  }, [user?.id, user?.name, isClearingSession, isSending, chatService, initialVisibleCount])

  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoadingMore) return

    setIsLoadingMore(true)
    setIsLoadingHistorical(true)

    setVisibleMessageCount((prev) => Math.min(chatHistory.length, prev + LOAD_MORE_BATCH))

    setTimeout(() => {
      setIsLoadingMore(false)
      setIsLoadingHistorical(false)
    }, 300)
  }, [hasMoreMessages, isLoadingMore, chatHistory.length])

  const allMessages = useMemo(() => {
    if (currentStreamingMessage?.isStreaming) {
      return [...visibleMessages, currentStreamingMessage]
    }
    return visibleMessages
  }, [visibleMessages, currentStreamingMessage])

  const isChatReady = useMemo(() => {
    if (!chatService) return false
    return isInitialized && !isSending && (chatService.isMockMode() || chatService.isConfigured())
  }, [isInitialized, isSending, chatService])

  return {
    messages: allMessages,
    isTyping: isSending || isStreaming,
    isLoading: isSending,
    error: null,
    uploadedFiles,
    isInitialized,
    isChatReady,
    isUploading,
    hasMoreMessages,
    isLoadingMore,
    isLoadingHistorical,
    totalMessageCount: chatHistory.length,
    isStreaming,
    streamingEnabled,
    streamingMessage: currentStreamingMessage,
    sendMessage,
    cancelStreaming,
    toggleStreaming,
    handleFileUpload,
    handleFileRemove,
    clearChat,
    isClearingSession,
    loadMoreMessages
  }
}

export default useChatSession
