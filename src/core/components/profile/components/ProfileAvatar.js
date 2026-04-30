// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Avatar } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { selectProfile } from '../../../store/slices/profileSlice'
import { getAvatarPublicUrl } from '../../../infra/supabase-controller'

/**
 * Profile Avatar Component
 * Displays user's profile picture with fallback to icon
 * Integrates with Redux state for real-time updates
 */
const ProfileAvatar = ({ size = 40, className = '', user = null, showFallback = true, ...props }) => {
  const profileData = useSelector(selectProfile)

  // Determine avatar source with priority:
  // 1. Redux profile data (most up-to-date) - convert storage path to full URL
  // 2. Legacy user data (might already be a full URL)
  // 3. Fallback icon
  const getAvatarSrc = () => {
    if (profileData?.avatar_url) {
      // Convert storage path to full public URL
      return getAvatarPublicUrl(profileData.avatar_url)
    }

    if (user?.ProfileEntryResponse?.ProfilePic) {
      // Legacy data might already be a full URL, but check anyway
      return getAvatarPublicUrl(user.ProfileEntryResponse.ProfilePic) || user.ProfileEntryResponse.ProfilePic
    }

    return null
  }

  const avatarSrc = getAvatarSrc()

  return (
    <Avatar
      size={size}
      src={avatarSrc}
      icon={showFallback ? <FontAwesomeIcon icon={faUser} /> : null}
      className={className}
      onError={(e) => {
        // Hide broken images gracefully - this will show the fallback icon
        console.warn('ProfileAvatar: Failed to load image:', avatarSrc)
        return false
      }}
      {...props}
    />
  )
}

export default ProfileAvatar
