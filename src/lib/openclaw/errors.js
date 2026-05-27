// Global Instructions Rule Applied!

/**
 * @param {number} status
 * @param {object|null} payload
 * @returns {{ success: false, error: string }}
 */
export const parseOpenClawHttpError = (status, payload) => {
  const detail =
    payload?.error?.message || payload?.error || payload?.message || `OpenClaw request failed (${status})`

  console.error('OpenClaw HTTP error:', status, payload)

  if (status === 401 || status === 403) {
    return {
      success: false,
      error: 'OpenClaw authentication failed. Check REACT_APP_OPENCLAW_GATEWAY_TOKEN and gateway auth settings.'
    }
  }

  return {
    success: false,
    error: typeof detail === 'string' ? detail : 'OpenClaw request failed. Please try again.'
  }
}

/**
 * @param {Error} error
 * @returns {{ success: false, error: string }}
 */
export const mapOpenClawFetchError = (error) => {
  if (error?.name === 'AbortError') {
    return {
      success: false,
      error: 'OpenClaw request timed out. Try again or increase REACT_APP_OPENCLAW_TIMEOUT_MS.'
    }
  }

  console.error('OpenClaw fetch error:', error)

  return {
    success: false,
    error:
      'Cannot reach OpenClaw. Ensure the gateway is running (e.g. openclaw gateway --port 18789) and REACT_APP_OPENCLAW_BASE_URL is correct.'
  }
}
