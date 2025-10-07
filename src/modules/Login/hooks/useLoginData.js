// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../core/context/AuthContext'
import { useTheme } from '../../../core/context/ThemeContext'

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

  // Magic Link login handler
  const handleLogin = useCallback(
    async (email) => {
      try {
        if (loading) {
          return {
            success: false,
            error: 'Login already in progress'
          }
        }

        if (!navigate || typeof navigate !== 'function') {
          return {
            success: false,
            error: 'Navigation not available'
          }
        }

        if (!login || typeof login !== 'function') {
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
          return loginResult
        } else {
          return loginResult
        }
      } catch (error) {
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

  return {
    loading,
    handleLogin,
    darkMode: Boolean(darkMode), // Ensure boolean value
    authError // Include auth error from context
  }
}
