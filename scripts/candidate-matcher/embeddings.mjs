// Global Instructions Rule Applied!

import { config } from './config.mjs'

/**
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  const input = (text || '').trim()
  if (!input) {
    throw new Error('Cannot embed empty text')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input,
      model: 'text-embedding-3-small'
    })
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    let detail = errText
    try {
      const parsed = JSON.parse(errText)
      detail = parsed?.error?.message || errText
    } catch {
      // keep raw text
    }

    if (response.status === 429 && /quota/i.test(detail)) {
      throw new Error(
        'OpenAI embedding quota exceeded (429). Add billing at https://platform.openai.com/account/billing. ' +
          'Backfill uses one embedding call per live_resume.'
      )
    }

    if (response.status === 401) {
      throw new Error('OpenAI authentication failed (401). Check OPENAI_API_KEY in .env.')
    }

    throw new Error(`OpenAI embeddings failed (${response.status}): ${detail}`)
  }

  const data = await response.json()
  const vector = data?.data?.[0]?.embedding
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error('OpenAI returned an empty embedding vector.')
  }
  return vector
}
