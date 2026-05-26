// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Tag, message } from 'antd'
import { BusinessDashboardPageShell, DashboardToolbarButton } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faUsers,
  faMapMarkerAlt,
  faDollarSign,
  faCalendarAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { getAllJobOpportunities, deleteJobOpportunity, updateJobOpportunityStatus } from '../controllers'
import { getJobTypeTagClass, getWorkArrangementTagClass, getJobStatusTagClass } from '../model'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import { Toolbar } from '../../../../core/components'

import '../styles/job-listings.css'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'

/**
 * Job Listings component for Recruiters and Employers
 * Manages job listings, applications, and recruitment activities
 */
const JobListings = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [jobOpportunities, setJobOpportunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Load job listings from database
  const loadJobOpportunities = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAllJobOpportunities()
      if (result.success) {
        setJobOpportunities(result.data)
      } else {
        console.error('Error loading job listings:', result.error)
        message.error('Failed to load job listings: ' + result.error)
        setJobOpportunities([])
      }
    } catch (error) {
      console.error('Unexpected error loading job listings:', error)
      message.error('An unexpected error occurred while loading job listings')
      setJobOpportunities([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobOpportunities()
  }, [loadJobOpportunities])

  // Handle navigation operations
  const handleCreateJobOpportunity = useCallback(() => {
    navigate('/business-dashboard/job-listings/create')
  }, [navigate])

  const handleEditJob = useCallback(
    (job) => {
      navigate(`/business-dashboard/job-listings/${job.id}/edit`, {
        state: {
          editId: job.id,
          initialData: job
        }
      })
    },
    [navigate]
  )

  const handleDeleteJob = useCallback(
    async (jobId) => {
      try {
        const result = await deleteJobOpportunity(jobId)
        if (result.success) {
          message.success('Job listing deleted successfully')
          // Refresh the list
          loadJobOpportunities()
        } else {
          console.error('Error deleting job listing:', result.error)
          message.error('Failed to delete job listing: ' + result.error)
        }
      } catch (error) {
        console.error('Unexpected error deleting job listing:', error)
        message.error('An unexpected error occurred while deleting the job listing')
      }
    },
    [loadJobOpportunities]
  )

  const handleStatusChange = useCallback(
    async (jobId, newStatus) => {
      try {
        const result = await updateJobOpportunityStatus(jobId, newStatus)
        if (result.success) {
          message.success(`Job status updated to ${newStatus}`)
          // Refresh the list
          loadJobOpportunities()
        } else {
          console.error('Error updating job status:', result.error)
          message.error('Failed to update job status: ' + result.error)
        }
      } catch (error) {
        console.error('Unexpected error updating job status:', error)
        message.error('An unexpected error occurred while updating job status')
      }
    },
    [loadJobOpportunities]
  )

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        title: 'Job Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div
            className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200'
            onClick={() => handleEditJob(record)}
          >
            {text}
          </div>
        ),
        sorter: (a, b) => a.title.localeCompare(b.title)
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (location) => (
          <div className={`flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            />
            {location}
          </div>
        ),
        sorter: (a, b) => a.location.localeCompare(b.location)
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (type) => (
          <Tag bordered className={`m-0 font-medium ${getJobTypeTagClass(type, darkMode)}`}>
            {type}
          </Tag>
        ),
        filters: [
          { text: 'Full-time', value: 'Full-time' },
          { text: 'Part-time', value: 'Part-time' },
          { text: 'Contract', value: 'Contract' },
          { text: 'Internship', value: 'Internship' }
        ],
        onFilter: (value, record) => record.type === value
      },
      {
        title: 'Work Arrangement',
        dataIndex: 'workArrangement',
        key: 'workArrangement',
        render: (arrangement) => (
          <Tag bordered className={`m-0 font-medium ${getWorkArrangementTagClass(arrangement, darkMode)}`}>
            {arrangement}
          </Tag>
        ),
        filters: [
          { text: 'On-site', value: 'On-site' },
          { text: 'Remote', value: 'Remote' },
          { text: 'Hybrid', value: 'Hybrid' },
          { text: 'Flexible', value: 'Flexible' }
        ],
        onFilter: (value, record) => record.workArrangement === value
      },
      {
        title: 'Salary',
        dataIndex: 'salary',
        key: 'salary',
        render: (salary) => (
          <div className={`flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            <FontAwesomeIcon icon={faDollarSign} className={`mr-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            {salary}
          </div>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => (
          <Tag
            bordered
            className={`m-0 font-medium cursor-pointer ${getJobStatusTagClass(status, darkMode)}`}
            onClick={() => {
              const nextStatus = status === 'Active' ? 'Paused' : status === 'Paused' ? 'Closed' : 'Active'
              handleStatusChange(record.id, nextStatus)
            }}
          >
            {status}
          </Tag>
        ),
        filters: [
          { text: 'Active', value: 'Active' },
          { text: 'Paused', value: 'Paused' },
          { text: 'Closed', value: 'Closed' }
        ],
        onFilter: (value, record) => record.status === value
      },
      {
        title: 'Applicants',
        dataIndex: 'applicants',
        key: 'applicants',
        render: (count) => (
          <div className={`flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            <FontAwesomeIcon icon={faUsers} className={`mr-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            {count}
          </div>
        ),
        sorter: (a, b) => a.applicants - b.applicants
      },
      {
        title: 'Date Posted',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => {
          return (
            <div className={`flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              />
              {date ? new Date(date).toLocaleDateString() : 'Not set'}
            </div>
          )
        },
        sorter: (a, b) => {
          if (!a.datePosted) return 1
          if (!b.datePosted) return -1
          return new Date(a.datePosted) - new Date(b.datePosted)
        }
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
                tooltip: 'Delete Job',
                onClick: () => handleDeleteJob(record.id),
                confirm: {
                  title: 'Delete Job Listing',
                  description: 'Are you sure you want to delete this job listing? This action cannot be undone.',
                  okText: 'Delete',
                  cancelText: 'Cancel',
                  okType: 'danger'
                }
              }
            ]}
          />
        )
      }
    ],
    [handleEditJob, handleDeleteJob, handleStatusChange, darkMode]
  )

  return (
    <BusinessDashboardPageShell className='flex min-h-full min-w-0 w-full max-w-full flex-col'>
      <Toolbar
        title='Job Listings'
        description='Manage and track your job listings'
        renderActions={() => (
          <DashboardToolbarButton
            onClick={handleCreateJobOpportunity}
            icon={<FontAwesomeIcon icon={faPlus} className='text-[11px]' />}
          >
            <span>Create Job Listing</span>
          </DashboardToolbarButton>
        )}
      />

      <ModuleContainer>
        <div className='job-listings-table'>
          <TableView
          dataSource={jobOpportunities}
          columns={columns}
          loading={loading}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          searchPlaceholder='Search job listings...'
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          rowKey='id'
          scroll={{ x: 'max-content' }}
          />
        </div>
      </ModuleContainer>
    </BusinessDashboardPageShell>
  )
})

JobListings.displayName = 'JobListings'

export default JobListings
