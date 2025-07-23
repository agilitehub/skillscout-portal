// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, Tag, Card, Statistic, message, Popconfirm } from 'antd'
import { Button } from '../../../../core/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faBriefcase,
  faUsers,
  faMapMarkerAlt,
  faDollarSign,
  faCalendarAlt,
  faBuilding,
  faEdit,
  faTrash,
  faEye,
  faClone
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import BusinessSidebar from '../../components/BusinessSidebar'
import {
  getAllJobOpportunities,
  deleteJobOpportunity,
  updateJobOpportunityStatus,
  duplicateJobOpportunity
} from '../utils/controller'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import JobOpportunityForm from './JobOpportunityForm'

/**
 * Business Dashboard component for Recruiters and Employers
 * Manages job opportunities, applications, and recruitment activities
 */
const BusinessDashboard = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [jobOpportunities, setJobOpportunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  // Form modal state
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingJobId, setEditingJobId] = useState(null)
  const [editingJobData, setEditingJobData] = useState(null)

  // Load job opportunities from database
  const loadJobOpportunities = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAllJobOpportunities()
      if (result.success) {
        setJobOpportunities(result.data)
      } else {
        console.error('Error loading job opportunities:', result.error)
        message.error('Failed to load job opportunities: ' + result.error)
        setJobOpportunities([])
      }
    } catch (error) {
      console.error('Unexpected error loading job opportunities:', error)
      message.error('An unexpected error occurred while loading job opportunities')
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
    setEditingJobId(null)
    setEditingJobData(null)
    setIsFormVisible(true)
  }, [])

  const handleEditJob = useCallback((job) => {
    setEditingJobId(job.id)
    setEditingJobData(job) // Pass the full record
    setIsFormVisible(true)
  }, [])

  const handleViewJob = useCallback((job) => {
    setSelectedJob(job)
    setIsModalVisible(true)
  }, [])

  const handleDeleteJob = useCallback(
    async (jobId) => {
      try {
        const result = await deleteJobOpportunity(jobId)
        if (result.success) {
          message.success('Job opportunity deleted successfully')
          // Refresh the list
          loadJobOpportunities()
        } else {
          console.error('Error deleting job opportunity:', result.error)
          message.error('Failed to delete job opportunity: ' + result.error)
        }
      } catch (error) {
        console.error('Unexpected error deleting job opportunity:', error)
        message.error('An unexpected error occurred while deleting the job opportunity')
      }
    },
    [loadJobOpportunities]
  )

  const handleDuplicateJob = useCallback(
    async (job) => {
      try {
        const result = await duplicateJobOpportunity(job.id)
        if (result.success) {
          message.success('Job opportunity duplicated successfully')
          // Refresh the list
          loadJobOpportunities()
        } else {
          console.error('Error duplicating job opportunity:', result.error)
          message.error('Failed to duplicate job opportunity: ' + result.error)
        }
      } catch (error) {
        console.error('Unexpected error duplicating job opportunity:', error)
        message.error('An unexpected error occurred while duplicating the job opportunity')
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

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
    setSelectedJob(null)
  }, [])

  const handleFormClose = useCallback(() => {
    setIsFormVisible(false)
    setEditingJobId(null)
    setEditingJobData(null)
  }, [])

  const handleFormSuccess = useCallback(
    (data) => {
      // Refresh the job opportunities list
      loadJobOpportunities()
    },
    [loadJobOpportunities]
  )

  // Handle navigation to linked pages with job context
  const handleViewJobDescription = useCallback(
    (job) => {
      navigate('/business-dashboard/job-descriptions', {
        state: {
          jobContext: job,
          highlightJobId: job.id
        }
      })
    },
    [navigate]
  )

  const handleViewJobAssessment = useCallback(
    (job) => {
      navigate('/business-dashboard/assessments', {
        state: {
          jobContext: job,
          highlightJobId: job.id
        }
      })
    },
    [navigate]
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
        sorter: (a, b) => a.title.localeCompare(b.title)
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (location) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='mr-1 text-gray-400' />
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
            <FontAwesomeIcon icon={faDollarSign} className='mr-1 text-green-500' />
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
            <FontAwesomeIcon icon={faUsers} className='mr-1 text-blue-500' />
            {count}
          </div>
        ),
        sorter: (a, b) => a.applicants - b.applicants
      },
      {
        title: 'Date Posted',
        dataIndex: 'datePosted',
        key: 'datePosted',
        render: (date) => (
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faCalendarAlt} className='mr-1 text-gray-400' />
            {date ? new Date(date).toLocaleDateString() : 'Not set'}
          </div>
        ),
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
                key: 'view',
                icon: faEye,
                tooltip: 'View Details',
                onClick: handleViewJob
              },
              {
                key: 'edit',
                icon: faEdit,
                tooltip: 'Edit Job',
                onClick: handleEditJob
              },
              {
                key: 'duplicate',
                icon: faClone,
                tooltip: 'Duplicate Job',
                onClick: handleDuplicateJob
              },
              {
                key: 'description',
                label: 'Job Description',
                onClick: handleViewJobDescription
              },
              {
                key: 'assessment',
                label: 'Assessment',
                onClick: handleViewJobAssessment
              },
              {
                key: 'delete',
                icon: faTrash,
                tooltip: 'Delete Job',
                onClick: (record) => handleDeleteJob(record.id),
                confirm: {
                  title: 'Delete Job Opportunity',
                  description: 'Are you sure you want to delete this job opportunity? This action cannot be undone.',
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
    [
      handleViewJob,
      handleEditJob,
      handleDeleteJob,
      handleDuplicateJob,
      handleStatusChange,
      handleViewJobDescription,
      handleViewJobAssessment
    ]
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

      <BusinessSidebar />
      <div className='ml-64 p-4 md:p-6 relative z-10'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2'>Business Dashboard</h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Manage your job opportunities and recruitment activities
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0'>
              <Button
                type='primary'
                size='large'
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleCreateJobOpportunity}
                style={{
                  background: darkMode ? '#059669' : '#10b981',
                  borderColor: darkMode ? '#059669' : '#10b981'
                }}
              >
                Create Job Opportunity
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Jobs</span>}
                value={stats.totalJobs}
                prefix={<FontAwesomeIcon icon={faBriefcase} className='text-blue-500' />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Jobs</span>}
                value={stats.activeJobs}
                prefix={<FontAwesomeIcon icon={faBriefcase} className='text-green-500' />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Applicants</span>}
                value={stats.totalApplicants}
                prefix={<FontAwesomeIcon icon={faUsers} className='text-purple-500' />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Applicants</span>}
                value={stats.avgApplicants}
                prefix={<FontAwesomeIcon icon={faUsers} className='text-orange-500' />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
          </div>
        </div>

        {/* Job Opportunities Table */}
        <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
          <div className='mb-4'>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Opportunities</h2>
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

        {/* Job Details Modal */}
        <Modal
          title={
            <div className='flex items-center'>
              <FontAwesomeIcon icon={faBriefcase} className='mr-2' />
              Job Details
            </div>
          }
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key='close' onClick={handleModalClose}>
              Close
            </Button>,
            <Button key='edit' type='primary' onClick={() => handleEditJob(selectedJob)}>
              Edit Job
            </Button>
          ]}
          width={800}
          className={darkMode ? 'modal-dark' : ''}
          styles={{
            content: {
              backgroundColor: darkMode ? '#374151' : '#ffffff'
            },
            body: {
              backgroundColor: darkMode ? '#374151' : '#ffffff'
            },
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
          {selectedJob ? (
            <div className='space-y-6 max-h-[70vh] overflow-y-auto'>
              {/* Header Section */}
              <div className='border-b pb-4'>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedJob.title}
                </h3>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedJob.company} • {selectedJob.location}
                </p>
                <div className='flex flex-wrap gap-2 mt-2'>
                  <Tag color='blue'>{selectedJob.type}</Tag>
                  <Tag color={selectedJob.status === 'Active' ? 'green' : 'orange'}>{selectedJob.status}</Tag>
                  {selectedJob.remote && <Tag color='purple'>Remote Available</Tag>}
                  <Tag color='cyan'>{selectedJob.workArrangement}</Tag>
                </div>
              </div>

              {/* Basic Information */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Salary:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.salary}</span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedJob.experienceRequired} years
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Applicants:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.applicants}</span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Posted:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedJob.datePosted ? new Date(selectedJob.datePosted).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</h4>
                <p className={`${darkMode ? 'text-white' : 'text-gray-900'} whitespace-pre-wrap`}>
                  {selectedJob.description}
                </p>
              </div>

              {/* Required Skills */}
              {selectedJob.requiredSkills && (
                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Required Skills
                  </h4>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.requiredSkills}</p>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Benefits</h4>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-900'} whitespace-pre-wrap`}>
                    {selectedJob.benefits}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </Modal>

        {/* Job Opportunity Form Modal */}
        <JobOpportunityForm
          visible={isFormVisible}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editId={editingJobId}
          initialData={editingJobData}
        />
      </div>
    </div>
  )
})

BusinessDashboard.displayName = 'BusinessDashboard'

export default BusinessDashboard
