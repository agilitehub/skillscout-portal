// Global Instructions Rule Applied!

import { randomUUID } from 'crypto'
import { config, assertConfig } from './config.mjs'
import { buildJobRequirementsText, buildResumeSearchText } from './textSummaries.mjs'
import {
  fetchActiveListingsWithOrg,
  fetchJobDescription,
  fetchUser,
  fetchLiveResume,
  matchLiveResumes,
  upsertMatch,
  deleteStaleMatchesForListing,
  indexAllLiveResumes,
  upsertJobDescriptionSearchIndex
} from './supabase.mjs'
import { scoreCandidateMatch } from './openclawScore.mjs'

const args = process.argv.slice(2)
const backfillOnly = args.includes('--backfill-embeddings')
const skipOpenClaw = args.includes('--skip-openclaw')

async function processListing(entry, runId) {
  const { listing, orgId, jobDescriptionId } = entry
  const jd = await fetchJobDescription(jobDescriptionId)
  const requirementsText = buildJobRequirementsText(jd, listing)
  const queryEmbedding = await upsertJobDescriptionSearchIndex({ ...jd, orgId }, { ...listing, orgId })

  const recalled = await matchLiveResumes(
    queryEmbedding,
    config.matcherVectorThreshold,
    config.matcherTopK
  )

  for (const hit of recalled) {
    const candidateUserId = hit.source_id
    const liveResume = await fetchLiveResume(candidateUserId)
    if (!liveResume) continue

    const user = await fetchUser(candidateUserId)
    const resumeText = hit.content || buildResumeSearchText(liveResume.content, user || {})

    let confidenceScore = Math.round((hit.similarity || 0) * 100)
    let rationale = `Vector similarity ${(hit.similarity * 100).toFixed(0)}%`

    if (!skipOpenClaw) {
      const scored = await scoreCandidateMatch({
        job_listing: {
          title: listing.title,
          location: listing.location,
          type: listing.type,
          work_arrangement: listing.work_arrangement
        },
        requirements_summary: requirementsText.slice(0, 4000),
        candidate: {
          name: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email,
          resume_summary: resumeText.slice(0, 4000)
        },
        vector_similarity: hit.similarity
      })

      if (scored) {
        confidenceScore = scored.confidence_score
        rationale = scored.rationale
      }
    }

    if (confidenceScore < config.matcherConfidenceThreshold) continue

    const candidateName =
      [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Candidate'

    await upsertMatch({
      org_id: orgId,
      job_opportunity_id: listing.id,
      job_description_id: jobDescriptionId,
      candidate_user_id: candidateUserId,
      vector_similarity: hit.similarity,
      confidence_score: confidenceScore,
      rationale,
      run_id: runId
    })

    console.log(
      `  Match: ${candidateName} → ${listing.title} (${confidenceScore}%)`
    )
  }

  await deleteStaleMatchesForListing(orgId, listing.id, runId)
}

async function runMatcher() {
  assertConfig({ requireOpenClaw: !skipOpenClaw })
  const runId = randomUUID()
  console.log(`SkillScout candidate matcher run_id=${runId}`)

  const listings = await fetchActiveListingsWithOrg()
  console.log(`Processing ${listings.length} active listing(s)`)

  for (const entry of listings) {
    console.log(`Listing: ${entry.listing.title} (org ${entry.orgId})`)
    try {
      await processListing(entry, runId)
    } catch (err) {
      console.error(`  Failed: ${err.message}`)
    }
  }

  console.log('Matcher run complete.')
}

async function main() {
  try {
    if (backfillOnly) {
      assertConfig({ requireOpenClaw: false })
      const n = await indexAllLiveResumes()
      console.log(`Backfill complete: ${n} live_resumes indexed.`)
      return
    }

    await runMatcher()
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

main()
