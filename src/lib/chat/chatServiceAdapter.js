// Global Instructions Rule Applied!

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user'|'assistant'|'bot'|'system'} type
 * @property {string} content
 * @property {string} timestamp
 * @property {boolean} [isStreaming]
 */

/**
 * @typedef {Object} ChatServiceAdapter
 * @property {() => boolean} isMockMode
 * @property {() => boolean} isConfigured
 * @property {(userId: string) => Promise<{ success: boolean, messages?: ChatMessage[], error?: string }>} fetchHistory
 * @property {(userId: string) => Promise<void>} ensureSession
 * @property {(userId: string) => Promise<{ success: boolean, error?: string }>} deleteSession
 * @property {(params: {
 *   chatHistory: ChatMessage[],
 *   stream: boolean,
 *   signal?: AbortSignal,
 *   context?: unknown,
 *   userId?: string,
 *   onChunk?: (chunk: { delta?: string, fullContent: string }) => void
 * }) => Promise<{ success: boolean, content?: string, error?: string }>} sendMessage
 * @property {(userName?: string) => ChatMessage} buildWelcomeMessage
 * @property {(onUpdate: (visibleText: string, isActive: boolean) => void) => {
 *   setTarget: (text: string) => void,
 *   finish: () => Promise<void>,
 *   cancel: () => void
 * }} createStreamingTypewriter
 * @property {() => string} [getConfigurationErrorMessage]
 */

export {}
