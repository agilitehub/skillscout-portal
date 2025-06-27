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
  title: { type: 'string', required: true, maxLength: 255 },
  category: { type: 'string', required: true, maxLength: 255 },
  type: { type: 'string', required: true, enum: ['Technical', 'Behavioral', 'Portfolio', 'Cognitive'] },
  difficulty: { type: 'string', required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },

  // Assessment Configuration (Required)
  duration: { type: 'number', required: true, min: 1, max: 480 }, // 1 minute to 8 hours
  questions: { type: 'number', required: true, min: 1, max: 200 },
  passingScore: { type: 'number', required: true, min: 0, max: 100 },

  // Content (Required)
  description: { type: 'string', required: true, maxLength: 2000 },
  skills: { type: 'array', required: true, minItems: 1 },

  // Status and Visibility
  status: { type: 'string', required: false, enum: ['Draft', 'Active', 'Inactive', 'Archived'], default: 'Draft' },

  // Statistics (Auto-calculated)
  completions: { type: 'number', required: false, default: 0 },
  totalAttempts: { type: 'number', required: false, default: 0 },
  averageScore: { type: 'number', required: false, default: 0 },
  successRate: { type: 'number', required: false, default: 0 },

  // Assessment Content and Configuration
  assessmentContent: { type: 'object', required: false },
  timeLimitEnabled: { type: 'boolean', required: false, default: true },
  randomizeQuestions: { type: 'boolean', required: false, default: false },
  showResultsImmediately: { type: 'boolean', required: false, default: true },
  allowRetakes: { type: 'boolean', required: false, default: false },
  maxRetakes: { type: 'number', required: false, default: 0 },

  // Access Control
  isPublic: { type: 'boolean', required: false, default: false },
  requiresInvitation: { type: 'boolean', required: false, default: true },

  // Related Data
  jobOpportunityIds: { type: 'array', required: false },
  searchKeywords: { type: 'string', required: false },
  tags: { type: 'array', required: false }
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
  if (assessmentData.title && assessmentData.title.length > AssessmentSchema.title.maxLength) {
    errors.push(`Title must be ${AssessmentSchema.title.maxLength} characters or less`)
  }

  if (assessmentData.category && assessmentData.category.length > AssessmentSchema.category.maxLength) {
    errors.push(`Category must be ${AssessmentSchema.category.maxLength} characters or less`)
  }

  if (assessmentData.type && !AssessmentSchema.type.enum.includes(assessmentData.type)) {
    errors.push(`Type must be one of: ${AssessmentSchema.type.enum.join(', ')}`)
  }

  if (assessmentData.difficulty && !AssessmentSchema.difficulty.enum.includes(assessmentData.difficulty)) {
    errors.push(`Difficulty must be one of: ${AssessmentSchema.difficulty.enum.join(', ')}`)
  }

  if (assessmentData.duration) {
    const duration = Number(assessmentData.duration)
    if (isNaN(duration) || duration < AssessmentSchema.duration.min || duration > AssessmentSchema.duration.max) {
      errors.push(
        `Duration must be between ${AssessmentSchema.duration.min} and ${AssessmentSchema.duration.max} minutes`
      )
    }
  }

  if (assessmentData.questions) {
    const questions = Number(assessmentData.questions)
    if (isNaN(questions) || questions < AssessmentSchema.questions.min || questions > AssessmentSchema.questions.max) {
      errors.push(`Questions must be between ${AssessmentSchema.questions.min} and ${AssessmentSchema.questions.max}`)
    }
  }

  if (assessmentData.passingScore) {
    const passingScore = Number(assessmentData.passingScore)
    if (
      isNaN(passingScore) ||
      passingScore < AssessmentSchema.passingScore.min ||
      passingScore > AssessmentSchema.passingScore.max
    ) {
      errors.push(
        `Passing score must be between ${AssessmentSchema.passingScore.min} and ${AssessmentSchema.passingScore.max}`
      )
    }
  }

  if (assessmentData.description && assessmentData.description.length > AssessmentSchema.description.maxLength) {
    errors.push(`Description must be ${AssessmentSchema.description.maxLength} characters or less`)
  }

  if (
    assessmentData.skills &&
    (!Array.isArray(assessmentData.skills) || assessmentData.skills.length < AssessmentSchema.skills.minItems)
  ) {
    errors.push('At least one skill must be specified')
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
    title: formData.title?.trim(),
    category: formData.category?.trim(),
    type: formData.type,
    difficulty: formData.difficulty,

    // Assessment Configuration
    duration: parseInt(formData.duration, 10),
    questions: parseInt(formData.questions, 10),
    passing_score: parseInt(formData.passingScore, 10),

    // Content
    description: formData.description?.trim(),
    skills: Array.isArray(formData.skills)
      ? formData.skills.filter((skill) => skill && skill.trim())
      : formData.skills
          ?.split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill) || [],

    // Status and Visibility
    status: formData.status || 'Draft',

    // Statistics (preserve existing values for updates, default for creates)
    completions: formData.completions || 0,
    total_attempts: formData.totalAttempts || 0,
    average_score: parseFloat(formData.averageScore) || 0.0,
    success_rate: parseFloat(formData.successRate) || 0.0,

    // Assessment Configuration
    assessment_content: formData.assessmentContent || null,
    time_limit_enabled: formData.timeLimitEnabled !== undefined ? formData.timeLimitEnabled : true,
    randomize_questions: formData.randomizeQuestions !== undefined ? formData.randomizeQuestions : false,
    show_results_immediately: formData.showResultsImmediately !== undefined ? formData.showResultsImmediately : true,
    allow_retakes: formData.allowRetakes !== undefined ? formData.allowRetakes : false,
    max_retakes: parseInt(formData.maxRetakes, 10) || 0,

    // Access Control
    is_public: formData.isPublic !== undefined ? formData.isPublic : false,
    requires_invitation: formData.requiresInvitation !== undefined ? formData.requiresInvitation : true,

    // Related Data
    job_opportunity_ids: Array.isArray(formData.jobOpportunityIds) ? formData.jobOpportunityIds : [],
    search_keywords: formData.searchKeywords?.trim() || null,
    tags: Array.isArray(formData.tags) ? formData.tags : []
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
    title: dbData.title,
    category: dbData.category,
    type: dbData.type,
    difficulty: dbData.difficulty,

    // Assessment Configuration
    duration: dbData.duration,
    questions: dbData.questions,
    passingScore: dbData.passing_score,

    // Content
    description: dbData.description,
    skills: dbData.skills || [],

    // Status and Visibility
    status: dbData.status,

    // Statistics
    completions: dbData.completions || 0,
    totalAttempts: dbData.total_attempts || 0,
    averageScore: parseFloat(dbData.average_score) || 0,
    successRate: parseFloat(dbData.success_rate) || 0,

    // Assessment Configuration
    assessmentContent: dbData.assessment_content,
    timeLimitEnabled: dbData.time_limit_enabled,
    randomizeQuestions: dbData.randomize_questions,
    showResultsImmediately: dbData.show_results_immediately,
    allowRetakes: dbData.allow_retakes,
    maxRetakes: dbData.max_retakes,

    // Access Control
    isPublic: dbData.is_public,
    requiresInvitation: dbData.requires_invitation,

    // Related Data
    jobOpportunityIds: dbData.job_opportunity_ids || [],
    searchKeywords: dbData.search_keywords,
    tags: dbData.tags || [],

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

  if (assessmentData.title) keywords.push(assessmentData.title.toLowerCase())
  if (assessmentData.category) keywords.push(assessmentData.category.toLowerCase())
  if (assessmentData.type) keywords.push(assessmentData.type.toLowerCase())
  if (assessmentData.difficulty) keywords.push(assessmentData.difficulty.toLowerCase())
  if (assessmentData.description) {
    // Extract meaningful words from description
    const descWords = assessmentData.description
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((word) => word.length > 3)
    keywords.push(...descWords)
  }

  if (Array.isArray(assessmentData.skills)) {
    keywords.push(...assessmentData.skills.map((skill) => skill.toLowerCase()))
  }

  // Remove duplicates and join
  return [...new Set(keywords)].join(' ')
}

