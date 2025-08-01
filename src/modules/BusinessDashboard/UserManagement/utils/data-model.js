// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for User Management
 * Defines validation schemas and business logic for users, invitations, and permissions
 */

// User role definitions
export const USER_ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  VIEWER: 'viewer'
}

// User status definitions
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
}

// Permission definitions
export const PERMISSIONS = {
  PUBLISH_LISTINGS: 'publishListings',
  EDIT_ORG_PROFILE: 'editOrgProfile',
  MANAGE_QUESTIONNAIRES: 'manageQuestionnaires',
  VIEW_CANDIDATES: 'viewCandidates',
  MANAGE_CANDIDATES: 'manageCandidates',
  VIEW_REPORTS: 'viewReports'
}

/**
 * User Schema
 * Defines the structure and validation rules for user data based on users table
 */
export const UserSchema = {
  id: { type: 'string', required: true }, // UUID
  first_name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  last_name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  email: { type: 'string', required: true, format: 'email', maxLength: 255 },
  org_id: { type: 'string', required: false }, // UUID, will be inherited
  avatar_url: { type: 'string', required: false, maxLength: 500 },
  // Legacy fields for backwards compatibility
  name: { type: 'string', required: false, minLength: 2, maxLength: 100 }, // Computed from first_name + last_name
  role: { type: 'string', required: false, enum: Object.values(USER_ROLES) }, // TODO: add to schema
  status: { type: 'string', required: false, enum: Object.values(USER_STATUS) }, // TODO: add to schema
  lastLogin: { type: 'string', required: false, format: 'iso-date' },
  invitedDate: { type: 'string', required: false, format: 'iso-date' },
  permissions: { type: 'object', required: false },
  invitedBy: { type: 'string', required: false }
}

/**
 * Invitation Schema
 * Defines the structure for user invitation data
 */
export const InvitationSchema = {
  email: { type: 'string', required: true, format: 'email', maxLength: 255 },
  first_name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  last_name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  // Legacy fields for backwards compatibility
  name: { type: 'string', required: false, maxLength: 100 }, // Can be computed from first_name + last_name
  role: { type: 'string', required: false, enum: Object.values(USER_ROLES) }, // Optional for now
  message: { type: 'string', required: false, maxLength: 500 }
}

/**
 * Permissions Schema
 * Defines the structure for user permissions
 */
export const PermissionsSchema = {
  publishListings: { type: 'boolean', required: true },
  editOrgProfile: { type: 'boolean', required: true },
  manageQuestionnaires: { type: 'boolean', required: true },
  viewCandidates: { type: 'boolean', required: true },
  manageCandidates: { type: 'boolean', required: true },
  viewReports: { type: 'boolean', required: true }
}

/**
 * Validate user data
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
export const validateUser = (userData) => {
  const errors = []

  // Required fields validation for first_name and last_name
  if (!userData.first_name || typeof userData.first_name !== 'string') {
    errors.push('First name is required and must be a string')
  } else if (userData.first_name.length < 1 || userData.first_name.length > 100) {
    errors.push('First name must be between 1 and 100 characters')
  }

  if (!userData.last_name || typeof userData.last_name !== 'string') {
    errors.push('Last name is required and must be a string')
  } else if (userData.last_name.length < 1 || userData.last_name.length > 100) {
    errors.push('Last name must be between 1 and 100 characters')
  }

  if (!userData.email || typeof userData.email !== 'string') {
    errors.push('Email is required and must be a string')
  } else if (!isValidEmail(userData.email)) {
    errors.push('Email must be a valid email address')
  } else if (userData.email.length > 255) {
    errors.push('Email must be 255 characters or less')
  }

  // Optional field validation (for backwards compatibility)
  if (userData.name && (typeof userData.name !== 'string' || userData.name.length < 2 || userData.name.length > 100)) {
    errors.push('Name must be a string between 2 and 100 characters')
  }

  if (userData.role && !Object.values(USER_ROLES).includes(userData.role)) {
    errors.push('Role must be one of: admin, recruiter, viewer')
  }

  if (userData.status && !Object.values(USER_STATUS).includes(userData.status)) {
    errors.push('Status must be one of: active, inactive, pending')
  }

  if (userData.invitedDate && !isValidISODate(userData.invitedDate)) {
    errors.push('Invited date must be a valid ISO date')
  }

  if (userData.permissions && typeof userData.permissions !== 'object') {
    errors.push('Permissions must be an object')
  } else if (userData.permissions) {
    const permissionsValidation = validatePermissions(userData.permissions)
    if (!permissionsValidation.isValid) {
      errors.push(...permissionsValidation.errors)
    }
  }

  if (userData.lastLogin && !isValidISODate(userData.lastLogin)) {
    errors.push('Last login must be a valid ISO date')
  }

  if (userData.avatar_url && (typeof userData.avatar_url !== 'string' || userData.avatar_url.length > 500)) {
    errors.push('Avatar URL must be a string with 500 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate invitation data
 * @param {Object} invitationData - Invitation data to validate
 * @returns {Object} Validation result
 */
