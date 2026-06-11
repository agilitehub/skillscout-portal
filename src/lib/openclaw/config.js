// Global Instructions Rule Applied!

/**
 * OpenClaw Gateway (OpenAI-compatible HTTP) configuration for local/shared deployments.
 * @see https://docs.openclaw.ai/gateway/openai-http-api
 */

let memoizedConfig = null

const DEV_PROXY_BASE = '/openclaw/v1'

/** In dev, direct localhost:18789 calls cause CORS — use the CRA proxy path instead. */
const normalizeBaseUrl = (raw) => {
  const trimmed = (raw || DEV_PROXY_BASE).trim().replace(/\/+$/, '')
  const isDev = process.env.NODE_ENV === 'development'
  const looksLikeLocalGateway =
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/v1$/i.test(trimmed) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):18789\/v1$/i.test(trimmed)

  if (isDev && looksLikeLocalGateway) {
    console.info(
      '[OpenClaw] Using dev proxy base "/openclaw/v1" instead of',
      trimmed,
      '(avoids browser CORS). OpenClaw must still run on',
      process.env.REACT_APP_OPENCLAW_PROXY_TARGET || 'http://127.0.0.1:18789'
    )
    return DEV_PROXY_BASE
  }

  return trimmed
}

const DEFAULT_BUSINESS_CHAT_MODEL = 'openclaw/skillscout-recruiter'

/**
 * @returns {{
 *   baseUrl: string,
 *   token: string,
 *   model: string,
 *   businessChatModel: string,
 *   timeoutMs: number
 * }}
 */
export const getOpenClawConfig = () => {
  if (memoizedConfig) {
    return memoizedConfig
  }

  const baseUrl = normalizeBaseUrl(process.env.REACT_APP_OPENCLAW_BASE_URL)
  const token = (process.env.REACT_APP_OPENCLAW_GATEWAY_TOKEN || '').trim()
  const model = (process.env.REACT_APP_OPENCLAW_MODEL || 'openclaw/default').trim()
  const businessChatModel = (
    process.env.REACT_APP_OPENCLAW_BUSINESS_CHAT_MODEL || DEFAULT_BUSINESS_CHAT_MODEL
  ).trim()
  const timeoutMs = Number(process.env.REACT_APP_OPENCLAW_TIMEOUT_MS || 120000)

  memoizedConfig = {
    baseUrl,
    token,
    model,
    businessChatModel,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 120000
  }

  return memoizedConfig
}

/** Dedicated OpenClaw agent for Business Dashboard recruiter CV chat. */
export const getOpenClawBusinessChatModel = () => getOpenClawConfig().businessChatModel

/** Gateway root for session APIs (history lives outside /v1). */
export const getOpenClawGatewayRoot = () => {
  const { baseUrl } = getOpenClawConfig()
  if (baseUrl.endsWith('/v1')) {
    return baseUrl.slice(0, -3)
  }
  return baseUrl.replace(/\/+$/, '')
}

export const isOpenClawConfigured = () => {
  const { baseUrl } = getOpenClawConfig()
  return Boolean(baseUrl?.trim())
}
