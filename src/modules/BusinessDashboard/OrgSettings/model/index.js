// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for Organization Settings
 * Defines validation schemas and business logic for organization settings
 */

// Work arrangement definitions
export const WORK_ARRANGEMENTS = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite' // Changed from 'office' to match schema constraint
}

// Currency definitions
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']

// Language definitions
export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Dutch',
  'Swedish',
  'Norwegian',
  'Danish'
]

// Industry definitions
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Media',
  'Government',
  'Non-profit',
  'Real Estate',
  'Transportation',
  'Energy',
  'Agriculture',
  'Other'
]

// Employee range definitions
export const EMPLOYEE_RANGES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+']

/**
 * Organization Settings Schema
 * Defines the structure and validation rules for organization settings
 */
export const OrgSettingsSchema = {
  // Organization Profile
  organizationName: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  industry: { type: 'string', required: false, enum: INDUSTRIES },
  description: { type: 'string', required: false, maxLength: 1000 },
  website: { type: 'string', required: false, format: 'url', maxLength: 255 },
  foundedYear: { type: 'string', required: false, pattern: /^\d{4}$/ },
  employeeRange: { type: 'string', required: false, enum: EMPLOYEE_RANGES },

  // Work Arrangements
  defaultWorkArrangement: { type: 'string', required: false, enum: Object.values(WORK_ARRANGEMENTS) },

  // Preferences
  currency: { type: 'string', required: false, enum: CURRENCIES },
  country: { type: 'string', required: false, maxLength: 100 },
  language: { type: 'string', required: false, enum: LANGUAGES },
  timezone: { type: 'string', required: false, maxLength: 100 },

  // Industry Tags
  industryTags: { type: 'array', required: false, itemType: 'string' },
  customClassifications: { type: 'array', required: false, itemType: 'string' }

  // Removed AI Profile settings as they're not in the database schema
}

/**
 * Validate organization settings data
 * @param {Object} settingsData - Organization settings data to validate
 * @returns {Object} Validation result
 */
