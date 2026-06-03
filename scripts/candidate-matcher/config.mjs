// Global Instructions Rule Applied!

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')

/** Load KEY=VALUE lines from a dotenv file (worker runs outside CRA). */
function loadDotEnvFile(filename) {
  const envPath = resolve(ROOT, filename)
  if (!existsSync(envPath)) return
  const text = readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadDotEnvFile('.env')
loadDotEnvFile('.env.local')

/** Node worker must call the gateway directly — not the CRA /openclaw proxy path. */
const normalizeOpenClawBaseUrl = (raw) => {
  const trimmed = (raw || 'http://127.0.0.1:18789/v1').trim().replace(/\/+$/, '')
  if (trimmed === '/openclaw/v1' || trimmed.endsWith('/openclaw/v1')) {
    const target = process.env.REACT_APP_OPENCLAW_PROXY_TARGET || 'http://127.0.0.1:18789'
    return `${target.replace(/\/+$/, '')}/v1`
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return 'http://127.0.0.1:18789/v1'
}

const num = (key, fallback) => {
  const v = Number(process.env[key])
  return Number.isFinite(v) ? v : fallback
}

export const config = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '',
  supabaseServiceKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    '',
  openaiApiKey: process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY || '',
  openclawBaseUrl: normalizeOpenClawBaseUrl(
    process.env.OPENCLAW_BASE_URL || process.env.REACT_APP_OPENCLAW_BASE_URL
  ),
  openclawToken: process.env.OPENCLAW_GATEWAY_TOKEN || process.env.REACT_APP_OPENCLAW_GATEWAY_TOKEN || '',
  openclawModel: process.env.OPENCLAW_MODEL || process.env.REACT_APP_OPENCLAW_MODEL || 'openclaw/default',
  openclawMatcherUser: process.env.OPENCLAW_MATCHER_USER || 'skillscout-scout',
  openclawTimeoutMs: num('OPENCLAW_TIMEOUT_MS', 120000),
  matcherTopK: num('MATCHER_TOP_K', 15),
  matcherVectorThreshold: num('MATCHER_VECTOR_THRESHOLD', 0.65),
  matcherConfidenceThreshold: num('MATCHER_CONFIDENCE_THRESHOLD', 70),
  matcherMaxListingsPerRun: num('MATCHER_MAX_LISTINGS_PER_RUN', 50),
  matcherMinResumeCompleteness: num('MATCHER_MIN_RESUME_COMPLETENESS', 10)
}

export function assertConfig({ requireOpenClaw = true } = {}) {
  const missing = []
  if (!config.supabaseUrl) missing.push('SUPABASE_URL or REACT_APP_SUPABASE_URL')
  if (!config.supabaseServiceKey) {
    missing.push(
      'SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Project Settings → API → service_role secret; add to .env — see .env.example)'
    )
  }

  if (!config.openaiApiKey) {
    missing.push('OPENAI_API_KEY or REACT_APP_OPENAI_API_KEY (embeddings via api.openai.com)')
  }

  if (requireOpenClaw && !config.openclawToken) {
    missing.push('OPENCLAW_GATEWAY_TOKEN or REACT_APP_OPENCLAW_GATEWAY_TOKEN')
  }
  if (missing.length) {
    throw new Error(`Missing env: ${missing.join(', ')}`)
  }
}
