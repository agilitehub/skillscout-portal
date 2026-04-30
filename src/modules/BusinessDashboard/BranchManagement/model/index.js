// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for Branch Management
 * Defines validation schemas and business logic for branches, addresses, and assignments
 */

// Branch status definitions
export const BRANCH_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

// Timezone definitions (commonly used)
export const TIMEZONES = {
  'America/New_York': 'Eastern Time (ET)',
  'America/Chicago': 'Central Time (CT)',
  'America/Denver': 'Mountain Time (MT)',
  'America/Los_Angeles': 'Pacific Time (PT)',
  'Europe/London': 'Greenwich Mean Time (GMT)',
  'Europe/Paris': 'Central European Time (CET)',
  'Asia/Tokyo': 'Japan Standard Time (JST)',
  'Asia/Shanghai': 'China Standard Time (CST)',
  'Australia/Sydney': 'Australian Eastern Time (AET)'
}

// Department definitions
export const DEPARTMENTS = [
  'Executive',
  'HR',
  'Finance',
  'IT',
  'Marketing',
  'Sales',
  'Engineering',
  'Product',
  'Design',
  'Customer Support',
  'Operations',
  'Legal',
  'Business Development',
  'Research',
  'Quality Assurance'
]

// Country definitions (common ones)
export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'India',
  'Singapore',
  'Netherlands'
]

/**
 * Branch Schema
 * Defines the structure and validation rules for branch data
 */
export const BranchSchema = {
  id: { type: 'number', required: true },
  name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  code: { type: 'string', required: true, minLength: 1, maxLength: 10 },
  address: { type: 'object', required: true },
  phone: { type: 'string', required: true, maxLength: 50 },
  email: { type: 'string', required: true, format: 'email', maxLength: 255 },
  manager: { type: 'string', required: true, maxLength: 100 },
  status: { type: 'string', required: true, enum: Object.values(BRANCH_STATUS) },
  timezone: { type: 'string', required: true },
  description: { type: 'string', required: false, maxLength: 500 },
  departments: { type: 'array', required: false },
  isHeadquarters: { type: 'boolean', required: false },
  employeeCount: { type: 'number', required: false },
  established: { type: 'string', required: false, format: 'date' }
}

/**
 * Address Schema
 * Defines the structure for branch address data
 */
export const AddressSchema = {
  street: { type: 'string', required: true, maxLength: 200 },
  city: { type: 'string', required: true, maxLength: 100 },
  state: { type: 'string', required: true, maxLength: 100 },
  zipCode: { type: 'string', required: true, maxLength: 20 },
  country: { type: 'string', required: true, maxLength: 100 }
}

/**
 * Validate branch data
 * @param {Object} branchData - Branch data to validate
 * @returns {Object} Validation result
 */
