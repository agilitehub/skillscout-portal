import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../context/ThemeContext'

// Color palette from the image
const colors = {
  toreaBay: '#134292', // Dark blue
  redViolet: '#BF106A', // Pink/red
  shakespeare: '#3FB1D4', // Medium blue
  pictonBlue: '#1EC9EA', // Light blue
  lavenderMagenta: '#F074D4', // Lavender
  lily: '#BEAABC', // Light purple
  gamboge: '#E1A00E', // Orange/gold
  botticelli: '#C4D8E5', // Light gray blue
  viking: '#4DC7DC', // Turquoise
  diSerria: '#DCAA55' // Golden brown
}

/**
 * Mobile menu toggle button for small screen sizes
 */
const MobileMenuButton = ({ isMenuOpen, toggleMenu }) => {
  const { darkMode } = useTheme()

  return (
    <button
      type='button'
      className='md:hidden ml-4 text-white p-2 rounded-md hover:bg-white/10'
      style={{
        backgroundColor: isMenuOpen ? (darkMode ? `${colors.redViolet}80` : `${colors.toreaBay}80`) : 'transparent'
      }}
      onClick={toggleMenu}
      aria-expanded={isMenuOpen}
    >
      <span className='sr-only'>{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
      <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
    </button>
  )
}

export default MobileMenuButton
