// Global Instructions Rule Applied!

/**
 * Data Model for Assessments
 * Provides validation, transformation, and mapping functions
 */

/**
 * Assessment data structure definition
 */
export const AssessmentSchema = {
  // Basic Information (Required)
  question: { type: 'string', required: true, maxLength: 1000 },
  context: { type: 'string', required: true, maxLength: 2000 },
  preferredFeedback: { type: 'string', required: true, maxLength: 2000 },

  // Status and Visibility
  status: { type: 'string', required: false, enum: ['Draft', 'Active', 'Inactive', 'Archived'], default: 'Draft' },
  isActive: { type: 'boolean', required: false, default: true },

  // Metadata
  category: { type: 'string', required: false, maxLength: 255 },
  tags: { type: 'array', required: false },
  searchKeywords: { type: 'string', required: false },
  
  // Statistics (Auto-calculated)
  completions: { type: 'number', required: false, default: 0 },
  totalAttempts: { type: 'number', required: false, default: 0 },
  averageScore: { type: 'number', required: false, default: 0 },
  
  // Related Data
  jobOpportunityIds: { type: 'array', required: false }
}

/**
 * Validate assessment data against schema
 * @param {Object} assessmentData - Assessment data to validate
 * @returns {Object} Validation result with success status and errors
 */
export const validateAssessment = (assessmentData) => {
  const errors = []

  // Required field validation
  const requiredFields = Object.keys(AssessmentSchema).filter((key) => AssessmentSchema[key].required)

  requiredFields.forEach((field) => {
    if (!assessmentData[field] || assessmentData[field] === '') {
      errors.push(`${field} is required`)
    }
  })

  // Type-specific validation
  if (assessmentData.question && assessmentData.question.length > AssessmentSchema.question.maxLength) {
    errors.push(`Question must be ${AssessmentSchema.question.maxLength} characters or less`)
  }

  if (assessmentData.context && assessmentData.context.length > AssessmentSchema.context.maxLength) {
    errors.push(`Context must be ${AssessmentSchema.context.maxLength} characters or less`)
  }

  if (assessmentData.preferredFeedback && assessmentData.preferredFeedback.length > AssessmentSchema.preferredFeedback.maxLength) {
    errors.push(`Preferred feedback must be ${AssessmentSchema.preferredFeedback.maxLength} characters or less`)
  }

  if (assessmentData.category && assessmentData.category.length > AssessmentSchema.category.maxLength) {
    errors.push(`Category must be ${AssessmentSchema.category.maxLength} characters or less`)
  }

  if (assessmentData.status && !AssessmentSchema.status.enum.includes(assessmentData.status)) {
    errors.push(`Status must be one of: ${AssessmentSchema.status.enum.join(', ')}`)
  }

  return {
    success: errors.length === 0,
    errors
  }
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
    question: formData.question?.trim(),
    context: formData.context?.trim(),
    preferred_feedback: formData.preferredFeedback?.trim(),

    // Status and Visibility
    status: formData.status || 'Draft',
    is_active: formData.isActive !== undefined ? formData.isActive : true,

    // Metadata
    category: formData.category?.trim() || null,
    tags: Array.isArray(formData.tags) ? formData.tags : [],
    search_keywords: formData.searchKeywords?.trim() || null,

    // Statistics (preserve existing values for updates, default for creates)
    completions: formData.completions || 0,
    total_attempts: formData.totalAttempts || 0,
    average_score: parseFloat(formData.averageScore) || 0.0,

    // Related Data
    job_opportunity_ids: Array.isArray(formData.jobOpportunityIds) ? formData.jobOpportunityIds : []
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
 * @returns {Object} Transformed data for frontend use
 */
export const transformFromDatabase = (dbData) => {
  if (!dbData) return null

  return {
    // Basic Information
    id: dbData.id,
    question: dbData.question,
    context: dbData.context,
    preferredFeedback: dbData.preferred_feedback,

    // Status and Visibility
    status: dbData.status,
    isActive: dbData.is_active,

    // Metadata
    category: dbData.category,
    tags: dbData.tags || [],
    searchKeywords: dbData.search_keywords,

    // Statistics
    completions: dbData.completions || 0,
    totalAttempts: dbData.total_attempts || 0,
    averageScore: parseFloat(dbData.average_score) || 0,

    // Related Data
    jobOpportunityIds: dbData.job_opportunity_ids || [],

    // Audit Fields
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,

    // Formatted dates for display
    createdDate: dbData.created_at ? new Date(dbData.created_at).toISOString().split('T')[0] : null,
    lastUpdated: dbData.updated_at ? new Date(dbData.updated_at).toISOString().split('T')[0] : null
  }
}

/**
 * Generate search keywords from assessment data
 * @param {Object} assessmentData - Assessment data
 * @returns {string} Generated search keywords
 */
export const generateSearchKeywords = (assessmentData) => {
  const keywords = []

  if (assessmentData.question) {
    // Extract meaningful words from question
    const questionWords = assessmentData.question
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((word) => word.length > 3)
    keywords.push(...questionWords)
  }

  if (assessmentData.context) {
    // Extract meaningful words from context
    const contextWords = assessmentData.context
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((word) => word.length > 3)
    keywords.push(...contextWords)
  }

  if (assessmentData.category) keywords.push(assessmentData.category.toLowerCase())

  if (Array.isArray(assessmentData.tags)) {
    keywords.push(...assessmentData.tags.map((tag) => tag.toLowerCase()))
  }

  // Remove duplicates and join
  return [...new Set(keywords)].join(' ')
}

/**
 * Format tags array for display
 * @param {Array} tags - Array of tags
 * @returns {string} Formatted tags string
 */
export const formatTags = (tags) => {
  if (!Array.isArray(tags)) return ''
  return tags.join(', ')
}

/**
 * Parse tags string into array
 * @param {string} tagsString - Comma-separated tags string
 * @returns {Array} Array of tags
 */
export const parseTags = (tagsString) => {
  if (!tagsString || typeof tagsString !== 'string') return []
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag)
}

