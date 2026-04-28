// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { supabase } from '../../../../core/lib/supabase-controller'

/**
 * Dashboard Controller
 * Handles dashboard statistics and metrics
 */

/**
 * Fetch the total number of job opportunities, job descriptions,
 * and active questionnaires from Supabase.
 *
 * @returns {Promise<{ listingCount: number; descriptionCount: number; questionnaireCount: number }>}
 */
export async function getDashboardStats() {
  try {
    if (!supabase) {
      console.error('Dashboard Controller: Supabase client not initialized')
      return {
        listingCount: 0,
        descriptionCount: 0,
        questionnaireCount: 0
      }
    }

    // Fire off all three count queries in parallel
    const [
      { count: listingCount, error: listingError },
      { count: descriptionCount, error: descriptionError },
      { count: questionnaireCount, error: questionnaireError }
    ] = await Promise.all([
      supabase.from('job_opportunities').select('id', { count: 'exact', head: true }),
      supabase.from('job_descriptions').select('id', { count: 'exact', head: true }),
      supabase.from('questionnaires').select('id', { count: 'exact', head: true }).eq('is_active', true)
    ])

    // Check for errors on each
    if (listingError) {
      console.error('Dashboard Controller: Failed to count job_opportunities:', listingError)
      throw new Error(`Failed to count job_opportunities: ${listingError.message}`)
    }
    if (descriptionError) {
      console.error('Dashboard Controller: Failed to count job_descriptions:', descriptionError)
      throw new Error(`Failed to count job_descriptions: ${descriptionError.message}`)
    }
    if (questionnaireError) {
      console.error('Dashboard Controller: Failed to count active questionnaires:', questionnaireError)
      throw new Error(`Failed to count active questionnaires: ${questionnaireError.message}`)
    }

    // All good—return the counts (they're numbers or null if table empty)
    return {
      listingCount: listingCount ?? 0,
      descriptionCount: descriptionCount ?? 0,
      questionnaireCount: questionnaireCount ?? 0
    }
  } catch (err) {
    // Centralized error handling
    console.error('Dashboard Controller: Error fetching dashboard stats:', err)
    // Decide whether to rethrow or return defaults; here we return zeros
    return {
      listingCount: 0,
      descriptionCount: 0,
      questionnaireCount: 0
    }
  }
}
