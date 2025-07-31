// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

// Components
export { default as ProfileModal } from './components/ProfileModal'
export { default as ProfileAvatar } from './components/ProfileAvatar'
export { default as ProfileDisplay } from './components/ProfileDisplay'

// Hooks
export { useProfile } from './hooks/useProfile'

// Utilities
export { getAvatarPublicUrl } from '../../lib/supabase-controller'

// Store
export { default as profileReducer } from './store/profileSlice'
export {
  fetchUserProfile,
  updateProfile,
  setProfileData,
  setLoading,
  setError,
  clearError,
  clearProfile,
  selectProfile,
  selectProfileLoading,
  selectProfileUpdating,
  selectProfileError,
  selectLastUpdated
} from './store/profileSlice'
