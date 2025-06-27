// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'
import {
  transformToDatabase,
  transformFromDatabase,
  validateJobDescription,
  generateSearchKeywords
} from './data-model'

/**
 * Job Descriptions Controller
 * Handles all CRUD operations for job descriptions
 */

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error('Job Descriptions Controller: Supabase credentials not configured')
}

/**
 * Get all job descriptions
 * @param {Object} filters - Optional filters for querying
 * @returns {Promise<Object>} Result with job descriptions data
 */
export const getAllJobDescriptions = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('job_descriptions').select('*').order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.company) {
      query = query.ilike('company', `%${filters.company}%`)
    }

    if (filters.department) {
      query = query.eq('department', filters.department)
    }

    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel)
    }

    if (filters.remote !== undefined) {
      query = query.eq('remote', filters.remote)
    }

    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching job descriptions:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    // Transform database data to frontend format
    const transformedData = data.map(transformFromDatabase)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getAllJobDescriptions:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job descriptions',
      data: []
    }
  }
}

/**
 * Get a single job description by ID
 * @param {string} id - Job description ID
 * @returns {Promise<Object>} Result with job description data
 */
export const getJobDescriptionById = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job description ID is required',
        data: null
      }
    }

    const { data, error } = await supabase.from('job_descriptions').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching job description:', error)
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
    console.error('Unexpected error in getJobDescriptionById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the job description',
      data: null
    }
  }
}

/**
 * Create a new job description
 * @param {Object} jobDescriptionData - Job description data
 * @param {Object} user - Current user information
 * @returns {Promise<Object>} Result with created job description
 */
export const createJobDescription = async (jobDescriptionData, user = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Validate the job description data
    const validation = validateJobDescription(jobDescriptionData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Generate search keywords
    const searchKeywords = generateSearchKeywords(jobDescriptionData)

    // Transform form data to database format with user context
    const dbData = transformToDatabase(
      {
        ...jobDescriptionData,
        searchKeywords
      },
      { user, isUpdate: false }
    )

    const { data, error } = await supabase.from('job_descriptions').insert([dbData]).select().single()

    if (error) {
      console.error('Error creating job description:', error)
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
    console.error('Unexpected error in createJobDescription:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the job description',
      data: null
    }
  }
}

/**
 * Update an existing job description
 * @param {string} id - Job description ID
 * @param {Object} jobDescriptionData - Updated job description data
 * @param {Object} user - Current user information
 * @returns {Promise<Object>} Result with updated job description
 */
export const updateJobDescription = async (id, jobDescriptionData, user = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job description ID is required',
        data: null
      }
    }

    // Validate the job description data
    const validation = validateJobDescription(jobDescriptionData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Generate search keywords
    const searchKeywords = generateSearchKeywords(jobDescriptionData)

    // Transform form data to database format with user context
    const dbData = transformToDatabase(
      {
        ...jobDescriptionData,
        searchKeywords
      },
      { user, isUpdate: true }
    )

    const { data, error } = await supabase.from('job_descriptions').update(dbData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating job description:', error)
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
    console.error('Unexpected error in updateJobDescription:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the job description',
      data: null
    }
  }
}

/**
 * Delete a job description
 * @param {string} id - Job description ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteJobDescription = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job description ID is required'
      }
    }

    const { error } = await supabase.from('job_descriptions').delete().eq('id', id)

    if (error) {
      console.error('Error deleting job description:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in deleteJobDescription:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the job description'
    }
  }
}

/**
 * Update job description status
 * @param {string} id - Job description ID
 * @param {string} status - New status ('Active', 'Paused', 'Draft', 'Archived')
 * @returns {Promise<Object>} Result of status update
 */
export const updateJobDescriptionStatus = async (id, status) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id || !status) {
      return {
        success: false,
        error: 'Job description ID and status are required'
      }
    }

    const validStatuses = ['Active', 'Paused', 'Draft', 'Archived']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Invalid status. Must be Active, Paused, Draft, or Archived'
      }
    }

    const { data, error } = await supabase.from('job_descriptions').update({ status }).eq('id', id).select().single()

    if (error) {
      console.error('Error updating job description status:', error)
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
    console.error('Unexpected error in updateJobDescriptionStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the job description status'
    }
  }
}

