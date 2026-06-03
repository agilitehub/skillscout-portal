// Global Instructions Rule Applied!

/**
 * Hermes Agent API server configuration (Personal Dashboard / candidate chat).
 * @see https://docs.hermes-agent.dev (OpenAI-compatible /v1 + /api/sessions)
 */

let memoizedConfig = null

const DEV_PROXY_BASE = '/hermes'

/** In dev, direct localhost:8642 calls may hit CORS — use the CRA proxy path instead. */
const normalizeBaseUrl = (raw) => {
  let trimmed = (raw || DEV_PROXY_BASE).trim().replace(/\/+$/, '')
  trimmed = trimmed.replace(/\/v1$/i, '')
  const isDev = process.env.NODE_ENV === 'development'
  const looksLikeLocalHermes =
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimmed) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):8642$/i.test(trimmed)

  if (isDev && looksLikeLocalHermes) {
    console.info(
      '[Hermes] Using dev proxy base "/hermes" instead of',
      trimmed,
      '(avoids browser CORS). Hermes must still run on',
      process.env.REACT_APP_HERMES_PROXY_TARGET || 'http://127.0.0.1:8642'
    )
    return DEV_PROXY_BASE
  }

  return trimmed
}

/**
 * @returns {{
 *   baseUrl: string,
 *   token: string,
 *   model: string,
 *   timeoutMs: number
 * }}
 */
export const getHermesConfig = () => {
  if (memoizedConfig) {
    return memoizedConfig
  }

  const baseUrl = normalizeBaseUrl(process.env.REACT_APP_HERMES_BASE_URL)
  const token = (process.env.REACT_APP_HERMES_API_KEY || '').trim()
  const model = (process.env.REACT_APP_HERMES_MODEL || 'hermes-agent').trim()
  const timeoutMs = Number(process.env.REACT_APP_HERMES_TIMEOUT_MS || 120000)

  memoizedConfig = {
    baseUrl,
    token,
    model,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 120000
  }

  return memoizedConfig
}

export const isHermesConfigured = () => {
  const { baseUrl, token } = getHermesConfig()
  return Boolean(baseUrl?.trim() && token)
}
