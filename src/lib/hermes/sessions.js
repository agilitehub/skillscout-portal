// Global Instructions Rule Applied!

import { hermesFetch } from './client'

/** Stable app-scoped candidate key — used for transcript continuity and Honcho memory scope. */
export const buildCandidateKey = (userId) => `skillscout-candidate-${userId}`

/** Short-term Hermes transcript session id (`X-Hermes-Session-Id`). */
export const buildCandidateSessionId = buildCandidateKey

/** Long-term Honcho memory scope (`X-Hermes-Session-Key`). Same value as session id per candidate. */
export const buildCandidateSessionKey = buildCandidateKey

/** Session headers sent on every Hermes API call for a candidate. */
export const buildCandidateSessionHeaders = (userId) => {
  const candidateKey = buildCandidateKey(userId)
  return { sessionId: candidateKey, sessionKey: candidateKey }
}

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
 * Map Hermes session messages to candidate chat UI shape.
 * @param {object[]} hermesMessages
 * @returns {{ id: string, type: string, content: string, timestamp: string }[]}
 */
export const mapHermesMessagesToUi = (hermesMessages = []) => {
  const uiMessages = []

  for (const msg of hermesMessages) {
    const role = msg?.role
    if (role !== 'user' && role !== 'assistant') continue

    const content = extractMessageText(msg.content)
    if (!content) continue

    uiMessages.push({
      id: msg.id || `${role}-${msg.timestamp || Date.now()}-${uiMessages.length}`,
      type: role === 'user' ? 'user' : 'assistant',
      content,
      timestamp: msg.timestamp || new Date().toISOString()
    })
  }

  return uiMessages
}

/** Human-readable Hermes session title — must match candidate key so Honcho does not collapse candidates. */
export const buildCandidateSessionTitle = buildCandidateKey

const LEGACY_SHARED_SESSION_TITLE = 'SkillScout Candidate Chat'

/**
 * Ensure Hermes session title matches the candidate key (Honcho prefers title over session key).
 * @param {string} userId
 * @param {string} sessionId
 * @param {{ sessionId: string, sessionKey: string }} sessionHeaders
 * @param {string|null|undefined} [knownTitle]
 */
const syncCandidateSessionTitle = async (userId, sessionId, sessionHeaders, knownTitle) => {
  const title = buildCandidateSessionTitle(userId)
  let currentTitle = knownTitle

  if (currentTitle === undefined) {
    const existing = await hermesFetch(`/api/sessions/${encodeURIComponent(sessionId)}`, sessionHeaders)
    if (!existing.success) {
      return existing
    }
    currentTitle = existing.data?.session?.title ?? ''
  }

  const needsTitleSync =
    !currentTitle || currentTitle === LEGACY_SHARED_SESSION_TITLE || currentTitle !== title

  if (!needsTitleSync) {
    return { success: true, sessionId }
  }

  const patched = await hermesFetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
    ...sessionHeaders,
    method: 'PATCH',
    body: { title }
  })

  return patched.success ? { success: true, sessionId } : patched
}

/**
 * Ensure a persisted Hermes session exists for the candidate.
 * @param {string} userId
 */
export const ensureCandidateChatSession = async (userId) => {
  const sessionId = buildCandidateSessionId(userId)
  const sessionHeaders = buildCandidateSessionHeaders(userId)
  const title = buildCandidateSessionTitle(userId)

  const existing = await hermesFetch(`/api/sessions/${encodeURIComponent(sessionId)}`, sessionHeaders)
  if (existing.success) {
    return syncCandidateSessionTitle(
      userId,
      sessionId,
      sessionHeaders,
      existing.data?.session?.title ?? ''
    )
  }

  if (existing.status !== 404) {
    return existing
  }

  const created = await hermesFetch('/api/sessions', {
    ...sessionHeaders,
    method: 'POST',
    body: {
      id: sessionId,
      title
    }
  })

  if (created.success || created.status === 409) {
    return syncCandidateSessionTitle(userId, sessionId, sessionHeaders)
  }

  return created
}

/**
 * Load chat history from Hermes session store.
 * @param {string} userId
 */
export const fetchCandidateChatHistory = async (userId) => {
  const sessionId = buildCandidateSessionId(userId)
  const result = await hermesFetch(`/api/sessions/${encodeURIComponent(sessionId)}/messages`, {
    ...buildCandidateSessionHeaders(userId)
  })

  if (!result.success) {
    if (result.status === 404) {
      return { success: true, messages: [], sessionId }
    }
    return { success: false, error: result.error, messages: [] }
  }

  const raw = result.data?.data || []
  return {
    success: true,
    sessionId,
    messages: mapHermesMessagesToUi(raw)
  }
}

/**
 * Delete candidate chat session (used by clear chat).
 * @param {string} userId
 */
export const deleteCandidateChatSession = async (userId) => {
  const sessionId = buildCandidateSessionId(userId)
  const result = await hermesFetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
    ...buildCandidateSessionHeaders(userId),
    method: 'DELETE'
  })

  if (!result.success && result.status === 404) {
    return { success: true, sessionId }
  }

  return result.success ? { success: true, sessionId } : result
}
