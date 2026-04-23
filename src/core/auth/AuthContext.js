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
} from './session'
import { activateUserOnLogin } from './userLifecycle'
import { fetchUserProfile, clearProfile } from '../components/profile'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setAuthError(null)

    getSession().then((result) => {
      if (!mounted) return
      if (result.error) console.warn('getSession error', result.error)
      const sessionUser = result.session?.user
      if (sessionUser) {
        setCurrentUser(sessionUser)
        queueMicrotask(async () => {
          try {
            if (sessionUser.id) {
              await activateUserOnLogin(sessionUser.id)
              dispatch(fetchUserProfile(sessionUser.id))
            }
          } catch {}
        })
      }
      setLoading(false)
    })

    const unsubscribe = onAuthStateChange((evt, session) => {
      setCurrentUser(session?.user ?? null)
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
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

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

  const logout = useCallback(
    async (scope = 'global') => {
      try {
        setLoading(true)
        setAuthError(null)

        const result = await signOut(scope)

        if (result.success) {
          setCurrentUser(null)
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

  const checkAuthStatus = useCallback(async () => {
    try {
      const authenticated = await isAuthenticated()
      return authenticated
    } catch (error) {
      console.error('AuthContext: Error checking auth status:', error)
      return false
    }
  }, [])

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
