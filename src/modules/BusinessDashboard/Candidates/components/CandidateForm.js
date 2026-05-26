// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Select, Card, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faFlag, faTags, faStickyNote } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button, BusinessDashboardPageShell } from '../../../../core/components'

import '../styles/candidates.css'

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

        // Simulate a brief loading delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (isEditing) {
          // Update existing candidate
          const savedData = localStorage.getItem('candidatesData')
          if (savedData) {
            const candidatesData = JSON.parse(savedData)

            // Find and update the candidate across all stages
            let updated = false
            for (const stageKey in candidatesData) {
              const candidateIndex = candidatesData[stageKey].findIndex((c) => c.id === editId)
              if (candidateIndex !== -1) {
                candidatesData[stageKey][candidateIndex] = {
                  ...candidatesData[stageKey][candidateIndex],
                  ...values,
                  id: editId // Keep the original ID
                }
                updated = true
                break
              }
            }

            if (updated) {
              localStorage.setItem('candidatesData', JSON.stringify(candidatesData))
              message.success('Updated candidate successfully')
            } else {
              message.error('Candidate not found')
            }
          }
        } else {
          // Add new candidate
          const newCandidate = {
            id: Date.now(), // Simple ID generation
            ...values,
            appliedDate: new Date().toISOString().split('T')[0], // Today's date
            jobListingId: 1 // Default job listing - could be improved
          }

          // Get existing data or create new structure
          let candidatesData = {}
          try {
            const saved = localStorage.getItem('candidatesData')
            if (saved) {
              candidatesData = JSON.parse(saved)
            }
          } catch (error) {
            console.warn('Error loading existing candidates data:', error)
          }

          // Ensure the 'application-received' stage exists
          if (!candidatesData['application-received']) {
            candidatesData['application-received'] = []
          }

          // Add the new candidate to the 'application-received' stage
          candidatesData['application-received'].push(newCandidate)

          // Save back to localStorage
          localStorage.setItem('candidatesData', JSON.stringify(candidatesData))

          message.success('Added candidate successfully')
        }

        navigate('/business-dashboard/candidates')
      } catch (error) {
        console.error('Error saving candidate:', error)
        message.error('Failed to save candidate')
      } finally {
        setLoading(false)
      }
    },
    [isEditing, editId, navigate]
  )

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/business-dashboard/candidates')
  }, [navigate])

  return (
    <BusinessDashboardPageShell className='candidate-form-page'>
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
                    {isEditing ? 'Update candidate information' : 'Add a new candidate to the candidates'}
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
            <Form form={form} layout='vertical' onFinish={handleFormSubmit} className='global-form space-y-6'>
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
                  rules={[
                    {
                      pattern: /^\+?[1-9]\d{1,14}$|^\+?[\d\s\-()]{10,20}$/,
                      message: 'Please enter a valid phone number'
                    }
                  ]}
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
                          type='button'
                          onClick={onClose}
                          className={`ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium hover:opacity-75 focus:outline-none ${
                            darkMode ? 'text-emerald-300 hover:bg-emerald-700' : 'text-emerald-600 hover:bg-emerald-200'
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
                  type='default'
                  size='large'
                  className='min-w-24 candidate-form-cancel-btn'
                  style={{
                    backgroundColor: '#059669',
                    borderColor: '#059669',
                    color: '#ffffff',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    opacity: loading ? '0.6' : '1'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='default'
                  htmlType='submit'
                  loading={loading}
                  size='large'
                  className='min-w-24 candidate-form-submit-btn'
                  style={{
                    backgroundColor: '#059669',
                    borderColor: '#059669',
                    color: '#ffffff',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    opacity: loading ? '0.6' : '1'
                  }}
                >
                  {isEditing ? 'Update Candidate' : 'Add Candidate'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>

      </div>
    </BusinessDashboardPageShell>
  )
})

export default CandidateForm
