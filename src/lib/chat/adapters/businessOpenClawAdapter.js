// Global Instructions Rule Applied!

import { isOpenClawConfigured } from '../../openclaw/config'
import { isOpenClawMockMode } from '../../openclaw/mock'
import { createStreamingTypewriter } from '../../hermes/stream-utils'
import {
  buildBusinessWelcomeMessage,
  sendBusinessCandidateChatMessage
} from '../../openclaw/business-candidate-chat'
import {
  buildBusinessSessionKey,
  fetchBusinessChatHistory,
  ensureBusinessChatSession,
  deleteBusinessChatSession
} from '../../openclaw/sessions'
import {
  appendMockBusinessSessionTurn,
  clearMockBusinessSession,
  getMockBusinessSessionMessages
} from '../../openclaw/mock'

/**
 * Create an OpenClaw chat adapter scoped to one recruiter + match conversation.
 * @param {{
 *   orgId: string,
 *   recruiterUserId: string,
 *   matchId: string,
 *   welcomeMeta?: { candidateName?: string, jobListingTitle?: string }
 * }} scope
 */
export const createBusinessOpenClawAdapter = (scope) => {
  const sessionKey = buildBusinessSessionKey({
    orgId: scope.orgId,
    recruiterUserId: scope.recruiterUserId,
    matchId: scope.matchId
  })

  const welcomeMeta = scope.welcomeMeta || {}

  return {
    isMockMode: isOpenClawMockMode,
    isConfigured: isOpenClawConfigured,
    getConfigurationErrorMessage: () =>
      'OpenClaw is not configured. Set REACT_APP_OPENCLAW_BASE_URL and REACT_APP_OPENCLAW_GATEWAY_TOKEN, or enable REACT_APP_MOCK_AI.',
    buildWelcomeMessage: () => buildBusinessWelcomeMessage(welcomeMeta),
    createStreamingTypewriter,
    fetchHistory: async () => {
      if (isOpenClawMockMode()) {
        return {
          success: true,
          sessionKey,
          messages: getMockBusinessSessionMessages(sessionKey)
        }
      }
      return fetchBusinessChatHistory(sessionKey)
    },
    ensureSession: ensureBusinessChatSession,
    deleteSession: async () => {
      if (isOpenClawMockMode()) {
        clearMockBusinessSession(sessionKey)
        return { success: true, sessionKey }
      }
      return deleteBusinessChatSession(sessionKey)
    },
    sendMessage: async ({ chatHistory, stream, signal, context, onChunk }) => {
      const lastUserMessage = [...chatHistory].reverse().find((msg) => msg.type === 'user')?.content || ''

      const result = await sendBusinessCandidateChatMessage({
        chatHistory,
        stream,
        signal,
        context,
        sessionKey,
        onChunk
      })

      if (result.success && isOpenClawMockMode() && lastUserMessage) {
        appendMockBusinessSessionTurn(sessionKey, lastUserMessage, result.content || '')
      }

      return result
    }
  }
}

/** Default export for modules that resolve session from context at send time. */
export const businessOpenClawAdapter = {
  isMockMode: isOpenClawMockMode,
  isConfigured: isOpenClawConfigured,
  getConfigurationErrorMessage: () =>
    'OpenClaw business chat requires createBusinessOpenClawAdapter(scope) with orgId, recruiterUserId, and matchId.',
  fetchHistory: async () => ({ success: false, messages: [], error: 'Adapter not scoped' }),
  ensureSession: async () => {},
  deleteSession: async () => ({ success: false }),
  buildWelcomeMessage: () => buildBusinessWelcomeMessage({}),
  createStreamingTypewriter,
  sendMessage: async () => ({ success: false, error: 'Adapter not scoped' })
}
