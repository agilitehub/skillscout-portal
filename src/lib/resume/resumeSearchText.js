// Global Instructions Rule Applied!

/**
 * Build searchable plain text from live_resumes.content + user contact.
 * Shared by candidate matcher worker and business recruiter CV chat.
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
