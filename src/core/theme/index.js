// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

// Import minimal Tailwind CSS file (only directives, no custom CSS)
import './tailwind/tailwind.css'

// Import GlobalStyles component
import GlobalStyles from './GlobalStyles'

// Export everything for external use
export { GlobalStyles }

// Legacy exports for backward compatibility (deprecated - use TailwindComponents instead)
export const TRANSITIONS = {
  FAST: 'transition-all duration-200 ease-in-out',
  MEDIUM: 'transition-all duration-300 ease-in-out',
  SLOW: 'transition-all duration-500 ease-in-out'
}