export const validateInvitation = (invitationData) => {
  const errors = []

  // Email validation
  if (!invitationData.email || typeof invitationData.email !== 'string') {
    errors.push('Email is required and must be a string')
  } else if (!isValidEmail(invitationData.email)) {
    errors.push('Email must be a valid email address')
  } else if (invitationData.email.length > 255) {
    errors.push('Email must be 255 characters or less')
  }

  // First name validation
  if (!invitationData.first_name || typeof invitationData.first_name !== 'string') {
    errors.push('First name is required and must be a string')
  } else if (invitationData.first_name.length < 1 || invitationData.first_name.length > 100) {
    errors.push('First name must be between 1 and 100 characters')
  }

  // Last name validation
  if (!invitationData.last_name || typeof invitationData.last_name !== 'string') {
    errors.push('Last name is required and must be a string')
  } else if (invitationData.last_name.length < 1 || invitationData.last_name.length > 100) {
    errors.push('Last name must be between 1 and 100 characters')
  }

  // Optional field validation
  if (invitationData.role && !Object.values(USER_ROLES).includes(invitationData.role)) {
    errors.push('Role must be one of: admin, recruiter, viewer')
  }

  if (invitationData.name && (typeof invitationData.name !== 'string' || invitationData.name.length > 100)) {
    errors.push('Name must be a string with 100 characters or less')
  }

  if (invitationData.message && (typeof invitationData.message !== 'string' || invitationData.message.length > 500)) {
    errors.push('Message must be a string with 500 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate permissions data
 * @param {Object} permissions - Permissions to validate
 * @returns {Object} Validation result
 */
export const validatePermissions = (permissions) => {
  const errors = []
  const requiredPermissions = Object.values(PERMISSIONS)

  if (!permissions || typeof permissions !== 'object') {
    errors.push('Permissions must be an object')
    return { isValid: false, errors }
  }

  // Check that all required permissions are present and are booleans
  for (const permission of requiredPermissions) {
    if (!(permission in permissions)) {
      errors.push(`Permission '${permission}' is required`)
    } else if (typeof permissions[permission] !== 'boolean') {
      errors.push(`Permission '${permission}' must be a boolean`)
    }
  }

  // Check for unexpected permissions
  for (const permission of Object.keys(permissions)) {
    if (!requiredPermissions.includes(permission)) {
      errors.push(`Unknown permission '${permission}'`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Transform user data for database storage
 * @param {Object} userData - User data from form
 * @returns {Object} Transformed data for database
 */
export const transformToDatabase = (userData) => {
  return {
    first_name: userData.first_name?.trim(),
    last_name: userData.last_name?.trim(),
    email: userData.email?.toLowerCase().trim(),
    avatar_url: userData.avatar_url || null,
    org_id: userData.org_id || null,
    // Legacy fields (not stored in users table currently)
    // role: userData.role,
    // status: userData.status || USER_STATUS.PENDING,
    // permissions: userData.permissions,
    // invited_date: userData.invitedDate || new Date().toISOString(),
    // last_login: userData.lastLogin || null,
    // invited_by: userData.invitedBy || null,
    created_at: new Date().toISOString()
  }
}

/**
 * Transform user data from database for frontend
 * @param {Object} dbData - User data from database
 * @returns {Object} Transformed data for frontend
 */
export const transformFromDatabase = (dbData) => {
  return {
    id: dbData.id,
    first_name: dbData.first_name,
    last_name: dbData.last_name,
    name: `${dbData.first_name || ''} ${dbData.last_name || ''}`.trim() || dbData.email?.split('@')[0] || 'Unknown',
    email: dbData.email,
    avatar_url: dbData.avatar_url,
    org_id: dbData.org_id,
    // Default values for legacy fields
    role: 'viewer', // TODO: Add to schema
    status: 'active', // TODO: Add to schema
    permissions: getDefaultPermissionsForRole('viewer'),
    invitedDate: dbData.created_at,
    lastLogin: null, // TODO: Add to schema
    invitedBy: null, // TODO: Add to schema
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at || dbData.created_at
  }
}

/**
 * Get default permissions for a role
 * @param {string} role - User role
 * @returns {Object} Default permissions for the role
 */
export const getDefaultPermissionsForRole = (role) => {
  const permissionSets = {
    [USER_ROLES.ADMIN]: {
      [PERMISSIONS.PUBLISH_LISTINGS]: true,
      [PERMISSIONS.EDIT_ORG_PROFILE]: true,
      [PERMISSIONS.MANAGE_QUESTIONNAIRES]: true,
      [PERMISSIONS.VIEW_CANDIDATES]: true,
      [PERMISSIONS.MANAGE_CANDIDATES]: true,
      [PERMISSIONS.VIEW_REPORTS]: true
    },
    [USER_ROLES.RECRUITER]: {
      [PERMISSIONS.PUBLISH_LISTINGS]: true,
      [PERMISSIONS.EDIT_ORG_PROFILE]: false,
      [PERMISSIONS.MANAGE_QUESTIONNAIRES]: false,
      [PERMISSIONS.VIEW_CANDIDATES]: true,
      [PERMISSIONS.MANAGE_CANDIDATES]: true,
      [PERMISSIONS.VIEW_REPORTS]: true
    },
    [USER_ROLES.VIEWER]: {
      [PERMISSIONS.PUBLISH_LISTINGS]: false,
      [PERMISSIONS.EDIT_ORG_PROFILE]: false,
      [PERMISSIONS.MANAGE_QUESTIONNAIRES]: false,
      [PERMISSIONS.VIEW_CANDIDATES]: true,
      [PERMISSIONS.MANAGE_CANDIDATES]: false,
      [PERMISSIONS.VIEW_REPORTS]: true
    }
  }

  return permissionSets[role] || permissionSets[USER_ROLES.VIEWER]
}

/**
 * Check if user has specific permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether user has the permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) {
    return false
  }

  // Admins have all permissions
  if (user.role === USER_ROLES.ADMIN) {
    return true
  }

  return user.permissions[permission] === true
}

/**
 * Get permission display name
 * @param {string} permission - Permission key
 * @returns {string} Human-readable permission name
 */
export const getPermissionDisplayName = (permission) => {
  const displayNames = {
    [PERMISSIONS.PUBLISH_LISTINGS]: 'Publish Job Listings',
    [PERMISSIONS.EDIT_ORG_PROFILE]: 'Edit Organization Profile',
    [PERMISSIONS.MANAGE_QUESTIONNAIRES]: 'Manage Questionnaires',
    [PERMISSIONS.VIEW_CANDIDATES]: 'View Candidates',
    [PERMISSIONS.MANAGE_CANDIDATES]: 'Manage Candidates',
    [PERMISSIONS.VIEW_REPORTS]: 'View Reports'
  }

  return displayNames[permission] || permission
}

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} Human-readable role name
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.RECRUITER]: 'Recruiter',
    [USER_ROLES.VIEWER]: 'Viewer'
  }

  return displayNames[role] || role
}

// Utility functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate ISO date format
 * @param {string} date - Date string to validate
 * @returns {boolean} Whether date is valid ISO format
 */
const isValidISODate = (date) => {
  const parsedDate = new Date(date)
  return parsedDate instanceof Date && !isNaN(parsedDate) && date === parsedDate.toISOString()
}

// Export configuration object
const userManagementConfig = {
  USER_ROLES,
  USER_STATUS,
  PERMISSIONS,
  UserSchema,
  InvitationSchema,
  PermissionsSchema,
  validateUser,
  validateInvitation,
  validatePermissions,
  transformToDatabase,
  transformFromDatabase,
  getDefaultPermissionsForRole,
  hasPermission,
  getPermissionDisplayName,
  getRoleDisplayName
}

export default userManagementConfig
