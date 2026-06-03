// Global Instructions Rule Applied!

import { getHermesConfig } from './config'
import { mapHermesFetchError, parseHermesHttpError } from './errors'
import { extractStreamDelta } from './stream-utils'

/**
 * @typedef {Object} ChatCompletionMessage
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 */

/**
 * @typedef {Object} HermesChatOptions
 * @property {ChatCompletionMessage[]} messages
 * @property {boolean} [stream]
 * @property {(chunk: { delta: string, fullContent: string }) => void} [onChunk]
 * @property {AbortSignal} [signal]
 * @property {string} [user]
 * @property {number} [temperature]
 * @property {string} [sessionId] — X-Hermes-Session-Id (loads history server-side)
 * @property {string} [sessionKey] — X-Hermes-Session-Key (long-term memory scoping)
 */

const buildHeaders = (token, stream, sessionHeaders = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (stream) {
    headers.Accept = 'text/event-stream'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (sessionHeaders.sessionId) {
    headers['X-Hermes-Session-Id'] = sessionHeaders.sessionId
  }
  if (sessionHeaders.sessionKey) {
    headers['X-Hermes-Session-Key'] = sessionHeaders.sessionKey
  }
  return headers
}

const parseSsePayload = (rawLine, onChunk, state) => {
  const trimmed = rawLine.trim()
  if (!trimmed.startsWith('data:')) return

  const data = trimmed.slice(5).trim()
  if (!data || data === '[DONE]') return

  try {
    const parsed = JSON.parse(data)
    const delta = extractStreamDelta(parsed)
    if (delta) {
      state.fullContent += delta
      onChunk({ delta, fullContent: state.fullContent })
    }
  } catch {
    // Ignore malformed SSE chunks
  }
}

const readChatCompletionStream = async (response, onChunk) => {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Streaming response body is not available')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  const state = { fullContent: '' }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split(/\r?\n/)
    buffer = parts.pop() || ''

    for (const line of parts) {
      parseSsePayload(line, onChunk, state)
    }
  }

  if (buffer.trim()) {
    parseSsePayload(buffer, onChunk, state)
  }

  return state.fullContent
}

const parseJsonCompletionContent = (payload) => payload?.choices?.[0]?.message?.content ?? ''

const isEventStreamResponse = (response) => {
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('text/event-stream') || contentType.includes('application/x-ndjson')
}

/**
 * Hermes JSON fetch helper (session API lives under /api, not /v1).
 * @param {string} path — e.g. `/api/sessions/foo/messages`
 * @param {{ method?: string, body?: object, signal?: AbortSignal, sessionId?: string, sessionKey?: string }} [options]
 */
export async function hermesFetch(path, options = {}) {
  const { baseUrl, token, timeoutMs } = getHermesConfig()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const linkedSignal = options.signal
  if (linkedSignal) {
    linkedSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method || 'GET',
      headers: buildHeaders(token, false, {
        sessionId: options.sessionId,
        sessionKey: options.sessionKey
      }),
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const err = parseHermesHttpError(response.status, payload)
      return { ...err, status: response.status }
    }

    return { success: true, data: payload }
  } catch (error) {
    return mapHermesFetchError(error)
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Call Hermes Agent POST /v1/chat/completions (OpenAI-compatible).
 * @param {HermesChatOptions} options
 */
export async function callChatCompletions({
  messages,
  stream = false,
  onChunk,
  signal,
  user = 'skillscout-candidate',
  temperature = 0.7,
  sessionId = null,
  sessionKey = null
}) {
  const { baseUrl, token, model, timeoutMs } = getHermesConfig()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const linkedSignal = signal
  if (linkedSignal) {
    linkedSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(token, stream, { sessionId, sessionKey }),
      body: JSON.stringify({
        model,
        user,
        temperature,
        messages,
        stream: Boolean(stream)
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      return parseHermesHttpError(response.status, payload)
    }

    if (stream && onChunk && isEventStreamResponse(response)) {
      const content = await readChatCompletionStream(response, onChunk)
      return { success: true, content }
    }

    const payload = await response.json()
    const content = parseJsonCompletionContent(payload)

    if (!content) {
      return { success: false, error: 'Hermes returned an empty response.' }
    }

    if (stream && onChunk) {
      onChunk({ delta: content, fullContent: content })
    }

    return { success: true, content }
  } catch (error) {
    return mapHermesFetchError(error)
  } finally {
    clearTimeout(timeoutId)
  }
}
