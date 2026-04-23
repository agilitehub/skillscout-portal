// Global Instructions Rule Applied!
import React, { useState, useRef, useCallback } from 'react'
import { message, Progress, Card, List, Tag, Tooltip } from 'antd'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudUploadAlt,
  faFileAlt,
  faFilePdf,
  faFileWord,
  faFileImage,
  faFileExcel,
  faTrash,
  faDownload,
  faSpinner,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../context/ThemeContext'
import { uploadMultipleFiles, deleteFileFromStorage, getFileDownloadUrl } from '../../lib/supabase-controller'

/**
 * FileUpload component - Reusable file upload component with Supabase storage integration
 * Supports drag & drop, progress tracking, and file management
 */
const FileUpload = React.memo(
  ({
    userId,
    bucketName = 'file-uploads',
    maxFiles = 10,
    maxFileSize = 50 * 1024 * 1024, // 50MB
    allowedTypes = [
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
    ],
    onUploadComplete,
    onFileRemove,
    showFileList = true,
    showProgress = true,
    className = '',
    style = {}
  }) => {
    const { darkMode } = useTheme()
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [failedUploads, setFailedUploads] = useState([])
    const fileInputRef = useRef(null)

    // Internal color palette
    const colors = {
      shakespeare: '#4A90A4',
      pictonBlue: '#5BA3D4',
      seaGreen: '#16A085',
      emeraldPrimary: '#059669',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981'
    }

    // Get file icon based on type
    const getFileIcon = useCallback((fileName, fileType) => {
      const extension = fileName.split('.').pop()?.toLowerCase()
      const type = fileType || ''

      if (type.includes('pdf') || extension === 'pdf') return faFilePdf
      if (type.includes('word') || extension === 'doc' || extension === 'docx') return faFileWord
      if (type.includes('excel') || type.includes('spreadsheet') || extension === 'xls' || extension === 'xlsx')
        return faFileExcel
      if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return faFileImage
      return faFileAlt
    }, [])

    // Get file type color
    const getFileTypeColor = useCallback((fileName, fileType) => {
      const extension = fileName.split('.').pop()?.toLowerCase()
      const type = fileType || ''

      if (type.includes('pdf') || extension === 'pdf') return '#ef4444'
      if (type.includes('word') || extension === 'doc' || extension === 'docx') return '#3b82f6'
      if (type.includes('excel') || type.includes('spreadsheet') || extension === 'xls' || extension === 'xlsx')
        return '#10b981'
      if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return '#f59e0b'
      return '#6b7280'
    }, [])

    // Format file size
    const formatFileSize = useCallback((bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }, [])

    // Handle file upload
    const handleUpload = useCallback(
      async (files) => {
        if (!userId) {
          message.error('User not authenticated. Please log in to upload files.')
          return
        }

        if (!Array.isArray(files) || files.length === 0) {
          message.error('No files selected')
          return
        }

        if (files.length > maxFiles) {
          message.error(`Maximum ${maxFiles} files allowed`)
          return
        }

        // Validate files
        const validFiles = files.filter((file) => {
          if (!allowedTypes.includes(file.type)) {
            message.warning(`File type not supported: ${file.name}`)
            return false
          }

          if (file.size > maxFileSize) {
            message.warning(`File too large: ${file.name} (max ${formatFileSize(maxFileSize)})`)
            return false
          }

          return true
        })

        if (validFiles.length === 0) {
          message.error('No valid files to upload')
          return
        }

        setUploading(true)
        setUploadProgress(0)
        setFailedUploads([])

        try {
          // Simulate progress (since Supabase doesn't provide upload progress)
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval)
                return 90
              }
              return prev + 10
            })
          }, 200)

          const uploadResult = await uploadMultipleFiles(validFiles, userId, bucketName)

          clearInterval(progressInterval)
          setUploadProgress(100)

          if (uploadResult.success) {
            const newFiles = uploadResult.data.successful.map((fileData) => ({
              id: fileData.id,
              name: fileData.name,
              size: fileData.size,
              type: fileData.type,
              url: fileData.url,
              path: fileData.path,
              uploadedAt: fileData.uploadedAt,
              userId: fileData.userId
            }))

            setUploadedFiles((prev) => [...prev, ...newFiles])

            message.success(`Successfully uploaded ${newFiles.length} file(s)`)

            // Call callback if provided
            if (onUploadComplete) {
              onUploadComplete(newFiles)
            }

            // Handle failed uploads
            if (uploadResult.data.failed.length > 0) {
              setFailedUploads(uploadResult.data.failed)
              const failedNames = uploadResult.data.failed.map((f) => f.file).join(', ')
              message.warning(`Failed to upload: ${failedNames}`)
            }
          } else {
            message.error(uploadResult.error || 'Failed to upload files')
          }
        } catch (error) {
          console.error('Error uploading files:', error)
          message.error('An unexpected error occurred while uploading files')
        } finally {
          setUploading(false)
          setTimeout(() => setUploadProgress(0), 1000)
        }
      },
      [userId, bucketName, maxFiles, maxFileSize, allowedTypes, onUploadComplete, formatFileSize]
    )

    // Handle file removal
    const handleFileRemove = useCallback(
      async (fileId) => {
        try {
          const fileToRemove = uploadedFiles.find((file) => file.id === fileId)

          if (fileToRemove) {
            const deleteResult = await deleteFileFromStorage(fileToRemove.path, bucketName)

            if (deleteResult.success) {
              setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
              message.success('File removed successfully')

              // Call callback if provided
              if (onFileRemove) {
                onFileRemove(fileId, fileToRemove)
              }
            } else {
              message.error(deleteResult.error || 'Failed to remove file')
            }
          }
        } catch (error) {
          console.error('Error removing file:', error)
          message.error('An unexpected error occurred while removing file')
        }
      },
      [uploadedFiles, bucketName, onFileRemove]
    )

    // Handle file download
    const handleFileDownload = useCallback(
      async (file) => {
        try {
          const result = await getFileDownloadUrl(file.path, bucketName)

          if (result.success) {
            const link = document.createElement('a')
            link.href = result.url
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            message.error('Failed to generate download link')
          }
        } catch (error) {
          console.error('Error downloading file:', error)
          message.error('Failed to download file')
        }
      },
      [bucketName]
    )

    // Handle drag and drop
    const handleDrop = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (uploading) {
          message.warning('Please wait for current upload to complete')
          return
        }

        const files = Array.from(e.dataTransfer.files)
        handleUpload(files)
      },
      [handleUpload, uploading]
    )

    // Handle file input change
    const handleFileInputChange = useCallback(
      (e) => {
        const files = Array.from(e.target.files || [])
        handleUpload(files)

        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      [handleUpload]
    )

    return (
      <div className={`file-upload-container ${className}`} style={style}>
        {/* Upload Progress */}
        {showProgress && uploading && (
          <div className='mb-4'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm text-gray-600 dark:text-gray-300 flex items-center'>
                <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-2' />
                Uploading files...
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{uploadProgress}%</span>
            </div>
            <Progress
              percent={uploadProgress}
              status='active'
              showInfo={false}
              strokeColor={{
                '0%': colors.shakespeare,
                '100%': colors.emeraldPrimary
              }}
              trailColor={darkMode ? '#374151' : '#f3f4f6'}
            />
          </div>
        )}

        {/* Upload Area */}
        <Card
          className='upload-area'
          style={{
            background: darkMode ? '#374151' : '#f9fafb',
            border: `2px dashed ${darkMode ? '#6b7280' : '#d1d5db'}`,
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <div className='text-center py-8'>
            <FontAwesomeIcon
              icon={uploading ? faSpinner : faCloudUploadAlt}
              className={`text-4xl mb-4 ${uploading ? 'animate-spin' : ''}`}
              style={{ color: colors.shakespeare }}
            />
            <h3 className='text-lg font-medium text-gray-800 dark:text-white mb-2'>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              {uploading
                ? 'Please wait while your files are being uploaded'
                : 'Drag and drop files here, or click to select files'}
            </p>

            {!uploading && (
              <div className='space-y-2 text-xs text-gray-400 dark:text-gray-500'>
                <p>Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP, XLS, XLSX, CSV</p>
                <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
                <p>Maximum files: {maxFiles}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {/* File List */}
        {showFileList && uploadedFiles.length > 0 && (
          <div className='mt-4'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <List
              dataSource={uploadedFiles}
              renderItem={(file) => (
                <List.Item
                  className='file-item'
                  style={{
                    background: darkMode ? '#374151' : '#ffffff',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    marginBottom: '8px',
                    padding: '12px'
                  }}
                  actions={[
                    <Tooltip key='download' title='Download'>
                      <Button
                        type='text'
                        size='small'
                        icon={<FontAwesomeIcon icon={faDownload} />}
                        onClick={() => handleFileDownload(file)}
                        style={{ color: colors.shakespeare }}
                      />
                    </Tooltip>,
                    <Tooltip key='remove' title='Remove'>
                      <Button
                        type='text'
                        size='small'
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => handleFileRemove(file.id)}
                        style={{ color: colors.error }}
                      />
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        className='w-8 h-8 rounded flex items-center justify-center'
                        style={{ background: getFileTypeColor(file.name, file.type) + '20' }}
                      >
                        <FontAwesomeIcon
                          icon={getFileIcon(file.name, file.type)}
                          style={{ color: getFileTypeColor(file.name, file.type) }}
                        />
                      </div>
                    }
                    title={
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-gray-800 dark:text-white truncate'>{file.name}</span>
                        <Tag size='small' style={{ background: colors.success + '20', color: colors.success }}>
                          <FontAwesomeIcon icon={faCheckCircle} className='mr-1' />
                          Uploaded
                        </Tag>
                      </div>
                    }
                    description={
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* Failed Uploads */}
        {failedUploads.length > 0 && (
          <div className='mt-4'>
            <h4 className='text-sm font-medium text-red-600 dark:text-red-400 mb-3'>
              Failed Uploads ({failedUploads.length})
            </h4>
            <List
              dataSource={failedUploads}
              renderItem={(failedFile) => (
                <List.Item
                  className='failed-file-item'
                  style={{
                    background: darkMode ? '#374151' : '#fef2f2',
                    border: `1px solid ${darkMode ? '#dc2626' : '#fecaca'}`,
                    borderRadius: '6px',
                    marginBottom: '8px',
                    padding: '12px'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div className='w-8 h-8 rounded flex items-center justify-center bg-red-100 dark:bg-red-900/20'>
                        <FontAwesomeIcon icon={faExclamationCircle} className='text-red-500' />
                      </div>
                    }
                    title={
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-gray-800 dark:text-white'>{failedFile.file}</span>
                        <Tag size='small' style={{ background: colors.error + '20', color: colors.error }}>
                          Failed
                        </Tag>
                      </div>
                    }
                    description={<div className='text-xs text-red-500 dark:text-red-400'>{failedFile.error}</div>}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
