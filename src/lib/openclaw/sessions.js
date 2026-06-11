// Global Instructions Rule Applied!

import { openclawFetch } from './client'

/** Stable session key per recruiter + potential-candidate match row. */
export const buildBusinessSessionKey = ({ orgId, recruiterUserId, matchId }) =>
  `skillscout-business-${orgId}-${recruiterUserId}-match-${matchId}`

const extractMessageText = (content) => {
  if (typeof content === 'string') return content.trim()
  if (Array.isArray(content)) {
    return content
      .filter((part) => part?.type === 'text' && part.text)
      .map((part) => part.text)
      .join('\n')
      .trim()
  }
  return String(content ?? '').trim()
}

/**
 * Map OpenClaw session history to chat UI message shape.
 * @param {object[]} rawMessages
 */
export const mapOpenClawMessagesToUi = (rawMessages = []) => {
  const uiMessages = []

  for (const msg of rawMessages) {
    const role = msg?.role
    if (role !== 'user' && role !== 'assistant') continue

    const content = extractMessageText(msg.content)
    if (!content) continue

    uiMessages.push({
      id: msg.id || `${role}-${msg.timestamp || Date.now()}-${uiMessages.length}`,
      type: role === 'user' ? 'user' : 'assistant',
      content,
      timestamp: msg.timestamp || msg.createdAt || new Date().toISOString()
    })
  }

  return uiMessages
}

/**
 * Load chat history from OpenClaw gateway session store.
 * @param {string} sessionKey
 */
export const fetchBusinessChatHistory = async (sessionKey) => {
  const encodedKey = encodeURIComponent(sessionKey)
  const result = await openclawFetch(`/sessions/${encodedKey}/history?limit=50`)

  if (!result.success) {
    if (result.status === 404) {
      return { success: true, messages: [], sessionKey }
    }
    return { success: false, error: result.error, messages: [] }
  }

  const raw =
    result.data?.messages ||
    result.data?.data?.messages ||
    result.data?.data ||
    (Array.isArray(result.data) ? result.data : [])

  return {
    success: true,
    sessionKey,
    messages: mapOpenClawMessagesToUi(Array.isArray(raw) ? raw : [])
  }
}

/** Session is created on first chat completion when session key is sent. */
export const ensureBusinessChatSession = async () => {
  return { success: true }
}

/**
 * Reset OpenClaw gateway session (clear chat).
 * @param {string} sessionKey
 */
export const deleteBusinessChatSession = async (sessionKey) => {
  const encodedKey = encodeURIComponent(sessionKey)
  const result = await openclawFetch(`/sessions/${encodedKey}`, { method: 'DELETE' })

  if (!result.success && result.status === 404) {
    return { success: true, sessionKey }
  }

  if (!result.success) {
    const resetResult = await openclawFetch(`/sessions/${encodedKey}/reset`, { method: 'POST' })
    if (resetResult.success || resetResult.status === 404) {
      return { success: true, sessionKey }
    }
    return resetResult
  }

  return { success: true, sessionKey }
}
