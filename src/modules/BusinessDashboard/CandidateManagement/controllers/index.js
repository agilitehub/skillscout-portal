// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { getCurrentUser } from '../../../../core/auth'
import {
  supabase,
  getUserOrganization,
  uploadFileToStorage,
  deleteFileFromStorage
} from '../../../../core/infra/supabase-controller'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../../../constants'
import {
  transformFromDatabase,
  transformDraftToDatabase,
  validateDraftForSubmit,
  getSubmittableDrafts
} from '../model'

/**
 * @returns {Promise<{ orgId: string, userId: string }>}
 */
export async function getCandidateManagementContext() {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const currentUser = await getCurrentUser()
  if (!currentUser.success || !currentUser.user) {
    throw new Error('User not authenticated')
  }

  const userOrgData = await getUserOrganization(currentUser.user.id)
  if (!userOrgData.success || !userOrgData.data?.organization?.id) {
    throw new Error('User organization not found')
  }

  return {
    orgId: userOrgData.data.organization.id,
    userId: currentUser.user.id
  }
}

/**
 * @returns {Promise<{ success: boolean, data: object[], error?: string }>}
 */
export async function getOrganizationCandidates() {
  try {
    const { orgId } = await getCandidateManagementContext()

    const { data, error } = await supabase
      .from('organization_candidates')
      .select('*')
      .eq('org_id', orgId)
      .order('date_created', { ascending: false })

    if (error) {
      console.error('getOrganizationCandidates error:', error)
      return { success: false, data: [], error: error.message || 'Failed to load candidates' }
    }

    return {
      success: true,
      data: (data || []).map(transformFromDatabase),
      error: null
    }
  } catch (error) {
    console.error('getOrganizationCandidates unexpected error:', error)
    return {
      success: false,
      data: [],
      error: error.message || 'Failed to load candidates'
    }
  }
}

/**
 * @param {import('../model').DraftCandidate[]} drafts
 * @returns {Promise<{ success: boolean, created: object[], failed: { draft: import('../model').DraftCandidate, error: string }[], error?: string }>}
 */
export async function submitCandidates(drafts) {
  try {
    const { orgId, userId } = await getCandidateManagementContext()
    const submittable = getSubmittableDrafts(drafts)

    if (submittable.length === 0) {
      return {
        success: false,
        created: [],
        failed: [],
        error: 'No valid candidates to create. Ensure each row has a name and a CV file.'
      }
    }

    const created = []
    const failed = []

    for (const draft of submittable) {
      const validation = validateDraftForSubmit(draft)
      if (!validation.valid) {
        failed.push({ draft, error: validation.error || 'Invalid draft' })
        continue
      }

      try {
        const uploadResult = await uploadFileToStorage(draft.file, userId)
        if (!uploadResult.success) {
          failed.push({ draft, error: uploadResult.error || 'CV upload failed' })
          continue
        }

        const row = transformDraftToDatabase(draft, {
          orgId,
          userId,
          cvStoragePath: uploadResult.data?.path || null
        })

        const { data: inserted, error: insertError } = await supabase
          .from('organization_candidates')
          .insert(row)
          .select('*')
          .single()

        if (insertError) {
          console.error('submitCandidates insert error:', insertError)
          failed.push({ draft, error: insertError.message || 'Failed to save candidate' })
          continue
        }

        created.push(transformFromDatabase(inserted))
      } catch (itemError) {
        console.error('submitCandidates item error:', itemError)
        failed.push({ draft, error: itemError.message || 'Failed to create candidate' })
      }
    }

    return {
      success: created.length > 0,
      created,
      failed,
      error: created.length === 0 ? 'No candidates were created' : null
    }
  } catch (error) {
    console.error('submitCandidates unexpected error:', error)
    return {
      success: false,
      created: [],
      failed: [],
      error: error.message || 'Failed to submit candidates'
    }
  }
}

/**
 * Delete a candidate for the current organization (and optional CV file in storage).
 * @param {string} candidateId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteOrganizationCandidate(candidateId) {
  try {
    if (!candidateId) {
      return { success: false, error: 'Candidate ID is required' }
    }

    const { orgId } = await getCandidateManagementContext()

    const { data: existing, error: fetchError } = await supabase
      .from('organization_candidates')
      .select('id, org_id, cv_storage_path')
      .eq('id', candidateId)
      .eq('org_id', orgId)
      .maybeSingle()

    if (fetchError) {
      console.error('deleteOrganizationCandidate fetch error:', fetchError)
      return { success: false, error: fetchError.message || 'Failed to verify candidate' }
    }

    if (!existing) {
      return { success: false, error: 'Candidate not found or you do not have permission to delete it' }
    }

    if (existing.cv_storage_path) {
      const storageResult = await deleteFileFromStorage(
        existing.cv_storage_path,
        DEFAULT_SUPABASE_STORAGE_BUCKET
      )
      if (!storageResult.success) {
        console.warn('deleteOrganizationCandidate: CV file removal failed:', storageResult.error)
      }
    }

    const { error: deleteError } = await supabase
      .from('organization_candidates')
      .delete()
      .eq('id', candidateId)
      .eq('org_id', orgId)

    if (deleteError) {
      console.error('deleteOrganizationCandidate error:', deleteError)
      return { success: false, error: deleteError.message || 'Failed to delete candidate' }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('deleteOrganizationCandidate unexpected error:', error)
    return { success: false, error: error.message || 'Failed to delete candidate' }
  }
}
