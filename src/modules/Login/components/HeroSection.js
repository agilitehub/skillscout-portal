// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Typography, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import Logo from '../../../ui/components/Logo'

const { Title } = Typography

/**
 * HeroSection component - Main landing section with logo, title, and login button
 * Implements responsive design and theme support
 */
const HeroSection = React.memo(({ loading, onLogin }) => {
  const { darkMode } = useTheme()

  // Color palette
  const colors = {
    logoNavy: '#0D2035',
    logoNavyLight: '#1A3B5A',
    shakespeare: '#3FB1D4',
    logoTeal: '#3A8B9F',
    blueHighlight: '#3182CE',
    blueAccent: '#2C5282',
    logoGoldAccent: '#DCAC55',
    diSerria: '#DCAA55'
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 pt-8 sm:pt-10 md:pt-12 pb-4 md:pb-6 z-10">
      {/* Logo */}
      <div className="mb-4 md:mb-6 transform hover:scale-105 transition-transform duration-500">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 mx-auto">
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              background: `linear-gradient(to right, ${colors.shakespeare}, ${colors.logoTeal})`,
              animation: 'pulse 2s infinite'
            }}
          />
          <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
            <Logo className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40" alt="Bounty Coin Logo" />
          </div>
        </div>
      </div>
      
      {/* Title and Description */}
      <div className="text-center max-w-xl px-2">
        <Title 
          level={1} 
          className={`text-2xl sm:text-3xl md:text-5xl mb-2 font-extrabold tracking-tight ${
            darkMode 
              ? '!text-white' 
              : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
          }`}
          style={darkMode ? { color: '#ffffff !important' } : {}}
        >
          Bounty Coin Club
        </Title>
        <Title 
          level={3} 
          className={`text-base sm:text-lg md:text-2xl mt-1 mb-2 font-semibold ${
            darkMode 
              ? '!text-white !opacity-90' 
              : 'bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent'
          }`}
          style={darkMode ? { color: '#ffffff !important', opacity: '0.9' } : {}}
        >
          Explore DeSo Creators, their projects, and opportunities to earn, stake, and grab airdrops.
        </Title>
      </div>  

      {/* Login Button */}
      <div className="w-full max-w-xs mx-auto mt-6 mb-4 z-20 relative">
        <Button 
          type="primary" 
          onClick={onLogin}
          loading={loading}
          block
          className={`h-12 font-medium text-white transition-all duration-300 px-3 flex items-center justify-center hover:shadow-lg border-0 hover:scale-105 transform ${
            darkMode ? 'hover:shadow-blue-500/25' : 'hover:shadow-shakespeare/30'
          }`}
          style={{ 
            background: darkMode 
              ? `linear-gradient(90deg, ${colors.blueAccent} 85%, ${colors.logoGoldAccent})`
              : `linear-gradient(90deg, ${colors.shakespeare} 85%, ${colors.diSerria})`,
            boxShadow: darkMode 
              ? `0 4px 14px 0 ${colors.blueAccent}40`
              : `0 4px 14px 0 ${colors.shakespeare}30`
          }}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {loading ? 'Logging in...' : 'Login with DeSo'}
        </Button>
      </div>

      {/* Divider */}
      <div className="mt-8 md:mt-10 flex items-center justify-center w-full z-10">
        <div 
          className="w-1/3 h-px"
          style={{ 
            background: darkMode ? `${colors.shakespeare}30` : `${colors.logoNavy}20` 
          }}
        />
        <FontAwesomeIcon 
          icon={faLightbulb} 
          className="mx-4 text-xl" 
          style={{ 
            color: darkMode ? colors.blueHighlight : colors.logoNavy 
          }} 
        />
        <div 
          className="w-1/3 h-px"
          style={{ 
            background: darkMode ? `${colors.shakespeare}30` : `${colors.logoNavy}20` 
          }}
        />
      </div>
    </div>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection 