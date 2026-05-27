// Global Instructions Rule Applied!

/**
 * React Router prefix for the authenticated business shell.
 */
export const BUSINESS_DASHBOARD_BASE_PATH = '/business-dashboard'

/** React Router prefix for the candidate / personal dashboard (AI chat). */
export const CANDIDATE_DASHBOARD_BASE_PATH = '/dashboard'

/** localStorage key for the user's preferred dashboard portal. */
export const DASHBOARD_TYPE_STORAGE_KEY = 'skillscout_dashboard_type'

/**
 * @param {string} [relativePath] segment without leading slash, e.g. 'job-listings'
 * @returns {string} e.g. '/business-dashboard/job-listings'
 */
export const buildBusinessDashboardPath = (relativePath = '') => {
  if (!relativePath) return BUSINESS_DASHBOARD_BASE_PATH
  const trimmed = relativePath.replace(/^\/+/, '')
  return `${BUSINESS_DASHBOARD_BASE_PATH}/${trimmed}`
}

/**
 * @param {string} [relativePath] segment without leading slash
 * @returns {string} e.g. '/dashboard'
 */
export const buildCandidateDashboardPath = (relativePath = '') => {
  if (!relativePath) return CANDIDATE_DASHBOARD_BASE_PATH
  const trimmed = relativePath.replace(/^\/+/, '')
  return `${CANDIDATE_DASHBOARD_BASE_PATH}/${trimmed}`
}

/**
 * Resolve the default authenticated landing path from saved preference.
 * @returns {string}
 */
export const getDefaultDashboardPath = () => {
  if (typeof window === 'undefined') return BUSINESS_DASHBOARD_BASE_PATH
  const saved = localStorage.getItem(DASHBOARD_TYPE_STORAGE_KEY)
  return saved === 'personal' ? CANDIDATE_DASHBOARD_BASE_PATH : BUSINESS_DASHBOARD_BASE_PATH
}
