// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { message } from 'antd'
import { getLiveResumeBundle, setPrimaryDataSource } from '../../../core/infra/live-resume-controller'
import { ingestResumeFile, remergeFromPrimarySource } from '../controllers/resumeIngestion'
import { buildResumePreviewData } from '../model/buildResumePreviewData'

/**
 * Hook for live resume data — fetch, upload, and primary source management.
 * @param {{ id?: string }|null} user
 */
export const useLiveResume = (user = null) => {
  const [bundle, setBundle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const hasLoadedOnceRef = useRef(false)
  const activeUserIdRef = useRef(user?.id)
  const refreshInFlightRef = useRef(0)

  const refreshLiveResume = useCallback(async () => {
    const userId = user?.id
    if (!userId) return

    activeUserIdRef.current = userId
    const isBackgroundRefresh = hasLoadedOnceRef.current

    if (isBackgroundRefresh) {
      refreshInFlightRef.current += 1
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const result = await getLiveResumeBundle(userId)
      if (activeUserIdRef.current !== userId) return

      if (result.success) {
        setBundle(result.data)
        hasLoadedOnceRef.current = true
      } else if (!isBackgroundRefresh) {
        setError(result.error)
      } else {
        console.warn('Background live resume refresh failed:', result.error)
      }
    } catch (err) {
      if (activeUserIdRef.current !== userId) return
      console.error('refreshLiveResume error:', err)
      if (!isBackgroundRefresh) {
        setError('Failed to load live resume')
      }
    } finally {
      if (isBackgroundRefresh) {
        refreshInFlightRef.current = Math.max(0, refreshInFlightRef.current - 1)
        if (refreshInFlightRef.current === 0) {
          setIsRefreshing(false)
        }
      } else if (activeUserIdRef.current === userId) {
        setIsLoading(false)
      }
    }
  }, [user?.id])

  useEffect(() => {
    hasLoadedOnceRef.current = false
    refreshInFlightRef.current = 0
    activeUserIdRef.current = user?.id
    setBundle(null)
    setIsLoading(Boolean(user?.id))
    setIsRefreshing(false)
    setError(null)

    if (user?.id) {
      refreshLiveResume()
    } else {
      setIsLoading(false)
    }
  }, [user?.id, refreshLiveResume])

  const resumeData = useMemo(() => buildResumePreviewData(bundle || {}), [bundle])

  const uploadAndParseResume = useCallback(
    async (file) => {
      if (!user?.id) {
        message.error('Please log in to upload a resume.')
        return { success: false }
      }

      setIsProcessing(true)
      setError(null)

      try {
        const result = await ingestResumeFile(user.id, file, { setAsPrimary: true })

        if (result.success) {
          message.success('Resume analyzed and added to your live profile.')
          await refreshLiveResume()
        } else {
          message.error(result.error || 'Failed to process resume')
          setError(result.error)
        }

        return result
      } catch (err) {
        console.error('uploadAndParseResume error:', err)
        message.error('An unexpected error occurred while processing your resume')
        return { success: false, error: 'Unexpected error' }
      } finally {
        setIsProcessing(false)
      }
    },
    [user?.id, refreshLiveResume]
  )

  const handleSetPrimarySource = useCallback(
    async (sourceId, resumeContent) => {
      if (!user?.id || !sourceId) return { success: false }

      setIsProcessing(true)
      try {
        const result = await remergeFromPrimarySource(user.id, sourceId, resumeContent)
        if (result.success) {
          message.success('Primary resume source updated.')
          await refreshLiveResume()
        } else {
          message.error(result.error || 'Failed to update primary source')
        }
        return result
      } finally {
        setIsProcessing(false)
      }
    },
    [user?.id, refreshLiveResume]
  )

  const promoteResumeAsPrimary = useCallback(
    async (resumeId) => {
      if (!user?.id || !resumeId) return

      const resume = bundle?.resumes?.find((r) => r.id === resumeId)
      const source = bundle?.dataSources?.find((s) => s.external_ref === resumeId)
      if (!resume || !source) return

      await handleSetPrimarySource(source.id, resume.content)
    },
    [user?.id, bundle, handleSetPrimarySource]
  )

  return {
    bundle,
    resumeData,
    isLoading,
    isRefreshing,
    isProcessing,
    error,
    refreshLiveResume,
    uploadAndParseResume,
    setPrimarySource: handleSetPrimarySource,
    promoteResumeAsPrimary
  }
}

export default useLiveResume
