// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import {
  faBriefcase,
  faClipboardCheck,
  faCogs,
  faFileText,
  faHome,
  faList,
  faSliders,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { buildBusinessDashboardPath } from '../../constants'

/**
 * Application navigation configuration.
 * - Business dashboard primary nav lives in the left sidebar (see core layout BusinessSidebar).
 * - Optional top header links for public vs authenticated shell (most authenticated UI uses the sidebar only).
 */

/** Top header: links when the user is not signed in (e.g. marketing / login layout). */
export const UNAUTHENTICATED_NAV_ITEMS = [
  {
    path: '/',
    label: 'Login'
  }
]

/**
 * Top header: links when signed in. Intentionally empty — main IA is the business sidebar.
 * Add entries here only if you need horizontal header links in addition to the sidebar.
 */
export const AUTHENTICATED_HEADER_NAV_ITEMS = []

/** @deprecated Use AUTHENTICATED_HEADER_NAV_ITEMS. Kept for callers that still expect this name. */
export const AUTHENTICATED_NAV_ITEMS = AUTHENTICATED_HEADER_NAV_ITEMS

export const getHeaderNavItems = (isAuthenticated = false) =>
  isAuthenticated ? AUTHENTICATED_HEADER_NAV_ITEMS : UNAUTHENTICATED_NAV_ITEMS

/** Main (non-collapsible) items in the business dashboard left sidebar. */
export const BUSINESS_SIDEBAR_MAIN_ITEMS = [
  {
    path: buildBusinessDashboardPath(),
    icon: faHome,
    label: 'Dashboard',
    exact: true
  },
  {
    path: buildBusinessDashboardPath('job-listings'),
    icon: faBriefcase,
    label: 'Job Listings',
    exact: false
  },
  {
    path: buildBusinessDashboardPath('questionnaires'),
    icon: faClipboardCheck,
    label: 'Questionnaires',
    exact: false
  },
  {
    path: buildBusinessDashboardPath('job-descriptions'),
    icon: faFileText,
    label: 'Job Descriptions',
    exact: false
  }
]

/** Collapsible "Settings" group in the business dashboard sidebar. */
export const BUSINESS_SIDEBAR_SETTINGS_CATEGORY = {
  key: 'settings',
  label: 'Settings',
  icon: faCogs,
  items: [
    {
      path: buildBusinessDashboardPath('user-management'),
      icon: faUsers,
      label: 'User Management',
      exact: false
    },
    {
      path: buildBusinessDashboardPath('org-settings'),
      icon: faSliders,
      label: 'Organization Settings',
      exact: false
    },
    {
      path: buildBusinessDashboardPath('lookups'),
      icon: faList,
      label: 'Lookups',
      exact: false
    }
  ]
}
