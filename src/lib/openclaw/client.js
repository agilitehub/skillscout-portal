// Global Instructions Rule Applied!

import { getOpenClawConfig } from './config'
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
 * @property {number} [temperature]
 */

const buildHeaders = (token, stream) => {
  const headers = { 'Content-Type': 'application/json' }
  if (stream) {
    headers.Accept = 'text/event-stream'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
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

    // Support both LF and CRLF framed SSE
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
  temperature = 0.7
}) {
  const { baseUrl, token, model, timeoutMs } = getOpenClawConfig()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const linkedSignal = signal
  if (linkedSignal) {
    linkedSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(token, stream),
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
