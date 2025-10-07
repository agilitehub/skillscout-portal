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
                color: darkMode ? '!text-white hover:!text-white' : '!text-white hover:!text-white',
                style: {
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff'
                },
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
      <div className='p-4 md:p-6 relative z-10'>
        {/* Header */}
        <div
          className={`mb-6 px-8 py-6 rounded-lg shadow-lg border ${
            darkMode
              ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-600 border-emerald-600'
              : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-600 border-emerald-500'
          }`}
          style={{
            background: darkMode
              ? 'linear-gradient(to right, #047857, #059669, #059669)'
              : 'linear-gradient(to right, #10b981, #059669, #059669)',
            borderColor: darkMode ? '#059669' : '#10b981'
          }}
        >
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>Job Listings</h1>
              <p className='text-emerald-100'>Manage your job listings and recruitment activities</p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0'>
              <Button
                type='default'
                size='large'
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleCreateJobOpportunity}
                className='create-job-listing-btn font-medium'
              >
                Create Job Listing
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Jobs</span>}
                value={stats.totalJobs}
                prefix={
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className={darkMode ? 'text-blue-300' : 'text-blue-500'}
                    style={{ color: darkMode ? '#93c5fd' : '#3b82f6' }}
                  />
                }
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Jobs</span>}
                value={stats.activeJobs}
                prefix={
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className={darkMode ? 'text-green-300' : 'text-green-500'}
                    style={{ color: darkMode ? '#86efac' : '#10b981' }}
                  />
                }
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Applicants</span>}
                value={stats.totalApplicants}
                prefix={
                  <FontAwesomeIcon
                    icon={faUsers}
                    className={darkMode ? 'text-purple-300' : 'text-purple-500'}
                    style={{ color: darkMode ? '#c4b5fd' : '#8b5cf6' }}
                  />
                }
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Applicants</span>}
                value={stats.avgApplicants}
                prefix={
                  <FontAwesomeIcon
                    icon={faUsers}
                    className={darkMode ? 'text-orange-300' : 'text-orange-500'}
                    style={{ color: darkMode ? '#fdba74' : '#f97316' }}
                  />
                }
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
          </div>
        </div>

        {/* Job Listings Table */}
        <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
          <div className='mb-4'>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Listings</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage and track your job postings</p>
          </div>

          <TableView
            dataSource={jobOpportunities}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            rowKey='id'
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Create Job Listing Button Styling */
        .create-job-listing-btn,
        .create-job-listing-btn.ant-btn,
        button.create-job-listing-btn {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          height: auto !important;
          min-height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 6px !important;
          opacity: 1 !important;
          visibility: visible !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        .create-job-listing-btn svg,
        .create-job-listing-btn .anticon {
          color: white !important;
          margin-right: 8px !important;
        }

        .create-job-listing-btn:hover,
        .create-job-listing-btn.ant-btn:hover,
        button.create-job-listing-btn:hover {
          background-color: #047857 !important;
          border-color: #047857 !important;
          color: white !important;
          transform: none !important;
        }

        .create-job-listing-btn:hover svg,
        .create-job-listing-btn:hover .anticon {
          color: white !important;
        }

        .create-job-listing-btn:focus,
        .create-job-listing-btn.ant-btn:focus {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
        }

        /* Delete Icon Styling for Better Visibility */
        .ant-table-tbody .ant-space .ant-btn[style*='background-color: rgb(220, 38, 38)'],
        .ant-table-tbody .ant-space .ant-btn[style*='backgroundColor:#dc2626'] {
          background: #dc2626 !important;
          border-color: #dc2626 !important;
        }

        .ant-table-tbody .ant-space .ant-btn[style*='background-color: rgb(220, 38, 38)'] .anticon,
        .ant-table-tbody .ant-space .ant-btn[style*='backgroundColor:#dc2626'] .anticon {
          color: #ffffff !important;
          filter: brightness(0) invert(1) !important;
        }

        /* Prevent hover background change and keep red background */
        .ant-table-tbody .ant-space .ant-btn[style*='background-color: rgb(220, 38, 38)']:hover,
        .ant-table-tbody .ant-space .ant-btn[style*='backgroundColor:#dc2626']:hover {
          background: #b91c1c !important;
          background-color: #b91c1c !important;
          border-color: #b91c1c !important;
        }

        .ant-table-tbody .ant-space .ant-btn[style*='background-color: rgb(220, 38, 38)']:hover .anticon,
        .ant-table-tbody .ant-space .ant-btn[style*='backgroundColor:#dc2626']:hover .anticon {
          color: #ffffff !important;
          filter: brightness(0) invert(1) !important;
        }
      `}</style>
    </div>
  )
})

JobListings.displayName = 'JobListings'

export default JobListings
