import { createClient } from '@supabase/supabase-js'
import { transformToDatabase, transformFromDatabase, validateJobOpportunity } from './data-model'

/**
 * Job Opportunities Controller
 * Handles all CRUD operations for job opportunities
 */

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error('Job Opportunities Controller: Supabase credentials not configured')
}

/**
 * Get all job opportunities
 * @param {Object} filters - Optional filters for querying
 * @returns {Promise<Object>} Result with job opportunities data
 */
export const getAllJobOpportunities = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('job_opportunities').select('*').order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.workArrangement) {
      query = query.eq('work_arrangement', filters.workArrangement)
    }

    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching job opportunities:', error)
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
    console.error('Unexpected error in getAllJobOpportunities:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job opportunities',
      data: []
    }
  }
}

/**
 * Get a single job opportunity by ID
 * @param {string} id - Job opportunity ID
 * @returns {Promise<Object>} Result with job opportunity data
 */
export const getJobOpportunityById = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job opportunity ID is required',
        data: null
      }
    }

    const { data, error } = await supabase.from('job_opportunities').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching job opportunity:', error)
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
    console.error('Unexpected error in getJobOpportunityById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the job opportunity',
      data: null
    }
  }
}

/**
 * Create a new job opportunity
 * @param {Object} jobData - Job opportunity data
 * @returns {Promise<Object>} Result with created job opportunity
 */
export const createJobOpportunity = async (jobData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Validate the job data
    const validation = validateJobOpportunity(jobData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform form data to database format
    const dbData = transformToDatabase(jobData)

    const { data, error } = await supabase.from('job_opportunities').insert([dbData]).select().single()

    if (error) {
      console.error('Error creating job opportunity:', error)
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
    console.error('Unexpected error in createJobOpportunity:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the job opportunity',
      data: null
    }
  }
}

/**
 * Update an existing job opportunity
 * @param {string} id - Job opportunity ID
 * @param {Object} jobData - Updated job opportunity data
 * @returns {Promise<Object>} Result with updated job opportunity
 */
export const updateJobOpportunity = async (id, jobData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job opportunity ID is required',
        data: null
      }
    }

    // Validate the job data
    const validation = validateJobOpportunity(jobData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform form data to database format
    const dbData = transformToDatabase(jobData)

    const { data, error } = await supabase.from('job_opportunities').update(dbData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating job opportunity:', error)
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
    console.error('Unexpected error in updateJobOpportunity:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the job opportunity',
      data: null
    }
  }
}

/**
 * Delete a job opportunity
 * @param {string} id - Job opportunity ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteJobOpportunity = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Job opportunity ID is required'
      }
    }

    const { error } = await supabase.from('job_opportunities').delete().eq('id', id)

    if (error) {
      console.error('Error deleting job opportunity:', error)
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
    console.error('Unexpected error in deleteJobOpportunity:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the job opportunity'
    }
  }
}

/**
 * Update job opportunity status
 * @param {string} id - Job opportunity ID
 * @param {string} status - New status ('Active', 'Paused', 'Closed')
 * @returns {Promise<Object>} Result of status update
 */
export const updateJobStatus = async (id, status) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id || !status) {
      return {
        success: false,
        error: 'Job opportunity ID and status are required'
      }
    }

    const validStatuses = ['Active', 'Paused', 'Closed']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Invalid status. Must be Active, Paused, or Closed'
      }
    }

    const { data, error } = await supabase.from('job_opportunities').update({ status }).eq('id', id).select().single()

    if (error) {
      console.error('Error updating job status:', error)
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
    console.error('Unexpected error in updateJobStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the job status'
    }
  }
}

/**
 * Update applicant count for a job opportunity
 * @param {string} id - Job opportunity ID
 * @param {number} count - New applicant count
 * @returns {Promise<Object>} Result of applicant count update
 */
export const updateApplicantCount = async (id, count) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id || count < 0) {
      return {
        success: false,
        error: 'Valid job opportunity ID and non-negative count are required'
      }
    }

    const { data, error } = await supabase
      .from('job_opportunities')
      .update({ applicants: count })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating applicant count:', error)
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
    console.error('Unexpected error in updateApplicantCount:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the applicant count'
    }
  }
}

/**
 * Search job opportunities by title, company, or skills
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} Result with matching job opportunities
 */
export const searchJobOpportunities = async (searchTerm, filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
      return getAllJobOpportunities(filters)
    }

    let query = supabase
      .from('job_opportunities')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,required_skills.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    // Apply additional filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching job opportunities:', error)
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
    console.error('Unexpected error in searchJobOpportunities:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching job opportunities',
      data: []
    }
  }
}
