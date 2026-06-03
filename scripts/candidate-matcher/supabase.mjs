// Global Instructions Rule Applied!

import { createClient } from '@supabase/supabase-js'
import { config } from './config.mjs'
import { generateEmbedding } from './embeddings.mjs'
import { buildJobRequirementsText, buildResumeSearchText } from './textSummaries.mjs'

let client = null

export function getSupabase() {
  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  }
  return client
}

/**
 * Active job listings with JD and org_id from listing owner.
 */
export async function fetchActiveListingsWithOrg() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('job_opportunities')
    .select(
      `
      id,
      title,
      location,
      type,
      work_arrangement,
      description,
      status,
      job_description,
      created_by,
      creator:users!job_opportunities_created_by_fkey ( org_id )
    `
    )
    .eq('status', 'Active')
    .order('created_at', { ascending: false })
    .limit(config.matcherMaxListingsPerRun)

  if (error) {
    return fetchActiveListingsWithOrgFallback()
  }

  const rows = []
  for (const row of data || []) {
    const orgId = row.creator?.org_id
    if (!orgId || !row.job_description) continue
    rows.push({
      listing: row,
      orgId,
      jobDescriptionId: row.job_description
    })
  }
  return rows.length ? rows : fetchActiveListingsWithOrgFallback()
}

/** Fallback when PostgREST embed on created_by is unavailable. */
async function fetchActiveListingsWithOrgFallback() {
  const supabase = getSupabase()
  const { data: listings, error } = await supabase
    .from('job_opportunities')
    .select('id, title, location, type, work_arrangement, description, status, job_description, created_by')
    .eq('status', 'Active')
    .order('created_at', { ascending: false })
    .limit(config.matcherMaxListingsPerRun)

  if (error) throw new Error(`fetch listings fallback: ${error.message}`)

  const creatorIds = [...new Set((listings || []).map((l) => l.created_by).filter(Boolean))]
  const orgByUser = new Map()

  if (creatorIds.length) {
    const { data: users, error: userErr } = await supabase
      .from('users')
      .select('id, org_id')
      .in('id', creatorIds)
    if (userErr) throw new Error(`fetch listing owners: ${userErr.message}`)
    for (const u of users || []) {
      if (u.org_id) orgByUser.set(u.id, u.org_id)
    }
  }

  const rows = []
  for (const listing of listings || []) {
    const orgId = orgByUser.get(listing.created_by)
    if (!orgId || !listing.job_description) continue
    rows.push({ listing, orgId, jobDescriptionId: listing.job_description })
  }
  return rows
}

export async function fetchJobDescription(id) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('job_descriptions').select('*').eq('id', id).single()
  if (error) throw new Error(`fetch job_description ${id}: ${error.message}`)
  return data
}

export async function fetchUser(userId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, professional_title, summary')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function fetchLiveResume(userId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('live_resumes')
    .select('user_id, content, completeness_score')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return null
  return data
}

/**
 * @param {number[]} embedding
 */
export async function matchLiveResumes(embedding, threshold, count) {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('match_live_resumes_for_embedding', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: count
  })
  if (error) throw new Error(`match_live_resumes: ${error.message}`)
  return data || []
}

export async function upsertSearchIndexLiveResume(userId, title, content, metadata, embedding) {
  const supabase = getSupabase()
  const row = {
    source_table: 'live_resumes',
    source_id: userId,
    title,
    content,
    metadata,
    embedding
  }

  const { error } = await supabase.from('search_index').upsert(row, {
    onConflict: 'source_table,source_id'
  })

  if (error) {
    const { error: err2 } = await supabase.from('search_index').delete().eq('source_table', 'live_resumes').eq('source_id', userId)
    if (err2) throw new Error(`search_index delete before insert: ${err2.message}`)
    const { error: err3 } = await supabase.from('search_index').insert(row)
    if (err3) throw new Error(`search_index insert: ${err3.message}`)
  }
}

export async function upsertJobDescriptionSearchIndex(jd, listing) {
  const text = buildJobRequirementsText(jd, listing)
  const embedding = await generateEmbedding(text)
  const supabase = getSupabase()
  const row = {
    source_table: 'job_descriptions',
    source_id: jd.id,
    title: jd.title || listing?.title,
    content: text.slice(0, 8000),
    metadata: { job_opportunity_id: listing?.id, org_id: listing?.orgId },
    embedding
  }
  const { error } = await supabase.from('search_index').upsert(row, { onConflict: 'source_table,source_id' })
  if (error) console.warn('job_descriptions search_index upsert:', error.message)
  return embedding
}

export async function indexAllLiveResumes() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('live_resumes')
    .select('user_id, content, completeness_score')
    .gte('completeness_score', config.matcherMinResumeCompleteness)

  if (error) throw new Error(`fetch live_resumes: ${error.message}`)

  let indexed = 0
  for (const lr of data || []) {
    const user = await fetchUser(lr.user_id)
    const text = buildResumeSearchText(lr.content, user || {})
    if (!text.trim()) continue
    const embedding = await generateEmbedding(text)
    const title =
      [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
      user?.email ||
      `Candidate ${lr.user_id}`
    await upsertSearchIndexLiveResume(lr.user_id, title, text.slice(0, 8000), { completeness_score: lr.completeness_score }, embedding)
    indexed += 1
    console.log(`Indexed live_resume ${lr.user_id}`)
  }
  return indexed
}

export async function upsertMatch(row) {
  const supabase = getSupabase()
  const { error } = await supabase.from('potential_candidate_matches').upsert(
    { ...row, updated_at: new Date().toISOString() },
    { onConflict: 'org_id,job_opportunity_id,candidate_user_id' }
  )
  if (error) throw new Error(`upsert match: ${error.message}`)
}

/** Remove matches from prior runs for this listing. */
export async function deleteStaleMatchesForListing(orgId, jobOpportunityId, runId) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('potential_candidate_matches')
    .delete()
    .eq('org_id', orgId)
    .eq('job_opportunity_id', jobOpportunityId)
    .neq('run_id', runId)

  if (error) console.warn('delete stale matches:', error.message)
}
