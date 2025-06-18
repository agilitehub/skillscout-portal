import React from 'react'
import Navigation from './Navigation'
import { useTheme } from '../../../ui/ThemeContext'

// Color palette from the image
const colors = {
  toreaBay: '#134292',    // Dark blue
  redViolet: '#BF106A',   // Pink/red
  shakespeare: '#3FB1D4',  // Medium blue
  pictonBlue: '#1EC9EA',  // Light blue
  lavenderMagenta: '#F074D4', // Lavender
  lily: '#BEAABC',        // Light purple
  gamboge: '#E1A00E',     // Orange/gold
  botticelli: '#C4D8E5',  // Light gray blue
  viking: '#4DC7DC',      // Turquoise
  diSerria: '#DCAA55'     // Golden brown
}

/**
 * Mobile navigation menu for small screen sizes
 */
const MobileNavigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const { darkMode } = useTheme()

  const navLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-white'
        : darkMode ? 'text-white hover:text-white' : 'text-white hover:text-white'
    }`

  const getNavLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive 
      ? (darkMode ? colors.redViolet : colors.toreaBay) 
      : 'transparent',
    ':hover': {
      backgroundColor: darkMode ? `${colors.redViolet}80` : `${colors.toreaBay}80`
    }
  })

  return (
    <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
         style={{ 
           backgroundColor: darkMode ? colors.toreaBay : colors.shakespeare,
           borderBottomLeftRadius: '0.375rem',
           borderBottomRightRadius: '0.375rem'
         }}>
      <Navigation
        containerClassName='pt-2 pb-3 space-y-1'
        navLinkClassName={navLinkClasses}
        getNavLinkStyle={getNavLinkStyle}
        onLinkClick={() => setIsMenuOpen(false)}
      />
    </div>
  )
}

export default MobileNavigation
