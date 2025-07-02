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
  Col,
  Tabs
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faTimes,
  faFileText,
  faBuilding,
  faMapMarkerAlt,
  faUsers,
  faTasks,
  faClipboardList,
  faGift,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import { createJobDescription } from '../JobDescriptions/utils.js/controller'
import { parseListItems } from '../JobDescriptions/utils.js/data-model'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

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



  // Handle form submission
  const handleFormSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      const processedValues = {
        ...values,
        responsibilities: parseListItems(values.responsibilities),
        requirements: parseListItems(values.requirements),
        benefits: parseListItems(values.benefits || ''),
        searchKeywords: values.searchKeywords || [],
        status: values.status ? 'Active' : 'Draft'
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

      {/* Main Content */}
      <div className='p-6 ml-64 relative z-10'>
        {/* Toolbar */}
        <div 
          className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : ''
          }`}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left Side - Back Button, Title and Description */}
            <div className="flex items-center">
              <Button
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={handleGoBack}
                className={`mr-4 ${
                  darkMode 
                    ? 'border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-400' 
                    : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                }`}
                style={{
                  backgroundColor: darkMode ? '#4B5563' : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Back
              </Button>
              <div className="flex items-center mr-6">
                <FontAwesomeIcon 
                  icon={faFileText} 
                  className={`text-lg mr-3 ${
                    darkMode ? 'text-emerald-400' : 'text-white'
                  }`} 
                />
                <div>
                  <h1 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-white'
                  }`}>
                    Create New Job Description
                  </h1>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-300' : 'text-white/90'
                  }`}>
                    Create a comprehensive job description to attract the right candidates
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              <Button
                icon={<FontAwesomeIcon icon={faTimes} />}
                onClick={handleGoBack}
                size="large"
                className={
                  darkMode 
                    ? "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 font-medium"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 font-medium"
                }
              >
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faSave} />}
                onClick={() => form.submit()}
                loading={loading}
                size="large"
                className={
                  darkMode 
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 font-medium"
                    : "bg-white text-emerald-600 border-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 font-medium"
                }
              >
                Save Job Description
              </Button>
            </div>
          </div>
        </div>


        {/* Dark Mode Form Styling */}
        {darkMode && (
          <style>
            {`
              .dark-form .ant-form-item-label > label {
                color: #E5E7EB !important;
              }
              .dark-form .ant-form-item-extra {
                color: #9CA3AF !important;
              }
              .dark-form .ant-input,
              .dark-form input.ant-input,
              .dark-form input[type="text"],
              .dark-form input {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-input:focus,
              .dark-form input.ant-input:focus,
              .dark-form input[type="text"]:focus,
              .dark-form input:focus {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                background-color: #4B5563 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-input::placeholder,
              .dark-form input::placeholder {
                color: #9CA3AF !important;
              }
              .dark-form textarea.ant-input,
              .dark-form textarea {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form textarea.ant-input:focus,
              .dark-form textarea:focus {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                background-color: #4B5563 !important;
                color: #F9FAFB !important;
              }
              .dark-form textarea.ant-input::placeholder,
              .dark-form textarea::placeholder {
                color: #9CA3AF !important;
              }
              .dark-form .ant-input-show-count-suffix {
                color: #9CA3AF !important;
              }
              .dark-form .ant-select,
              .dark-form .ant-select-selector,
              .dark-form .ant-select-single .ant-select-selector {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-select-focused .ant-select-selector,
              .dark-form .ant-select:focus .ant-select-selector {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                background-color: #4B5563 !important;
              }
              .dark-form .ant-select-selection-placeholder {
                color: #9CA3AF !important;
              }
              .dark-form .ant-select-selection-item {
                color: #F9FAFB !important;
                background-color: transparent !important;
              }
              .dark-form .ant-select-arrow {
                color: #9CA3AF !important;
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
              .dark-form .ant-switch {
                background-color: #6B7280 !important;
              }
              .dark-form .ant-switch-checked {
                background-color: #10B981 !important;
              }
              .dark-form .ant-switch-inner {
                color: #F9FAFB !important;
              }
            `}
          </style>
        )}

        <Card 
          className={`max-w-7xl mx-auto shadow-xl ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
          style={{
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderColor: darkMode ? '#4B5563' : '#e5e7eb'
          }}
        >
          <Form
            form={form}
            layout='vertical'
            onFinish={handleFormSubmit}
            className={`${darkMode ? 'dark-form' : ''}`}
          >
          {/* Dark Mode Tab Styling */}
          {darkMode && (
            <style>
              {`
                .dark-tabs .ant-tabs-tab {
                  color: #9CA3AF !important;
                  border-color: #4B5563 !important;
                }
                .dark-tabs .ant-tabs-tab-active {
                  color: #10B981 !important;
                  border-bottom-color: #10B981 !important;
                }
                .dark-tabs .ant-tabs-tab:hover {
                  color: #34D399 !important;
                }
                .dark-tabs .ant-tabs-ink-bar {
                  background: #10B981 !important;
                }
                .dark-tabs .ant-tabs-content-holder {
                  background-color: transparent !important;
                }
                
                /* Dropdown Options */
                .ant-select-dropdown {
                  background-color: #374151 !important;
                }
                .ant-select-item {
                  color: #F9FAFB !important;
                }
                .ant-select-item:hover {
                  background-color: #4B5563 !important;
                }
                .ant-select-item-option-selected {
                  background-color: #10B981 !important;
                  color: #FFFFFF !important;
                }
                
                /* Switch Labels */
                .ant-switch-inner {
                  color: #FFFFFF !important;
                  font-weight: 500 !important;
                }
                
                /* Form validation messages */
                .ant-form-item-explain-error {
                  color: #F87171 !important;
                }
                
                /* Character count */
                .ant-input-data-count {
                  color: #9CA3AF !important;
                }
                
                /* Additional comprehensive styling */
                .dark-form .ant-form-item-control-input {
                  background-color: transparent !important;
                }
                .dark-form .ant-form-item-control-input-content input {
                  background-color: #4B5563 !important;
                  color: #F9FAFB !important;
                  border-color: #6B7280 !important;
                }
                .dark-form .ant-form-item-control-input-content textarea {
                  background-color: #4B5563 !important;
                  color: #F9FAFB !important;
                  border-color: #6B7280 !important;
                }
                .dark-form .ant-form-item-control-input-content .ant-select-selector {
                  background-color: #4B5563 !important;
                  color: #F9FAFB !important;
                  border-color: #6B7280 !important;
                }
                
                /* Ultimate override for any remaining light elements */
                .dark-form * {
                  scrollbar-color: #6B7280 #374151;
                }
                .dark-form .ant-form-item input,
                .dark-form .ant-form-item textarea,
                .dark-form .ant-form-item .ant-select-selector {
                  background-color: #4B5563 !important;
                  color: #F9FAFB !important;
                  border-color: #6B7280 !important;
                }
                .dark-form .ant-form-item .ant-input-affix-wrapper {
                  background-color: #4B5563 !important;
                  border-color: #6B7280 !important;
                }
                .dark-form .ant-form-item .ant-input-affix-wrapper input {
                  background-color: transparent !important;
                  color: #F9FAFB !important;
                }
                .dark-form .ant-form-item .ant-input-prefix {
                  color: #9CA3AF !important;
                }
              `}
            </style>
          )}

          <Tabs 
            defaultActiveKey="1" 
            size="large"
            className={`${darkMode ? 'dark-tabs' : ''}`}
          >
            {/* Tab 1: Basic Information & Job Details */}
            <TabPane 
              tab={
                <span className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Basic Information</span>
                </span>
              }
              key="1"
            >
              <Row gutter={32}>
                <Col span={12}>
                  <div 
                    className={`space-y-4 p-6 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Basic Details</h3>
                    </div>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Status</span>}
                      name="status"
                      valuePropName="checked"
                      initialValue={true}
                      extra={<span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Turn on to make this job description active</span>}
                    >
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Draft"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Job Title</span>}
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
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Job Overview</span>}
                      name="overview"
                      rules={[{ required: true, message: 'Please enter job overview' }]}
                      extra={<span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Provide a compelling overview of the role and what makes it attractive to candidates</span>}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Describe the role, its importance to the company, and what the successful candidate will achieve..."
                        showCount
                        maxLength={2000}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Company</span>}
                      name="company"
                      rules={[
                        { required: true, message: 'Please enter company name' },
                        { max: 255, message: 'Company name must be 255 characters or less' }
                      ]}
                    >
                      <Input 
                        placeholder="e.g. Tech Corp"
                        prefix={<FontAwesomeIcon icon={faBuilding} className="text-gray-400" />}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Location</span>}
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
                </Col>
                <Col span={12}>
                  <div 
                    className={`space-y-4 p-6 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Job Details</h3>
                    </div>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Department</span>}
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
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Experience Level</span>}
                      name="experienceLevel"
                    >
                      <Select placeholder="Select experience level" allowClear>
                        <Option value="Entry">Entry Level</Option>
                        <Option value="Mid">Mid Level</Option>
                        <Option value="Senior">Senior Level</Option>
                        <Option value="Executive">Executive</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Keywords</span>}
                      name="searchKeywords"
                      extra={<span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Add relevant keywords to help with categorization and search</span>}
                    >
                      <Select
                        mode="tags"
                        placeholder="Add keywords like: javascript, react, senior, remote, frontend, engineer"
                        tokenSeparators={[',']}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </TabPane>

            {/* Tab 2: Detailed Information */}
            <TabPane 
              tab={
                <span className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faTasks} />
                  <span>Detailed Information</span>
                </span>
              }
              key="2"
            >
              <Row gutter={32}>
                <Col span={24}>
                  <div 
                    className={`space-y-6 p-6 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Detailed Information</h3>
                    </div>
                    
                    <Form.Item
                      label={
                        <Space>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Responsibilities</span>
                          <FontAwesomeIcon icon={faTasks} className="text-gray-400" />
                        </Space>
                      }
                      name="responsibilities"
                      rules={[{ required: true, message: 'Please enter job responsibilities' }]}
                      extra={<span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Enter each responsibility on a new line. Bullet points will be automatically formatted.</span>}
                    >
                      <TextArea
                        rows={8}
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
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Requirements</span>
                          <FontAwesomeIcon icon={faClipboardList} className="text-gray-400" />
                        </Space>
                      }
                      name="requirements"
                      rules={[{ required: true, message: 'Please enter job requirements' }]}
                      extra={<span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>List the essential skills, qualifications, and experience needed for this role</span>}
                    >
                      <TextArea
                        rows={8}
                        placeholder={`• 5+ years of experience with React and modern JavaScript
• Strong understanding of software engineering principles
• Experience with REST APIs and database design
• Excellent communication and collaboration skills`}
                        showCount
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <Space>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Benefits</span>
                          <FontAwesomeIcon icon={faGift} className="text-gray-400" />
                        </Space>
                      }
                      name="benefits"
                      extra={<span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>List the benefits and perks offered with this position</span>}
                    >
                      <TextArea
                        rows={8}
                        placeholder={`• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible PTO and work-from-home options
• Professional development budget`}
                        showCount
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </TabPane>


          </Tabs>
          </Form>
        </Card>
      </div>
    </div>
  )
})

export default CreateJobDescription 