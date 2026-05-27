// Global Instructions Rule Applied!

export { getOpenClawConfig, isOpenClawConfigured } from './config'
export { callChatCompletions } from './client'
export {
  isOpenClawMockMode,
  buildMockCvFields,
  getMockCandidateChatResponse,
  buildWelcomeMessage
} from './mock'
export { extractCandidateFieldsFromCvText } from './cv-extraction'
export { sendCandidateChatMessage, toOpenClawMessages, CANDIDATE_CHAT_SYSTEM_PROMPT } from './candidate-chat'
