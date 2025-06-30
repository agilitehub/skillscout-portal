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
  Table,
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
  faClone,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import {
  getAllJobDescriptions,
  deleteJobDescription,
  duplicateJobDescription
} from '../JobDescriptions/utils.js/controller'

/**
 * Job Descriptions page for managing detailed job descriptions
 * Uses a table format similar to JobOpportunities for better data organization
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

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        title: 'Job Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div>
            <div className='font-semibold text-gray-900 dark:text-white'>{text}</div>
            <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center'>
              <FontAwesomeIcon icon={faBuilding} className='mr-1' />
              {record.company}
            </div>
          </div>
        ),
        sorter: (a, b) => a.title.localeCompare(b.title),
        width: 250
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (text) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faUsers} className='mr-2 text-gray-400' />
            {text}
          </div>
        ),
        filters: [
          { text: 'Engineering', value: 'Engineering' },
          { text: 'Marketing', value: 'Marketing' },
          { text: 'Sales', value: 'Sales' },
          { text: 'Design', value: 'Design' },
          { text: 'Product', value: 'Product' },
          { text: 'Operations', value: 'Operations' }
        ],
        onFilter: (value, record) => record.department === value,
        width: 150
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (text, record) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='mr-2 text-gray-400' />
            <div>
              <div>{text}</div>
              {record.remote && (
                <Tag color='green' size='small'>
                  Remote
                </Tag>
              )}
            </div>
          </div>
        ),
        width: 180
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (type) => (
          <Tag color={type === 'Full-time' ? 'blue' : type === 'Part-time' ? 'orange' : 'purple'}>{type}</Tag>
        ),
        filters: [
          { text: 'Full-time', value: 'Full-time' },
          { text: 'Part-time', value: 'Part-time' },
          { text: 'Contract', value: 'Contract' },
          { text: 'Internship', value: 'Internship' }
        ],
        onFilter: (value, record) => record.type === value,
        width: 120
      },
      {
        title: 'Salary Range',
        dataIndex: 'salaryRange',
        key: 'salaryRange',
        render: (salary) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faDollarSign} className='mr-1 text-green-500' />
            {salary}
          </div>
        ),
        width: 150
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'Active' ? 'green' : status === 'Draft' ? 'orange' : 'red'}>{status}</Tag>
        ),
        filters: [
          { text: 'Active', value: 'Active' },
          { text: 'Draft', value: 'Draft' },
          { text: 'Paused', value: 'Paused' },
          { text: 'Archived', value: 'Archived' }
        ],
        onFilter: (value, record) => record.status === value,
        width: 100
      },
      {
        title: 'Last Updated',
        dataIndex: 'lastUpdated',
        key: 'lastUpdated',
        render: (date) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faCalendarAlt} className='mr-1 text-gray-400' />
            {new Date(date).toLocaleDateString()}
          </div>
        ),
        sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
        width: 130
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size='small' wrap>
            <Tooltip title='View Details'>
              <Button
                type='text'
                size='small'
                icon={<FontAwesomeIcon icon={faEye} />}
                onClick={() => handleViewDescription(record)}
                className='text-blue-500 hover:text-blue-700'
              />
            </Tooltip>
            <Tooltip title='Edit Description'>
              <Button
                type='text'
                size='small'
                icon={<FontAwesomeIcon icon={faEdit} />}
                onClick={() => handleEditDescription(record)}
                className='text-green-500 hover:text-green-700'
              />
            </Tooltip>
            <Tooltip title='Copy to Clipboard'>
              <Button
                type='text'
                size='small'
                icon={<FontAwesomeIcon icon={faCopy} />}
                onClick={() => handleCopyDescription(record)}
                className='text-purple-500 hover:text-purple-700'
              />
            </Tooltip>
            <Tooltip title='Duplicate'>
              <Button
                type='text'
                size='small'
                icon={<FontAwesomeIcon icon={faClone} />}
                onClick={() => handleDuplicateDescription(record)}
                className='text-orange-500 hover:text-orange-700'
              />
            </Tooltip>
            <Popconfirm
              title='Delete Job Description'
              description='Are you sure you want to delete this job description? This action cannot be undone.'
              onConfirm={() => handleDeleteDescription(record.id)}
              okText='Delete'
              cancelText='Cancel'
              okType='danger'
              placement='topRight'
            >
              <Tooltip title='Delete'>
                <Button
                  type='text'
                  size='small'
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  className='text-red-500 hover:text-red-700'
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
        width: 200,
        fixed: 'right'
      }
    ],
    [handleViewDescription, handleEditDescription, handleCopyDescription, handleDuplicateDescription, handleDeleteDescription]
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
          <div className='mb-6'>
            <Card className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faClipboardCheck} className='text-blue-500 mr-3' />
                <div>
                  <h4 className={`font-semibold ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                    Viewing descriptions related to: {jobContext.title} at {jobContext.company}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    You navigated here from the job listing. Related job descriptions for "{jobContext.title}" will be highlighted.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Job Descriptions Table */}
        <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : ''} shadow-lg`}>
          <Table
            columns={columns}
            dataSource={jobDescriptions}
            loading={loading}
            rowKey='id'
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>
                  {`${range[0]}-${range[1]} of ${total} job descriptions`}
                </span>
              ),
              className: darkMode ? 'dark-pagination' : '',
              itemRender: (current, type, originalElement) => {
                if (type === 'prev' || type === 'next' || type === 'jump-prev' || type === 'jump-next') {
                  return React.cloneElement(originalElement, {
                    style: {
                      ...originalElement.props.style,
                      color: darkMode ? '#ffffff' : '#000000',
                      backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                      borderColor: darkMode ? '#6b7280' : '#d9d9d9'
                    }
                  })
                }
                if (type === 'page') {
                  return React.cloneElement(originalElement, {
                    style: {
                      ...originalElement.props.style,
                      color: darkMode ? '#ffffff' : '#000000',
                      backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                      borderColor: darkMode ? '#6b7280' : '#d9d9d9'
                    }
                  })
                }
                return originalElement
              }
            }}
            className={darkMode ? 'dark-table' : ''}
            scroll={{ x: 1200 }}
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff'
            }}
            components={{
              header: {
                cell: (props) => (
                  <th
                    {...props}
                    style={{
                      backgroundColor: darkMode ? '#4b5563' : '#fafafa',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderBottom: darkMode ? '1px solid #6b7280' : '1px solid #f0f0f0',
                      ...props.style
                    }}
                  />
                )
              },
              body: {
                row: (props) => {
                  const isRelated = jobContext && 
                    (props.children[0]?.props?.record?.title?.toLowerCase().includes(jobContext.title.toLowerCase()) ||
                     props.children[0]?.props?.record?.company?.toLowerCase().includes(jobContext.company.toLowerCase()))
                  
                  return (
                    <tr
                      {...props}
                      style={{
                        backgroundColor: isRelated 
                          ? (darkMode ? '#1e3a8a' : '#dbeafe')
                          : (darkMode ? '#374151' : '#ffffff'),
                        color: darkMode ? '#ffffff' : '#000000',
                        borderBottom: darkMode ? '1px solid #4b5563' : '1px solid #f0f0f0',
                        ...props.style
                      }}
                      onMouseEnter={(e) => {
                        if (isRelated) {
                          e.currentTarget.style.backgroundColor = darkMode ? '#1e40af' : '#bfdbfe'
                        } else {
                          e.currentTarget.style.backgroundColor = darkMode ? '#4b5563' : '#fafafa'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isRelated) {
                          e.currentTarget.style.backgroundColor = darkMode ? '#1e3a8a' : '#dbeafe'
                        } else {
                          e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#ffffff'
                        }
                      }}
                    />
                  )
                },
                cell: (props) => (
                  <td
                    {...props}
                    style={{
                      backgroundColor: 'transparent',
                      color: darkMode ? '#ffffff' : '#000000',
                      borderBottom: darkMode ? '1px solid #4b5563' : '1px solid #f0f0f0',
                      ...props.style
                    }}
                  />
                )
              }
            }}
          />
        </Card>

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

      {/* Dark mode table styles */}
      <style>{`
        .dark-table .ant-table-thead > tr > th {
          background-color: #4b5563 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #6b7280 !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          background-color: transparent !important;
          color: #ffffff !important;
          border-bottom: 1px solid #4b5563 !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td {
          background-color: #4b5563 !important;
        }
        .dark-pagination .ant-pagination-item {
          background-color: #4b5563 !important;
          border-color: #6b7280 !important;
        }
        .dark-pagination .ant-pagination-item a {
          color: #ffffff !important;
        }
        .dark-pagination .ant-pagination-item-active {
          background-color: #059669 !important;
          border-color: #059669 !important;
        }
      `}</style>
    </div>
  )
})

export default JobDescriptions
