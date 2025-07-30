// Global Instructions Rule Applied!

/**
 * Data Model for Enhanced Questionnaires with Multiple Questions
 * Questionnaires now have titles and questions are in a separate table
 */

/**
 * Enhanced Questionnaire Schema - Core Fields Only
 */
export const QuestionnaireSchema = {
  // Core Fields (Required)
  title: { type: 'string', required: true, maxLength: 255 },

  // Status and Visibility
  is_active: { type: 'boolean', required: false, default: true },
  status: { type: 'string', required: false, enum: ['Draft', 'Active', 'Inactive', 'Archived'], default: 'Draft' },

  // Metadata
  tags: { type: 'array', required: false, default: [] },
  category: { type: 'string', required: false, maxLength: 255 },

  // Statistics (Optional)
  completions: { type: 'number', required: false, default: 0 },
  total_attempts: { type: 'number', required: false, default: 0 },
  average_score: { type: 'number', required: false, default: 0 }
}

/**
 * Questionnaire Question Schema
 */
export const AssessmentQuestionSchema = {
  // Core Fields (Required)
  questionnaire_id: { type: 'string', required: true },
  question: { type: 'string', required: true, maxLength: 2000 },
  context: { type: 'string', required: true, maxLength: 2000 },
  preferred_feedback: { type: 'string', required: true, maxLength: 2000 },

  // Order and Status
  question_order: { type: 'number', required: false, default: 1 },
  is_active: { type: 'boolean', required: false, default: true }
}

/**
 * Validate questionnaire data against schema
 * @param {Object} assessmentData - Questionnaire data to validate
 * @returns {Object} Validation result with success status and errors
 */
