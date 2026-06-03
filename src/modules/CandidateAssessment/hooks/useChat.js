// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { message } from 'antd'
import {
  sendCandidateChatMessage,
  buildWelcomeMessage,
  isHermesMockMode,
  isHermesConfigured,
  createStreamingTypewriter,
  fetchCandidateChatHistory,
  ensureCandidateChatSession,
  deleteCandidateChatSession
} from '../../../lib/hermes'
import {
  uploadMultipleFiles,
  getUserFiles,
  deleteFileFromStorage
} from '../../../core/infra/supabase-controller'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../../constants'
import { CV_ACCEPTED_MIME_TYPES } from '../model/chatAttachmentRules'
import { ingestResumeFile } from '../controllers/resumeIngestion'

const INITIAL_VISIBLE_MESSAGES = 20
const LOAD_MORE_BATCH = 20
/** Brief delay before refresh so async MCP writes can complete. */
const LIVE_RESUME_REFRESH_DELAY_MS = 300

const isCvFile = (file) => CV_ACCEPTED_MIME_TYPES.includes(file.type)

/**
 * Candidate chat hook — Hermes-backed messaging; live resume refresh after replies.
 * @param {{ id?: string, name?: string }|null} user
 * @param {{ liveResumeContext?: object|null, onResumeUpdated?: () => void }} options
 */
export const useChat = (user = null, options = {}) => {
  const { liveResumeContext = null, onResumeUpdated } = options
  const liveResumeContextRef = useRef(liveResumeContext)
  liveResumeContextRef.current = liveResumeContext

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

  useEffect(() => {
    if (!user?.id) return

    let cancelled = false

    const initializeChat = async () => {
      setIsInitialized(false)

      if (isHermesMockMode()) {
        if (!cancelled) {
          setChatHistory([buildWelcomeMessage(user.name)])
          setVisibleMessageCount(INITIAL_VISIBLE_MESSAGES)
          setIsInitialized(true)
        }
        return
      }

      if (!isHermesConfigured()) {
        message.error(
          'Hermes is not configured. Set REACT_APP_HERMES_BASE_URL and REACT_APP_HERMES_API_KEY, or enable REACT_APP_MOCK_AI.'
        )
        if (!cancelled) {
          setChatHistory([buildWelcomeMessage(user.name)])
          setVisibleMessageCount(INITIAL_VISIBLE_MESSAGES)
          setIsInitialized(true)
        }
        return
      }

      const historyResult = await fetchCandidateChatHistory(user.id)
      if (cancelled) return

      if (historyResult.success && historyResult.messages.length > 0) {
        setChatHistory(historyResult.messages)
        setVisibleMessageCount(Math.min(historyResult.messages.length, INITIAL_VISIBLE_MESSAGES))
      } else {
        await ensureCandidateChatSession(user.id)
        if (!cancelled) {
          setChatHistory([buildWelcomeMessage(user.name)])
          setVisibleMessageCount(INITIAL_VISIBLE_MESSAGES)
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
  }, [user?.id, user?.name])

  useEffect(() => {
    if (currentStreamingMessage && !currentStreamingMessage.isStreaming) {
      setChatHistory((prev) => {
        const exists = prev.some((msg) => msg.id === currentStreamingMessage.id)
        return exists ? prev : [...prev, currentStreamingMessage]
      })
      setTimeout(() => setCurrentStreamingMessage(null), 100)
    }
  }, [currentStreamingMessage])

  const refreshLiveResumeAfterChat = useCallback(async () => {
    if (!onResumeUpdated) return
    await new Promise((resolve) => setTimeout(resolve, LIVE_RESUME_REFRESH_DELAY_MS))
    onResumeUpdated()
  }, [onResumeUpdated])

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
            liveResumeContext: liveResumeContextRef.current,
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

          await refreshLiveResumeAfterChat()
        } else {
          const result = await sendCandidateChatMessage({
            chatHistory: historyWithUser,
            stream: false,
            signal: abortControllerRef.current.signal,
            liveResumeContext: liveResumeContextRef.current,
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

          await refreshLiveResumeAfterChat()
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
    [chatHistory, isSending, streamingEnabled, refreshLiveResumeAfterChat, user?.id]
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
        const fileArray = Array.from(files)
        const cvFiles = fileArray.filter(isCvFile)
        const otherFiles = fileArray.filter((f) => !isCvFile(f))

        if (fileArray.length === 1 && cvFiles.length === 1) {
          const ingestResult = await ingestResumeFile(user.id, cvFiles[0], { setAsPrimary: true })
          if (ingestResult.success) {
            setChatHistory((prev) => [
              ...prev,
              {
                id: `system-${Date.now()}`,
                type: 'system',
                content: `Resume uploaded and analyzed: ${cvFiles[0].name}`,
                timestamp: new Date().toISOString()
              }
            ])
            message.success('Resume uploaded and added to your live profile.')
            if (onResumeUpdated) onResumeUpdated()
          } else {
            message.error(ingestResult.error || 'Failed to process resume')
          }
          return
        }

        if (otherFiles.length > 0) {
          const uploadResult = await uploadMultipleFiles(otherFiles, user.id, DEFAULT_SUPABASE_STORAGE_BUCKET)

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

            if (uploadResult.data.failed.length > 0) {
              message.warning(`Failed to upload: ${uploadResult.data.failed.map((f) => f.file).join(', ')}`)
            }
          } else {
            message.error(uploadResult.error || 'Failed to upload files')
          }
        }

        if (cvFiles.length > 0) {
          for (let i = 0; i < cvFiles.length; i += 1) {
            await ingestResumeFile(user.id, cvFiles[i], { setAsPrimary: i === 0 })
          }
          setChatHistory((prev) => [
            ...prev,
            {
              id: `system-${Date.now()}`,
              type: 'system',
              content: `Resume(s) uploaded and analyzed: ${cvFiles.map((f) => f.name).join(', ')}`,
              timestamp: new Date().toISOString()
            }
          ])
          message.success(`Processed ${cvFiles.length} resume file(s).`)
          if (onResumeUpdated) onResumeUpdated()
        } else if (otherFiles.length > 0) {
          message.success(`Successfully uploaded ${otherFiles.length} file(s)`)
        }
      } catch (error) {
        console.error('Error uploading files:', error)
        message.error('An unexpected error occurred while uploading files')
      } finally {
        setIsUploading(false)
      }
    },
    [user?.id, onResumeUpdated]
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

  const clearChat = useCallback(async () => {
    if (isClearingSession || isSending) return

    setIsClearingSession(true)

    try {
      const welcome = buildWelcomeMessage(user?.name)
      setChatHistory([welcome])
      setVisibleMessageCount(INITIAL_VISIBLE_MESSAGES)
      setUploadedFiles([])

      if (user?.id && !isHermesMockMode() && isHermesConfigured()) {
        const deleted = await deleteCandidateChatSession(user.id)
        if (!deleted.success) {
          message.error(deleted.error || 'Failed to clear Hermes session')
          return
        }
        await ensureCandidateChatSession(user.id)
      }

      message.success('Chat session cleared')
    } catch (error) {
      console.error('clearChat error:', error)
      message.error('Failed to clear chat session')
    } finally {
      setIsClearingSession(false)
    }
  }, [user?.id, user?.name, isClearingSession, isSending])

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
    return isInitialized && !isSending && (isHermesMockMode() || isHermesConfigured())
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
    isClearingSession,
    loadMoreMessages
  }
}

export default useChat
