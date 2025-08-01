// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useSelector } from 'react-redux'
import { selectProfile } from '../store/profileSlice'

/**
 * Profile Display Component
 * Shows user's display name with fallback to legacy data
 * Integrates with Redux state for real-time updates
 */
const ProfileDisplay = ({
  user = null,
  format = 'full', // 'full', 'first', 'last', 'initials'
  className = '',
  fallback = 'User',
  ...props
}) => {
  const profileData = useSelector(selectProfile)

  /**
   * Get user's display name based on format
   */
  const getDisplayName = () => {
    // Use Redux profile data if available
    const firstName = profileData?.first_name || user?.ProfileEntryResponse?.FirstName || ''
    const lastName = profileData?.last_name || user?.ProfileEntryResponse?.LastName || ''

    switch (format) {
      case 'full':
        if (firstName && lastName) {
          return `${firstName} ${lastName}`
        }
        break
      case 'first':
        if (firstName) {
          return firstName
        }
        break
      case 'last':
        if (lastName) {
          return lastName
        }
        break
      case 'initials':
        if (firstName && lastName) {
          return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
        } else if (firstName) {
          return firstName.charAt(0).toUpperCase()
        }
        break
      default:
        break
    }

    // Fallback to legacy username or provided fallback
    return user?.ProfileEntryResponse?.Username || user?.name || fallback
  }

  const displayName = getDisplayName()

  return (
    <span className={className} {...props}>
      {displayName}
    </span>
  )
}

export default ProfileDisplay