export const validateQuestionnaire = (assessmentData) => {
  const errors = []

  // Required field validation
  if (!assessmentData.title || assessmentData.title.trim() === '') {
    errors.push('Title is required')
  }

  // Length validation
  if (assessmentData.title && assessmentData.title.length > 255) {
    errors.push('Title must be 255 characters or less')
  }

  if (assessmentData.category && assessmentData.category.length > 255) {
    errors.push('Category must be 255 characters or less')
  }

  if (assessmentData.status && !QuestionnaireSchema.status.enum.includes(assessmentData.status)) {
    errors.push(`Status must be one of: ${QuestionnaireSchema.status.enum.join(', ')}`)
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Validate questionnaire question data against schema
 * @param {Object} questionData - Questionnaire question data to validate
 * @returns {Object} Validation result with success status and errors
 */
export const validateQuestionnaireQuestion = (questionData) => {
  const errors = []

  // Required field validation
  if (!questionData.questionnaire_id || questionData.questionnaire_id.trim() === '') {
    errors.push('Questionnaire ID is required')
  }

  if (!questionData.question || questionData.question.trim() === '') {
    errors.push('Question is required')
  }

  if (!questionData.context || questionData.context.trim() === '') {
    errors.push('Context is required')
  }

  // Check for both preferredFeedback (from form) and preferred_feedback (from db)
  const preferredFeedback = questionData.preferredFeedback || questionData.preferred_feedback
  if (!preferredFeedback || preferredFeedback.trim() === '') {
    errors.push('Preferred feedback is required')
  }

  // Length validation
  if (questionData.question && questionData.question.length > 2000) {
    errors.push('Question must be 2000 characters or less')
  }

  if (questionData.context && questionData.context.length > 2000) {
    errors.push('Context must be 2000 characters or less')
  }

  if (preferredFeedback && preferredFeedback.length > 2000) {
    errors.push('Preferred feedback must be 2000 characters or less')
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Transform form data to database format (Supabase format) for questionnaires
 * @param {Object} formData - Data from the form
 * @returns {Object} Transformed data for database insertion
 */
export const transformToDatabase = (formData) => {
  const transformed = {
    // Core Fields - exact field names that match Supabase
    title: formData.title?.trim(),

    // Status and Visibility
    is_active:
      formData.isActive !== undefined
        ? formData.isActive
        : formData.is_active !== undefined
          ? formData.is_active
          : true,
    status: formData.status || 'Draft',

    // Metadata
    category: formData.category?.trim() || null,
    tags: Array.isArray(formData.tags) ? formData.tags : [],

    // Statistics (preserve existing values for updates, default for creates)
    completions: formData.completions || 0,
    total_attempts: formData.totalAttempts || formData.total_attempts || 0,
    average_score: parseFloat(formData.averageScore || formData.average_score) || 0.0
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
 * Transform form data to database format for questionnaire questions
 * @param {Object} formData - Data from the form
 * @param {string} questionnaireId - ID of the parent assessment
 * @param {Object} options - Options for transformation (isUpdate flag)
 * @returns {Object} Transformed data for database insertion
 */
export const transformQuestionToDatabase = (formData, questionnaireId, options = {}) => {
  const { isUpdate = false } = options

  const transformed = {
    // Core Fields
    questionnaire_id: questionnaireId,
    question: formData.question?.trim(),
    context: formData.context?.trim(),
    preferred_feedback: formData.preferredFeedback?.trim() || formData.preferred_feedback?.trim(),

    // Status
    is_active:
      formData.isActive !== undefined ? formData.isActive : formData.is_active !== undefined ? formData.is_active : true
  }

  // Only include question_order if explicitly provided or if it's a new question (not an update)
  if (formData.questionOrder !== undefined || formData.question_order !== undefined) {
    transformed.question_order = formData.questionOrder || formData.question_order
  } else if (!isUpdate) {
    // Only default to 1 for new questions, not updates
    transformed.question_order = 1
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
 * Transform database data to frontend format for questionnaires
 * @param {Object} dbData - Data from database (Supabase format)
 * @returns {Object} Transformed data for frontend use (camelCase)
 */
export const transformFromDatabase = (dbData) => {
  if (!dbData) return null

  return {
    // Core Fields
    id: dbData.id,
    title: dbData.title,

    // Status and Visibility
    isActive: dbData.is_active, // Convert to camelCase for frontend
    status: dbData.status,

    // Metadata
    category: dbData.category,
    tags: dbData.tags || [],

    // Statistics
    completions: dbData.completions || 0,
    totalAttempts: dbData.total_attempts || 0, // Convert to camelCase for frontend
    averageScore: parseFloat(dbData.average_score) || 0, // Convert to camelCase for frontend

    // Question count (if available from view)
    questionCount: dbData.question_count || 0,
    questions: dbData.questions || [],

    // Audit Fields (keep as snake_case since they're mostly for backend use)
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by,
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,

    // Formatted dates for display
    createdDate: dbData.created_at ? new Date(dbData.created_at).toISOString().split('T')[0] : null,
    lastUpdated: dbData.modified_at ? new Date(dbData.modified_at).toISOString().split('T')[0] : null
  }
}

/**
 * Transform database data to frontend format for questionnaire questions
 * @param {Object} dbData - Data from database (Supabase format)
 * @returns {Object} Transformed data for frontend use (camelCase)
 */
export const transformQuestionFromDatabase = (dbData) => {
  if (!dbData) return null

  return {
    // Core Fields
    id: dbData.id,
    questionnaireId: dbData.questionnaire_id, // Convert to camelCase
    question: dbData.question,
    context: dbData.context,
    preferredFeedback: dbData.preferred_feedback, // Convert to camelCase

    // Order and Status
    questionOrder: dbData.question_order, // Convert to camelCase
    isActive: dbData.is_active, // Convert to camelCase

    // Audit Fields
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by,
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,

    // Formatted dates for display
    createdDate: dbData.created_at ? new Date(dbData.created_at).toISOString().split('T')[0] : null,
    lastUpdated: dbData.modified_at ? new Date(dbData.modified_at).toISOString().split('T')[0] : null
  }
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
 * Get questionnaire status display properties
 * @param {string} status - Questionnaire status
 * @returns {Object} Display properties for the status
 */
export const getStatusDisplayProperties = (status) => {
  const statusMap = {
    Draft: {
      color: 'gray',
      description: 'Questionnaire is in draft mode'
    },
    Active: {
      color: 'green',
      description: 'Questionnaire is active and available'
    },
    Inactive: {
      color: 'orange',
      description: 'Questionnaire is temporarily inactive'
    },
    Archived: {
      color: 'red',
      description: 'Questionnaire is archived'
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
 * Calculate questionnaire statistics
 * @param {Array} questionnaires - Array of questionnaires
 * @returns {Object} Statistics summary
 */
export const calculateAssessmentStats = (questionnaires) => {
  if (!Array.isArray(questionnaires) || questionnaires.length === 0) {
    return {
      totalQuestionnaires: 0,
      activeQuestionnaires: 0,
      draftQuestionnaires: 0,
      totalCompletions: 0,
      averageScore: 0,
      totalQuestions: 0
    }
  }

  const stats = {
    totalQuestionnaires: questionnaires.length,
    activeQuestionnaires: questionnaires.filter((a) => a.status === 'Active').length,
    draftQuestionnaires: questionnaires.filter((a) => a.status === 'Draft').length,
    totalCompletions: questionnaires.reduce((sum, a) => sum + (a.completions || 0), 0),
    totalQuestions: questionnaires.reduce((sum, a) => sum + (a.questionCount || 0), 0),
    averageScore: 0
  }

  const totalScore = questionnaires.reduce((sum, a) => sum + (a.averageScore || 0), 0)
  stats.averageScore = questionnaires.length > 0 ? Math.round(totalScore / questionnaires.length) : 0

  return stats
}

/**
 * Reorder questions within an assessment
 * @param {Array} questions - Array of questions
 * @param {number} fromIndex - Source index
 * @param {number} toIndex - Target index
 * @returns {Array} Reordered questions with updated order numbers
 */
export const reorderQuestions = (questions, fromIndex, toIndex) => {
  const result = Array.from(questions)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)

  // Update question_order for all questions
  return result.map((question, index) => ({
    ...question,
    questionOrder: index + 1,
    question_order: index + 1
  }))
}
