// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './client'

export default function AuthCallback() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        if (window.location.hash.includes('access_token=')) {
          const params = new URLSearchParams(window.location.hash.substring(1))
          const access_token = params.get('access_token')
          const refresh_token = params.get('refresh_token')
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error) throw error
          }
        } else if (location.search.includes('code=')) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (error) throw error
        }

        window.history.replaceState({}, '', window.location.pathname)
        navigate('/business-dashboard', { replace: true })
      } catch (e) {
        console.error('Auth callback error', e)
        navigate('/login', { replace: true })
      }
    })()
  }, [location, navigate])

  return null
}
