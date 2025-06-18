// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Card, Typography, Row, Col } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faBookOpen, faRobot } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import { LOGIN_COLORS } from '../constants/colors'

const { Title, Paragraph } = Typography

/**
 * ImagineSection component - Displays feature cards for the platform
 * Implements responsive design with theme support
 */
const ImagineSection = React.memo(() => {
  const { darkMode } = useTheme()

  // Use centralized colors for consistency
  const colors = LOGIN_COLORS

  // Feature data with error handling
  const imagineData = React.useMemo(() => {
    try {
      return [
        {
          icon: faCoins,
          color: colors.logoNavy,
          title: 'Airdrops Everywhere',
          description: 'Discover projects offering airdrops & bounties & learn how to claim them.'
        },
        {
          icon: faBookOpen,
          color: colors.logoNavyLight,
          title: 'Guides for Every Project',
          description: 'Get step-by-step guides for staking & earning from top DeSo projects.'
        },
        {
          icon: faRobot,
          color: colors.logoBlue,
          title: 'AI-Powered Insights',
          description: 'Chat with our AI assistant regarding any of these projects.'
        }
      ]
    } catch (error) {
      console.error('Error loading imagine data:', error)
      return []
    }
  }, [colors])

  // Dynamic color mapping for dark mode
  const getDynamicColor = React.useCallback((item) => {
    if (darkMode) {
      switch (item.icon) {
        case faRobot:
          return colors.blueHighlight
        case faBookOpen:
          return colors.darkTeal
        case faCoins:
          return colors.blueAccent
        default:
          return colors.shakespeare
      }
    }
    return item.color
  }, [darkMode, colors])

  if (imagineData.length === 0) {
    return null // Don't render if data failed to load
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 pt-2 sm:pt-8 md:pt-10 pb-4 md:p-6 z-10">
      <Title 
        level={1} 
        className={`text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 font-bold ${
          darkMode 
            ? 'text-white' 
            : ''
        }`}
        style={darkMode ? { 
          color: '#ffffff'
        } : { 
          background: `linear-gradient(90deg, ${colors.logoNavy} 15%, ${colors.logoTeal} 85%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Imagine...
      </Title>

      <Row gutter={[12, 12]} className="w-full max-w-6xl">
        {imagineData.map((item, index) => {
          const dynamicColor = getDynamicColor(item)
          return (
            <Col xs={24} sm={24} md={8} lg={8} key={index}>
              <Card 
                className="h-full hover:shadow-xl transition-all duration-300 border-0 transform hover:-translate-y-1"
                style={{ 
                  background: darkMode ? 'rgba(10, 25, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)', 
                  backdropFilter: 'blur(8px)',
                  borderLeft: `4px solid ${dynamicColor}`
                }}
                bodyStyle={{ padding: '12px' }}
              >
                <div className="flex items-start">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-3"
                    style={{ 
                      background: `linear-gradient(135deg, ${dynamicColor}, ${dynamicColor}80)`,
                      boxShadow: `0 4px 10px 0 ${dynamicColor}40`
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-white text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Title 
                      level={4} 
                      className="text-lg md:text-xl line-clamp-1 m-0 mb-2" 
                      style={{ 
                        color: darkMode ? '#fff' : colors.logoNavy 
                      }}
                    >
                      {item.title}
                    </Title>
                    <Paragraph 
                      className="text-sm md:text-base line-clamp-2 mb-0" 
                      style={{ 
                        color: darkMode ? '#e0e0e0' : '#505050' 
                      }}
                    >
                      {item.description}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
})

ImagineSection.displayName = 'ImagineSection'

export default ImagineSection 