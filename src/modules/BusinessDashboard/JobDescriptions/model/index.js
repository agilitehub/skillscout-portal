// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for Job Descriptions
 * Provides validation, transformation, and mapping functions
 * Updated for new Supabase schema with lookup table references
 */

/**
 * Job Description data structure definition
 * Matches the new Supabase PostgreSQL schema
 */
export const JobDescriptionSchema = {
  // Basic Information (Required)
  title: { type: 'string', required: true, maxLength: 255 },
  overview: { type: 'string', required: true },
  department: { type: 'uuid', required: true }, // References lookup_details.id
  experience_level: { type: 'uuid', required: true }, // References lookup_details.id
  keywords: { type: 'array', required: true, itemType: 'string' }, // Array of strings
  responsibilities: { type: 'string', required: true },
  requirements: { type: 'string', required: true },

  // Auto-managed audit fields (handled by triggers)
  created_at: { type: 'timestamp', auto: true },
  modified_at: { type: 'timestamp', auto: true },
  created_by: { type: 'uuid', auto: true }, // References auth.users.id
  modified_by: { type: 'uuid', auto: true } // References auth.users.id
}

/**
 * Transform form data to database format
 * @param {Object} formData - Data from the form
 * @param {Object} options - Additional options
 * @returns {Object} Transformed data for database insertion
 */
export const transformToDatabase = (formData, options = {}) => {
  const transformed = {
    // Basic Information
    title: formData.title?.trim(),
    overview: formData.overview?.trim(),
    department: formData.department, // UUID from lookup table
    experience_level: formData.experienceLevel || formData.experience_level, // UUID from lookup table
    reports_to_role: formData.reportsToRole?.trim(),
    education_experience: formData.educationExperience?.trim(),
    technical_skills: formData.technicalSkills?.trim(),
    soft_skills: formData.softSkills?.trim(),
    preferred_skills: formData.preferredSkills?.trim(),

    // Keywords as array of strings
    keywords: Array.isArray(formData.keywords) ? formData.keywords.filter((keyword) => keyword && keyword.trim()) : [],

    // Text content fields
    responsibilities: formData.responsibilities?.trim() || '',
    requirements: formData.requirements?.trim() || ''
  }

  // Remove undefined values
  Object.keys(transformed).forEach((key) => {
    if (transformed[key] === undefined || transformed[key] === null) {
      delete transformed[key]
    }
  })

  return transformed
}

/**
 * Transform database data to frontend format
 * @param {Object} dbData - Data from database
 * @returns {Object} Transformed data for frontend consumption
 */
export const transformFromDatabase = (dbData) => {
  if (!dbData) return null

  return {
    // Core fields
    id: dbData.id,
    title: dbData.title,
    overview: dbData.overview,
    department: dbData.department,
    experienceLevel: dbData.experience_level,
    keywords: dbData.keywords || [],
    responsibilities: dbData.responsibilities,
    requirements: dbData.requirements,
    reportsToRole: dbData.reports_to_role,
    educationExperience: dbData.education_experience,
    technicalSkills: dbData.technical_skills,
    softSkills: dbData.soft_skills,
    preferredSkills: dbData.preferred_skills,

    // Audit fields for display
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by,

    // Formatted dates for display
    createdDate: dbData.created_at ? new Date(dbData.created_at).toLocaleDateString() : null,
    lastUpdated: dbData.modified_at ? new Date(dbData.modified_at).toLocaleDateString() : null
  }
}

/**
 * Validate job description data
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result with success status and errors
 */
export const validateJobDescription = (data) => {
  const errors = []

  // Required field validation
  const requiredFields = [
    { field: 'title', message: 'Job title is required' },
    { field: 'overview', message: 'Job overview is required' },
    { field: 'department', message: 'Department is required' },
    { field: 'experienceLevel', message: 'Experience level is required' },
    { field: 'responsibilities', message: 'Responsibilities are required' },
    { field: 'requirements', message: 'Requirements are required' }
  ]

  requiredFields.forEach(({ field, message }) => {
    const value = data[field] || data[field === 'experienceLevel' ? 'experience_level' : field]
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      errors.push(message)
    }
  })

  // Keywords validation
  if (!data.keywords || !Array.isArray(data.keywords) || data.keywords.length === 0) {
    errors.push('At least one keyword is required')
  }

  // UUID validation (basic format check)
  const uuidFields = ['department', 'experienceLevel']
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  uuidFields.forEach((field) => {
    const value = data[field] || data[field === 'experienceLevel' ? 'experience_level' : field]
    if (value && !uuidRegex.test(value)) {
      errors.push(`Invalid ${field} format`)
    }
  })

  // String length validation
  if (data.title && data.title.length > 255) {
    errors.push('Job title must be less than 255 characters')
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Create default job description object
 * @returns {Object} Default job description data
 */
export const createDefaultJobDescription = () => ({
  title: '',
  overview: '',
  department: null,
  experienceLevel: null,
  keywords: [],
  responsibilities: '',
  requirements: ''
})

/**
 * Parse keywords from text input (comma or newline separated)
 * @param {string} text - Comma or newline separated keywords
 * @returns {Array} Array of keyword strings
 */
export const parseKeywords = (text) => {
  if (!text || typeof text !== 'string') return []

  return text
    .split(/[,\n]/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0)
    .map((keyword) => keyword.toLowerCase())
}

/**
 * Format keywords for display
 * @param {Array} keywords - Array of keyword strings
 * @returns {string} Comma-separated keywords
 */
export const formatKeywords = (keywords) => {
  if (!Array.isArray(keywords)) return ''
  return keywords.join(', ')
}

/**
 * Generate search terms from job description data
 * @param {Object} data - Job description data
 * @returns {Array} Array of search terms
 */
export const generateSearchTerms = (data) => {
  const terms = []

  if (data.title) terms.push(data.title.toLowerCase())
  if (data.overview) terms.push(...data.overview.toLowerCase().split(' '))
  if (data.keywords && Array.isArray(data.keywords)) {
    terms.push(...data.keywords.map((k) => k.toLowerCase()))
  }
  if (data.responsibilities) {
    terms.push(...data.responsibilities.toLowerCase().split(' '))
  }
  if (data.requirements) {
    terms.push(...data.requirements.toLowerCase().split(' '))
  }

  // Remove duplicates and filter out short words
  return [...new Set(terms)].filter((term) => term.length > 2)
}

/**
 * Prepare job description for export/sharing
 * @param {Object} data - Job description data
 * @returns {Object} Formatted data for export
 */
export const prepareForExport = (data) => {
  return {
    title: data.title,
    overview: data.overview,
    keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : '',
    responsibilities: data.responsibilities,
    requirements: data.requirements,
    createdDate: data.createdDate,
    lastUpdated: data.lastUpdated
  }
}
