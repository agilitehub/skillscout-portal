// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { BRAND_COLORS, LIGHT_THEME, DARK_THEME } from '../../theme/colors'

export const mergeModalStyles = (base, overrides) => {
  if (!overrides) return base
  const keys = new Set([...Object.keys(base), ...Object.keys(overrides)])
  const out = {}
  keys.forEach((k) => {
    out[k] = { ...(base[k] || {}), ...(overrides[k] || {}) }
  })
  return out
}

/**
 * Default Ant Design Modal `styles` map for light/dark using theme tokens.
 */
export const getDefaultThemedModalStyles = (darkMode) => {
  if (darkMode) {
    return {
      content: {
        backgroundColor: BRAND_COLORS.darkSlateAlt,
        color: BRAND_COLORS.white
      },
      body: {
        backgroundColor: BRAND_COLORS.darkSlateAlt,
        color: BRAND_COLORS.white
      },
      header: {
        backgroundColor: BRAND_COLORS.darkSlateAlt,
        borderBottom: `1px solid ${DARK_THEME.border.primary}`
      },
      footer: {
        backgroundColor: BRAND_COLORS.darkSlateAlt,
        borderTop: `1px solid ${DARK_THEME.border.primary}`
      },
      mask: {}
    }
  }
  return {
    content: {
      backgroundColor: LIGHT_THEME.background.primary,
      color: BRAND_COLORS.darkGray
    },
    body: {
      backgroundColor: LIGHT_THEME.background.primary,
      color: BRAND_COLORS.darkGray
    },
    header: {
      backgroundColor: LIGHT_THEME.background.primary,
      borderBottom: `1px solid ${LIGHT_THEME.border.primary}`
    },
    footer: {
      backgroundColor: LIGHT_THEME.background.primary,
      borderTop: `1px solid ${LIGHT_THEME.border.primary}`
    },
    mask: {}
  }
}

export const defaultThemedMaskStyle = (darkMode, { blur = false } = {}) => ({
  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  ...(blur ? { backdropFilter: 'blur(4px)' } : {})
})
