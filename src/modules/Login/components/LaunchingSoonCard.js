// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Typography } from 'antd'
import { useTheme } from '../../../ui/ThemeContext'
import { LOGIN_COLORS } from '../constants/colors'

const { Title, Paragraph, Text } = Typography

/**
 * LaunchingSoonCard component - Displays launch status and progress
 * Implements responsive design and dark mode support
 */
const LaunchingSoonCard = React.memo(() => {
  const { darkMode } = useTheme()

  // Use centralized colors for consistency
  const colors = LOGIN_COLORS

  return (
    <div className="w-full max-w-lg mx-auto mt-6 mb-4 z-20 relative">
      <div 
        className="py-4 px-6 rounded-2xl transition-all duration-500 hover:shadow-xl transform hover:scale-105"
        style={{ 
          background: darkMode 
            ? 'rgba(10, 25, 41, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(13, 32, 53, 0.15)'
        }}
      >
        <div className="text-center">
          <div className="mb-2">
            <span 
              className="text-3xl md:text-4xl animate-bounce inline-block"
              style={{ animationDuration: '2s' }}
            >
              🚀
            </span>
          </div>
          <Title 
            level={2} 
            className="m-0 mb-1 text-xl sm:text-2xl md:text-3xl font-bold"
            style={{ 
              color: darkMode ? '#ffffff' : colors.logoNavy,
              textShadow: darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            Launching Soon
          </Title>
          <Paragraph 
            className="m-0 text-sm md:text-base"
            style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(80, 80, 80, 0.9)',
              fontWeight: '400'
            }}
          >
            Get ready for something amazing
          </Paragraph>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{ 
                background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
              }}
            >
              <div 
                className="h-full rounded-full animate-pulse"
                style={{ 
                  width: '65%',
                  background: `linear-gradient(to right, ${colors.shakespeare}, ${colors.logoTeal})`,
                  animation: 'pulse 2s ease-in-out infinite alternate'
                }}
              />
            </div>
            <Text 
              className="text-xs mt-1 block"
              style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(80, 80, 80, 0.7)' 
              }}
            >
              Progress: 65% Complete
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
})

LaunchingSoonCard.displayName = 'LaunchingSoonCard'

export default LaunchingSoonCard 