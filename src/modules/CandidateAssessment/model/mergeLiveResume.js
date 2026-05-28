// Global Instructions Rule Applied!

import {
  normalizeResumeContent,
  normalizeContactFields,
  isResumeContentEmpty,
  RESUME_SECTIONS
} from './resumeContent'

const isEmptyString = (value) => !String(value ?? '').trim()
const isEmptyArray = (arr) => !Array.isArray(arr) || arr.length === 0

/**
 * Compute completeness score (0–100) from contact + resume content.
 * @param {import('./resumeContent').UserContactFields} contact
 * @param {import('./resumeContent').ResumeContent} content
 */
export const computeCompletenessScore = (contact, content) => {
  const normalized = normalizeResumeContent(content)
  const c = normalizeContactFields(contact)
  let score = 0

  if (c.first_name && c.last_name) score += 8
  if (c.email) score += 4
  if (c.phone) score += 4
  if (c.location) score += 4

  if (!isEmptyString(normalized.summary || c.summary)) score += 10

  if (normalized.skills.length >= 3) score += 15
  else if (normalized.skills.length >= 1) score += 8

  if (normalized.experience.length >= 2) score += 25
  else if (normalized.experience.length >= 1) score += 15

  if (normalized.education.length >= 1) score += 15

  const extras =
    (normalized.certifications.length > 0 ? 5 : 0) +
    (normalized.languages.length > 0 ? 5 : 0) +
    (normalized.references.length > 0 ? 5 : 0)
  score += extras

  return Math.min(score, 100)
}

/**
 * Merge source content into target, respecting chat-protected sections.
 * @param {import('./resumeContent').ResumeContent} target
 * @param {import('./resumeContent').ResumeContent} source
 * @param {{ lastChatUpdateAt?: string|null, overwrite?: boolean }} options
 */
const mergeContentSections = (target, source, options = {}) => {
  const { lastChatUpdateAt, overwrite = false } = options
  const result = normalizeResumeContent(target)
  const incoming = normalizeResumeContent(source)
  const chatTimestamps = result._meta?.sectionTimestamps || {}

  const isChatProtected = (section) => {
    if (overwrite) return false
    if (!lastChatUpdateAt) return false
    const sectionTs = chatTimestamps[section]
    return sectionTs && new Date(sectionTs) >= new Date(lastChatUpdateAt)
  }

  if (!isChatProtected('summary') && !isEmptyString(incoming.summary)) {
    result.summary = incoming.summary
  }

  if (!isChatProtected('skills') && incoming.skills.length > 0) {
    result.skills = incoming.skills
  }

  const mergeArraySection = (section) => {
    if (isChatProtected(section)) return
    if (incoming[section]?.length > 0) {
      result[section] = incoming[section]
    }
  }

  RESUME_SECTIONS.filter((s) => s !== 'summary' && s !== 'skills').forEach(mergeArraySection)

  return result
}

/**
 * Fill empty contact fields from source without overwriting existing values.
 * @param {import('./resumeContent').UserContactFields} target
 * @param {import('./resumeContent').UserContactFields} source
 */
export const mergeContactFields = (target, source) => {
  const result = normalizeContactFields(target)
  const incoming = normalizeContactFields(source)

  for (const key of Object.keys(result)) {
    if (isEmptyString(result[key]) && !isEmptyString(incoming[key])) {
      result[key] = incoming[key]
    }
  }

  return result
}

/**
 * Merge primary resume source into canonical live resume.
 */
export const mergeIntoLiveResume = ({ currentContent, sourceContent, lastChatUpdateAt, isPrimary = true }) => {
  const current = normalizeResumeContent(currentContent)
  const source = normalizeResumeContent(sourceContent)

  if (isResumeContentEmpty(current)) {
    return source
  }

  if (isPrimary) {
    return mergeContentSections(current, source, { lastChatUpdateAt, overwrite: false })
  }

  const result = { ...current }
  if (isEmptyString(result.summary) && !isEmptyString(source.summary)) {
    result.summary = source.summary
  }
  if (isEmptyArray(result.skills) && source.skills.length > 0) {
    result.skills = source.skills
  }
  for (const section of ['experience', 'education', 'certifications', 'languages', 'references']) {
    if (isEmptyArray(result[section]) && source[section]?.length > 0) {
      result[section] = source[section]
    }
  }
  return normalizeResumeContent(result)
}
