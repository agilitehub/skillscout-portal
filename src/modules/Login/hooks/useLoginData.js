// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../core/context/AuthContext'
import {
  faCoins,
  faUsers,
  faMoneyBillWave,
  faCode,
  faStar,
  faDollarSign,
  faLaptop
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../core/context/ThemeContext'
import { LOGIN_COLORS, DARK_MODE_VARIANTS, FEATURED_PROJECTS_CONFIG } from '../constants/colors'

/**
 * Custom hook for managing Login page data and interactions
 * Centralizes business logic and state management with comprehensive error handling
 * Implements proper validation and follows module-driven development principles
 *
 * @returns {Object} Login data and handlers with error states
 */
export const useLoginData = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const { login, authError } = useAuth()

  // Validate dependencies with error handling
  if (!navigate) {
    console.error('useLoginData: Navigation hook is not available')
  }

  if (typeof darkMode !== 'boolean') {
    console.warn('useLoginData: Dark mode state is invalid, defaulting to false')
  }

  // Icon mapping for projects with comprehensive validation
  const iconMap = useMemo(() => {
    try {
      const icons = {
        faCoins,
        faUsers,
        faMoneyBillWave,
        faCode,
        faStar,
        faDollarSign,
        faLaptop
      }

      // Validate all icons are available
      const missingIcons = Object.entries(icons).filter(([key, icon]) => !icon)
      if (missingIcons.length > 0) {
        console.warn(
          'useLoginData: Missing icons detected:',
          missingIcons.map(([key]) => key)
        )
      }

      return icons
    } catch (error) {
      console.error('useLoginData: Error creating icon map:', error)
      return { faStar } // Fallback to default icon
    }
  }, [])

  // Featured projects with proper icon mapping and validation
  const featuredProjects = useMemo(() => {
    try {
      if (!FEATURED_PROJECTS_CONFIG || !Array.isArray(FEATURED_PROJECTS_CONFIG)) {
        console.error('useLoginData: FEATURED_PROJECTS_CONFIG is invalid or missing')
        return []
      }

      return FEATURED_PROJECTS_CONFIG.map((project) => {
        try {
          // Validate project structure
          if (!project || typeof project !== 'object') {
            console.warn('useLoginData: Invalid project configuration found:', project)
            return null
          }

          const requiredFields = ['name', 'icon', 'color', 'description']
          const missingFields = requiredFields.filter((field) => !project[field])

          if (missingFields.length > 0) {
            console.warn('useLoginData: Project missing required fields:', missingFields, project)
            return null
          }

          return {
            ...project,
            icon: iconMap[project.icon] || iconMap.faStar || faStar
          }
        } catch (projectError) {
          console.error('useLoginData: Error processing project:', projectError, project)
          return null
        }
      }).filter(Boolean) // Remove null entries
    } catch (error) {
      console.error('useLoginData: Error loading featured projects:', error)
      return []
    }
  }, [iconMap])

  // Dynamic featured projects with dark mode support and validation
  const dynamicFeaturedProjects = useMemo(() => {
    try {
      if (!featuredProjects || featuredProjects.length === 0) {
        console.warn('useLoginData: No featured projects available for dynamic processing')
        return []
      }

      if (!LOGIN_COLORS) {
        console.error('useLoginData: LOGIN_COLORS configuration is missing')
        return featuredProjects
      }

      return featuredProjects
        .map((project) => {
          try {
            if (!project) return null

            const projectColor = project.color
            const hasDarkModeVariant = DARK_MODE_VARIANTS && DARK_MODE_VARIANTS[projectColor]

            return {
              ...project,
              color: darkMode
                ? hasDarkModeVariant
                  ? projectColor
                  : LOGIN_COLORS.blueHighlight || projectColor
                : projectColor,
              gradientColors: darkMode
                ? hasDarkModeVariant
                  ? DARK_MODE_VARIANTS[projectColor]
                  : [LOGIN_COLORS.blueAccent || projectColor, LOGIN_COLORS.blueHighlight || projectColor]
                : project.gradientColors || [projectColor, projectColor]
            }
          } catch (projectError) {
            console.error('useLoginData: Error processing dynamic project:', projectError, project)
            return project // Return original project on error
          }
        })
        .filter(Boolean)
    } catch (error) {
      console.error('useLoginData: Error processing dynamic featured projects:', error)
      return featuredProjects
    }
  }, [featuredProjects, darkMode])

  // Magic Link login handler
  const handleLogin = useCallback(
    async (email) => {
      try {
        if (loading) {
          console.warn('useLoginData: Login already in progress')
          return {
            success: false,
            error: 'Login already in progress'
          }
        }

        if (!navigate || typeof navigate !== 'function') {
          console.error('useLoginData: Navigate function is not available')
          return {
            success: false,
            error: 'Navigation not available'
          }
        }

        if (!login || typeof login !== 'function') {
          console.error('useLoginData: Login function is not available')
          return {
            success: false,
            error: 'Login function not available'
          }
        }

        if (!email || typeof email !== 'string') {
          return {
            success: false,
            error: 'Valid email address is required'
          }
        }

        setLoading(true)

        // Use Supabase Magic Link authentication
        const loginResult = await login(email)

        if (loginResult.success) {
          console.log('useLoginData: Magic link sent successfully')
          return loginResult
        } else {
          console.error('useLoginData: Magic link failed:', loginResult.error)
          return loginResult
        }
      } catch (error) {
        console.error('useLoginData: Login error:', error)
        return {
          success: false,
          error: 'An unexpected error occurred during login'
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate, loading, login]
  )

  // Handle opening project links with security and validation
  const handleProjectClick = useCallback((project) => {
    try {
      if (!project) {
        console.warn('useLoginData: Invalid project provided to handleProjectClick')
        return
      }

      if (!project.link || typeof project.link !== 'string') {
        console.warn('useLoginData: Project has no valid link:', project)
        return
      }

      const trimmedLink = project.link.trim()
      if (!trimmedLink) {
        console.warn('useLoginData: Project link is empty after trimming:', project)
        return
      }

      // Validate URL format
      try {
        new URL(trimmedLink)
      } catch (urlError) {
        console.error('useLoginData: Invalid URL format:', trimmedLink, urlError)
        return
      }

      // Open with security measures
      const newWindow = window.open(trimmedLink, '_blank', 'noopener,noreferrer')

      if (!newWindow) {
        console.warn('useLoginData: Failed to open new window (popup blocked?)')
      }
    } catch (error) {
      console.error('useLoginData: Error opening project link:', error)
    }
  }, [])

  // Check if project is clickable with validation
  const isProjectClickable = useCallback((project) => {
    try {
      if (!project || typeof project !== 'object') {
        return false
      }

      return Boolean(project.link && typeof project.link === 'string' && project.link.trim())
    } catch (error) {
      console.error('useLoginData: Error checking if project is clickable:', error)
      return false
    }
  }, [])

  // Validate LOGIN_COLORS before returning
  if (!LOGIN_COLORS) {
    console.error('useLoginData: LOGIN_COLORS configuration is missing')
  }

  return {
    loading,
    colors: LOGIN_COLORS || {},
    dynamicFeaturedProjects,
    handleLogin,
    handleProjectClick,
    isProjectClickable,
    darkMode: Boolean(darkMode), // Ensure boolean value
    authError // Include auth error from context
  }
}
