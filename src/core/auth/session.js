// Global Instructions Rule Applied!
import { supabase } from './client'

/**
 * Supabase auth/session helpers (magic link, session, sign-out).
 */

export const sendMagicLink = async (email, redirectTo = window.location.origin) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Valid email address is required'
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}/auth/callback`
      }
    })

    if (error) {
      console.error('Auth session: Magic link error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send magic link'
      }
    }

    return {
      success: true,
      message: 'Magic link sent successfully! Check your email.',
      data
    }
  } catch (error) {
    console.error('Auth session: Unexpected error in sendMagicLink:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export const getCurrentUser = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        user: null
      }
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth session: Get user error:', error)
      return {
        success: false,
        error: error.message,
        user: null
      }
    }

    return {
      success: true,
      user,
      error: null
    }
  } catch (error) {
    console.error('Auth session: Unexpected error in getCurrentUser:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      user: null
    }
  }
}

export const signOut = async (scope = 'global') => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    const { error } = await supabase.auth.signOut({ scope })

    if (error) {
      console.error('Auth session: Sign out error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      message: 'Signed out successfully'
    }
  } catch (error) {
    console.error('Auth session: Unexpected error in signOut:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export const onAuthStateChange = (callback) => {
  try {
    if (!supabase) {
      console.error('Auth session: Cannot listen to auth changes - client not initialized')
      return () => {}
    }

    if (typeof callback !== 'function') {
      console.error('Auth session: Callback must be a function')
      return () => {}
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        await callback(event, session)
      } catch (error) {
        console.error('Auth session: Error in auth state change callback:', error)
      }
    })

    return () => {
      try {
        subscription?.unsubscribe()
      } catch (error) {
        console.error('Auth session: Error unsubscribing from auth changes:', error)
      }
    }
  } catch (error) {
    console.error('Auth session: Error setting up auth state listener:', error)
    return () => {}
  }
}

export const getSession = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        session: null
      }
    }

    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Auth session: Get session error:', error)
      return {
        success: false,
        error: error.message,
        session: null
      }
    }

    return {
      success: true,
      session,
      error: null
    }
  } catch (error) {
    console.error('Auth session: Unexpected error in getSession:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      session: null
    }
  }
}

export const isAuthenticated = async () => {
  try {
    const result = await getCurrentUser()
    return result.success && result.user !== null
  } catch (error) {
    console.error('Auth session: Error checking authentication status:', error)
    return false
  }
}

export const refreshSession = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        session: null
      }
    }

    const {
      data: { session },
      error
    } = await supabase.auth.refreshSession()

    if (error) {
      console.error('Auth session: Refresh session error:', error)
      return {
        success: false,
        error: error.message,
        session: null
      }
    }

    return {
      success: true,
      session,
      error: null
    }
  } catch (error) {
    console.error('Auth session: Unexpected error in refreshSession:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      session: null
    }
  }
}
