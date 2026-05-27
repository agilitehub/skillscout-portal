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

/**
 * Gradually reveal text for streaming UX (used when SSE arrives in one burst or in mock mode).
 * @param {string} fullText
 * @param {(visibleText: string) => void} onUpdate
 * @param {{ charDelayMs?: number, signal?: AbortSignal }} [options]
 * @returns {Promise<void>}
 */
export const revealTextIncrementally = async (fullText, onUpdate, options = {}) => {
  const { charDelayMs = 12, signal } = options
  const text = String(fullText || '')

  if (!text) {
    onUpdate('')
    return
  }

  for (let index = 1; index <= text.length; index += 1) {
    if (signal?.aborted) {
      onUpdate(text)
      return
    }

    onUpdate(text.slice(0, index))

    if (index < text.length) {
      await new Promise((resolve) => setTimeout(resolve, charDelayMs))
    }
  }
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
