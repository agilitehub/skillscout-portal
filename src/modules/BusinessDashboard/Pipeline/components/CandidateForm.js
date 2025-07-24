// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Select, Card, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faFlag, faTags, faStickyNote } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'

const { Option } = Select
const { TextArea } = Input

/**
 * Candidate Form Page Component
 * Full page form for creating and editing candidates
 */
const CandidateForm = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Get candidate data for editing from navigation state
  const { editId, initialData } = location.state || {}
  const isEditing = Boolean(editId && initialData)

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', colorClass: 'bg-emerald-500' },
    { value: 'medium', label: 'Medium Priority', colorClass: 'bg-blue-500' },
    { value: 'high', label: 'High Priority', colorClass: 'bg-red-500' }
  ]

  const commonSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'TypeScript',
    'Vue.js',
    'Angular',
    'HTML',
    'CSS',
    'Tailwind',
    'Bootstrap',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'Git',
    'CI/CD',
    'Testing',
    'Agile',
    'Scrum',
    'UI/UX',
    'Figma',
    'Sketch',
    'Adobe Creative Suite',
    'Product Management',
    'Project Management',
    'Leadership',
    'Communication',
    'Problem Solving'
  ]

  // Load existing candidate data for editing
  useEffect(() => {
    if (isEditing && initialData) {
      form.setFieldsValue({
        name: initialData.name,
        position: initialData.position,
        email: initialData.email,
        phone: initialData.phone,
        priority: initialData.priority,
        tags: initialData.tags || [],
        notes: initialData.notes
      })
    }
  }, [isEditing, initialData, form])

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)

        // In a real app, this would make API calls
        // For now, we'll simulate success and navigate back
        await new Promise(resolve => setTimeout(resolve, 500))

        message.success(`${isEditing ? 'Updated' : 'Added'} candidate successfully`)
        navigate('/business-dashboard')
      } catch (error) {
        console.error('Error saving candidate:', error)
        message.error('Failed to save candidate')
      } finally {
        setLoading(false)
      }
    },
    [isEditing, navigate]
  )

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/business-dashboard')
  }, [navigate])

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      {/* Background overlay */}
      <div
        className={`fixed inset-0 ${
          darkMode
            ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-emerald-800/40'
            : 'bg-gradient-to-b from-transparent via-sky-100/40 to-emerald-100/50'
        } pointer-events-none`}
      />

      {/* Sidebar */}
      <BusinessSidebar />

      {/* Main Content */}
      <div className='flex-1 ml-64 relative'>
        {/* Header */}
        <div
          className={`relative px-8 py-4 border-b flex-shrink-0 shadow-lg ${
            darkMode
              ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
          }`}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-3'>
                <div>
                  <h1 className='text-2xl font-bold text-white'>
                    {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
                  </h1>
                  <p className='text-sm text-emerald-100'>
                    {isEditing ? 'Update candidate information' : 'Add a new candidate to the pipeline'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className='p-8'>
          <Card
            className={`border shadow-lg ${
              darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
            }`}
          >
            <Form form={form} layout='vertical' onFinish={handleFormSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Name */}
                <Form.Item
                  label={
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faUser} className='text-gray-500' />
                      <span>Full Name</span>
                    </div>
                  }
                  name='name'
                  rules={[
                    { required: true, message: "Please enter the candidate's name" },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Enter candidate's full name" />
                </Form.Item>

                {/* Position */}
                <Form.Item
                  label={
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faFlag} className='text-gray-500' />
                      <span>Position</span>
                    </div>
                  }
                  name='position'
                  rules={[
                    { required: true, message: 'Please enter the position' },
                    { min: 2, message: 'Position must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder='e.g., Senior React Developer' />
                </Form.Item>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Email */}
                <Form.Item
                  label={
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faEnvelope} className='text-gray-500' />
                      <span>Email Address</span>
                    </div>
                  }
                  name='email'
                  rules={[
                    { required: true, message: 'Please enter the email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input placeholder='candidate@example.com' />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                  label={
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faPhone} className='text-gray-500' />
                      <span>Phone Number</span>
                    </div>
                  }
                  name='phone'
                  rules={[{ pattern: /^\+?[1-9]\d{1,14}$|^\+?[\d\s\-()]{10,20}$/, message: 'Please enter a valid phone number' }]}
                >
                  <Input placeholder='+1 (555) 123-4567' />
                </Form.Item>
              </div>

              {/* Priority */}
              <Form.Item
                label={
                  <div className='flex items-center space-x-2'>
                    <FontAwesomeIcon icon={faFlag} className='text-gray-500' />
                    <span>Priority Level</span>
                  </div>
                }
                name='priority'
                rules={[{ required: true, message: 'Please select a priority level' }]}
              >
                <Select placeholder='Select priority level'>
                  {priorityOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div className='flex items-center space-x-2'>
                        <div className={`w-3 h-3 rounded-full ${option.colorClass}`}></div>
                        <span>{option.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Tags/Skills */}
              <Form.Item
                label={
                  <div className='flex items-center space-x-2'>
                    <FontAwesomeIcon icon={faTags} className='text-gray-500' />
                    <span>Skills & Tags</span>
                  </div>
                }
                name='tags'
                extra='Select relevant skills and technologies'
              >
                <Select
                  mode='tags'
                  placeholder='Select or type skills...'
                  style={{ width: '100%' }}
                  tokenSeparators={[',']}
                  maxTagCount={10}
                  tagRender={({ label, onClose, closable }) => (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mr-1 mb-1 ${
                        darkMode
                          ? 'bg-emerald-800 text-emerald-100 border border-emerald-700'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {label}
                      {closable && (
                        <button
                          type="button"
                          onClick={onClose}
                          className={`ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium hover:opacity-75 focus:outline-none ${
                            darkMode
                              ? 'text-emerald-300 hover:bg-emerald-700'
                              : 'text-emerald-600 hover:bg-emerald-200'
                          }`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  )}
                >
                  {commonSkills.map((skill) => (
                    <Option key={skill} value={skill}>
                      {skill}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Notes */}
              <Form.Item
                label={
                  <div className='flex items-center space-x-2'>
                    <FontAwesomeIcon icon={faStickyNote} className='text-gray-500' />
                    <span>Notes</span>
                  </div>
                }
                name='notes'
                extra='Add any relevant notes about the candidate'
              >
                <TextArea
                  rows={4}
                  placeholder="Add notes about the candidate's background, interview feedback, or other relevant information..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              {/* Form Actions */}
              <div
                className={`flex justify-end space-x-4 pt-6 mt-8 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } bg-gradient-to-r ${
                  darkMode ? 'from-gray-800/50 to-gray-700/50' : 'from-gray-50/50 to-white/50'
                } -mx-6 -mb-6 px-6 py-4 rounded-b-lg`}
              >
                <Button 
                  onClick={handleCancel} 
                  disabled={loading}
                  variant='secondary'
                  className='min-w-24'
                >
                  Cancel
                </Button>
                <Button 
                  type='primary' 
                  htmlType='submit' 
                  loading={loading}
                  className='bg-emerald-600 hover:bg-emerald-700 border-emerald-600 min-w-24'
                >
                  {isEditing ? 'Update Candidate' : 'Add Candidate'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        {/* Dark mode specific styles for form elements */}
        {darkMode && (
          <style jsx global>{`
            .ant-form-item-label > label,
            .ant-form-item-extra {
              color: #d1d5db !important;
            }
            .ant-input,
            .ant-input:focus,
            .ant-input-focused,
            .ant-select-selector,
            .ant-select-focused .ant-select-selector,
            .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
              background-color: #374151 !important;
              border-color: #4b5563 !important;
              color: #f9fafb !important;
            }
            .ant-input::placeholder,
            .ant-select-selection-placeholder {
              color: #9ca3af !important;
            }
            .ant-select-dropdown {
              background-color: #374151 !important;
              border-color: #4b5563 !important;
            }
            .ant-select-item {
              color: #f9fafb !important;
            }
            .ant-select-item:hover {
              background-color: #4b5563 !important;
            }
            .ant-select-item-option-selected {
              background-color: #059669 !important;
            }
            .ant-form-item-has-error .ant-input,
            .ant-form-item-has-error .ant-select-selector {
              border-color: #ef4444 !important;
            }
            .ant-form-item-explain-error {
              color: #fca5a5 !important;
            }
            .ant-select-selection-item-remove {
              color: #9CA3AF !important;
            }
            .ant-select-selection-item-remove:hover {
              color: #F9FAFB !important;
              background-color: #EF4444 !important;
            }
          `}</style>
        )}
      </div>
    </div>
  )
})

export default CandidateForm 