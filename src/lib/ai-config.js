// Global Instructions Rule Applied!

/**
 * AI Configuration for OpenAI Threads Integration (v2 API)
 * Centralized configuration for AI settings
 */

// Memoized configuration to prevent recreation
let memoizedConfig = null
let memoizedMockResponses = null
let memoizedValidatedConfig = null

// Environment-based configuration
const getConfig = () => {
  if (memoizedConfig) {
    return memoizedConfig
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  memoizedConfig = {
    // OpenAI API Configuration
    openai: {
      apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
      baseURL: 'https://api.openai.com/v1',
      timeout: 60000, // 60 seconds
      maxRetries: 3,
      apiVersion: 'v2' // Updated to v2
    },

    // Assistant Configuration
    assistant: {
      id: process.env.REACT_APP_OPENAI_ASSISTANT_ID || '',
      name: 'SkillScout',
      instructions: `You are a helpful career advisor and interview preparation assistant. 
      Help users with:
      - Resume building and optimization
      - Interview preparation and practice
      - Career guidance and advice
      - Job search strategies
      - Professional development tips
      
      Be friendly, professional, and provide actionable advice.`,
      model: 'gpt-4-turbo-preview',
      tools: [
        {
          type: 'retrieval'
        }
      ]
    },

    // Thread Configuration
    thread: {
      maxMessages: 100,
      autoArchive: true,
      retentionDays: 30
    },

    // UI Configuration
    ui: {
      typingSpeed: 50, // ms per character for typing effect
      maxMessageLength: 4000,
      showTypingIndicator: true,
      autoScroll: true
    },

    // Development Settings
    development: {
      mockResponses: isDevelopment && process.env.REACT_APP_MOCK_AI === 'true',
      debugMode: isDevelopment,
      logLevel: isDevelopment ? 'debug' : 'error'
    }
  }

  return memoizedConfig
}

/**
 * Validate configuration
 */
export const validateConfig = () => {
  const config = getConfig()
  const errors = []

  if (!config.openai.apiKey) {
    errors.push('OpenAI API key is required')
  }

  if (!config.assistant.id) {
    errors.push('OpenAI Assistant ID is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get configuration with validation
 */
export const getValidatedConfig = () => {
  if (memoizedValidatedConfig) {
    return memoizedValidatedConfig
  }

  const config = getConfig()
  const validation = validateConfig()

  memoizedValidatedConfig = {
    ...config,
    validation
  }

  return memoizedValidatedConfig
}

/**
 * Development mock responses for testing
 */
export const getMockResponses = () => {
  if (memoizedMockResponses) {
    return memoizedMockResponses
  }

  memoizedMockResponses = {
    welcome: {
      type: 'assistant',
      content:
        "Hello! I'm your SkillScout assistant. I'm here to help you with resume building, interview preparation, and career guidance. What would you like to work on today?",
      timestamp: new Date().toISOString()
    },

    resumeHelp: {
      type: 'assistant',
      content:
        "I'd be happy to help you with your resume! To get started, could you tell me about your current experience level and the type of position you're targeting? This will help me provide more specific guidance.",
      timestamp: new Date().toISOString()
    },

    interviewPrep: {
      type: 'assistant',
      content:
        "Great! Let's prepare for your interview. I can help you with common interview questions, behavioral responses, and tips for different types of interviews. What specific role or company are you interviewing for?",
      timestamp: new Date().toISOString()
    },

    careerAdvice: {
      type: 'assistant',
      content:
        'Career guidance is one of my specialties! I can help you explore different career paths, understand industry trends, and plan your professional development. What area of your career would you like to focus on?',
      timestamp: new Date().toISOString()
    }
  }

  return memoizedMockResponses
}

export default getConfig
