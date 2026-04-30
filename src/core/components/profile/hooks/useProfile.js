// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
  fetchUserProfile,
  updateProfile,
  clearProfile,
  selectProfile,
  selectProfileLoading,
  selectProfileUpdating,
  selectProfileError,
  selectLastUpdated
} from '../../../store/slices/profileSlice'

/**
 * Custom hook for profile management
 * Provides easy access to profile state and actions
 */
export const useProfile = (userId = null) => {
  const dispatch = useDispatch()

  // Profile state selectors
  const profileData = useSelector(selectProfile)
  const isLoading = useSelector(selectProfileLoading)
  const isUpdating = useSelector(selectProfileUpdating)
  const error = useSelector(selectProfileError)
  const lastUpdated = useSelector(selectLastUpdated)

  /**
   * Load user profile data
   */
  const loadProfile = useCallback(
    async (userIdToLoad = userId) => {
      if (!userIdToLoad) {
        console.warn('useProfile: No user ID provided for profile loading')
        return
      }

      try {
        const result = await dispatch(fetchUserProfile(userIdToLoad))
        return result
      } catch (error) {
        console.error('useProfile: Error loading profile:', error)
        throw error
      }
    },
    [dispatch, userId]
  )

  /**
   * Update user profile
   */
  const saveProfile = useCallback(
    async (profileUpdateData, avatarFile = null) => {
      if (!userId) {
        console.warn('useProfile: No user ID provided for profile update')
        return
      }

      try {
        const result = await dispatch(
          updateProfile({
            userId,
            profileData: profileUpdateData,
            avatarFile
          })
        )
        return result
      } catch (error) {
        console.error('useProfile: Error updating profile:', error)
        throw error
      }
    },
    [dispatch, userId]
  )

  /**
   * Clear profile data (useful for logout)
   */
  const clearProfileData = useCallback(() => {
    dispatch(clearProfile())
  }, [dispatch])

  /**
   * Auto-load profile when userId changes (only if not already available and not stale)
   */
  useEffect(() => {
    if (userId && !profileData && !isLoading && !lastUpdated) {
      loadProfile(userId)
    }
  }, [userId, profileData, isLoading, lastUpdated, loadProfile])

  /**
   * Check if profile data is stale (older than 5 minutes)
   */
  const isProfileStale = useCallback(() => {
    if (!lastUpdated) return true
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() - lastUpdated > fiveMinutes
  }, [lastUpdated])

  /**
   * Get user's full name
   */
  const getFullName = useCallback(() => {
    if (profileData?.first_name && profileData?.last_name) {
      return `${profileData.first_name} ${profileData.last_name}`
    }
    return null
  }, [profileData])

  /**
   * Get user's initials
   */
  const getInitials = useCallback(() => {
    if (profileData?.first_name && profileData?.last_name) {
      return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase()
    } else if (profileData?.first_name) {
      return profileData.first_name.charAt(0).toUpperCase()
    }
    return null
  }, [profileData])

  /**
   * Check if user has complete profile
   */
  const hasCompleteProfile = useCallback(() => {
    return !!(profileData?.first_name && profileData?.last_name)
  }, [profileData])

  return {
    // State
    profileData,
    isLoading,
    isUpdating,
    error,
    lastUpdated,

    // Actions
    loadProfile,
    saveProfile,
    clearProfileData,

    // Computed values
    fullName: getFullName(),
    initials: getInitials(),
    hasCompleteProfile: hasCompleteProfile(),
    isProfileStale: isProfileStale(),

    // Helper functions
    getFullName,
    getInitials
  }
}
