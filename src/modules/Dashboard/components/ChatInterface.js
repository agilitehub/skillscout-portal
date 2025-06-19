// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useRef } from 'react'
import { Button, message, Typography, Progress, Card, Switch, Divider } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPaperclip,
  faFileAlt,
  faFilePdf,
  faFileWord,
  faFileImage,
  faTrash,
  faPaperPlane,
  faRobot,
  faUser,
  faUserTie,
  faGraduationCap,
  faBriefcase,
  faAward,
  faEye,
  faList,
  faChartLine,
  faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import useChat from '../hooks/useChat'

const { Title, Text } = Typography

/**
 * ResumePreviewPanel component - Live resume preview with real-time updates
 * Shows actual resume content that updates based on chat interactions and uploads
 */
const ResumePreviewPanel = React.memo(({ user, uploadedFiles, messages, darkMode, colors }) => {
  const [viewMode, setViewMode] = useState('preview') // 'preview' or 'metrics'

  // Extract resume data from chat interactions and user info
  const resumeData = useMemo(() => {
    const userMessages = messages.filter((m) => m.type === 'user').map((m) => m.content.toLowerCase())
    const chatContent = userMessages.join(' ')

    // Extract information from chat
    const extractedInfo = {
      skills: [],
      experience: [],
      education: [],
      achievements: []
    }

    // Simple keyword extraction (in real app, this would use NLP)
    if (chatContent.includes('javascript') || chatContent.includes('js')) extractedInfo.skills.push('JavaScript')
    if (chatContent.includes('react')) extractedInfo.skills.push('React')
    if (chatContent.includes('python')) extractedInfo.skills.push('Python')
    if (chatContent.includes('node')) extractedInfo.skills.push('Node.js')
    if (chatContent.includes('sql') || chatContent.includes('database')) extractedInfo.skills.push('SQL')
    if (chatContent.includes('aws') || chatContent.includes('cloud')) extractedInfo.skills.push('AWS')
    if (chatContent.includes('git')) extractedInfo.skills.push('Git')

    // Extract experience keywords
    if (chatContent.includes('developer') || chatContent.includes('engineer')) {
      extractedInfo.experience.push({
        title: 'Software Developer',
        company: 'Technology Company',
        duration: 'Present',
        description: 'Developing software applications and solutions'
      })
    }
    if (chatContent.includes('manager') || chatContent.includes('lead')) {
      extractedInfo.experience.push({
        title: 'Team Lead',
        company: 'Previous Company',
        duration: '2+ years',
        description: 'Leading development teams and projects'
      })
    }

    // Extract education
    if (
      chatContent.includes('university') ||
      chatContent.includes('degree') ||
      chatContent.includes('bachelor') ||
      chatContent.includes('master')
    ) {
      extractedInfo.education.push({
        degree: "Bachelor's Degree",
        field: 'Computer Science',
        school: 'University',
        year: '2020'
      })
    }

    // Calculate completeness
    const baseScore = 20
    const fileScore = Math.min(uploadedFiles.length * 15, 30)
    const chatScore = Math.min(userMessages.length * 8, 50)
    const completeness = Math.min(baseScore + fileScore + chatScore, 100)

    return {
      basicInfo: {
        name: user?.Username || 'Your Name',
        email: user?.PublicKeyBase58Check ? 'demo@example.com' : 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        location: 'City, State',
        title: extractedInfo.experience.length > 0 ? extractedInfo.experience[0].title : 'Professional Title'
      },
      summary:
        chatContent.length > 50
          ? 'Experienced professional with expertise in software development and technology solutions. Passionate about creating innovative applications and leading successful projects.'
          : 'Add a professional summary by sharing your background and career goals in the chat.',
      skills: extractedInfo.skills.length > 0 ? extractedInfo.skills : ['Add skills by mentioning them in the chat'],
      experience:
        extractedInfo.experience.length > 0
          ? extractedInfo.experience
          : [
              {
                title: 'Share your work experience',
                company: 'Tell me about your current or previous roles',
                duration: '',
                description: 'Describe your responsibilities and achievements'
              }
            ],
      education:
        extractedInfo.education.length > 0
          ? extractedInfo.education
          : [
              {
                degree: 'Your Education',
                field: 'Field of Study',
                school: 'Educational Institution',
                year: 'Year'
              }
            ],
      documents: uploadedFiles.map((file) => ({
        name: file.name,
        type: file.name.split('.').pop().toUpperCase(),
        uploadedAt: new Date().toLocaleDateString()
      })),
      completeness
    }
  }, [user, uploadedFiles, messages])

  return (
    <div className='hidden lg:flex lg:w-2/5 xl:w-1/2 bg-white dark:bg-gray-800 flex-col'>
      {/* Panel Header */}
      <div className='flex-shrink-0 p-4 border-b dark:border-gray-700'>
        <div className='flex items-center justify-between mb-3'>
          <Title level={5} className='!mb-0 text-gray-800 dark:text-white'>
            Live Resume Preview
          </Title>
          <div className='flex items-center space-x-2'>
            <FontAwesomeIcon
              icon={viewMode === 'preview' ? faFileAlt : faChartLine}
              className='text-gray-500 text-sm'
            />
            <Switch
              size='small'
              checked={viewMode === 'metrics'}
              onChange={(checked) => setViewMode(checked ? 'metrics' : 'preview')}
              style={{
                backgroundColor: viewMode === 'metrics' ? colors.emeraldPrimary : undefined
              }}
            />
            <Text className='text-xs text-gray-500 dark:text-gray-400'>
              {viewMode === 'preview' ? 'Resume' : 'Metrics'}
            </Text>
          </div>
        </div>

        {/* Completeness Bar */}
        <div className='mb-2'>
          <div className='flex items-center justify-between mb-1'>
            <Text className='text-sm text-gray-600 dark:text-gray-300'>Completeness</Text>
            <Text className='text-sm font-medium' style={{ color: colors.emeraldPrimary }}>
              {resumeData.completeness}%
            </Text>
          </div>
          <Progress
            percent={resumeData.completeness}
            showInfo={false}
            strokeColor={{
              '0%': colors.shakespeare,
              '100%': colors.emeraldPrimary
            }}
            trailColor={darkMode ? '#374151' : '#f3f4f6'}
            size='small'
          />
        </div>
      </div>

      {/* Resume Content */}
      <div className='flex-1 overflow-y-auto p-4'>
        {viewMode === 'preview' ? (
          /* Resume Preview */
          <div className='space-y-4 text-sm'>
            {/* Header */}
            <div className='text-center pb-3 border-b dark:border-gray-600'>
              <Title level={4} className='!mb-1 text-gray-800 dark:text-white'>
                {resumeData.basicInfo.name}
              </Title>
              <Text className='text-gray-600 dark:text-gray-300 block'>{resumeData.basicInfo.title}</Text>
              <div className='flex justify-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400'>
                <span>{resumeData.basicInfo.email}</span>
                <span>{resumeData.basicInfo.phone}</span>
                <span>{resumeData.basicInfo.location}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <div className='flex items-center mb-2'>
                <FontAwesomeIcon icon={faUser} className='mr-2 text-blue-500' />
                <Text strong className='text-gray-800 dark:text-white'>
                  Professional Summary
                </Text>
              </div>
              <Text className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>{resumeData.summary}</Text>
            </div>

            {/* Skills */}
            <div>
              <div className='flex items-center mb-2'>
                <FontAwesomeIcon icon={faAward} className='mr-2 text-green-500' />
                <Text strong className='text-gray-800 dark:text-white'>
                  Skills
                </Text>
              </div>
              <div className='flex flex-wrap gap-2'>
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className='flex items-center mb-2'>
                <FontAwesomeIcon icon={faBriefcase} className='mr-2 text-purple-500' />
                <Text strong className='text-gray-800 dark:text-white'>
                  Experience
                </Text>
              </div>
              <div className='space-y-3'>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className='border-l-2 border-gray-200 dark:border-gray-600 pl-3'>
                    <Text strong className='text-gray-800 dark:text-white block'>
                      {exp.title}
                    </Text>
                    <Text className='text-gray-600 dark:text-gray-400 text-xs'>
                      {exp.company} • {exp.duration}
                    </Text>
                    <Text className='text-gray-600 dark:text-gray-300 text-sm mt-1'>{exp.description}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className='flex items-center mb-2'>
                <FontAwesomeIcon icon={faGraduationCap} className='mr-2 text-orange-500' />
                <Text strong className='text-gray-800 dark:text-white'>
                  Education
                </Text>
              </div>
              <div className='space-y-2'>
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <Text strong className='text-gray-800 dark:text-white block'>
                      {edu.degree} in {edu.field}
                    </Text>
                    <Text className='text-gray-600 dark:text-gray-400 text-xs'>
                      {edu.school} • {edu.year}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            {resumeData.documents.length > 0 && (
              <div>
                <div className='flex items-center mb-2'>
                  <FontAwesomeIcon icon={faFileAlt} className='mr-2 text-red-500' />
                  <Text strong className='text-gray-800 dark:text-white'>
                    Documents
                  </Text>
                </div>
                <div className='space-y-1'>
                  {resumeData.documents.map((doc, index) => (
                    <div key={index} className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                      <FontAwesomeIcon icon={faFileAlt} className='mr-2' />
                      <span>{doc.name}</span>
                      <span className='ml-auto'>{doc.uploadedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Metrics View */
          <div className='space-y-4'>
            <Card
              size='small'
              className='border-0 shadow-sm'
              style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <Text className='text-gray-600 dark:text-gray-400 text-xs'>Messages</Text>
                  <div className='text-2xl font-bold text-gray-800 dark:text-white'>
                    {messages.filter((m) => m.type === 'user').length}
                  </div>
                </div>
                <FontAwesomeIcon icon={faList} className='text-blue-500 text-xl' />
              </div>
            </Card>

            <Card
              size='small'
              className='border-0 shadow-sm'
              style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <Text className='text-gray-600 dark:text-gray-400 text-xs'>Files</Text>
                  <div className='text-2xl font-bold text-gray-800 dark:text-white'>{uploadedFiles.length}</div>
                </div>
                <FontAwesomeIcon icon={faFileAlt} className='text-green-500 text-xl' />
              </div>
            </Card>

            <Card
              size='small'
              className='border-0 shadow-sm'
              style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <Text className='text-gray-600 dark:text-gray-400 text-xs'>Skills Identified</Text>
                  <div className='text-2xl font-bold text-gray-800 dark:text-white'>{resumeData.skills.length}</div>
                </div>
                <FontAwesomeIcon icon={faAward} className='text-purple-500 text-xl' />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
})

ResumePreviewPanel.displayName = 'ResumePreviewPanel'

/**
 * Main ChatInterface component - Integrates AI controller with chat UI
 * Provides a complete chat experience with file uploads and resume preview
 */
const ChatInterface = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  // Use the new chat hook
  const {
    messages,
    isTyping,
    isLoading,
    error,
    uploadedFiles,
    isInitialized,
    isChatReady,
    isUploading,
    sendMessage,
    handleFileUpload,
    handleFileRemove,
    clearChat,
    getChatStats
  } = useChat(user)

  // Internal color palette for Career Match AI
  const colors = {
    darkBlue: '#1E3A52',
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    seaGreen: '#16A085',
    emeraldPrimary: '#059669',
    tealGreen: '#14B8A6'
  }

  // Get file icon based on type
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

  // Handle send message
  const handleSendMessage = useCallback(
    (content) => {
      sendMessage(content)
    },
    [sendMessage]
  )

  // Handle file upload from chat input
  const handleAttachFromChat = useCallback(() => {
    // This is handled by the ChatInput component directly
  }, [])

  // Show loading state if not initialized
  if (!isInitialized) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <Text className='text-gray-600 dark:text-gray-400'>Initializing chat...</Text>
        </div>
      </div>
    )
  }

  return (
    <div
      className='h-full flex flex-col bg-white dark:bg-gray-900 relative overflow-hidden'
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
      }}
    >
      {/* Background Elements */}
      <div className='fixed inset-0 pointer-events-none'>
        {darkMode ? (
          <>
            {/* Top-right blue gradient */}
            <div
              className='absolute -top-[20%] -right-[20%] w-3/4 h-3/4 rounded-full blur-3xl opacity-40'
              style={{ background: 'radial-gradient(circle, #4A90A4 0%, #2E5984 30%, transparent 70%)' }}
            />
            {/* Bottom-left emerald gradient */}
            <div
              className='absolute -bottom-[20%] -left-[20%] w-3/4 h-3/4 rounded-full blur-3xl opacity-35'
              style={{ background: 'radial-gradient(circle, #059669 0%, #065F46 30%, transparent 70%)' }}
            />
            {/* Center teal accent */}
            <div
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl opacity-25'
              style={{ background: 'radial-gradient(circle, #16A085 0%, #14B8A6 40%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div className='absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl opacity-80' />
            <div className='absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl opacity-80' />
            <div className='absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-amber-400/30 to-transparent rounded-full blur-3xl opacity-80' />
          </>
        )}
      </div>

      {/* Main Content with relative positioning */}
      <div className='h-full flex flex-col relative z-10'>
        {/* Header - Compact */}
        <div
          className='flex-shrink-0 px-4 py-3 border-b'
          style={{
            background: darkMode
              ? `linear-gradient(135deg, ${colors.darkBlue}, ${colors.shakespeare})`
              : `linear-gradient(135deg, ${colors.pictonBlue}, ${colors.shakespeare})`,
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <div className='flex items-center justify-between'>
            <div>
              <Title level={4} className='!text-white !mb-0'>
                Career Match AI Interview
              </Title>
              <Text className='text-white/70 text-sm'>AI-powered career assessment and interview preparation</Text>
            </div>
            <div className='text-white/60'>
              <FontAwesomeIcon icon={faRobot} className='text-xl' />
            </div>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className='flex-1 flex overflow-hidden'>
          {/* Left Panel - Chat Interface */}
          <div className='flex-1 flex flex-col lg:w-3/5 xl:w-1/2'>
            {/* Uploaded Files Section - Compact */}
            {uploadedFiles.length > 0 && (
              <div className='flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
                <Text className='text-xs text-gray-500 dark:text-gray-400 mb-1 block'>
                  Uploaded Documents ({uploadedFiles.length})
                </Text>
                <div className='flex flex-wrap gap-1'>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className='flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs'
                    >
                      <FontAwesomeIcon icon={getFileIcon(file.name)} className='text-blue-500 text-xs' />
                      <span className='text-gray-700 dark:text-gray-300 max-w-[100px] truncate'>{file.name}</span>
                      <Button
                        type='text'
                        size='small'
                        icon={<FontAwesomeIcon icon={faTrash} className='text-xs' />}
                        onClick={() => handleFileRemove(file.id)}
                        className='!p-0 !w-3 !h-3 text-red-400 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20'
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages Area */}
            <div className='flex-1 overflow-hidden'>
              <ChatMessages
                messages={messages}
                isTyping={isTyping}
                user={user}
                uploadedFiles={uploadedFiles}
                showFileInfo={true}
              />
            </div>

            {/* Chat Input */}
            <div className='flex-shrink-0'>
              <ChatInput
                onSendMessage={handleSendMessage}
                onAttachFile={handleAttachFromChat}
                onFileUpload={handleFileUpload}
                disabled={!isChatReady}
                isTyping={isTyping}
                isUploading={isUploading}
                maxLength={4000}
              />
            </div>
          </div>

          {/* Divider */}
          <div className='hidden lg:block w-3 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent relative'>
            <div
              className='absolute inset-0 bg-gradient-to-b opacity-50'
              style={{
                background: darkMode
                  ? `linear-gradient(to bottom, transparent 0%, ${colors.shakespeare}40 50%, transparent 100%)`
                  : `linear-gradient(to bottom, transparent 0%, ${colors.emeraldPrimary}30 50%, transparent 100%)`
              }}
            />
            {/* Left shadow effect */}
            <div className='absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/10 dark:from-black/20 to-transparent' />
          </div>

          {/* Right Panel - Live Resume Preview */}
          <ResumePreviewPanel
            user={user}
            uploadedFiles={uploadedFiles}
            messages={messages}
            darkMode={darkMode}
            colors={colors}
          />
        </div>
      </div>
    </div>
  )
})

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
