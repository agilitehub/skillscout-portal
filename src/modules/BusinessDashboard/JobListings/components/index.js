// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Tag, Card, Statistic, message } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faBriefcase,
  faUsers,
  faMapMarkerAlt,
  faDollarSign,
  faCalendarAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { getAllJobOpportunities, deleteJobOpportunity, updateJobOpportunityStatus } from '../utils/controller'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import Toolbar from '../../../../core/components/Toolbar'

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
    navigate('/business-dashboard/create-job-listing')
  }, [navigate])

  const handleEditJob = useCallback(
    (job) => {
      navigate('/business-dashboard/edit-job-listing', {
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
          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className={`mr-1 ${darkMode ? 'text-white' : 'text-gray-500'}`}
              style={{ color: darkMode ? '#ffffff' : '#6b7280' }}
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
          <Tag
            color={
              type === 'Full-time' ? 'blue' : type === 'Part-time' ? 'green' : type === 'Contract' ? 'orange' : 'purple'
            }
          >
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
          <Tag color={arrangement === 'Remote' ? 'green' : arrangement === 'Hybrid' ? 'blue' : 'default'}>
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
          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faDollarSign}
              className={`mr-1 ${darkMode ? 'text-green-300' : 'text-green-500'}`}
              style={{ color: darkMode ? '#86efac' : '#10b981' }}
            />
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
            color={status === 'Active' ? 'green' : status === 'Paused' ? 'orange' : 'red'}
            style={{ cursor: 'pointer' }}
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
          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faUsers}
              className={`mr-1 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}
              style={{ color: darkMode ? '#93c5fd' : '#3b82f6' }}
            />
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
            <div className='flex items-center'>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className={`mr-1 ${darkMode ? 'text-white' : 'text-gray-500'}`}
                style={{ color: darkMode ? '#ffffff' : '#6b7280' }}
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

  // Statistics calculations
  const stats = useMemo(() => {
    const activeJobs = jobOpportunities.filter((job) => job.status === 'Active').length
    const totalApplicants = jobOpportunities.reduce((sum, job) => sum + (job.applicants || 0), 0)
    const avgApplicants = jobOpportunities.length > 0 ? Math.round(totalApplicants / jobOpportunities.length) : 0

    return {
      totalJobs: jobOpportunities.length,
      activeJobs,
      totalApplicants,
      avgApplicants
    }
  }, [jobOpportunities])

  return (
    <div
      className={`min-h-screen ${
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

      <Toolbar
        title='Job Listings'
        description='Manage and track your job listings'
        renderActions={() => (
          <Button
            type='default'
            size='middle'
            className='dashboard-button'
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#ffffff',
              color: '#059669',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '13px',
              height: '32px',
              paddingLeft: '12px',
              paddingRight: '12px'
            }}
            onClick={handleCreateJobOpportunity}
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '11px', marginRight: '4px' }} />
            <span>Create Job Listing</span>
          </Button>
        )}
      />

      <div className='pl-5 pr-5 pt-2 relative z-10'>
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
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Dashboard Button Styles */}
      <style jsx global>{`
        .dashboard-button,
        .dashboard-button.ant-btn,
        button.dashboard-button {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .dashboard-button:hover,
        .dashboard-button.ant-btn:hover,
        button.dashboard-button:hover {
          background: #f8f9fa !important;
          background-color: #f8f9fa !important;
          color: #047857 !important;
          border: 1px solid #f8f9fa !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
        }

        ${darkMode
          ? `
          .dashboard-button,
          .dashboard-button.ant-btn,
          button.dashboard-button {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #059669 !important;
            border: 1px solid #ffffff !important;
          }
          
          .dashboard-button:hover,
          .dashboard-button.ant-btn:hover,
          button.dashboard-button:hover {
            background: #f8f9fa !important;
            background-color: #f8f9fa !important;
            color: #047857 !important;
            border: 1px solid #f8f9fa !important;
          }
        `
          : ''}
      `}</style>
    </div>
  )
})

JobListings.displayName = 'JobListings'

export default JobListings
