// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo, useCallback } from 'react'
import { Card, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCoins, 
  faMoneyBillWave,
  faUsers,
  faFootballBall,
  faCode,
  faGamepad,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

/**
 * DashboardHome component - Main dashboard view with statistics and content
 * Implements responsive design, proper data structure, and comprehensive error handling
 * Follows module-driven development principles with optimized performance
 */
const DashboardHome = React.memo(({ onDetailViewOpen, onTabChange }) => {
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
    orange: '#FF7F50',
    viking: '#4DC7DC'
  }), [])

  // Featured projects data with comprehensive error handling and validation
  const featuredProjects = useMemo(() => {
    try {
      const projects = [
        {
          name: 'Bounty Coin',
          description: 'The Coin That Pays You to HODL.',
          icon: faCoins,
          color: colors.pictonBlue,
          gradientColors: [colors.pictonBlue, colors.shakespeare]
        },
        {
          name: 'John Jardin Club',
          description: 'Earn with John Jardin on his journey to Web3 awesomeness.',
          icon: faUsers,
          color: colors.logoTeal,
          gradientColors: [colors.logoTeal, colors.viking]
        },
        {
          name: 'Money Quest',
          description: 'Gamified learning platform for crypto and DeFi.',
          icon: faMoneyBillWave,
          color: colors.diSerria,
          gradientColors: [colors.diSerria, colors.logoGoldAccent]
        },
        {
          name: 'DesOps',
          description: 'Developer operations platform for the DESO ecosystem.',
          icon: faCode,
          color: colors.orange,
          gradientColors: [colors.orange, colors.diSerria]
        }
      ]
      
      // Validate each project structure
      return projects.filter(project => {
        const isValid = project.name && project.description && project.icon && project.color
        if (!isValid) {
          console.warn('DashboardHome: Invalid project configuration found', project)
        }
        return isValid
      })
    } catch (error) {
      console.error('DashboardHome: Error loading featured projects:', error)
      return []
    }
  }, [colors])

  // Quick stats data with comprehensive error handling and validation
  const quickStats = useMemo(() => {
    try {
      const stats = [
        { 
          label: 'Active Bounties', 
          value: '36', 
          icon: faMoneyBillWave, 
          color: colors.viking,
          onClick: () => {
            try {
              onDetailViewOpen({
                title: 'All Active Bounties',
                type: 'all-bounties',
                icon: faMoneyBillWave,
                content: [
                  { 
                    title: 'UI Design for DESO App',
                    project: 'DesOps',
                    amount: 45.0,
                    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    difficulty: 'Intermediate'
                  },
                  { 
                    title: 'Create Educational Content',
                    project: 'Bounty Coin',
                    amount: 120.0,
                    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    difficulty: 'Beginner'
                  }
                ]
              })
            } catch (error) {
              console.error('DashboardHome: Error opening bounties detail view:', error)
            }
          }
        },
        { 
          label: 'Upcoming Airdrops', 
          value: '9', 
          icon: faFootballBall, 
          color: colors.orange,
          onClick: () => {
            try {
              onDetailViewOpen({
                title: 'All Upcoming Airdrops',
                type: 'all-airdrops',
                icon: faFootballBall,
                content: [
                  {
                    title: 'DESO Creator Token Airdrop',
                    project: 'Bounty Coin',
                    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    amount: '100 DESO',
                    eligibility: 'Active content creators',
                    icon: faCoins
                  }
                ]
              })
            } catch (error) {
              console.error('DashboardHome: Error opening airdrops detail view:', error)
            }
          }
        },
        { 
          label: 'Project Guides', 
          value: '28', 
          icon: faGamepad, 
          color: colors.logoTeal,
          onClick: () => {
            try {
              onTabChange('knowledge')
            } catch (error) {
              console.error('DashboardHome: Error changing to knowledge tab:', error)
            }
          }
        }
      ]
      
      // Validate each stat structure
      return stats.filter(stat => {
        const isValid = stat.label && stat.value && stat.icon && stat.color && stat.onClick
        if (!isValid) {
          console.warn('DashboardHome: Invalid stat configuration found', stat)
        }
        return isValid
      })
    } catch (error) {
      console.error('DashboardHome: Error loading quick stats:', error)
      return []
    }
  }, [colors, onDetailViewOpen, onTabChange])

  // Learning resources data with comprehensive error handling and validation
  const learningResources = useMemo(() => {
    try {
      const resources = [
        {
          title: 'DESO for Beginners',
          description: 'Start your journey with DESO blockchain and learn the fundamentals.',
          icon: faBookOpen,
          color: colors.shakespeare
        },
        {
          title: 'Advanced Bounty Strategies',
          description: 'Master the art of creating and completing high-value bounties.',
          icon: faCoins,
          color: colors.logoGoldAccent
        },
        {
          title: 'Community Building',
          description: 'Learn how to grow and manage your DESO community effectively.',
          icon: faUsers,
          color: colors.logoTeal
        },
        {
          title: 'Smart Contract Basics',
          description: 'Understanding smart contracts on the DESO blockchain.',
          icon: faCode,
          color: colors.orange
        }
      ]
      
      // Validate each resource structure
      return resources.filter(resource => {
        const isValid = resource.title && resource.description && resource.icon && resource.color
        if (!isValid) {
          console.warn('DashboardHome: Invalid learning resource configuration found', resource)
        }
        return isValid
      })
    } catch (error) {
      console.error('DashboardHome: Error loading learning resources:', error)
      return []
    }
  }, [colors])

  // Handle stat card clicks with proper error handling
  const handleStatClick = useCallback((stat) => {
    try {
      if (stat && typeof stat.onClick === 'function') {
        stat.onClick()
      } else {
        console.warn('DashboardHome: Invalid stat click handler')
      }
    } catch (error) {
      console.error('DashboardHome: Error handling stat click:', error)
    }
  }, [])

  // Handle knowledge tab navigation with error handling
  const handleKnowledgeNavigation = useCallback(() => {
    try {
      onTabChange('knowledge')
    } catch (error) {
      console.error('DashboardHome: Error navigating to knowledge tab:', error)
    }
  }, [onTabChange])

  // Validate required props with comprehensive error handling
  if (!onDetailViewOpen || !onTabChange) {
    console.error('DashboardHome: Missing required props - onDetailViewOpen or onTabChange')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Component configuration error. Please check props.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 px-2 md:px-4 lg:px-6 pt-4 overflow-y-auto">
      {/* Quick Stats Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {quickStats.map((stat, index) => (
            <Card
              key={`stat-${index}`}
              className="border-0 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ 
                background: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderLeft: `4px solid ${stat.color}`
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => handleStatClick(stat)}
            >
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`,
                    boxShadow: `0 4px 10px 0 ${stat.color}40`
                  }}
                >
                  <FontAwesomeIcon icon={stat.icon} className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-0">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-0">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {featuredProjects.map((project, index) => (
            <Card
              key={`project-${index}`}
              className="border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ 
                background: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${project.color}`
              }}
                            bodyStyle={{ padding: '12px' }}
            >
              <div className="flex flex-col">
                <div className="flex items-center mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${project.color}, ${project.color}80)`,
                      boxShadow: `0 2px 6px 0 ${project.color}40`
                    }}
                  >
                    <FontAwesomeIcon icon={project.icon} className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-0 leading-tight">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <Button 
                    type="primary" 
                    size="small"
                    block
                    style={{
                      background: `linear-gradient(135deg, ${project.color}, ${project.color}80)`,
                      borderColor: project.color,
                      color: 'white'
                    }}
                    className="border-0 hover:opacity-90 transition-opacity duration-200"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Resources Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 text-center">
          Learning Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {learningResources.map((resource, index) => (
            <Card
              key={`resource-${index}`}
              className="border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              style={{ 
                background: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${resource.color}`
              }}
              bodyStyle={{ padding: '12px' }}
              onClick={handleKnowledgeNavigation}
            >
              <div className="flex flex-col">
                <div className="flex items-center mb-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${resource.color}, ${resource.color}80)`,
                      boxShadow: `0 2px 6px 0 ${resource.color}40`
                    }}
                  >
                    <FontAwesomeIcon icon={resource.icon} className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-0 leading-tight">
                      {resource.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                                    <Button 
                    type="primary" 
                    size="small"
                    block
                    style={{ 
                      background: `linear-gradient(135deg, ${resource.color}, ${resource.color}80)`,
                      borderColor: resource.color,
                      color: 'white'
                    }}
                    className="border-0 hover:opacity-90 transition-opacity duration-200"
                  >
                    Start Learning
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
})

// Set display name for debugging purposes
DashboardHome.displayName = 'DashboardHome'

export default DashboardHome 