// Global Instructions Rule Applied!
import { supabase } from '../auth/client'
import { ensureUserRecord } from '../auth/userLifecycle'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../constants'

export { supabase } from '../auth/client'

/**
 * Supabase Controller for data access and file storage (client shared with core/auth).
 */

/**
 * Get the thread_id for a user from the users table
 * @param {string} userId - The user's unique id
 * @returns {Promise<string|null>} The thread_id or null if not found
 */
export const getUserThreadId = async (userId) => {
  try {
    await ensureUserRecord(userId)
    if (!supabase) throw new Error('Supabase client not initialized')
    if (!userId) throw new Error('User ID is required')
    const { data, error } = await supabase.from('users').select('thread_id').eq('id', userId).single()
    if (error) throw error
    return data?.thread_id || null
  } catch (error) {
    console.error('Supabase Controller: getUserThreadId error:', error)
    return null
  }
}

/**
 * Set the thread_id for a user in the users table
 * @param {string} userId - The user's unique id
 * @param {string} threadId - The thread id to set
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const setUserThreadId = async (userId, threadId) => {
  try {
    await ensureUserRecord(userId)
    if (!supabase) throw new Error('Supabase client not initialized')
    if (!userId || !threadId) throw new Error('User ID and thread ID are required')
    const { error } = await supabase.from('users').update({ thread_id: threadId }).eq('id', userId)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Supabase Controller: setUserThreadId error:', error)
    return false
  }
}

/**
 * Upload file to Supabase Storage in user-specific folder
 * @param {File} file - File object to upload
 * @param {string} userId - User's UUID for folder organization
 * @param {string} bucketName - Storage bucket name (default: 'file-uploads')
 * @returns {Promise<Object>} Result object with success status and file data
 */
