// Global Instructions Rule Applied!

/**
 * Tailwind color extensions mapped to CSS custom properties in tokens.css.
 * Pattern matches react-ai-boilerplate: rgb(var(--token) / <alpha-value>).
 */
const themeColors = {
  background: 'rgb(var(--color-background) / <alpha-value>)',
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
  'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
  border: 'rgb(var(--color-border) / <alpha-value>)',
  'border-input': 'rgb(var(--color-border-input) / <alpha-value>)',
  'border-muted': 'rgb(var(--color-border-muted) / <alpha-value>)',
  'border-glass': 'var(--color-border-glass)',
  foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
  muted: 'rgb(var(--color-muted) / <alpha-value>)',
  subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
  placeholder: 'rgb(var(--color-placeholder) / <alpha-value>)',
  'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
  'ring-offset': 'rgb(var(--color-ring-offset) / <alpha-value>)',
  'overlay-hover': 'var(--color-overlay-hover)',
  'input-bg': 'rgb(var(--color-input-bg) / <alpha-value>)',
  'input-border': 'rgb(var(--color-input-border) / <alpha-value>)',
  'input-text': 'rgb(var(--color-input-text) / <alpha-value>)',
  'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
  'brand-secondary': 'rgb(var(--color-brand-secondary) / <alpha-value>)',
  'brand-accent': 'rgb(var(--color-brand-accent) / <alpha-value>)',
  success: 'rgb(var(--color-success) / <alpha-value>)',
  danger: 'rgb(var(--color-danger) / <alpha-value>)',
  primary: {
    light: '#33C187',
    DEFAULT: '#006B3C',
    dark: '#003921'
  },
  secondary: {
    light: '#4FA8FF',
    DEFAULT: '#0E5A94',
    dark: '#00334F'
  },
  'agilite-red': '#E30613',
  'agilite-black': '#151515',
  'agilite-slate': '#1E293B',
  'agilite-grey': {
    light: '#E2E8F0',
    DEFAULT: '#718096',
    dark: '#4A5568'
  },
  'agilite-grey-light': '#F5F5F5'
}

module.exports = themeColors
