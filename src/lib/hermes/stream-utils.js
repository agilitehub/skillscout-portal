// Global Instructions Rule Applied!

/**
 * Extract text delta from an OpenAI-compatible streaming chunk (Hermes /v1/chat/completions).
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

/**
 * Typewriter that chases a growing target string (live SSE + buffered proxy).
 * @param {(visibleText: string, isActive: boolean) => void} onUpdate
 * @param {{ charDelayMs?: number }} [options]
 */
export const createStreamingTypewriter = (onUpdate, options = {}) => {
  const { charDelayMs = 12 } = options
  let targetText = ''
  let visibleText = ''
  let timerId = null
  let cancelled = false

  const tick = () => {
    if (cancelled) return

    if (visibleText.length < targetText.length) {
      visibleText = targetText.slice(0, visibleText.length + 1)
      onUpdate(visibleText, true)
      timerId = setTimeout(tick, charDelayMs)
      return
    }

    timerId = null
  }

  return {
    setTarget(nextTarget) {
      targetText = String(nextTarget || '')
      if (!timerId && !cancelled) {
        tick()
      }
    },
    async finish() {
      targetText = String(targetText || '')
      while (visibleText.length < targetText.length && !cancelled) {
        visibleText = targetText.slice(0, visibleText.length + 1)
        onUpdate(visibleText, true)
        await new Promise((resolve) => setTimeout(resolve, charDelayMs))
      }
      onUpdate(targetText, false)
    },
    cancel() {
      cancelled = true
      if (timerId) {
        clearTimeout(timerId)
        timerId = null
      }
    }
  }
}
