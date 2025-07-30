// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'
import { transformQuestionToDatabase, transformQuestionFromDatabase, validateQuestionnaireQuestion } from './data-model'

/**
 * Questionnaire Questions Controller
 * Handles all CRUD operations for questionnaire questions
 */

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error('Questionnaire Questions Controller: Supabase credentials not configured')
}

/**
 * Get all questions for a specific assessment
 * @param {string} questionnaireId - Questionnaire ID
 * @returns {Promise<Object>} Result with questions array
 */
export const getQuestionsByQuestionnaireId = async (questionnaireId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!questionnaireId) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: []
      }
    }

    const { data, error } = await supabase
      .from('questionnaire_questions')
      .select('*')
      .eq('questionnaire_id', questionnaireId)
      .order('question_order', { ascending: true })

    if (error) {
      console.error('Error fetching questionnaire questions:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    const transformedData = data.map(transformQuestionFromDatabase)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getQuestionsByQuestionnaireId:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching questionnaire questions',
      data: []
    }
  }
}

/**
 * Get a single questionnaire question by ID
 * @param {string} questionId - Question ID
 * @returns {Promise<Object>} Result with question data
 */
export const getQuestionById = async (questionId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!questionId) {
      return {
        success: false,
        error: 'Question ID is required',
        data: null
      }
    }

    const { data, error } = await supabase.from('questionnaire_questions').select('*').eq('id', questionId).single()

    if (error) {
      console.error('Error fetching question by ID:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = transformQuestionFromDatabase(data)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getQuestionById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the question',
      data: null
    }
  }
}

/**
 * Create a new questionnaire question
 * @param {string} questionnaireId - Questionnaire ID
 * @param {Object} questionData - Question data
 * @returns {Promise<Object>} Result with created question
 */
export const createQuestionnaireQuestion = async (questionnaireId, questionData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!questionnaireId) {
      return {
        success: false,
        error: 'Questionnaire ID is required',
        data: null
      }
    }

    // Add questionnaire_id to question data for validation
    const dataWithQuestionnaireId = { ...questionData, questionnaire_id: questionnaireId }

    // Validate the question data
    const validation = validateQuestionnaireQuestion(dataWithQuestionnaireId)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Get the next order number for this questionnaire
    const { data: maxOrderData } = await supabase
      .from('questionnaire_questions')
      .select('question_order')
      .eq('questionnaire_id', questionnaireId)
      .order('question_order', { ascending: false })
      .limit(1)

    const nextOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].question_order + 1 : 1

    // Transform form data to database format
    const dbData = transformQuestionToDatabase(questionData, questionnaireId, { isUpdate: false })
    dbData.question_order = nextOrder

    const { data, error } = await supabase.from('questionnaire_questions').insert([dbData]).select().single()

    if (error) {
      console.error('Error creating questionnaire question:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = transformQuestionFromDatabase(data)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in createQuestionnaireQuestion:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the question',
      data: null
    }
  }
}

/**
 * Update an existing questionnaire question
 * @param {string} questionId - Question ID
 * @param {Object} questionData - Updated question data
 * @returns {Promise<Object>} Result with updated question
 */
export const updateQuestionnaireQuestion = async (questionId, questionData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!questionId) {
      return {
        success: false,
        error: 'Question ID is required',
        data: null
      }
    }

    // Get existing question to get questionnaire_id for validation
    const existingResult = await getQuestionById(questionId)
    if (!existingResult.success) {
      return existingResult
    }

    const questionnaireId = existingResult.data.questionnaireId

    // Add questionnaire_id to question data for validation
    const dataWithQuestionnaireId = { ...questionData, questionnaire_id: questionnaireId }

    // Validate the question data
    const validation = validateQuestionnaireQuestion(dataWithQuestionnaireId)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform form data to database format
    const dbData = transformQuestionToDatabase(questionData, questionnaireId, { isUpdate: true })

    const { data, error } = await supabase
      .from('questionnaire_questions')
      .update(dbData)
      .eq('id', questionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating questionnaire question:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = transformQuestionFromDatabase(data)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in updateQuestionnaireQuestion:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the question',
      data: null
    }
  }
}

/**
 * Delete an questionnaire question
 * @param {string} questionId - Question ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteQuestionnaireQuestion = async (questionId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!questionId) {
      return {
        success: false,
        error: 'Question ID is required',
        data: null
      }
    }

    const { error } = await supabase.from('questionnaire_questions').delete().eq('id', questionId)

    if (error) {
      console.error('Error deleting questionnaire question:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: { id: questionId },
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in deleteQuestionnaireQuestion:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the question',
      data: null
    }
  }
}

/**
 * Update question order for multiple questions
 * @param {Array} questions - Array of questions with updated order
 * @returns {Promise<Object>} Result of reorder operation
 */
export const reorderQuestions = async (questions) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return {
        success: false,
        error: 'Questions array is required',
        data: null
      }
    }

    // Update each question's order
    const updatePromises = questions.map((question) =>
      supabase.from('questionnaire_questions').update({ question_order: question.questionOrder }).eq('id', question.id)
    )

    const results = await Promise.all(updatePromises)

    // Check if any updates failed
    const failed = results.find((result) => result.error)
    if (failed) {
      console.error('Error reordering questions:', failed.error)
      return {
        success: false,
        error: failed.error.message,
        data: null
      }
    }

    return {
      success: true,
      data: { updated: questions.length },
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in reorderQuestions:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while reordering questions',
      data: null
    }
  }
}

/**
 * Duplicate a question within the same questionnaire or to another assessment
 * @param {string} questionId - Question ID to duplicate
 * @param {string} targetAssessmentId - Target questionnaire ID (optional, defaults to same assessment)
 * @returns {Promise<Object>} Result with duplicated question
 */
export const duplicateQuestion = async (questionId, targetAssessmentId = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!questionId) {
      return {
        success: false,
        error: 'Question ID is required',
        data: null
      }
    }

    // Get the original question
    const originalResult = await getQuestionById(questionId)
    if (!originalResult.success) {
      return originalResult
    }

    const originalQuestion = originalResult.data
    const questionnaireId = targetAssessmentId || originalQuestion.questionnaireId

    // Create new question data
    const newQuestionData = {
      question: originalQuestion.question + ' (Copy)',
      context: originalQuestion.context,
      preferredFeedback: originalQuestion.preferredFeedback,
      isActive: originalQuestion.isActive
    }

    return await createQuestionnaireQuestion(questionnaireId, newQuestionData)
  } catch (error) {
    console.error('Unexpected error in duplicateQuestion:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while duplicating the question',
      data: null
    }
  }
}

/**
 * Search questions across all questionnaires or within a specific assessment
 * @param {string} searchTerm - Search term
 * @param {string} questionnaireId - Optional questionnaire ID to limit search
 * @returns {Promise<Object>} Result with matching questions
 */
export const searchQuestions = async (searchTerm, questionnaireId = null) => {
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

    let query = supabase
      .from('questionnaire_questions')
      .select('*')
      .or(`question.ilike.%${searchTerm}%,context.ilike.%${searchTerm}%,preferred_feedback.ilike.%${searchTerm}%`)
      .order('question_order', { ascending: true })

    if (questionnaireId) {
      query = query.eq('questionnaire_id', questionnaireId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching questions:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    const transformedData = data.map(transformQuestionFromDatabase)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in searchQuestions:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching questions',
      data: []
    }
  }
}
