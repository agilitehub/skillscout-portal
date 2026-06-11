// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useCallback, useEffect, useState } from 'react'
import { Typography, Spin, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button, ChatPanel, ModalTitleWithIcon, ThemedModal } from '../../../../core/components'
import { SEMANTIC_COLORS } from '../../../../core/theme/colors'
import { fetchMatchedCandidateCvContext } from '../controllers/candidateCvContext'
import useBusinessCandidateChat from '../hooks/useBusinessCandidateChat'
import {
  BUSINESS_CHAT_INPUT_PLACEHOLDER,
  BUSINESS_CHAT_LOADING_TEXT
} from '../businessChatConfig'

const { Text, Title } = Typography

const PotentialCandidateChatBody = React.memo(({ recruiterUser, cvContext, match }) => {
  const {
    messages,
    isTyping,
    isInitialized,
    isChatReady,
    isUploading,
    isStreaming,
    streamingEnabled,
    sendMessage,
    hasMoreMessages,
    isLoadingMore,
    isLoadingHistorical,
    loadMoreMessages,
    toggleStreaming,
    cancelStreaming,
    clearChat,
    isClearingSession
  } = useBusinessCandidateChat(recruiterUser, cvContext)

  const handleSendMessage = useCallback(
    (content) => {
      sendMessage(content)
    },
    [sendMessage]
  )

  const headerTitle = (
    <Title level={4} className='!text-white !mb-0'>
      {cvContext.candidateName}
      {cvContext.candidateTitle ? (
        <Text className='!text-white/70 !text-sm !font-normal block'>{cvContext.candidateTitle}</Text>
      ) : null}
    </Title>
  )

  const headerSubtitle = `${match.jobListingTitle || cvContext.jobListingTitle}${
    match.jobListingLocation || cvContext.jobListingLocation
      ? ` · ${match.jobListingLocation || cvContext.jobListingLocation}`
      : ''
  }`

  const headerActions = (
    <Popconfirm
      title='Clear this conversation?'
      description='Deletes message history for this candidate chat on the OpenClaw gateway.'
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
        aria-label='Clear chat session'
      >
        Clear
      </Button>
    </Popconfirm>
  )

  return (
    <div className='flex min-h-[60vh] flex-col overflow-hidden rounded-lg border border-border'>
      <ChatPanel
        headerTitle={headerTitle}
        headerSubtitle={headerSubtitle}
        headerActions={headerActions}
        messages={messages}
        isTyping={isTyping}
        isInitialized={isInitialized}
        isChatReady={isChatReady}
        isUploading={isUploading}
        isStreaming={isStreaming}
        streamingEnabled={streamingEnabled}
        onSendMessage={handleSendMessage}
        onLoadMoreMessages={loadMoreMessages}
        onToggleStreaming={toggleStreaming}
        onCancelStream={cancelStreaming}
        inputPlaceholder={BUSINESS_CHAT_INPUT_PLACEHOLDER}
        enableFileUpload={false}
        user={recruiterUser}
        loadingText={BUSINESS_CHAT_LOADING_TEXT}
        hasMoreMessages={hasMoreMessages}
        isLoadingMore={isLoadingMore}
        isLoadingHistorical={isLoadingHistorical}
      />
    </div>
  )
})

PotentialCandidateChatBody.displayName = 'PotentialCandidateChatBody'

/**
 * Modal chat about one potential candidate's CV (OpenClaw).
 */
const PotentialCandidateChatModal = React.memo(({ open, match, recruiterUser, onClose }) => {
  const [cvContext, setCvContext] = useState(null)
  const [cvError, setCvError] = useState(null)
  const [cvLoading, setCvLoading] = useState(false)

  useEffect(() => {
    if (!open || !match?.id) {
      setCvContext(null)
      setCvError(null)
      setCvLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setCvLoading(true)
      setCvError(null)
      setCvContext(null)

      const result = await fetchMatchedCandidateCvContext(match.id)
      if (cancelled) return

      if (result.success) {
        setCvContext(result.data)
      } else {
        setCvError(result.error || "This candidate's CV is not available.")
      }
      setCvLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [open, match?.id])

  const modalTitle = match ? (
    <ModalTitleWithIcon
      icon={<FontAwesomeIcon icon={faComments} className='text-brand-accent' />}
      subtitle={
        <span className='inline-flex items-center gap-2 flex-wrap'>
          {match.jobListingTitle}
          <span
            className='text-xs font-semibold px-2 py-0.5 rounded-full'
            style={{
              backgroundColor: `${SEMANTIC_COLORS.primary}20`,
              color: SEMANTIC_COLORS.primary
            }}
          >
            {match.confidenceScore}% match
          </span>
        </span>
      }
    >
      {`Chat about ${match.candidateName}`}
    </ModalTitleWithIcon>
  ) : (
    'Candidate chat'
  )

  return (
    <ThemedModal
      open={open}
      onCancel={onClose}
      title={modalTitle}
      footer={null}
      width='min(920px, 92vw)'
      destroyOnClose
      styles={{
        body: { padding: '12px 16px 16px', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }
      }}
    >
      {cvLoading && (
        <div className='flex min-h-[40vh] items-center justify-center'>
          <Spin size='large' />
        </div>
      )}

      {!cvLoading && cvError && (
        <div className='flex min-h-[30vh] flex-col items-center justify-center text-center px-4'>
          <Text type='danger' className='block mb-2'>
            {cvError}
          </Text>
          <Text className='text-muted text-sm'>
            Matching found this candidate, but their live resume profile is not available to load.
          </Text>
        </div>
      )}

      {!cvLoading && !cvError && cvContext && recruiterUser && (
        <PotentialCandidateChatBody
          recruiterUser={recruiterUser}
          cvContext={cvContext}
          match={match}
        />
      )}
    </ThemedModal>
  )
})

PotentialCandidateChatModal.displayName = 'PotentialCandidateChatModal'

export default PotentialCandidateChatModal
