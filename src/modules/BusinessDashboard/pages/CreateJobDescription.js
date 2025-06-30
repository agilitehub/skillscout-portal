// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  Switch,
  Space,
  message,
  Row,
  Col
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faSave,
  faEye,
  faFileText,
  faBuilding,
  faMapMarkerAlt,
  faDollarSign,
  faUsers,
  faTasks,
  faClipboardList,
  faGift,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import { createJobDescription } from '../JobDescriptions/utils.js/controller'
import { parseListItems } from '../JobDescriptions/utils.js/data-model'

const { TextArea } = Input
const { Option } = Select

/**
 * CreateJobDescription page for creating new job descriptions
 * Features a three-column layout for better organization of comprehensive form fields
 */
const CreateJobDescription = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Handle navigation back to job descriptions list
  const handleGoBack = useCallback(() => {
    navigate('/business-dashboard/job-descriptions')
  }, [navigate])

  // Handle preview
  const handlePreview = useCallback(() => {
    const values = form.getFieldsValue()
    console.log('Preview job description:', values)
    message.info('Preview functionality would show job description preview')
  }, [form])

  // Handle form submission
  const handleFormSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      const processedValues = {
        ...values,
        responsibilities: parseListItems(values.responsibilities),
        requirements: parseListItems(values.requirements),
        benefits: parseListItems(values.benefits || ''),
        tags: values.tags || []
      }

      const result = await createJobDescription(processedValues, user)
      if (result.success) {
        message.success('Job description created successfully!')
        navigate('/business-dashboard/job-descriptions')
      } else {
        console.error('Error creating job description:', result.error)
        message.error('Failed to create job description: ' + result.error)
      }
    } catch (error) {
      console.error('Unexpected error creating job description:', error)
      message.error('An unexpected error occurred while creating the job description')
    } finally {
      setLoading(false)
    }
  }, [user, navigate])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} relative overflow-hidden`}>
      {/* Background Effects */}
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
              className='absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full blur-3xl'
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

      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Header */}
      <div
        className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} px-6 py-4 ml-64`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button icon={<FontAwesomeIcon icon={faArrowLeft} />} onClick={handleGoBack} className='flex items-center'>
              Back to Job Descriptions
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New Job Description
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Create a comprehensive job description to attract the right candidates
              </p>
            </div>
          </div>
          <div className='flex space-x-3'>
            <Button icon={<FontAwesomeIcon icon={faEye} />} onClick={handlePreview}>
              Preview
            </Button>
            <Button
              type='primary'
              icon={<FontAwesomeIcon icon={faSave} />}
              onClick={() => form.submit()}
              loading={loading}
            >
              Create Job Description
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className='p-6 relative z-10 ml-64'>
        {/* Dark Mode Form Styling */}
        {darkMode && (
          <style>
            {`
              .dark-form .ant-form-item-label > label {
                color: #E5E7EB !important;
              }
              .dark-form .ant-input {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-input:focus {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
              }
              .dark-form .ant-input::placeholder {
                color: #9CA3AF !important;
              }
              .dark-form .ant-select-selector {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-select-focused .ant-select-selector {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
              }
              .dark-form .ant-select-selection-placeholder {
                color: #9CA3AF !important;
              }
              .dark-form .ant-select-selection-item {
                color: #F9FAFB !important;
              }
              .dark-form .ant-select-multiple .ant-select-selection-item {
                background-color: #374151 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-select-multiple .ant-select-selection-item-remove {
                color: #9CA3AF !important;
              }
              .dark-form .ant-select-multiple .ant-select-selection-item-remove:hover {
                color: #F9FAFB !important;
              }
            `}
          </style>
        )}

        <Form
          form={form}
          layout='vertical'
          onFinish={handleFormSubmit}
          className={`max-w-7xl mx-auto ${darkMode ? 'dark-form' : ''}`}
        >
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Column 1: Basic Information & Job Details */}
            <Card
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faBuilding} className='text-white' />
                  <span className='text-white font-medium'>Basic Information</span>
                </div>
              }
              className={`${darkMode ? 'border-teal-500/30' : 'border-blue-200'} h-fit shadow-lg`}
              headStyle={{
                background: darkMode
                  ? 'linear-gradient(135deg, #0f766e, #14b8a6)'
                  : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                borderBottom: 'none',
                color: '#ffffff'
              }}
              bodyStyle={{
                backgroundColor: darkMode ? '#334155' : '#f8fafc',
                borderTop: `3px solid ${darkMode ? '#14b8a6' : '#2563eb'}`
              }}
            >
              <div className='space-y-4'>
                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Job Title</span>}
                  name="title"
                  rules={[
                    { required: true, message: 'Please enter job title' },
                    { max: 255, message: 'Job title must be 255 characters or less' }
                  ]}
                >
                  <Input 
                    placeholder="e.g. Senior React Developer"
                    prefix={<FontAwesomeIcon icon={faFileText} className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Company Name</span>}
                  name="company"
                  rules={[
                    { required: true, message: 'Please enter company name' },
                    { max: 255, message: 'Company name must be 255 characters or less' }
                  ]}
                >
                  <Input 
                    placeholder="e.g. TechCorp Inc."
                    prefix={<FontAwesomeIcon icon={faBuilding} className="text-gray-400" />}
                  />
                </Form.Item>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Department</span>}
                    name="department"
                    rules={[
                      { required: true, message: 'Please enter department' },
                      { max: 255, message: 'Department must be 255 characters or less' }
                    ]}
                  >
                    <Input 
                      placeholder="e.g. Engineering"
                      prefix={<FontAwesomeIcon icon={faUsers} className="text-gray-400" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Location</span>}
                    name="location"
                    rules={[
                      { required: true, message: 'Please enter location' },
                      { max: 255, message: 'Location must be 255 characters or less' }
                    ]}
                  >
                    <Input 
                      placeholder="e.g. San Francisco, CA"
                      prefix={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />}
                    />
                  </Form.Item>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Experience Level</span>}
                    name="experienceLevel"
                  >
                    <Select placeholder="Select experience level" allowClear>
                      <Option value="Entry">Entry Level</Option>
                      <Option value="Mid">Mid Level</Option>
                      <Option value="Senior">Senior Level</Option>
                      <Option value="Executive">Executive</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Salary Range</span>}
                    name="salaryRange"
                    rules={[{ required: true, message: 'Please enter salary range' }]}
                  >
                    <Input 
                      placeholder="e.g. $80,000 - $120,000"
                      prefix={<FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Work Arrangement</span>}
                    name="workArrangement"
                    initialValue="On-site"
                  >
                    <Select placeholder="Select work arrangement">
                      <Option value="On-site">On-site</Option>
                      <Option value="Remote">Remote</Option>
                      <Option value="Hybrid">Hybrid</Option>
                      <Option value="Flexible">Flexible</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Remote Work Allowed</span>}
                  name="remote"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Status</span>}
                  name="status"
                  initialValue="Active"
                >
                  <Select placeholder="Select status">
                    <Option value="Active">Active</Option>
                    <Option value="Draft">Draft</Option>
                    <Option value="Paused">Paused</Option>
                    <Option value="Archived">Archived</Option>
                  </Select>
                </Form.Item>
              </div>
            </Card>

            {/* Column 2: Job Content & Requirements */}
            <Card
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faTasks} className='text-white' />
                  <span className='text-white font-medium'>Job Content & Requirements</span>
                </div>
              }
              className={`${darkMode ? 'border-teal-500/30' : 'border-blue-200'} h-fit shadow-lg`}
              headStyle={{
                background: darkMode
                  ? 'linear-gradient(135deg, #0f766e, #14b8a6)'
                  : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                borderBottom: 'none',
                color: '#ffffff'
              }}
              bodyStyle={{
                backgroundColor: darkMode ? '#334155' : '#f8fafc',
                borderTop: `3px solid ${darkMode ? '#14b8a6' : '#2563eb'}`
              }}
            >
              <div className='space-y-4'>
                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Job Overview</span>}
                  name="overview"
                  rules={[{ required: true, message: 'Please enter job overview' }]}
                  extra="Provide a compelling overview of the role and what makes it attractive to candidates"
                >
                  <TextArea
                    rows={4}
                    placeholder="Describe the role, its importance to the company, and what the successful candidate will achieve..."
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <span className={darkMode ? 'text-gray-300' : ''}>Responsibilities</span>
                      <FontAwesomeIcon icon={faTasks} className="text-gray-400" />
                    </Space>
                  }
                  name="responsibilities"
                  rules={[{ required: true, message: 'Please enter job responsibilities' }]}
                  extra="Enter each responsibility on a new line. Bullet points will be automatically formatted."
                >
                  <TextArea
                    rows={6}
                    placeholder={`• Lead development of new features and products
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews and architecture decisions`}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <span className={darkMode ? 'text-gray-300' : ''}>Requirements</span>
                      <FontAwesomeIcon icon={faClipboardList} className="text-gray-400" />
                    </Space>
                  }
                  name="requirements"
                  rules={[{ required: true, message: 'Please enter job requirements' }]}
                  extra="List the essential skills, qualifications, and experience needed for this role"
                >
                  <TextArea
                    rows={6}
                    placeholder={`• 5+ years of experience with React and modern JavaScript
• Strong understanding of software engineering principles
• Experience with REST APIs and database design
• Excellent communication and collaboration skills`}
                    showCount
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Column 3: Additional Information & Settings */}
            <Card
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faCog} className='text-white' />
                  <span className='text-white font-medium'>Additional Information</span>
                </div>
              }
              className={`${darkMode ? 'border-teal-500/30' : 'border-blue-200'} h-fit shadow-lg`}
              headStyle={{
                background: darkMode
                  ? 'linear-gradient(135deg, #0f766e, #14b8a6)'
                  : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                borderBottom: 'none',
                color: '#ffffff'
              }}
              bodyStyle={{
                backgroundColor: darkMode ? '#334155' : '#f8fafc',
                borderTop: `3px solid ${darkMode ? '#14b8a6' : '#2563eb'}`
              }}
            >
              <div className='space-y-4'>
                <Form.Item
                  label={
                    <Space>
                      <span className={darkMode ? 'text-gray-300' : ''}>Benefits</span>
                      <FontAwesomeIcon icon={faGift} className="text-gray-400" />
                    </Space>
                  }
                  name="benefits"
                  extra="List the benefits and perks offered with this position"
                >
                  <TextArea
                    rows={4}
                    placeholder={`• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible PTO and work-from-home options
• Professional development budget`}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Tags</span>}
                  name="tags"
                  extra="Add relevant tags to help with categorization and search"
                >
                  <Select
                    mode="tags"
                    placeholder="Add tags like: javascript, react, senior, remote"
                    tokenSeparators={[',']}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Search Keywords</span>}
                  name="searchKeywords"
                  extra="Additional keywords to improve discoverability"
                >
                  <Input
                    placeholder="react developer javascript frontend senior engineer"
                  />
                </Form.Item>

                <div className='bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border border-blue-200 dark:border-gray-600'>
                  <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-500" />
                    Quick Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('title') || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Company:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('company') || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('type') || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('location') || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Form>
      </div>
    </div>
  )
})

export default CreateJobDescription 