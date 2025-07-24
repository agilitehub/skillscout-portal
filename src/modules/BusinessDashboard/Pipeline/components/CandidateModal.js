// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { Button } from '../../../../core/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faFlag, faTags, faStickyNote } from '@fortawesome/free-solid-svg-icons'

const { Option } = Select
const { TextArea } = Input

/**
 * Modal component for adding and editing candidates
 */
const CandidateModal = React.memo(({ visible, onCancel, onSubmit, form, editingCandidate, darkMode }) => {
  const handleFinish = (values) => {
    onSubmit(values)
  }

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

  return (
    <Modal
      title={
        <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faUser} className='text-emerald-600' />
          <span>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className={darkMode ? 'dark-modal' : ''}
    >
      <Form form={form} layout='vertical' onFinish={handleFinish} className='mt-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
            rows={3}
            placeholder="Add notes about the candidate's background, interview feedback, or other relevant information..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* Form Actions */}
        <Form.Item className='mb-0 pt-4'>
          <div className='flex justify-end space-x-2'>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit' className='bg-emerald-600 hover:bg-emerald-700 border-emerald-600'>
              {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default CandidateModal
