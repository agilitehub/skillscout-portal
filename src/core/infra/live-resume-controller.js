// Global Instructions Rule Applied!

import { supabase } from '../auth/client'
import { ensureUserRecord } from '../auth/userLifecycle'
import {
  normalizeResumeContent,
  normalizeContactFields,
  createEmptyResumeContent
} from '../../modules/CandidateAssessment/model/resumeContent'
import { computeCompletenessScore, mergeContactFields } from '../../modules/CandidateAssessment/model/mergeLiveResume'

const USER_PROFILE_COLUMNS =
  'id, email, first_name, middle_name, last_name, phone, location, professional_title, summary, avatar_url, org_id, status, created_at'

export const getUserContactProfile = async (userId) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }
    await ensureUserRecord(userId)

    const { data, error } = await supabase
      .from('users')
      .select(USER_PROFILE_COLUMNS)
      .eq('id', userId)
      .neq('trashed', true)
      .maybeSingle()

    if (error) return { success: false, error: error.message }
    return { success: true, data: data || null }
  } catch (error) {
    console.error('getUserContactProfile error:', error)
    return { success: false, error: 'Failed to fetch user profile' }
  }
}

export const updateUserContactFields = async (userId, fields, options = { fillEmptyOnly: false }) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }
    await ensureUserRecord(userId)

    let updatePayload = {}

    if (options.fillEmptyOnly) {
      const existing = await getUserContactProfile(userId)
      if (!existing.success) return existing
      const merged = mergeContactFields(existing.data || {}, fields)
      updatePayload = {
        first_name: merged.first_name || null,
        middle_name: merged.middle_name || null,
        last_name: merged.last_name || null,
        phone: merged.phone || null,
        location: merged.location || null,
        professional_title: merged.professional_title || null,
        summary: merged.summary || null
      }
    } else {
      const normalized = normalizeContactFields(fields)
      if (normalized.first_name) updatePayload.first_name = normalized.first_name
      if (normalized.middle_name) updatePayload.middle_name = normalized.middle_name
      if (normalized.last_name) updatePayload.last_name = normalized.last_name
      if (normalized.phone) updatePayload.phone = normalized.phone
      if (normalized.location) updatePayload.location = normalized.location
      if (normalized.professional_title) updatePayload.professional_title = normalized.professional_title
      if (normalized.summary) updatePayload.summary = normalized.summary
    }

    if (Object.keys(updatePayload).length === 0) {
      return { success: true, data: null }
    }

    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', userId)
      .select(USER_PROFILE_COLUMNS)
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('updateUserContactFields error:', error)
    return { success: false, error: 'Failed to update user contact fields' }
  }
}

export const getLiveResume = async (userId) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const { data, error } = await supabase.from('live_resumes').select('*').eq('user_id', userId).maybeSingle()

    if (error) return { success: false, error: error.message }
    return { success: true, data: data || null }
  } catch (error) {
    console.error('getLiveResume error:', error)
    return { success: false, error: 'Failed to fetch live resume' }
  }
}

export const upsertLiveResume = async (userId, content, meta = {}) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const normalizedContent = normalizeResumeContent(content)
    const contactResult = await getUserContactProfile(userId)
    const contact = contactResult.data || {}
    const completenessScore = computeCompletenessScore(contact, normalizedContent)

    const payload = {
      user_id: userId,
      content: normalizedContent,
      completeness_score: completenessScore,
      modified_at: new Date().toISOString()
    }

    if (meta.primarySourceId !== undefined) payload.primary_source_id = meta.primarySourceId
    if (meta.lastMergedAt) payload.last_merged_at = meta.lastMergedAt
    if (meta.lastChatUpdateAt) payload.last_chat_update_at = meta.lastChatUpdateAt

    const { data, error } = await supabase
      .from('live_resumes')
      .upsert(payload, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('upsertLiveResume error:', error)
    return { success: false, error: 'Failed to save live resume' }
  }
}

export const listUserDataSources = async (userId) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const { data, error } = await supabase
      .from('user_data_sources')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'archived')
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('listUserDataSources error:', error)
    return { success: false, error: 'Failed to list data sources' }
  }
}

export const listUserResumes = async (userId) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('listUserResumes error:', error)
    return { success: false, error: 'Failed to list resumes' }
  }
}

export const createDataSource = async (userId, sourceData) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const { data, error } = await supabase
      .from('user_data_sources')
      .insert({
        user_id: userId,
        source_type: sourceData.source_type,
        label: sourceData.label || null,
        external_ref: sourceData.external_ref || null,
        metadata: sourceData.metadata || {},
        is_primary: sourceData.is_primary ?? false,
        status: sourceData.status || 'processing'
      })
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('createDataSource error:', error)
    return { success: false, error: 'Failed to create data source' }
  }
}

export const updateDataSource = async (sourceId, updates) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const { data, error } = await supabase
      .from('user_data_sources')
      .update({ ...updates, modified_at: new Date().toISOString() })
      .eq('id', sourceId)
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('updateDataSource error:', error)
    return { success: false, error: 'Failed to update data source' }
  }
}

export const setPrimaryDataSource = async (userId, sourceId) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    await supabase.from('user_data_sources').update({ is_primary: false }).eq('user_id', userId)

    const { data, error } = await supabase
      .from('user_data_sources')
      .update({ is_primary: true, modified_at: new Date().toISOString() })
      .eq('id', sourceId)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('setPrimaryDataSource error:', error)
    return { success: false, error: 'Failed to set primary data source' }
  }
}

export const createResumeRecord = async (resumeData) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: resumeData.user_id,
        data_source_id: resumeData.data_source_id,
        storage_path: resumeData.storage_path,
        original_filename: resumeData.original_filename,
        raw_text: resumeData.raw_text,
        content: normalizeResumeContent(resumeData.content || createEmptyResumeContent()),
        parse_status: resumeData.parse_status || 'processing',
        parse_error: resumeData.parse_error || null,
        parsed_at: resumeData.parsed_at || null
      })
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('createResumeRecord error:', error)
    return { success: false, error: 'Failed to create resume record' }
  }
}

export const updateResumeRecord = async (resumeId, updates) => {
  try {
    if (!supabase) return { success: false, error: 'Supabase client not initialized' }

    const payload = { ...updates, modified_at: new Date().toISOString() }
    if (updates.content) payload.content = normalizeResumeContent(updates.content)

    const { data, error } = await supabase.from('resumes').update(payload).eq('id', resumeId).select('*').single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (error) {
    console.error('updateResumeRecord error:', error)
    return { success: false, error: 'Failed to update resume record' }
  }
}

export const ensureChatDataSource = async (userId) => {
  const sources = await listUserDataSources(userId)
  if (!sources.success) return sources

  const existing = sources.data.find((s) => s.source_type === 'chat')
  if (existing) return { success: true, data: existing }

  return createDataSource(userId, {
    source_type: 'chat',
    label: 'Chat updates',
    status: 'active',
    is_primary: false
  })
}

export const getLiveResumeBundle = async (userId) => {
  const [contactResult, liveResult, sourcesResult, resumesResult] = await Promise.all([
    getUserContactProfile(userId),
    getLiveResume(userId),
    listUserDataSources(userId),
    listUserResumes(userId)
  ])

  if (!contactResult.success) return contactResult

  return {
    success: true,
    data: {
      contact: contactResult.data,
      liveResume: liveResult.data,
      dataSources: sourcesResult.success ? sourcesResult.data : [],
      resumes: resumesResult.success ? resumesResult.data : []
    }
  }
}
