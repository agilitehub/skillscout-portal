// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { extractTextFromCvFile } from '../../../lib/cv-text-extraction'
import { extractFullResumeFromCvText } from '../../../lib/hermes/cv-extraction'
import { uploadFileToStorage } from '../../../core/infra/supabase-controller'
import { DEFAULT_SUPABASE_STORAGE_BUCKET } from '../../../constants'
import {
  createDataSource,
  updateDataSource,
  createResumeRecord,
  updateResumeRecord,
  getLiveResume,
  upsertLiveResume,
  updateUserContactFields,
  setPrimaryDataSource,
  listUserDataSources
} from '../../../core/infra/live-resume-controller'
import { mergeIntoLiveResume } from '../model/mergeLiveResume'
import { createEmptyResumeContent } from '../model/resumeContent'

const RAW_TEXT_MAX = 50000

/**
 * Ingest a CV file: upload, extract, persist records, merge into live resume.
 * @param {string} userId
 * @param {File} file
 * @param {{ setAsPrimary?: boolean }} options
 */
export async function ingestResumeFile(userId, file, options = { setAsPrimary: true }) {
  if (!userId || !file) {
    return { success: false, error: 'User and file are required' }
  }

  const uploadResult = await uploadFileToStorage(file, userId, DEFAULT_SUPABASE_STORAGE_BUCKET)
  if (!uploadResult.success) {
    return uploadResult
  }

  const storagePath = uploadResult.data.path

  const existingSources = await listUserDataSources(userId)
  const isFirstSource = !existingSources.success || existingSources.data.length === 0
  const setAsPrimary = options.setAsPrimary ?? isFirstSource

  const sourceResult = await createDataSource(userId, {
    source_type: 'resume_upload',
    label: file.name,
    status: 'processing',
    is_primary: setAsPrimary,
    metadata: {
      original_filename: file.name,
      storage_path: storagePath,
      imported_at: new Date().toISOString(),
      parse_version: 1
    }
  })

  if (!sourceResult.success) {
    return sourceResult
  }

  const dataSource = sourceResult.data

  const resumeResult = await createResumeRecord({
    user_id: userId,
    data_source_id: dataSource.id,
    storage_path: storagePath,
    original_filename: file.name,
    content: createEmptyResumeContent(),
    parse_status: 'processing'
  })

  if (!resumeResult.success) {
    await updateDataSource(dataSource.id, { status: 'failed' })
    return resumeResult
  }

  const resumeRecord = resumeResult.data

  await updateDataSource(dataSource.id, {
    external_ref: resumeRecord.id,
    status: 'processing'
  })

  if (setAsPrimary) {
    await setPrimaryDataSource(userId, dataSource.id)
  }

  const textResult = await extractTextFromCvFile(file)
  if (!textResult.success) {
    await updateResumeRecord(resumeRecord.id, {
      parse_status: 'failed',
      parse_error: textResult.error || 'Could not read CV text'
    })
    await updateDataSource(dataSource.id, { status: 'failed' })
    return { success: false, error: textResult.error || 'Could not read CV text' }
  }

  const rawText = String(textResult.text).slice(0, RAW_TEXT_MAX)
  const aiResult = await extractFullResumeFromCvText(rawText, userId)

  if (!aiResult.success) {
    await updateResumeRecord(resumeRecord.id, {
      parse_status: 'failed',
      parse_error: aiResult.error,
      raw_text: rawText
    })
    await updateDataSource(dataSource.id, { status: 'failed' })
    return aiResult
  }

  const { contact, content } = aiResult.data

  await updateResumeRecord(resumeRecord.id, {
    content,
    raw_text: rawText,
    parse_status: 'complete',
    parse_error: null,
    parsed_at: new Date().toISOString()
  })

  await updateDataSource(dataSource.id, {
    status: 'active',
    external_ref: resumeRecord.id
  })

  await updateUserContactFields(userId, contact, { fillEmptyOnly: true })

  const liveResult = await getLiveResume(userId)
  const currentLive = liveResult.data?.content || createEmptyResumeContent()
  const mergedContent = mergeIntoLiveResume({
    currentContent: currentLive,
    sourceContent: content,
    lastChatUpdateAt: liveResult.data?.last_chat_update_at,
    isPrimary: setAsPrimary
  })

  const upsertResult = await upsertLiveResume(userId, mergedContent, {
    primarySourceId: setAsPrimary ? dataSource.id : liveResult.data?.primary_source_id,
    lastMergedAt: new Date().toISOString()
  })

  if (!upsertResult.success) {
    return upsertResult
  }

  return {
    success: true,
    data: {
      dataSource,
      resume: { ...resumeRecord, content, parse_status: 'complete' },
      liveResume: upsertResult.data,
      storagePath
    }
  }
}

/**
 * Re-merge live resume from a specific primary data source.
 * @param {string} userId
 * @param {string} sourceId
 * @param {object} resumeContent
 */
export async function remergeFromPrimarySource(userId, sourceId, resumeContent) {
  await setPrimaryDataSource(userId, sourceId)

  const liveResult = await getLiveResume(userId)
  const mergedContent = mergeIntoLiveResume({
    currentContent: liveResult.data?.content,
    sourceContent: resumeContent,
    lastChatUpdateAt: liveResult.data?.last_chat_update_at,
    isPrimary: true
  })

  return upsertLiveResume(userId, mergedContent, {
    primarySourceId: sourceId,
    lastMergedAt: new Date().toISOString()
  })
}
