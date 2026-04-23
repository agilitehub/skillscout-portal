// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'

/**
 * Single Supabase client for the app (auth + data). Auth options match prior supabase-controller setup.
 */

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  console.error('Auth client: REACT_APP_SUPABASE_URL is not configured')
}

if (!SUPABASE_ANON_KEY) {
  console.error('Auth client: REACT_APP_SUPABASE_ANON_KEY is not configured')
}

const createSupabaseClient = () => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Auth client: Missing required environment variables')
      return null
    }

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        multiTab: false
      }
    })
  } catch (error) {
    console.error('Auth client: Error creating client:', error)
    return null
  }
}

export const supabase = createSupabaseClient()
