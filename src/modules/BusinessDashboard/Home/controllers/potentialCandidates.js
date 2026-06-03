// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { supabase } from '../../../../core/infra/supabase-controller'

/**
 * Fetch potential candidate matches for the user's organization.
 * @param {string} orgId
 * @returns {Promise<{ success: boolean, data: object[], error: string|null }>}
 */
export async function fetchPotentialCandidates(orgId) {
  try {
    if (!supabase) {
      return { success: false, data: [], error: 'Database not available' }
    }

    if (!orgId) {
      return { success: false, data: [], error: 'Organization not found' }
    }

    const { data, error } = await supabase
      .from('potential_candidate_matches')
      .select(
        `
        id,
        org_id,
        job_opportunity_id,
        job_description_id,
        candidate_user_id,
        vector_similarity,
        confidence_score,
        rationale,
        updated_at,
        job_opportunity:job_opportunities ( id, title, location, status ),
        candidate:users!candidate_user_id (
          id,
          first_name,
          last_name,
          email,
          professional_title
        )
      `
      )
      .eq('org_id', orgId)
      .order('confidence_score', { ascending: false })
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('fetchPotentialCandidates:', error)
      return { success: false, data: [], error: error.message }
    }

    const rows = (data || []).map((row) => {
      const candidate = row.candidate || {}
      const listing = row.job_opportunity || {}
      const name =
        [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') ||
        candidate.email ||
        'Candidate'

      return {
        id: row.id,
        jobOpportunityId: row.job_opportunity_id,
        jobListingTitle: listing.title || 'Job listing',
        jobListingLocation: listing.location,
        candidateUserId: row.candidate_user_id,
        candidateName: name,
        candidateTitle: candidate.professional_title,
        confidenceScore: row.confidence_score,
        vectorSimilarity: row.vector_similarity,
        rationale: row.rationale,
        updatedAt: row.updated_at
      }
    })

    return { success: true, data: rows, error: null }
  } catch (err) {
    console.error('fetchPotentialCandidates unexpected:', err)
    return { success: false, data: [], error: 'Failed to load potential candidates' }
  }
}
