// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { extractTextFromCvFile } from '../../../../lib/cv-text-extraction'
import { extractCandidateFieldsFromCvText } from '../../../../lib/openclaw-cv-extraction'
import { DRAFT_STATUS } from '../model'

/**
 * Process a single CV file into draft field values (no Supabase writes).
 * @param {import('../model').DraftCandidate} draft
 * @returns {Promise<import('../model').DraftCandidate>}
 */
export async function processCvFileToDraft(draft) {
  const next = { ...draft, status: DRAFT_STATUS.PROCESSING, errorMessage: null }

  if (!draft.file) {
    return {
      ...next,
      status: DRAFT_STATUS.FAILED,
      errorMessage: 'CV file is missing'
    }
  }

  const textResult = await extractTextFromCvFile(draft.file)
  if (!textResult.success) {
    return {
      ...next,
      status: DRAFT_STATUS.FAILED,
      errorMessage: textResult.error || 'Could not read CV text'
    }
  }

  const aiResult = await extractCandidateFieldsFromCvText(textResult.text)
  if (!aiResult.success) {
    return {
      ...next,
      status: DRAFT_STATUS.FAILED,
      errorMessage: aiResult.error || 'AI extraction failed',
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  }

  const fields = aiResult.data || {}
  return {
    ...next,
    status: DRAFT_STATUS.READY,
    firstName: fields.first_name || '',
    lastName: fields.last_name || '',
    email: fields.email || '',
    phone: fields.phone || '',
    errorMessage: null
  }
}

/**
 * Process multiple files with limited concurrency.
 * @param {import('../model').DraftCandidate[]} drafts
 * @param {{ onProgress?: (draft: import('../model').DraftCandidate, index: number) => void, concurrency?: number }} options
 */
export async function processCvDraftsBatch(drafts, options = {}) {
  const { onProgress, concurrency = 2 } = options
  const results = []
  let index = 0

  const worker = async () => {
    while (index < drafts.length) {
      const currentIndex = index
      index += 1
      const draft = drafts[currentIndex]
      const processed = await processCvFileToDraft(draft)
      results[currentIndex] = processed
      if (onProgress) {
        onProgress(processed, currentIndex)
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, drafts.length) }, () => worker())
  await Promise.all(workers)
  return results
}
