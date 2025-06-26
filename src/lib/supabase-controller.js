import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Controller for Magic Link Authentication and File Storage
 * Implements passwordless email authentication with comprehensive error handling
 * Follows module-driven development principles with proper validation
 */

// Environment variables for Supabase configuration
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('Supabase Controller: REACT_APP_SUPABASE_URL is not configured')
}

if (!SUPABASE_ANON_KEY) {
  console.error('Supabase Controller: REACT_APP_SUPABASE_ANON_KEY is not configured')
}

/**
 * Create Supabase client with error handling
 * @returns {Object|null} Supabase client instance or null if configuration is invalid
 */
const createSupabaseClient = () => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Supabase Controller: Missing required environment variables')
      return null
    }

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  } catch (error) {
    console.error('Supabase Controller: Error creating client:', error)
    return null
  }
}

// Initialize Supabase client
const supabase = createSupabaseClient()

/**
 * Send Magic Link to user's email
 * @param {string} email - User's email address
 * @param {string} redirectTo - URL to redirect after successful authentication
 * @returns {Promise<Object>} Result object with success status and message
 */
export const sendMagicLink = async (email, redirectTo = window.location.origin) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Valid email address is required'
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    })

    if (error) {
      console.error('Supabase Controller: Magic link error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send magic link'
      }
    }

    return {
      success: true,
      message: 'Magic link sent successfully! Check your email.',
      data
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in sendMagicLink:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Result object with user data or null
 */
export const getCurrentUser = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        user: null
      }
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Supabase Controller: Get user error:', error)
      return {
        success: false,
        error: error.message,
        user: null
      }
    }

    return {
      success: true,
      user,
      error: null
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in getCurrentUser:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      user: null
    }
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Result object with success status
 */
export const signOut = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized'
      }
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Supabase Controller: Sign out error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      message: 'Signed out successfully'
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in signOut:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  try {
    if (!supabase) {
      console.error('Supabase Controller: Cannot listen to auth changes - client not initialized')
      return () => {}
    }

    if (typeof callback !== 'function') {
      console.error('Supabase Controller: Callback must be a function')
      return () => {}
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        await callback(event, session)
      } catch (error) {
        console.error('Supabase Controller: Error in auth state change callback:', error)
      }
    })

    return () => {
      try {
        subscription?.unsubscribe()
      } catch (error) {
        console.error('Supabase Controller: Error unsubscribing from auth changes:', error)
      }
    }
  } catch (error) {
    console.error('Supabase Controller: Error setting up auth state listener:', error)
    return () => {}
  }
}

/**
 * Get current session
 * @returns {Promise<Object>} Result object with session data
 */
export const getSession = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        session: null
      }
    }

    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Supabase Controller: Get session error:', error)
      return {
        success: false,
        error: error.message,
        session: null
      }
    }

    return {
      success: true,
      session,
      error: null
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in getSession:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      session: null
    }
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  try {
    const result = await getCurrentUser()
    return result.success && result.user !== null
  } catch (error) {
    console.error('Supabase Controller: Error checking authentication status:', error)
    return false
  }
}

/**
 * Refresh user session
 * @returns {Promise<Object>} Result object with refreshed session
 */
export const refreshSession = async () => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        session: null
      }
    }

    const {
      data: { session },
      error
    } = await supabase.auth.refreshSession()

    if (error) {
      console.error('Supabase Controller: Refresh session error:', error)
      return {
        success: false,
        error: error.message,
        session: null
      }
    }

    return {
      success: true,
      session,
      error: null
    }
  } catch (error) {
    console.error('Supabase Controller: Unexpected error in refreshSession:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      session: null
    }
  }
}

/**
 * Ensure the user record exists in the users table.
 * @param {string} userId - The user's unique id (uuid)
 * @returns {Promise<boolean>} True if exists or created, false otherwise
 */
export const ensureUserRecord = async (userId) => {
  try {
    if (!supabase) throw new Error('Supabase client not initialized')
    if (!userId) throw new Error('User ID is required')
    // Upsert: insert if not exists, else do nothing
    const { error } = await supabase.from('users').upsert([{ id: userId }], { onConflict: ['id'] })
    if (error) throw error
    return true
  } catch (error) {
    console.error('Supabase Controller: ensureUserRecord error:', error)
    return false
  }
}

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
export const uploadFileToStorage = async (file, userId, bucketName = 'file-uploads') => {
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
export const uploadMultipleFiles = async (files, userId, bucketName = 'file-uploads') => {
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
export const getUserFiles = async (userId, bucketName = 'file-uploads') => {
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
export const deleteFileFromStorage = async (filePath, bucketName = 'file-uploads') => {
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
export const getFileDownloadUrl = async (filePath, bucketName = 'file-uploads', expiresIn = 3600) => {
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
export const updateFileMetadata = async (filePath, metadata, bucketName = 'file-uploads') => {
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

// Export the Supabase client for direct access if needed
export { supabase }
