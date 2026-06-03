// Global Instructions Rule Applied!

/**
 * Extract text delta from an OpenAI-compatible streaming chunk.
 * @param {object} parsed
 * @returns {string}
 */
export const extractStreamDelta = (parsed) => {
  const choice = parsed?.choices?.[0]
  if (!choice) return ''

  const delta = choice.delta?.content ?? choice.delta?.text ?? choice.text
  if (typeof delta === 'string') return delta

  const messageContent = choice.message?.content
  if (typeof messageContent === 'string') return messageContent

  return ''
}
