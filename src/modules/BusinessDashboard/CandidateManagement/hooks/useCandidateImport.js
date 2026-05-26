// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { useState, useCallback } from 'react'
import { message, Modal } from 'antd'
import {
  createDraftFromFile,
  DRAFT_STATUS,
  IMPORT_WIZARD_STEP,
  getSubmittableDrafts
} from '../model'
import { partitionCvAttachments } from '../model/cvAttachmentRules'
import { processCvDraftsBatch } from '../controllers/cvProcessing'
import { submitCandidates } from '../controllers'

/**
 * Wizard state: upload → process → preview → submit.
 */
export function useCandidateImport({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(IMPORT_WIZARD_STEP.UPLOAD)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [drafts, setDrafts] = useState([])
  const [processing, setProcessing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [processSummary, setProcessSummary] = useState(null)

  const resetWizard = useCallback(() => {
    setStep(IMPORT_WIZARD_STEP.UPLOAD)
    setSelectedFiles([])
    setDrafts([])
    setProcessing(false)
    setSubmitting(false)
    setProcessSummary(null)
  }, [])

  /** Opens wizard without clearing prior session (e.g. after accidental hide). */
  const openWizard = useCallback(() => {
    setOpen(true)
  }, [])

  const finishWizard = useCallback(() => {
    setOpen(false)
    resetWizard()
  }, [resetWizard])

  /** Cancel / close — confirms before discarding uploads or preview data. */
  const requestCloseWizard = useCallback(() => {
    if (processing || submitting) {
      message.info('Please wait until the current operation finishes.')
      return
    }

    const hasWork = selectedFiles.length > 0 || drafts.length > 0
    if (!hasWork) {
      finishWizard()
      return
    }

    Modal.confirm({
      title: 'Cancel import?',
      content: 'Uploaded files and previewed candidates will be discarded if you close now.',
      okText: 'Discard and close',
      cancelText: 'Continue editing',
      okType: 'danger',
      centered: true,
      onOk: finishWizard
    })
  }, [processing, submitting, selectedFiles.length, drafts.length, finishWizard])

  const addFiles = useCallback((fileList) => {
    const { validFiles, errors } = partitionCvAttachments(fileList)
    errors.forEach((err) => message.warning(err))
    if (validFiles.length === 0) return

    setSelectedFiles((prev) => {
      const names = new Set(prev.map((f) => `${f.name}-${f.size}`))
      const merged = [...prev]
      validFiles.forEach((file) => {
        const key = `${file.name}-${file.size}`
        if (!names.has(key)) {
          names.add(key)
          merged.push(file)
        }
      })
      return merged
    })
  }, [])

  const removeFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const processCvs = useCallback(async () => {
    if (selectedFiles.length === 0) {
      message.warning('Select at least one CV file to process')
      return
    }

    const initialDrafts = selectedFiles.map((file) => createDraftFromFile(file))
    setDrafts(initialDrafts)
    setStep(IMPORT_WIZARD_STEP.PROCESSING)
    setProcessing(true)
    setProcessSummary(null)

    try {
      const processed = await processCvDraftsBatch(initialDrafts, {
        concurrency: 2,
        onProgress: (draft, index) => {
          setDrafts((prev) => {
            const next = [...prev]
            next[index] = draft
            return next
          })
        }
      })

      setDrafts(processed)
      const ready = processed.filter((d) => d.status === DRAFT_STATUS.READY).length
      const failed = processed.filter((d) => d.status === DRAFT_STATUS.FAILED).length
      setProcessSummary({ total: processed.length, ready, failed })
      setStep(IMPORT_WIZARD_STEP.PREVIEW)

      if (ready === 0) {
        message.warning('No CVs were processed successfully. Review errors and try again.')
      } else {
        message.success(`Processed ${processed.length} file(s): ${ready} ready, ${failed} failed`)
      }
    } catch (error) {
      console.error('processCvs error:', error)
      message.error('An error occurred while processing CVs')
      setStep(IMPORT_WIZARD_STEP.UPLOAD)
    } finally {
      setProcessing(false)
    }
  }, [selectedFiles])

  const updateDraft = useCallback((id, patch) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }, [])

  const removeDraft = useCallback((id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const submitDrafts = useCallback(async () => {
    const submittable = getSubmittableDrafts(drafts)
    if (submittable.length === 0) {
      message.warning('No valid candidates to create. Each row needs a name and a successful CV parse.')
      return
    }

    setStep(IMPORT_WIZARD_STEP.SUBMITTING)
    setSubmitting(true)

    try {
      const result = await submitCandidates(drafts)
      const createdCount = result.created?.length || 0
      const failedCount = result.failed?.length || 0

      if (createdCount > 0) {
        message.success(`Created ${createdCount} candidate${createdCount === 1 ? '' : 's'}${failedCount ? ` (${failedCount} failed)` : ''}`)
        finishWizard()
        if (onSuccess) onSuccess()
      } else {
        message.error(result.error || 'No candidates were created')
      }
    } catch (error) {
      console.error('submitDrafts error:', error)
      message.error('An unexpected error occurred while creating candidates')
    } finally {
      setSubmitting(false)
      if (step === IMPORT_WIZARD_STEP.SUBMITTING) {
        setStep(IMPORT_WIZARD_STEP.PREVIEW)
      }
    }
  }, [drafts, finishWizard, onSuccess, step])

  const goBackToUpload = useCallback(() => {
    setStep(IMPORT_WIZARD_STEP.UPLOAD)
    setDrafts([])
    setProcessSummary(null)
  }, [])

  const submittableCount = getSubmittableDrafts(drafts).length

  return {
    open,
    step,
    selectedFiles,
    drafts,
    processing,
    submitting,
    processSummary,
    submittableCount,
    openWizard,
    requestCloseWizard,
    addFiles,
    removeFile,
    processCvs,
    updateDraft,
    removeDraft,
    submitDrafts,
    goBackToUpload,
    setStep
  }
}
