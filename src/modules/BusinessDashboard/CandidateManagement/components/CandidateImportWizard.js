// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useRef, useCallback } from 'react'
import { Steps, List, Progress, Typography, Button as AntButton } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudUploadAlt,
  faSpinner,
  faFileAlt,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { ThemedModal, ModalTitleWithIcon } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import ImportPreviewTable from './ImportPreviewTable'
import { IMPORT_WIZARD_STEP, DRAFT_STATUS } from '../model'

const { Text } = Typography

/** Ant Design buttons with solid colors — core Button uses transparent inline styles that hide labels on modals. */
const getWizardDefaultButtonStyle = (darkMode) => ({
  backgroundColor: darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white,
  borderColor: darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray,
  color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
})

const getWizardPrimaryButtonStyle = () => ({
  backgroundColor: BRAND_COLORS.emeraldPrimary,
  borderColor: BRAND_COLORS.emeraldPrimary,
  color: BRAND_COLORS.white
})

const WizardButton = ({ darkMode, variant = 'default', children, style, ...rest }) => {
  const baseStyle = variant === 'primary' ? getWizardPrimaryButtonStyle() : getWizardDefaultButtonStyle(darkMode)
  return (
    <AntButton
      type={variant === 'primary' ? 'primary' : 'default'}
      style={{ ...baseStyle, ...style }}
      {...rest}
    >
      {children}
    </AntButton>
  )
}

const STEP_ITEMS = [
  { title: 'Upload' },
  { title: 'Process' },
  { title: 'Preview' },
  { title: 'Submit' }
]

const stepIndexFor = (step) => {
  switch (step) {
    case IMPORT_WIZARD_STEP.UPLOAD:
      return 0
    case IMPORT_WIZARD_STEP.PROCESSING:
      return 1
    case IMPORT_WIZARD_STEP.PREVIEW:
      return 2
    case IMPORT_WIZARD_STEP.SUBMITTING:
      return 3
    default:
      return 0
  }
}

/** Action buttons live in the modal body so they are not clipped by themed-modal overflow. */
const WizardActions = ({ children }) => (
  <div className='candidate-import-wizard-actions flex flex-wrap items-center justify-end gap-2'>{children}</div>
)