/**
 * Search job descriptions by title, company, overview, or tags
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} Result with matching job descriptions
 */
export const searchJobDescriptions = async (searchTerm, filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
      return getAllJobDescriptions(filters)
    }

    let query = supabase
      .from('job_descriptions')
      .select('*')
      .or(
        `title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,overview.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false })

    // Apply additional filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.department) {
      query = query.eq('department', filters.department)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching job descriptions:', error)
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
    console.error('Unexpected error in searchJobDescriptions:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching job descriptions',
      data: []
    }
  }
}

/**
 * Get job descriptions by company
 * @param {string} company - Company name
 * @returns {Promise<Object>} Result with company's job descriptions
 */
export const getJobDescriptionsByCompany = async (company) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!company) {
      return {
        success: false,
        error: 'Company name is required',
        data: []
      }
    }

    const { data, error } = await supabase
      .from('job_descriptions')
      .select('*')
      .ilike('company', `%${company}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching job descriptions by company:', error)
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
    console.error('Unexpected error in getJobDescriptionsByCompany:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job descriptions by company',
      data: []
    }
  }
}

/**
 * Get job descriptions by department
 * @param {string} department - Department name
 * @returns {Promise<Object>} Result with department's job descriptions
 */
export const getJobDescriptionsByDepartment = async (department) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!department) {
      return {
        success: false,
        error: 'Department name is required',
        data: []
      }
    }

    const { data, error } = await supabase
      .from('job_descriptions')
      .select('*')
      .eq('department', department)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching job descriptions by department:', error)
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
    console.error('Unexpected error in getJobDescriptionsByDepartment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job descriptions by department',
      data: []
    }
  }
}

/**
 * Duplicate a job description
 * @param {string} id - Job description ID to duplicate
 * @param {Object} user - Current user creating the duplicate
 * @param {Object} overrides - Optional field overrides for the new description
 * @returns {Promise<Object>} Result with duplicated job description
 */
export const duplicateJobDescription = async (id, user = null, overrides = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job description ID is required',
        data: null
      }
    }

    // First, get the original job description
    const originalResult = await getJobDescriptionById(id)
    if (!originalResult.success) {
      return originalResult
    }

    const originalData = originalResult.data

    // Create a new job description with modified data
    const newJobDescriptionData = {
      ...originalData,
      ...overrides,
      title: overrides.title || `${originalData.title} (Copy)`,
      status: 'Draft' // Always set copies to draft
    }

    // Remove fields that shouldn't be copied
    delete newJobDescriptionData.id
    delete newJobDescriptionData.createdAt
    delete newJobDescriptionData.modifiedAt
    delete newJobDescriptionData.createdDate
    delete newJobDescriptionData.lastUpdated

    return await createJobDescription(newJobDescriptionData, user)
  } catch (error) {
    console.error('Unexpected error in duplicateJobDescription:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while duplicating the job description',
      data: null
    }
  }
}

/**
 * Get job descriptions statistics
 * @param {Object} filters - Optional filters for statistics
 * @returns {Promise<Object>} Result with statistics
 */
export const getJobDescriptionsStats = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('job_descriptions').select('status, type, department, experience_level')

    // Apply filters if provided
    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching job descriptions stats:', error)
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
      byDepartment: {},
      byExperienceLevel: {}
    }

    data.forEach((item) => {
      // Count by status
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1

      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1

      // Count by department
      if (item.department) {
        stats.byDepartment[item.department] = (stats.byDepartment[item.department] || 0) + 1
      }

      // Count by experience level
      if (item.experience_level) {
        stats.byExperienceLevel[item.experience_level] = (stats.byExperienceLevel[item.experience_level] || 0) + 1
      }
    })

    return {
      success: true,
      data: stats,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getJobDescriptionsStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job descriptions statistics',
      data: null
    }
  }
}
