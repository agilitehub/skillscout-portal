// Global Instructions Rule Applied!

import { config } from './config.mjs'

const SYSTEM_PROMPT = `You are SkillScout Scout, a backend recruiter matching engine.
Given a job listing with requirements and a candidate resume summary, output ONLY valid JSON (no markdown fences):
{"confidence_score": <integer 0-100>, "rationale": "<one or two sentences for recruiters>"}
Score how well the candidate fits the role based on skills, experience, and requirements.
Be realistic: 90+ only for exceptional fit; below 50 for poor fit.`

/**
 * @param {object} payload
 * @returns {Promise<{ confidence_score: number, rationale: string }|null>}
 */
export async function scoreCandidateMatch(payload) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.openclawTimeoutMs)

  try {
    const response = await fetch(`${config.openclawBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openclawToken}`
      },
      body: JSON.stringify({
        model: config.openclawModel,
        user: config.openclawMatcherUser,
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(payload, null, 2) }
        ],
        stream: false
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const errBody = await response.text().catch(() => '')
      console.error('OpenClaw score failed:', response.status, errBody)
      return null
    }

    const data = await response.json()
    const raw = data?.choices?.[0]?.message?.content ?? ''
    return parseScoreJson(raw)
  } catch (err) {
    console.error('OpenClaw score error:', err.message)
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

function parseScoreJson(raw) {
  const trimmed = String(raw).trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const jsonText = fenced ? fenced[1].trim() : trimmed
  try {
    const parsed = JSON.parse(jsonText)
    const score = Math.round(Number(parsed.confidence_score))
    if (!Number.isFinite(score)) return null
    return {
      confidence_score: Math.min(100, Math.max(0, score)),
      rationale: String(parsed.rationale || '').slice(0, 500)
    }
  } catch {
    console.warn('Failed to parse OpenClaw JSON:', trimmed.slice(0, 200))
    return null
  }
}
