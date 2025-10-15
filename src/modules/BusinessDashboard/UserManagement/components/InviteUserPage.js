// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback } from 'react'
import { Form, Input, Space, Card, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../core/components'
import { useTheme } from '../../../../core/context/ThemeContext'
import userManagementController from '../utils/controller'
import Toolbar from '../../../../core/components/Toolbar'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'

/**
 * Invite User Page Component
 * Standalone page for sending user invitations with email and role assignment
 */
const InviteUserPage = React.memo(() => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Role options
  // const roleOptions = [
  //   {
  //     value: 'admin',
  //     label: 'Admin',
  //     color: SEMANTIC_COLORS.error,
  //     description: 'Full access to all features and settings'
  //   },
  //   {
  //     value: 'recruiter',
  //     label: 'Recruiter',
  //     color: BRAND_COLORS.emeraldPrimary,
  //     description: 'Can manage candidates, job postings, and questionnaires'
  //   },
  //   {
  //     value: 'viewer',
  //     label: 'Viewer',
  //     color: BRAND_COLORS.shakespeare,
  //     description: 'Read-only access to candidates and reports'
  //   }
  // ]

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        // Validate required fields
        if (!values.email || !values.first_name || !values.last_name) {
          message.error('Please fill in all required fields')
          return
        }

        // Prepare invitation data
        const invitationData = {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          // Note: role and message are not submitted to database currently
          role: values.role || 'viewer',
          message: values.message
        }

        // Call the backend to invite the user
        const result = await userManagementController.inviteUser(invitationData)

        if (result.success) {
          message.success('User invitation sent successfully!')
          form.resetFields()
          // Navigate back to user management
          navigate('/business-dashboard/user-management')
        } else {
          message.error(result.error || 'Failed to send invitation. Please try again.')
        }
      } catch (error) {
        console.error('Error inviting user:', error)
        message.error('An unexpected error occurred while sending invitation.')
      } finally {
        setLoading(false)
      }
    },
    [form, navigate]
  )

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/business-dashboard/user-management')
  }, [navigate])

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      {/* Main Content */}
      <div className='flex-1 relative'>
        {/* Header */}
        <Toolbar title='Invite New User' description='Send an invitation to a new user to join your organization' />

        {/* Content Area */}
        <ModuleContainer>
          <Card
            className={`shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              borderColor: darkMode ? '#4B5563' : '#e5e7eb'
            }}
          >
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              initialValues={{
                role: 'recruiter'
              }}
              className='global-form'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faUser} className='text-gray-400' />
                      <span>First Name</span>
                    </Space>
                  }
                  name='first_name'
                  rules={[
                    { required: true, message: 'Please enter first name' },
                    { min: 1, message: 'First name must be at least 1 character' }
                  ]}
                >
                  <Input placeholder='John' />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faUser} className='text-gray-400' />
                      <span>Last Name</span>
                    </Space>
                  }
                  name='last_name'
                  rules={[
                    { required: true, message: 'Please enter last name' },
                    { min: 1, message: 'Last name must be at least 1 character' }
                  ]}
                >
                  <Input placeholder='Smith' />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faEnvelope} className='text-gray-400' />
                      <span>Email Address</span>
                    </Space>
                  }
                  name='email'
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input placeholder='user@company.com' />
                </Form.Item>
              </div>

              {/* <Form.Item
                  label={
                    <Space size={8}>
                      <FontAwesomeIcon icon={faShieldAlt} className='text-gray-400' />
                      <span>Role</span>
                    </Space>
                  }
                  name='role'
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select
                    placeholder='Select role'
                    style={{ fontWeight: '500' }}
                    size='large'
                    dropdownClassName={darkMode ? 'invite-user-dark-dropdown' : ''}
                    optionLabelProp='label'
                  >
                    {roleOptions.map((option) => (
                      <Select.Option
                        key={option.value}
                        value={option.value}
                        label={
                          <div className='flex items-center space-x-2'>
                            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: option.color }} />
                            <span className='font-medium'>{option.label}</span>
                          </div>
                        }
                      >
                        <div className='py-2'>
                          <div className='flex items-center space-x-3 mb-1'>
                            <div
                              className='w-3 h-3 rounded-full flex-shrink-0'
                              style={{ backgroundColor: option.color }}
                            />
                            <span className='font-medium text-sm'>{option.label}</span>
                          </div>
                          <div
                            className={`text-xs leading-relaxed pl-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            style={{ lineHeight: '1.4' }}
                          >
                            {option.description}
                          </div>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item> */}

              {/* Form Actions */}
              <div className='flex justify-end space-x-3 mt-6'>
                <Button type='default' size='large' onClick={handleCancel} className='form-btn-secondary'>
                  Cancel
                </Button>
                <Button
                  type='primary'
                  size='large'
                  loading={loading}
                  onClick={() => form.submit()}
                  className='form-btn-primary'
                >
                  <Space>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Send Invitation</span>
                  </Space>
                </Button>
              </div>
            </Form>
          </Card>
        </ModuleContainer>
      </div>
    </div>
  )
})

InviteUserPage.displayName = 'InviteUserPage'

export default InviteUserPage
