// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import {
  normalizeResumeContent,
  normalizeContactFields,
  formatFullName,
  formatExperienceDuration,
  createEmptyResumeContent,
  isResumeContentEmpty
} from './resumeContent'
import { computeCompletenessScore } from './mergeLiveResume'
import { getIncompleteResumeItems, isContactFieldMissing } from './resumeCompleteness'

/**
 * Build UI-ready resume preview from Supabase bundle data.
 * @param {{ contact?: object, liveResume?: object, resumes?: object[], dataSources?: object[] }} bundle
 */
export function buildResumePreviewData(bundle) {
  const contact = normalizeContactFields(bundle?.contact || {})
  const content = normalizeResumeContent(bundle?.liveResume?.content || createEmptyResumeContent())
  const hasContent = !isResumeContentEmpty(content) || contact.first_name || contact.last_name

  const completeness =
    bundle?.liveResume?.completeness_score ?? computeCompletenessScore(contact, content)

  const incompleteItems = getIncompleteResumeItems(contact, content)

  const documents = (bundle?.resumes || [])
    .filter((r) => r.parse_status === 'complete' || r.original_filename)
    .map((r) => ({
      id: r.id,
      name: r.original_filename || 'Resume',
      type: (r.original_filename || '').split('.').pop()?.toUpperCase() || 'FILE',
      uploadedAt: r.parsed_at
        ? new Date(r.parsed_at).toLocaleDateString()
        : new Date(r.created_at).toLocaleDateString(),
      isPrimary: bundle?.dataSources?.find((s) => s.external_ref === r.id)?.is_primary ?? false,
      sourceId: r.data_source_id
    }))

  const processingSource = (bundle?.dataSources || []).find((s) => s.status === 'processing')

  const fullName = formatFullName(contact)
  const displayName =
    fullName !== 'Your Name' ? fullName : contact.email ? contact.email.split('@')[0] : 'Your Name'

  return {
    hasContent,
    isProcessing: Boolean(processingSource),
    processingLabel: processingSource?.label || null,
    basicInfo: {
      name: displayName,
      nameComplete: Boolean(contact.first_name && contact.last_name),
      email: contact.email || null,
      emailComplete: !isContactFieldMissing(contact, 'email'),
      phone: contact.phone || null,
      phoneComplete: !isContactFieldMissing(contact, 'phone'),
      location: contact.location || null,
      locationComplete: !isContactFieldMissing(contact, 'location'),
      title: contact.professional_title || content.experience[0]?.title || null,
      titleComplete: !isContactFieldMissing(contact, 'professional_title')
    },
    summary: content.summary || contact.summary || null,
    summaryComplete: Boolean((content.summary || contact.summary)?.trim()),
    skills: content.skills,
    skillsComplete: content.skills.length >= 3,
    experience: content.experience.map((exp) => ({
      title: exp.title || null,
      company: exp.company || null,
      location: exp.location || null,
      duration: formatExperienceDuration(exp),
      description: exp.description || null
    })),
    experienceComplete: content.experience.length >= 2,
    education: content.education.map((edu) => ({
      degree: edu.degree || null,
      field: edu.field || null,
      school: edu.institution || null,
      year: edu.end_date || edu.start_date || null,
      description: edu.description || null
    })),
    educationComplete: content.education.length >= 1,
    certifications: content.certifications,
    certificationsComplete: content.certifications.length > 0,
    languages: content.languages,
    languagesComplete: content.languages.length > 0,
    references: content.references,
    referencesComplete: content.references.length > 0,
    documents,
    documentsComplete: documents.length > 0,
    incompleteItems,
    completeness,
    dataSources: bundle?.dataSources || [],
    primarySourceId: bundle?.liveResume?.primary_source_id || null
  }
}
