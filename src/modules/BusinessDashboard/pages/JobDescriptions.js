// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, Button, Modal, Form, Input, Select, Tag, Space, Tooltip, List, Avatar } from 'antd'
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
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'

const { TextArea } = Input
const { Option } = Select

/**
 * Job Descriptions page for managing detailed job descriptions
 * Allows creation, editing, and management of job description templates
 */
const JobDescriptions = React.memo(() => {
  const { darkMode } = useTheme()
  
  // State management
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [form] = Form.useForm()

  // Mock data for job descriptions
  const mockDescriptions = useMemo(() => [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salaryRange: '$120,000 - $150,000',
      remote: true,
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      status: 'Active',
      overview: 'We are seeking a highly skilled Senior Software Engineer to join our dynamic engineering team...',
      responsibilities: [
        'Design and develop scalable web applications using React and Node.js',
        'Collaborate with cross-functional teams to define and implement new features',
        'Mentor junior developers and conduct code reviews',
        'Optimize application performance and ensure high-quality code standards',
        'Participate in architectural decisions and technical planning'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience in full-stack development',
        'Proficiency in React, Node.js, and modern JavaScript',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Strong understanding of software engineering principles'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Comprehensive health, dental, and vision insurance',
        'Flexible work arrangements and remote options',
        'Professional development budget',
        'Unlimited PTO policy'
      ],
      tags: ['React', 'Node.js', 'AWS', 'Full-stack', 'Senior Level']
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateLab Inc',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      salaryRange: '$100,000 - $130,000',
      remote: false,
      createdDate: '2024-01-18',
      lastUpdated: '2024-01-22',
      status: 'Active',
      overview: 'Join our product team as a Product Manager to drive product strategy and execution...',
      responsibilities: [
        'Define product roadmap and strategy based on market research',
        'Work closely with engineering and design teams',
        'Analyze user feedback and product metrics',
        'Coordinate product launches and feature releases',
        'Communicate product vision to stakeholders'
      ],
      requirements: [
        'MBA or equivalent experience in product management',
        '3+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Experience with Agile development methodologies',
        'Excellent communication and leadership skills'
      ],
      benefits: [
        'Competitive salary with performance bonuses',
        'Stock options in a growing company',
        'Health and wellness benefits',
        'Learning and development opportunities',
        'Collaborative work environment'
      ],
      tags: ['Product Strategy', 'Agile', 'Analytics', 'Leadership']
    }
  ], [])

  // Load job descriptions
  useEffect(() => {
    const loadDescriptions = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        setJobDescriptions(mockDescriptions)
      } catch (error) {
        console.error('Error loading job descriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDescriptions()
  }, [mockDescriptions])

  // Handle modal operations
  const handleCreateDescription = useCallback(() => {
    setModalMode('create')
    setSelectedDescription(null)
    form.resetFields()
    setIsModalVisible(true)
  }, [form])

  const handleEditDescription = useCallback((description) => {
    setModalMode('edit')
    setSelectedDescription(description)
    form.setFieldsValue({
      ...description,
      responsibilities: description.responsibilities.join('\n'),
      requirements: description.requirements.join('\n'),
      benefits: description.benefits.join('\n')
    })
    setIsModalVisible(true)
  }, [form])

  const handleViewDescription = useCallback((description) => {
    setModalMode('view')
    setSelectedDescription(description)
    setIsModalVisible(true)
  }, [])

  const handleDeleteDescription = useCallback((descriptionId) => {
    Modal.confirm({
      title: 'Delete Job Description',
      content: 'Are you sure you want to delete this job description? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setJobDescriptions(prev => prev.filter(desc => desc.id !== descriptionId))
      }
    })
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
    setSelectedDescription(null)
    form.resetFields()
  }, [form])

  const handleFormSubmit = useCallback(async (values) => {
    try {
      const processedValues = {
        ...values,
        responsibilities: values.responsibilities.split('\n').filter(item => item.trim()),
        requirements: values.requirements.split('\n').filter(item => item.trim()),
        benefits: values.benefits.split('\n').filter(item => item.trim()),
        tags: values.tags || []
      }

      if (modalMode === 'create') {
        const newDescription = {
          id: Date.now().toString(),
          ...processedValues,
          createdDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          status: 'Active'
        }
        setJobDescriptions(prev => [newDescription, ...prev])
      } else if (modalMode === 'edit') {
        setJobDescriptions(prev => 
          prev.map(desc => 
            desc.id === selectedDescription.id 
              ? { ...desc, ...processedValues, lastUpdated: new Date().toISOString().split('T')[0] }
              : desc
          )
        )
      }
      handleModalClose()
    } catch (error) {
      console.error('Error saving job description:', error)
    }
  }, [modalMode, selectedDescription, handleModalClose])

  const handleCopyDescription = useCallback((description) => {
    // Copy description content to clipboard
    const content = `${description.title}\n\n${description.overview}\n\nResponsibilities:\n${description.responsibilities.map(r => `• ${r}`).join('\n')}\n\nRequirements:\n${description.requirements.map(r => `• ${r}`).join('\n')}`
    navigator.clipboard.writeText(content)
  }, [])

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
      <div className="p-6 ml-64 relative z-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Job Descriptions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage detailed job descriptions for your positions
            </p>
          </div>
          <Button
            type="primary"
            size="large"
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

      {/* Job Descriptions List */}
      <div className="grid gap-6">
        {jobDescriptions.map((description) => (
          <Card
            key={description.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} shadow-lg hover:shadow-xl transition-shadow`}
            loading={loading}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar
                      size={48}
                      style={{
                        background: darkMode 
                          ? 'linear-gradient(135deg, #059669, #047857)' 
                          : 'linear-gradient(135deg, #10b981, #059669)'
                      }}
                      icon={<FontAwesomeIcon icon={faFileText} />}
                    />
                    <div className="ml-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {description.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                        {description.company}
                        <span className="mx-2">•</span>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {description.location}
                        {description.remote && <Tag color="green" size="small" className="ml-2">Remote</Tag>}
                      </div>
                    </div>
                  </div>
                  <Tag color={description.status === 'Active' ? 'green' : 'orange'}>
                    {description.status}
                  </Tag>
                </div>

                {/* Overview */}
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {description.overview}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {description.tags.map((tag, index) => (
                    <Tag key={index} color="blue" size="small">
                      {tag}
                    </Tag>
                  ))}
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Department:
                    </span>
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {description.department}
                    </div>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Type:
                    </span>
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {description.type}
                    </div>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Salary:
                    </span>
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {description.salaryRange}
                    </div>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Updated:
                    </span>
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(description.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                <Tooltip title="View Details">
                  <Button
                    type="text"
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => handleViewDescription(description)}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </Tooltip>
                <Tooltip title="Edit Description">
                  <Button
                    type="text"
                    icon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => handleEditDescription(description)}
                    className="text-green-500 hover:text-green-700"
                  />
                </Tooltip>
                <Tooltip title="Copy to Clipboard">
                  <Button
                    type="text"
                    icon={<FontAwesomeIcon icon={faCopy} />}
                    onClick={() => handleCopyDescription(description)}
                    className="text-purple-500 hover:text-purple-700"
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => handleDeleteDescription(description.id)}
                    className="text-red-500 hover:text-red-700"
                  />
                </Tooltip>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Job Description Modal */}
      <Modal
        title={
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
            {modalMode === 'create' ? 'Create Job Description' : modalMode === 'edit' ? 'Edit Job Description' : 'Job Description Details'}
          </span>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={modalMode === 'view' ? [
          <Button key="close" onClick={handleModalClose}>Close</Button>
        ] : [
          <Button key="cancel" onClick={handleModalClose}>Cancel</Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
            style={{
              background: darkMode ? '#059669' : '#10b981',
              borderColor: darkMode ? '#059669' : '#10b981'
            }}
          >
            {modalMode === 'create' ? 'Create Description' : 'Update Description'}
          </Button>
        ]}
        width={900}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: { backgroundColor: darkMode ? '#1f2937' : '#ffffff' },
          body: { backgroundColor: darkMode ? '#1f2937' : '#ffffff' }
        }}
      >
        {modalMode === 'view' && selectedDescription ? (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedDescription.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedDescription.overview}
              </p>
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
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Requirements:
              </h4>
              <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedDescription.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Benefits:
              </h4>
              <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedDescription.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            className={darkMode ? 'dark-form' : ''}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Job Title</span>}
                name="title"
                rules={[{ required: true, message: 'Please enter job title' }]}
              >
                <Input placeholder="e.g. Senior Software Engineer" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Company</span>}
                name="company"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="e.g. TechCorp Solutions" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Department</span>}
                name="department"
                rules={[{ required: true, message: 'Please enter department' }]}
              >
                <Input placeholder="e.g. Engineering" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Location</span>}
                name="location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="e.g. San Francisco, CA" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Job Type</span>}
                name="type"
                rules={[{ required: true, message: 'Please select job type' }]}
              >
                <Select placeholder="Select job type">
                  <Option value="Full-time">Full-time</Option>
                  <Option value="Part-time">Part-time</Option>
                  <Option value="Contract">Contract</Option>
                  <Option value="Internship">Internship</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Salary Range</span>}
                name="salaryRange"
                rules={[{ required: true, message: 'Please enter salary range' }]}
              >
                <Input placeholder="e.g. $120,000 - $150,000" />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Job Overview</span>}
              name="overview"
              rules={[{ required: true, message: 'Please enter job overview' }]}
            >
              <TextArea 
                rows={3} 
                placeholder="Brief overview of the role and what you're looking for..."
              />
            </Form.Item>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Key Responsibilities</span>}
              name="responsibilities"
              rules={[{ required: true, message: 'Please enter key responsibilities' }]}
            >
              <TextArea 
                rows={5} 
                placeholder="Enter each responsibility on a new line..."
              />
            </Form.Item>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Requirements</span>}
              name="requirements"
              rules={[{ required: true, message: 'Please enter requirements' }]}
            >
              <TextArea 
                rows={5} 
                placeholder="Enter each requirement on a new line..."
              />
            </Form.Item>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Benefits</span>}
              name="benefits"
            >
              <TextArea 
                rows={4} 
                placeholder="Enter each benefit on a new line..."
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      </div>
    </div>
  )
})

JobDescriptions.displayName = 'JobDescriptions'

export default JobDescriptions 