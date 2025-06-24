// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Select, Button, Card, message, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faEye, faBriefcase, faUsers, faClipboardList, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import BusinessSidebar from '../components/BusinessSidebar'

const { Option } = Select
const { TextArea } = Input

/**
 * CreateJobPosting - Dedicated page for creating and editing job postings
 * Features a three-column layout for better organization of comprehensive form fields
 */
const CreateJobPosting = React.memo(() => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  
  // State management
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [customFields, setCustomFields] = useState([])
  const [nextFieldId, setNextFieldId] = useState(1)

  // Check if we're editing an existing job
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const jobId = searchParams.get('id')
    const editData = location.state?.jobData

    if (jobId && editData) {
      setIsEditMode(true)
      setJobData(editData)
      form.setFieldsValue(editData)
    }
  }, [location, form])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const action = isEditMode ? 'updated' : 'created'
      message.success(`Job posting ${action} successfully!`)
      
      // Navigate back to business dashboard
      navigate('/business-dashboard')
      
    } catch (error) {
      console.error('Error saving job posting:', error)
      message.error('Failed to save job posting. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [isEditMode, navigate])

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate('/business-dashboard')
  }, [navigate])

  // Handle preview
  const handlePreview = useCallback(() => {
    const values = form.getFieldsValue()
    console.log('Preview job posting:', values)
    message.info('Preview functionality would show job posting preview')
  }, [form])

  // Handle adding custom fields
  const handleAddCustomField = useCallback(() => {
    const newField = {
      id: nextFieldId,
      label: '',
      type: 'text',
      required: false,
      placeholder: ''
    }
    setCustomFields(prev => [...prev, newField])
    setNextFieldId(prev => prev + 1)
  }, [nextFieldId])

  // Handle removing custom fields
  const handleRemoveCustomField = useCallback((fieldId) => {
    setCustomFields(prev => prev.filter(field => field.id !== fieldId))
    // Also remove the field value from form
    const fieldName = `customField_${fieldId}`
    form.setFieldsValue({ [fieldName]: undefined })
  }, [form])

  // Handle updating custom field properties
  const handleUpdateCustomField = useCallback((fieldId, property, value) => {
    setCustomFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, [property]: value }
          : field
      )
    )
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {darkMode ? (
          <>
            <div 
              className="absolute -top-[10%] -right-[10%] w-1/2 h-1/2 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}
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

      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Header */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} px-6 py-4 ml-64`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
              onClick={handleBack}
              className="flex items-center"
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill out the comprehensive job details to attract the right candidates
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              icon={<FontAwesomeIcon icon={faEye} />}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faSave} />}
              onClick={() => form.submit()}
              loading={loading}
            >
              {isEditMode ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="p-6 relative z-10 ml-64">
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
          layout="vertical"
          onFinish={handleSubmit}
          className={`max-w-7xl mx-auto ${darkMode ? 'dark-form' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Basic Information & Job Details */}
            <Card
              title={
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-white" />
                  <span className="text-white font-medium">Job Information</span>
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
              <div className="space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Salary Range</span>}
                    name="salary"
                    rules={[{ required: true, message: 'Please enter salary range' }]}
                  >
                    <Input placeholder="e.g. $120,000 - $150,000" />
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Work Arrangement</span>}
                    name="workArrangement"
                    rules={[{ required: true, message: 'Please select work arrangement' }]}
                  >
                    <Select placeholder="Select work arrangement">
                      <Option value="On-site">On-site Only</Option>
                      <Option value="Remote">Remote Only</Option>
                      <Option value="Hybrid">Hybrid (Remote + On-site)</Option>
                      <Option value="Flexible">Flexible</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Job Description</span>}
                  name="description"
                  rules={[{ required: true, message: 'Please enter job description' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Benefits Offered</span>}
                  name="benefits"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="e.g. Health insurance, 401k matching, flexible PTO, professional development budget..."
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Column 2: Candidate Requirements & Skills */}
            <Card
              title={
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUsers} className="text-white" />
                  <span className="text-white font-medium">Candidate Requirements</span>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Years of Experience</span>}
                    name="experienceRequired"
                    rules={[{ required: true, message: 'Please select experience level' }]}
                  >
                    <Select placeholder="Select experience level">
                      <Option value="0-1">0-1 years</Option>
                      <Option value="2-4">2-4 years</Option>
                      <Option value="5-7">5-7 years</Option>
                      <Option value="8+">8+ years</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Education Level</span>}
                    name="educationLevel"
                  >
                    <Select placeholder="Select minimum education" allowClear>
                      <Option value="High School">High School</Option>
                      <Option value="Diploma">Diploma</Option>
                      <Option value="Bachelor's Degree">Bachelor's Degree</Option>
                      <Option value="Master's Degree">Master's Degree</Option>
                      <Option value="PhD">PhD</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Field of Study</span>}
                  name="fieldOfStudy"
                >
                  <Input placeholder="e.g. Computer Science, Marketing, Engineering" />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Industry Experience</span>}
                  name="industryExperience"
                >
                  <Select placeholder="Select industry" allowClear>
                    <Option value="Technology">Technology</Option>
                    <Option value="Healthcare">Healthcare</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Retail">Retail</Option>
                    <Option value="Manufacturing">Manufacturing</Option>
                    <Option value="Education">Education</Option>
                    <Option value="Marketing">Marketing</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Required Hard Skills</span>}
                  name="requiredSkills"
                  rules={[{ required: true, message: 'Please enter required skills' }]}
                >
                  <TextArea 
                    rows={3}
                    placeholder="e.g. Python, React, SQL, Project Management (comma-separated)" 
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Preferred Soft Skills</span>}
                  name="softSkills"
                >
                  <TextArea 
                    rows={3}
                    placeholder="e.g. Leadership, Communication, Problem-solving (comma-separated)" 
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Tools & Software</span>}
                  name="toolsRequired"
                >
                  <TextArea 
                    rows={3}
                    placeholder="e.g. Jira, Salesforce, Figma, Adobe Creative Suite (comma-separated)" 
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Certifications Required</span>}
                  name="certificationsRequired"
                >
                  <Input placeholder="e.g. AWS Certified, PMP, Google Analytics" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Visa Sponsorship</span>}
                    name="visaSponsorship"
                  >
                    <Select placeholder="Visa sponsorship available?" allowClear>
                      <Option value="Available">Available</Option>
                      <Option value="Not Available">Not Available</Option>
                      <Option value="Case by Case">Case by Case</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Travel Requirements</span>}
                    name="travelRequirements"
                  >
                    <Select placeholder="Travel required?" allowClear>
                      <Option value="None">No Travel Required</Option>
                      <Option value="Occasional">Occasional (10-25%)</Option>
                      <Option value="Frequent">Frequent (25-50%)</Option>
                      <Option value="Extensive">Extensive (50%+)</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Card>

            {/* Column 3: Application Requirements & Employment Details */}
            <Card
              title={
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faClipboardList} className="text-white" />
                  <span className="text-white font-medium">Application & Employment</span>
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
              <div className="space-y-4">
                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Employment Types Accepted</span>}
                  name="employmentTypes"
                  rules={[{ required: true, message: 'Please select employment types' }]}
                >
                  <Select mode="multiple" placeholder="Select employment types">
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                    <Option value="Contract">Contract</Option>
                    <Option value="Freelance">Freelance</Option>
                    <Option value="Internship">Internship</Option>
                  </Select>
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Resume Required</span>}
                    name="resumeRequired"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Is resume required?">
                      <Option value={true}>Yes, Required</Option>
                      <Option value={false}>Optional</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Cover Letter</span>}
                    name="coverLetterRequired"
                  >
                    <Select placeholder="Cover letter requirement" allowClear>
                      <Option value="Required">Required</Option>
                      <Option value="Preferred">Preferred</Option>
                      <Option value="Optional">Optional</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Portfolio Required</span>}
                    name="portfolioRequired"
                  >
                    <Select placeholder="Portfolio requirement" allowClear>
                      <Option value="Required">Required</Option>
                      <Option value="Preferred">Preferred</Option>
                      <Option value="Optional">Optional</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>References Required</span>}
                    name="referencesRequired"
                  >
                    <Select placeholder="References requirement" allowClear>
                      <Option value="Required">Required Upfront</Option>
                      <Option value="Upon Request">Upon Request</Option>
                      <Option value="Optional">Optional</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Additional Application Instructions</span>}
                  name="applicationInstructions"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Any specific instructions for applicants (e.g. include GitHub profile, answer specific questions, etc.)"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Pre-Screening Questions</span>}
                  name="screeningQuestions"
                >
                  <TextArea 
                    rows={6} 
                    placeholder="Enter screening questions (one per line)&#10;e.g.&#10;- Are you authorized to work in this country?&#10;- What is your expected salary range?&#10;- When is your earliest start date?"
                  />
                </Form.Item>

                {/* Custom Fields Section */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Custom Fields
                    </h4>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={handleAddCustomField}
                      className={`${darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : ''}`}
                    >
                      Add Field
                    </Button>
                  </div>

                  {customFields.length === 0 && (
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>
                      Add custom fields to capture additional information from applicants
                    </p>
                  )}

                  {customFields.map((field) => (
                    <Card
                      key={field.id}
                      size="small"
                      className={`mb-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}
                      bodyStyle={{ 
                        padding: '12px',
                        backgroundColor: darkMode ? '#374151' : '#f9fafb'
                      }}
                    >
                      <div className="space-y-3">
                        {/* Field Configuration Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input
                            placeholder="Field Label (e.g. LinkedIn Profile)"
                            value={field.label}
                            onChange={(e) => handleUpdateCustomField(field.id, 'label', e.target.value)}
                            className="text-xs"
                          />
                          <Select
                            value={field.type}
                            onChange={(value) => handleUpdateCustomField(field.id, 'type', value)}
                            size="small"
                            className="w-full"
                          >
                            <Option value="text">Text Input</Option>
                            <Option value="textarea">Text Area</Option>
                            <Option value="select">Dropdown</Option>
                            <Option value="number">Number</Option>
                            <Option value="email">Email</Option>
                            <Option value="url">URL</Option>
                            <Option value="date">Date</Option>
                          </Select>
                        </div>

                        {/* Placeholder and Options */}
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            placeholder="Placeholder text"
                            value={field.placeholder}
                            onChange={(e) => handleUpdateCustomField(field.id, 'placeholder', e.target.value)}
                            size="small"
                            className="text-xs"
                          />
                          {field.type === 'select' && (
                            <Input
                              placeholder="Options (comma-separated, e.g. Option 1, Option 2, Option 3)"
                              value={field.options || ''}
                              onChange={(e) => handleUpdateCustomField(field.id, 'options', e.target.value)}
                              size="small"
                              className="text-xs"
                            />
                          )}
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`required_${field.id}`}
                              checked={field.required}
                              onChange={(e) => handleUpdateCustomField(field.id, 'required', e.target.checked)}
                              className="rounded"
                            />
                            <label 
                              htmlFor={`required_${field.id}`}
                              className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              Required
                            </label>
                          </div>
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => handleRemoveCustomField(field.id)}
                            className="text-xs"
                          >
                            Remove
                          </Button>
                        </div>

                        {/* Preview of the actual form field */}
                        {field.label && (
                          <div className="border-t pt-2 mt-2">
                            <Form.Item
                              label={<span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preview:</span>}
                              name={`customField_${field.id}`}
                              rules={field.required ? [{ required: true, message: `Please enter ${field.label}` }] : []}
                              className="mb-0"
                            >
                              {field.type === 'textarea' ? (
                                <TextArea
                                  placeholder={field.placeholder || field.label}
                                  rows={2}
                                  size="small"
                                  disabled
                                />
                              ) : field.type === 'select' ? (
                                <Select
                                  placeholder={field.placeholder || `Select ${field.label}`}
                                  size="small"
                                  disabled
                                  className="w-full"
                                >
                                  {field.options && field.options.split(',').map((option, index) => (
                                    <Option key={index} value={option.trim()}>
                                      {option.trim()}
                                    </Option>
                                  ))}
                                </Select>
                              ) : (
                                <Input
                                  type={field.type}
                                  placeholder={field.placeholder || field.label}
                                  size="small"
                                  disabled
                                />
                              )}
                            </Form.Item>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Action Bar - Mobile Friendly */}
          <div className={`mt-8 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} lg:hidden`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                icon={<FontAwesomeIcon icon={faEye} />}
                onClick={handlePreview}
                className="flex-1"
              >
                Preview
              </Button>
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faSave} />}
                onClick={() => form.submit()}
                loading={loading}
                className="flex-1"
              >
                {isEditMode ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
})

CreateJobPosting.displayName = 'CreateJobPosting'

export default CreateJobPosting 