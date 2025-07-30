// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback } from 'react'
import { Form, Input, Select, Space, Row, Col, Card, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUserPlus, 
  faEnvelope, 
  faShieldAlt, 
  faArrowLeft,
  faUser 
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../core/components'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

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
  const handleSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      // In a real app, this would make an API call to send the invitation
      const newUser = {
        name: values.name || values.email.split('@')[0],
        email: values.email,
        role: values.role,
        status: 'pending',
        lastLogin: null,
        invitedDate: new Date().toISOString(),
        permissions: getDefaultPermissions(values.role),
        inviteMessage: values.message
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('User invitation sent successfully!')
      form.resetFields()
      
      // Navigate back to user management
      navigate('/business-dashboard/user-management')
    } catch (error) {
      console.error('Error inviting user:', error)
      message.error('Failed to send invitation. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [form, navigate, getDefaultPermissions])

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
              <Button
                type='text'
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={handleCancel}
                className='text-white hover:text-emerald-100 hover:bg-emerald-600/50'
                size='large'
              />
              <div className='flex items-center space-x-3'>
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

        {/* Content Area */}
        <div className='relative p-8'>
          <div className='max-w-4xl mx-auto'>
            <Card
              className={`shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              style={{
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                borderColor: darkMode ? '#4B5563' : '#e5e7eb'
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  role: 'recruiter'
                }}
                className={darkMode ? 'invite-form-dark' : 'invite-form'}
              >
                <Row gutter={24}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <Space size={8}>
                          <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                          <span>Email Address</span>
                        </Space>
                      }
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter email address' },
                        { type: 'email', message: 'Please enter a valid email address' }
                      ]}
                    >
                      <Input 
                        placeholder="user@company.com"
                        style={{ fontWeight: '500' }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <Space size={8}>
                          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                          <span>Full Name (Optional)</span>
                        </Space>
                      }
                      name="name"
                    >
                      <Input 
                        placeholder="John Smith"
                        style={{ fontWeight: '500' }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={
                    <Space size={8}>
                      <FontAwesomeIcon icon={faShieldAlt} className="text-gray-400" />
                      <span>Role</span>
                    </Space>
                  }
                  name="role"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select 
                    placeholder="Select role" 
                    style={{ fontWeight: '500' }} 
                    size="large"
                    dropdownClassName={darkMode ? 'invite-user-dark-dropdown' : ''}
                    optionLabelProp="label"
                  >
                    {roleOptions.map(option => (
                      <Select.Option 
                        key={option.value} 
                        value={option.value}
                        label={
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                            <span className="font-medium">{option.label}</span>
                          </div>
                        }
                      >
                        <div className="py-2">
                          <div className="flex items-center space-x-3 mb-1">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: option.color }}
                            />
                            <span className="font-medium text-sm">{option.label}</span>
                          </div>
                          <div 
                            className={`text-xs leading-relaxed pl-6 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
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
                  label="Personal Message (Optional)"
                  name="message"
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
                  label="Role Permissions Preview"
                  extra={
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      These permissions will be applied based on the selected role
                    </span>
                  }
                >
                  <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
                    {({ getFieldValue }) => {
                      const selectedRole = getFieldValue('role')
                      const permissions = getDefaultPermissions(selectedRole)
                      
                      return (
                        <div 
                          className={`p-6 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(permissions).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {permissionLabels[key]}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    value ? 'bg-green-500' : 'bg-red-500'
                                  }`} />
                                  <span className={`text-xs font-medium ${
                                    value 
                                      ? 'text-green-600' 
                                      : darkMode ? 'text-red-400' : 'text-red-600'
                                  }`}>
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
                <div className={`flex justify-end space-x-4 pt-6 mt-6 border-t ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <Button
                    size="large"
                    onClick={handleCancel}
                    className={darkMode ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="large"
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
          color: #E5E7EB !important;
        }
        
        .invite-form-dark .ant-form-item-extra {
          color: #9CA3AF !important;
        }
        
        .invite-form-dark .ant-input,
        .invite-form-dark .ant-input-affix-wrapper {
          background-color: #4B5563 !important;
          border-color: #6B7280 !important;
          color: #F9FAFB !important;
        }
        
        .invite-form-dark .ant-input:focus,
        .invite-form-dark .ant-input-affix-wrapper:focus,
        .invite-form-dark .ant-input-focused,
        .invite-form-dark .ant-input-affix-wrapper-focused {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .invite-form-dark .ant-input::placeholder {
          color: #9CA3AF !important;
        }
        
        .invite-form-dark .ant-select-selector {
          background-color: #4B5563 !important;
          border-color: #6B7280 !important;
          color: #F9FAFB !important;
        }
        
        .invite-form-dark .ant-select-arrow {
          color: #F9FAFB !important;
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
          color: #F9FAFB !important;
          min-height: 60px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }
        
        .invite-user-dark-dropdown .ant-select-item:hover {
          background-color: #4B5563 !important;
        }
        
        .invite-user-dark-dropdown .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: #FFFFFF !important;
        }
        
        /* Light mode dropdown styles */
        .ant-select-dropdown:not(.invite-user-dark-dropdown) .ant-select-item {
          min-height: 60px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }
        
        .ant-select-dropdown:not(.invite-user-dark-dropdown) .ant-select-item:hover {
          background-color: #F3F4F6 !important;
        }
        
        .ant-select-dropdown:not(.invite-user-dark-dropdown) .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </div>
  )
})

InviteUserPage.displayName = 'InviteUserPage'

export default InviteUserPage 