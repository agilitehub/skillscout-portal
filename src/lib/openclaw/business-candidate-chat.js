// Global Instructions Rule Applied!

import { callChatCompletions } from './client'
import { getMockBusinessCandidateChatResponse, isOpenClawMockMode } from './mock'
import { getOpenClawBusinessChatModel } from './config'

const RECRUITER_FACING_RULES = `
IMPORTANT — Recruiter-facing communication rules:
- Write in clear, professional recruiter language.
- NEVER mention JSON keys, snake_case field names, database tables, APIs, or internal system details.
- NEVER speculate beyond what the CV explicitly states.
- If the CV does not contain the answer, say clearly that the CV does not include that information.`

export const BUSINESS_CANDIDATE_CHAT_BASE_PROMPT = `You are SkillScout Recruiter Assistant helping a hiring manager evaluate one specific candidate for one job listing.

STRICT RULES — you must follow these without exception:
- Answer ONLY using information explicitly present in the candidate CV text provided below.
- Do NOT use outside knowledge, web facts, industry assumptions, or information about other people.
- Do NOT discuss other candidates.
- Do NOT invent skills, experience, employers, or qualifications not supported by the CV.
- Match context (job title, match rationale) is for orientation only — it does NOT authorize going beyond the CV.
${RECRUITER_FACING_RULES}`

/**
 * @param {object} context
 * @param {string} context.cvText
 * @param {string} [context.candidateName]
 * @param {string} [context.jobListingTitle]
 * @param {string} [context.rationale]
 */
export const buildBusinessCandidateChatSystemPrompt = (context = {}) => {
  const cvText = String(context.cvText || '').trim()
  const candidateName = context.candidateName || 'this candidate'
  const jobTitle = context.jobListingTitle || 'the role'
  const rationale = context.rationale ? `\nMatch rationale (orientation only): ${context.rationale}` : ''

  return `${BUSINESS_CANDIDATE_CHAT_BASE_PROMPT}

Candidate: ${candidateName}
Job listing: ${jobTitle}${rationale}

Candidate CV (sole source of truth — answer only from this text):
---
${cvText || '(No CV text available)'}
---`
}

export const toBusinessChatMessages = (lastUserMessage, systemPrompt) => [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: lastUserMessage }
]

/**
 * @param {{ candidateName?: string, jobListingTitle?: string }} meta
 */
export const buildBusinessWelcomeMessage = (meta = {}) => {
  const name = meta.candidateName || 'this candidate'
  const job = meta.jobListingTitle || 'this role'

  return {
    id: 'welcome',
    type: 'assistant',
    content: `I can answer questions about ${name}'s CV for the ${job} position. I'll only use what's in their CV — ask about experience, skills, education, or background.`,
    timestamp: new Date().toISOString()
  }
}

/**
 * Send a business recruiter chat message through OpenClaw.
 */
export async function sendBusinessCandidateChatMessage({
  chatHistory,
  stream = false,
  onChunk,
  signal,
  context = null,
  sessionKey = null,
  userId = null
}) {
  const lastUserMessage = [...chatHistory].reverse().find((msg) => msg.type === 'user')?.content || ''
  const systemPrompt = buildBusinessCandidateChatSystemPrompt(context)

  if (isOpenClawMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const content = getMockBusinessCandidateChatResponse(lastUserMessage, context?.cvText)

    if (stream && onChunk) {
      onChunk({ delta: content, fullContent: content })
    }

    return { success: true, content }
  }

  return callChatCompletions({
    messages: toBusinessChatMessages(lastUserMessage, systemPrompt),
    stream,
    onChunk,
    signal,
    user: sessionKey || userId || 'skillscout-business-chat',
    sessionKey,
    model: getOpenClawBusinessChatModel(),
    temperature: 0.3
  })
}