export const validateBranch = (branchData) => {
  const errors = []

  // Required fields validation
  if (!branchData.name || typeof branchData.name !== 'string') {
    errors.push('Branch name is required and must be a string')
  } else if (branchData.name.length < 2 || branchData.name.length > 100) {
    errors.push('Branch name must be between 2 and 100 characters')
  }

  if (!branchData.code || typeof branchData.code !== 'string') {
    errors.push('Branch code is required and must be a string')
  } else if (branchData.code.length < 1 || branchData.code.length > 10) {
    errors.push('Branch code must be between 1 and 10 characters')
  }

  if (!branchData.phone || typeof branchData.phone !== 'string') {
    errors.push('Phone number is required and must be a string')
  } else if (branchData.phone.length > 50) {
    errors.push('Phone number must be 50 characters or less')
  }

  if (!branchData.email || typeof branchData.email !== 'string') {
    errors.push('Email is required and must be a string')
  } else if (!isValidEmail(branchData.email)) {
    errors.push('Email must be a valid email address')
  } else if (branchData.email.length > 255) {
    errors.push('Email must be 255 characters or less')
  }

  if (!branchData.manager || typeof branchData.manager !== 'string') {
    errors.push('Manager name is required and must be a string')
  } else if (branchData.manager.length > 100) {
    errors.push('Manager name must be 100 characters or less')
  }

  if (!branchData.status || !Object.values(BRANCH_STATUS).includes(branchData.status)) {
    errors.push('Status is required and must be either "active" or "inactive"')
  }

  if (!branchData.timezone || typeof branchData.timezone !== 'string') {
    errors.push('Timezone is required and must be a string')
  }

  // Address validation
  if (!branchData.address || typeof branchData.address !== 'object') {
    errors.push('Address is required and must be an object')
  } else {
    const addressValidation = validateBranchAddress(branchData.address)
    if (!addressValidation.isValid) {
      errors.push(...addressValidation.errors)
    }
  }

  // Optional field validation
  if (branchData.description && (typeof branchData.description !== 'string' || branchData.description.length > 500)) {
    errors.push('Description must be a string with 500 characters or less')
  }

  if (branchData.departments && (!Array.isArray(branchData.departments) || 
      !branchData.departments.every(dept => typeof dept === 'string'))) {
    errors.push('Departments must be an array of strings')
  }

  if (branchData.isHeadquarters !== undefined && typeof branchData.isHeadquarters !== 'boolean') {
    errors.push('isHeadquarters must be a boolean')
  }

  if (branchData.employeeCount !== undefined && 
      (typeof branchData.employeeCount !== 'number' || branchData.employeeCount < 0)) {
    errors.push('Employee count must be a non-negative number')
  }

  if (branchData.established && !isValidDate(branchData.established)) {
    errors.push('Established date must be a valid date string')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate branch address data
 * @param {Object} addressData - Address data to validate
 * @returns {Object} Validation result
 */
export const validateBranchAddress = (addressData) => {
  const errors = []

  if (!addressData.street || typeof addressData.street !== 'string') {
    errors.push('Street address is required and must be a string')
  } else if (addressData.street.length > 200) {
    errors.push('Street address must be 200 characters or less')
  }

  if (!addressData.city || typeof addressData.city !== 'string') {
    errors.push('City is required and must be a string')
  } else if (addressData.city.length > 100) {
    errors.push('City must be 100 characters or less')
  }

  if (!addressData.state || typeof addressData.state !== 'string') {
    errors.push('State/Province is required and must be a string')
  } else if (addressData.state.length > 100) {
    errors.push('State/Province must be 100 characters or less')
  }

  if (!addressData.zipCode || typeof addressData.zipCode !== 'string') {
    errors.push('ZIP/Postal code is required and must be a string')
  } else if (addressData.zipCode.length > 20) {
    errors.push('ZIP/Postal code must be 20 characters or less')
  }

  if (!addressData.country || typeof addressData.country !== 'string') {
    errors.push('Country is required and must be a string')
  } else if (addressData.country.length > 100) {
    errors.push('Country must be 100 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Transform branch data for database storage
 * @param {Object} branchData - Branch data from form
 * @returns {Object} Transformed data for database
 */
export const transformToDatabase = (branchData) => {
  return {
    name: branchData.name?.trim(),
    code: branchData.code?.toUpperCase().trim(),
    address_street: branchData.address?.street?.trim(),
    address_city: branchData.address?.city?.trim(),
    address_state: branchData.address?.state?.trim(),
    address_zip_code: branchData.address?.zipCode?.trim(),
    address_country: branchData.address?.country?.trim(),
    phone: branchData.phone?.trim(),
    email: branchData.email?.toLowerCase().trim(),
    manager: branchData.manager?.trim(),
    status: branchData.status,
    timezone: branchData.timezone,
    description: branchData.description?.trim() || null,
    departments: branchData.departments || [],
    is_headquarters: branchData.isHeadquarters || false,
    employee_count: branchData.employeeCount || 0,
    established: branchData.established || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

/**
 * Transform branch data from database for frontend
 * @param {Object} dbData - Branch data from database
 * @returns {Object} Transformed data for frontend
 */
export const transformFromDatabase = (dbData) => {
  return {
    id: dbData.id,
    name: dbData.name,
    code: dbData.code,
    address: {
      street: dbData.address_street,
      city: dbData.address_city,
      state: dbData.address_state,
      zipCode: dbData.address_zip_code,
      country: dbData.address_country
    },
    phone: dbData.phone,
    email: dbData.email,
    manager: dbData.manager,
    status: dbData.status,
    timezone: dbData.timezone,
    description: dbData.description,
    departments: dbData.departments || [],
    isHeadquarters: dbData.is_headquarters || false,
    employeeCount: dbData.employee_count || 0,
    established: dbData.established,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at
  }
}

/**
 * Get default branch data
 * @returns {Object} Default branch data structure
 */
export const getDefaultBranchData = () => {
  return {
    name: '',
    code: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    phone: '',
    email: '',
    manager: '',
    status: BRANCH_STATUS.ACTIVE,
    timezone: 'America/New_York',
    description: '',
    departments: [],
    isHeadquarters: false,
    employeeCount: 0
  }
}

/**
 * Generate branch code suggestion from name
 * @param {string} name - Branch name
 * @returns {string} Suggested branch code
 */
export const generateBranchCode = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 4)
}

/**
 * Format branch address for display
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatBranchAddress = (address) => {
  if (!address) return ''
  
  const parts = [
    address.street,
    `${address.city}, ${address.state} ${address.zipCode}`,
    address.country
  ].filter(Boolean)
  
  return parts.join('\n')
}

/**
 * Get timezone display name
 * @param {string} timezone - Timezone identifier
 * @returns {string} Human-readable timezone name
 */
export const getTimezoneDisplayName = (timezone) => {
  return TIMEZONES[timezone] || timezone
}

/**
 * Check if branch is headquarters
 * @param {Object} branch - Branch object
 * @returns {boolean} Whether branch is headquarters
 */
export const isHeadquarters = (branch) => {
  return branch?.isHeadquarters === true
}

/**
 * Check if branch is active
 * @param {Object} branch - Branch object
 * @returns {boolean} Whether branch is active
 */
export const isBranchActive = (branch) => {
  return branch?.status === BRANCH_STATUS.ACTIVE
}

/**
 * Get branch full name with code
 * @param {Object} branch - Branch object
 * @returns {string} Full branch name with code
 */
export const getBranchFullName = (branch) => {
  if (!branch) return ''
  return `${branch.name} (${branch.code})`
}

/**
 * Calculate branch age in years
 * @param {Object} branch - Branch object
 * @returns {number} Branch age in years
 */
export const getBranchAge = (branch) => {
  if (!branch?.established) return 0
  
  const establishedDate = new Date(branch.established)
  const currentDate = new Date()
  const diffTime = Math.abs(currentDate - establishedDate)
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
  
  return diffYears
}

/**
 * Sort branches by criteria
 * @param {Array} branches - Array of branches
 * @param {string} sortBy - Sort criteria ('name', 'code', 'established', 'employees')
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted branches array
 */
export const sortBranches = (branches, sortBy = 'name', sortOrder = 'asc') => {
  const sortedBranches = [...branches].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'code':
        aValue = a.code.toLowerCase()
        bValue = b.code.toLowerCase()
        break
      case 'established':
        aValue = new Date(a.established || 0)
        bValue = new Date(b.established || 0)
        break
      case 'employees':
        aValue = a.employeeCount || 0
        bValue = b.employeeCount || 0
        break
      case 'location':
        aValue = `${a.address.city}, ${a.address.state}`.toLowerCase()
        bValue = `${b.address.city}, ${b.address.state}`.toLowerCase()
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
  
  return sortedBranches
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
 * Validate date format
 * @param {string} date - Date string to validate
 * @returns {boolean} Whether date is valid
 */
const isValidDate = (date) => {
  const parsedDate = new Date(date)
  return parsedDate instanceof Date && !isNaN(parsedDate)
}

// Export configuration object
const branchManagementConfig = {
  BRANCH_STATUS,
  TIMEZONES,
  DEPARTMENTS,
  COUNTRIES,
  BranchSchema,
  AddressSchema,
  validateBranch,
  validateBranchAddress,
  transformToDatabase,
  transformFromDatabase,
  getDefaultBranchData,
  generateBranchCode,
  formatBranchAddress,
  getTimezoneDisplayName,
  isHeadquarters,
  isBranchActive,
  getBranchFullName,
  getBranchAge,
  sortBranches
}

export default branchManagementConfig 