// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/** MIME types accepted for chat attachments */
export const CHAT_ATTACHMENT_ALLOWED_MIME_TYPES = [
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

export const CHAT_ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024

/** MIME types accepted for dedicated CV/resume upload */
export const CV_ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]

/**
 * Split FileList into accepted files vs human-readable errors.
 */
export function partitionChatAttachments(fileList) {
  const errors = []
  const validFiles = []

  Array.from(fileList).forEach((file) => {
    if (!CHAT_ATTACHMENT_ALLOWED_MIME_TYPES.includes(file.type)) {
      errors.push(`${file.name}: Unsupported file type`)
    } else if (file.size > CHAT_ATTACHMENT_MAX_BYTES) {
      errors.push(`${file.name}: File too large (max 50MB)`)
    } else {
      validFiles.push(file)
    }
  })

  return { validFiles, errors }
}

/**
 * Validates files selected or dropped into chat before upload.
 */
export function validateChatAttachmentBatch(fileList) {
  return partitionChatAttachments(fileList)
}
