// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

// Import minimal Tailwind CSS file (only directives, no custom CSS)
import './tailwind.css'

// Import the utility classes and functions for internal use
import {
  BUTTON_BASE_CLASSES,
  BUTTON_VARIANTS,
  CONTAINER_CLASSES,
  TRANSITION_CLASSES,
  TYPOGRAPHY_CLASSES,
  CARD_CLASSES,
  INPUT_CLASSES,
  combineClasses,
  getButtonClasses,
  getContainerClasses,
  getTypographyClasses,
  default as TailwindComponents
} from '../components/TailwindComponents'

// Import GlobalStyles component
import GlobalStyles from '../components/GlobalStyles'

// Export everything for external use
export {
  BUTTON_BASE_CLASSES,
  BUTTON_VARIANTS,
  CONTAINER_CLASSES,
  TRANSITION_CLASSES,
  TYPOGRAPHY_CLASSES,
  CARD_CLASSES,
  INPUT_CLASSES,
  combineClasses,
  getButtonClasses,
  getContainerClasses,
  getTypographyClasses,
  TailwindComponents,
  GlobalStyles
}

// Legacy exports for backward compatibility (deprecated - use TailwindComponents instead)
export const TRANSITIONS = {
  FAST: 'transition-all duration-200 ease-in-out',
  MEDIUM: 'transition-all duration-300 ease-in-out', 
  SLOW: 'transition-all duration-500 ease-in-out'
}

// Utility function to help with migration
export const migrateClassNames = {
  'btn': BUTTON_BASE_CLASSES,
  'btn-primary': getButtonClasses('primary'),
  'btn-secondary': getButtonClasses('secondary'),
  'btn-outline': getButtonClasses('outline'),
  'btn-ghost': getButtonClasses('ghost'),
  'container': getContainerClasses('default'),
  'container-padded': getContainerClasses('padded'),
  'transition-all-fast': TRANSITION_CLASSES.fast,
  'transition-all-medium': TRANSITION_CLASSES.medium,
  'transition-all-slow': TRANSITION_CLASSES.slow
}
