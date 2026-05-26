// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Tag, message, Card } from 'antd'
import { BusinessDashboardPageShell, DashboardToolbarButton } from '../../../../core/components'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUsers, faCalendarAlt, faClipboardCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { getAllJobDescriptions, deleteJobDescription } from '../controllers'
import {
  getExperienceLevelTagClass,
  getKeywordTagClass,
  getKeywordOverflowTagClass
} from '../model'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import '../styles/job-descriptions.css'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import { Toolbar } from '../../../../core/components'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'

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
      navigate(`/business-dashboard/job-descriptions/${description.id}/edit`, {
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
          <Tag bordered className={`m-0 font-medium ${getExperienceLevelTagClass(text, darkMode)}`}>
            {text || 'Not specified'}
          </Tag>
        ),
        width: 130
      },
      {
        title: 'Keywords',
        dataIndex: 'keywords',
        key: 'keywords',
        render: (keywords) => (
          <div className='flex min-w-0 flex-wrap items-center gap-1 py-0.5'>
            {(keywords || []).slice(0, 3).map((keyword, index) => (
              <Tag
                key={index}
                bordered
                className={`m-0 max-w-full shrink-0 whitespace-nowrap font-medium ${getKeywordTagClass(index, darkMode)}`}
              >
                {keyword}
              </Tag>
            ))}
            {(keywords || []).length > 3 && (
              <Tag
                bordered
                className={`m-0 shrink-0 whitespace-nowrap font-medium ${getKeywordOverflowTagClass(darkMode)}`}
              >
                +{(keywords || []).length - 3} more
              </Tag>
            )}
          </div>
        ),
        width: 260
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
                icon: faTrash,
                tooltip: 'Delete Job Description',
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
    [handleEditDescription, handleDeleteDescription, darkMode]
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
      <BusinessDashboardPageShell className='relative overflow-hidden'>
        <Toolbar
          title='Job Descriptions'
          description='Create and manage detailed job descriptions'
          renderActions={() => (
            <DashboardToolbarButton
              onClick={handleCreateDescription}
              icon={<FontAwesomeIcon icon={faPlus} className='text-[11px]' />}
            >
              <span>Create Description</span>
            </DashboardToolbarButton>
          )}
        />

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

        <ModuleContainer>
          <div className='job-descriptions-table'>
            <TableView
              columns={columns}
              dataSource={filteredJobDescriptions}
              loading={loading}
              rowKey='id'
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              searchPlaceholder='Search job descriptions...'
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
        </ModuleContainer>

      </BusinessDashboardPageShell>
    </>
  )
})

export default JobDescriptions
