// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useCallback } from 'react'
import { message } from 'antd'
import { useChatSession, CV_ACCEPTED_MIME_TYPES } from '../../../core/components'
import { candidateHermesAdapter } from '../../../lib/chat/adapters/candidateHermesAdapter'
import {
  uploadMultipleFiles,
  getUserFiles,
  deleteFileFromStorage
} from '../../../core/infra/supabase-controller'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../../constants'
import { ingestResumeFile } from '../controllers/resumeIngestion'
import { LIVE_RESUME_REFRESH_DELAY_MS } from '../candidateChatConfig'

const isCvFile = (file) => CV_ACCEPTED_MIME_TYPES.includes(file.type)

/**
 * Candidate chat hook — Hermes adapter with live resume refresh and CV ingest.
 * @param {{ id?: string, name?: string }|null} user
 * @param {{ liveResumeContext?: object|null, onResumeUpdated?: () => void }} options
 */
export const useCandidateChat = (user = null, options = {}) => {
  const { liveResumeContext = null, onResumeUpdated } = options

  const onAfterAssistantReply = useCallback(async () => {
    if (!onResumeUpdated) return
    await new Promise((resolve) => setTimeout(resolve, LIVE_RESUME_REFRESH_DELAY_MS))
    onResumeUpdated()
  }, [onResumeUpdated])

  const onFileUpload = useCallback(
    async (files, { addSystemMessage, setUploadedFiles }) => {
      const fileArray = Array.from(files)
      const cvFiles = fileArray.filter(isCvFile)
      const otherFiles = fileArray.filter((f) => !isCvFile(f))

      if (fileArray.length === 1 && cvFiles.length === 1) {
        const ingestResult = await ingestResumeFile(user.id, cvFiles[0], { setAsPrimary: true })
        if (ingestResult.success) {
          addSystemMessage(`Resume uploaded and analyzed: ${cvFiles[0].name}`)
          message.success('Resume uploaded and added to your live profile.')
          if (onResumeUpdated) onResumeUpdated()
        } else {
          message.error(ingestResult.error || 'Failed to process resume')
        }
        return
      }

      if (otherFiles.length > 0) {
        const uploadResult = await uploadMultipleFiles(otherFiles, user.id, DEFAULT_SUPABASE_STORAGE_BUCKET)

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

          if (uploadResult.data.failed.length > 0) {
            message.warning(`Failed to upload: ${uploadResult.data.failed.map((f) => f.file).join(', ')}`)
          }
        } else {
          message.error(uploadResult.error || 'Failed to upload files')
        }
      }

      if (cvFiles.length > 0) {
        for (let i = 0; i < cvFiles.length; i += 1) {
          await ingestResumeFile(user.id, cvFiles[i], { setAsPrimary: i === 0 })
        }
        addSystemMessage(`Resume(s) uploaded and analyzed: ${cvFiles.map((f) => f.name).join(', ')}`)
        message.success(`Processed ${cvFiles.length} resume file(s).`)
        if (onResumeUpdated) onResumeUpdated()
      } else if (otherFiles.length > 0) {
        message.success(`Successfully uploaded ${otherFiles.length} file(s)`)
      }
    },
    [user?.id, onResumeUpdated]
  )

  const onFileRemove = useCallback(async (fileId, uploadedFiles) => {
    const fileToRemove = uploadedFiles.find((file) => file.id === fileId)
    if (!fileToRemove) return false

    const deleteResult = await deleteFileFromStorage(fileToRemove.path, DEFAULT_SUPABASE_STORAGE_BUCKET)
    if (deleteResult.success) {
      return true
    }
    message.error(deleteResult.error || 'Failed to remove file')
    return false
  }, [])

  const fetchUploadedFiles = useCallback(async (userId) => {
    const result = await getUserFiles(userId, DEFAULT_SUPABASE_STORAGE_BUCKET)
    if (!result.success) return []

    return result.files.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url,
      path: `${userId}/${file.name}`,
      uploadedAt: file.createdAt,
      userId: file.userId
    }))
  }, [])

  return useChatSession(user, {
    chatService: candidateHermesAdapter,
    context: liveResumeContext,
    onAfterAssistantReply,
    onFileUpload,
    onFileRemove,
    fetchUploadedFiles
  })
}

export default useCandidateChat
