// Global Instructions Rule Applied!

/**
 * Data Model for Job Descriptions
 * Provides validation, transformation, and mapping functions
 */

/**
 * Job Description data structure definition
 */
export const JobDescriptionSchema = {
  // Basic Information (Required)
  title: { type: 'string', required: true, maxLength: 255 },
  company: { type: 'string', required: true, maxLength: 255 },
  department: { type: 'string', required: true, maxLength: 255 },
  location: { type: 'string', required: true, maxLength: 255 },
  type: { type: 'string', required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  salaryRange: { type: 'string', required: true, maxLength: 100 },

  // Work Arrangement
  remote: { type: 'boolean', required: false, default: false },
  workArrangement: { type: 'string', required: false, enum: ['On-site', 'Remote', 'Hybrid', 'Flexible'] },

  // Job Content (Main Description Fields)
  overview: { type: 'string', required: true },
  responsibilities: { type: 'array', required: true },
  requirements: { type: 'array', required: true },
  benefits: { type: 'array', required: false },

  // Skills and Tags
  tags: { type: 'array', required: false, default: [] },

  // Status and Visibility
  status: { type: 'string', required: false, enum: ['Active', 'Paused', 'Draft', 'Archived'], default: 'Active' },

  // Additional Details
  experienceLevel: { type: 'string', required: false, enum: ['Entry', 'Mid', 'Senior', 'Executive'] },
  employmentTypes: { type: 'array', required: false },

  // Related Job Opportunity (optional foreign key)
  jobOpportunityId: { type: 'string', required: false },

  // Search and SEO
  searchKeywords: { type: 'string', required: false }
}

/**
 * Transform form data to database format
 * @param {Object} formData - Data from the form
 * @param {Object} options - Additional options including user context
 * @param {Object} options.user - Current user information
 * @param {boolean} options.isUpdate - Whether this is an update operation
 * @returns {Object} Transformed data for database insertion
 */
export const transformToDatabase = (formData, options = {}) => {
  const { user, isUpdate = false } = options

  const transformed = {
    // Basic Information
    title: formData.title?.trim(),
    company: formData.company?.trim(),
    department: formData.department?.trim(),
    location: formData.location?.trim(),
    type: formData.type,
    salary_range: formData.salaryRange?.trim(),

    // Work Arrangement
    remote: formData.remote !== undefined ? formData.remote : false,
    work_arrangement: formData.workArrangement || null,

    // Job Content (Main Description Fields)
    overview: formData.overview?.trim(),
    responsibilities: Array.isArray(formData.responsibilities)
      ? formData.responsibilities.filter((item) => item && item.trim())
      : formData.responsibilities?.split('\n').filter((item) => item && item.trim()) || [],
    requirements: Array.isArray(formData.requirements)
      ? formData.requirements.filter((item) => item && item.trim())
      : formData.requirements?.split('\n').filter((item) => item && item.trim()) || [],
    benefits: Array.isArray(formData.benefits)
      ? formData.benefits.filter((item) => item && item.trim())
      : formData.benefits?.split('\n').filter((item) => item && item.trim()) || [],

    // Skills and Tags
    tags: Array.isArray(formData.tags) ? formData.tags : [],

    // Status and Visibility
    status: formData.status || 'Active',

    // Additional Details
    experience_level: formData.experienceLevel || null,
    employment_types: Array.isArray(formData.employmentTypes) ? formData.employmentTypes : [],

    // Related Job Opportunity
    job_opportunity_id: formData.jobOpportunityId || null,

    // Search and SEO
    search_keywords: formData.searchKeywords?.trim() || null
  }

  // Add user context for audit fields
  if (user && user.id) {
    if (!isUpdate) {
      // Set created_by only for new records
      transformed.created_by = user.id
    }
    // Always set modified_by for both create and update operations
    transformed.modified_by = user.id
  }

  // Remove undefined values
  Object.keys(transformed).forEach((key) => {
    if (transformed[key] === undefined) {
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
    // Basic Information
    id: dbData.id,
    title: dbData.title,
    company: dbData.company,
    department: dbData.department,
    location: dbData.location,
    type: dbData.type,
    salaryRange: dbData.salary_range,

    // Work Arrangement
    remote: dbData.remote,
    workArrangement: dbData.work_arrangement,

    // Job Content (Main Description Fields)
    overview: dbData.overview,
    responsibilities: dbData.responsibilities || [],
    requirements: dbData.requirements || [],
    benefits: dbData.benefits || [],

    // Skills and Tags
    tags: dbData.tags || [],

    // Status and Visibility
    status: dbData.status,

    // Additional Details
    experienceLevel: dbData.experience_level,
    employmentTypes: dbData.employment_types || [],

    // Related Job Opportunity
    jobOpportunityId: dbData.job_opportunity_id,

    // Search and SEO
    searchKeywords: dbData.search_keywords,

    // Metadata
    createdDate: dbData.created_at?.split('T')[0],
    lastUpdated: dbData.modified_at?.split('T')[0],
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by
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
    { field: 'company', message: 'Company name is required' },
    { field: 'department', message: 'Department is required' },
    { field: 'location', message: 'Location is required' },
    { field: 'type', message: 'Job type is required' },
    { field: 'salaryRange', message: 'Salary range is required' },
    { field: 'overview', message: 'Job overview is required' },
    { field: 'responsibilities', message: 'Responsibilities are required' },
    { field: 'requirements', message: 'Requirements are required' }
  ]

  requiredFields.forEach(({ field, message }) => {
    if (
      !data[field] ||
      (Array.isArray(data[field]) && data[field].length === 0) ||
      (typeof data[field] === 'string' && data[field].trim().length === 0)
    ) {
      errors.push(message)
    }
  })

  // String length validation
  if (data.title && data.title.length > 255) {
    errors.push('Job title must be less than 255 characters')
  }

  if (data.company && data.company.length > 255) {
    errors.push('Company name must be less than 255 characters')
  }

  if (data.department && data.department.length > 255) {
    errors.push('Department must be less than 255 characters')
  }

  if (data.location && data.location.length > 255) {
    errors.push('Location must be less than 255 characters')
  }

  // Enum validation
  const enumValidations = [
    { field: 'type', values: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
    { field: 'workArrangement', values: ['On-site', 'Remote', 'Hybrid', 'Flexible'] },
    { field: 'status', values: ['Active', 'Paused', 'Draft', 'Archived'] },
    { field: 'experienceLevel', values: ['Entry', 'Mid', 'Senior', 'Executive'] }
  ]

  enumValidations.forEach(({ field, values }) => {
    if (data[field] && !values.includes(data[field])) {
      errors.push(`Invalid ${field}: ${data[field]}`)
    }
  })

  // Array validation
  if (data.responsibilities && Array.isArray(data.responsibilities) && data.responsibilities.length === 0) {
    errors.push('At least one responsibility is required')
  }

  if (data.requirements && Array.isArray(data.requirements) && data.requirements.length === 0) {
    errors.push('At least one requirement is required')
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
  company: '',
  department: '',
  location: '',
  type: 'Full-time',
  salaryRange: '',
  remote: false,
  workArrangement: 'On-site',
  overview: '',
  responsibilities: [],
  requirements: [],
  benefits: [],
  tags: [],
  status: 'Active',
  experienceLevel: '',
  employmentTypes: [],
  jobOpportunityId: null,
  searchKeywords: ''
})

/**
 * Generate search keywords from job description data
 * @param {Object} data - Job description data
 * @returns {string} Generated search keywords
 */
export const generateSearchKeywords = (data) => {
  const keywords = []

  if (data.title) keywords.push(data.title)
  if (data.company) keywords.push(data.company)
  if (data.department) keywords.push(data.department)
  if (data.location) keywords.push(data.location)
  if (data.type) keywords.push(data.type)
  if (data.tags && Array.isArray(data.tags)) keywords.push(...data.tags)
  if (data.experienceLevel) keywords.push(data.experienceLevel)

  return keywords.join(' ').toLowerCase()
}

/**
 * Parse responsibilities/requirements/benefits from text input
 * @param {string} text - Multi-line text input
 * @returns {Array} Array of individual items
 */
export const parseListItems = (text) => {
  if (!text || typeof text !== 'string') return []

  return text
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      // Remove common list prefixes (bullets, numbers, dashes)
      return item
        .replace(/^[-•*+]\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .trim()
    })
}

/**
 * Format list items for display
 * @param {Array} items - Array of items
 * @returns {string} Formatted text with line breaks
 */
export const formatListItems = (items) => {
  if (!Array.isArray(items)) return ''
  return items.join('\n')
}
