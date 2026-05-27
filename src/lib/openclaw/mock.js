// Global Instructions Rule Applied!

import { isOpenClawConfigured } from './config'

/** True when mock responses should be used instead of calling OpenClaw. */
export const isOpenClawMockMode = () => {
  if (process.env.REACT_APP_MOCK_AI === 'true') {
    return true
  }
  return !isOpenClawConfigured()
}

export const buildMockCvFields = (cvText = '') => {
  const snippet = cvText.slice(0, 80).replace(/\s+/g, ' ').trim()
  return {
    first_name: 'Alex',
    last_name: 'Sample',
    email: 'alex.sample@example.com',
    phone: '+1 555 0100',
    _mockNote: snippet ? `Parsed from: ${snippet}…` : undefined
  }
}

const MOCK_CHAT_RESPONSES = {
  resume:
    "I'd be happy to help you with your resume! To get started, could you tell me about your current experience level and the type of position you're targeting?",
  interview:
    "Great! Let's prepare for your interview. What specific role or company are you interviewing for? I can help with common questions and behavioral responses.",
  career:
    'Career guidance is one of my specialties! What area of your career would you like to focus on — growth, transition, or skill development?',
  default:
    "Thank you for your message! I'm here to help with resume building, interview preparation, and career guidance. What would you like to work on today?"
}

/**
 * @param {string} userMessage
 * @returns {string}
 */
export const getMockCandidateChatResponse = (userMessage) => {
  const lower = String(userMessage || '').toLowerCase()

  if (lower.includes('resume') || lower.includes('cv')) {
    return MOCK_CHAT_RESPONSES.resume
  }
  if (lower.includes('interview') || lower.includes('prepare')) {
    return MOCK_CHAT_RESPONSES.interview
  }
  if (lower.includes('career') || lower.includes('advice')) {
    return MOCK_CHAT_RESPONSES.career
  }

  return MOCK_CHAT_RESPONSES.default
}

export const buildWelcomeMessage = (userName) => ({
  id: 'welcome',
  type: 'assistant',
  content: `Hello${userName ? ` ${userName}` : ''}! I'm your SkillScout assistant. I'm here to help you with resume building, interview preparation, and career guidance. What would you like to work on today?`,
  timestamp: new Date().toISOString()
})
