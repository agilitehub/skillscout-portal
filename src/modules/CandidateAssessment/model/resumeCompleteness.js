// Global Instructions Rule Applied!

import { normalizeResumeContent, normalizeContactFields } from './resumeContent'

const isEmptyString = (value) => !String(value ?? '').trim()

/**
 * Items still missing or below recommended completeness for the live resume.
 * Mirrors weights in computeCompletenessScore.
 * @param {import('./resumeContent').UserContactFields} contact
 * @param {import('./resumeContent').ResumeContent} content
 * @returns {{ key: string, label: string, optional?: boolean }[]}
 */
export const getIncompleteResumeItems = (contact, content) => {
  const c = normalizeContactFields(contact)
  const normalized = normalizeResumeContent(content)
  const items = []

  if (!c.first_name || !c.last_name) {
    items.push({ key: 'name', label: 'Full name' })
  }
  if (!c.email) {
    items.push({ key: 'email', label: 'Email address' })
  }
  if (!c.phone) {
    items.push({ key: 'phone', label: 'Phone number' })
  }
  if (!c.location) {
    items.push({ key: 'location', label: 'Location' })
  }
  if (!c.professional_title) {
    items.push({ key: 'title', label: 'Professional title' })
  }
  if (isEmptyString(normalized.summary || c.summary)) {
    items.push({ key: 'summary', label: 'Professional summary' })
  }

  if (normalized.skills.length === 0) {
    items.push({ key: 'skills', label: 'Skills' })
  } else if (normalized.skills.length < 3) {
    items.push({ key: 'skills-count', label: `More skills (${normalized.skills.length} of 3 recommended)` })
  }

  if (normalized.experience.length === 0) {
    items.push({ key: 'experience', label: 'Work experience' })
  } else if (normalized.experience.length < 2) {
    items.push({ key: 'experience-count', label: 'Additional work experience (1 role added)' })
  }

  if (normalized.education.length === 0) {
    items.push({ key: 'education', label: 'Education' })
  }

  if (normalized.certifications.length === 0) {
    items.push({ key: 'certifications', label: 'Certifications', optional: true })
  }
  if (normalized.languages.length === 0) {
    items.push({ key: 'languages', label: 'Languages', optional: true })
  }
  if (normalized.references.length === 0) {
    items.push({ key: 'references', label: 'References', optional: true })
  }

  return items
}

/**
 * @param {import('./resumeContent').UserContactFields} contact
 */
export const isContactFieldMissing = (contact, field) => {
  const c = normalizeContactFields(contact)
  const value = c[field]
  return isEmptyString(value)
}
