// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { useState, useCallback, useEffect } from 'react'
import { fetchPotentialCandidates } from '../controllers/potentialCandidates'

/**
 * Load org-scoped potential candidate matches for the Business Dashboard home.
 * @param {string|null|undefined} orgId
 */
export function usePotentialCandidates(orgId) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!orgId) {
      setMatches([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await fetchPotentialCandidates(orgId)
      if (result.success) {
        setMatches(result.data)
      } else {
        setMatches([])
        setError(result.error)
      }
    } catch (e) {
      setMatches([])
      setError('Failed to load potential candidates')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    load()
  }, [load])

  return { matches, loading, error, refresh: load }
}