/**
 * Get assessment status display properties
 * @param {string} status - Assessment status
 * @returns {Object} Display properties for the status
 */
export const getStatusDisplayProperties = (status) => {
  const statusMap = {
    Draft: {
      color: 'gray',
      description: 'Assessment is in draft mode'
    },
    Active: {
      color: 'green',
      description: 'Assessment is active and available'
    },
    Inactive: {
      color: 'orange',
      description: 'Assessment is temporarily inactive'
    },
    Archived: {
      color: 'red',
      description: 'Assessment is archived'
    }
  }

  return statusMap[status] || { color: 'default', description: 'Unknown status' }
}

/**
 * Truncate text for display
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || ''
  return text.substring(0, maxLength) + '...'
}

/**
 * Calculate assessment statistics
 * @param {Array} assessments - Array of assessments
 * @returns {Object} Statistics summary
 */
export const calculateAssessmentStats = (assessments) => {
  if (!Array.isArray(assessments) || assessments.length === 0) {
    return {
      totalAssessments: 0,
      activeAssessments: 0,
      draftAssessments: 0,
      totalCompletions: 0,
      averageScore: 0
    }
  }

  const stats = {
    totalAssessments: assessments.length,
    activeAssessments: assessments.filter(a => a.status === 'Active').length,
    draftAssessments: assessments.filter(a => a.status === 'Draft').length,
    totalCompletions: assessments.reduce((sum, a) => sum + (a.completions || 0), 0),
    averageScore: 0
  }

  const totalScore = assessments.reduce((sum, a) => sum + (a.averageScore || 0), 0)
  stats.averageScore = assessments.length > 0 ? Math.round(totalScore / assessments.length) : 0

  return stats
}

