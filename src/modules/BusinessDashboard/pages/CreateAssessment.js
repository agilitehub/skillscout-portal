// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  Switch,
  Space,
  message,
  Row,
  Col,
  Tag
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faSave,
  faEye,
  faClipboardCheck,
  faCode,
  faBrain,
  faPuzzlePiece,
  faCog,
  faGraduationCap,
  faListCheck
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import { createAssessment } from '../Assessments/utils.js/controller'
import { parseSkills } from '../Assessments/utils.js/data-model'

const { TextArea } = Input
const { Option } = Select

/**
 * CreateAssessment page for creating new skill assessments
 * Features a three-column layout for better organization of comprehensive form fields
 */
const CreateAssessment = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Handle navigation back to assessments list
  const handleGoBack = useCallback(() => {
    navigate('/business-dashboard/assessments')
  }, [navigate])

  // Handle preview
  const handlePreview = useCallback(() => {
    const values = form.getFieldsValue()
    console.log('Preview assessment:', values)
    message.info('Preview functionality would show assessment preview')
  }, [form])

  // Handle form submission
  const handleFormSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      const processedValues = {
        ...values,
        skills: parseSkills(values.skills)
      }

      const result = await createAssessment(processedValues, user)
      if (result.success) {
        message.success('Assessment created successfully!')
        navigate('/business-dashboard/assessments')
      } else {
        console.error('Error creating assessment:', result.error)  
        message.error('Failed to create assessment: ' + result.error)
      }
    } catch (error) {
      console.error('Unexpected error creating assessment:', error)
      message.error('An unexpected error occurred while creating the assessment')
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
              Back to Assessments
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New Assessment
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Set up a comprehensive skill assessment for candidate evaluation
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
              Create Assessment
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
              .dark-form .ant-input-number {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              .dark-form .ant-input-number:focus {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
              }
              .dark-form .ant-switch-checked {
                background-color: #059669 !important;
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
            {/* Column 1: Basic Information & Configuration */}
            <Card
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faGraduationCap} className='text-white' />
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
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Assessment Title</span>}
                  name="title"
                  rules={[
                    { required: true, message: 'Please enter assessment title' },
                    { max: 255, message: 'Title must be 255 characters or less' }
                  ]}
                >
                  <Input placeholder="e.g. React Developer Assessment" />
                </Form.Item>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Assessment Type</span>}
                    name="type"
                    rules={[{ required: true, message: 'Please select assessment type' }]}
                  >
                    <Select placeholder="Select assessment type">
                      <Option value="Technical">
                        <Space>
                          <FontAwesomeIcon icon={faCode} />
                          Technical
                        </Space>
                      </Option>
                      <Option value="Behavioral">
                        <Space>
                          <FontAwesomeIcon icon={faBrain} />
                          Behavioral
                        </Space>
                      </Option>
                      <Option value="Portfolio">
                        <Space>
                          <FontAwesomeIcon icon={faClipboardCheck} />
                          Portfolio
                        </Space>
                      </Option>
                      <Option value="Cognitive">
                        <Space>
                          <FontAwesomeIcon icon={faPuzzlePiece} />
                          Cognitive
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Category</span>}
                    name="category"
                    rules={[
                      { required: true, message: 'Please enter category' },
                      { max: 255, message: 'Category must be 255 characters or less' }
                    ]}
                  >
                    <Input placeholder="e.g. Frontend Development" />
                  </Form.Item>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Difficulty Level</span>}
                    name="difficulty"
                    rules={[{ required: true, message: 'Please select difficulty level' }]}
                  >
                    <Select placeholder="Select difficulty">
                      <Option value="Beginner">
                        <Space>
                          <Tag color="green">Beginner</Tag>
                          Entry-level
                        </Space>
                      </Option>
                      <Option value="Intermediate">
                        <Space>
                          <Tag color="orange">Intermediate</Tag>
                          Moderate
                        </Space>
                      </Option>
                      <Option value="Advanced">
                        <Space>
                          <Tag color="red">Advanced</Tag>
                          Expert-level
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Status</span>}
                    name="status"
                    initialValue="Draft"
                  >
                    <Select placeholder="Select status">
                      <Option value="Draft">Draft</Option>
                      <Option value="Active">Active</Option>
                      <Option value="Inactive">Inactive</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Duration (min)</span>}
                    name="duration"
                    rules={[
                      { required: true, message: 'Please enter duration' },
                      { type: 'number', min: 1, max: 480, message: 'Duration must be between 1 and 480 minutes' }
                    ]}
                  >
                    <InputNumber
                      placeholder="60"
                      min={1}
                      max={480}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Questions</span>}
                    name="questions"
                    rules={[
                      { required: true, message: 'Please enter number of questions' },
                      { type: 'number', min: 1, max: 200, message: 'Questions must be between 1 and 200' }
                    ]}
                  >
                    <InputNumber
                      placeholder="25"
                      min={1}
                      max={200}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Pass Score (%)</span>}
                    name="passingScore"
                    rules={[
                      { required: true, message: 'Please enter passing score' },
                      { type: 'number', min: 0, max: 100, message: 'Passing score must be between 0 and 100' }
                    ]}
                  >
                    <InputNumber
                      placeholder="70"
                      min={0}
                      max={100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>

            {/* Column 2: Content & Skills */}
            <Card
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faListCheck} className='text-white' />
                  <span className='text-white font-medium'>Content & Skills</span>
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
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Assessment Description</span>}
                  name="description"
                  rules={[
                    { required: true, message: 'Please enter assessment description' },
                    { max: 2000, message: 'Description must be 2000 characters or less' }
                  ]}
                  extra="Describe what this assessment evaluates and what candidates should expect"
                >
                  <TextArea
                    rows={6}
                    placeholder="Describe what this assessment evaluates, what candidates should expect, and any specific requirements or prerequisites..."
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Skills Assessed</span>}
                  name="skills"
                  rules={[{ required: true, message: 'Please enter skills assessed' }]}
                  extra="Enter skills separated by commas. e.g: React, JavaScript, Node.js, AWS"
                >
                  <TextArea
                    rows={3}
                    placeholder="React, JavaScript, Node.js, AWS, Git, RESTful APIs, Testing"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Search Keywords</span>}
                  name="searchKeywords"
                  extra="Additional keywords to help with search and discovery"
                >
                  <Input
                    placeholder="frontend developer react javascript assessment"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Tags</span>}
                  name="tags"
                  extra="Comma-separated tags for categorization"
                >
                  <Input
                    placeholder="frontend, react, javascript, web development"
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Column 3: Settings & Options */}
            <Card
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faCog} className='text-white' />
                  <span className='text-white font-medium'>Settings & Options</span>
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
                <div className='grid grid-cols-1 gap-4'>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Time Limit Enabled</span>}
                    name="timeLimitEnabled"
                    valuePropName="checked"
                    initialValue={true}
                    extra="Enforce the duration limit during assessment"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Randomize Questions</span>}
                    name="randomizeQuestions"
                    valuePropName="checked"
                    initialValue={false}
                    extra="Present questions in random order to each candidate"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Show Results Immediately</span>}
                    name="showResultsImmediately"
                    valuePropName="checked"
                    initialValue={true}
                    extra="Display results to candidates upon completion"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Allow Retakes</span>}
                    name="allowRetakes"
                    valuePropName="checked"
                    initialValue={false}
                    extra="Allow candidates to retake the assessment"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Max Retakes</span>}
                    name="maxRetakes"
                    dependencies={['allowRetakes']}
                    extra="Maximum number of retakes allowed (0 for unlimited)"
                  >
                    <InputNumber
                      placeholder="3"
                      min={0}
                      max={10}
                      style={{ width: '100%' }}
                      disabled={!form.getFieldValue('allowRetakes')}
                    />
                  </Form.Item>
                </div>

                <div className='border-t border-gray-200 dark:border-gray-600 pt-4'>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Access Control
                  </h4>
                  <div className='space-y-4'>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Public Access</span>}
                      name="isPublic"
                      valuePropName="checked"
                      initialValue={false}
                      extra="Allow anyone to discover and take this assessment"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Requires Invitation</span>}
                      name="requiresInvitation"
                      valuePropName="checked"
                      initialValue={true}
                      extra="Candidates need an invitation to take this assessment"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                </div>

                <div className='bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border border-blue-200 dark:border-gray-600'>
                  <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FontAwesomeIcon icon={faClipboardCheck} className="mr-2 text-blue-500" />
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
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('type') || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('duration') ? `${form.getFieldValue('duration')} min` : 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Questions:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {form.getFieldValue('questions') || 'Not specified'}
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

export default CreateAssessment 