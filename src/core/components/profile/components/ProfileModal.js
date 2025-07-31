// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Form, message, Upload, Avatar, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '../../../context/ThemeContext'
import Button from '../../Button'
import { getAvatarPublicUrl } from '../../../lib/supabase-controller'
import { fetchUserProfile, updateProfile, setError, clearError } from '../store/profileSlice'

/**
 * Profile Modal Component for editing user profile
 * Handles avatar uploads and profile updates with Redux state management
 */
const ProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch()
  const { darkMode } = useTheme()
  const { profileData, isLoading } = useSelector((state) => state.profile)

  const [form] = Form.useForm()
  const [isSaving, setIsSaving] = useState(false)
  const [uploadedAvatar, setUploadedAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Load profile data when modal opens (only if not already available)
  useEffect(() => {
    if (isOpen && user?.id && !profileData) {
      // Only fetch if profile data is not already available in Redux
      dispatch(fetchUserProfile(user.id)).catch((error) => {
        console.error('Error loading user profile:', error)
        dispatch(setError('Failed to load profile data. Please try again.'))
        message.error('Failed to load profile data. Please try again.')
      })
    }
  }, [isOpen, user?.id, profileData, dispatch])

  // Pre-populate form when modal opens or profile data changes
  useEffect(() => {
    if (isOpen) {
      if (profileData) {
        // Use Redux profile data (preferred)
        form.setFieldsValue({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || ''
        })

        // Set avatar preview with proper public URL
        if (profileData.avatar_url) {
          const publicUrl = getAvatarPublicUrl(profileData.avatar_url)
          if (publicUrl) {
            setAvatarPreview(publicUrl)
          }
        }
      } else {
        // Fallback to legacy data if no Supabase profile exists
        form.setFieldsValue({
          firstName: user?.ProfileEntryResponse?.FirstName || '',
          lastName: user?.ProfileEntryResponse?.LastName || ''
        })

        if (user?.ProfileEntryResponse?.ProfilePic) {
          // For legacy data, try to get public URL but fallback to original if it fails
          const publicUrl = getAvatarPublicUrl(user.ProfileEntryResponse.ProfilePic)
          setAvatarPreview(publicUrl || user.ProfileEntryResponse.ProfilePic)
        }
      }
    }
  }, [isOpen, profileData, user, form])

  /**
   * Get the proper avatar URL for display
   */
  const getDisplayAvatarUrl = useCallback(() => {
    // Priority:
    // 1. Avatar preview (blob URL from file selection)
    // 2. Redux profile data (storage path that needs conversion)
    // 3. Legacy user data (might be full URL already)

    if (avatarPreview) {
      // This is either a blob URL from file selection or a full URL
      return avatarPreview
    }

    if (profileData?.avatar_url) {
      // Convert storage path to full public URL
      return getAvatarPublicUrl(profileData.avatar_url)
    }

    if (user?.ProfileEntryResponse?.ProfilePic) {
      // Legacy data - try to convert but fallback to original if it fails
      return getAvatarPublicUrl(user.ProfileEntryResponse.ProfilePic) || user.ProfileEntryResponse.ProfilePic
    }

    return null
  }, [avatarPreview, profileData?.avatar_url, user?.ProfileEntryResponse?.ProfilePic])

  /**
   * Handle avatar file selection and validation
   */
  const handleAvatarChange = useCallback((file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      message.error('Only image files (JPEG, PNG, GIF, WebP) are allowed for profile pictures.')
      return false
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      message.error('File size exceeds limit. Maximum size is 5MB.')
      return false
    }

    // Store the file for upload
    setUploadedAvatar(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    return false // Prevent automatic upload
  }, [])

  /**
   * Handle modal close with cleanup
   */
  const handleClose = useCallback(() => {
    form.resetFields()
    setUploadedAvatar(null)
    setAvatarPreview(null)
    setIsSaving(false)
    dispatch(clearError())
    onClose()
  }, [form, dispatch, onClose])

  /**
   * Handle profile form submission
   */
  const handleSave = useCallback(
    async (values) => {
      if (!user?.id) {
        message.error('User not authenticated. Please log in again.')
        return
      }

      setIsSaving(true)
      dispatch(clearError())

      try {
        // Prepare profile data
        const profileUpdateData = {
          first_name: values.firstName,
          last_name: values.lastName
        }

        // Add current avatar URL if exists
        if (avatarPreview && !uploadedAvatar) {
          profileUpdateData.avatar_url = avatarPreview
        }

        // Use Redux thunk to update profile (includes avatar upload if needed)
        const result = await dispatch(
          updateProfile({
            userId: user.id,
            profileData: profileUpdateData,
            avatarFile: uploadedAvatar
          })
        )

        if (updateProfile.fulfilled.match(result)) {
          message.success('Profile updated successfully!')
          handleClose()
        } else {
          // Handle rejected case
          const errorMessage = result.payload || 'Failed to update profile. Please try again.'
          dispatch(setError(errorMessage))
          message.error(errorMessage)
        }
      } catch (error) {
        console.error('Error saving user profile:', error)
        const errorMessage = 'An unexpected error occurred. Please try again.'
        dispatch(setError(errorMessage))
        message.error(errorMessage)
      } finally {
        setIsSaving(false)
      }
    },
    [user?.id, uploadedAvatar, avatarPreview, dispatch, handleClose]
  )

  return (
    <Modal
      title={
        <div className='flex items-center space-x-2'>
          <FontAwesomeIcon icon={faUser} style={{ color: darkMode ? '#10b981' : '#059669' }} />
          <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>User Profile</span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={500}
      className={darkMode ? 'ant-modal-dark' : ''}
      styles={{
        content: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        },
        body: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        },
        header: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          borderBottom: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
        }
      }}
    >
      {/* Dark Mode Form Styling */}
      {darkMode && (
        <style>
          {`
             .user-profile-form .ant-form-item-label > label {
               color: #E5E7EB !important;
             }
             .user-profile-form .ant-input {
               background-color: #4B5563 !important;
               border-color: #6B7280 !important;
               color: #F9FAFB !important;
             }
             .user-profile-form .ant-input:focus {
               border-color: #059669 !important;
               box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
             }
             .user-profile-form .ant-input::placeholder {
               color: #9CA3AF !important;
             }
             .user-profile-form .ant-upload.ant-upload-select {
               background-color: #4B5563 !important;
               border-color: #6B7280 !important;
             }
             .user-profile-form .ant-upload.ant-upload-select:hover {
               border-color: #059669 !important;
             }
             .user-profile-form .ant-upload-text {
               color: #E5E7EB !important;
             }
             .user-profile-form .ant-upload-hint {
               color: #9CA3AF !important;
             }
           `}
        </style>
      )}

      <div className='space-y-6'>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p className='mb-3'>Update your personal information and profile picture.</p>
        </div>

        <Form form={form} layout='vertical' onFinish={handleSave} className={`${darkMode ? 'user-profile-form' : ''}`}>
          {/* Profile Picture Upload */}
          <Form.Item
            label={<span className={darkMode ? 'text-gray-300' : ''}>Profile Picture</span>}
            name='profilePicture'
          >
            <div className='flex items-center space-x-4'>
              <Avatar
                size={80}
                src={getDisplayAvatarUrl()}
                icon={<FontAwesomeIcon icon={faUser} />}
                className={`${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              />
              <Upload accept='image/*' showUploadList={false} beforeUpload={handleAvatarChange}>
                <Button
                  icon={<FontAwesomeIcon icon={faUpload} />}
                  className={darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : ''}
                  loading={isLoading}
                >
                  Upload Photo
                </Button>
              </Upload>
            </div>
          </Form.Item>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>First Name</span>}
              name='firstName'
              rules={[
                { required: true, message: 'Please enter your first name' },
                { min: 2, message: 'First name must be at least 2 characters' }
              ]}
            >
              <Input placeholder='e.g. John' />
            </Form.Item>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Last Name</span>}
              name='lastName'
              rules={[
                { required: true, message: 'Please enter your last name' },
                { min: 2, message: 'Last name must be at least 2 characters' }
              ]}
            >
              <Input placeholder='e.g. Doe' />
            </Form.Item>
          </div>

          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600'>
            <Button
              onClick={handleClose}
              disabled={isSaving}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : ''}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={isSaving}
              disabled={isLoading}
              style={{
                backgroundColor: darkMode ? '#059669' : '#10b981',
                borderColor: darkMode ? '#059669' : '#10b981'
              }}
            >
              Save Profile
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ProfileModal
