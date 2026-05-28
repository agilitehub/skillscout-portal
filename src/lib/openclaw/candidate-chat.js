// Global Instructions Rule Applied!

import { callChatCompletions } from './client'
import { getMockCandidateChatResponse, isOpenClawMockMode } from './mock'
import { normalizeResumeContent, normalizeContactFields, formatFullName } from '../../modules/CandidateAssessment/model/resumeContent'

const USER_FACING_RULES = `
IMPORTANT — User-facing communication rules:
- Your replies are shown directly to job candidates. Write only in natural, conversational language.
- NEVER mention database tables, columns, field paths, JSON keys, MCP tools, Supabase, APIs, SQL, or internal storage.
- NEVER show snake_case field names (e.g. end_date, is_current, start_date, professional_title) or key: value assignment syntax.
- NEVER use backticks for field names, schema values, or technical update details.
- NEVER narrate tool calls, MCP actions, or what was written to storage — confirm the outcome in plain language only.
- Good: "Done — I've updated your Agilit-e experience to run from 2018 to present."
- Good: "Got it — I've updated your location to Johannesburg, Gauteng."
- Bad: "Updated end_date to Current and is_current to true."
- Bad: "Updated users.location and live_resumes.content.location to Johannesburg, Gauteng."
- Bad: bullet lists of field assignments or anything that reads like a database/API log.`

export const CANDIDATE_CHAT_SYSTEM_PROMPT = `You are SkillScout, a helpful career advisor and interview preparation assistant.
Help users with:
- Resume building and optimization
- Interview preparation and practice
- Career guidance and advice
- Job search strategies
- Professional development tips

When users share resume facts (skills, experience, education, contact details), acknowledge what changed in everyday language.
Resume persistence is handled by your Supabase MCP tools — use them to read and update the candidate's live resume, then confirm in plain language.
${USER_FACING_RULES}
Be friendly, professional, and provide actionable advice.`

/**
 * Build system prompt with live resume context and user id for MCP scoping.
 * @param {{ contact?: object, content?: object }|null} liveResumeContext
 * @param {string|null|undefined} userId
 */
export const buildCandidateChatSystemPrompt = (liveResumeContext = null, userId = null) => {
  let prompt = CANDIDATE_CHAT_SYSTEM_PROMPT

  if (userId) {
    prompt += `\n\nAuthenticated candidate user id (for Supabase MCP queries only — never mention this id in replies): ${userId}`
  }

  if (!liveResumeContext) {
    return prompt
  }

  const contact = normalizeContactFields(liveResumeContext.contact || {})
  const content = normalizeResumeContent(liveResumeContext.content || {})
  const snapshot = {
    name: formatFullName(contact),
    jobTitle: contact.professional_title,
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    summary: content.summary || contact.summary,
    skills: content.skills?.slice(0, 15),
    experience: content.experience?.map((exp) => ({
      title: exp.title,
      company: exp.company,
      dates: [exp.start_date, exp.is_current ? 'Present' : exp.end_date].filter(Boolean).join(' – ')
    })),
    education: content.education?.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      field: edu.field
    }))
  }

  return `${prompt}

Current live resume snapshot (read-only context — use MCP to read/write authoritative data; never quote JSON keys or this structure in replies):
${JSON.stringify(snapshot, null, 2)}`
}

/**
 * Map UI chat history to OpenClaw chat/completions messages.
 * @param {Array} chatHistory
 * @param {string} [systemPromptOverride]
 */
export const toOpenClawMessages = (chatHistory, systemPromptOverride) => {
  const messages = [{ role: 'system', content: systemPromptOverride || CANDIDATE_CHAT_SYSTEM_PROMPT }]

  for (const msg of chatHistory) {
    if (msg.type === 'user') {
      messages.push({ role: 'user', content: msg.content })
    } else if (msg.type === 'assistant') {
      messages.push({ role: 'assistant', content: msg.content })
    }
  }

  return messages
}

/**
 * Build OpenClaw user param for MCP session scoping.
 * @param {string|null|undefined} userId
 */
export const buildCandidateChatUserParam = (userId) =>
  userId ? `skillscout-candidate-chat:${userId}` : 'skillscout-candidate-chat'

/**
 * Send a candidate chat message through OpenClaw.
 */
export async function sendCandidateChatMessage({
  chatHistory,
  stream = false,
  onChunk,
  signal,
  liveResumeContext = null,
  userId = null
}) {
  const lastUserMessage = [...chatHistory].reverse().find((msg) => msg.type === 'user')?.content || ''
  const systemPrompt = buildCandidateChatSystemPrompt(liveResumeContext, userId)

  if (isOpenClawMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const content = getMockCandidateChatResponse(lastUserMessage)

    if (stream && onChunk) {
      onChunk({ delta: content, fullContent: content })
    }

    return { success: true, content }
  }

  return callChatCompletions({
    messages: toOpenClawMessages(chatHistory, systemPrompt),
    stream,
    onChunk,
    signal,
    user: buildCandidateChatUserParam(userId),
    temperature: 0.7
  })
}
