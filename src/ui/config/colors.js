// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Centralized color configuration for the entire application
 * This serves as a single source of truth for all color-related styling
 * Organized by brand colors, semantic colors, and theme-specific variants
 */

// Primary brand colors
export const BRAND_COLORS = {
  // Primary blue palette
  shakespeare: '#3FB1D4',     // Medium blue - primary brand color
  pictonBlue: '#1EC9EA',      // Light blue - accent
  toreaBay: '#134292',        // Dark blue - strong accent
  blueAccent: '#2C5282',      // Blue accent
  blueHighlight: '#3182CE',   // Blue highlight
  darkBlue: '#0E4173',        // Dark blue for dark mode
  
  // Navy palette for dark mode
  navyDark: '#0A1929',        // Very dark navy
  navyMedium: '#112240',      // Medium navy
  navyLight: '#1A365D',       // Light navy
  darkTeal: '#205E6B',        // Dark teal for dark mode
  
  // Gold/amber palette
  logoGoldAccent: '#DCAC55',  // Gold accent
  diSerria: '#DCAA55',        // Golden brown
  gamboge: '#E1A00E',         // Orange/gold
  
  // Supporting colors
  botticelli: '#C4D8E5',     // Light gray blue
  viking: '#4DC7DC',         // Turquoise
}

// Semantic color assignments
export const SEMANTIC_COLORS = {
  primary: BRAND_COLORS.shakespeare,
  primaryDark: BRAND_COLORS.darkBlue,
  secondary: BRAND_COLORS.diSerria,
  secondaryDark: BRAND_COLORS.logoGoldAccent,
  accent: BRAND_COLORS.pictonBlue,
  accentDark: BRAND_COLORS.blueAccent,
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: BRAND_COLORS.shakespeare,
}

// Theme-specific color schemes
export const LIGHT_THEME = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  border: {
    primary: '#E5E7EB',
    secondary: '#D1D5DB',
    tertiary: '#F3F4F6',
  },
  gradient: {
    primary: `linear-gradient(90deg, ${BRAND_COLORS.shakespeare} 85%, ${BRAND_COLORS.diSerria})`,
    secondary: `linear-gradient(135deg, ${BRAND_COLORS.shakespeare}, ${BRAND_COLORS.pictonBlue})`,
  }
}

export const DARK_THEME = {
  background: {
    primary: '#111827',
    secondary: '#1F2937',
    tertiary: '#374151',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    tertiary: '#D1D5DB',
  },
  border: {
    primary: '#374151',
    secondary: '#4B5563',
    tertiary: '#6B7280',
  },
  gradient: {
    primary: `linear-gradient(90deg, ${BRAND_COLORS.blueAccent} 85%, ${BRAND_COLORS.logoGoldAccent})`,
    secondary: `linear-gradient(135deg, ${BRAND_COLORS.darkBlue}, ${BRAND_COLORS.logoGoldAccent})`,
  }
}

// Utility function to get theme-specific colors
export const getThemeColors = (isDarkMode = false) => {
  return isDarkMode ? DARK_THEME : LIGHT_THEME
}

// Opacity variants for common use cases
export const OPACITY_VARIANTS = {
  10: '10',  // 10% opacity
  20: '20',  // 20% opacity
  30: '30',  // 30% opacity
  40: '40',  // 40% opacity
  50: '50',  // 50% opacity
  60: '60',  // 60% opacity
  70: '70',  // 70% opacity
  80: '80',  // 80% opacity
  90: '90',  // 90% opacity
}

// CSS custom properties generator
export const generateCSSCustomProperties = (isDarkMode = false) => {
  const theme = getThemeColors(isDarkMode)
  
  return {
    '--color-primary': SEMANTIC_COLORS.primary,
    '--color-primary-dark': SEMANTIC_COLORS.primaryDark,
    '--color-secondary': SEMANTIC_COLORS.secondary,
    '--color-accent': SEMANTIC_COLORS.accent,
    '--color-background-primary': theme.background.primary,
    '--color-background-secondary': theme.background.secondary,
    '--color-text-primary': theme.text.primary,
    '--color-text-secondary': theme.text.secondary,
    '--color-border-primary': theme.border.primary,
  }
}

export default {
  BRAND_COLORS,
  SEMANTIC_COLORS,
  LIGHT_THEME,
  DARK_THEME,
  getThemeColors,
  OPACITY_VARIANTS,
  generateCSSCustomProperties,
} 