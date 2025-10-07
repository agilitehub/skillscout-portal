// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback } from 'react'
import { Form, Input, Select, Space, Row, Col, Card, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faEnvelope, faShieldAlt, faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../core/components'
import { useTheme } from '../../../../core/context/ThemeContext'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'
import userManagementController from '../utils/controller'

const { TextArea } = Input

/**
 * Invite User Page Component
 * Standalone page for sending user invitations with email and role assignment
 */
const InviteUserPage = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Role options
  const roleOptions = [
    {
      value: 'admin',
      label: 'Admin',
      color: SEMANTIC_COLORS.error,
      description: 'Full access to all features and settings'
    },
    {
      value: 'recruiter',
      label: 'Recruiter',
      color: BRAND_COLORS.emeraldPrimary,
      description: 'Can manage candidates, job postings, and questionnaires'
    },
    {
      value: 'viewer',
      label: 'Viewer',
      color: BRAND_COLORS.shakespeare,
      description: 'Read-only access to candidates and reports'
    }
  ]

  // Get default permissions for role
  const getDefaultPermissions = useCallback((role) => {
    switch (role) {
      case 'admin':
        return {
          publishListings: true,
          editOrgProfile: true,
          manageQuestionnaires: true,
          viewCandidates: true,
          manageCandidates: true,
          viewReports: true
        }
      case 'recruiter':
        return {
          publishListings: true,
          editOrgProfile: false,
          manageQuestionnaires: false,
          viewCandidates: true,
          manageCandidates: true,
          viewReports: true
        }
      case 'viewer':
        return {
          publishListings: false,
          editOrgProfile: false,
          manageQuestionnaires: false,
          viewCandidates: true,
          manageCandidates: false,
          viewReports: true
        }
      default:
        return {}
    }
  }, [])

  // Permission labels mapping
  const permissionLabels = {
    publishListings: 'Publish Listings',
    editOrgProfile: 'Edit Org Profile',
    manageQuestionnaires: 'Manage Questionnaires',
    viewCandidates: 'View Candidates',
    manageCandidates: 'Manage Candidates',
    viewReports: 'View Reports'
  }

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
      {/* Background overlay */}
      <div
        className={`fixed inset-0 ${
          darkMode
            ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-emerald-800/40'
            : 'bg-gradient-to-b from-transparent via-sky-100/40 to-emerald-100/50'
        } pointer-events-none`}
      />

      {/* Main Content */}
      <div className='flex-1 ml-64 relative'>
        {/* Header */}
        <div
          className={`relative border-b flex-shrink-0 shadow-lg ${
            darkMode
              ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
          }`}
        >
          <div className='pl-8 pr-8 py-6'>
            <div className='flex items-center'>
              <div className='flex items-center space-x-4'>
                <Button
                  type='text'
                  icon={<FontAwesomeIcon icon={faArrowLeft} />}
                  onClick={handleCancel}
                  className='text-white hover:text-emerald-100 hover:bg-emerald-600/50'
                  size='large'
                />
                <div className='flex items-center space-x-6'>
                  <div
                    className='w-10 h-10 rounded-lg flex items-center justify-center'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <FontAwesomeIcon icon={faUserPlus} className='text-white text-lg' />
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-white'>Invite New User</h1>
                    <p className='text-emerald-100 text-sm'>Send an invitation to join your organization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative'>
          <div className='pl-8 pr-8 py-8'>
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
                className={darkMode ? 'invite-form-dark' : 'invite-form'}
              >
                <Form.Item
                  label={
                    <Space size={8}>
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
                  <Input placeholder='user@company.com' style={{ fontWeight: '500' }} size='large' />
                </Form.Item>

                <Row gutter={24}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <Space size={8}>
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
                      <Input placeholder='John' style={{ fontWeight: '500' }} size='large' />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <Space size={8}>
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
                      <Input placeholder='Smith' style={{ fontWeight: '500' }} size='large' />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Dummy fields - these will be shown in UI but not submitted to database */}
                <Row gutter={24}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label='Department (Coming Soon)'
                      name='department'
                      extra={
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          This field will be available in a future update
                        </span>
                      }
                    >
                      <Input placeholder='Engineering' style={{ fontWeight: '500' }} size='large' disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item
                      label='Job Title (Coming Soon)'
                      name='job_title'
                      extra={
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          This field will be available in a future update
                        </span>
                      }
                    >
                      <Input placeholder='Software Engineer' style={{ fontWeight: '500' }} size='large' disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
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
                </Form.Item>

                <Form.Item
                  label='Personal Message (Optional)'
                  name='message'
                  extra={
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Add a personal note to include with the invitation email
                    </span>
                  }
                >
                  <TextArea
                    placeholder="Hi! I'd like to invite you to join our recruitment team. Looking forward to working with you!"
                    rows={4}
                    style={{ fontWeight: '500' }}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                {/* Role Permissions Preview */}
                <Form.Item
                  label='Role Permissions Preview'
                  extra={
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      These permissions will be applied based on the selected role
                    </span>
                  }
                >
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
                  >
                    {({ getFieldValue }) => {
                      const selectedRole = getFieldValue('role')
                      const permissions = getDefaultPermissions(selectedRole)

                      return (
                        <div
                          className={`p-6 rounded-lg border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {Object.entries(permissions).map(([key, value]) => (
                              <div key={key} className='flex items-center justify-between'>
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {permissionLabels[key]}
                                </span>
                                <div className='flex items-center space-x-2'>
                                  <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                                  <span
                                    className={`text-xs font-medium ${
                                      value ? 'text-green-600' : darkMode ? 'text-red-400' : 'text-red-600'
                                    }`}
                                  >
                                    {value ? 'Allowed' : 'Denied'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }}
                  </Form.Item>
                </Form.Item>

                {/* Form Actions */}
                <div
                  className={`flex justify-end space-x-4 pt-6 mt-6 border-t ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <Button type='default' size='large' onClick={handleCancel} className='invite-user-cancel-btn'>
                    Cancel
                  </Button>
                  <Button
                    type='primary'
                    size='large'
                    loading={loading}
                    onClick={() => form.submit()}
                    style={{
                      backgroundColor: BRAND_COLORS.emeraldPrimary,
                      borderColor: BRAND_COLORS.emeraldPrimary
                    }}
                  >
                    Send Invitation
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .invite-form-dark .ant-form-item-label > label {
          color: #e5e7eb !important;
        }

        .invite-form-dark .ant-form-item-extra {
          color: #9ca3af !important;
        }

        .invite-form-dark .ant-input,
        .invite-form-dark .ant-input-affix-wrapper {
          background-color: #4b5563 !important;
          border-color: #6b7280 !important;
          color: #f9fafb !important;
        }

        .invite-form-dark .ant-input:focus,
        .invite-form-dark .ant-input-affix-wrapper:focus,
        .invite-form-dark .ant-input-focused,
        .invite-form-dark .ant-input-affix-wrapper-focused {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }

        .invite-form-dark .ant-input::placeholder {
          color: #9ca3af !important;
        }

        .invite-form-dark .ant-select-selector {
          background-color: #4b5563 !important;
          border-color: #6b7280 !important;
          color: #f9fafb !important;
        }

        .invite-form-dark .ant-select-arrow {
          color: #f9fafb !important;
        }

        .invite-form-dark .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
        }

        .invite-form-dark .ant-select-focused .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }

        .invite-user-dark-dropdown {
          background-color: #374151 !important;
        }

        .invite-user-dark-dropdown .ant-select-item {
          color: #f9fafb !important;
          min-height: 60px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }

        .invite-user-dark-dropdown .ant-select-item:hover {
          background-color: #4b5563 !important;
        }

        .invite-user-dark-dropdown .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: #ffffff !important;
        }

        /* Light mode dropdown styles */
        .ant-select-dropdown:not(.invite-user-dark-dropdown) .ant-select-item {
          min-height: 60px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }

        .ant-select-dropdown:not(.invite-user-dark-dropdown) .ant-select-item:hover {
          background-color: #f3f4f6 !important;
        }

        .ant-select-dropdown:not(.invite-user-dark-dropdown) .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: #ffffff !important;
        }

        /* Invite User Cancel Button Styling */
        .invite-user-cancel-btn,
        .invite-user-cancel-btn.ant-btn {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 8px 24px !important;
          height: auto !important;
          min-height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 14px !important;
          border-radius: 6px !important;
        }

        .invite-user-cancel-btn:hover,
        .invite-user-cancel-btn.ant-btn:hover {
          background-color: #047857 !important;
          border-color: #047857 !important;
          color: white !important;
          transform: none !important;
        }

        .invite-user-cancel-btn:focus,
        .invite-user-cancel-btn.ant-btn:focus {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
        }
      `}</style>
    </div>
  )
})

InviteUserPage.displayName = 'InviteUserPage'

export default InviteUserPage