export const validateOrgSettings = (settingsData) => {
  const errors = []

  // Required fields validation (only organization_name is NOT NULL in schema)
  if (!settingsData.organizationName || typeof settingsData.organizationName !== 'string') {
    errors.push('Organization name is required and must be a string')
  } else if (settingsData.organizationName.length < 2 || settingsData.organizationName.length > 100) {
    errors.push('Organization name must be between 2 and 100 characters')
  }

  // Optional fields validation (all other fields are NULL in schema)
  if (settingsData.industry && !INDUSTRIES.includes(settingsData.industry)) {
    errors.push('Industry must be a valid industry')
  }

  if (settingsData.currency && !CURRENCIES.includes(settingsData.currency)) {
    errors.push('Currency must be a valid currency code')
  }

  if (settingsData.country && typeof settingsData.country !== 'string') {
    errors.push('Country must be a string')
  } else if (settingsData.country && settingsData.country.length > 100) {
    errors.push('Country must be 100 characters or less')
  }

  if (settingsData.language && !LANGUAGES.includes(settingsData.language)) {
    errors.push('Language must be a valid language')
  }

  if (
    settingsData.defaultWorkArrangement &&
    !Object.values(WORK_ARRANGEMENTS).includes(settingsData.defaultWorkArrangement)
  ) {
    errors.push('Default work arrangement must be valid (remote, hybrid, or onsite)')
  }

  // Optional field validation
  if (
    settingsData.description &&
    (typeof settingsData.description !== 'string' || settingsData.description.length > 1000)
  ) {
    errors.push('Description must be a string with 1000 characters or less')
  }

  if (settingsData.website && !isValidUrl(settingsData.website)) {
    errors.push('Website must be a valid URL')
  }

  if (settingsData.foundedYear && !isValidYear(settingsData.foundedYear)) {
    errors.push('Founded year must be a valid 4-digit year')
  }

  if (settingsData.employeeRange && !EMPLOYEE_RANGES.includes(settingsData.employeeRange)) {
    errors.push('Employee range must be a valid range')
  }

  if (settingsData.industryTags && !Array.isArray(settingsData.industryTags)) {
    errors.push('Industry tags must be an array')
  } else if (
    settingsData.industryTags &&
    !settingsData.industryTags.every((tag) => typeof tag === 'string' && tag.length <= 50)
  ) {
    errors.push('Industry tags must be strings with 50 characters or less')
  }

  if (settingsData.customClassifications && !Array.isArray(settingsData.customClassifications)) {
    errors.push('Custom classifications must be an array')
  } else if (
    settingsData.customClassifications &&
    !settingsData.customClassifications.every((tag) => typeof tag === 'string' && tag.length <= 50)
  ) {
    errors.push('Custom classifications must be strings with 50 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Transform organization settings for database storage
 * @param {Object} settingsData - Settings data from form
 * @returns {Object} Transformed data for database
 */
export const transformToDatabase = (settingsData) => {
  return {
    organization_name: settingsData.organizationName?.trim(),
    industry: settingsData.industry || null,
    description: settingsData.description?.trim() || null,
    website: settingsData.website?.trim() || null,
    founded_year: settingsData.foundedYear || null,
    employee_range: settingsData.employeeRange || null,
    default_work_arrangement: settingsData.defaultWorkArrangement || null,
    currency: settingsData.currency || null,
    country: settingsData.country?.trim() || null,
    language: settingsData.language || null,
    timezone: settingsData.timezone || null,
    industry_tags: settingsData.industryTags || [],
    custom_classifications: settingsData.customClassifications || []
    // Note: created_by, modified_by, created_at, modified_at are handled by database triggers
  }
}

/**
 * Transform organization settings from database for frontend
 * @param {Object} dbData - Settings data from database
 * @returns {Object} Transformed data for frontend
 */
export const transformFromDatabase = (dbData) => {
  return {
    id: dbData.id,
    organizationName: dbData.organization_name,
    industry: dbData.industry,
    description: dbData.description,
    website: dbData.website,
    foundedYear:
      dbData.founded_year != null && dbData.founded_year !== '' ? String(dbData.founded_year) : '',
    employeeRange: dbData.employee_range,
    defaultWorkArrangement: dbData.default_work_arrangement,
    currency: dbData.currency,
    country: dbData.country,
    language: dbData.language,
    timezone: dbData.timezone,
    industryTags: dbData.industry_tags || [],
    customClassifications: dbData.custom_classifications || [],
    // Database managed fields
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by
  }
}

/**
 * Get default organization settings
 * @returns {Object} Default settings structure
 */
export const getDefaultOrgSettings = () => {
  return {
    organizationName: '', // Only required field
    industry: '',
    description: '',
    website: '',
    foundedYear: '',
    employeeRange: '',
    defaultWorkArrangement: WORK_ARRANGEMENTS.HYBRID,
    currency: 'USD',
    country: 'United States',
    language: 'English',
    timezone: 'America/New_York',
    industryTags: [],
    customClassifications: []
    // Removed aiProfileEnabled as it's not in the schema
  }
}

/**
 * Get work arrangement display info
 * @param {string} arrangement - Work arrangement code
 * @returns {Object} Display information
 */
export const getWorkArrangementInfo = (arrangement) => {
  const arrangements = {
    [WORK_ARRANGEMENTS.REMOTE]: {
      label: 'Remote',
      description: 'Fully remote work',
      icon: 'faHome'
    },
    [WORK_ARRANGEMENTS.HYBRID]: {
      label: 'Hybrid',
      description: 'Mix of remote and office work',
      icon: 'faUsers'
    },
    [WORK_ARRANGEMENTS.ONSITE]: {
      label: 'On-site',
      description: 'Primarily office-based work',
      icon: 'faBuilding'
    }
  }

  return arrangements[arrangement] || arrangements[WORK_ARRANGEMENTS.HYBRID]
}

/**
 * Get currency display info
 * @param {string} currencyCode - Currency code
 * @returns {Object} Currency information
 */
export const getCurrencyInfo = (currencyCode) => {
  const currencies = {
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$' },
    AUD: { name: 'Australian Dollar', symbol: 'A$' },
    JPY: { name: 'Japanese Yen', symbol: '¥' },
    CHF: { name: 'Swiss Franc', symbol: 'CHF' },
    SEK: { name: 'Swedish Krona', symbol: 'kr' },
    NOK: { name: 'Norwegian Krone', symbol: 'kr' },
    DKK: { name: 'Danish Krone', symbol: 'kr' }
  }

  return currencies[currencyCode] || { name: currencyCode, symbol: currencyCode }
}

/**
 * Calculate profile completeness
 * @param {Object} settings - Organization settings
 * @returns {Object} Completeness information
 */
export const calculateProfileCompleteness = (settings) => {
  const requiredFields = ['organizationName'] // Only organization_name is NOT NULL in schema

  const optionalFields = [
    'industry',
    'description',
    'website',
    'foundedYear',
    'employeeRange',
    'defaultWorkArrangement',
    'currency',
    'country',
    'language',
    'timezone',
    'industryTags',
    'customClassifications'
  ]

  let completedRequired = 0
  let completedOptional = 0
  const missingRequired = []
  const missingOptional = []

  requiredFields.forEach((field) => {
    if (settings[field] && settings[field] !== '') {
      completedRequired++
    } else {
      missingRequired.push(field)
    }
  })

  optionalFields.forEach((field) => {
    if (settings[field] && (Array.isArray(settings[field]) ? settings[field].length > 0 : settings[field] !== '')) {
      completedOptional++
    } else {
      missingOptional.push(field)
    }
  })

  // Required fields are worth 70%, optional 30%
  const requiredScore = (completedRequired / requiredFields.length) * 70
  const optionalScore = (completedOptional / optionalFields.length) * 30
  const totalScore = Math.round(requiredScore + optionalScore)

  return {
    percentage: totalScore,
    completedRequired,
    totalRequired: requiredFields.length,
    completedOptional,
    totalOptional: optionalFields.length,
    missingRequired,
    missingOptional,
    isComplete: totalScore === 100
  }
}

/**
 * Validate and clean industry tags
 * @param {Array} tags - Array of industry tags
 * @returns {Array} Cleaned and validated tags
 */
export const validateIndustryTags = (tags) => {
  if (!Array.isArray(tags)) return []

  return tags
    .filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length <= 50)
    .slice(0, 20) // Limit to 20 tags
}

/**
 * Generate organization summary
 * @param {Object} settings - Organization settings
 * @returns {string} Organization summary
 */
export const generateOrgSummary = (settings) => {
  const parts = []

  if (settings.organizationName) {
    parts.push(settings.organizationName)
  }

  if (settings.industry) {
    parts.push(`in ${settings.industry}`)
  }

  if (settings.employeeRange) {
    parts.push(`with ${settings.employeeRange} employees`)
  }

  if (settings.country) {
    parts.push(`based in ${settings.country}`)
  }

  return parts.join(' ')
}

/**
 * Check if organization is startup
 * @param {Object} settings - Organization settings
 * @returns {boolean} Whether organization appears to be a startup
 */
export const isStartup = (settings) => {
  const startupIndicators = [
    settings.foundedYear && parseInt(settings.foundedYear) >= new Date().getFullYear() - 5,
    settings.employeeRange && ['1-10', '11-50', '51-200'].includes(settings.employeeRange),
    settings.customClassifications?.some(
      (tag) =>
        tag.toLowerCase().includes('startup') ||
        tag.toLowerCase().includes('seed') ||
        tag.toLowerCase().includes('series')
    )
  ]

  return startupIndicators.filter(Boolean).length >= 2
}

// Utility functions

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url)
    return /^https?:\/\/.+\..+/.test(url)
  } catch {
    return false
  }
}

