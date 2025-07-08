// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'
import { validateLookup, sanitizeLookup } from './data-model'

/**
 * Lookups Controller
 * Handles all CRUD operations for lookup headers and details
 */

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error('Lookups Controller: Supabase credentials not configured')
}

/**
 * Transform database data to UI format
 * @param {Object} header - Header data from database
 * @param {Array} details - Details data from database
 * @returns {Object} Transformed data for UI
 */
const transformFromDatabase = (header, details = []) => {
  return {
    id: header.id,
    profileKey: header.category,
    groupName: '', // Not in schema, keeping for backward compatibility
    solutions: [], // Not in schema, keeping for backward compatibility
    isActive: header.is_active,
    labelValuePairs: details
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((detail) => ({
        id: detail.id,
        label: detail.label,
        value: detail.value || '',
        sortOrder: detail.sort_order
      })),
    createdBy: header.created_by,
    modifiedBy: header.modified_by,
    dateCreated: header.date_created,
    dateModified: header.date_modified
  }
}

/**
 * Transform UI data to database format
 * @param {Object} lookupData - Lookup data from UI
 * @param {Object} context - Context information (user, isUpdate)
 * @returns {Object} Transformed data for database
 */
const transformToDatabase = (lookupData, context = {}) => {
  const { user, isUpdate } = context
  const now = new Date().toISOString()

  const headerData = {
    category: lookupData.profileKey,
    is_active: lookupData.isActive !== undefined ? lookupData.isActive : true
  }

  if (!isUpdate) {
    headerData.created_by = user?.id || null
    headerData.date_created = now
  }

  headerData.modified_by = user?.id || null
  headerData.date_modified = now

  return {
    header: headerData,
    details: (lookupData.labelValuePairs || [])
      .filter((pair) => pair.label && pair.label.trim())
      .map((pair, index) => {
        const detail = {
          label: pair.label.trim(),
          value: pair.value ? pair.value.trim() : null,
          sort_order: pair.sortOrder || index + 1,
          modified_by: user?.id || null,
          date_modified: now
        }

        // Only add created_by and date_created for new records
        if (!isUpdate) {
          detail.created_by = user?.id || null
          detail.date_created = now
        }

        return detail
      })
  }
}

/**
 * Get all lookup headers with their details
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Result with lookups array
 */
export const getAllLookups = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let headerQuery = supabase
      .from('lookup_headers')
      .select(
        `
        *,
        lookup_details (
          id,
          label,
          value,
          sort_order,
          created_by,
          modified_by,
          date_created,
          date_modified
        )
      `
      )
      .order('category', { ascending: true })

    // Apply filters if provided
    if (filters.category) {
      headerQuery = headerQuery.ilike('category', `%${filters.category}%`)
    }

    if (filters.isActive !== undefined) {
      headerQuery = headerQuery.eq('is_active', filters.isActive)
    }

    const { data, error } = await headerQuery

    if (error) {
      console.error('Error fetching lookups:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    const transformedData = data.map((header) => transformFromDatabase(header, header.lookup_details || []))

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getAllLookups:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching lookups',
      data: []
    }
  }
}

/**
 * Get a single lookup by ID
 * @param {string} id - Lookup header ID
 * @returns {Promise<Object>} Result with lookup data
 */
