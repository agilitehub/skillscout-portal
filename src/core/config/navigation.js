// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Centralized navigation configuration for the entire application
 * This serves as a single source of truth for all navigation-related data
 */

// Navigation items for unauthenticated users
export const UNAUTHENTICATED_NAV_ITEMS = [
  {
    path: '/',
    label: 'Login'
  }
]

// Navigation items for authenticated users
export const AUTHENTICATED_NAV_ITEMS = [
  // Items have been moved to the sidebar
]

// Helper functions to get navigation items based on authentication state
export const getHeaderNavItems = (isAuthenticated = false) =>
  isAuthenticated ? AUTHENTICATED_NAV_ITEMS : UNAUTHENTICATED_NAV_ITEMS
