// Global Instructions Rule Applied!

/**
 * @param {number} status
 * @param {object|null} payload
 * @returns {{ success: false, error: string }}
 */
export const parseHermesHttpError = (status, payload) => {
  const detail =
    payload?.error?.message || payload?.error || payload?.message || `Hermes request failed (${status})`

  console.error('Hermes HTTP error:', status, payload)

  if (status === 401 || status === 403) {
    return {
      success: false,
      error: 'Hermes authentication failed. Check REACT_APP_HERMES_API_KEY matches API_SERVER_KEY.'
    }
  }

  return {
    success: false,
    error: typeof detail === 'string' ? detail : 'Hermes request failed. Please try again.'
  }
}

/**
 * @param {Error} error
 * @returns {{ success: false, error: string }}
 */
export const mapHermesFetchError = (error) => {
  if (error?.name === 'AbortError') {
    return {
      success: false,
      error: 'Hermes request timed out. Try again or increase REACT_APP_HERMES_TIMEOUT_MS.'
    }
  }

  console.error('Hermes fetch error:', error)

  return {
    success: false,
    error:
      'Cannot reach Hermes. Ensure the gateway is running (e.g. hermes gateway) and REACT_APP_HERMES_BASE_URL is correct.'
  }
}
