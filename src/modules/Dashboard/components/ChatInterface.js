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

const { Title, Text } = Typography

/**
 * ResumePreviewPanel component - Live resume preview with real-time updates
 * Shows actual resume content that updates based on chat interactions and uploads
 */
const ResumePreviewPanel = React.memo(({ user, uploadedFiles, messages, darkMode, colors }) => {
  const [viewMode, setViewMode] = useState('preview') // 'preview' or 'metrics'
  
  // Extract resume data from chat interactions and user info
  const resumeData = useMemo(() => {
    const userMessages = messages.filter(m => m.type === 'user').map(m => m.content.toLowerCase())
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
    if (chatContent.includes('university') || chatContent.includes('degree') || chatContent.includes('bachelor') || chatContent.includes('master')) {
      extractedInfo.education.push({
        degree: 'Bachelor\'s Degree',
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
      summary: chatContent.length > 50 
        ? 'Experienced professional with expertise in software development and technology solutions. Passionate about creating innovative applications and leading successful projects.'
        : 'Add a professional summary by sharing your background and career goals in the chat.',
      skills: extractedInfo.skills.length > 0 ? extractedInfo.skills : ['Add skills by mentioning them in the chat'],
      experience: extractedInfo.experience.length > 0 ? extractedInfo.experience : [{
        title: 'Share your work experience',
        company: 'Tell me about your current or previous roles',
        duration: '',
        description: 'Describe your responsibilities and achievements'
      }],
      education: extractedInfo.education.length > 0 ? extractedInfo.education : [{
        degree: 'Your Education',
        field: 'Field of Study',
        school: 'Educational Institution',
        year: 'Year'
      }],
      documents: uploadedFiles.map(file => ({
        name: file.name,
        type: file.name.split('.').pop().toUpperCase(),
        uploadedAt: new Date().toLocaleDateString()
      })),
      completeness
    }
  }, [user, uploadedFiles, messages])

  return (
    <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 bg-white dark:bg-gray-800 flex-col">
      {/* Panel Header */}
      <div className="flex-shrink-0 p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <Title level={5} className="!mb-0 text-gray-800 dark:text-white">
            Live Resume Preview
          </Title>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon 
              icon={viewMode === 'preview' ? faFileAlt : faChartLine} 
              className="text-gray-500 text-sm" 
            />
            <Switch
              size="small"
              checked={viewMode === 'metrics'}
              onChange={(checked) => setViewMode(checked ? 'metrics' : 'preview')}
              style={{
                backgroundColor: viewMode === 'metrics' ? colors.emeraldPrimary : undefined
              }}
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {viewMode === 'preview' ? 'Resume' : 'Metrics'}
            </Text>
          </div>
        </div>
        
        {/* Completeness Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <Text className="text-sm text-gray-600 dark:text-gray-300">Completeness</Text>
            <Text className="text-sm font-medium" style={{ color: colors.emeraldPrimary }}>
              {resumeData.completeness}%
            </Text>
          </div>
          <Progress 
            percent={resumeData.completeness} 
            showInfo={false}
            strokeColor={{
              '0%': colors.shakespeare,
              '100%': colors.emeraldPrimary,
            }}
            trailColor={darkMode ? '#374151' : '#f3f4f6'}
            size="small"
          />
        </div>
      </div>

      {/* Resume Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'preview' ? (
          /* Resume Preview */
          <div className="space-y-4 text-sm">
            {/* Header */}
            <div className="text-center pb-3 border-b dark:border-gray-600">
              <Title level={4} className="!mb-1 text-gray-800 dark:text-white">
                {resumeData.basicInfo.name}
              </Title>
              <Text className="text-gray-600 dark:text-gray-300 block">
                {resumeData.basicInfo.title}
              </Text>
              <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{resumeData.basicInfo.email}</span>
                <span>{resumeData.basicInfo.phone}</span>
                <span>{resumeData.basicInfo.location}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                <Text strong className="text-gray-800 dark:text-white">Professional Summary</Text>
              </div>
              <Text className={`text-xs leading-relaxed ${resumeData.summary.includes('Add a professional') ? 'text-gray-400 italic' : 'text-gray-600 dark:text-gray-300'}`}>
                {resumeData.summary}
              </Text>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faAward} className="mr-2 text-emerald-500" />
                <Text strong className="text-gray-800 dark:text-white">Skills</Text>
              </div>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      skill.includes('Add skills') 
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 italic'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-purple-500" />
                <Text strong className="text-gray-800 dark:text-white">Work Experience</Text>
              </div>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <Text strong className={`text-sm ${exp.title.includes('Share your') ? 'text-gray-400 italic' : 'text-gray-800 dark:text-white'}`}>
                      {exp.title}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {exp.duration}
                    </Text>
                  </div>
                  <Text className={`text-xs ${exp.company.includes('Tell me') ? 'text-gray-400 italic' : 'text-blue-600 dark:text-blue-400'} mb-1`}>
                    {exp.company}
                  </Text>
                  <Text className={`text-xs leading-relaxed ${exp.description.includes('Describe your') ? 'text-gray-400 italic' : 'text-gray-600 dark:text-gray-300'}`}>
                    {exp.description}
                  </Text>
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-green-500" />
                <Text strong className="text-gray-800 dark:text-white">Education</Text>
              </div>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text strong className={`text-sm ${edu.degree.includes('Your Education') ? 'text-gray-400 italic' : 'text-gray-800 dark:text-white'}`}>
                        {edu.degree}
                      </Text>
                      <Text className={`text-xs ${edu.field.includes('Field of') ? 'text-gray-400 italic' : 'text-gray-600 dark:text-gray-300'} block`}>
                        {edu.field}
                      </Text>
                      <Text className={`text-xs ${edu.school.includes('Educational') ? 'text-gray-400 italic' : 'text-blue-600 dark:text-blue-400'}`}>
                        {edu.school}
                      </Text>
                    </div>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {edu.year}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents */}
            {resumeData.documents.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-orange-500" />
                  <Text strong className="text-gray-800 dark:text-white">Uploaded Documents</Text>
                </div>
                {resumeData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between mb-1 last:mb-0">
                    <Text className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {doc.name}
                    </Text>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                      {doc.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Metrics View */
          <div className="space-y-3">
            {/* Gamification Elements */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-lg mb-1" />
                <div className="font-medium text-blue-700 dark:text-blue-300">{uploadedFiles.length}</div>
                <div className="text-blue-600 dark:text-blue-400">Documents</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <FontAwesomeIcon icon={faRobot} className="text-emerald-500 text-lg mb-1" />
                <div className="font-medium text-emerald-700 dark:text-emerald-300">{messages.filter(m => m.type === 'user').length - 1}</div>
                <div className="text-emerald-600 dark:text-emerald-400">Interactions</div>
              </div>
            </div>

            {/* Section Completeness */}
            <Card size="small" className="shadow-sm">
              <Text strong className="text-sm text-gray-800 dark:text-white block mb-3">Section Analysis</Text>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Basic Info</span>
                  <span className="font-medium" style={{ color: colors.emeraldPrimary }}>
                    {resumeData.basicInfo.name !== 'Your Name' ? '85%' : '20%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Skills</span>
                  <span className="font-medium" style={{ color: colors.shakespeare }}>
                    {resumeData.skills.some(s => !s.includes('Add skills')) ? '70%' : '10%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Experience</span>
                  <span className="font-medium" style={{ color: colors.shakespeare }}>
                    {resumeData.experience.some(e => !e.title.includes('Share your')) ? '65%' : '15%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Education</span>
                  <span className="font-medium" style={{ color: colors.emeraldPrimary }}>
                    {resumeData.education.some(e => !e.degree.includes('Your Education')) ? '80%' : '25%'}
                  </span>
                </div>
              </div>
            </Card>

            {/* AI Suggestions */}
            {resumeData.completeness < 80 && (
              <Card
                size="small"
                className="shadow-sm"
                style={{
                  backgroundColor: darkMode ? '#065F46' : '#ECFDF5',
                  borderColor: colors.emeraldPrimary
                }}
              >
                <div className="flex items-start space-x-2">
                  <FontAwesomeIcon 
                    icon={faRobot} 
                    className="text-sm mt-0.5"
                    style={{ color: colors.emeraldPrimary }}
                  />
                  <div>
                    <Text className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      AI Suggestion
                    </Text>
                    <Text className="text-xs text-emerald-700 dark:text-emerald-300 block mt-1">
                      {resumeData.completeness < 40 
                        ? "Share more about your background to improve your profile!"
                        : resumeData.completeness < 60
                        ? "Upload additional documents like certificates or portfolio items."
                        : "Great progress! Add more details about your achievements."}
                    </Text>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

ResumePreviewPanel.displayName = 'ResumePreviewPanel'

/**
 * ChatInterface component - Main career interview and testing interface
 * Features document upload, drag-and-drop, chat functionality for career assessments
 * Implements responsive design, theme support, and comprehensive error handling
 */
const ChatInterface = React.memo(({ 
  onDetailViewOpen, 
  uploadedFiles = [], 
  onFileUpload, 
  onFileRemove, 
  user 
}) => {
  const { darkMode } = useTheme()
  const fileInputRef = useRef(null)
  
  // Chat state management
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to Career Match AI! I\'m here to help you with career assessments and interviews. Feel free to upload your resume, portfolio, or any relevant documents to get started.',
      timestamp: new Date().toISOString()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  
  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  // Color palette for theme consistency
  const colors = useMemo(() => ({
    darkBlue: '#1E3A52',
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    toreaBay: '#2E5984',
    seaGreen: '#16A085',
    emeraldPrimary: '#059669',
    emeraldBright: '#34D399',
    tealGreen: '#14B8A6',
    forestGreen: '#065F46'
  }), [])

  // File type icon mapping
  const getFileIcon = useCallback((fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
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

  // Handle message sending
  const handleSendMessage = useCallback(async (messageContent) => {
    try {
      if (!messageContent.trim()) return

      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, userMessage])
      setIsTyping(true)
      
      // Simulate AI response delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Thank you for your message. I\'m analyzing your input and will provide personalized career guidance based on your profile and uploaded documents.',
          timestamp: new Date().toISOString()
        }
        
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 2000)

    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
    }
  }, [])

  // Handle file upload with comprehensive validation
  const handleUpload = useCallback((info) => {
    try {
      const { fileList, file } = info
      
      if (file.status === 'uploading') return
      
      if (file.status === 'done' || file.status === 'error') {
        // Process the file list
        const processedFiles = fileList.map(file => ({
          ...file,
          uid: file.uid || Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
          status: 'done'
        }))
        
        onFileUpload?.(processedFiles)
        message.success(`${file.name} uploaded successfully`)
        
        // Add system message about file upload
        const systemMessage = {
          id: Date.now(),
          type: 'system',
          content: `Document "${file.name}" has been uploaded and will be considered in your career assessment.`,
          timestamp: new Date().toISOString()
        }
        
        setMessages(prev => [...prev, systemMessage])
      }
    } catch (error) {
      console.error('Error handling upload:', error)
      message.error('Failed to upload file')
    }
  }, [onFileUpload, setMessages])



  // Remove file handler
  const handleRemoveFile = useCallback((file) => {
    try {
      onFileRemove?.(file)
      message.success(`${file.name} removed`)
    } catch (error) {
      console.error('Error removing file:', error)
      message.error('Failed to remove file')
    }
  }, [onFileRemove])

  // Handle attachment from chat input
  const handleAttachFromChat = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  // Validate file type and size
  const validateFile = useCallback((file) => {
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
    const fileExtension = file.name.split('.').pop().toLowerCase()
    const isValidType = allowedTypes.includes(fileExtension)
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
    
    if (!isValidType) {
      message.error(`${file.name} is not a supported file type. Supported types: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG`)
      return false
    }
    
    if (!isValidSize) {
      message.error(`${file.name} must be smaller than 10MB`)
      return false
    }
    
    return true
  }, [])

  // Handle drag and drop events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter <= 1) {
      setIsDragOver(false)
    }
  }, [dragCounter])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return
    
    const validFiles = files.filter(validateFile)
    if (validFiles.length === 0) return
    
    const mockFileList = validFiles.map((file, index) => ({
      uid: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'done',
      originFileObj: file
    }))
    
    handleUpload({ fileList: mockFileList, file: mockFileList[0] })
    
    if (validFiles.length > 1) {
      message.success(`${validFiles.length} files uploaded successfully`)
    }
  }, [validateFile, handleUpload])

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-blue-500/20 dark:bg-blue-400/20 border-4 border-dashed border-blue-500 dark:border-blue-400 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="text-center p-8">
            <FontAwesomeIcon 
              icon={faCloudUploadAlt} 
              className="text-6xl text-blue-500 dark:text-blue-400 mb-4" 
            />
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-2">
              Drop files here to upload
            </h3>
            <p className="text-blue-500 dark:text-blue-400">
              Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
            </p>
            <p className="text-sm text-blue-400 dark:text-blue-500 mt-1">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      )}
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {darkMode ? (
          <>
            {/* Top-right blue gradient */}
            <div 
              className="absolute -top-[20%] -right-[20%] w-3/4 h-3/4 rounded-full blur-3xl opacity-40"
              style={{ background: 'radial-gradient(circle, #4A90A4 0%, #2E5984 30%, transparent 70%)' }}
            />
            {/* Bottom-left emerald gradient */}
            <div 
              className="absolute -bottom-[20%] -left-[20%] w-3/4 h-3/4 rounded-full blur-3xl opacity-35"
              style={{ background: 'radial-gradient(circle, #059669 0%, #065F46 30%, transparent 70%)' }}
            />
            {/* Center teal accent */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #16A085 0%, #14B8A6 40%, transparent 70%)' }}
            />
            {/* Additional accent spots */}
            <div 
              className="absolute top-[20%] right-[30%] w-1/3 h-1/3 rounded-full blur-2xl opacity-20"
              style={{ background: 'radial-gradient(circle, #5BA3D4 0%, transparent 60%)' }}
            />
            <div 
              className="absolute bottom-[30%] left-[20%] w-1/4 h-1/4 rounded-full blur-2xl opacity-15"
              style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 60%)' }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl opacity-80" />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl opacity-80" />
            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-amber-400/30 to-transparent rounded-full blur-3xl opacity-80" />
          </>
        )}
      </div>

            {/* Main Content with relative positioning */}
      <div className="h-full flex flex-col relative z-10">
        {/* Header - Compact */}
        <div 
          className="flex-shrink-0 px-4 py-3 border-b"
              style={{
            background: darkMode 
              ? `linear-gradient(135deg, ${colors.darkBlue}, ${colors.shakespeare})`
              : `linear-gradient(135deg, ${colors.pictonBlue}, ${colors.shakespeare})`,
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <Title level={4} className="!text-white !mb-0">
                Career Match AI Interview
              </Title>
              <Text className="text-white/70 text-sm">
                AI-powered career assessment and interview preparation
              </Text>
            </div>
            <div className="text-white/60">
              <FontAwesomeIcon icon={faRobot} className="text-xl" />
        </div>
          </div>
          </div>
        
              {/* Two-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Chat Interface */}
          <div className="flex-1 flex flex-col lg:w-3/5 xl:w-1/2">
            {/* Uploaded Files Section - Compact */}
        {uploadedFiles.length > 0 && (
              <div className="flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Uploaded Documents ({uploadedFiles.length})
                </Text>
                <div className="flex flex-wrap gap-1">
                  {uploadedFiles.map((file) => (
                    <div 
                      key={file.uid}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs"
                    >
                      <FontAwesomeIcon 
                        icon={getFileIcon(file.name)} 
                        className="text-blue-500 text-xs" 
                      />
                      <span className="text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                        {file.name}
                  </span>
                      <Button 
                        type="text" 
                        size="small"
                        icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
                        onClick={() => handleRemoveFile(file)}
                        className="!p-0 !w-3 !h-3 text-red-400 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                      />
                </div>
              ))}
            </div>
          </div>
        )}
      
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-hidden">
        <ChatMessages 
                messages={messages}
          isTyping={isTyping}
                user={user}
        />
      </div>
      
            {/* Hidden file input for chat attachment */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => {
                const files = Array.from(e.target.files)
                if (files.length > 0) {
                  const mockFileList = files.map((file, index) => ({
                    uid: Date.now() + index,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    status: 'done',
                    originFileObj: file
                  }))
                  handleUpload({ fileList: mockFileList, file: mockFileList[0] })
                }
                e.target.value = '' // Reset input
              }}
            />

            {/* Chat Input */}
      <div className="flex-shrink-0">
        <ChatInput 
          onSendMessage={handleSendMessage}
                onAttachFile={handleAttachFromChat}
                disabled={isTyping}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-3 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent relative">
            <div 
              className="absolute inset-0 bg-gradient-to-b opacity-50"
              style={{
                background: darkMode 
                  ? `linear-gradient(to bottom, transparent 0%, ${colors.shakespeare}40 50%, transparent 100%)`
                  : `linear-gradient(to bottom, transparent 0%, ${colors.emeraldPrimary}30 50%, transparent 100%)`
              }}
            />
            {/* Left shadow effect */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/10 dark:from-black/20 to-transparent"
            />
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