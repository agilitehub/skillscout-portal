// Global Instructions Rule Applied!

/** @typedef {'summary'|'skills'|'experience'|'education'|'certifications'|'languages'|'references'} ResumeSection */

/**
 * @typedef {Object} ResumeExperience
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {string} start_date
 * @property {string} end_date
 * @property {boolean} is_current
 * @property {string} description
 */

/**
 * @typedef {Object} ResumeEducation
 * @property {string} degree
 * @property {string} field
 * @property {string} institution
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} description
 */

/**
 * @typedef {Object} ResumeContent
 * @property {string} summary
 * @property {string[]} skills
 * @property {ResumeExperience[]} experience
 * @property {ResumeEducation[]} education
 * @property {{ name: string, issuer: string, date: string }[]} certifications
 * @property {{ language: string, proficiency: string }[]} languages
 * @property {{ name: string, relationship: string, contact: string }[]} references
 * @property {{ sectionTimestamps?: Record<string, string> }} [_meta]
 */

export const RESUME_SECTIONS = [
  'summary',
  'skills',
  'experience',
  'education',
  'certifications',
  'languages',
  'references'
]

/** @returns {ResumeContent} */
export const createEmptyResumeContent = () => ({
  summary: '',
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  languages: [],
  references: [],
  _meta: { sectionTimestamps: {} }
})

const toString = (value) => String(value ?? '').trim()

const normalizeExperience = (item = {}) => ({
  title: toString(item.title),
  company: toString(item.company),
  location: toString(item.location),
  start_date: toString(item.start_date ?? item.startDate),
  end_date: toString(item.end_date ?? item.endDate),
  is_current: Boolean(item.is_current ?? item.isCurrent),
  description: toString(item.description)
})

const normalizeEducation = (item = {}) => ({
  degree: toString(item.degree),
  field: toString(item.field ?? item.field_of_study),
  institution: toString(item.institution ?? item.school),
  start_date: toString(item.start_date ?? item.startDate),
  end_date: toString(item.end_date ?? item.endDate ?? item.year),
  description: toString(item.description)
})

/** @param {unknown} raw @returns {ResumeContent} */
export const normalizeResumeContent = (raw = {}) => {
  const source = raw && typeof raw === 'object' ? raw : {}
  return {
    summary: toString(source.summary),
    skills: Array.isArray(source.skills) ? source.skills.map((s) => toString(s)).filter(Boolean) : [],
    experience: Array.isArray(source.experience) ? source.experience.map(normalizeExperience) : [],
    education: Array.isArray(source.education) ? source.education.map(normalizeEducation) : [],
    certifications: Array.isArray(source.certifications)
      ? source.certifications.map((c) => ({
          name: toString(c.name),
          issuer: toString(c.issuer),
          date: toString(c.date)
        }))
      : [],
    languages: Array.isArray(source.languages)
      ? source.languages.map((l) => ({
          language: toString(l.language),
          proficiency: toString(l.proficiency)
        }))
      : [],
    references: Array.isArray(source.references)
      ? source.references.map((r) => ({
          name: toString(r.name),
          relationship: toString(r.relationship),
          contact: toString(r.contact)
        }))
      : [],
    _meta: {
      sectionTimestamps:
        source._meta?.sectionTimestamps && typeof source._meta.sectionTimestamps === 'object'
          ? { ...source._meta.sectionTimestamps }
          : {}
    }
  }
}

/** @param {ResumeContent} content */
export const isResumeContentEmpty = (content) => {
  const normalized = normalizeResumeContent(content)
  return (
    !normalized.summary &&
    normalized.skills.length === 0 &&
    normalized.experience.length === 0 &&
    normalized.education.length === 0 &&
    normalized.certifications.length === 0 &&
    normalized.languages.length === 0 &&
    normalized.references.length === 0
  )
}

/**
 * @typedef {Object} UserContactFields
 * @property {string} first_name
 * @property {string} middle_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} location
 * @property {string} professional_title
 * @property {string} summary
 */

/** @param {unknown} raw @returns {UserContactFields} */
export const normalizeContactFields = (raw = {}) => ({
  first_name: toString(raw.first_name ?? raw.firstName),
  middle_name: toString(raw.middle_name ?? raw.middleName),
  last_name: toString(raw.last_name ?? raw.lastName),
  email: toString(raw.email),
  phone: toString(raw.phone),
  location: toString(raw.location),
  professional_title: toString(raw.professional_title ?? raw.professionalTitle ?? raw.title),
  summary: toString(raw.summary)
})

/** Format experience duration for display */
export const formatExperienceDuration = (exp) => {
  const start = exp.start_date || ''
  const end = exp.is_current ? 'Present' : exp.end_date || ''
  if (start && end) return `${start} – ${end}`
  return start || end || ''
}

/** @param {UserContactFields} contact */
export const formatFullName = (contact) => {
  return [contact.first_name, contact.middle_name, contact.last_name].filter(Boolean).join(' ') || 'Your Name'
}