export const getLookupById = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Lookup ID is required',
        data: null
      }
    }

    const { data, error } = await supabase
      .from('lookup_headers')
      .select(
        `
        *,
        lookup_details (
          id,
          label,
          value,
          sort_order,
          created_by,
          modified_by,
          date_created,
          date_modified
        )
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching lookup by ID:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = transformFromDatabase(data, data.lookup_details || [])

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getLookupById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the lookup',
      data: null
    }
  }
}

/**
 * Create a new lookup with header and details
 * @param {Object} lookupData - Lookup data
 * @param {Object} user - Current user information
 * @returns {Promise<Object>} Result with created lookup
 */
export const createLookup = async (lookupData, user = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Sanitize and validate the lookup data
    const sanitizedData = sanitizeLookup(lookupData)
    const validation = validateLookup(sanitizedData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform data for database
    const dbData = transformToDatabase(sanitizedData, { user, isUpdate: false })

    // Start a transaction
    const { data: headerData, error: headerError } = await supabase
      .from('lookup_headers')
      .insert([dbData.header])
      .select()
      .single()

    if (headerError) {
      console.error('Error creating lookup header:', headerError)
      return {
        success: false,
        error: headerError.message,
        data: null
      }
    }

    // Insert details
    const detailsToInsert = dbData.details.map((detail) => ({
      ...detail,
      header_id: headerData.id
    }))

    const { data: detailsData, error: detailsError } = await supabase
      .from('lookup_details')
      .insert(detailsToInsert)
      .select()

    if (detailsError) {
      // Rollback header creation
      await supabase.from('lookup_headers').delete().eq('id', headerData.id)
      console.error('Error creating lookup details:', detailsError)
      return {
        success: false,
        error: detailsError.message,
        data: null
      }
    }

    const transformedData = transformFromDatabase(headerData, detailsData || [])

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in createLookup:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the lookup',
      data: null
    }
  }
}

/**
 * Update an existing lookup
 * @param {string} id - Lookup header ID
 * @param {Object} lookupData - Updated lookup data
 * @param {Object} user - Current user information
 * @returns {Promise<Object>} Result with updated lookup
 */
export const updateLookup = async (id, lookupData, user = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Lookup ID is required',
        data: null
      }
    }

    // Sanitize and validate the lookup data
    const sanitizedData = sanitizeLookup(lookupData)
    const validation = validateLookup(sanitizedData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform data for database
    const dbData = transformToDatabase(sanitizedData, { user, isUpdate: true })

    // First validate that we can insert the new details before deleting existing ones
    const detailsToInsert = dbData.details.map((detail) => ({
      ...detail,
      header_id: id
    }))

    // Log details for debugging
    console.log('Updating lookup with ID:', id)
    console.log('Details to insert:', detailsToInsert)

    if (detailsToInsert.length === 0) {
      return {
        success: false,
        error: 'At least one valid label-value pair is required',
        data: null
      }
    }

    // Update header first
    const { data: headerData, error: headerError } = await supabase
      .from('lookup_headers')
      .update(dbData.header)
      .eq('id', id)
      .select()
      .single()

    if (headerError) {
      console.error('Error updating lookup header:', headerError)
      return {
        success: false,
        error: headerError.message,
        data: null
      }
    }

    // Get existing details for potential rollback
    const { data: existingDetails } = await supabase.from('lookup_details').select('*').eq('header_id', id)

    console.log('Existing details before update:', existingDetails)

    // Delete existing details
    const { error: deleteError } = await supabase.from('lookup_details').delete().eq('header_id', id)

    if (deleteError) {
      console.error('Error deleting existing lookup details:', deleteError)
      return {
        success: false,
        error: deleteError.message,
        data: null
      }
    }

    // Insert the actual new details
    const { data: detailsData, error: detailsError } = await supabase
      .from('lookup_details')
      .insert(detailsToInsert)
      .select()

    if (detailsError) {
      console.error('Error inserting new lookup details:', detailsError)
      console.error('Details that failed to insert:', JSON.stringify(detailsToInsert, null, 2))

      // Try to restore existing details if possible
      if (existingDetails && existingDetails.length > 0) {
        console.log('Attempting to restore existing details...')

        const restoreDetails = existingDetails.map((detail) => ({
          header_id: detail.header_id,
          label: detail.label,
          value: detail.value,
          sort_order: detail.sort_order,
          created_by: detail.created_by,
          modified_by: detail.modified_by,
          date_created: detail.date_created,
          date_modified: detail.date_modified
        }))

        const { error: restoreError } = await supabase.from('lookup_details').insert(restoreDetails)

        if (restoreError) {
          console.error('Failed to restore existing details:', restoreError)
          return {
            success: false,
            error: `Failed to update lookup and could not restore original data: ${detailsError.message}`,
            data: null
          }
        } else {
          console.log('Successfully restored existing details')
          return {
            success: false,
            error: `Failed to update lookup details: ${detailsError.message}. Original data has been restored.`,
            data: null
          }
        }
      }

      return {
        success: false,
        error: `Failed to update lookup details: ${detailsError.message}`,
        data: null
      }
    }

    console.log('Successfully inserted new details:', detailsData)

    const transformedData = transformFromDatabase(headerData, detailsData || [])

    console.log('Update completed successfully. Transformed data:', transformedData)

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in updateLookup:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating the lookup',
      data: null
    }
  }
}

/**
 * Delete a lookup (header and all its details)
 * @param {string} id - Lookup header ID
 * @returns {Promise<Object>} Result of deletion operation
 */
export const deleteLookup = async (id) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Lookup ID is required',
        data: null
      }
    }

    // Delete header (details will be deleted automatically due to CASCADE)
    const { error } = await supabase.from('lookup_headers').delete().eq('id', id)

    if (error) {
      console.error('Error deleting lookup:', error)
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
    console.error('Unexpected error in deleteLookup:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the lookup',
      data: null
    }
  }
}

/**
 * Update lookup status
 * @param {string} id - Lookup header ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} Result with updated lookup
 */
export const updateLookupStatus = async (id, isActive) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!id) {
      return {
        success: false,
        error: 'Lookup ID is required',
        data: null
      }
    }

    if (typeof isActive !== 'boolean') {
      return {
        success: false,
        error: 'Active status must be a boolean',
        data: null
      }
    }

    const { data, error } = await supabase
      .from('lookup_headers')
      .update({
        is_active: isActive,
        date_modified: new Date().toISOString()
      })
      .eq('id', id)
      .select(
        `
        *,
        lookup_details (
          id,
          label,
          value,
          sort_order,
          created_by,
          modified_by,
          date_created,
          date_modified
        )
      `
      )
      .single()

    if (error) {
      console.error('Error updating lookup status:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const transformedData = transformFromDatabase(data, data.lookup_details || [])

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in updateLookupStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating lookup status',
      data: null
    }
  }
}

/**
 * Search lookups by term
 * @param {string} searchTerm - Search term
 * @returns {Promise<Object>} Result with matching lookups
 */
export const searchLookups = async (searchTerm) => {
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

    const { data, error } = await supabase
      .from('lookup_headers')
      .select(
        `
        *,
        lookup_details (
          id,
          label,
          value,
          sort_order,
          created_by,
          modified_by,
          date_created,
          date_modified
        )
      `
      )
      .or(`category.ilike.%${searchTerm}%`)
      .order('category', { ascending: true })

    if (error) {
      console.error('Error searching lookups:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    const transformedData = data.map((header) => transformFromDatabase(header, header.lookup_details || []))

    return {
      success: true,
      data: transformedData,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in searchLookups:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while searching lookups',
      data: []
    }
  }
}

/**
 * Get lookup statistics
 * @returns {Promise<Object>} Result with statistics
 */
export const getLookupsStats = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.from('lookup_headers').select(`
        id,
        category,
        is_active,
        lookup_details (id)
      `)

    if (error) {
      console.error('Error fetching lookups stats:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    const stats = {
      total: data.length,
      active: data.filter((h) => h.is_active).length,
      inactive: data.filter((h) => !h.is_active).length,
      totalDetails: data.reduce((sum, h) => sum + (h.lookup_details?.length || 0), 0),
      averageDetailsPerCategory: 0
    }

    stats.averageDetailsPerCategory = stats.total > 0 ? Math.round((stats.totalDetails / stats.total) * 100) / 100 : 0

    return {
      success: true,
      data: stats,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in getLookupsStats:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching lookups statistics',
      data: null
    }
  }
}
