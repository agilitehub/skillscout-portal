// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo, useCallback } from 'react'
import { Card } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBookOpen, 
  faCoins, 
  faUsers, 
  faCode, 
  faGraduationCap,
  faMoneyBillWave,
  faProjectDiagram
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

/**
 * KnowledgeBase component - Learning resources and educational content
 * Implements modular design with comprehensive error handling and validation
 * Follows module-driven development principles with optimized performance
 */
const KnowledgeBase = React.memo(({ onModalOpen }) => {
  const { darkMode } = useTheme()

  // Centralized color palette - memoized for performance optimization
  const colors = useMemo(() => ({
    shakespeare: '#3FB1D4',
    logoGoldAccent: '#DCAC55',
    diSerria: '#DCAA55',
    darkBlue: '#0E4173',
    blueAccent: '#2C5282',
    pictonBlue: '#1EC9EA',
    logoNavy: '#0D2035',
    logoTeal: '#3A8B9F',
    orange: '#FF7F50'
  }), [])

  // Knowledge base resources with comprehensive error handling and validation
  const knowledgeResources = useMemo(() => {
    try {
      const resources = [
        {
          title: 'DESO for Beginners',
          description: 'Start your journey with DESO blockchain and learn the fundamentals of decentralized social media.',
          icon: faBookOpen,
          color: colors.shakespeare,
          type: 'course',
          content: 'This comprehensive guide covers the basics of DESO blockchain, including how to create an account, understand the ecosystem, and start your journey in decentralized social media.'
        },
        {
          title: 'Advanced Bounty Strategies',
          description: 'Master the art of creating and completing high-value bounties on the DESO platform.',
          icon: faCoins,
          color: colors.logoGoldAccent,
          type: 'course',
          content: 'Learn advanced techniques for maximizing your earnings through bounties, including how to identify high-value opportunities and optimize your completion strategies.'
        },
        {
          title: 'Community Building Guide',
          description: 'Learn how to grow and manage your DESO community effectively.',
          icon: faUsers,
          color: colors.logoTeal,
          type: 'guide',
          content: 'Discover proven strategies for building engaged communities on DESO, including content strategies, community management, and growth tactics.'
        },
        {
          title: 'Smart Contract Development',
          description: 'Understanding smart contracts and development on the DESO blockchain.',
          icon: faCode,
          color: colors.orange,
          type: 'technical',
          content: 'A technical deep-dive into DESO smart contract development, covering the tools, frameworks, and best practices for building on the platform.'
        },
        {
          title: 'DeFi on DESO',
          description: 'Explore decentralized finance opportunities within the DESO ecosystem.',
          icon: faMoneyBillWave,
          color: colors.logoNavy,
          type: 'course',
          content: 'Learn about DeFi protocols, yield farming, and financial opportunities available on the DESO blockchain.'
        },
        {
          title: 'Project Development',
          description: 'Complete guide to launching your own project on DESO.',
          icon: faProjectDiagram,
          color: colors.blueAccent,
          type: 'guide',
          content: 'Step-by-step instructions for planning, developing, and launching successful projects on the DESO platform.'
        }
      ]
      
      // Validate each resource structure
      return resources.filter(resource => {
        const isValid = resource.title && 
                       resource.description && 
                       resource.icon && 
                       resource.color && 
                       resource.type && 
                       resource.content
        if (!isValid) {
          console.warn('KnowledgeBase: Invalid resource configuration found', resource)
        }
        return isValid
      })
    } catch (error) {
      console.error('KnowledgeBase: Error loading knowledge resources:', error)
      return []
    }
  }, [colors])

  // Get type badge color with error handling
  const getTypeBadgeColor = useCallback((type) => {
    try {
      const badgeColors = {
        course: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        guide: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        technical: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
      }
      
      return badgeColors[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    } catch (error) {
      console.error('KnowledgeBase: Error getting badge color:', error)
      return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    }
  }, [])

  // Handle resource click with comprehensive error handling
  const handleResourceClick = useCallback((resource) => {
    try {
      if (!resource) {
        console.warn('KnowledgeBase: Invalid resource for modal open')
        return
      }

      const modalData = {
        title: resource.title,
        description: resource.description,
        icon: resource.icon,
        content: resource.content,
        type: resource.type
      }

      // Validate modal data before opening
      const isValidModalData = modalData.title && 
                              modalData.description && 
                              modalData.icon && 
                              modalData.content

      if (!isValidModalData) {
        console.error('KnowledgeBase: Invalid modal data structure', modalData)
        return
      }

      onModalOpen(modalData)
    } catch (error) {
      console.error('KnowledgeBase: Error handling resource click:', error)
    }
  }, [onModalOpen])

  // Generate random progress for demonstration with error handling
  const generateProgress = useCallback(() => {
    try {
      return Math.floor(Math.random() * 60) + 20
    } catch (error) {
      console.error('KnowledgeBase: Error generating progress:', error)
      return 50 // Default fallback
    }
  }, [])

  // Validate required props with comprehensive error handling
  if (!onModalOpen || typeof onModalOpen !== 'function') {
    console.error('KnowledgeBase: Missing required prop - onModalOpen must be a function')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Component configuration error. Please check props.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 px-2 md:px-4 lg:px-6 pt-4 overflow-y-auto">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${colors.shakespeare}, ${colors.logoTeal})`,
            boxShadow: `0 8px 20px 0 ${colors.shakespeare}40`
          }}
        >
          <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Knowledge Base
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our comprehensive learning resources to master the DESO ecosystem and maximize your earnings.
        </p>
      </div>

      {/* Knowledge Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {knowledgeResources.map((resource, index) => {
          const progress = generateProgress()
          
          return (
            <Card
              key={`resource-${index}`}
              className="border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full"
              style={{ 
                background: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}
              bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${resource.color}, ${resource.color}80)`,
                      boxShadow: `0 4px 10px 0 ${resource.color}40`
                    }}
                  >
                    <FontAwesomeIcon icon={resource.icon} className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
                        {resource.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${getTypeBadgeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {resource.description}
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-auto">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${progress}%`,
                        background: `linear-gradient(to right, ${resource.color}, ${resource.color}80)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Progress: {progress}%
                    </span>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: resource.color }}
                    >
                      Continue Learning
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty state fallback */}
      {knowledgeResources.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon 
            icon={faGraduationCap} 
            className="text-4xl text-gray-400 dark:text-gray-600 mb-4" 
          />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            No Learning Resources Available
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Learning resources are currently being prepared. Please check back later.
          </p>
        </div>
      )}
    </div>
  )
})

// Set display name for debugging purposes
KnowledgeBase.displayName = 'KnowledgeBase'

export default KnowledgeBase 