// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useCallback } from 'react'
import { Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileAlt,
  faFilePdf,
  faFileWord,
  faFileImage,
  faTrash,
  faRobot
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../context/ThemeContext'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

const { Text } = Typography

const PANEL_COLORS = {
  darkBlue: '#1E3A52',
  shakespeare: '#4A90A4',
  pictonBlue: '#5BA3D4',
  emeraldPrimary: '#059669'
}

/**
 * Reusable chat panel shell — header, messages, input, optional sidebar.
 */
const ChatPanel = React.memo(
  ({
    headerTitle,
    headerSubtitle,
    headerActions = null,
    messages,
    isTyping,
    isInitialized,
    isChatReady,
    uploadedFiles = [],
    hasMoreMessages = false,
    isLoadingMore = false,
    isLoadingHistorical = false,
    isUploading = false,
    isStreaming = false,
    streamingEnabled = true,
    onSendMessage,
    onFileUpload,
    onFileRemove,
    onLoadMoreMessages,
    onToggleStreaming,
    onCancelStream,
    inputPlaceholder,
    maxLength = 4000,
    enableFileUpload = true,
    sidebar = null,
    user = null,
    loadingText = 'Initializing chat...'
  }) => {
    const { darkMode } = useTheme()

    const getFileIcon = useCallback((fileName) => {
      const extension = fileName.split('.').pop()?.toLowerCase()
      switch (extension) {
        case 'pdf':
          return faFilePdf
        case 'doc':
        case 'docx':
          return faFileWord
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return faFileImage
        default:
          return faFileAlt
      }
    }, [])

    if (!isInitialized) {
      return (
        <div className='flex min-h-0 flex-1 items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
            <Text className='text-muted'>{loadingText}</Text>
          </div>
        </div>
      )
    }

    return (
      <div
        className='relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background'
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
        }}
      >
        <div className='fixed inset-0 pointer-events-none z-0'>
          {darkMode ? (
            <>
              <div
                className='absolute -top-[20%] -right-[20%] w-3/4 h-3/4 rounded-full blur-3xl opacity-40'
                style={{ background: 'radial-gradient(circle, #4A90A4 0%, #2E5984 30%, transparent 70%)' }}
              />
              <div
                className='absolute -bottom-[20%] -left-[20%] w-3/4 h-3/4 rounded-full blur-3xl opacity-35'
                style={{ background: 'radial-gradient(circle, #059669 0%, #065F46 30%, transparent 70%)' }}
              />
            </>
          ) : (
            <>
              <div className='absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl opacity-80' />
              <div className='absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl opacity-80' />
            </>
          )}
        </div>

        <div className='flex min-h-0 flex-1 flex-col relative z-10'>
          <div
            className='flex-shrink-0 px-4 py-3 border-b border-border'
            style={{
              background: darkMode
                ? `linear-gradient(135deg, ${PANEL_COLORS.darkBlue}, ${PANEL_COLORS.shakespeare})`
                : `linear-gradient(135deg, ${PANEL_COLORS.pictonBlue}, ${PANEL_COLORS.shakespeare})`
            }}
          >
            <div className='flex items-center justify-between'>
              <div>
                {headerTitle}
                {headerSubtitle ? (
                  <Text className='text-white/70 text-sm block'>{headerSubtitle}</Text>
                ) : null}
              </div>
              <div className='flex items-center gap-2'>
                {headerActions}
                <div className='text-white/60'>
                  <FontAwesomeIcon icon={faRobot} className='text-xl' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex min-h-0 flex-1 overflow-hidden'>
            <div className={`flex min-h-0 flex-1 flex-col ${sidebar ? 'lg:w-3/5 xl:w-1/2' : ''}`}>
              {uploadedFiles.length > 0 && (
                <div className='flex-shrink-0 px-4 py-2 bg-surface border-b border-border'>
                  <Text className='text-xs text-muted mb-1 block'>
                    Uploaded Documents ({uploadedFiles.length})
                  </Text>
                  <div className='flex flex-wrap gap-1'>
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className='flex items-center space-x-1 px-2 py-1 bg-surface border border-border rounded-full text-xs'
                      >
                        <FontAwesomeIcon icon={getFileIcon(file.name)} className='text-blue-500 text-xs' />
                        <span className='text-foreground max-w-[100px] truncate'>{file.name}</span>
                        {onFileRemove && (
                          <button
                            type='button'
                            onClick={() => onFileRemove(file.id)}
                            className='p-0 w-3 h-3 text-red-400 hover:text-red-600'
                            aria-label={`Remove ${file.name}`}
                          >
                            <FontAwesomeIcon icon={faTrash} className='text-xs' />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='min-h-0 flex-1 overflow-hidden'>
                <ChatMessages
                  messages={messages}
                  isTyping={isTyping}
                  user={user}
                  uploadedFiles={uploadedFiles}
                  showFileInfo={true}
                  hasMoreMessages={hasMoreMessages}
                  isLoadingMore={isLoadingMore}
                  isLoadingHistorical={isLoadingHistorical}
                  onLoadMoreMessages={onLoadMoreMessages}
                  streamingEnabled={streamingEnabled}
                />
              </div>

              <div className='flex-shrink-0'>
                <ChatInput
                  onSendMessage={onSendMessage}
                  onAttachFile={() => {}}
                  onFileUpload={enableFileUpload ? onFileUpload : undefined}
                  disabled={!isChatReady}
                  isTyping={isTyping}
                  isUploading={isUploading}
                  isStreaming={isStreaming}
                  streamingEnabled={streamingEnabled}
                  onToggleStreaming={onToggleStreaming}
                  onCancelStream={onCancelStream}
                  maxLength={maxLength}
                  placeholder={inputPlaceholder}
                  enableFileUpload={enableFileUpload}
                />
              </div>
            </div>

            {sidebar ? (
              <>
                <div className='hidden lg:block w-3 bg-gradient-to-b from-transparent via-border to-transparent relative'>
                  <div
                    className='absolute inset-0 bg-gradient-to-b opacity-50'
                    style={{
                      background: darkMode
                        ? `linear-gradient(to bottom, transparent 0%, ${PANEL_COLORS.shakespeare}40 50%, transparent 100%)`
                        : `linear-gradient(to bottom, transparent 0%, ${PANEL_COLORS.emeraldPrimary}30 50%, transparent 100%)`
                    }}
                  />
                </div>
                {sidebar}
              </>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

ChatPanel.displayName = 'ChatPanel'

export default ChatPanel
