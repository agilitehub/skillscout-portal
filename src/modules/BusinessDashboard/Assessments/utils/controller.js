// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'
import { transformToDatabase, transformFromDatabase, validateAssessment, generateSearchKeywords } from './data-model'

/**
 * Assessments Controller
 * Handles all CRUD operations for assessments
 */

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error('Assessments Controller: Supabase credentials not configured')
}

/**
 * Get all assessments with optional filtering
 * @param {Object} filters - Optional filters for assessments
 * @returns {Promise<Object>} Result with assessments array
 */
export const getAllAssessments = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('assessments').select('*').order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }

    if (filters.category) {
      query = query.ilike('category', `%${filters.category}%`)
    }

    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assessments:', error)
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
    console.error('Unexpected error in getAllAssessments:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching assessments',
      data: []
    }
  }
}

/**
 * Get a single assessment by ID
 * @param {string} id - Assessment ID
 * @returns {Promise<Object>} Result with assessment data
 */
export const getAssessmentById = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Assessment ID is required',
        data: null
      }
    }

    const { data, error } = await supabase.from('assessments').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching assessment by ID:', error)
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
    console.error('Unexpected error in getAssessmentById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the assessment',
      data: null
    }
  }
}

/**
 * Create a new assessment
 * @param {Object} assessmentData - Assessment data
 * @param {Object} user - Current user information
 * @returns {Promise<Object>} Result with created assessment
 */
export const createAssessment = async (assessmentData, user = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Validate the assessment data
    const validation = validateAssessment(assessmentData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Generate search keywords
    const searchKeywords = generateSearchKeywords(assessmentData)

    // Transform form data to database format with user context
    const dbData = transformToDatabase(
      {
        ...assessmentData,
        searchKeywords
      },
      { user, isUpdate: false }
    )

    const { data, error } = await supabase.from('assessments').insert([dbData]).select().single()

    if (error) {
      console.error('Error creating assessment:', error)
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
    console.error('Unexpected error in createAssessment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the assessment',
      data: null
    }
  }
}

/**
 * Update an existing assessment
 * @param {string} id - Assessment ID
 * @param {Object} assessmentData - Updated assessment data
 * @param {Object} user - Current user information
 * @returns {Promise<Object>} Result with updated assessment
 */
export const updateAssessment = async (id, assessmentData, user = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Assessment ID is required',
        data: null
      }
    }

    // Validate the assessment data
    const validation = validateAssessment(assessmentData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Generate search keywords
    const searchKeywords = generateSearchKeywords(assessmentData)

    // Transform form data to database format with user context
    const dbData = transformToDatabase(
      {
        ...assessmentData,
        searchKeywords
      },
      { user, isUpdate: true }
    )

    const { data, error } = await supabase.from('assessments').update(dbData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating assessment:', error)
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
    console.error('Unexpected error in updateAssessment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the assessment',
      data: null
    }
  }
}

/**
 * Delete an assessment
 * @param {string} id - Assessment ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteAssessment = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Assessment ID is required',
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
    console.error('Unexpected error in deleteAssessment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the assessment',
      data: null
    }
  }
}

/**
 * Update assessment status
 * @param {string} id - Assessment ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Result with updated assessment
 */
export const updateAssessmentStatus = async (id, status) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Assessment ID is required',
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
      console.error('Error updating assessment status:', error)
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
    console.error('Unexpected error in updateAssessmentStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating assessment status',
      data: null
    }
  }
}

/**
 * Search assessments by term
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Optional additional filters
 * @returns {Promise<Object>} Result with matching assessments
 */