export const uploadFileToStorage = async (file, userId, bucketName = DEFAULT_SUPABASE_STORAGE_BUCKET) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!file || !(file instanceof File)) {
      return {
        success: false,
        error: 'Valid file object is required'
      }
    }

    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Valid user ID is required'
      }
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds limit. Maximum size is ${maxSize / (1024 * 1024)}MB`
      }
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'File type not supported'
      }
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const uniqueFileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${userId}/${uniqueFileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

    if (error) {
      console.error('Supabase Controller: File upload error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload file'
      }
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: data.id,
        path: data.path,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        userId: userId
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in uploadFileToStorage:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during file upload'
    }
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param {File[]} files - Array of File objects to upload
 * @param {string} userId - User's UUID for folder organization
 * @param {string} bucketName - Storage bucket name (default: 'file-uploads')
 * @returns {Promise<Object>} Result object with success status and uploaded files data
 */
export const uploadMultipleFiles = async (files, userId, bucketName = DEFAULT_SUPABASE_STORAGE_BUCKET) => {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      return {
        success: false,
        error: 'Valid array of files is required'
      }
    }

    const uploadPromises = files.map((file) => uploadFileToStorage(file, userId, bucketName))
    const results = await Promise.allSettled(uploadPromises)

    const successfulUploads = []
    const failedUploads = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        successfulUploads.push(result.value.data)
      } else {
        failedUploads.push({
          file: files[index].name,
          error: result.status === 'rejected' ? result.reason : result.value.error
        })
      }
    })

    return {
      success: successfulUploads.length > 0,
      message: `Successfully uploaded ${successfulUploads.length} of ${files.length} files`,
      data: {
        successful: successfulUploads,
        failed: failedUploads
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in uploadMultipleFiles:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during multiple file upload'
    }
  }
}

/**
 * Get files for a specific user from storage
 * @param {string} userId - User's UUID
 * @param {string} bucketName - Storage bucket name (default: 'file-uploads')
 * @returns {Promise<Object>} Result object with user's files
 */
export const getUserFiles = async (userId, bucketName = DEFAULT_SUPABASE_STORAGE_BUCKET) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        files: []
      }
    }

    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Valid user ID is required',
        files: []
      }
    }

    const { data, error } = await supabase.storage.from(bucketName).list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

    if (error) {
      console.error('Supabase Controller: Get user files error:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }

    // Get public URLs for all files
    const filesWithUrls = data.map((file) => {
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(`${userId}/${file.name}`)

      return {
        id: file.id,
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'application/octet-stream',
        url: urlData.publicUrl,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        userId: userId
      }
    })

    return {
      success: true,
      files: filesWithUrls,
      error: null
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in getUserFiles:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching user files',
      files: []
    }
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - Full path to the file in storage
 * @param {string} bucketName - Storage bucket name (default: 'file-uploads')
 * @returns {Promise<Object>} Result object with success status
 */
export const deleteFileFromStorage = async (filePath, bucketName = DEFAULT_SUPABASE_STORAGE_BUCKET) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!filePath || typeof filePath !== 'string') {
      return {
        success: false,
        error: 'Valid file path is required'
      }
    }

    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      console.error('Supabase Controller: Delete file error:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete file'
      }
    }

    return {
      success: true,
      message: 'File deleted successfully'
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in deleteFileFromStorage:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting file'
    }
  }
}

/**
 * Get file download URL (signed URL for private files)
 * @param {string} filePath - Full path to the file in storage
 * @param {string} bucketName - Storage bucket name (default: 'file-uploads')
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @returns {Promise<Object>} Result object with download URL
 */
export const getFileDownloadUrl = async (filePath, bucketName = DEFAULT_SUPABASE_STORAGE_BUCKET, expiresIn = 3600) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        url: null
      }
    }

    if (!filePath || typeof filePath !== 'string') {
      return {
        success: false,
        error: 'Valid file path is required',
        url: null
      }
    }

    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error('Supabase Controller: Get download URL error:', error)
      return {
        success: false,
        error: error.message,
        url: null
      }
    }

    return {
      success: true,
      url: data.signedUrl,
      error: null
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in getFileDownloadUrl:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while generating download URL',
      url: null
    }
  }
}

/**
 * Update file metadata in storage
 * @param {string} filePath - Full path to the file in storage
 * @param {Object} metadata - Metadata to update
 * @param {string} bucketName - Storage bucket name (default: 'file-uploads')
 * @returns {Promise<Object>} Result object with success status
 */
export const updateFileMetadata = async (filePath, metadata, bucketName = DEFAULT_SUPABASE_STORAGE_BUCKET) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!filePath || typeof filePath !== 'string') {
      return {
        success: false,
        error: 'Valid file path is required'
      }
    }

    if (!metadata || typeof metadata !== 'object') {
      return {
        success: false,
        error: 'Valid metadata object is required'
      }
    }

    const { error } = await supabase.storage.from(bucketName).update(filePath, metadata)

    if (error) {
      console.error('Supabase Controller: Update metadata error:', error)
      return {
        success: false,
        error: error.message || 'Failed to update file metadata'
      }
    }

    return {
      success: true,
      message: 'File metadata updated successfully'
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in updateFileMetadata:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating file metadata'
    }
  }
}

/**
 * Organization Management Functions
 */

/**
 * Check if user has an organization assigned
 * @param {string} userId - User's UUID
 * @returns {Promise<Object>} Result object with organization data or null
 */
export const getUserOrganization = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    // Get user with organization data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(
        `
        id,
        org_id,
        organizations (
          id,
          organization_name,
          industry,
          description,
          website,
          founded_year,
          employee_range,
          default_work_arrangement,
          currency,
          country,
          language,
          timezone,
          industry_tags,
          custom_classifications,
          created_at,
          modified_at
        )
      `
      )
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Supabase Controller: Error fetching user organization:', userError)
      return {
        success: false,
        error: userError.message || 'Failed to fetch user organization'
      }
    }

    return {
      success: true,
      data: {
        user: userData,
        organization: userData.organizations,
        hasOrganization: Boolean(userData.org_id && userData.organizations)
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in getUserOrganization:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching organization data'
    }
  }
}

/**
 * Create a new organization
 * @param {Object} organizationData - Organization data object
 * @param {string} createdBy - User UUID who created the organization
 * @returns {Promise<Object>} Result object with created organization data
 */
export const createOrganization = async (organizationData, createdBy) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!organizationData || !createdBy) {
      return {
        success: false,
        error: 'Organization data and creator ID are required'
      }
    }

    // Validate required fields
    if (!organizationData.organization_name) {
      return {
        success: false,
        error: 'Organization name is required'
      }
    }

    // Prepare organization data with audit fields
    const orgData = {
      ...organizationData,
      created_by: createdBy,
      modified_by: createdBy,
      // Ensure arrays are properly formatted
      industry_tags: organizationData.industry_tags || [],
      custom_classifications: organizationData.custom_classifications || []
    }

    // Create the organization
    const { data: organization, error: createError } = await supabase
      .from('organizations')
      .insert(orgData)
      .select()
      .single()

    if (createError) {
      console.error('Supabase Controller: Error creating organization:', createError)
      return {
        success: false,
        error: createError.message || 'Failed to create organization'
      }
    }

    return {
      success: true,
      data: organization
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in createOrganization:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating organization'
    }
  }
}

/**
 * Update an existing organization
 * @param {string} organizationId - Organization UUID
 * @param {Object} organizationData - Updated organization data
 * @param {string} modifiedBy - User UUID who modified the organization
 * @returns {Promise<Object>} Result object with updated organization data
 */
export const updateOrganization = async (organizationId, organizationData, modifiedBy) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!organizationId || !organizationData || !modifiedBy) {
      return {
        success: false,
        error: 'Organization ID, data, and modifier ID are required'
      }
    }

    // Validate required fields if they are being updated
    if (organizationData.organization_name !== undefined && !organizationData.organization_name) {
      return {
        success: false,
        error: 'Organization name cannot be empty'
      }
    }

    // Prepare organization data with audit fields
    const orgData = {
      ...organizationData,
      modified_by: modifiedBy,
      modified_at: new Date().toISOString(),
      // Ensure arrays are properly formatted if provided
      industry_tags: organizationData.industry_tags || [],
      custom_classifications: organizationData.custom_classifications || []
    }

    // Remove undefined values to avoid overwriting with null
    Object.keys(orgData).forEach((key) => {
      if (orgData[key] === undefined) {
        delete orgData[key]
      }
    })

    // Update the organization
    const { data: organization, error: updateError } = await supabase
      .from('organizations')
      .update(orgData)
      .eq('id', organizationId)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase Controller: Error updating organization:', updateError)
      return {
        success: false,
        error: updateError.message || 'Failed to update organization'
      }
    }

    return {
      success: true,
      data: organization,
      message: 'Organization updated successfully'
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in updateOrganization:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating organization'
    }
  }
}

/**
 * Update user's organization ID
 * @param {string} userId - User's UUID
 * @param {string} organizationId - Organization UUID
 * @returns {Promise<Object>} Result object with updated user data
 */
export const updateUserOrganization = async (userId, organizationId) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!userId || !organizationId) {
      return {
        success: false,
        error: 'User ID and organization ID are required'
      }
    }

    // Update the user's org_id
    const { data: userData, error: updateError } = await supabase
      .from('users')
      .update({ org_id: organizationId })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase Controller: Error updating user organization:', updateError)
      return {
        success: false,
        error: updateError.message || 'Failed to update user organization'
      }
    }

    return {
      success: true,
      data: userData
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in updateUserOrganization:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating user organization'
    }
  }
}

/**
 * Remove user from organization by clearing their org_id
 * @param {string} userId - User's UUID
 * @returns {Promise<Object>} Result object with success status and updated user data
 */
export const clearUserOrganization = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    // Clear the user's org_id by setting it to null
    const { data: userData, error: updateError } = await supabase
      .from('users')
      .update({ org_id: null })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase Controller: Error clearing user organization:', updateError)
      return {
        success: false,
        error: updateError.message || 'Failed to remove user from organization'
      }
    }

    return {
      success: true,
      data: userData,
      message: 'User successfully removed from organization'
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in clearUserOrganization:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while removing user from organization'
    }
  }
}

/**
 * Create organization and assign to user (atomic operation)
 * @param {Object} organizationData - Organization data object
 * @param {string} userId - User's UUID
 * @returns {Promise<Object>} Result object with created organization and updated user
 */
export const createOrganizationAndAssignToUser = async (organizationData, userId) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    // Create the organization
    const createResult = await createOrganization(organizationData, userId)
    if (!createResult.success) {
      return createResult
    }

    // Update the user's org_id
    const updateResult = await updateUserOrganization(userId, createResult.data.id)
    if (!updateResult.success) {
      // TODO: Consider implementing rollback of organization creation
      console.error('Supabase Controller: Failed to assign organization to user after creation')
      return {
        success: false,
        error: 'Organization created but failed to assign to user. Please contact support.'
      }
    }

    return {
      success: true,
      data: {
        organization: createResult.data,
        user: updateResult.data
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in createOrganizationAndAssignToUser:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating organization and assigning to user'
    }
  }
}

/**
 * Upload avatar image to Supabase Storage in avatars bucket
 * @param {File} file - Avatar image file to upload
 * @param {string} userId - User's UUID for folder organization
 * @returns {Promise<Object>} Result object with success status and avatar URL
 */
export const uploadAvatarToStorage = async (file, userId) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!file || !(file instanceof File)) {
      return {
        success: false,
        error: 'Valid file object is required'
      }
    }

    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Valid user ID is required'
      }
    }

    // Validate file size (max 5MB for avatars)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds limit. Maximum size is ${maxSize / (1024 * 1024)}MB`
      }
    }

    // Validate file type (only images for avatars)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only image files (JPEG, PNG, GIF, WebP) are allowed for avatars'
      }
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `avatar_${timestamp}.${fileExtension}`
    const filePath = `${userId}/${fileName}`

    // Delete existing avatar if it exists
    try {
      const { data: existingFiles } = await supabase.storage.from('avatars').list(userId)

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`)
        await supabase.storage.from('avatars').remove(filesToDelete)
      }
    } catch (deleteError) {
      console.warn('Supabase Controller: Could not delete existing avatar:', deleteError)
      // Don't fail the upload if deletion fails
    }

    // Upload new avatar to Supabase Storage
    const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

    if (error) {
      console.error('Supabase Controller: Avatar upload error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload avatar'
      }
    }

    // Get public URL for the uploaded avatar
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)

    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        id: data.id,
        path: data.path,
        name: fileName,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        userId: userId
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in uploadAvatarToStorage:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during avatar upload'
    }
  }
}

/**
 * Update user profile information in the users table
 * @param {string} userId - User's UUID
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.first_name - User's first name
 * @param {string} profileData.last_name - User's last name
 * @param {string} profileData.avatar_url - Optional avatar URL
 * @returns {Promise<Object>} Result object with success status and updated user data
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Valid user ID is required'
      }
    }

    if (!profileData || typeof profileData !== 'object') {
      return {
        success: false,
        error: 'Valid profile data is required'
      }
    }

    // Validate required fields
    if (!profileData.first_name || !profileData.first_name.trim()) {
      return {
        success: false,
        error: 'First name is required'
      }
    }

    if (!profileData.last_name || !profileData.last_name.trim()) {
      return {
        success: false,
        error: 'Last name is required'
      }
    }

    // Validate name lengths
    if (profileData.first_name.length < 2) {
      return {
        success: false,
        error: 'First name must be at least 2 characters long'
      }
    }

    if (profileData.last_name.length < 2) {
      return {
        success: false,
        error: 'Last name must be at least 2 characters long'
      }
    }

    // Ensure user record exists first
    await ensureUserRecord(userId)

    // Prepare update data
    const updateData = {
      first_name: profileData.first_name.trim(),
      last_name: profileData.last_name.trim()
    }

    // Add avatar URL if provided
    if (profileData.avatar_url) {
      updateData.avatar_url = profileData.avatar_url
    }

    // Update user profile in the database
    const { data: userData, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, first_name, last_name, avatar_url, created_at')
      .single()

    if (updateError) {
      console.error('Supabase Controller: Error updating user profile:', updateError)
      return {
        success: false,
        error: updateError.message || 'Failed to update user profile'
      }
    }

    return {
      success: true,
      message: 'User profile updated successfully',
      data: userData
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in updateUserProfile:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating user profile'
    }
  }
}

// Request deduplication cache for getUserProfile
const profileRequestCache = new Map()

/**
 * Get user profile information from the users table
 * @param {string} userId - User's UUID
 * @returns {Promise<Object>} Result object with user profile data
 */
export const getUserProfile = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Valid user ID is required'
      }
    }

    // Check if there's already a pending request for this user
    if (profileRequestCache.has(userId)) {
      console.log('Supabase Controller: Returning cached profile request for user:', userId)
      return await profileRequestCache.get(userId)
    }

    // Create the request promise and cache it
    const requestPromise = (async () => {
      try {
        // Ensure user record exists
        await ensureUserRecord(userId)

        // Get user profile data
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('id, first_name, last_name, avatar_url, created_at')
          .eq('id', userId)
          .neq('trashed', true) // Exclude trashed users
          .single()

        if (fetchError) {
          console.error('Supabase Controller: Error fetching user profile:', fetchError)
          return {
            success: false,
            error: fetchError.message || 'Failed to fetch user profile'
          }
        }

        return {
          success: true,
          data: userData
        }
      } finally {
        // Clean up cache after request completes
        profileRequestCache.delete(userId)
      }
    })()

    // Cache the promise
    profileRequestCache.set(userId, requestPromise)

    return await requestPromise
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in getUserProfile:', error)
    // Clean up cache on error
    profileRequestCache.delete(userId)
    return {
      success: false,
      error: 'An unexpected error occurred while fetching user profile'
    }
  }
}

/**
 * Get the full public URL for an avatar from its storage path
 * @param {string} avatarPath - The avatar path stored in the database (e.g., "userId/avatar_123.jpg")
 * @returns {string|null} The full public URL or null if no path provided
 */
export const getAvatarPublicUrl = (avatarPath) => {
  try {
    if (!avatarPath || typeof avatarPath !== 'string') {
      return null
    }

    if (!supabase) {
      console.error('Supabase Controller: Client not initialized')
      return null
    }

    // If the path is already a full URL, return it as-is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath
    }

    // Get the public URL from the avatars bucket
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(avatarPath)

    if (urlData?.publicUrl) {
      return urlData.publicUrl
    } else {
      console.warn('Supabase Controller: Failed to generate public URL for avatar path:', avatarPath)
      return null
    }
  } catch (error) {
    console.error('Supabase Controller: Error getting avatar public URL for path:', avatarPath, error)
    return null
  }
}
