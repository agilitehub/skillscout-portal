// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, Tooltip, Card, Statistic } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faBriefcase, 
  faUsers, 
  faMapMarkerAlt,
  faDollarSign,
  faCalendarAlt,
  faBuilding
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../ui/ThemeContext'
import { useNavigate } from 'react-router-dom'
import BusinessSidebar from './components/BusinessSidebar'

const { Option } = Select
const { TextArea } = Input

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

  // Mock data for job opportunities
  const mockJobData = useMemo(() => [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      status: 'Active',
      applicants: 45,
      datePosted: '2024-01-15',
      description: 'We are looking for a senior software engineer to join our growing team...',
      requirements: ['5+ years React experience', 'Node.js proficiency', 'AWS knowledge'],
      remote: true,
      // New comprehensive fields
      experienceRequired: '5-7',
      educationLevel: 'Bachelor\'s Degree',
      fieldOfStudy: 'Computer Science, Software Engineering',
      industryExperience: 'Technology',
      requiredSkills: 'React, Node.js, JavaScript, TypeScript, AWS',
      softSkills: 'Problem-solving, Team collaboration, Communication',
      toolsRequired: 'Git, Docker, Kubernetes, Jira',
      certificationsRequired: 'AWS Certified Developer preferred',
      employmentTypes: ['Full-time'],
      workArrangement: 'Hybrid',
      visaSponsorship: 'Available',
      travelRequirements: 'None',
      benefits: 'Health insurance, 401k matching, flexible PTO, stock options',
      resumeRequired: true,
      coverLetterRequired: 'Preferred',
      portfolioRequired: 'Preferred',
      referencesRequired: 'Upon Request',
      applicationInstructions: 'Please include your GitHub profile and highlight your React experience.',
      screeningQuestions: 'Are you authorized to work in the US?\nWhat is your expected salary range?\nDescribe your experience with React and Node.js'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateLab Inc',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      status: 'Active',
      applicants: 32,
      datePosted: '2024-01-20',
      description: 'Seeking an experienced product manager to lead our product development...',
      requirements: ['3+ years PM experience', 'Agile methodology', 'Data analysis skills'],
      remote: false,
      // New comprehensive fields
      experienceRequired: '2-4',
      educationLevel: 'Bachelor\'s Degree',
      fieldOfStudy: 'Business, Marketing, Engineering',
      industryExperience: 'Technology',
      requiredSkills: 'Product Strategy, Data Analysis, User Research, Roadmap Planning',
      softSkills: 'Leadership, Strategic thinking, Communication',
      toolsRequired: 'Jira, Confluence, Figma, Google Analytics',
      certificationsRequired: 'Product Management Certification preferred',
      employmentTypes: ['Full-time'],
      workArrangement: 'On-site',
      visaSponsorship: 'Case by Case',
      travelRequirements: 'Occasional',
      benefits: 'Comprehensive health package, equity options, professional development budget',
      resumeRequired: true,
      coverLetterRequired: 'Required',
      portfolioRequired: 'Preferred',
      referencesRequired: 'Upon Request',
      applicationInstructions: 'Please provide examples of products you\'ve managed and their impact.',
      screeningQuestions: 'Describe your experience with product roadmap planning\nHow do you prioritize features?\nWhat metrics do you use to measure product success?'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      location: 'Austin, TX',
      type: 'Contract',
      salary: '$70 - $90/hour',
      status: 'Paused',
      applicants: 28,
      datePosted: '2024-01-10',
      description: 'Looking for a creative UX/UI designer to enhance user experiences...',
      requirements: ['Figma expertise', 'User research experience', 'Portfolio required'],
      remote: true,
      // New comprehensive fields
      experienceRequired: '2-4',
      educationLevel: 'Bachelor\'s Degree',
      fieldOfStudy: 'Design, HCI, Psychology',
      industryExperience: 'Technology',
      requiredSkills: 'User Research, Wireframing, Prototyping, Usability Testing',
      softSkills: 'Creativity, Empathy, Attention to detail',
      toolsRequired: 'Figma, Sketch, Adobe Creative Suite, InVision',
      certificationsRequired: '',
      employmentTypes: ['Contract', 'Full-time'],
      workArrangement: 'Remote',
      visaSponsorship: 'Not Available',
      travelRequirements: 'None',
      benefits: 'Flexible schedule, professional development, design conference budget',
      resumeRequired: true,
      coverLetterRequired: 'Optional',
      portfolioRequired: 'Required',
      referencesRequired: 'Optional',
      applicationInstructions: 'Portfolio must showcase user-centered design process and case studies.',
      screeningQuestions: 'What is your design process?\nHow do you handle design feedback?\nDescribe a challenging UX problem you solved'
    },
    {
      id: '4',
      title: 'Data Scientist',
      company: 'DataTech Analytics',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      status: 'Active',
      applicants: 67,
      datePosted: '2024-01-25',
      description: 'Join our data science team to build predictive models and insights...',
      requirements: ['Python/R proficiency', 'Machine learning experience', 'Statistics background'],
      remote: true,
      // New comprehensive fields
      experienceRequired: '5-7',
      educationLevel: 'Master\'s Degree',
      fieldOfStudy: 'Data Science, Statistics, Computer Science, Mathematics',
      industryExperience: 'Technology',
      requiredSkills: 'Python, R, Machine Learning, Statistics, SQL',
      softSkills: 'Analytical thinking, Problem-solving, Communication',
      toolsRequired: 'Jupyter, TensorFlow, Pandas, Scikit-learn, Tableau',
      certificationsRequired: 'Google Data Analytics Certificate preferred',
      employmentTypes: ['Full-time'],
      workArrangement: 'Remote',
      visaSponsorship: 'Available',
      travelRequirements: 'None',
      benefits: 'Health insurance, 401k, flexible PTO, learning stipend, remote work equipment',
      resumeRequired: true,
      coverLetterRequired: 'Preferred',
      portfolioRequired: 'Required',
      referencesRequired: 'Upon Request',
      applicationInstructions: 'Please include links to your GitHub and any relevant data science projects.',
      screeningQuestions: 'Describe your experience with machine learning models\nWhat statistical methods are you most comfortable with?\nHow do you approach data cleaning and preprocessing?'
    }
  ], [])

  // Load job opportunities
  useEffect(() => {
    const loadJobData = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setJobOpportunities(mockJobData)
      } catch (error) {
        console.error('Error loading job opportunities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadJobData()
  }, [mockJobData])

  // Handle navigation operations
  const handleCreateJob = useCallback(() => {
    navigate('/business-dashboard/create-job')
  }, [navigate])

  const handleEditJob = useCallback((job) => {
    navigate('/business-dashboard/edit-job', { 
      state: { jobData: job },
      search: `?id=${job.id}`
    })
  }, [navigate])

  const handleViewJob = useCallback((job) => {
    setSelectedJob(job)
    setIsModalVisible(true)
  }, [])

  const handleDeleteJob = useCallback((jobId) => {
    Modal.confirm({
      title: 'Delete Job Opportunity',
      content: 'Are you sure you want to delete this job opportunity? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setJobOpportunities(prev => prev.filter(job => job.id !== jobId))
      }
    })
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
    setSelectedJob(null)
  }, [])

  // Table columns configuration
  const columns = useMemo(() => [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{text}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="mr-1" />
            {record.company}
          </div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text, record) => (
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
          <div>
            <div>{text}</div>
            {record.remote && <Tag color="green" size="small">Remote</Tag>}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Full-time' ? 'blue' : type === 'Part-time' ? 'orange' : 'purple'}>
          {type}
        </Tag>
      ),
      filters: [
        { text: 'Full-time', value: 'Full-time' },
        { text: 'Part-time', value: 'Part-time' },
        { text: 'Contract', value: 'Contract' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => (
        <div className="flex items-center">
          <FontAwesomeIcon icon={faDollarSign} className="mr-1 text-green-500" />
          {salary}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Paused' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Paused', value: 'Paused' },
        { text: 'Closed', value: 'Closed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Applicants',
      dataIndex: 'applicants',
      key: 'applicants',
      render: (count) => (
        <div className="flex items-center">
          <FontAwesomeIcon icon={faUsers} className="mr-1 text-blue-500" />
          {count}
        </div>
      ),
      sorter: (a, b) => a.applicants - b.applicants,
    },
    {
      title: 'Date Posted',
      dataIndex: 'datePosted',
      key: 'datePosted',
      render: (date) => (
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
      sorter: (a, b) => new Date(a.datePosted) - new Date(b.datePosted),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<FontAwesomeIcon icon={faEye} />}
              onClick={() => handleViewJob(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Edit Job">
            <Button
              type="text"
              size="small"
              icon={<FontAwesomeIcon icon={faEdit} />}
              onClick={() => handleEditJob(record)}
              className="text-green-500 hover:text-green-700"
            />
          </Tooltip>
          <Tooltip title="Delete Job">
            <Button
              type="text"
              size="small"
              icon={<FontAwesomeIcon icon={faTrash} />}
              onClick={() => handleDeleteJob(record.id)}
              className="text-red-500 hover:text-red-700"
            />
          </Tooltip>
        </Space>
      ),
    },
  ], [handleViewJob, handleEditJob, handleDeleteJob])

  // Statistics calculations
  const stats = useMemo(() => {
    const activeJobs = jobOpportunities.filter(job => job.status === 'Active').length
    const totalApplicants = jobOpportunities.reduce((sum, job) => sum + job.applicants, 0)
    const avgApplicants = jobOpportunities.length > 0 ? Math.round(totalApplicants / jobOpportunities.length) : 0

    return {
      totalJobs: jobOpportunities.length,
      activeJobs,
      totalApplicants,
      avgApplicants
    }
  }, [jobOpportunities])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {darkMode ? (
          <>
            <div 
              className="absolute -top-[10%] -right-[10%] w-1/2 h-1/2 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl opacity-80" />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl opacity-80" />
            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-amber-400/30 to-transparent rounded-full blur-3xl opacity-80" />
          </>
        )}
      </div>

      <BusinessSidebar />
      <div className="ml-64 p-4 md:p-6 relative z-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Business Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your job opportunities and recruitment activities
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleCreateJob}
            className="mt-4 sm:mt-0"
            style={{
              background: darkMode ? '#059669' : '#10b981',
              borderColor: darkMode ? '#059669' : '#10b981'
            }}
          >
            Post New Job
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <Statistic
              title={<span className={darkMode ? 'text-gray-300' : ''}>Total Jobs</span>}
              value={stats.totalJobs}
              prefix={<FontAwesomeIcon icon={faBriefcase} className="text-blue-500" />}
              valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
            />
          </Card>
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <Statistic
              title={<span className={darkMode ? 'text-gray-300' : ''}>Active Jobs</span>}
              value={stats.activeJobs}
              prefix={<FontAwesomeIcon icon={faBriefcase} className="text-green-500" />}
              valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
            />
          </Card>
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <Statistic
              title={<span className={darkMode ? 'text-gray-300' : ''}>Total Applicants</span>}
              value={stats.totalApplicants}
              prefix={<FontAwesomeIcon icon={faUsers} className="text-purple-500" />}
              valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
            />
          </Card>
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <Statistic
              title={<span className={darkMode ? 'text-gray-300' : ''}>Avg per Job</span>}
              value={stats.avgApplicants}
              prefix={<FontAwesomeIcon icon={faUsers} className="text-orange-500" />}
              valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
            />
          </Card>
        </div>
      </div>

      {/* Job Opportunities Table */}
      <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} shadow-lg`}>
        <Table
          columns={columns}
          dataSource={jobOpportunities}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} jobs`,
          }}
          className={darkMode ? 'dark-table' : ''}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Job Modal */}
      <Modal
        title={
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
            Job Details
          </span>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={800}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          },
          body: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          }
        }}
      >
        {selectedJob ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Header Section */}
            <div className="border-b pb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedJob.title}
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedJob.company} • {selectedJob.location}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Tag color="blue">{selectedJob.type}</Tag>
                <Tag color={selectedJob.status === 'Active' ? 'green' : 'orange'}>
                  {selectedJob.status}
                </Tag>
                {selectedJob.remote && <Tag color="purple">Remote Available</Tag>}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Salary:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.salary}</span>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Applicants:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.applicants}</span>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Posted:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.datePosted}</span>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Work Arrangement:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.workArrangement}</span>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Description</h4>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedJob.description}</p>
            </div>

            {/* Candidate Requirements */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Candidate Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.experienceRequired} years</span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Education:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.educationLevel}</span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Field of Study:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.fieldOfStudy}</span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Industry:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.industryExperience}</span>
                </div>
              </div>
            </div>

            {/* Skills & Tools */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills & Tools</h4>
              <div className="space-y-3">
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Required Skills:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedJob.requiredSkills?.split(',').map((skill, index) => (
                      <Tag key={index} color="blue" className="mb-1">{skill.trim()}</Tag>
                    ))}
                  </div>
                </div>
                {selectedJob.softSkills && (
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Soft Skills:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedJob.softSkills.split(',').map((skill, index) => (
                        <Tag key={index} color="green" className="mb-1">{skill.trim()}</Tag>
                      ))}
                    </div>
                  </div>
                )}
                {selectedJob.toolsRequired && (
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tools & Software:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedJob.toolsRequired.split(',').map((tool, index) => (
                        <Tag key={index} color="purple" className="mb-1">{tool.trim()}</Tag>
                      ))}
                    </div>
                  </div>
                )}
                {selectedJob.certificationsRequired && (
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Certifications:</span>
                    <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.certificationsRequired}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employment Types:</span>
                  <div className="mt-1">
                    {selectedJob.employmentTypes?.map((type, index) => (
                      <Tag key={index} color="orange" className="mb-1">{type}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Visa Sponsorship:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.visaSponsorship}</span>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Travel Requirements:</span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedJob.travelRequirements}</span>
                </div>
              </div>
              {selectedJob.benefits && (
                <div className="mt-3">
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Benefits:</span>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedJob.benefits}</p>
                </div>
              )}
            </div>

            {/* Application Requirements */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Application Requirements</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Resume:</span>
                  <Tag color={selectedJob.resumeRequired ? 'red' : 'green'} className="ml-2">
                    {selectedJob.resumeRequired ? 'Required' : 'Optional'}
                  </Tag>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cover Letter:</span>
                  <Tag color={selectedJob.coverLetterRequired === 'Required' ? 'red' : selectedJob.coverLetterRequired === 'Preferred' ? 'orange' : 'green'} className="ml-2">
                    {selectedJob.coverLetterRequired || 'Optional'}
                  </Tag>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Portfolio:</span>
                  <Tag color={selectedJob.portfolioRequired === 'Required' ? 'red' : selectedJob.portfolioRequired === 'Preferred' ? 'orange' : 'green'} className="ml-2">
                    {selectedJob.portfolioRequired || 'Optional'}
                  </Tag>
                </div>
                <div>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>References:</span>
                  <Tag color={selectedJob.referencesRequired === 'Required Upfront' ? 'red' : 'green'} className="ml-2">
                    {selectedJob.referencesRequired || 'Optional'}
                  </Tag>
                </div>
              </div>
              {selectedJob.applicationInstructions && (
                <div className="mt-3">
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Application Instructions:</span>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedJob.applicationInstructions}</p>
                </div>
              )}
            </div>

            {/* Screening Questions */}
            {selectedJob.screeningQuestions && (
              <div>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pre-Screening Questions</h4>
                <div className={`bg-gray-50 dark:bg-gray-800 p-3 rounded-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedJob.screeningQuestions.split('\n').map((question, index) => (
                    <div key={index} className="mb-2">
                      <span className="font-medium">{index + 1}.</span> {question}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy Requirements (for backward compatibility) */}
            {selectedJob.requirements && (
              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Additional Requirements</h4>
                <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>No job selected</p>
          </div>
        )}
      </Modal>
      </div>
    </div>
  )
})

BusinessDashboard.displayName = 'BusinessDashboard'

export default BusinessDashboard 