// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCommentDots, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import { BRAND_COLORS } from '../../../core/theme/colors'

/**
 * BottomNavigation component - Fixed bottom navigation for mobile
 * Implements responsive design, theme support, and comprehensive error handling
 * Follows module-driven development principles with optimized performance
 */
const BottomNavigation = React.memo(({ activeTab, onTabChange, onDetailViewReset }) => {
  const { darkMode } = useTheme()

  // Navigation items configuration with comprehensive validation
  const navigationItems = useMemo(() => {
    try {
      const items = [
        {
          id: 'home',
          icon: faHome,
          label: 'Home',
          ariaLabel: 'Navigate to Home'
        },
        {
          id: 'chat',
          icon: faCommentDots,
          label: 'Chat',
          ariaLabel: 'Navigate to Chat'
        },
        {
          id: 'knowledge',
          icon: faGraduationCap,
          label: 'Knowledge',
          ariaLabel: 'Navigate to Knowledge Base'
        }
      ]

      // Validate each navigation item structure
      return items.filter((item) => {
        const isValid =
          item.id &&
          item.icon &&
          item.label &&
          item.ariaLabel &&
          typeof item.id === 'string' &&
          typeof item.label === 'string'

        if (!isValid) {
          console.warn('BottomNavigation: Invalid navigation item configuration found', item)
        }
        return isValid
      })
    } catch (error) {
      console.error('BottomNavigation: Error creating navigation items:', error)
      return []
    }
  }, [])

  // Handle navigation item click with comprehensive error handling
  const handleItemClick = useCallback(
    (item) => {
      try {
        if (!item || !item.id) {
          console.warn('BottomNavigation: Invalid navigation item for click')
          return
        }

        // Reset detail view if handler is provided
        if (onDetailViewReset && typeof onDetailViewReset === 'function') {
          try {
            onDetailViewReset()
          } catch (error) {
            console.error('BottomNavigation: Error resetting detail view:', error)
          }
        }

        // Change tab
        onTabChange(item.id)
      } catch (error) {
        console.error('BottomNavigation: Error handling navigation click:', error)
      }
    },
    [onTabChange, onDetailViewReset]
  )

  // Check if item is active with error handling
  const isItemActive = useCallback(
    (itemId) => {
      try {
        return activeTab === itemId
      } catch (error) {
        console.error('BottomNavigation: Error checking active state:', error)
        return false
      }
    },
    [activeTab]
  )

  // Get item styles with error handling
  const getItemStyles = useCallback(
    (item) => {
      try {
        const isActive = isItemActive(item.id)

        return {
          container: {
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease'
          },
          iconContainer: {
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            boxShadow: isActive ? '0 0 12px rgba(255, 215, 0, 0.4)' : 'none',
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease'
          },
          icon: {
            color: isActive ? BRAND_COLORS.gold : 'white',
            fontSize: isActive ? '1.125rem' : '1rem',
            transition: 'all 0.3s ease'
          },
          label: {
            color: isActive ? BRAND_COLORS.gold : 'white',
            fontWeight: isActive ? 'bold' : 'normal',
            opacity: isActive ? 1 : 0.8,
            transition: 'all 0.3s ease'
          }
        }
      } catch (error) {
        console.error('BottomNavigation: Error getting item styles:', error)
        return {
          container: {},
          iconContainer: {},
          icon: { color: 'white' },
          label: { color: 'white' }
        }
      }
    },
    [isItemActive]
  )

  // Validate required props with comprehensive error handling
  if (!onTabChange || typeof onTabChange !== 'function') {
    console.error('BottomNavigation: Missing required prop - onTabChange must be a function')
    return null
  }

  if (!activeTab || typeof activeTab !== 'string') {
    console.error('BottomNavigation: Missing or invalid activeTab prop')
    return null
  }

  // Early return if no navigation items
  if (navigationItems.length === 0) {
    console.warn('BottomNavigation: No valid navigation items available')
    return null
  }

  return (
    <nav
      className='fixed bottom-0 left-0 right-0 py-2 z-10'
      style={{
        background: darkMode ? BRAND_COLORS.darkBlueVariant : BRAND_COLORS.shakespeareVariant,
        boxShadow: '0 -1px 4px rgba(0,0,0,0.1)'
      }}
      role='navigation'
      aria-label='Bottom navigation'
    >
      <div className='flex justify-around items-center'>
        {navigationItems.map((item) => {
          const styles = getItemStyles(item)
          const isActive = isItemActive(item.id)

          return (
            <button
              key={item.id}
              className='flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-2'
              onClick={() => handleItemClick(item)}
              style={styles.container}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              type='button'
            >
              <div
                className='w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300'
                style={styles.iconContainer}
              >
                <FontAwesomeIcon icon={item.icon} style={styles.icon} size='lg' aria-hidden='true' />
              </div>
              <span className='text-[10px] mt-1 transition-all duration-300' style={styles.label}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
})

// Set display name for debugging purposes
BottomNavigation.displayName = 'BottomNavigation'

export default BottomNavigation
