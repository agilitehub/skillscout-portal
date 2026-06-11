// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useCallback } from 'react'
import { Input, message, Progress, Switch } from 'antd'
import Button from '../parts/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip, faCloudUploadAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { BRAND_COLORS } from '../../theme/colors'
import { validateChatAttachmentBatch } from './chatAttachmentRules'

const { TextArea } = Input

const DEFAULT_PLACEHOLDER =
  'Tell me about your career goals or ask for interview preparation help...'

/**
 * ChatInput — send, file uploads, and streaming controls.
 */
const ChatInput = React.memo(
  ({
    onSendMessage,
    onAttachFile,
    onFileUpload,
    disabled = false,
    isTyping = false,
    isUploading = false,
    isStreaming = false,
    streamingEnabled = true,
    onToggleStreaming = null,
    onCancelStream = null,
    maxLength = 4000,
    placeholder = DEFAULT_PLACEHOLDER,
    uploadingPlaceholder = 'Uploading files...',
    typingPlaceholder = '...',
    disabledPlaceholder = 'Chat is disabled...',
    enableFileUpload = true
  }) => {
    const [userInput, setUserInput] = React.useState('')
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [dragError, setDragError] = React.useState(null)
    const [uploadProgress, setUploadProgress] = React.useState({})
    const fileInputRef = useRef(null)

    const handleSendMessage = useCallback(() => {
      if (userInput.trim() && !disabled && !isTyping && !isUploading && !isStreaming) {
        onSendMessage?.(userInput.trim())
        setUserInput('')
      }
    }, [userInput, disabled, isTyping, isUploading, isStreaming, onSendMessage])

    const handleKeyPress = useCallback(
      (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSendMessage()
        }
      },
      [handleSendMessage]
    )

    const validateFiles = useCallback((files) => {
      const { validFiles, errors } = validateChatAttachmentBatch(files)

      if (errors.length > 0) {
        setDragError(errors.join(', '))
        setTimeout(() => setDragError(null), 5000)
        message.warning(`Some files were rejected: ${errors.join(', ')}`)
      }

      return validFiles
    }, [])

    const processFiles = useCallback(
      async (files) => {
        try {
          const progressEntries = {}
          files.forEach((file) => {
            progressEntries[file.name] = 0
          })
          setUploadProgress(progressEntries)

          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const updated = { ...prev }
              Object.keys(updated).forEach((filename) => {
                if (updated[filename] < 90) {
                  updated[filename] += Math.random() * 20
                }
              })
              return updated
            })
          }, 200)

          if (onFileUpload) {
            await onFileUpload(files)
          }

          clearInterval(progressInterval)
          setUploadProgress((prev) => {
            const completed = { ...prev }
            Object.keys(completed).forEach((filename) => {
              completed[filename] = 100
            })
            return completed
          })

          setTimeout(() => {
            setUploadProgress({})
          }, 1000)
        } catch (error) {
          console.error('File processing error:', error)
          message.error('File processing failed: ' + error.message)
          setUploadProgress({})
        }
      },
      [onFileUpload]
    )

    const handleFileChange = useCallback(
      (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
          const validFiles = validateFiles(files)

          if (validFiles.length > 0) {
            processFiles(validFiles)
            onAttachFile?.()
          }
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      [onAttachFile, validateFiles, processFiles]
    )

    const handleAttachFileClick = useCallback(() => {
      if (fileInputRef.current && !isUploading) {
        fileInputRef.current.click()
      }
    }, [isUploading])

    const handleDragEnter = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragOver(false)
      }
    }, [])

    const handleDragOver = useCallback((e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }, [])

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        if (isUploading) {
          message.warning('Please wait for current upload to complete')
          return
        }

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
          const validFiles = validateFiles(files)

          if (validFiles.length > 0) {
            processFiles(validFiles)
          }
        }
      },
      [isUploading, validateFiles, processFiles]
    )

    const isInputValid = userInput.trim().length > 0 && !disabled && !isTyping && !isUploading
    const isDisabled = disabled || isTyping || isUploading

    const resolvedPlaceholder = isUploading
      ? uploadingPlaceholder
      : isTyping
        ? typingPlaceholder
        : isDisabled
          ? disabledPlaceholder
          : placeholder

    return (
      <>
        {enableFileUpload && (
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.csv'
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        )}

        <div
          className={`global-form relative p-2 md:p-4 border-t bg-background transition-all duration-200 ${
            isDragOver && enableFileUpload
              ? 'border-2 border-dashed border-brand-accent shadow-lg transform scale-[1.02]'
              : 'border-border'
          }`}
          onDragEnter={enableFileUpload ? handleDragEnter : undefined}
          onDragLeave={enableFileUpload ? handleDragLeave : undefined}
          onDragOver={enableFileUpload ? handleDragOver : undefined}
          onDrop={enableFileUpload ? handleDrop : undefined}
        >
          {dragError && (
            <div className='mb-3 p-2 bg-danger/10 border border-danger/30 rounded-lg'>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faCloudUploadAlt} className='text-danger mr-2' />
                <span className='text-xs text-danger'>{dragError}</span>
              </div>
            </div>
          )}

          {isUploading && (
            <div className='mb-3'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-xs text-muted flex items-center'>
                  <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-2' />
                  Uploading files...
                </span>
              </div>
              <Progress
                percent={100}
                status='active'
                showInfo={false}
                strokeColor={{
                  '0%': BRAND_COLORS.shakespeare,
                  '100%': BRAND_COLORS.emeraldPrimary
                }}
                trailColor='rgb(var(--color-border))'
                size='small'
              />
            </div>
          )}

          {Object.keys(uploadProgress).length > 0 && (
            <div className='mb-3 space-y-1'>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className='flex items-center space-x-2'>
                  <span className='text-xs text-muted min-w-0 flex-1 truncate'>{fileName}</span>
                  <div className='w-16'>
                    <Progress
                      percent={Math.round(progress)}
                      size='small'
                      showInfo={false}
                      strokeColor={{
                        '0%': BRAND_COLORS.shakespeare,
                        '100%': BRAND_COLORS.emeraldPrimary
                      }}
                      trailColor='rgb(var(--color-border))'
                    />
                  </div>
                  <span className='text-xs text-muted w-8 text-right'>{Math.round(progress)}%</span>
                </div>
              ))}
            </div>
          )}

          <div className='flex items-center gap-3'>
            {enableFileUpload && (
              <Button
                variant='ghost'
                onClick={handleAttachFileClick}
                disabled={isDisabled}
                aria-label='Attach files'
                className='flex items-center justify-center flex-shrink-0 !h-11 !w-11 !min-h-[44px] !min-w-[44px] !p-0 !rounded-lg text-brand-accent hover:!bg-surface hover:!text-brand-primary disabled:opacity-50 !shadow-none hover:!scale-100 active:!scale-100 focus:!ring-brand-accent/40'
                style={{
                  background: 'rgb(var(--color-input-bg))',
                  border: '1px solid rgb(var(--color-border))',
                  color: 'rgb(var(--color-brand-accent))'
                }}
                icon={
                  isUploading ? (
                    <FontAwesomeIcon icon={faSpinner} className='text-lg animate-spin' />
                  ) : (
                    <FontAwesomeIcon icon={faPaperclip} className='text-lg' />
                  )
                }
              />
            )}

            <div className='flex-grow min-w-0'>
              <TextArea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isDisabled}
                maxLength={maxLength}
                autoSize={{ minRows: 1, maxRows: 3 }}
                style={{
                  resize: 'none',
                  opacity: isDisabled ? 0.7 : 1
                }}
                className='!rounded-lg'
                placeholder={resolvedPlaceholder}
              />
            </div>

            <Button
              variant='primary'
              onClick={handleSendMessage}
              disabled={!isInputValid}
              aria-label='Send message'
              className='flex items-center justify-center flex-shrink-0 !h-11 !w-11 !min-h-[44px] !min-w-[44px] !p-0 !rounded-lg !shadow-none hover:!scale-100 active:!scale-100 disabled:opacity-60'
              style={{
                background: `linear-gradient(to right, ${BRAND_COLORS.emeraldPrimary}, ${BRAND_COLORS.seaGreen})`
              }}
              icon={<FontAwesomeIcon icon={faPaperPlane} className='text-on-primary' />}
            />
          </div>

          {isDragOver && enableFileUpload && (
            <div className='absolute inset-0 z-20 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg border-2 border-dashed border-brand-accent'>
              <div className='text-center'>
                <FontAwesomeIcon
                  icon={faCloudUploadAlt}
                  className='text-4xl text-brand-accent mb-2 animate-bounce'
                />
                <p className='font-medium text-brand-accent'>Drop files here to upload</p>
                <p className='text-xs mt-1 text-muted'>PDF, DOC, Images, CSV files supported</p>
              </div>
            </div>
          )}

          {enableFileUpload && (
            <div className='flex items-center justify-between text-xs py-2'>
              <div
                className={`flex items-center space-x-2 text-muted transition-opacity duration-200 ${
                  isDragOver ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <FontAwesomeIcon icon={faCloudUploadAlt} className='text-xs' />
                <span>
                  {isUploading ? (
                    'Uploading files...'
                  ) : (
                    <>
                      Drag & drop files or click
                      <FontAwesomeIcon icon={faPaperclip} className='mx-1 text-xs text-brand-accent' />
                      to upload
                    </>
                  )}
                </span>
              </div>

              <div className='flex items-center space-x-3'>
                {isStreaming && (
                  <div className='flex items-center space-x-2'>
                    <div className='flex space-x-1'>
                      <div className='w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse' />
                      <div
                        className='w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse'
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className='w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse'
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                    <span className='text-brand-accent'>Streaming...</span>
                    {onCancelStream && (
                      <Button
                        variant='ghost'
                        size='small'
                        onClick={onCancelStream}
                        className='!px-2 !py-0 !h-5 text-xs text-danger hover:!bg-danger/10 !shadow-none hover:!scale-100 active:!scale-100'
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}

                {onToggleStreaming && !isStreaming && (
                  <div className='flex items-center space-x-2'>
                    <span className='text-xs text-muted'>Streaming</span>
                    <Switch size='small' checked={streamingEnabled} onChange={onToggleStreaming} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
)

ChatInput.displayName = 'ChatInput'

export default ChatInput
