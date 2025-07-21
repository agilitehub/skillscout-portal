// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../core/context/ThemeContext'
import ChatInterface from './components/ChatInterface'

/**
 * Dashboard component - SkillScout Interview and Testing Interface
 * Main interface for conducting career tests and interviews with document upload capabilities
 * Implements proper state management, error handling, and responsive design
 * Follows module-driven development principles
 */
const Dashboard = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  // State management with proper initialization
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [detailView, setDetailView] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: '',
    description: '',
    project: '',
    icon: null,
    content: '',
    type: ''
  })

  // Color palette - memoized for performance
  const colors = useMemo(
    () => ({
      darkBlue: '#0E4173',
      blueAccent: '#2C5282',
      shakespeare: '#3FB1D4',
      pictonBlue: '#1EC9EA',
      logoGoldAccent: '#DCAC55',
      diSerria: '#DCAA55',
      navyDark: '#0A1929',
      logoNavy: '#0D2035'
    }),
    []
  )

  // iPhone SE detection with error handling
  const isIPhoneSE = useCallback(() => {
    try {
      const isIOS = /iPhone/.test(navigator.userAgent) && !window.MSStream
      return isIOS && window.innerWidth === 375 && window.innerHeight === 667
    } catch (error) {
      console.error('Error detecting iPhone SE:', error)
      return false
    }
  }, [])

  // Initialize iPhone SE detection
  useEffect(() => {
    try {
      if (isIPhoneSE()) {
        document.body.classList.add('iphone-se')
      } else {
        document.body.classList.remove('iphone-se')
      }

      return () => {
        document.body.classList.remove('iphone-se')
      }
    } catch (error) {
      console.error('Error in iPhone SE detection effect:', error)
    }
  }, [isIPhoneSE])

  // Fetch dashboard data with mock data for simulation
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock dashboard data for career interview simulation
        const mockData = {
          user: user,
          interviewSessions: [],
          careerTests: [],
          stats: {
            completedTests: 0,
            activeInterviews: 0,
            documentsUploaded: uploadedFiles.length
          },
          recentActivity: []
        }

        setDashboardData(mockData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set mock data even on error for demonstration
        setDashboardData({ user: user, interviewSessions: [], careerTests: [], stats: {} })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, uploadedFiles.length])

  // Handle opening detail views with validation
  const handleDetailViewOpen = useCallback((content) => {
    try {
      if (!content) {
        console.warn('Dashboard: Invalid content for detail view')
        return
      }
      setDetailView(content)
    } catch (error) {
      console.error('Error opening detail view:', error)
    }
  }, [])

  // Handle back navigation with proper state management
  const handleBack = useCallback(() => {
    try {
      setDetailView(null)
    } catch (error) {
      console.error('Error handling back navigation:', error)
    }
  }, [])

  // Handle modal operations with error handling
  const handleModalOpen = useCallback((content) => {
    try {
      if (!content) {
        console.warn('Dashboard: Invalid content for modal')
        return
      }
      setModalContent(content)
      setIsModalVisible(true)
    } catch (error) {
      console.error('Error opening modal:', error)
    }
  }, [])

  const handleModalClose = useCallback(() => {
    try {
      setIsModalVisible(false)
      setModalContent({
        title: '',
        description: '',
        project: '',
        icon: null,
        content: '',
        type: ''
      })
    } catch (error) {
      console.error('Error closing modal:', error)
    }
  }, [])

  // Handle file upload with validation and error handling
  const handleFileUpload = useCallback((fileList) => {
    try {
      if (!fileList || !Array.isArray(fileList)) {
        console.warn('Dashboard: Invalid file list provided')
        return
      }

      // Validate file types and sizes
      const validFiles = fileList.filter((file) => {
        const isValidType = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'].includes(
          file.name.split('.').pop().toLowerCase()
        )
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

        if (!isValidType) {
          console.warn(`Dashboard: Invalid file type for ${file.name}`)
        }
        if (!isValidSize) {
          console.warn(`Dashboard: File ${file.name} exceeds size limit`)
        }

        return isValidType && isValidSize
      })

      setUploadedFiles((prev) => [...prev, ...validFiles])

      // Log successful uploads
      if (validFiles.length > 0) {
        console.log(`Dashboard: Successfully uploaded ${validFiles.length} files`)
      }
    } catch (error) {
      console.error('Error handling file upload:', error)
    }
  }, [])

  // Remove uploaded file
  const handleFileRemove = useCallback((fileToRemove) => {
    try {
      setUploadedFiles((prev) => prev.filter((file) => file.uid !== fileToRemove.uid))
    } catch (error) {
      console.error('Error removing file:', error)
    }
  }, [])

  // Render detail view header
  const renderDetailViewHeader = useMemo(() => {
    if (!detailView) return null

    return (
      <div
        className='sticky top-0 p-2 md:p-4 flex items-center z-20'
        style={{
          background: darkMode ? colors.darkBlue : colors.shakespeare,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <button
          onClick={handleBack}
          className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 transition-colors hover:bg-white/30'
        >
          <FontAwesomeIcon icon={faChevronLeft} className='text-white' />
        </button>
        <div className='flex items-center min-w-0 flex-1'>
          {detailView.icon && (
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0'
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <FontAwesomeIcon icon={detailView.icon} className='text-white text-sm' />
            </div>
          )}
          <div className='min-w-0 flex-1'>
            <h2 className='text-white text-lg font-bold truncate mb-0'>{detailView.title}</h2>
          </div>
        </div>
      </div>
    )
  }, [detailView, darkMode, colors, handleBack])

  // Render main content - single page view or detail view
  const renderContent = useCallback(() => {
    try {
      // If we have a detail view, render that instead
      if (detailView) {
        return (
          <div className='min-h-screen bg-gray-50 dark:bg-gray-800'>
            {renderDetailViewHeader}
            <div className='p-4'>
              {/* Detail view content would be rendered here */}
              <div className='bg-white dark:bg-gray-700 rounded-lg shadow p-4'>
                <h3 className='text-lg font-medium text-gray-800 dark:text-white mb-3'>{detailView.title}</h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {detailView.description || 'Detailed information about this item.'}
                </p>
              </div>
            </div>
          </div>
        )
      }

      // Render main chat interface for career interviews and tests
      return (
        <ChatInterface
          onDetailViewOpen={handleDetailViewOpen}
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          user={user}
        />
      )
    } catch (error) {
      console.error('Error rendering content:', error)
      return (
        <div className='min-h-screen flex items-center justify-center'>
          <p className='text-red-500'>Error loading content. Please try again.</p>
        </div>
      )
    }
    // eslint-disable-next-line
  }, [
    detailView,
    renderDetailViewHeader,
    handleDetailViewOpen,
    handleModalOpen,
    uploadedFiles,
    handleFileUpload,
    handleFileRemove,
    user
  ])

  // Show loading spinner while data is being fetched
  if (loading && !dashboardData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div className='relative overflow-hidden h-[70vh] md:h-[80vh]'>
      {/* Background Elements */}
      <div className='fixed inset-0 pointer-events-none'>
        {darkMode ? (
          <>
            <div
              className='absolute -top-[10%] -right-[10%] w-1/2 h-1/2 rounded-full blur-3xl opacity-25'
              style={{ background: 'radial-gradient(circle, #87CEEB08 0%, transparent 70%)' }}
            />
            <div
              className='absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 rounded-full blur-3xl opacity-20'
              style={{ background: 'radial-gradient(circle, #B0E0E606 0%, transparent 70%)' }}
            />
            <div
              className='absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full blur-3xl opacity-15'
              style={{ background: 'radial-gradient(circle, #E0F6FF05 0%, transparent 70%)' }}
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

      {/* Main Content */}
      <div className='h-full overflow-hidden relative z-10'>{renderContent()}</div>

      {/* Knowledge Base Detail Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        width={700}
        bodyStyle={{
          padding: '0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        style={{
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        maskStyle={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <div
          style={{
            background: darkMode
              ? `linear-gradient(135deg, ${colors.navyDark}, ${colors.darkBlue})`
              : `linear-gradient(135deg, ${colors.shakespeare}, ${colors.pictonBlue})`,
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            padding: '16px'
          }}
          className='flex items-start'
        >
          {modalContent.icon && (
            <div
              className='w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0'
              style={{
                background: `linear-gradient(135deg, ${darkMode ? colors.darkBlue : colors.shakespeare}, ${darkMode ? colors.blueAccent : colors.pictonBlue})`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              <FontAwesomeIcon icon={modalContent.icon} className='text-white text-lg' />
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <h3 className='text-xl text-white font-bold mb-1'>{modalContent.title}</h3>
            {modalContent.project && <p className='text-sm text-white/80'>{modalContent.project}</p>}
          </div>
        </div>

        <div
          className='p-5'
          style={{
            background: darkMode ? '#374151' : '#F9FAFB',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >
          {modalContent.description && (
            <div className='mb-4'>
              <p className='text-gray-600 dark:text-gray-300'>{modalContent.description}</p>
            </div>
          )}

          {modalContent.content && (
            <div className='border dark:border-gray-700 rounded-lg p-4'>
              <p className='text-sm text-gray-600 dark:text-gray-300'>{modalContent.content}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard
