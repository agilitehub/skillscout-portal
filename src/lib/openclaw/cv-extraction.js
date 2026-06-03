// Global Instructions Rule Applied!

import { callChatCompletions } from './client'
import { isOpenClawMockMode, buildMockCvFields } from './mock'

export const parseJsonFromAssistantContent = (content) => {
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

const normalizeCvFields = (raw = {}) => ({
  first_name: String(raw.first_name ?? raw.firstName ?? '').trim(),
  last_name: String(raw.last_name ?? raw.lastName ?? '').trim(),
  email: String(raw.email ?? '').trim(),
  phone: String(raw.phone ?? '').trim()
})

const CV_SYSTEM_PROMPT =
  'You extract candidate contact details from resume/CV text. Respond with JSON only using keys: first_name, last_name, email, phone. Use empty strings for unknown fields. Do not invent data not supported by the CV.'

const truncateCvText = (cvText, maxChars = 12000) => {
  const trimmedText = String(cvText).trim()
  return trimmedText.length > maxChars ? `${trimmedText.slice(0, maxChars)}\n...[truncated]` : trimmedText
}

/**
 * Extract structured candidate fields from CV text via OpenClaw Gateway.
 * Business Dashboard (Candidate Management) only.
 */
export async function extractCandidateFieldsFromCvText(cvText) {
  try {
    if (!cvText || !String(cvText).trim()) {
      return { success: false, error: 'No text could be extracted from this CV' }
    }

    const textForModel = truncateCvText(cvText)

    if (isOpenClawMockMode()) {
      return { success: true, data: normalizeCvFields(buildMockCvFields(textForModel)) }
    }

    const result = await callChatCompletions({
      user: 'skillscout-candidate-management',
      temperature: 0.2,
      messages: [
        { role: 'system', content: CV_SYSTEM_PROMPT },
        { role: 'user', content: `Extract candidate fields from this CV:\n\n${textForModel}` }
      ]
    })

    if (!result.success) {
      return result
    }

    const parsed = parseJsonFromAssistantContent(result.content)
    if (!parsed) {
      return {
        success: false,
        error:
          'OpenClaw returned a response that could not be parsed as candidate JSON. Try again or edit fields manually.'
      }
    }

    return { success: true, data: normalizeCvFields(parsed) }
  } catch (error) {
    console.error('extractCandidateFieldsFromCvText error:', error)
    return { success: false, error: 'Failed to extract candidate details from this CV' }
  }
}
