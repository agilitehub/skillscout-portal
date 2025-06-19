// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import Logo from '../../../ui/components/Logo'
import MagicLinkLogin from './MagicLinkLogin'

const { Title } = Typography

/**
 * HeroSection component - Main landing section with logo, title, and magic link login
 * Implements responsive design and theme support
 */
const HeroSection = React.memo(({ loading, onLogin }) => {
  const { darkMode } = useTheme()

  // Color palette - Career Match AI blue-to-green balance
  const colors = {
    // Blues from brand palette
    darkBlue: '#1E3A52',
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    toreaBay: '#2E5984',
    // Greens from brand palette
    seaGreen: '#16A085',
    emeraldPrimary: '#059669',
    emeraldBright: '#34D399',
    tealGreen: '#14B8A6',
    mintGreen: '#00D8A3',
    forestGreen: '#065F46'
  }

  return (
    <div className='w-full flex flex-col items-center justify-center p-4 md:p-8 pt-8 sm:pt-10 md:pt-12 pb-4 md:pb-6 z-10'>
      {/* Logo */}
      <div className='mb-4 md:mb-6 transform hover:scale-105 transition-transform duration-500'>
        <div className='relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 mx-auto'>
          <div
            className='absolute inset-0 rounded-full'
            style={{
              background: `linear-gradient(45deg, ${colors.shakespeare}, ${colors.seaGreen})`,
              animation: 'pulse 2s infinite'
            }}
          />
          <div
            className={`absolute inset-2 rounded-full flex items-center justify-center overflow-hidden ${
              darkMode ? 'bg-white/20 backdrop-blur-md shadow-2xl border border-white/30' : 'bg-white shadow-lg'
            }`}
          >
            <Logo className='w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40' alt='Career Match AI Logo' />
          </div>
        </div>
      </div>

      {/* Title and Description */}
      <div className='text-center max-w-xl px-2'>
        <Title
          level={1}
          className={`text-2xl sm:text-3xl md:text-5xl mb-2 font-extrabold tracking-tight ${
            darkMode ? '!text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
          }`}
          style={darkMode ? { color: '#ffffff !important' } : {}}
        >
          Career Match AI
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
          Streamline your workflow with intelligent forms and seamless data management.
        </Title>
      </div>

      {/* Magic Link Login Component */}
      <MagicLinkLogin onLogin={onLogin} loading={loading} />

      {/* Divider */}
      <div className='mt-8 md:mt-10 flex items-center justify-center w-full z-10'>
        <div
          className='w-1/3 h-px'
          style={{
            background: darkMode ? `${colors.shakespeare}30` : `${colors.pictonBlue}20`
          }}
        />
        <FontAwesomeIcon
          icon={faLightbulb}
          className='mx-4 text-xl'
          style={{
            color: darkMode ? colors.shakespeare : colors.seaGreen
          }}
        />
        <div
          className='w-1/3 h-px'
          style={{
            background: darkMode ? `${colors.shakespeare}30` : `${colors.pictonBlue}20`
          }}
        />
      </div>
    </div>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
