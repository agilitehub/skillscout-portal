// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

export const DRAFT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed'
}

export const IMPORT_WIZARD_STEP = {
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  PREVIEW: 'preview',
  SUBMITTING: 'submitting'
}

export const CANDIDATE_SOURCE_BULK_UPLOAD = 'bulk_upload'

/**
 * @param {File} file
 * @returns {import('./index').DraftCandidate}
 */
export function createDraftFromFile(file) {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    file,
    cvOriginalFilename: file.name,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: DRAFT_STATUS.PENDING,
    errorMessage: null
  }
}

/**
 * @typedef {Object} DraftCandidate
 * @property {string} id
 * @property {File|null} file
 * @property {string} cvOriginalFilename
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} status
 * @property {string|null} errorMessage
 */

export const transformFromDatabase = (row) => ({
  id: row.id,
  firstName: row.first_name || '',
  lastName: row.last_name || '',
  fullName: [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || '—',
  email: row.email || '',
  phone: row.phone || '',
  cvOriginalFilename: row.cv_original_filename || '',
  cvStoragePath: row.cv_storage_path || '',
  source: row.source || CANDIDATE_SOURCE_BULK_UPLOAD,
  dateCreated: row.date_created,
  orgId: row.org_id
})

export const transformDraftToDatabase = (draft, context) => {
  const now = new Date().toISOString()
  return {
    org_id: context.orgId,
    first_name: (draft.firstName || '').trim(),
    last_name: (draft.lastName || '').trim(),
    email: (draft.email || '').trim() || null,
    phone: (draft.phone || '').trim() || null,
    cv_storage_path: context.cvStoragePath || null,
    cv_original_filename: draft.cvOriginalFilename || null,
    source: CANDIDATE_SOURCE_BULK_UPLOAD,
    created_by: context.userId || null,
    modified_by: context.userId || null,
    date_created: now,
    date_modified: now
  }
}

/**
 * @param {import('./index').DraftCandidate} draft
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateDraftForSubmit = (draft) => {
  if (draft.status === DRAFT_STATUS.FAILED) {
    return { valid: false, error: 'This row failed processing and cannot be submitted' }
  }
  const first = (draft.firstName || '').trim()
  const last = (draft.lastName || '').trim()
  if (!first && !last) {
    return { valid: false, error: 'First name or last name is required' }
  }
  if (!draft.file) {
    return { valid: false, error: 'Original CV file is missing' }
  }
  return { valid: true }
}

export const getSubmittableDrafts = (drafts) =>
  (drafts || []).filter((d) => d.status === DRAFT_STATUS.READY && validateDraftForSubmit(d).valid)