/**
 * Validate year format
 * @param {string} year - Year to validate
 * @returns {boolean} Whether year is valid
 */
export const FOUNDED_YEAR_MIN = 1800

const isValidYear = (year) => {
  const yearNum = parseInt(year, 10)
  const currentYear = new Date().getFullYear()
  return /^\d{4}$/.test(String(year)) && yearNum >= FOUNDED_YEAR_MIN && yearNum <= currentYear
}

/**
 * Year options for founded-year Select (newest first).
 * @param {number} [endYear] - Defaults to current calendar year
 * @param {number} [startYear] - Defaults to FOUNDED_YEAR_MIN
 * @returns {string[]} Four-digit year strings
 */
export const getFoundedYearOptions = (
  endYear = new Date().getFullYear(),
  startYear = FOUNDED_YEAR_MIN
) => {
  const years = []
  for (let year = endYear; year >= startYear; year -= 1) {
    years.push(String(year))
  }
  return years
}

// Export configuration object
const orgSettingsConfig = {
  WORK_ARRANGEMENTS,
  CURRENCIES,
  LANGUAGES,
  INDUSTRIES,
  EMPLOYEE_RANGES,
  OrgSettingsSchema,
  validateOrgSettings,
  transformToDatabase,
  transformFromDatabase,
  getDefaultOrgSettings,
  getWorkArrangementInfo,
  getCurrencyInfo,
  calculateProfileCompleteness,
  validateIndustryTags,
  generateOrgSummary,
  isStartup,
  FOUNDED_YEAR_MIN,
  getFoundedYearOptions
}

export default orgSettingsConfig
