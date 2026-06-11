// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useCallback } from 'react'
import { Typography, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../core/context/ThemeContext'
import { Button, ChatPanel } from '../../../core/components'
import ResumePreviewPanel from './ResumePreviewPanel'
import useCandidateChat from '../hooks/useCandidateChat'
import useLiveResume from '../hooks/useLiveResume'
import {
  CANDIDATE_CHAT_HEADER_SUBTITLE,
  CANDIDATE_CHAT_INPUT_PLACEHOLDER,
  CANDIDATE_CHAT_LOADING_TEXT
} from '../candidateChatConfig'

const { Title } = Typography

/** Dev-only — set REACT_APP_SHOW_CLEAR_HERMES_SESSION=true to show in production builds. */
const SHOW_CLEAR_HERMES_SESSION =
  process.env.NODE_ENV === 'development' || process.env.REACT_APP_SHOW_CLEAR_HERMES_SESSION === 'true'

const RESUME_PANEL_COLORS = {
  darkBlue: '#1E3A52',
  shakespeare: '#4A90A4',
  pictonBlue: '#5BA3D4',
  seaGreen: '#16A085',
  emeraldPrimary: '#059669',
  tealGreen: '#14B8A6'
}

/**
 * Candidate chat interface — composes reusable ChatPanel with live resume side panel.
 */
const ChatInterface = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  const {
    resumeData,
    isLoading: isResumeLoading,
    isRefreshing: isResumeRefreshing,
    isProcessing: isResumeProcessing,
    refreshLiveResume,
    uploadAndParseResume,
    promoteResumeAsPrimary,
    bundle
  } = useLiveResume(user)

  const liveResumeContext = bundle
    ? {
        contact: bundle.contact,
        content: bundle.liveResume?.content
      }
    : null

  const {
    messages,
    isTyping,
    uploadedFiles,
    isInitialized,
    isChatReady,
    isUploading,
    sendMessage,
    handleFileUpload,
    handleFileRemove,
    hasMoreMessages,
    isLoadingMore,
    loadMoreMessages,
    isLoadingHistorical,
    isStreaming,
    streamingEnabled,
    cancelStreaming,
    toggleStreaming,
    clearChat,
    isClearingSession
  } = useCandidateChat(user, { liveResumeContext, onResumeUpdated: refreshLiveResume })

  const handleSendMessage = useCallback(
    (content) => {
      sendMessage(content)
    },
    [sendMessage]
  )

  const handleResumeUpload = useCallback(
    async (file) => {
      await uploadAndParseResume(file)
    },
    [uploadAndParseResume]
  )

  const headerTitle = (
    <Title level={4} className='!text-white !mb-0'>
      <span className='text-blue-500'>Skill</span>
      <span className='text-emerald-500'>Scout</span> Interview
    </Title>
  )

  const headerActions =
    SHOW_CLEAR_HERMES_SESSION ? (
      <Popconfirm
        title='Clear Hermes chat session?'
        description='Deletes message history for this user on the Hermes gateway. Uploaded files in Supabase are not removed.'
        onConfirm={clearChat}
        okText='Clear'
        cancelText='Cancel'
        okButtonProps={{ danger: true }}
        disabled={isClearingSession || isTyping}
      >
        <Button
          variant='ghost'
          size='small'
          loading={isClearingSession}
          disabled={isTyping}
          icon={<FontAwesomeIcon icon={faRotateLeft} />}
          className='!text-white/90 hover:!bg-white/15 !shadow-none !border !border-white/25'
          aria-label='Clear Hermes chat session (dev)'
        >
          Clear session
        </Button>
      </Popconfirm>
    ) : null

  return (
    <ChatPanel
      headerTitle={headerTitle}
      headerSubtitle={CANDIDATE_CHAT_HEADER_SUBTITLE}
      headerActions={headerActions}
      messages={messages}
      isTyping={isTyping}
      isInitialized={isInitialized}
      isChatReady={isChatReady}
      uploadedFiles={uploadedFiles}
      hasMoreMessages={hasMoreMessages}
      isLoadingMore={isLoadingMore}
      isLoadingHistorical={isLoadingHistorical}
      isUploading={isUploading}
      isStreaming={isStreaming}
      streamingEnabled={streamingEnabled}
      onSendMessage={handleSendMessage}
      onFileUpload={handleFileUpload}
      onFileRemove={handleFileRemove}
      onLoadMoreMessages={loadMoreMessages}
      onToggleStreaming={toggleStreaming}
      onCancelStream={cancelStreaming}
      inputPlaceholder={CANDIDATE_CHAT_INPUT_PLACEHOLDER}
      user={user}
      loadingText={CANDIDATE_CHAT_LOADING_TEXT}
      sidebar={
        <ResumePreviewPanel
          resumeData={resumeData}
          isLoading={isResumeLoading}
          isRefreshing={isResumeRefreshing}
          isProcessing={isResumeProcessing}
          messages={messages}
          darkMode={darkMode}
          colors={RESUME_PANEL_COLORS}
          onUploadResume={handleResumeUpload}
          onPromoteResume={promoteResumeAsPrimary}
        />
      }
    />
  )
})

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
