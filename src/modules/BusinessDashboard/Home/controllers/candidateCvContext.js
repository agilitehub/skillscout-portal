// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { supabase } from '../../../../core/infra/supabase-controller'
import { buildResumeSearchText } from '../../../../lib/resume/resumeSearchText'

/**
 * Fetch org-gated CV context for a potential candidate match row.
 * @param {string} matchId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function fetchMatchedCandidateCvContext(matchId) {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not available' }
    }

    if (!matchId) {
      return { success: false, error: 'Match id is required' }
    }

    const { data, error } = await supabase.rpc('get_matched_candidate_cv_context', {
      p_match_id: matchId
    })

    if (error) {
      console.error('fetchMatchedCandidateCvContext:', error)
      return { success: false, error: error.message || 'Failed to load candidate CV' }
    }

    const payload = typeof data === 'string' ? JSON.parse(data) : data

    if (!payload?.success) {
      return {
        success: false,
        error: payload?.error || 'Candidate CV is not available'
      }
    }

    const contact = payload.contact || {}
    const cvText = buildResumeSearchText(payload.resumeContent, {
      first_name: contact.first_name,
      last_name: contact.last_name,
      professional_title: contact.professional_title,
      email: contact.email
    })

    return {
      success: true,
      data: {
        matchId: payload.matchId,
        orgId: payload.orgId,
        jobOpportunityId: payload.jobOpportunityId,
        candidateUserId: payload.candidateUserId,
        candidateName: payload.candidateName,
        candidateTitle: payload.candidateTitle,
        jobListingTitle: payload.jobListingTitle,
        jobListingLocation: payload.jobListingLocation,
        confidenceScore: payload.confidenceScore,
        rationale: payload.rationale,
        resumeContent: payload.resumeContent,
        contact,
        cvText
      }
    }
  } catch (err) {
    console.error('fetchMatchedCandidateCvContext unexpected:', err)
    return { success: false, error: 'Failed to load candidate CV' }
  }
}
