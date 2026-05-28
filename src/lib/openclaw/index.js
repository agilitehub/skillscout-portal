// Global Instructions Rule Applied!

export { getOpenClawConfig, isOpenClawConfigured } from './config'
export { callChatCompletions } from './client'
export {
  isOpenClawMockMode,
  buildMockCvFields,
  buildMockFullResume,
  getMockCandidateChatResponse,
  buildWelcomeMessage
} from './mock'
export {
  extractCandidateFieldsFromCvText,
  extractFullResumeFromCvText,
  parseJsonFromAssistantContent
} from './cv-extraction'
export {
  sendCandidateChatMessage,
  toOpenClawMessages,
  CANDIDATE_CHAT_SYSTEM_PROMPT,
  buildCandidateChatSystemPrompt,
  buildCandidateChatUserParam
} from './candidate-chat'
