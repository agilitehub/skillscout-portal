// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { useState, useCallback, useEffect } from 'react'
import { getOrganizationCandidates } from '../controllers'

/**
 * Loads persisted organization candidates for the main table.
 */
export function useCandidateList() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getOrganizationCandidates()
      if (result.success) {
        setCandidates(result.data)
      } else {
        setCandidates([])
        setError(result.error || 'Failed to load candidates')
      }
    } catch (err) {
      console.error('useCandidateList error:', err)
      setCandidates([])
      setError('An unexpected error occurred while loading candidates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  return {
    candidates,
    loading,
    error,
    refetch: loadCandidates
  }
}
