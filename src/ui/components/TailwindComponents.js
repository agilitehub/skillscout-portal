// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Reusable Tailwind utility classes to replace custom CSS components
 * These follow the module-driven development principles with clear naming
 */

// Base button classes - consistent with the previous .btn class
export const BUTTON_BASE_CLASSES = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

// Button variant classes - replacing the CSS component classes
export const BUTTON_VARIANTS = {
  primary: `${BUTTON_BASE_CLASSES} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`,
  secondary: `${BUTTON_BASE_CLASSES} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`,
  outline: `${BUTTON_BASE_CLASSES} border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 bg-transparent`,
  ghost: `${BUTTON_BASE_CLASSES} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white shadow-none border-transparent`,
  danger: `${BUTTON_BASE_CLASSES} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`,
  success: `${BUTTON_BASE_CLASSES} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`,
}

// Container classes - replacing the CSS component classes
export const CONTAINER_CLASSES = {
  default: 'px-4 mx-auto max-w-7xl sm:px-6 lg:px-8',
  padded: 'container mx-auto px-4 sm:px-6 lg:px-8',
  full: 'w-full px-4 sm:px-6 lg:px-8',
  narrow: 'px-4 mx-auto max-w-4xl sm:px-6 lg:px-8',
  wide: 'px-4 mx-auto max-w-screen-2xl sm:px-6 lg:px-8',
}

// Transition classes - replacing the CSS utility classes
export const TRANSITION_CLASSES = {
  fast: 'transition-all duration-200 ease-in-out',
  medium: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
}

// Typography classes - replacing the global heading styles
export const TYPOGRAPHY_CLASSES = {
  h1: 'text-4xl font-bold md:text-5xl font-heading',
  h2: 'text-3xl font-bold md:text-4xl font-heading',
  h3: 'text-2xl font-bold md:text-3xl font-heading',
  h4: 'text-xl font-bold md:text-2xl font-heading',
  h5: 'text-lg font-bold md:text-xl font-heading',
  h6: 'text-base font-bold md:text-lg font-heading',
}

// Card classes for consistent styling
export const CARD_CLASSES = {
  default: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
  flat: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
}

// Input classes for form elements
export const INPUT_CLASSES = {
  default: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
  error: 'block w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
  success: 'block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
}

// Utility functions to combine classes
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

// Helper function to get button classes
export const getButtonClasses = (variant = 'primary', additionalClasses = '') => {
  return combineClasses(BUTTON_VARIANTS[variant], additionalClasses)
}

// Helper function to get container classes
export const getContainerClasses = (variant = 'default', additionalClasses = '') => {
  return combineClasses(CONTAINER_CLASSES[variant], additionalClasses)
}

// Helper function to get typography classes
export const getTypographyClasses = (level = 'h1', additionalClasses = '') => {
  return combineClasses(TYPOGRAPHY_CLASSES[level], additionalClasses)
}

// Export all classes as default for convenience
export default {
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
} 