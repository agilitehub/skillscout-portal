// Global Instructions Rule Applied!

/**
 * React Router prefix for the authenticated business shell.
 */
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
