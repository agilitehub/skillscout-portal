// Global Instructions Rule Applied!
import { useState, useCallback, useMemo } from 'react'

/**
 * AI Controller for OpenAI Threads Integration (v2 API)
 * Handles thread management, message sending, and AI responses
 */
class AIController {
  constructor(apiKey, assistantId = null) {
    this.apiKey = apiKey
    this.assistantId = assistantId
    this.baseURL = 'https://api.openai.com/v1'
    this.threadId = null
    this.runId = null
    this.isProcessing = false
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
   * Run the assistant on the thread
   */
  async runAssistant(assistantId = null) {
    if (!this.threadId) {
      throw new Error('No thread available. Create a thread first.')
    }

    const targetAssistantId = assistantId || this.assistantId
    if (!targetAssistantId) {
      throw new Error('No assistant ID provided')
    }

    try {
      const response = await fetch(`${this.baseURL}/threads/${this.threadId}/runs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: targetAssistantId
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to run assistant: ${response.status}`)
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
   * Get messages from thread
   */
  async getMessages(limit = 20) {
    if (!this.threadId) {
      throw new Error('No thread available')
    }

    try {
      const response = await fetch(`${this.baseURL}/threads/${this.threadId}/messages?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting messages:', error)
      throw error
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
   * Send message and get AI response
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
}

/**
 * React Hook for AI Controller
 * Provides a clean interface for using the AI controller in React components
 */
export const useAIController = (apiKey, assistantId = null) => {
  // Persist threadId in localStorage
  const getInitialThreadId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_thread_id') || null
    }
    return null
  }

  // Memoize controller instance to prevent recreation on every render
  const controller = useMemo(() => new AIController(apiKey, assistantId), [apiKey, assistantId])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [threadId, setThreadId] = useState(getInitialThreadId())
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize thread on mount or when needed
  const initializeThread = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Only create a new thread if one does not exist
      if (threadId) {
        controller.setThreadId(threadId)
        return { id: threadId }
      }
      const thread = await controller.createThread()
      setThreadId(thread.id)
      if (typeof window !== 'undefined') {
        localStorage.setItem('openai_thread_id', thread.id)
      }
      return thread
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [controller, threadId])

  // Send message and get response
  const sendMessage = useCallback(
    async (content) => {
      try {
        setIsLoading(true)
        setError(null)
        setIsProcessing(true)
        // Always use the persisted threadId
        let currentThreadId = threadId
        if (!currentThreadId) {
          const thread = await initializeThread()
          currentThreadId = thread.id
        }
        controller.setThreadId(currentThreadId)
        // Add user message to local state
        const userMessage = {
          id: Date.now().toString(),
          type: 'user',
          content,
          timestamp: new Date().toISOString()
        }
        setMessages((prev) => [...prev, userMessage])
        // Get AI response
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
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setIsLoading(false)
        setIsProcessing(false)
      }
    },
    [controller, threadId, initializeThread]
  )

  // Load existing messages
  const loadMessages = useCallback(async () => {
    try {
      if (!threadId) return
      setIsLoading(true)
      setError(null)
      controller.setThreadId(threadId)
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
  }, [controller, threadId])

  // Resume existing thread
  const resumeThread = useCallback(
    (existingThreadId) => {
      controller.setThreadId(existingThreadId)
      setThreadId(existingThreadId)
      if (typeof window !== 'undefined') {
        localStorage.setItem('openai_thread_id', existingThreadId)
      }
    },
    [controller]
  )

  // Clear messages and thread
  const clearMessages = useCallback(() => {
    setMessages([])
    setThreadId(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openai_thread_id')
    }
    controller.setThreadId(null)
  }, [controller])

  // Get current state
  const getState = useCallback(
    () => ({
      isLoading,
      error,
      messages,
      threadId,
      isProcessing
    }),
    [isLoading, error, messages, threadId, isProcessing]
  )

  return {
    // State
    isLoading,
    error,
    messages,
    threadId,
    isProcessing,

    // Actions
    initializeThread,
    sendMessage,
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
