// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Card,
  Button,
  Tag,
  Tooltip,
  Table,
  message,
  Popconfirm,
  Input
} from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,  
  faTrash,
  faBuilding,
  faUsers,
  faCalendarAlt,
  faClipboardCheck,
  faFileText
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import {
  getAllJobDescriptions,
  deleteJobDescription
} from '../JobDescriptions/utils.js/controller'

const { Search } = Input

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

  // State management
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
      navigate('/business-dashboard/job-descriptions/create', {
        state: { 
          jobDescription: description,
          isEdit: true,
          editId: description.id 
        }
      })
    },
    [navigate]
  )

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

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        title: 'Job Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div>
            <div 
              className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200'
              onClick={() => handleEditDescription(record)}
            >
              {text}
            </div>
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
        sorter: (a, b) => a.department.localeCompare(b.department),
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
        title: 'Job Type',
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
        ),
        width: 80,
        fixed: 'right'
      }
    ],
    [handleEditDescription, handleDeleteDescription]
  )

  // Filter data based on search term
  const filteredJobDescriptions = useMemo(() => {
    if (!searchTerm) return jobDescriptions
    
    return jobDescriptions.filter(description => 
      description.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [jobDescriptions, searchTerm])

  return (
    <>
      {/* Dark Mode Styles */}
      {darkMode && (
        <style jsx global>{`
          .dark-search .ant-input {
            background-color: #4b5563 !important;
            border-color: #6b7280 !important;
            color: #ffffff !important;
          }
          .dark-search .ant-input::placeholder {
            color: #9ca3af !important;
          }
          .dark-search .ant-input-search-button {
            background-color: #6b7280 !important;
            border-color: #6b7280 !important;
          }
        `}</style>
      )}
      
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
        {/* Toolbar */}
        <div 
          className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : ''
          }`}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left Side - Title and Description */}
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <FontAwesomeIcon 
                  icon={faFileText} 
                  className={`text-lg mr-3 ${
                    darkMode ? 'text-emerald-400' : 'text-white'
                  }`} 
                />
                <div>
                  <h1 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-white'
                  }`}>
                    Job Descriptions
                  </h1>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-300' : 'text-white/90'
                  }`}>
                    Create and manage detailed job descriptions
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleCreateDescription}
                className={`w-64 ${
                  darkMode 
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 font-medium"
                    : "bg-white text-emerald-600 border-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 font-medium"
                }`}
              >
                Create Description
              </Button>
              <Search
                placeholder="Search job descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-64 ${darkMode ? 'dark-search' : ''}`}
                style={{
                  backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)',
                }}
              />
            </div>
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
            dataSource={filteredJobDescriptions}
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
    </>
  )
})

export default JobDescriptions