/**
 * Format skills array for display
 * @param {Array} skills - Array of skills
 * @returns {string} Formatted skills string
 */
export const formatSkills = (skills) => {
  if (!Array.isArray(skills)) return ''
  return skills.join(', ')
}

/**
 * Parse skills string into array
 * @param {string} skillsString - Comma-separated skills string
 * @returns {Array} Array of skills
 */
export const parseSkills = (skillsString) => {
  if (!skillsString || typeof skillsString !== 'string') return []
  return skillsString
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill)
}

/**
 * Get assessment type display properties
 * @param {string} type - Assessment type
 * @returns {Object} Display properties for the type
 */
export const getTypeDisplayProperties = (type) => {
  const typeMap = {
    Technical: {
      color: 'blue',
      icon: 'code',
      description: 'Evaluates technical skills and knowledge'
    },
    Behavioral: {
      color: 'green',
      icon: 'brain',
      description: 'Assesses soft skills and behavioral competencies'
    },
    Portfolio: {
      color: 'purple',
      icon: 'clipboard-check',
      description: 'Reviews work samples and portfolio pieces'
    },
    Cognitive: {
      color: 'orange',
      icon: 'puzzle-piece',
      description: 'Tests cognitive abilities and problem-solving'
    }
  }

  return typeMap[type] || { color: 'default', icon: 'question', description: 'Assessment type' }
}

/**
 * Get difficulty level display properties
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Display properties for the difficulty
 */
export const getDifficultyDisplayProperties = (difficulty) => {
  const difficultyMap = {
    Beginner: {
      color: 'green',
      level: 1,
      description: 'Entry-level knowledge required'
    },
    Intermediate: {
      color: 'orange',
      level: 2,
      description: 'Moderate experience needed'
    },
    Advanced: {
      color: 'red',
      level: 3,
      description: 'Expert-level skills required'
    }
  }

  return difficultyMap[difficulty] || { color: 'default', level: 0, description: 'Unknown difficulty' }
}

/**
 * Calculate assessment completion time estimate
 * @param {number} questions - Number of questions
 * @param {number} duration - Duration in minutes
 * @returns {Object} Time estimates
 */
export const calculateTimeEstimates = (questions, duration) => {
  const avgTimePerQuestion = Math.round(duration / questions)
  const quickTime = Math.round(duration * 0.7)
  const extendedTime = Math.round(duration * 1.2)

  return {
    avgTimePerQuestion,
    quickTime,
    extendedTime,
    totalDuration: duration
  }
}
