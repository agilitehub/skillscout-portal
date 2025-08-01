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
  isAuthenticated
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
    const initializeAuth = async () => {
      try {
        setLoading(true)
        setAuthError(null)

        // Check for existing session
        const sessionResult = await getSession()
        if (sessionResult.success && sessionResult.session) {
          setCurrentUser(sessionResult.session.user)
          // Load user profile when session is restored
          if (sessionResult.session.user?.id) {
            dispatch(fetchUserProfile(sessionResult.session.user.id))
          }
        } else if (sessionResult.error) {
          console.warn('AuthContext: Session check error:', sessionResult.error)
        }

        // Set up auth state listener
        const unsubscribe = onAuthStateChange(async (event, session) => {
          try {
            console.log('AuthContext: Auth state changed:', event, session?.user?.email)

            if (event === 'SIGNED_IN' && session) {
              setCurrentUser(session.user)
              setAuthError(null)
              // Load user profile when user signs in (only if not already loaded from session restore)
              if (session.user?.id && !currentUser) {
                dispatch(fetchUserProfile(session.user.id))
              }
            } else if (event === 'SIGNED_OUT') {
              setCurrentUser(null)
              setAuthError(null)
              // Clear profile data when user signs out
              dispatch(clearProfile())
            } else if (event === 'TOKEN_REFRESHED' && session) {
              setCurrentUser(session.user)
            }
          } catch (error) {
            console.error('AuthContext: Error handling auth state change:', error)
            setAuthError('Authentication state change error')
          }
        })

        return unsubscribe
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error)
        setAuthError('Failed to initialize authentication')
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = initializeAuth()
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
    // eslint-disable-next-line
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

      const result = await sendMagicLink(email)

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
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setAuthError(null)

      const result = await signOut()

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
  }, [dispatch])

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
