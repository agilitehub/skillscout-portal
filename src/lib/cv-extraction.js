// Global Instructions Rule Applied!

import { getOpenClawConfig, isOpenClawConfigured } from './openclaw-config'

/**
 * Extract structured candidate fields from CV text via OpenClaw Gateway
 * (OpenAI-compatible POST /v1/chat/completions on the same machine or a shared host).
 * Respects REACT_APP_MOCK_AI when mock mode is enabled.
 */

const isMockMode = () => {
  if (process.env.REACT_APP_MOCK_AI === 'true') {
    return true
  }
  return !isOpenClawConfigured()
}

const buildMockFields = (cvText = '') => {
  const snippet = cvText.slice(0, 80).replace(/\s+/g, ' ').trim()
  return {
    first_name: 'Alex',
    last_name: 'Sample',
    email: 'alex.sample@example.com',
    phone: '+1 555 0100',
    _mockNote: snippet ? `Parsed from: ${snippet}…` : undefined
  }
}

const normalizeFields = (raw = {}) => ({
  first_name: String(raw.first_name ?? raw.firstName ?? '').trim(),
  last_name: String(raw.last_name ?? raw.lastName ?? '').trim(),
  email: String(raw.email ?? '').trim(),
  phone: String(raw.phone ?? '').trim()
})

const SYSTEM_PROMPT =
  'You extract candidate contact details from resume/CV text. Respond with JSON only using keys: first_name, last_name, email, phone. Use empty strings for unknown fields. Do not invent data not supported by the CV.'

/**
 * @param {string} content
 * @returns {Record<string, unknown>|null}
 */
const parseJsonFromAssistantContent = (content) => {
  if (!content || typeof content !== 'string') {
    return null
  }

  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced ? fenced[1] : trimmed).trim()

  try {
    return JSON.parse(candidate)
  } catch {
    const start = candidate.indexOf('{')
    const end = candidate.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

/**
 * @param {string} textForModel
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
const callOpenClawChatCompletions = async (textForModel) => {
  const { baseUrl, token, model, timeoutMs } = getOpenClawConfig()
  const url = `${baseUrl}/chat/completions`

  const headers = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const body = {
    model,
    user: 'skillscout-candidate-management',
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Extract candidate fields from this CV:\n\n${textForModel}` }
    ]
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const detail =
        payload?.error?.message ||
        payload?.error ||
        payload?.message ||
        `OpenClaw request failed (${response.status})`
      console.error('OpenClaw CV extraction error:', response.status, payload)

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'OpenClaw authentication failed. Check REACT_APP_OPENCLAW_GATEWAY_TOKEN and gateway auth settings.'
        }
      }

      return { success: false, error: typeof detail === 'string' ? detail : 'Unable to process this CV with OpenClaw.' }
    }

    const content = payload?.choices?.[0]?.message?.content
    const parsed = parseJsonFromAssistantContent(content)

    if (!parsed) {
      return {
        success: false,
        error: 'OpenClaw returned a response that could not be parsed as candidate JSON. Try again or edit fields manually.'
      }
    }

    return { success: true, data: normalizeFields(parsed) }
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { success: false, error: 'OpenClaw request timed out. Try a smaller CV or increase REACT_APP_OPENCLAW_TIMEOUT_MS.' }
    }

    console.error('OpenClaw CV extraction fetch error:', error)

    return {
      success: false,
      error:
        'Cannot reach OpenClaw. Ensure the gateway is running (e.g. openclaw gateway --port 18789) and REACT_APP_OPENCLAW_BASE_URL is correct.'
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * @param {string} cvText - Plain text extracted from a CV file
 * @returns {Promise<{ success: boolean, data?: { first_name, last_name, email, phone }, error?: string }>}
 */
export async function extractCandidateFieldsFromCvText(cvText) {
  try {
    if (!cvText || !String(cvText).trim()) {
      return { success: false, error: 'No text could be extracted from this CV' }
    }

    const trimmedText = String(cvText).trim()
    const maxChars = 12000
    const textForModel = trimmedText.length > maxChars ? `${trimmedText.slice(0, maxChars)}\n...[truncated]` : trimmedText

    if (isMockMode()) {
      return { success: true, data: normalizeFields(buildMockFields(textForModel)) }
    }

    return await callOpenClawChatCompletions(textForModel)
  } catch (error) {
    console.error('extractCandidateFieldsFromCvText error:', error)
    return { success: false, error: 'Failed to extract candidate details from this CV' }
  }
}
