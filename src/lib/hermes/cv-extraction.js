// Global Instructions Rule Applied!

import { callChatCompletions } from './client'
import { buildCandidateSessionHeaders } from './sessions'
import { isHermesMockMode, buildMockFullResume } from './mock'
import { normalizeResumeContent, normalizeContactFields } from '../../modules/CandidateAssessment/model/resumeContent'

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

const FULL_RESUME_SYSTEM_PROMPT = `You extract structured resume data from CV/resume text. Respond with JSON only using this exact shape:
{
  "contact": {
    "first_name": "",
    "middle_name": "",
    "last_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "professional_title": "",
    "summary": ""
  },
  "content": {
    "summary": "",
    "skills": [],
    "experience": [{ "title": "", "company": "", "location": "", "start_date": "", "end_date": "", "is_current": false, "description": "" }],
    "education": [{ "degree": "", "field": "", "institution": "", "start_date": "", "end_date": "", "description": "" }],
    "certifications": [{ "name": "", "issuer": "", "date": "" }],
    "languages": [{ "language": "", "proficiency": "" }],
    "references": [{ "name": "", "relationship": "", "contact": "" }]
  }
}
Use empty strings and empty arrays for unknown fields. Do not invent data not supported by the CV. Dates should be human-readable (e.g. "Jan 2020").`

const truncateCvText = (cvText, maxChars = 12000) => {
  const trimmedText = String(cvText).trim()
  return trimmedText.length > maxChars ? `${trimmedText.slice(0, maxChars)}\n...[truncated]` : trimmedText
}

/**
 * Extract full resume structure from CV text via Hermes Agent API.
 * @param {string} cvText
 * @param {string|null} [userId] — scopes Hermes session key when provided
 */
export async function extractFullResumeFromCvText(cvText, userId = null) {
  try {
    if (!cvText || !String(cvText).trim()) {
      return { success: false, error: 'No text could be extracted from this CV' }
    }

    const textForModel = truncateCvText(cvText)

    if (isHermesMockMode()) {
      return { success: true, data: buildMockFullResume(textForModel) }
    }

    const { sessionId, sessionKey } = userId
      ? buildCandidateSessionHeaders(userId)
      : { sessionId: 'skillscout-candidate-cv', sessionKey: 'skillscout-candidate-cv' }

    const result = await callChatCompletions({
      user: sessionKey,
      sessionId,
      sessionKey,
      temperature: 0.2,
      messages: [
        { role: 'system', content: FULL_RESUME_SYSTEM_PROMPT },
        { role: 'user', content: `Extract full resume data from this CV:\n\n${textForModel}` }
      ]
    })

    if (!result.success) {
      return result
    }

    const parsed = parseJsonFromAssistantContent(result.content)
    if (!parsed) {
      return {
        success: false,
        error: 'Hermes returned a response that could not be parsed as resume JSON. Try again.'
      }
    }

    return {
      success: true,
      data: {
        contact: normalizeContactFields(parsed.contact || parsed),
        content: normalizeResumeContent(parsed.content || parsed)
      }
    }
  } catch (error) {
    console.error('extractFullResumeFromCvText error:', error)
    return { success: false, error: 'Failed to extract resume details from this CV' }
  }
}
