// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'

/**
 * Logo component that automatically switches between light and dark mode versions
 *
 * @component
 * @example
 * // Basic usage
 * <Logo />
 *
 * // With custom size and additional classes
 * <Logo className="w-16 h-16 my-4" />
 *
 * // With custom alt text
 * <Logo alt="Company Logo" />
 *
 * // Force light version regardless of theme
 * <Logo forceLight={true} />
 */
const Logo = memo(({ className = '', alt = 'Logo', forceLight = false }) => {
  const { darkMode } = useTheme()

  // Use absolute path for logo with error handling
  const logoSrc = `${process.env.PUBLIC_URL}/logo.png`

  // Handle image loading errors gracefully
  const handleImageError = (e) => {
    // Fallback to a default or placeholder if image fails to load
    e.target.style.display = 'none'
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      onError={handleImageError}
      className={`w-auto transition-opacity duration-300 ${darkMode && !forceLight ? 'opacity-90' : 'opacity-100'} ${className}`}
    />
  )
})

Logo.propTypes = {
  /** Additional CSS classes to apply to the logo */
  className: PropTypes.string,
  /** Alternative text for the logo image */
  alt: PropTypes.string,
  /** Force light version of logo regardless of theme */
  forceLight: PropTypes.bool
}

Logo.defaultProps = {
  className: '',
  alt: 'SkillScout Logo',
  forceLight: false
}

// Display name for React DevTools
Logo.displayName = 'Logo'

export default Logo