export const searchAssessments = async (searchTerm, filters = {}) => {
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
      .from('assessments')
      .select('*')
      .or(
        `title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,search_keywords.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false })

    // Apply additional filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching assessments:', error)
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
    console.error('Unexpected error in searchAssessments:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching assessments',
      data: []
    }
  }
}

/**
 * Get assessments by category
 * @param {string} category - Category name
 * @returns {Promise<Object>} Result with category's assessments
 */
export const getAssessmentsByCategory = async (category) => {
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
      .from('assessments')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching assessments by category:', error)
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
    console.error('Unexpected error in getAssessmentsByCategory:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching assessments by category',
      data: []
    }
  }
}

/**
 * Get assessments by type
 * @param {string} type - Assessment type
 * @returns {Promise<Object>} Result with type's assessments
 */
export const getAssessmentsByType = async (type) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!type) {
      return {
        success: false,
        error: 'Assessment type is required',
        data: []
      }
    }

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching assessments by type:', error)
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
    console.error('Unexpected error in getAssessmentsByType:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching assessments by type',
      data: []
    }
  }
}

/**
 * Duplicate an assessment
 * @param {string} id - Assessment ID to duplicate
 * @param {Object} user - Current user creating the duplicate
 * @param {Object} overrides - Optional field overrides for the new assessment
 * @returns {Promise<Object>} Result with duplicated assessment
 */
export const duplicateAssessment = async (id, user = null, overrides = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Assessment ID is required',
        data: null
      }
    }

    // First, get the original assessment
    const originalResult = await getAssessmentById(id)
    if (!originalResult.success) {
      return originalResult
    }

    const originalData = originalResult.data

    // Create a new assessment with modified data
    const newAssessmentData = {
      ...originalData,
      ...overrides,
      title: overrides.title || `${originalData.title} (Copy)`,
      status: 'Draft' // Always set copies to draft
    }

    // Remove fields that shouldn't be copied
    delete newAssessmentData.id
    delete newAssessmentData.createdAt
    delete newAssessmentData.updatedAt
    delete newAssessmentData.createdDate
    delete newAssessmentData.lastUpdated
    delete newAssessmentData.createdBy
    delete newAssessmentData.modifiedBy

    // Reset statistics for the copy
    newAssessmentData.completions = 0
    newAssessmentData.totalAttempts = 0
    newAssessmentData.averageScore = 0
    newAssessmentData.successRate = 0

    return await createAssessment(newAssessmentData, user)
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
 * Get assessment statistics
 * @param {Object} filters - Optional filters for statistics
 * @returns {Promise<Object>} Result with statistics
 */
export const getAssessmentsStats = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase
      .from('assessments')
      .select('status, type, difficulty, category, completions, total_attempts, average_score')

    // Apply filters if provided
    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assessments stats:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Calculate statistics
    const stats = {
      total: data.length,
      byStatus: {},
      byType: {},
      byDifficulty: {},
      byCategory: {},
      totalCompletions: 0,
      totalAttempts: 0,
      overallAverageScore: 0
    }

    let totalScoreSum = 0
    let assessmentsWithScores = 0

    data.forEach((item) => {
      // Count by status
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1

      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1

      // Count by difficulty
      if (item.difficulty) {
        stats.byDifficulty[item.difficulty] = (stats.byDifficulty[item.difficulty] || 0) + 1
      }

      // Count by category
      if (item.category) {
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1
      }

      // Sum completions and attempts
      stats.totalCompletions += item.completions || 0
      stats.totalAttempts += item.total_attempts || 0

      // Calculate overall average score
      if (item.average_score > 0) {
        totalScoreSum += parseFloat(item.average_score)
        assessmentsWithScores++
      }
    })

    // Calculate overall average score
    stats.overallAverageScore =
      assessmentsWithScores > 0 ? Math.round((totalScoreSum / assessmentsWithScores) * 100) / 100 : 0

    return {
      success: true,
      data: stats,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getAssessmentsStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching assessments statistics',
      data: null
    }
  }
}

/**
 * Update assessment statistics
 * @param {string} id - Assessment ID
 * @param {Object} stats - Statistics to update
 * @returns {Promise<Object>} Result with updated assessment
 */
export const updateAssessmentStats = async (id, stats) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Assessment ID is required',
        data: null
      }
    }

    const updateData = {}
    if (stats.completions !== undefined) updateData.completions = stats.completions
    if (stats.totalAttempts !== undefined) updateData.total_attempts = stats.totalAttempts
    if (stats.averageScore !== undefined) updateData.average_score = stats.averageScore
    if (stats.successRate !== undefined) updateData.success_rate = stats.successRate

    const { data, error } = await supabase.from('assessments').update(updateData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating assessment statistics:', error)
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
    console.error('Unexpected error in updateAssessmentStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating assessment statistics',
      data: null
    }
  }
}
