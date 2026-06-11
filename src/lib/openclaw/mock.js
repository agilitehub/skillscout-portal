// Global Instructions Rule Applied!

import { isOpenClawConfigured } from './config'
import { mapOpenClawMessagesToUi } from './sessions'

/** True when mock responses should be used instead of calling OpenClaw. */
export const isOpenClawMockMode = () => {
  if (process.env.REACT_APP_MOCK_AI === 'true') {
    return true
  }
  return !isOpenClawConfigured()
}

/** Mock contact fields for Business Dashboard CV import when OpenClaw is unavailable. */
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

const mockSessionStore = new Map()

/**
 * @param {string} sessionKey
 * @returns {object[]}
 */
export const getMockBusinessSessionMessages = (sessionKey) => {
  const raw = mockSessionStore.get(sessionKey) || []
  return mapOpenClawMessagesToUi(raw)
}

/**
 * @param {string} sessionKey
 * @param {string} userContent
 * @param {string} assistantContent
 */
export const appendMockBusinessSessionTurn = (sessionKey, userContent, assistantContent) => {
  const existing = mockSessionStore.get(sessionKey) || []
  const timestamp = new Date().toISOString()
  mockSessionStore.set(sessionKey, [
    ...existing,
    { role: 'user', content: userContent, timestamp },
    { role: 'assistant', content: assistantContent, timestamp }
  ])
}

/** @param {string} sessionKey */
export const clearMockBusinessSession = (sessionKey) => {
  mockSessionStore.delete(sessionKey)
}

/**
 * @param {string} userMessage
 * @param {string} [cvText]
 */
export const getMockBusinessCandidateChatResponse = (userMessage, cvText = '') => {
  const lower = String(userMessage || '').toLowerCase()
  const cvSnippet = String(cvText || '').slice(0, 200)

  if (lower.includes('weather') || lower.includes('news')) {
    return "I can only answer questions based on this candidate's CV. That information isn't in the CV."
  }

  if (lower.includes('skill')) {
    return cvSnippet.includes('Skills:')
      ? "Based on the CV, the candidate's listed skills appear in the Skills section. I can only confirm what's explicitly written there."
      : "The CV does not include a dedicated skills section with enough detail for me to list specific skills."
  }

  if (lower.includes('experience') || lower.includes('work')) {
    return cvSnippet.includes('Experience:')
      ? 'According to the CV experience section, the candidate has the roles and dates listed there. Ask about a specific role if you need a summary.'
      : "The CV does not contain detailed work experience I can summarize."
  }

  return "Based on the candidate's CV, I can help with questions about their experience, skills, and education — only using what's explicitly in the CV. What would you like to know?"
}
