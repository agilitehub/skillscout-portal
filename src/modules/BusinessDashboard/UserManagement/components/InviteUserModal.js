// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback } from 'react'
import { Modal, Form, Input, Select, Space, Row, Col } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faEnvelope, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

const { TextArea } = Input

/**
 * Invite User Modal Component
 * Handles user invitations with email and role assignment
 */
const InviteUserModal = React.memo(({ visible, onCancel, onSuccess, darkMode }) => {
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

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      // In a real app, this would make an API call to send the invitation
      const newUser = {
        name: values.name || values.email.split('@')[0], // Extract name from email if not provided
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
      
      onSuccess(newUser)
      form.resetFields()
    } catch (error) {
      console.error('Error inviting user:', error)
    } finally {
      setLoading(false)
    }
  }, [form, onSuccess, getDefaultPermissions])

  // Handle cancel
  const handleCancel = useCallback(() => {
    form.resetFields()
    onCancel()
  }, [form, onCancel])

  return (
    <>
      {/* Modal Styles */}
      <style jsx global>{`
        .invite-modal .ant-modal-content {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .invite-modal .ant-modal-header {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          border-bottom: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .invite-modal .ant-modal-close {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invite-modal .ant-modal-close:hover {
          color: ${BRAND_COLORS.emeraldLight} !important;
        }
        
        .invite-modal .ant-form-item-label > label {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invite-modal .ant-input {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invite-modal .ant-input:focus,
        .invite-modal .ant-input-focused {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .invite-modal .ant-select-selector {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invite-modal .ant-select-arrow {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invite-modal .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
        }
        
        .invite-modal .ant-select-focused .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .role-option-description {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .invite-user-dark-dropdown {
          background-color: ${BRAND_COLORS.darkSlateAlt} !important;
        }
        
        .invite-user-dark-dropdown .ant-select-item {
          color: ${BRAND_COLORS.white} !important;
        }
        
        .invite-user-dark-dropdown .ant-select-item:hover {
          background-color: ${BRAND_COLORS.mediumSlate} !important;
        }
        
        .invite-user-dark-dropdown .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: ${BRAND_COLORS.white} !important;
        }
      `}</style>

      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: BRAND_COLORS.emeraldPrimary }}
            >
              <FontAwesomeIcon icon={faUserPlus} className='text-white text-sm' />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              Invite New User
            </span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={600}
        className="invite-modal"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className={darkMode ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            style={{
              backgroundColor: BRAND_COLORS.emeraldPrimary,
              borderColor: BRAND_COLORS.emeraldPrimary
            }}
          >
            Send Invitation
          </Button>
        ]}
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: 'recruiter'
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
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
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label="Full Name (Optional)"
                name="name"
              >
                <Input 
                  placeholder="John Smith"
                  style={{ fontWeight: '500' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <FontAwesomeIcon icon={faShieldAlt} className="text-gray-400" />
                <span>Role</span>
              </Space>
            }
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role" style={{ fontWeight: '500' }} dropdownClassName={darkMode ? 'invite-user-dark-dropdown' : ''}>
              {roleOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <div className="role-option-description">
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

          {/* Permission Preview */}
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
                    className={`p-4 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
})

InviteUserModal.displayName = 'InviteUserModal'

export default InviteUserModal 