// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Centralized color configuration for the entire application
 * This serves as a single source of truth for all color-related styling
 * Organized by brand colors, semantic colors, and theme-specific variants
 */

// Primary brand colors - Career Match AI palette
export const BRAND_COLORS = {
  // Primary blue palette - matching logo
  shakespeare: '#4A90A4',     // Steel blue - primary brand color
  pictonBlue: '#5BA3D4',      // Lighter steel blue - accent
  toreaBay: '#2E5984',        // Deep blue - strong accent
  blueAccent: '#3D6B99',      // Medium blue accent
  blueHighlight: '#4A7BA7',   // Blue highlight
  darkBlue: '#1E3A52',        // Dark blue for dark mode
  
  // Navy palette for dark mode
  navyDark: '#0F1419',        // Very dark navy
  navyMedium: '#1A2633',      // Medium navy
  navyLight: '#2A3D4F',       // Light navy
  darkTeal: '#1E3A52',        // Dark teal matching logo
  
  // Emerald/Forest green palette
  emeraldPrimary: '#059669',  // Primary emerald green
  emeraldLight: '#10B981',    // Light emerald
  emeraldBright: '#34D399',   // Bright emerald
  forestGreen: '#065F46',     // Forest green
  emeraldAccent: '#047857',   // Emerald accent
  seaGreen: '#16A085',        // Sea green
  mintGreen: '#00D8A3',       // Mint green
  tealGreen: '#14B8A6',       // Teal green
  darkForest: '#064E3B',      // Dark forest green
  
  // Supporting colors
  botticelli: '#B8D4E3',     // Light blue-gray
  viking: '#4A90A4',         // Matching primary blue
}

// Semantic color assignments
export const SEMANTIC_COLORS = {
  primary: BRAND_COLORS.shakespeare,
  primaryDark: BRAND_COLORS.darkBlue,
  secondary: BRAND_COLORS.emeraldPrimary,
  secondaryDark: BRAND_COLORS.emeraldAccent,
  accent: BRAND_COLORS.pictonBlue,
  accentDark: BRAND_COLORS.blueAccent,
  success: BRAND_COLORS.emeraldLight,
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
    primary: `linear-gradient(90deg, ${BRAND_COLORS.seaGreen} 60%, ${BRAND_COLORS.emeraldPrimary})`,
    secondary: `linear-gradient(135deg, ${BRAND_COLORS.tealGreen}, ${BRAND_COLORS.emeraldBright})`,
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
    primary: `linear-gradient(90deg, ${BRAND_COLORS.emeraldAccent} 60%, ${BRAND_COLORS.forestGreen})`,
    secondary: `linear-gradient(135deg, ${BRAND_COLORS.darkForest}, ${BRAND_COLORS.emeraldAccent})`,
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