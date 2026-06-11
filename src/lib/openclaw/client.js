// Global Instructions Rule Applied!

import { getOpenClawConfig, getOpenClawGatewayRoot } from './config'
import { mapOpenClawFetchError, parseOpenClawHttpError } from './errors'
import { extractStreamDelta } from './stream-utils'

/**
 * @typedef {Object} ChatCompletionMessage
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 */

/**
 * @typedef {Object} ChatCompletionsOptions
 * @property {ChatCompletionMessage[]} messages
 * @property {boolean} [stream]
 * @property {(chunk: { delta: string, fullContent: string }) => void} [onChunk]
 * @property {AbortSignal} [signal]
 * @property {string} [user]
 * @property {string} [sessionKey]
 * @property {string} [model]
 * @property {number} [temperature]
 */

const buildHeaders = (token, stream, sessionKey = null) => {
  const headers = { 'Content-Type': 'application/json' }
  if (stream) {
    headers.Accept = 'text/event-stream'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (sessionKey) {
    headers['x-openclaw-session-key'] = sessionKey
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

/**
 * Read an OpenAI-compatible SSE stream from chat/completions.
 * @param {Response} response
 * @param {(chunk: { delta: string, fullContent: string }) => void} onChunk
 * @returns {Promise<string>}
 */
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
 * OpenClaw gateway fetch for session APIs (history lives under gateway root, not /v1).
 * @param {string} path — e.g. `/sessions/foo/history`
 * @param {{ method?: string, body?: object, signal?: AbortSignal }} [options]
 */
export async function openclawFetch(path, options = {}) {
  const { token, timeoutMs } = getOpenClawConfig()
  const gatewayRoot = getOpenClawGatewayRoot()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const linkedSignal = options.signal
  if (linkedSignal) {
    linkedSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const response = await fetch(`${gatewayRoot}${path}`, {
      method: options.method || 'GET',
      headers: buildHeaders(token, false, options.sessionKey),
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const err = parseOpenClawHttpError(response.status, payload)
      return { ...err, status: response.status }
    }

    return { success: true, data: payload, status: response.status }
  } catch (error) {
    return mapOpenClawFetchError(error)
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Call OpenClaw Gateway chat/completions (OpenAI-compatible).
 * @param {ChatCompletionsOptions} options
 * @returns {Promise<{ success: boolean, content?: string, error?: string }>}
 */
export async function callChatCompletions({
  messages,
  stream = false,
  onChunk,
  signal,
  user = 'skillscout',
  sessionKey = null,
  model = null,
  temperature = 0.7
}) {
  const { baseUrl, token, model: defaultModel, timeoutMs } = getOpenClawConfig()
  const resolvedModel = model || defaultModel
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const linkedSignal = signal
  if (linkedSignal) {
    linkedSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(token, stream, sessionKey),
      body: JSON.stringify({
        model: resolvedModel,
        user,
        temperature,
        messages,
        stream: Boolean(stream)
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      return parseOpenClawHttpError(response.status, payload)
    }

    if (stream && onChunk && isEventStreamResponse(response)) {
      const content = await readChatCompletionStream(response, onChunk)
      return { success: true, content }
    }

    const payload = await response.json()
    const content = parseJsonCompletionContent(payload)

    if (!content) {
      return { success: false, error: 'OpenClaw returned an empty response.' }
    }

    if (stream && onChunk) {
      onChunk({ delta: content, fullContent: content })
    }

    return { success: true, content }
  } catch (error) {
    return mapOpenClawFetchError(error)
  } finally {
    clearTimeout(timeoutId)
  }
}
