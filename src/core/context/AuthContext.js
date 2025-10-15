// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  sendMagicLink,
  getCurrentUser,
  signOut,
  onAuthStateChange,
  getSession,
  isAuthenticated,
  activateUserOnLogin
} from '../../core/lib/supabase-controller'
import { fetchUserProfile, clearProfile } from '../components/profile'

/**
 * Authentication context for Supabase Magic Link authentication
 * Implements passwordless email authentication with comprehensive error handling
 * Follows module-driven development principles with proper validation
 */
const AuthContext = createContext()

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Authentication provider component
 * Manages user authentication state for Supabase Magic Link login
 */
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Initialize authentication state
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setAuthError(null)

    getSession().then(({ data, error }) => {
      if (!mounted) return
      if (error) console.warn('getSession error', error)
      if (data?.session?.user) {
        setCurrentUser(data.session.user)
        // optional side-effects; do them after state so they don't block
        queueMicrotask(async () => {
          try {
            if (data.session.user.id) {
              await activateUserOnLogin(data.session.user.id)
              dispatch(fetchUserProfile(data.session.user.id))
            }
          } catch {}
        })
      }
      setLoading(false)
    })

    const { data: sub } = onAuthStateChange((evt, session) => {
      setCurrentUser(session?.user ?? null)
      // non-blocking follow-ups
      queueMicrotask(async () => {
        try {
          if (evt === 'SIGNED_IN' && session?.user?.id) {
            await activateUserOnLogin(session.user.id)
            dispatch(fetchUserProfile(session.user.id))
          }
          if (evt === 'SIGNED_OUT') {
            dispatch(clearProfile())
          }
        } catch {}
      })
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // Magic Link login function
  const login = useCallback(async (email) => {
    try {
      if (!email || typeof email !== 'string') {
        return {
          success: false,
          error: 'Valid email address is required'
        }
      }

      setLoading(true)
      setAuthError(null)

      const result = await sendMagicLink(email, window.location.origin)

      if (result.success) {
        return {
          success: true,
          message: result.message
        }
      } else {
        setAuthError(result.error)
        return {
          success: false,
          error: result.error
        }
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error)
      const errorMessage = 'An unexpected error occurred during login'
      setAuthError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(
    async (scope = 'global') => {
      try {
        setLoading(true)
        setAuthError(null)

        const result = await signOut(scope)

        if (result.success) {
          setCurrentUser(null)
          // Clear profile data on logout
          dispatch(clearProfile())
          return {
            success: true,
            message: result.message
          }
        } else {
          setAuthError(result.error)
          return {
            success: false,
            error: result.error
          }
        }
      } catch (error) {
        console.error('AuthContext: Logout error:', error)
        const errorMessage = 'An unexpected error occurred during logout'
        setAuthError(errorMessage)
        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      const authenticated = await isAuthenticated()
      return authenticated
    } catch (error) {
      console.error('AuthContext: Error checking auth status:', error)
      return false
    }
  }, [])

  // Get current user data
  const getUser = useCallback(async () => {
    try {
      const result = await getCurrentUser()
      if (result.success) {
        return result.user
      }
      return null
    } catch (error) {
      console.error('AuthContext: Error getting user:', error)
      return null
    }
  }, [])

  const value = {
    currentUser,
    loading,
    authError,
    login,
    logout,
    checkAuthStatus,
    getUser,
    isAuthenticated: Boolean(currentUser)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
