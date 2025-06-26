// Global Instructions Rule Applied!
import { useState, useCallback, useRef } from 'react'

/**
 * AI Controller for OpenAI Threads Integration (v2 API)
 * Handles thread management, message sending, and AI responses with streaming support
 */
class AIController {
  constructor(apiKey, assistantId = null) {
    this.apiKey = apiKey
    this.assistantId = assistantId
    this.baseURL = 'https://api.openai.com/v1'
    this.threadId = null
    this.runId = null
    this.isProcessing = false
    this.isStreaming = false
    this.streamController = null
  }

  /**
   * Initialize a new thread
   */
  async createThread() {
    try {
      const response = await fetch(`${this.baseURL}/threads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`)
      }

      const data = await response.json()
      this.threadId = data.id
      return data
    } catch (error) {
      console.error('Error creating thread:', error)
      throw error
    }
  }

  /**
   * Add a message to the thread
   */
  async addMessage(content, role = 'user') {
    if (!this.threadId) {
      throw new Error('No thread available. Create a thread first.')
    }

    try {
      const response = await fetch(`${this.baseURL}/threads/${this.threadId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role,
          content
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to add message: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  }

  /**
   * Run the assistant on the thread with streaming support
   */
  async runAssistant(assistantId = null, stream = false) {
    if (!this.threadId) {
      throw new Error('No thread available. Create a thread first.')
    }

    const targetAssistantId = assistantId || this.assistantId
    if (!targetAssistantId) {
      throw new Error('No assistant ID provided')
    }

    try {
      const body = {
        assistant_id: targetAssistantId
      }

      if (stream) {
        body.stream = true
      }

      const response = await fetch(`${this.baseURL}/threads/${this.threadId}/runs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`Failed to run assistant: ${response.status}`)
      }

      if (stream) {
        return response // Return the raw response for streaming
      }

      const data = await response.json()
      this.runId = data.id
      return data
    } catch (error) {
      console.error('Error running assistant:', error)
      throw error
    }
  }

  /**
   * Stream assistant response with real-time updates
   */
  async streamAssistantResponse(content, assistantId = null, onChunk = null, onComplete = null, onError = null) {
    try {
      this.isProcessing = true
      this.isStreaming = true

      // Create an AbortController for stream cancellation
      this.streamController = new AbortController()

      // Add user message first
      await this.addMessage(content, 'user')

      // Start streaming run
      const response = await this.runAssistant(assistantId, true)

      if (!response.body) {
        throw new Error('No response body for streaming')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let currentMessageContent = ''
      let messageId = null

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          // Check if stream was cancelled
          if (this.streamController.signal.aborted) {
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim()

            if (trimmedLine === '') continue
            if (trimmedLine === 'data: [DONE]') {
              // Stream completed
              if (onComplete && currentMessageContent) {
                onComplete({
                  id: messageId || Date.now().toString(),
                  content: currentMessageContent,
                  type: 'assistant',
                  timestamp: new Date().toISOString()
                })
              }
              return {
                id: messageId || Date.now().toString(),
                content: currentMessageContent,
                type: 'assistant',
                timestamp: new Date().toISOString()
              }
            }

            if (trimmedLine.startsWith('data: ')) {
              try {
                const eventData = trimmedLine.slice(6) // Remove 'data: ' prefix
                const parsed = JSON.parse(eventData)

                // Handle different event types
                if (parsed.object === 'thread.message.delta') {
                  // This is a message content delta
                  if (parsed.delta?.content) {
                    for (const contentItem of parsed.delta.content) {
                      if (contentItem.type === 'text' && contentItem.text?.value) {
                        const chunk = contentItem.text.value
                        currentMessageContent += chunk

                        // Call chunk callback for real-time updates
                        if (onChunk) {
                          onChunk({
                            chunk,
                            fullContent: currentMessageContent,
                            messageId: parsed.id || messageId
                          })
                        }
                      }
                    }
                  }

                  // Store message ID for later use
                  if (parsed.id && !messageId) {
                    messageId = parsed.id
                  }
                } else if (parsed.object === 'thread.message') {
                  // Complete message received
                  if (parsed.role === 'assistant' && parsed.content) {
                    const textContent = parsed.content
                      .filter((item) => item.type === 'text')
                      .map((item) => item.text.value)
                      .join('')

                    if (textContent && !currentMessageContent) {
                      currentMessageContent = textContent
                      messageId = parsed.id

                      // If we haven't been streaming chunks, send the complete message
                      if (onChunk) {
                        onChunk({
                          chunk: textContent,
                          fullContent: textContent,
                          messageId: parsed.id
                        })
                      }
                    }
                  }
                } else if (parsed.object === 'thread.run') {
                  // Run status updates
                  console.log('Run status:', parsed.status)
                  if (parsed.status === 'completed' && currentMessageContent) {
                    if (onComplete) {
                      onComplete({
                        id: messageId || Date.now().toString(),
                        content: currentMessageContent,
                        type: 'assistant',
                        timestamp: new Date().toISOString()
                      })
                    }
                  } else if (parsed.status === 'failed') {
                    throw new Error(`Run failed: ${parsed.last_error?.message || 'Unknown error'}`)
                  }
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', parseError, 'Raw data:', trimmedLine.slice(6))
                // Continue processing other lines
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Return the final message if we have content
      if (currentMessageContent) {
        return {
          id: messageId || Date.now().toString(),
          content: currentMessageContent,
          type: 'assistant',
          timestamp: new Date().toISOString()
        }
      }

      throw new Error('No content received from stream')
    } catch (error) {
      if (onError) {
        onError(error)
      }
      console.error('Error in streamAssistantResponse:', error)
      throw error
    } finally {
      this.isProcessing = false
      this.isStreaming = false
      this.streamController = null
    }
  }

  /**
   * Cancel ongoing stream
   */
  cancelStream() {
    if (this.streamController) {
      this.streamController.abort()
      this.isStreaming = false
      this.isProcessing = false
    }
  }

  /**
   * Check run status
   */
  async checkRunStatus() {
    if (!this.threadId || !this.runId) {
      throw new Error('No thread or run available')
    }

    try {
      const response = await fetch(`${this.baseURL}/threads/${this.threadId}/runs/${this.runId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to check run status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error checking run status:', error)
      throw error
    }
  }

  /**
   * Get messages from thread with proper pagination support
   */
  async getMessages(limit = 20, order = 'desc', after = null, before = null) {
    if (!this.threadId) {
      throw new Error('No thread available')
    }

    try {
      let url = `${this.baseURL}/threads/${this.threadId}/messages?limit=${limit}&order=${order}`

      if (after) {
        url += `&after=${after}`
      }
      if (before) {
        url += `&before=${before}`
      }

      console.log('Fetching messages from:', url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status}`)
      }

      const result = await response.json()
      console.log('OpenAI API response:', {
        threadId: this.threadId,
        requestedLimit: limit,
        returnedCount: result.data?.length || 0,
        hasMore: result.has_more,
        firstId: result.first_id,
        lastId: result.last_id,
        messageIds: result.data?.map((msg) => msg.id) || [],
        after,
        before
      })

      return result
    } catch (error) {
      console.error('Error getting messages:', error)
      throw error
    }
  }

  /**
   * Get all messages from thread using proper pagination
   */
  async getAllMessages(batchSize = 20) {
    if (!this.threadId) {
      throw new Error('No thread available')
    }

    const allMessages = []
    let after = null
    let hasMore = true

    while (hasMore) {
      try {
        const response = await this.getMessages(batchSize, 'desc', after)

        if (response.data && response.data.length > 0) {
          allMessages.push(...response.data)
          after = response.data[response.data.length - 1].id // Get the ID of the last message for next page
          hasMore = response.has_more
        } else {
          hasMore = false
        }
      } catch (error) {
        console.error('Error fetching messages batch:', error)
        break
      }
    }

    console.log(`Retrieved ${allMessages.length} total messages from thread`)
    return {
      data: allMessages,
      has_more: false,
      first_id: allMessages[0]?.id || null,
      last_id: allMessages[allMessages.length - 1]?.id || null
    }
  }

  /**
   * Wait for run completion
   */
  async waitForRunCompletion(maxWaitTime = 60000) {
    const startTime = Date.now()

    while (Date.now() - startTime < maxWaitTime) {
      const runStatus = await this.checkRunStatus()

      if (runStatus.status === 'completed') {
        return runStatus
      } else if (runStatus.status === 'failed') {
        throw new Error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`)
      } else if (runStatus.status === 'cancelled') {
        throw new Error('Run was cancelled')
      }

      // Wait 1 second before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    throw new Error('Run timed out')
  }

  /**
   * Send message and get AI response (non-streaming)
   */
  async sendMessageAndGetResponse(content, assistantId = null) {
    try {
      this.isProcessing = true

      // Add user message
      await this.addMessage(content, 'user')

      // Run assistant
      await this.runAssistant(assistantId)

      // Wait for completion
      await this.waitForRunCompletion()

      // Get messages
      const messagesResponse = await this.getMessages()

      // Return the latest assistant message
      const assistantMessages = messagesResponse.data.filter((msg) => msg.role === 'assistant')
      return assistantMessages[0] || null
    } catch (error) {
      console.error('Error in sendMessageAndGetResponse:', error)
      throw error
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Get current thread ID
   */
  getThreadId() {
    return this.threadId
  }

  /**
   * Set thread ID (for resuming existing conversations)
   */
  setThreadId(threadId) {
    this.threadId = threadId
  }

  /**
   * Check if currently processing
   */
  getIsProcessing() {
    return this.isProcessing
  }

  /**
   * Check if currently streaming
   */
  getIsStreaming() {
    return this.isStreaming
  }
}

/**
 * React Hook for AI Controller with streaming support
 * Provides a clean interface for using the AI controller in React components
 */
export const useAIController = (apiKey, assistantId = null) => {
  // Stable controller instance for the lifetime of the hook
  const controllerRef = useRef(null)
  if (!controllerRef.current) {
    controllerRef.current = new AIController(apiKey, assistantId)
  }
  const controller = controllerRef.current
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState(null)

  // Initialize thread on mount or when needed
  const initializeThread = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Only create a new thread if one does not exist
      if (controller.getThreadId()) {
        return { id: controller.getThreadId() }
      }
      const thread = await controller.createThread()
      return thread
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [controller])

  // Send message with streaming support
  const sendMessage = useCallback(
    async (content, useStreaming = false) => {
      try {
        setIsLoading(true)
        setError(null)
        setIsProcessing(true)
        setIsStreaming(useStreaming)

        // Always use the controller's threadId
        let currentThreadId = controller.getThreadId()
        if (!currentThreadId) {
          const thread = await initializeThread()
          currentThreadId = thread.id
          controller.setThreadId(currentThreadId)
        }

        if (useStreaming) {
          // For streaming, don't add user message here as it's handled by useChat
          // to avoid duplication
          // Initialize streaming message
          const tempStreamingMessage = {
            id: `streaming-${Date.now()}`,
            type: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            isStreaming: true
          }
          setStreamingMessage(tempStreamingMessage)
          setMessages((prev) => [...prev, tempStreamingMessage])

          // Stream the response
          const aiResponse = await controller.streamAssistantResponse(
            content,
            null,
            // onChunk callback
            ({ chunk, fullContent, messageId }) => {
              setStreamingMessage((prev) => ({
                ...prev,
                id: messageId || prev.id,
                content: fullContent,
                isStreaming: true
              }))
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === tempStreamingMessage.id
                    ? { ...msg, id: messageId || msg.id, content: fullContent, isStreaming: true }
                    : msg
                )
              )
            },
            // onComplete callback
            (finalMessage) => {
              setStreamingMessage(null)
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === tempStreamingMessage.id || msg.isStreaming ? { ...finalMessage, isStreaming: false } : msg
                )
              )
            },
            // onError callback
            (streamError) => {
              console.error('Streaming error:', streamError)
              setError(streamError.message)
              // Remove the streaming message on error
              setMessages((prev) => prev.filter((msg) => msg.id !== tempStreamingMessage.id))
              setStreamingMessage(null)
            }
          )

          return aiResponse
        } else {
          // Add user message for non-streaming mode
          const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content,
            timestamp: new Date().toISOString()
          }
          setMessages((prev) => [...prev, userMessage])

          // Use non-streaming response
          const aiResponse = await controller.sendMessageAndGetResponse(content)
          if (aiResponse) {
            const assistantMessage = {
              id: aiResponse.id,
              type: 'assistant',
              content: aiResponse.content[0]?.text?.value || 'No response received',
              timestamp: new Date().toISOString()
            }
            setMessages((prev) => [...prev, assistantMessage])
          }
          return aiResponse
        }
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setIsLoading(false)
        setIsProcessing(false)
        setIsStreaming(false)
      }
    },
    [controller, initializeThread]
  )

  // Cancel streaming
  const cancelStream = useCallback(() => {
    controller.cancelStream()
    setIsStreaming(false)
    setStreamingMessage(null)
    // Remove any streaming messages
    setMessages((prev) => prev.filter((msg) => !msg.isStreaming))
  }, [controller])

  // Load existing messages
  const loadMessages = useCallback(async () => {
    try {
      const threadId = controller.getThreadId()
      if (!threadId) return
      setIsLoading(true)
      setError(null)
      const response = await controller.getMessages()
      const formattedMessages = response.data.map((msg) => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content[0]?.text?.value || '',
        timestamp: new Date(msg.created_at * 1000).toISOString()
      }))
      setMessages(formattedMessages)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [controller])

  // Resume existing thread
  const resumeThread = useCallback(
    (existingThreadId) => {
      controller.setThreadId(existingThreadId)
    },
    [controller]
  )

  // Clear messages and thread
  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingMessage(null)
    controller.setThreadId(null)
  }, [controller])

  // Get current state
  const getState = useCallback(
    () => ({
      isLoading,
      error,
      messages,
      threadId: controller.getThreadId(),
      isProcessing,
      isStreaming,
      streamingMessage
    }),
    [isLoading, error, messages, isProcessing, isStreaming, streamingMessage, controller]
  )

  return {
    // State
    isLoading,
    error,
    messages,
    threadId: controller.getThreadId(),
    isProcessing,
    isStreaming,
    streamingMessage,

    // Actions
    initializeThread,
    sendMessage,
    cancelStream,
    loadMessages,
    resumeThread,
    clearMessages,
    getState,

    // Controller instance (for advanced usage)
    controller
  }
}

/**
 * Message formatter utility
 */
export const formatMessage = (message) => {
  return {
    id: message.id || Date.now().toString(),
    type: message.role === 'user' ? 'user' : 'assistant',
    content: message.content[0]?.text?.value || message.content || '',
    timestamp: message.created_at ? new Date(message.created_at * 1000).toISOString() : new Date().toISOString()
  }
}

/**
 * Error handler utility
 */
export const handleAIError = (error) => {
  console.error('AI Controller Error:', error)

  if (error.message) {
    if (error.message.includes('401')) {
      return 'Invalid API key. Please check your OpenAI API key.'
    } else if (error.message.includes('429')) {
      return 'Rate limit exceeded. Please try again later.'
    } else if (error.message.includes('500')) {
      return 'OpenAI service error. Please try again.'
    } else if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    } else if (error.message.includes('invalid_beta')) {
      return 'API version error. Please contact support.'
    }
  }

  return error.message || 'An unexpected error occurred.'
}

export default AIController
