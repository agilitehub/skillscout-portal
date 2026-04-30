// Global Instructions Rule Applied!

/**
 * App-wide domain status enums. Values mirror existing API/DB strings — do not change casing without a migration.
 */

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
