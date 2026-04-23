// Global Instructions Rule Applied!

/**
 * App-wide constants (routes, domain statuses, storage defaults).
 * Values mirror existing API/DB strings — do not change casing without a migration.
 */

/** React Router prefix for the authenticated business shell. */
export const BUSINESS_DASHBOARD_BASE_PATH = '/business-dashboard'

/**
 * @param {string} [relativePath] segment without leading slash, e.g. 'job-listings'
 * @returns {string} e.g. '/business-dashboard/job-listings'
 */
export const buildBusinessDashboardPath = (relativePath = '') => {
  if (!relativePath) return BUSINESS_DASHBOARD_BASE_PATH
  const trimmed = relativePath.replace(/^\/+/, '')
  return `${BUSINESS_DASHBOARD_BASE_PATH}/${trimmed}`
}

/** Default Supabase Storage bucket for user uploads (matches existing usage). */
export const DEFAULT_SUPABASE_STORAGE_BUCKET = 'file-uploads'

/** Users / invitations — lowercase in DB. */
export const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
})

/** Branches — lowercase in DB. */
export const BRANCH_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive'
})

/** Questionnaires — PascalCase in app/DB. */
export const QUESTIONNAIRE_STATUS = Object.freeze({
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived'
})

export const QUESTIONNAIRE_STATUS_LIST = Object.freeze(Object.values(QUESTIONNAIRE_STATUS))

/** Job listings — PascalCase in app/DB. */
export const JOB_LISTING_STATUS = Object.freeze({
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  CLOSED: 'Closed'
})

export const JOB_LISTING_STATUS_LIST = Object.freeze(Object.values(JOB_LISTING_STATUS))

/** Billing mock / UI — lowercase (align with existing Billing module usage). */
export const BILLING_RECORD_STATUS = Object.freeze({
  ACTIVE: 'active',
  PAID: 'paid',
  CANCELLED: 'cancelled'
})

/** Business dashboard home alert cards (mock data + switch handlers). */
export const DASHBOARD_ALERT_TYPE = Object.freeze({
  CANDIDATE_SUBMISSION: 'candidate_submission',
  MATCH_FOUND: 'match_found',
  INTERVIEW_SCHEDULED: 'interview_scheduled'
})

export const LOCAL_STORAGE_KEYS = Object.freeze({
  BUSINESS_SIDEBAR_SETTINGS_EXPANDED: 'businessSidebar_settingsExpanded'
})
