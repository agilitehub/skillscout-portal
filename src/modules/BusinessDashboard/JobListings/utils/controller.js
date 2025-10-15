// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { supabase } from '../../../../core/lib/supabase-controller'
import { transformToDatabase, transformFromDatabase, validateJobOpportunity } from './data-model'

/**
 * Job Listings Controller
 * Handles all CRUD operations for job listings
 */

/**
 * Get all job listings
 * @param {Object} filters - Optional filters for querying
 * @returns {Promise<Object>} Result with job listings data
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

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Job Listings Controller: Error fetching job listings:', error)
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
    console.error('Job Listings Controller: Unexpected error in getAllJobOpportunities:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job listings',
      data: []
    }
  }
}

/**
 * Get a specific job opportunity by ID
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
      console.error('Job Listings Controller: Error fetching job listing:', error)
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
    console.error('Job Listings Controller: Unexpected error in getJobOpportunityById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the job listing',
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
      console.error('Job Listings Controller: Validation failed:', validation.errors)
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
      console.error('Job Listings Controller: Error creating job listing:', error)
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
    console.error('Job Listings Controller: Unexpected error in createJobOpportunity:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the job listing',
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
        error: 'Job listing ID is required',
        data: null
      }
    }

    // Validate the job data
    const validation = validateJobOpportunity(jobData)
    if (!validation.success) {
      console.error('Job Listings Controller: Validation failed:', validation.errors)
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
      console.error('Job Listings Controller: Error updating job listing:', error)
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
    console.error('Job Listings Controller: Unexpected error in updateJobOpportunity:', error)
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
        error: 'Job opportunity ID is required',
        data: null
      }
    }

    const { error } = await supabase.from('job_opportunities').delete().eq('id', id)

    if (error) {
      console.error('Job Listings Controller: Error deleting job listing:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      error: null,
      data: { id }
    }
  } catch (error) {
    console.error('Job Listings Controller: Unexpected error in deleteJobOpportunity:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the job opportunity',
      data: null
    }
  }
}

/**
 * Update job opportunity status
 * @param {string} id - Job opportunity ID
 * @param {string} status - New status ('Active', 'Paused', 'Closed')
 * @returns {Promise<Object>} Result of status update operation
 */
export const updateJobOpportunityStatus = async (id, status) => {
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

    if (!['Active', 'Paused', 'Closed'].includes(status)) {
      return {
        success: false,
        error: 'Invalid status. Must be Active, Paused, or Closed',
        data: null
      }
    }

    const { data, error } = await supabase.from('job_opportunities').update({ status }).eq('id', id).select().single()

    if (error) {
      console.error('Job Listings Controller: Error updating job listing status:', error)
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
    console.error('Job Listings Controller: Unexpected error in updateJobOpportunityStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the job opportunity status',
      data: null
    }
  }
}

/**
 * Get job listings statistics
 * @param {Object} filters - Optional filters for statistics
 * @returns {Promise<Object>} Result with statistics data
 */
export const getJobOpportunitiesStats = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('job_opportunities').select('status, applicants, type, work_arrangement')

    // Apply filters if provided
    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching job listings statistics:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Calculate statistics
    const stats = {
      total: data.length,
      active: data.filter((job) => job.status === 'Active').length,
      paused: data.filter((job) => job.status === 'Paused').length,
      closed: data.filter((job) => job.status === 'Closed').length,
      totalApplicants: data.reduce((sum, job) => sum + (job.applicants || 0), 0),
      byType: {},
      byWorkArrangement: {}
    }

    // Group by type
    data.forEach((job) => {
      stats.byType[job.type] = (stats.byType[job.type] || 0) + 1
    })

    // Group by work arrangement
    data.forEach((job) => {
      stats.byWorkArrangement[job.work_arrangement] = (stats.byWorkArrangement[job.work_arrangement] || 0) + 1
    })

    return {
      success: true,
      data: stats,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getJobOpportunitiesStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching statistics',
      data: null
    }
  }
}

/**
 * Search job listings
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Result with filtered job listings
 */
export const searchJobOpportunities = async (searchTerm, filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('job_opportunities').select('*')

    // Apply text search
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    // Apply additional filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.workArrangement) {
      query = query.eq('work_arrangement', filters.workArrangement)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error searching job listings:', error)
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
    console.error('Unexpected error in searchJobOpportunities:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching job listings',
      data: []
    }
  }
}

/**
 * Duplicate a job opportunity
 * @param {string} id - Job opportunity ID to duplicate
 * @param {Object} overrides - Optional field overrides for the duplicate
 * @returns {Promise<Object>} Result with duplicated job opportunity
 */
export const duplicateJobOpportunity = async (id, overrides = {}) => {
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

    // First, get the original job opportunity
    const originalResult = await getJobOpportunityById(id)
    if (!originalResult.success) {
      return originalResult
    }

    // Prepare data for duplication
    const duplicateData = {
      ...originalResult.data,
      ...overrides,
      title: overrides.title || `${originalResult.data.title} (Copy)`,
      applicants: 0,
      datePosted: null,
      status: 'Active'
    }

    // Remove ID and audit fields that should be auto-generated
    delete duplicateData.id
    delete duplicateData.createdAt
    delete duplicateData.modifiedAt
    delete duplicateData.createdBy
    delete duplicateData.modifiedBy

    // Create the duplicate
    return await createJobOpportunity(duplicateData)
  } catch (error) {
    console.error('Unexpected error in duplicateJobOpportunity:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while duplicating the job opportunity',
      data: null
    }
  }
}

/**
 * Get all job descriptions for dropdown selection
 * @returns {Promise<Object>} Result with job descriptions data
 */
export const getJobDescriptionsForSelection = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('job_descriptions')
      .select('id, title, department, experience_level')
      .order('title', { ascending: true })

    if (error) {
      console.error('Job Listings Controller: Error fetching job descriptions:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Job Listings Controller: Unexpected error in getJobDescriptionsForSelection:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job descriptions',
      data: []
    }
  }
}

/**
 * Get all questionnaires for dropdown selection
 * @returns {Promise<Object>} Result with questionnaires data
 */
export const getQuestionnairesForSelection = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('questionnaires')
      .select('id, title, category, status')
      .eq('is_active', true)
      .order('title', { ascending: true })

    if (error) {
      console.error('Job Listings Controller: Error fetching questionnaires:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Job Listings Controller: Unexpected error in getQuestionnairesForSelection:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching questionnaires',
      data: []
    }
  }
}
