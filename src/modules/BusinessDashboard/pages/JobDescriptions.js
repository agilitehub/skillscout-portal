// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Card,
  Button,
  Modal,
  Tag,
  Space,
  Tooltip,
  List,
  Avatar,
  Alert,
  message,
  Popconfirm
} from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faFileText,
  faBuilding,
  faMapMarkerAlt,
  faDollarSign,
  faUsers,
  faCalendarAlt,
  faCopy,
  faDownload,
  faClone
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import {
  getAllJobDescriptions,
  deleteJobDescription,
  duplicateJobDescription
} from '../JobDescriptions/utils.js/controller'
import { formatListItems } from '../JobDescriptions/utils.js/data-model'

/**
 * Job Descriptions page for managing detailed job descriptions
 * Allows creation, editing, and management of job description templates
 */
const JobDescriptions = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  // Get job context from navigation state
  const jobContext = location.state?.jobContext
  const highlightJobId = location.state?.highlightJobId

  // State management
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedDescription, setSelectedDescription] = useState(null)

  // Load job descriptions from database
  useEffect(() => {
    const loadDescriptions = async () => {
      setLoading(true)
      try {
        const result = await getAllJobDescriptions()
        if (result.success) {
          setJobDescriptions(result.data)
        } else {
          console.error('Error loading job descriptions:', result.error)
          message.error('Failed to load job descriptions: ' + result.error)
          setJobDescriptions([])
        }
      } catch (error) {
        console.error('Unexpected error loading job descriptions:', error)
        message.error('An unexpected error occurred while loading job descriptions')
        setJobDescriptions([])
      } finally {
        setLoading(false)
      }
    }

    loadDescriptions()
  }, [])

  // Handle navigation operations
  const handleCreateDescription = useCallback(() => {
    navigate('/business-dashboard/job-descriptions/create')
  }, [navigate])

  const handleEditDescription = useCallback(
    (description) => {
      // Navigate to edit page (to be implemented later)
      message.info('Edit functionality will be implemented in a future update')
    },
    []
  )

  const handleViewDescription = useCallback((description) => {
    setSelectedDescription(description)
    setIsViewModalVisible(true)
  }, [])

  const handleDeleteDescription = useCallback(async (descriptionId) => {
    try {
      const result = await deleteJobDescription(descriptionId)
      if (result.success) {
        setJobDescriptions((prev) => prev.filter((desc) => desc.id !== descriptionId))
        message.success('Job description deleted successfully')
      } else {
        console.error('Error deleting job description:', result.error)
        message.error('Failed to delete job description: ' + result.error)
      }
    } catch (error) {
      console.error('Unexpected error deleting job description:', error)
      message.error('An unexpected error occurred while deleting the job description')
    }
  }, [])

  const handleViewModalClose = useCallback(() => {
    setIsViewModalVisible(false)
    setSelectedDescription(null)
  }, [])

  const handleCopyDescription = useCallback(async (description) => {
    try {
      // Copy description content to clipboard
      const content = `${description.title}\n\n${description.overview}\n\nResponsibilities:\n${description.responsibilities.map((r) => `• ${r}`).join('\n')}\n\nRequirements:\n${description.requirements.map((r) => `• ${r}`).join('\n')}`
      await navigator.clipboard.writeText(content)
      message.success('Job description copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      message.error('Failed to copy job description')
    }
  }, [])

  const handleDuplicateDescription = useCallback(
    async (description) => {
      try {
        const result = await duplicateJobDescription(description.id, user)
        if (result.success) {
          setJobDescriptions((prev) => [result.data, ...prev])
          message.success('Job description duplicated successfully!')
        } else {
          console.error('Error duplicating job description:', result.error)
          message.error('Failed to duplicate job description: ' + result.error)
        }
      } catch (error) {
        console.error('Unexpected error duplicating job description:', error)
        message.error('An unexpected error occurred while duplicating the job description')
      }
    },
    [user]
  )

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-800 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='fixed inset-0 pointer-events-none'>
        {darkMode ? (
          <>
            <div
              className='absolute -top-[10%] -right-[10%] w-1/2 h-1/2 rounded-full blur-3xl'
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}
            />
            <div
              className='absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 rounded-full blur-3xl'
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)' }}
            />
            <div
              className='absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full blur-3xl'
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}
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

      <BusinessSidebar />
      <div className='p-6 ml-64 relative z-10'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2'>Job Descriptions</h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Create and manage detailed job descriptions for your positions
              </p>
            </div>
            <Button
              type='primary'
              size='large'
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleCreateDescription}
              style={{
                background: darkMode ? '#059669' : '#10b981',
                borderColor: darkMode ? '#059669' : '#10b981'
              }}
            >
              Create Description
            </Button>
          </div>
        </div>

        {/* Job Context Alert */}
        {jobContext && (
          <Alert
            message={`Viewing descriptions related to: ${jobContext.title} at ${jobContext.company}`}
            description={`You navigated here from the job listing. Related job descriptions for "${jobContext.title}" will be highlighted.`}
            type='info'
            showIcon
            closable
            className='mb-6'
            style={{
              backgroundColor: darkMode ? '#374151' : '#e6f3ff',
              borderColor: darkMode ? '#4b5563' : '#91d5ff',
              color: darkMode ? '#e5e7eb' : '#1f2937'
            }}
          />
        )}

        {/* Job Descriptions List */}
        <div className='grid gap-6'>
          {jobDescriptions.map((description) => {
            const isRelated =
              jobContext &&
              (description.title.toLowerCase().includes(jobContext.title.toLowerCase()) ||
                description.company.toLowerCase().includes(jobContext.company.toLowerCase()))

            return (
              <Card
                key={description.id}
                className={`${darkMode ? 'bg-gray-700 border-gray-600' : ''} ${
                  isRelated ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                } shadow-lg hover:shadow-xl transition-all duration-200`}
                loading={loading}
              >
                <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between'>
                  <div className='flex-1'>
                    {/* Header */}
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center'>
                        <Avatar
                          size={48}
                          style={{
                            background: darkMode
                              ? 'linear-gradient(135deg, #059669, #047857)'
                              : 'linear-gradient(135deg, #10b981, #059669)'
                          }}
                          icon={<FontAwesomeIcon icon={faFileText} />}
                        />
                        <div className='ml-4'>
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {description.title}
                          </h3>
                          <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                            <FontAwesomeIcon icon={faBuilding} className='mr-1' />
                            {description.company}
                            <span className='mx-2'>•</span>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className='mr-1' />
                            {description.location}
                            {description.remote && (
                              <Tag color='green' size='small' className='ml-2'>
                                Remote
                              </Tag>
                            )}
                          </div>
                        </div>
                      </div>
                      <Tag color={description.status === 'Active' ? 'green' : 'orange'}>{description.status}</Tag>
                    </div>

                    {/* Overview */}
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {description.overview}
                    </p>

                    {/* Tags */}
                    <div className='flex flex-wrap gap-1 mb-4'>
                      {description.tags.map((tag, index) => (
                        <Tag key={index} color='blue' size='small'>
                          {tag}
                        </Tag>
                      ))}
                    </div>

                    {/* Meta Information */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs'>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Department:
                        </span>
                        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {description.department}
                        </div>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type:</span>
                        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{description.type}</div>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Salary:</span>
                        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {description.salaryRange}
                        </div>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Updated:</span>
                        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {new Date(description.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4'>
                    <Tooltip title='View Details'>
                      <Button
                        type='text'
                        icon={<FontAwesomeIcon icon={faEye} />}
                        onClick={() => handleViewDescription(description)}
                        className='text-blue-500 hover:text-blue-700'
                      />
                    </Tooltip>
                    <Tooltip title='Edit Description'>
                      <Button
                        type='text'
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => handleEditDescription(description)}
                        className='text-green-500 hover:text-green-700'
                      />
                    </Tooltip>
                    <Tooltip title='Copy to Clipboard'>
                      <Button
                        type='text'
                        icon={<FontAwesomeIcon icon={faCopy} />}
                        onClick={() => handleCopyDescription(description)}
                        className='text-purple-500 hover:text-purple-700'
                      />
                    </Tooltip>
                    <Tooltip title='Duplicate'>
                      <Button
                        type='text'
                        icon={<FontAwesomeIcon icon={faClone} />}
                        onClick={() => handleDuplicateDescription(description)}
                        className='text-orange-500 hover:text-orange-700'
                      />
                    </Tooltip>
                    <Popconfirm
                      title='Delete Job Description'
                      description='Are you sure you want to delete this job description? This action cannot be undone.'
                      onConfirm={() => handleDeleteDescription(description.id)}
                      okText='Delete'
                      cancelText='Cancel'
                      okType='danger'
                      placement='topRight'
                    >
                      <Tooltip title='Delete'>
                        <Button
                          type='text'
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          className='text-red-500 hover:text-red-700'
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Job Description Details Modal */}
        {selectedDescription && (
          <Modal
            title={
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                Job Description Details
              </span>
            }
            open={isViewModalVisible}
            onCancel={handleViewModalClose}
            footer={[
              <Button key='close' onClick={handleViewModalClose}>
                Close
              </Button>
            ]}
            width={900}
            className={darkMode ? 'ant-modal-dark' : ''}
            styles={{
              content: { backgroundColor: darkMode ? '#374151' : '#ffffff' },
              body: { backgroundColor: darkMode ? '#374151' : '#ffffff' },
              header: {
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                borderBottom: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
              },
              footer: {
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                borderTop: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
              }
            }}
          >
            <div className='space-y-6'>
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedDescription.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedDescription.overview}</p>
              </div>

              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Key Responsibilities:
                </h4>
                <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedDescription.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Requirements:</h4>
                <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedDescription.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {selectedDescription.benefits && selectedDescription.benefits.length > 0 && (
                <div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Benefits:</h4>
                  <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedDescription.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
})

JobDescriptions.displayName = 'JobDescriptions'

export default JobDescriptions
