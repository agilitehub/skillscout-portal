// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'
import { transformToDatabase, transformFromDatabase, validateQuestionnaire } from './data-model'

/**
 * Enhanced Questionnaires Controller
 * Handles all CRUD operations for questionnaires with multiple questions support
 */

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error('Questionnaires Controller: Supabase credentials not configured')
}

/**
 * Get all questionnaires with optional filtering (includes question count)
 * @param {Object} filters - Optional filters for questionnaires
 * @returns {Promise<Object>} Result with questionnaires array
 */
export const getAllQuestionnaires = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Use the view that includes question count
    let query = supabase.from('assessment_with_questions').select('*').order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.category) {
      query = query.ilike('category', `%${filters.category}%`)
    }

    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching questionnaires:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    const transformedData = data.map(transformFromDatabase)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getAllQuestionnaires:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching questionnaires',
      data: []
    }
  }
}

/**
 * Get a single questionnaire by ID (includes questions)
 * @param {string} id - Questionnaire ID
 * @returns {Promise<Object>} Result with questionnaire data
 */
export const getQuestionnaireById = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    // Use the view that includes questions
    const { data, error } = await supabase.from('assessment_with_questions').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching questionnaire by ID:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = transformFromDatabase(data)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getQuestionnaireById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the assessment',
      data: null
    }
  }
}

/**
 * Create a new assessment
 * @param {Object} assessmentData - Questionnaire data
 * @returns {Promise<Object>} Result with created assessment
 */
export const createQuestionnaire = async (assessmentData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Validate the questionnaire data
    const validation = validateQuestionnaire(assessmentData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform form data to database format
    const dbData = transformToDatabase(assessmentData, { isUpdate: false })

    const { data, error } = await supabase.from('assessments').insert([dbData]).select().single()

    if (error) {
      console.error('Error creating assessment:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Get the full questionnaire with questions using the view
    const fullAssessmentResult = await getQuestionnaireById(data.id)

    return {
      success: true,
      data: fullAssessmentResult.success ? fullAssessmentResult.data : transformFromDatabase(data),
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in createQuestionnaire:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the assessment',
      data: null
    }
  }
}

/**
 * Update an existing assessment
 * @param {string} id - Questionnaire ID
 * @param {Object} assessmentData - Updated questionnaire data
 * @returns {Promise<Object>} Result with updated assessment
 */
export const updateQuestionnaire = async (id, assessmentData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    // Validate the questionnaire data
    const validation = validateQuestionnaire(assessmentData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform form data to database format
    const dbData = transformToDatabase(assessmentData, { isUpdate: true })

    const { data, error } = await supabase.from('assessments').update(dbData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating assessment:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Get the full questionnaire with questions using the view
    const fullAssessmentResult = await getQuestionnaireById(data.id)

    return {
      success: true,
      data: fullAssessmentResult.success ? fullAssessmentResult.data : transformFromDatabase(data),
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in updateQuestionnaire:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the assessment',
      data: null
    }
  }
}

/**
 * Delete an questionnaire (will cascade delete all questions)
 * @param {string} id - Questionnaire ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteQuestionnaire = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    const { error } = await supabase.from('assessments').delete().eq('id', id)

    if (error) {
      console.error('Error deleting assessment:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: { id },
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in deleteQuestionnaire:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the assessment',
      data: null
    }
  }
}

/**
 * Update questionnaire status
 * @param {string} id - Questionnaire ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Result with updated assessment
 */
export const updateQuestionnaireStatus = async (id, status) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    if (!status) {
      return {
        success: false,
        error: 'Status is required',
        data: null
      }
    }

    const validStatuses = ['Draft', 'Active', 'Inactive', 'Archived']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`,
        data: null
      }
    }

    const { data, error } = await supabase.from('assessments').update({ status }).eq('id', id).select().single()

    if (error) {
      console.error('Error updating questionnaire status:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Get the full questionnaire with questions using the view
    const fullAssessmentResult = await getQuestionnaireById(data.id)

    return {
      success: true,
      data: fullAssessmentResult.success ? fullAssessmentResult.data : transformFromDatabase(data),
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in updateQuestionnaireStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating questionnaire status',
      data: null
    }
  }
}

/**
 * Search questionnaires by term (searches title, category, and question content)
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Optional additional filters
 * @returns {Promise<Object>} Result with matching questionnaires
 */
export const searchQuestionnaires = async (searchTerm, filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!searchTerm || typeof searchTerm !== 'string') {
      return {
        success: false,
        error: 'Search term is required',
        data: []
      }
    }

    // Search in both questionnaires table and questions via the view
    let query = supabase
      .from('assessment_with_questions')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    // Apply additional filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching questionnaires:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    // Also search in questions and get parent questionnaires
    const questionSearchQuery = supabase
      .from('assessment_questions')
      .select('assessment_id')
      .or(`question.ilike.%${searchTerm}%,context.ilike.%${searchTerm}%,preferred_feedback.ilike.%${searchTerm}%`)

    const { data: questionResults } = await questionSearchQuery

    // Get unique questionnaire IDs from question search
    const questionnaireIdsFromQuestions = questionResults
      ? [...new Set(questionResults.map((q) => q.assessment_id))]
      : []

    // Fetch questionnaires that have matching questions
    let additionalQuestionnaires = []
    if (questionnaireIdsFromQuestions.length > 0) {
      let additionalQuery = supabase
        .from('assessment_with_questions')
        .select('*')
        .in('id', questionnaireIdsFromQuestions)

      // Apply same filters to additional search
      if (filters.status) {
        additionalQuery = additionalQuery.eq('status', filters.status)
      }

      if (filters.category) {
        additionalQuery = additionalQuery.eq('category', filters.category)
      }

      if (filters.isActive !== undefined) {
        additionalQuery = additionalQuery.eq('is_active', filters.isActive)
      }

      const { data: additionalData } = await additionalQuery
      additionalQuestionnaires = additionalData || []
    }

    // Combine and deduplicate results
    const allResults = [...data, ...additionalQuestionnaires]
    const uniqueResults = allResults.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))

    const transformedData = uniqueResults.map(transformFromDatabase)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in searchQuestionnaires:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching questionnaires',
      data: []
    }
  }
}

/**
 * Get questionnaires by category
 * @param {string} category - Category name
 * @returns {Promise<Object>} Result with category's questionnaires
 */
export const getQuestionnairesByCategory = async (category) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!category) {
      return {
        success: false,
        error: 'Category name is required',
        data: []
      }
    }

    const { data, error } = await supabase
      .from('assessment_with_questions')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching questionnaires by category:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    const transformedData = data.map(transformFromDatabase)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getQuestionnairesByCategory:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching questionnaires by category',
      data: []
    }
  }
}

/**
 * Duplicate an questionnaire (including all its questions)
 * @param {string} id - Questionnaire ID to duplicate
 * @param {Object} overrides - Optional field overrides for the new assessment
 * @returns {Promise<Object>} Result with duplicated assessment
 */
export const duplicateQuestionnaire = async (id, overrides = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    // First, get the original questionnaire with questions
    const originalResult = await getQuestionnaireById(id)
    if (!originalResult.success) {
      return originalResult
    }

    const originalData = originalResult.data

    // Create a new questionnaire with modified data
    const newAssessmentData = {
      ...originalData,
      ...overrides,
      title: overrides.title || `${originalData.title} (Copy)`,
      status: 'Draft' // Always set copies to draft
    }

    // Remove fields that shouldn't be copied
    delete newAssessmentData.id
    delete newAssessmentData.createdAt
    delete newAssessmentData.modifiedAt
    delete newAssessmentData.createdDate
    delete newAssessmentData.lastUpdated
    delete newAssessmentData.createdBy
    delete newAssessmentData.modifiedBy
    delete newAssessmentData.questions
    delete newAssessmentData.questionCount

    // Reset statistics for the copy
    newAssessmentData.completions = 0
    newAssessmentData.totalAttempts = 0
    newAssessmentData.averageScore = 0

    // Create the new assessment
    const newAssessmentResult = await createQuestionnaire(newAssessmentData)
    if (!newAssessmentResult.success) {
      return newAssessmentResult
    }

    // If original had questions, duplicate them
    if (originalData.questions && originalData.questions.length > 0) {
      const { createQuestionnaireQuestion } = await import('./questionnaire-questions-controller')

      for (const question of originalData.questions) {
        const questionData = {
          question: question.question,
          context: question.context,
          preferred_feedback: question.preferred_feedback,
          is_active: question.is_active
        }

        await createQuestionnaireQuestion(newAssessmentResult.data.id, questionData)
      }
    }

    // Return the complete duplicated assessment
    return await getQuestionnaireById(newAssessmentResult.data.id)
  } catch (error) {
    console.error('Unexpected error in duplicateAssessment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while duplicating the assessment',
      data: null
    }
  }
}

/**
 * Get questionnaire statistics
 * @param {Object} filters - Optional filters for statistics
 * @returns {Promise<Object>} Result with statistics
 */
export const getQuestionnairesStats = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase
      .from('assessment_with_questions')
      .select('status, category, completions, total_attempts, average_score, is_active, question_count')

    // Apply filters if provided
    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching questionnaires stats:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Calculate statistics
    const stats = {
      total: data.length,
      active: data.filter((item) => item.is_active).length,
      inactive: data.filter((item) => !item.is_active).length,
      byStatus: {},
      byCategory: {},
      totalCompletions: 0,
      totalAttempts: 0,
      totalQuestions: 0,
      overallAverageScore: 0
    }

    let totalScoreSum = 0
    let questionnairesWithScores = 0

    data.forEach((item) => {
      // Count by status
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1

      // Count by category
      if (item.category) {
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1
      }

      // Sum completions, attempts, and questions
      stats.totalCompletions += item.completions || 0
      stats.totalAttempts += item.total_attempts || 0
      stats.totalQuestions += item.question_count || 0

      // Calculate overall average score
      if (item.average_score > 0) {
        totalScoreSum += parseFloat(item.average_score)
        questionnairesWithScores++
      }
    })

    // Calculate overall average score
    stats.overallAverageScore =
      questionnairesWithScores > 0 ? Math.round((totalScoreSum / questionnairesWithScores) * 100) / 100 : 0

    return {
      success: true,
      data: stats,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getQuestionnairesStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching questionnaires statistics',
      data: null
    }
  }
}

/**
 * Update questionnaire statistics
 * @param {string} id - Questionnaire ID
 * @param {Object} stats - Statistics to update
 * @returns {Promise<Object>} Result with updated assessment
 */
export const updateQuestionnaireStats = async (id, stats) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    const updateData = {}
    if (stats.completions !== undefined) updateData.completions = stats.completions
    if (stats.totalAttempts !== undefined) updateData.total_attempts = stats.totalAttempts
    if (stats.averageScore !== undefined) updateData.average_score = stats.averageScore

    const { data, error } = await supabase.from('questionnaires').update(updateData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating questionnaire statistics:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Get the full questionnaire with questions using the view
    const fullAssessmentResult = await getQuestionnaireById(data.id)

    return {
      success: true,
      data: fullAssessmentResult.success ? fullAssessmentResult.data : transformFromDatabase(data),
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in updateQuestionnaireStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating questionnaire statistics',
      data: null
    }
  }
}
