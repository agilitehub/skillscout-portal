// Global Instructions Rule Applied!

/**
 * Build searchable plain text from a job description row.
 * @param {object} jd
 * @param {object} [listing]
 */
export function buildJobRequirementsText(jd, listing = {}) {
  if (!jd) return listing.description || listing.title || ''
  const parts = [
    listing.title && `Listing: ${listing.title}`,
    jd.title && `Role: ${jd.title}`,
    jd.overview,
    jd.responsibilities,
    jd.requirements,
    jd.technical_skills,
    jd.soft_skills,
    jd.preferred_skills,
    jd.education_experience,
    Array.isArray(jd.keywords) ? jd.keywords.join(', ') : null
  ].filter(Boolean)
  return parts.join('\n\n').slice(0, 12000)
}

/**
 * Build searchable plain text from live_resumes.content + user contact.
 * @param {object} content
 * @param {object} [user]
 */
export function buildResumeSearchText(content, user = {}) {
  const c = content && typeof content === 'object' ? content : {}
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  const skills = Array.isArray(c.skills) ? c.skills.join(', ') : ''
  const experience = (c.experience || [])
    .map((e) => {
      const dates = [e.start_date, e.is_current ? 'Present' : e.end_date].filter(Boolean).join(' – ')
      return `${e.title || ''} at ${e.company || ''} (${dates}): ${e.description || ''}`
    })
    .join('\n')
  const education = (c.education || [])
    .map((e) => `${e.degree || ''} ${e.field || ''} — ${e.institution || ''}`)
    .join('\n')

  const parts = [
    name && `Name: ${name}`,
    user.professional_title && `Title: ${user.professional_title}`,
    user.summary || c.summary,
    skills && `Skills: ${skills}`,
    experience && `Experience:\n${experience}`,
    education && `Education:\n${education}`
  ].filter(Boolean)

  return parts.join('\n\n').slice(0, 12000)
}
