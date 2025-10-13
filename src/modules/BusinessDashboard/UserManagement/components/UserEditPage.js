// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, Form, Input, Select, Space, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faSave, faUserCheck, faUserTimes, faCancel } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'
import Toolbar from '../../../../core/components/Toolbar'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'

/**
 * User Edit Page
 * Full page component for editing user details and permissions
 */
const UserEditPage = React.memo(() => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Get user data from location state
  const userToEdit = location.state?.user

  // Role definitions
  // const roles = useMemo(
  //   () => ({
  //     admin: {
  //       label: 'Admin',
  //       color: SEMANTIC_COLORS.error,
  //       description: 'Full access to all features'
  //     },
  //     recruiter: {
  //       label: 'Recruiter',
  //       color: BRAND_COLORS.emeraldPrimary,
  //       description: 'Can manage candidates and job postings'
  //     },
  //     viewer: {
  //       label: 'Viewer',
  //       color: BRAND_COLORS.shakespeare,
  //       description: 'Read-only access to candidates and reports'
  //     }
  //   }),
  //   []
  // )

  // Status definitions
  const statusConfig = useMemo(
    () => ({
      active: { label: 'Active', color: SEMANTIC_COLORS.success, icon: faUserCheck },
      inactive: { label: 'Inactive', color: BRAND_COLORS.mediumGray, icon: faUserTimes },
      pending: { label: 'Pending', color: SEMANTIC_COLORS.warning, icon: faEnvelope }
    }),
    []
  )

  // Set initial form values
  useEffect(() => {
    if (userToEdit) {
      form.setFieldsValue({
        first_name: userToEdit.first_name,
        last_name: userToEdit.last_name,
        email: userToEdit.email,
        role: userToEdit.role,
        status: userToEdit.status,
        ...userToEdit.permissions
      })
    }
  }, [userToEdit, form])

  // Handle form values change
  const handleValuesChange = useCallback(() => {
    setHasChanges(true)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Extract permissions from values
        const { name, email, role, status, ...permissions } = values

        const updatedUser = {
          ...userToEdit,
          name,
          email,
          role,
          status,
          permissions
        }

        console.log('Saving user:', updatedUser)

        setHasChanges(false)
        message.success('User updated successfully!')

        // Navigate back to user management
        navigate('/business-dashboard/user-management')
      } catch (error) {
        console.error('Error updating user:', error)
        message.error('Failed to update user')
      } finally {
        setLoading(false)
      }
    },
    [userToEdit, navigate]
  )

  // Handle reset
  const handleCancel = useCallback(() => {
    // Navigate back to user management
    navigate('/business-dashboard/user-management')
  }, [navigate])

  // If no user data, redirect back
  if (!userToEdit) {
    navigate('/business-dashboard/user-management')
    return null
  }

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
        <Toolbar title='User Edit' description='Edit user information and permissions' />
        {/* Content Area */}
        <ModuleContainer>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            className={`${darkMode ? 'user-edit-form' : ''}`}
          >
            {/* User Information */}
            <Card
              className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              headStyle={{
                backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
              }}
              bodyStyle={{
                backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
              }}
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
                    { required: true, message: "Please enter the user's first name" },
                    { min: 2, message: 'First name must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder='Enter first name' />
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
                    { required: true, message: "Please enter the user's last name" },
                    { min: 2, message: 'Last name must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder='Enter last name' />
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
                  <Input placeholder='Enter email address' />
                </Form.Item>

                {/* <Form.Item label='Role' name='role' rules={[{ required: true, message: 'Please select a role' }]}>
                  <Select placeholder='Select role' dropdownClassName={darkMode ? 'user-edit-dark-dropdown' : ''}>
                    {Object.entries(roles).map(([key, config]) => (
                      <Select.Option key={key} value={key}>
                        <Space>
                          <div className='w-2 h-2 rounded-full' style={{ backgroundColor: config.color }} />
                          <span>{config.label}</span>
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item> */}

                <Form.Item label='Status' name='status' rules={[{ required: true, message: 'Please select status' }]}>
                  <Select placeholder='Select status' dropdownClassName={darkMode ? 'user-edit-dark-dropdown' : ''}>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <Select.Option key={key} value={key}>
                        <Space>
                          <FontAwesomeIcon icon={config.icon} style={{ color: config.color }} />
                          {config.label}
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className='flex justify-end space-x-3 mt-6'>
                <Button onClick={handleCancel} className='form-btn-secondary'>
                  <Space>
                    <FontAwesomeIcon icon={faCancel} />
                    <span>Cancel</span>
                  </Space>
                </Button>

                <Button
                  type='primary'
                  onClick={() => form.submit()}
                  loading={loading}
                  disabled={!hasChanges}
                  className='form-btn-primary'
                >
                  <Space>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save Changes</span>
                  </Space>
                </Button>
              </div>
            </Card>
          </Form>
        </ModuleContainer>
      </div>

      {/* Dark mode styles */}
      <style jsx global>{`
        /* Dark Mode Form Styling */
        ${darkMode
          ? `
          .user-edit-form .ant-form-item-label > label {
            color: #E5E7EB !important;
          }
          .user-edit-form .ant-form-item-extra {
            color: #9CA3AF !important;
          }
          .user-edit-form .ant-input,
          .user-edit-form input.ant-input,
          .user-edit-form input[type="text"],
          .user-edit-form input {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .user-edit-form .ant-input:focus,
          .user-edit-form input.ant-input:focus,
          .user-edit-form input[type="text"]:focus,
          .user-edit-form input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .user-edit-form .ant-input::placeholder,
          .user-edit-form input::placeholder {
            color: #D1D5DB !important;
          }
          .user-edit-form .ant-select,
          .user-edit-form .ant-select-selector,
          .user-edit-form .ant-select-single .ant-select-selector {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .user-edit-form .ant-select-focused .ant-select-selector,
          .user-edit-form .ant-select:focus .ant-select-selector {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
          }
          .user-edit-form .ant-select-selection-placeholder {
            color: #D1D5DB !important;
          }
          .user-edit-form .ant-select-selection-item {
            color: #F9FAFB !important;
            background-color: transparent !important;
          }
          .user-edit-form .ant-select-arrow {
            color: #9CA3AF !important;
          }
          
          /* Form validation messages */
          .user-edit-form .ant-form-item-explain-error {
            color: #F87171 !important;
          }
        `
          : ''}

        /* Dark mode dropdown options */
        .user-edit-dark-dropdown {
          background-color: #374151 !important;
        }

        .user-edit-dark-dropdown .ant-select-item {
          color: #f9fafb !important;
        }

        .user-edit-dark-dropdown .ant-select-item:hover {
          background-color: #4b5563 !important;
        }

        .user-edit-dark-dropdown .ant-select-item-option-selected {
          background-color: #059669 !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  )
})

UserEditPage.displayName = 'UserEditPage'

export default UserEditPage
