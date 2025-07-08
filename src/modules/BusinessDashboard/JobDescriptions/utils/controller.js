// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'
import { transformToDatabase, transformFromDatabase, validateJobDescription, generateSearchTerms } from './data-model'

/**
 * Job Descriptions Controller
 * Handles all CRUD operations for job descriptions
 * Updated for new Supabase schema with lookup table references
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
 * Get all job descriptions with optional filters
 * @param {Object} filters - Optional filters for querying
 * @returns {Promise<Object>} Result with job descriptions data
 */
export const getAllJobDescriptions = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase
      .from('job_descriptions')
      .select(
        `
        *,
        department_lookup:lookup_details!job_descriptions_department_fkey(id, label, value),
        experience_level_lookup:lookup_details!job_descriptions_experience_level_fkey(id, label, value)
      `
      )
      .order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters.department) {
      query = query.eq('department', filters.department)
    }

    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel)
    }

    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    if (filters.title) {
      query = query.ilike('title', `%${filters.title}%`)
    }

    if (filters.keywords && filters.keywords.length > 0) {
      query = query.overlaps('keywords', filters.keywords)
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
    const transformedData = data.map((item) => ({
      ...transformFromDatabase(item),
      departmentName: item.department_lookup?.label,
      experienceLevelName: item.experience_level_lookup?.label
    }))

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

    const { data, error } = await supabase
      .from('job_descriptions')
      .select(
        `
        *,
        department_lookup:lookup_details!job_descriptions_department_fkey(id, label, value),
        experience_level_lookup:lookup_details!job_descriptions_experience_level_fkey(id, label, value)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job description:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = {
      ...transformFromDatabase(data),
      departmentName: data.department_lookup?.label,
      experienceLevelName: data.experience_level_lookup?.label
    }

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
 * @param {Object} user - Current user information (optional, handled by RLS)
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

    // Transform form data to database format
    const dbData = transformToDatabase(jobDescriptionData)

    const { data, error } = await supabase
      .from('job_descriptions')
      .insert([dbData])
      .select(
        `
        *,
        department_lookup:lookup_details!job_descriptions_department_fkey(id, label, value),
        experience_level_lookup:lookup_details!job_descriptions_experience_level_fkey(id, label, value)
      `
      )
      .single()

    if (error) {
      console.error('Error creating job description:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = {
      ...transformFromDatabase(data),
      departmentName: data.department_lookup?.label,
      experienceLevelName: data.experience_level_lookup?.label
    }

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
 * @param {Object} user - Current user information (optional, handled by RLS)
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

    // Transform form data to database format
    const dbData = transformToDatabase(jobDescriptionData)

    const { data, error } = await supabase
      .from('job_descriptions')
      .update(dbData)
      .eq('id', id)
      .select(
        `
        *,
        department_lookup:lookup_details!job_descriptions_department_fkey(id, label, value),
        experience_level_lookup:lookup_details!job_descriptions_experience_level_fkey(id, label, value)
      `
      )
      .single()

    if (error) {
      console.error('Error updating job description:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = {
      ...transformFromDatabase(data),
      departmentName: data.department_lookup?.label,
      experienceLevelName: data.experience_level_lookup?.label
    }

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
 * @returns {Promise<Object>} Result of delete operation
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
 * Search job descriptions by keywords and text content
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

    let query = supabase.from('job_descriptions').select(`
        *,
        department_lookup:lookup_details!job_descriptions_department_fkey(id, value),
        experience_level_lookup:lookup_details!job_descriptions_experience_level_fkey(id, value)
      `)

    // Search in multiple text fields
    const searchCondition = `title.ilike.%${searchTerm}%,overview.ilike.%${searchTerm}%,responsibilities.ilike.%${searchTerm}%,requirements.ilike.%${searchTerm}%,benefits.ilike.%${searchTerm}%`
    query = query.or(searchCondition)

    // Apply additional filters
    if (filters.department) {
      query = query.eq('department', filters.department)
    }

    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error searching job descriptions:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    // Transform database data to frontend format
    const transformedData = data.map((item) => ({
      ...transformFromDatabase(item),
      departmentName: item.department_lookup?.value,
      experienceLevelName: item.experience_level_lookup?.value
    }))

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
 * Get job descriptions by department
 * @param {string} departmentId - Department UUID
 * @returns {Promise<Object>} Result with job descriptions for the department
 */
export const getJobDescriptionsByDepartment = async (departmentId) => {
  try {
    if (!departmentId) {
      return {
        success: false,
        error: 'Department ID is required',
        data: []
      }
    }

    return getAllJobDescriptions({ department: departmentId })
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
 * Get job descriptions by experience level
 * @param {string} experienceLevelId - Experience level UUID
 * @returns {Promise<Object>} Result with job descriptions for the experience level
 */
export const getJobDescriptionsByExperienceLevel = async (experienceLevelId) => {
  try {
    if (!experienceLevelId) {
      return {
        success: false,
        error: 'Experience level ID is required',
        data: []
      }
    }

    return getAllJobDescriptions({ experienceLevel: experienceLevelId })
  } catch (error) {
    console.error('Unexpected error in getJobDescriptionsByExperienceLevel:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching job descriptions by experience level',
      data: []
    }
  }
}

/**
 * Duplicate a job description
 * @param {string} id - Job description ID to duplicate
 * @param {Object} user - Current user information
 * @param {Object} overrides - Fields to override in the duplicate
 * @returns {Promise<Object>} Result with duplicated job description
 */
export const duplicateJobDescription = async (id, user = null, overrides = {}) => {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Job description ID is required',
        data: null
      }
    }

    // Get the original job description
    const originalResult = await getJobDescriptionById(id)
    if (!originalResult.success) {
      return originalResult
    }

    // Create a copy with overrides
    const duplicateData = {
      ...originalResult.data,
      title: overrides.title || `${originalResult.data.title} (Copy)`,
      ...overrides
    }

    // Remove ID and audit fields
    delete duplicateData.id
    delete duplicateData.createdAt
    delete duplicateData.modifiedAt
    delete duplicateData.createdBy
    delete duplicateData.modifiedBy
    delete duplicateData.createdDate
    delete duplicateData.lastUpdated

    // Create the duplicate
    return createJobDescription(duplicateData, user)
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
 * @returns {Promise<Object>} Result with statistics data
 */
export const getJobDescriptionsStats = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase.from('job_descriptions').select('id, department, experience_level, created_at')

    // Apply filters if provided
    if (filters.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    if (filters.department) {
      query = query.eq('department', filters.department)
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
      byDepartment: {},
      byExperienceLevel: {},
      recentlyCreated: 0
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    data.forEach((item) => {
      // Count by department
      if (item.department) {
        stats.byDepartment[item.department] = (stats.byDepartment[item.department] || 0) + 1
      }

      // Count by experience level
      if (item.experience_level) {
        stats.byExperienceLevel[item.experience_level] = (stats.byExperienceLevel[item.experience_level] || 0) + 1
      }

      // Count recently created
      if (new Date(item.created_at) > oneWeekAgo) {
        stats.recentlyCreated++
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

/**
 * Get departments from lookup tables
 * @returns {Promise<Object>} Result with departments array
 */
export const getDepartments = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // First get the "Departments" header
    const { data: headerData, error: headerError } = await supabase
      .from('lookup_headers')
      .select('id')
      .eq('category', 'Departments')
      .eq('is_active', true)
      .single()

    if (headerError) {
      console.error('Error fetching departments header:', headerError)
      return {
        success: false,
        error: 'Departments lookup category not found',
        data: []
      }
    }

    // Then get all department details
    const { data: detailsData, error: detailsError } = await supabase
      .from('lookup_details')
      .select('id, label, value')
      .eq('header_id', headerData.id)
      .order('sort_order', { ascending: true })

    if (detailsError) {
      console.error('Error fetching department details:', detailsError)
      return {
        success: false,
        error: detailsError.message,
        data: []
      }
    }

    return {
      success: true,
      data: detailsData || [],
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getDepartments:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching departments',
      data: []
    }
  }
}

/**
 * Get experience levels from lookup tables
 * @returns {Promise<Object>} Result with experience levels array
 */
export const getExperienceLevels = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // First get the "Experience Level" header
    const { data: headerData, error: headerError } = await supabase
      .from('lookup_headers')
      .select('id')
      .eq('category', 'Experience Level')
      .eq('is_active', true)
      .single()

    if (headerError) {
      console.error('Error fetching experience levels header:', headerError)
      return {
        success: false,
        error: 'Experience Level lookup category not found',
        data: []
      }
    }

    // Then get all experience level details
    const { data: detailsData, error: detailsError } = await supabase
      .from('lookup_details')
      .select('id, label, value')
      .eq('header_id', headerData.id)
      .order('sort_order', { ascending: true })

    if (detailsError) {
      console.error('Error fetching experience level details:', detailsError)
      return {
        success: false,
        error: detailsError.message,
        data: []
      }
    }

    return {
      success: true,
      data: detailsData || [],
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getExperienceLevels:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching experience levels',
      data: []
    }
  }
}
