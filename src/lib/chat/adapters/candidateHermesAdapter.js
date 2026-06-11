// Global Instructions Rule Applied!

import {
  sendCandidateChatMessage,
  buildWelcomeMessage,
  isHermesMockMode,
  isHermesConfigured,
  createStreamingTypewriter,
  fetchCandidateChatHistory,
  ensureCandidateChatSession,
  deleteCandidateChatSession
} from '../../hermes'

/** Hermes-backed chat adapter for Personal Dashboard candidate chat. */
export const candidateHermesAdapter = {
  isMockMode: isHermesMockMode,
  isConfigured: isHermesConfigured,
  fetchHistory: fetchCandidateChatHistory,
  ensureSession: ensureCandidateChatSession,
  deleteSession: deleteCandidateChatSession,
  buildWelcomeMessage,
  createStreamingTypewriter,
  getConfigurationErrorMessage: () =>
    'Hermes is not configured. Set REACT_APP_HERMES_BASE_URL and REACT_APP_HERMES_API_KEY, or enable REACT_APP_MOCK_AI.',
  sendMessage: ({ chatHistory, stream, signal, context, userId, onChunk }) =>
    sendCandidateChatMessage({
      chatHistory,
      stream,
      signal,
      onChunk,
      liveResumeContext: context,
      userId
    })
}
