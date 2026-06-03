// Global Instructions Rule Applied!

/** Personal Dashboard candidate chat — public API for UI hooks. */
export { isHermesConfigured } from './config'
export { isHermesMockMode, buildWelcomeMessage } from './mock'
export {
  ensureCandidateChatSession,
  fetchCandidateChatHistory,
  deleteCandidateChatSession
} from './sessions'
export { sendCandidateChatMessage } from './candidate-chat'
export { createStreamingTypewriter } from './stream-utils'
