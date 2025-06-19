import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Controller for Magic Link Authentication
 * Implements passwordless email authentication with comprehensive error handling
 * Follows module-driven development principles with proper validation
 */

// Environment variables for Supabase configuration
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('Supabase Controller: REACT_APP_SUPABASE_URL is not configured')
}

if (!SUPABASE_ANON_KEY) {
  console.error('Supabase Controller: REACT_APP_SUPABASE_ANON_KEY is not configured')
}

/**
 * Create Supabase client with error handling
 * @returns {Object|null} Supabase client instance or null if configuration is invalid
 */
const createSupabaseClient = () => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Supabase Controller: Missing required environment variables')
      return null
    }

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  } catch (error) {
    console.error('Supabase Controller: Error creating client:', error)
    return null
  }
}

// Initialize Supabase client
const supabase = createSupabaseClient()

/**
 * Send Magic Link to user's email
 * @param {string} email - User's email address
 * @param {string} redirectTo - URL to redirect after successful authentication
 * @returns {Promise<Object>} Result object with success status and message
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

    // Validate email format
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
        emailRedirectTo: redirectTo
      }
    })

    if (error) {
      console.error('Supabase Controller: Magic link error:', error)
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
    console.error('Supabase Controller: Unexpected error in sendMagicLink:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Result object with user data or null
 */
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
      console.error('Supabase Controller: Get user error:', error)
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
    console.error('Supabase Controller: Unexpected error in getCurrentUser:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      user: null
    }
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Result object with success status
 */
export const signOut = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Supabase Controller: Sign out error:', error)
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
    console.error('Supabase Controller: Unexpected error in signOut:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  try {
    if (!supabase) {
      console.error('Supabase Controller: Cannot listen to auth changes - client not initialized')
      return () => {}
    }

    if (typeof callback !== 'function') {
      console.error('Supabase Controller: Callback must be a function')
      return () => {}
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        await callback(event, session)
      } catch (error) {
        console.error('Supabase Controller: Error in auth state change callback:', error)
      }
    })

    return () => {
      try {
        subscription?.unsubscribe()
      } catch (error) {
        console.error('Supabase Controller: Error unsubscribing from auth changes:', error)
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Error setting up auth state listener:', error)
    return () => {}
  }
}

/**
 * Get current session
 * @returns {Promise<Object>} Result object with session data
 */
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
      console.error('Supabase Controller: Get session error:', error)
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
    console.error('Supabase Controller: Unexpected error in getSession:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      session: null
    }
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  try {
    const result = await getCurrentUser()
    return result.success && result.user !== null
  } catch (error) {
    console.error('Supabase Controller: Error checking authentication status:', error)
    return false
  }
}

/**
 * Refresh user session
 * @returns {Promise<Object>} Result object with refreshed session
 */
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
      console.error('Supabase Controller: Refresh session error:', error)
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
    console.error('Supabase Controller: Unexpected error in refreshSession:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      session: null
    }
  }
}

// Export the Supabase client for direct access if needed
export { supabase }
