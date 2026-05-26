// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/** MIME types accepted for bulk CV import */
export const CV_ATTACHMENT_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
]

export const CV_ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024

/**
 * @param {FileList|File[]} fileList
 * @returns {{ validFiles: File[], errors: string[] }}
 */
export function partitionCvAttachments(fileList) {
  const errors = []
  const validFiles = []

  Array.from(fileList || []).forEach((file) => {
    const name = (file.name || '').toLowerCase()
    const typeOk =
      CV_ATTACHMENT_ALLOWED_MIME_TYPES.includes(file.type) ||
      name.endsWith('.pdf') ||
      name.endsWith('.docx') ||
      name.endsWith('.doc') ||
      name.endsWith('.txt')

    if (!typeOk) {
      errors.push(`${file.name}: Unsupported file type`)
    } else if (file.size > CV_ATTACHMENT_MAX_BYTES) {
      errors.push(`${file.name}: File too large (max 50MB)`)
    } else {
      validFiles.push(file)
    }
  })

  return { validFiles, errors }
}
