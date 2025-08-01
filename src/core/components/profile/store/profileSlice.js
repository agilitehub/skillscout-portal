// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserProfile, updateUserProfile, uploadAvatarToStorage } from '../../../lib/supabase-controller'

/**
 * Async thunk for fetching user profile data
 */
export const fetchUserProfile = createAsyncThunk('profile/fetchUserProfile', async (userId, { rejectWithValue }) => {
  try {
    const result = await getUserProfile(userId)

    if (result.success) {
      return result.data
    } else {
      return rejectWithValue(result.error)
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return rejectWithValue('Failed to fetch user profile')
  }
})

/**
 * Async thunk for updating user profile
 */
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData, avatarFile }, { rejectWithValue }) => {
    try {
      let avatarUrl = profileData.avatar_url

      // Upload avatar if provided
      if (avatarFile) {
        const avatarResult = await uploadAvatarToStorage(avatarFile, userId)

        if (avatarResult.success) {
          avatarUrl = avatarResult.data.url
        } else {
          return rejectWithValue(`Avatar upload failed: ${avatarResult.error}`)
        }
      }

      // Update profile with avatar URL
      const updateData = {
        ...profileData,
        avatar_url: avatarUrl
      }

      const result = await updateUserProfile(userId, updateData)

      if (result.success) {
        return result.data
      } else {
        return rejectWithValue(result.error)
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return rejectWithValue('Failed to update user profile')
    }
  }
)

/**
 * Profile slice for Redux state management
 */
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileData: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    lastUpdated: null,
    isUserProfileOpen: false
  },
  reducers: {
    // Synchronous actions
    setProfileData: (state, action) => {
      state.profileData = action.payload
      state.lastUpdated = Date.now()
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearProfile: (state) => {
      state.profileData = null
      state.isLoading = false
      state.isUpdating = false
      state.error = null
      state.lastUpdated = null
    },
    setUserProfileOpen: (state, action) => {
      state.isUserProfileOpen = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profileData = action.payload
        state.lastUpdated = Date.now()
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false
        state.profileData = action.payload
        state.lastUpdated = Date.now()
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
  }
})

// Export actions
export const { setProfileData, setLoading, setError, clearError, clearProfile, setUserProfileOpen } =
  profileSlice.actions

// Selectors
export const selectProfile = (state) => state.profile.profileData
export const selectProfileLoading = (state) => state.profile.isLoading
export const selectProfileUpdating = (state) => state.profile.isUpdating
export const selectProfileError = (state) => state.profile.error
export const selectLastUpdated = (state) => state.profile.lastUpdated
export const selectUserProfileOpen = (state) => state.profile.isUserProfileOpen

// Export default reducer
export default profileSlice.reducer
