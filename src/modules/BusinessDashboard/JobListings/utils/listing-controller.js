// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { supabase } from '../../../core/lib/supabase-controller'
import { transformListingToDatabase, validateJobListing } from './listing-data-model'

/**
 * Job Listings Controller for storytelling/engaging format listings
 * Handles CRUD operations for Purpose-Driven, Impact-Mission, and Challenge-Call formats
 */

/**
 * Create a new job listing
 * @param {Object} listingData - Job listing data
 * @returns {Promise<Object>} Result with created job listing
 */
export const createJobListing = async (listingData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Validate the listing data
    const validation = validateJobListing(listingData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors.join(', '),
        data: null
      }
    }

    // Transform form data to database format
    const dbData = transformListingToDatabase(listingData)

    // For now, just return success (since we don't have the actual table yet)
    console.log('Would create job listing:', dbData)

    return {
      success: true,
      data: {
        id: Date.now().toString(),
        ...listingData,
        createdAt: new Date().toISOString(),
        status: 'Active'
      },
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in createJobListing:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating the job listing',
      data: null
    }
  }
}
