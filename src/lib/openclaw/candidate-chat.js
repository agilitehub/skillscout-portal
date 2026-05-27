// Global Instructions Rule Applied!

import { callChatCompletions } from './client'
import { getMockCandidateChatResponse, isOpenClawMockMode } from './mock'

export const CANDIDATE_CHAT_SYSTEM_PROMPT = `You are SkillScout, a helpful career advisor and interview preparation assistant.
Help users with:
- Resume building and optimization
- Interview preparation and practice
- Career guidance and advice
- Job search strategies
- Professional development tips

Be friendly, professional, and provide actionable advice.`

/**
 * @typedef {Object} ChatUiMessage
 * @property {string} id
 * @property {'user'|'assistant'|'system'} type
 * @property {string} content
 * @property {string} timestamp
 */

/**
 * Map UI chat history to OpenClaw chat/completions messages.
 * @param {ChatUiMessage[]} chatHistory
 * @returns {{ role: 'system'|'user'|'assistant', content: string }[]}
 */
export const toOpenClawMessages = (chatHistory) => {
  const messages = [{ role: 'system', content: CANDIDATE_CHAT_SYSTEM_PROMPT }]

  for (const msg of chatHistory) {
    if (msg.type === 'user') {
      messages.push({ role: 'user', content: msg.content })
    } else if (msg.type === 'assistant') {
      messages.push({ role: 'assistant', content: msg.content })
    }
  }

  return messages
}

/**
 * Send a candidate chat message through OpenClaw.
 * @param {Object} options
 * @param {ChatUiMessage[]} options.chatHistory - History including the latest user message
 * @param {boolean} [options.stream]
 * @param {(chunk: { delta: string, fullContent: string }) => void} [options.onChunk]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{ success: boolean, content?: string, error?: string }>}
 */
export async function sendCandidateChatMessage({ chatHistory, stream = false, onChunk, signal }) {
  const lastUserMessage = [...chatHistory].reverse().find((msg) => msg.type === 'user')?.content || ''

  if (isOpenClawMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const content = getMockCandidateChatResponse(lastUserMessage)

    if (stream && onChunk) {
      onChunk({ delta: content, fullContent: content })
    }

    return { success: true, content }
  }

  return callChatCompletions({
    messages: toOpenClawMessages(chatHistory),
    stream,
    onChunk,
    signal,
    user: 'skillscout-candidate-chat',
    temperature: 0.7
  })
}
