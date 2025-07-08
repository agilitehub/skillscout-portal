// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Tag, message, Card } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faBuilding,
  faUsers,
  faCalendarAlt,
  faClipboardCheck,
  faFileText
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../ui/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { getAllJobDescriptions, deleteJobDescription } from '../utils/controller'
import TableView from '../../../../core/View/TableView'
import TableActions from '../../../../core/View/TableActions'

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
            <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              {record.overview && record.overview.length > 100
                ? `${record.overview.substring(0, 100)}...`
                : record.overview}
            </div>
          </div>
        ),
        sorter: (a, b) => a.title.localeCompare(b.title),
        width: 300
      },
      {
        title: 'Department',
        dataIndex: 'departmentName',
        key: 'departmentName',
        render: (text, record) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faUsers} className='mr-2 text-gray-400' />
            {text || 'Not specified'}
          </div>
        ),
        sorter: (a, b) => (a.departmentName || '').localeCompare(b.departmentName || ''),
        width: 150
      },
      {
        title: 'Experience Level',
        dataIndex: 'experienceLevelName',
        key: 'experienceLevelName',
        render: (text) => (
          <Tag
            color={
              text === 'Entry Level'
                ? 'green'
                : text === 'Mid Level'
                  ? 'blue'
                  : text === 'Senior Level'
                    ? 'purple'
                    : text === 'Executive'
                      ? 'red'
                      : 'default'
            }
          >
            {text || 'Not specified'}
          </Tag>
        ),
        width: 120
      },
      {
        title: 'Keywords',
        dataIndex: 'keywords',
        key: 'keywords',
        render: (keywords) => (
          <div className='flex flex-wrap gap-1'>
            {(keywords || []).slice(0, 3).map((keyword, index) => (
              <Tag key={index} size='small' color='blue'>
                {keyword}
              </Tag>
            ))}
            {(keywords || []).length > 3 && (
              <Tag size='small' color='default'>
                +{(keywords || []).length - 3} more
              </Tag>
            )}
          </div>
        ),
        width: 200
      },
      {
        title: 'Last Updated',
        dataIndex: 'lastUpdated',
        key: 'lastUpdated',
        render: (date) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faCalendarAlt} className='mr-1 text-gray-400' />
            {date || 'N/A'}
          </div>
        ),
        sorter: (a, b) => new Date(a.modifiedAt || 0) - new Date(b.modifiedAt || 0),
        width: 130
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <TableActions
            record={record}
            actions={[
              {
                key: 'delete',
                onClick: (record) => handleDeleteDescription(record.id),
                confirm: {
                  title: 'Delete Job Description',
                  description: 'Are you sure you want to delete this job description? This action cannot be undone.',
                  okText: 'Delete',
                  cancelText: 'Cancel',
                  okType: 'danger'
                }
              }
            ]}
          />
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

    return jobDescriptions.filter(
      (description) =>
        description.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [jobDescriptions, searchTerm])

  return (
    <>
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
          <div
            className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : ''}`}
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
          >
            <div className='flex items-center'>
              <FontAwesomeIcon
                icon={faFileText}
                className={`text-lg mr-3 ${darkMode ? 'text-emerald-400' : 'text-white'}`}
              />
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>Job Descriptions</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-white/90'}`}>
                  Create and manage detailed job descriptions
                </p>
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
                      You navigated here from the job listing. Related job descriptions for "{jobContext.title}" will be
                      highlighted.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Job Descriptions Table */}
          <TableView
            columns={columns}
            dataSource={filteredJobDescriptions}
            loading={loading}
            rowKey='id'
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            searchPlaceholder='Search job descriptions...'
            toolbarActions={[
              <Button
                key='create'
                type='primary'
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleCreateDescription}
              >
                Create Description
              </Button>
            ]}
            pagination={{
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} job descriptions`
            }}
            rowClassName={(record) => {
              const isRelated =
                record &&
                jobContext &&
                jobContext.title &&
                jobContext.company &&
                (record.title?.toLowerCase().includes(jobContext.title.toLowerCase()) ||
                  record.company?.toLowerCase().includes(jobContext.company.toLowerCase()))
              return isRelated ? (darkMode ? 'bg-blue-900' : 'bg-blue-50') : ''
            }}
            emptyText='No job descriptions found'
          />
        </div>
      </div>
    </>
  )
})

export default JobDescriptions
