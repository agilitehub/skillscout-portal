// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Tag, message, Card } from 'antd'
import { Button } from '../../../../core/components'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faUsers,
  faCalendarAlt,
  faClipboardCheck,
  faFileText,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import { getAllJobDescriptions, deleteJobDescription } from '../utils/controller'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'

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
                icon: faTrashAlt,
                tooltip: 'Delete Job Description',
                color: '!text-white',
                className:
                  'job-description-delete-btn !bg-green-600 hover:!bg-green-700 !border-green-600 hover:!border-green-700',
                style: {
                  backgroundColor: '#059669 !important',
                  borderColor: '#059669 !important',
                  color: 'white !important'
                },
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
      <div
        className={`min-h-screen relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
            : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
        }`}
      >
        {/* Background overlay for full coverage */}
        <div
          className={`fixed inset-0 ${
            darkMode
              ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-emerald-800/40'
              : 'bg-gradient-to-b from-transparent via-sky-100/40 to-emerald-100/50'
          } pointer-events-none`}
        ></div>

        <div className='p-6 relative z-10'>
          {/* Header */}
          <div
            className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : ''}`}
            style={{
              background: darkMode
                ? `linear-gradient(135deg, ${BRAND_COLORS.forestGreen} 0%, ${BRAND_COLORS.emeraldAccent} 50%, ${BRAND_COLORS.emeraldPrimary} 100%)`
                : `linear-gradient(135deg, ${BRAND_COLORS.emeraldLight} 0%, ${BRAND_COLORS.emeraldPrimary} 100%)`
            }}
          >
            <div className='flex items-center justify-between'>
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
              <Button
                type='default'
                size='large'
                icon={<FontAwesomeIcon icon={faPlus} className='mr-2' />}
                onClick={handleCreateDescription}
                className='create-job-description-btn font-medium'
                style={{
                  background: '#ffffff',
                  backgroundColor: '#ffffff',
                  color: '#059669',
                  border: '1px solid #ffffff',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  opacity: '1'
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
            toolbarActions={[]}
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

      {/* Custom Styles */}
      <style jsx global>{`
        /* Force Create Job Description Button Visibility */
        .create-job-description-btn,
        .create-job-description-btn.ant-btn,
        button.create-job-description-btn {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .create-job-description-btn:hover,
        .create-job-description-btn.ant-btn:hover,
        button.create-job-description-btn:hover {
          background: #f8f9fa !important;
          background-color: #f8f9fa !important;
          color: #047857 !important;
          border: 1px solid #f8f9fa !important;
        }

        /* Job Description Delete Button Styling - Green Background with White Icon */
        .job-description-delete-btn,
        .job-description-delete-btn.ant-btn,
        .job-description-delete-btn button {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          padding: 8px 12px !important;
          height: auto !important;
          min-height: 32px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 6px !important;
        }

        .job-description-delete-btn:hover,
        .job-description-delete-btn.ant-btn:hover,
        .job-description-delete-btn button:hover {
          background-color: #047857 !important;
          border-color: #047857 !important;
          color: white !important;
          transform: none !important;
        }

        .job-description-delete-btn:focus,
        .job-description-delete-btn.ant-btn:focus,
        .job-description-delete-btn button:focus {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
        }

        .job-description-delete-btn .anticon,
        .job-description-delete-btn svg {
          color: white !important;
        }
      `}</style>
    </>
  )
})

export default JobDescriptions