const CandidateImportWizard = React.memo(
  ({
    open,
    onClose,
    step,
    selectedFiles,
    drafts,
    processing,
    submitting,
    processSummary,
    submittableCount,
    onAddFiles,
    onRemoveFile,
    onProcessCvs,
    onUpdateDraft,
    onRemoveDraft,
    onSubmitDrafts,
    onBackToUpload
  }) => {
    const { darkMode } = useTheme()
    const fileInputRef = useRef(null)

    const handleFileChange = useCallback(
      (e) => {
        if (e.target.files?.length) {
          onAddFiles(e.target.files)
          e.target.value = ''
        }
      },
      [onAddFiles]
    )

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault()
        if (e.dataTransfer.files?.length) {
          onAddFiles(e.dataTransfer.files)
        }
      },
      [onAddFiles]
    )

    const renderUploadStep = () => (
      <div className='flex flex-col gap-4'>
        <div
          role='button'
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors ${
            darkMode
              ? 'border-gray-600 hover:border-blue-500 bg-gray-800/50'
              : 'border-gray-300 hover:border-blue-400 bg-gray-50'
          }`}
        >
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
          />
          <Text className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
            Drag and drop CV files here, or click to browse
          </Text>
          <Text type='secondary' className='text-xs'>
            PDF, DOCX, TXT (max 50MB each)
          </Text>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='.pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'
            className='hidden'
            onChange={handleFileChange}
          />
        </div>

        {selectedFiles.length > 0 && (
          <>
            <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected. Click{' '}
              <strong>Process CVs</strong> below to extract candidate details with AI.
            </Text>
            <List
              size='small'
              dataSource={selectedFiles}
              renderItem={(file, index) => (
                <List.Item
                  actions={[
                    <AntButton
                      key='remove'
                      type='text'
                      size='small'
                      danger
                      icon={<FontAwesomeIcon icon={faTimes} />}
                      onClick={() => onRemoveFile(index)}
                      aria-label={`Remove ${file.name}`}
                      className={darkMode ? '!text-red-400' : ''}
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FontAwesomeIcon icon={faFileAlt} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                    title={file.name}
                    description={`${(file.size / 1024).toFixed(1)} KB`}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </div>
    )

    const renderProcessingStep = () => {
      const done = drafts.filter((d) => d.status !== DRAFT_STATUS.PENDING && d.status !== DRAFT_STATUS.PROCESSING)
        .length
      const total = drafts.length || selectedFiles.length || 1
      const percent = total ? Math.round((done / total) * 100) : 0

      return (
        <div className='flex flex-col items-center gap-6 py-8'>
          <FontAwesomeIcon icon={faSpinner} spin className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <Text className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Processing CVs with AI…</Text>
          <Progress percent={percent} className='w-full max-w-md' status='active' />
          <Text type='secondary'>
            {done} of {total} completed
          </Text>
        </div>
      )
    }

    const renderPreviewStep = () => (
      <div className='flex flex-col gap-4'>
        {processSummary && (
          <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Processed {processSummary.total} file(s): {processSummary.ready} ready, {processSummary.failed} failed
          </Text>
        )}
        <ImportPreviewTable drafts={drafts} onUpdateDraft={onUpdateDraft} onRemoveDraft={onRemoveDraft} />
      </div>
    )

    const renderBody = () => {
      if (step === IMPORT_WIZARD_STEP.UPLOAD) return renderUploadStep()
      if (step === IMPORT_WIZARD_STEP.PROCESSING) return renderProcessingStep()
      if (step === IMPORT_WIZARD_STEP.PREVIEW || step === IMPORT_WIZARD_STEP.SUBMITTING) return renderPreviewStep()
      return renderUploadStep()
    }

    const renderActions = () => {
      if (step === IMPORT_WIZARD_STEP.UPLOAD) {
        return (
          <WizardActions>
            <WizardButton darkMode={darkMode} onClick={onClose}>
              Cancel
            </WizardButton>
            <WizardButton
              darkMode={darkMode}
              variant='primary'
              onClick={onProcessCvs}
              disabled={selectedFiles.length === 0 || processing}
            >
              Process CVs
            </WizardButton>
          </WizardActions>
        )
      }

      if (step === IMPORT_WIZARD_STEP.PROCESSING) {
        return (
          <WizardActions>
            <WizardButton darkMode={darkMode} onClick={onClose} disabled={processing || submitting}>
              Cancel
            </WizardButton>
            <WizardButton darkMode={darkMode} disabled>
              Processing…
            </WizardButton>
          </WizardActions>
        )
      }

      return (
        <WizardActions>
          <div className='flex w-full flex-wrap items-center justify-between gap-2'>
            <WizardButton
              darkMode={darkMode}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
              onClick={onBackToUpload}
              disabled={submitting}
            >
              Back to upload
            </WizardButton>
            <div className='flex flex-wrap gap-2'>
              <WizardButton darkMode={darkMode} onClick={onClose} disabled={submitting}>
                Cancel
              </WizardButton>
              <WizardButton
                darkMode={darkMode}
                variant='primary'
                onClick={onSubmitDrafts}
                disabled={submittableCount === 0 || submitting}
                loading={submitting}
              >
                Create {submittableCount > 0 ? submittableCount : ''} candidate{submittableCount === 1 ? '' : 's'}
              </WizardButton>
            </div>
          </div>
        </WizardActions>
      )
    }

    return (
      <ThemedModal
        open={open}
        onCancel={onClose}
        footer={null}
        width={1200}
        centered
        className='candidate-import-wizard-modal'
        destroyOnClose={false}
        maskClosable={false}
        closable={false}
        keyboard={false}
      >
        <ModalTitleWithIcon icon={<FontAwesomeIcon icon={faCloudUploadAlt} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />}>
          Bulk upload CVs
        </ModalTitleWithIcon>
        <div className='mt-4 mb-4'>
          <Steps current={stepIndexFor(step)} items={STEP_ITEMS} size='small' />
        </div>
        <div className='candidate-import-wizard-body'>{renderBody()}</div>
        {renderActions()}
      </ThemedModal>
    )
  }
)

CandidateImportWizard.displayName = 'CandidateImportWizard'

export default CandidateImportWizard
