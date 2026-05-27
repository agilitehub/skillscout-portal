// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { message } from 'antd'
import {
  sendCandidateChatMessage,
  buildWelcomeMessage,
  isOpenClawMockMode,
  isOpenClawConfigured
} from '../../../lib/openclaw'
import { createStreamingTypewriter } from '../../../lib/openclaw/stream-utils'
import {
  uploadMultipleFiles,
  getUserFiles,
  deleteFileFromStorage
} from '../../../core/infra/supabase-controller'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../../constants'

const CHAT_HISTORY_STORAGE_KEY = (userId) => `skillscout_candidate_chat_${userId}`
const INITIAL_VISIBLE_MESSAGES = 20
const LOAD_MORE_BATCH = 20

const loadStoredChatHistory = (userId) => {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const saveStoredChatHistory = (userId, history) => {
  try {
    localStorage.setItem(CHAT_HISTORY_STORAGE_KEY(userId), JSON.stringify(history))
  } catch (error) {
    console.warn('Failed to persist chat history:', error)
  }
}

/**
 * Candidate chat hook — OpenClaw-backed messaging with local history and Supabase file storage.
 */
export const useChat = (user = null) => {
  const [chatHistory, setChatHistory] = useState([])
  const [visibleMessageCount, setVisibleMessageCount] = useState(INITIAL_VISIBLE_MESSAGES)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [streamingEnabled, setStreamingEnabled] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false)
  const abortControllerRef = useRef(null)
  const activeTypewriterRef = useRef(null)

  const hasMoreMessages = chatHistory.length > visibleMessageCount

  const visibleMessages = useMemo(() => {
    if (chatHistory.length <= visibleMessageCount) {
      return chatHistory
    }
    return chatHistory.slice(chatHistory.length - visibleMessageCount)
  }, [chatHistory, visibleMessageCount])

  // Initialize chat from localStorage or welcome message
  useEffect(() => {
    if (!user?.id) return

    const stored = loadStoredChatHistory(user.id)
    if (stored?.length) {
      setChatHistory(stored)
      setVisibleMessageCount(Math.min(stored.length, INITIAL_VISIBLE_MESSAGES))
    } else if (isOpenClawMockMode()) {
      setChatHistory([buildWelcomeMessage(user.name)])
    } else if (!isOpenClawConfigured()) {
      message.error('OpenClaw is not configured. Set REACT_APP_OPENCLAW_BASE_URL or enable REACT_APP_MOCK_AI.')
      setChatHistory([buildWelcomeMessage(user.name)])
    } else {
      setChatHistory([buildWelcomeMessage(user.name)])
    }

    setIsInitialized(true)
  }, [user?.id, user?.name])

  // Persist chat history
  useEffect(() => {
    if (!user?.id || !isInitialized) return
    saveStoredChatHistory(user.id, chatHistory)
  }, [user?.id, chatHistory, isInitialized])

  // Finalize streaming message into history
  useEffect(() => {
    if (currentStreamingMessage && !currentStreamingMessage.isStreaming) {
      setChatHistory((prev) => {
        const exists = prev.some((msg) => msg.id === currentStreamingMessage.id)
        return exists ? prev : [...prev, currentStreamingMessage]
      })
      setTimeout(() => setCurrentStreamingMessage(null), 100)
    }
  }, [currentStreamingMessage])

  const sendMessage = useCallback(
    async (content, useStreaming = null) => {
      if (!content.trim() || isSending) return

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

          const typewriter = createStreamingTypewriter((visibleText, isActive) => {
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

          const result = await sendCandidateChatMessage({
            chatHistory: historyWithUser,
            stream: true,
            signal: abortControllerRef.current.signal,
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

          setCurrentStreamingMessage({
            id: streamingId,
            type: 'assistant',
            content: result.content || '',
            timestamp: new Date().toISOString(),
            isStreaming: false
          })
        } else {
          const result = await sendCandidateChatMessage({
            chatHistory: historyWithUser,
            stream: false,
            signal: abortControllerRef.current.signal
          })

          if (!result.success) {
            message.error(result.error || 'Failed to get a response. Please try again.')
            setChatHistory((prev) => prev.filter((msg) => msg.id !== userMessage.id))
            return
          }

          setChatHistory((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              type: 'assistant',
              content: result.content || '',
              timestamp: new Date().toISOString()
            }
          ])
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
    [chatHistory, isSending, streamingEnabled]
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
      if (!user?.id) {
        message.error('User not authenticated. Please log in to upload files.')
        return
      }

      setIsUploading(true)

      try {
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

          setChatHistory((prev) => [
            ...prev,
            {
              id: `system-${Date.now()}`,
              type: 'system',
              content: `Uploaded ${newFiles.length} file(s): ${newFiles.map((f) => f.name).join(', ')}`,
              timestamp: new Date().toISOString()
            }
          ])

          message.success(`Successfully uploaded ${newFiles.length} file(s)`)

          if (uploadResult.data.failed.length > 0) {
            message.warning(`Failed to upload: ${uploadResult.data.failed.map((f) => f.file).join(', ')}`)
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

  const handleFileRemove = useCallback(
    async (fileId) => {
      try {
        const fileToRemove = uploadedFiles.find((file) => file.id === fileId)
        if (!fileToRemove) return

        const deleteResult = await deleteFileFromStorage(fileToRemove.path, DEFAULT_SUPABASE_STORAGE_BUCKET)
        if (deleteResult.success) {
          setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
          message.success('File removed successfully')
        } else {
          message.error(deleteResult.error || 'Failed to remove file')
        }
      } catch (error) {
        console.error('Error removing file:', error)
        message.error('An unexpected error occurred while removing file')
      }
    },
    [uploadedFiles]
  )

  const loadUserFiles = useCallback(async () => {
    if (!user?.id) return

    try {
      const result = await getUserFiles(user.id, DEFAULT_SUPABASE_STORAGE_BUCKET)
      if (result.success) {
        setUploadedFiles(
          result.files.map((file) => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
            path: `${user.id}/${file.name}`,
            uploadedAt: file.createdAt,
            userId: file.userId
          }))
        )
      }
    } catch (error) {
      console.error('Error loading user files:', error)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id && isInitialized) {
      loadUserFiles()
    }
  }, [user?.id, isInitialized, loadUserFiles])

  const clearChat = useCallback(() => {
    setChatHistory([buildWelcomeMessage(user?.name)])
    setVisibleMessageCount(INITIAL_VISIBLE_MESSAGES)
    setUploadedFiles([])
    if (user?.id) {
      saveStoredChatHistory(user.id, [buildWelcomeMessage(user?.name)])
    }
    message.info('Chat cleared')
  }, [user?.id, user?.name])

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

  const isChatReady = useCallback(() => {
    return isInitialized && !isSending && (isOpenClawMockMode() || isOpenClawConfigured())
  }, [isInitialized, isSending])

  return {
    messages: allMessages,
    isTyping: isSending || isStreaming,
    isLoading: isSending,
    error: null,
    uploadedFiles,
    isInitialized,
    isChatReady: isChatReady(),
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
    loadMoreMessages
  }
}

export default useChat
