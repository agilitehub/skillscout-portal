// Diagnostics.tsx
import { useEffect } from 'react'
import { supabase } from './core/lib/supabase-controller'

export default function Diagnostics() {
  useEffect(() => {
    // 1) Global error hooks
    const onErr = (e) => console.error('[global error]', e)
    const onRej = (e) => console.error('[unhandledrejection]', e.reason || e)
    window.addEventListener('error', onErr)
    window.addEventListener('unhandledrejection', onRej)

    // 2) Fetch logger
    const origFetch = window.fetch
    // @ts-ignore
    window.fetch = async (...args) => {
      const [input, init] = args
      const url = typeof input === 'string' ? input : input.url
      console.log('[fetch]', url, init || {})
      try {
        const res = await origFetch(...args)
        console.log('[fetch:done]', url, res.status)
        return res
      } catch (e) {
        console.log('[fetch:err]', url, e)
        throw e
      }
    }

    // 3) Auth listener
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      console.log('[auth evt]', evt, { user: session?.user?.id })
    })

    // 4) getSession with timeout
    const ctrl = new AbortController()
    const t = setTimeout(() => {
      console.warn('[getSession] timed out after 5s')
      ctrl.abort()
    }, 5000)
    ;(async () => {
      try {
        console.log('[getSession] start')
        const { data, error } = await supabase.auth.getSession()
        console.log('[getSession] result', { error, hasSession: !!data?.session })
      } catch (e) {
        console.error('[getSession] error', e)
      } finally {
        clearTimeout(t)
      }
    })()

    return () => {
      window.removeEventListener('error', onErr)
      window.removeEventListener('unhandledrejection', onRej)
      // @ts-ignore
      window.fetch = origFetch
      sub?.subscription?.unsubscribe?.()
      ctrl.abort()
    }
  }, [])

  return null
}
