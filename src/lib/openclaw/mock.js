// Global Instructions Rule Applied!

import { isOpenClawConfigured } from './config'

/** True when mock responses should be used instead of calling OpenClaw. */
export const isOpenClawMockMode = () => {
  if (process.env.REACT_APP_MOCK_AI === 'true') {
    return true
  }
  return !isOpenClawConfigured()
}

/** Mock contact fields for Business Dashboard CV import when OpenClaw is unavailable. */
export const buildMockCvFields = (cvText = '') => {
  const snippet = cvText.slice(0, 80).replace(/\s+/g, ' ').trim()
  return {
    first_name: 'Alex',
    last_name: 'Sample',
    email: 'alex.sample@example.com',
    phone: '+1 555 0100',
    _mockNote: snippet ? `Parsed from: ${snippet}…` : undefined
  }
}
