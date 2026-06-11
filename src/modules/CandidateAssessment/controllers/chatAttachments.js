// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { partitionChatAttachments } from '../../../core/components/chat/chatAttachmentRules'

/**
 * Validates files selected or dropped into candidate chat before upload.
 */
export function validateChatAttachmentBatch(fileList) {
  return partitionChatAttachments(fileList)
}
