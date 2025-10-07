// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, Form, Input, Select, Switch, Space, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faShieldAlt,
  faArrowLeft,
  faSave,
  faUndo,
  faUserCheck,
  faUserTimes,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

/**
 * User Edit Page
 * Full page component for editing user details and permissions
 */
const UserEditPage = React.memo(({ user: currentUser }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Get user data from location state
  const userToEdit = location.state?.user

  // Role definitions
  const roles = useMemo(
    () => ({
      admin: {
        label: 'Admin',
        color: SEMANTIC_COLORS.error,
        description: 'Full access to all features'
      },
      recruiter: {
        label: 'Recruiter',
        color: BRAND_COLORS.emeraldPrimary,
        description: 'Can manage candidates and job postings'
      },
      viewer: {
        label: 'Viewer',
        color: BRAND_COLORS.shakespeare,
        description: 'Read-only access to candidates and reports'
      }
    }),
    []
  )

  // Status definitions
  const statusConfig = useMemo(
    () => ({
      active: { label: 'Active', color: SEMANTIC_COLORS.success, icon: faUserCheck },
      inactive: { label: 'Inactive', color: BRAND_COLORS.mediumGray, icon: faUserTimes },
      pending: { label: 'Pending', color: SEMANTIC_COLORS.warning, icon: faEnvelope }
    }),
    []
  )

  // Permission definitions
  const permissionLabels = useMemo(
    () => ({
      publishListings: {
        label: 'Publish Listings',
        description: 'Create and manage job listings',
        icon: faCheckCircle
      },
      editOrgProfile: {
        label: 'Edit Organization Profile',
        description: 'Modify company information and settings',
        icon: faCheckCircle
      },
      manageQuestionnaires: {
        label: 'Manage Questionnaires',
        description: 'Create and edit assessment questionnaires',
        icon: faCheckCircle
      },
      viewCandidates: {
        label: 'View Candidates',
        description: 'Access candidate profiles and applications',
        icon: faCheckCircle
      },
      manageCandidates: {
        label: 'Manage Candidates',
        description: 'Edit candidate information and status',
        icon: faCheckCircle
      },
      viewReports: {
        label: 'View Reports',
        description: 'Access analytics and reporting features',
        icon: faCheckCircle
      }
    }),
    []
  )

  // Set initial form values
  useEffect(() => {
    if (userToEdit) {
      form.setFieldsValue({
        name: userToEdit.name,
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
  const handleReset = useCallback(() => {
    if (userToEdit) {
      form.setFieldsValue({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        status: userToEdit.status,
        ...userToEdit.permissions
      })
      setHasChanges(false)
      message.info('Changes have been reset')
    }
  }, [form, userToEdit])

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (hasChanges) {
      // Show confirmation if there are unsaved changes
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?')
      if (!confirmed) return
    }
    navigate('/business-dashboard/user-management')
  }, [navigate, hasChanges])

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
                onClick={handleBack}
                className='text-white hover:text-emerald-100'
              >
                Back
              </Button>
              <div>
                <h1 className='text-2xl font-bold text-white'>Edit User - {userToEdit.name}</h1>
                <p className='text-emerald-100 text-sm'>Update user details and permissions</p>
              </div>
            </div>

            <div className='flex space-x-3'>
              {hasChanges && (
                <Button
                  icon={<FontAwesomeIcon icon={faUndo} />}
                  onClick={handleReset}
                  className={`shadow-md hover:shadow-lg transition-all duration-200`}
                  style={{
                    backgroundColor: darkMode ? '#6B7280' : '#9CA3AF',
                    borderColor: darkMode ? '#6B7280' : '#9CA3AF',
                    color: '#FFFFFF'
                  }}
                >
                  Reset
                </Button>
              )}

              <Button
                type='primary'
                icon={<FontAwesomeIcon icon={faSave} />}
                onClick={() => form.submit()}
                loading={loading}
                disabled={!hasChanges}
                className={`shadow-md hover:shadow-lg transition-all duration-200`}
                style={{
                  backgroundColor: hasChanges ? BRAND_COLORS.emeraldPrimary : darkMode ? '#4B5563' : '#E5E7EB',
                  borderColor: hasChanges ? BRAND_COLORS.emeraldPrimary : darkMode ? '#4B5563' : '#E5E7EB',
                  color: hasChanges ? '#FFFFFF' : darkMode ? '#9CA3AF' : '#6B7280'
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-6 space-y-6'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            className={`${darkMode ? 'user-edit-form' : ''}`}
          >
            {/* User Information */}
            <Card
              title={
                <div className='flex items-center space-x-3'>
                  <FontAwesomeIcon icon={faUser} className='text-emerald-600' />
                  <span>User Information</span>
                </div>
              }
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
                  label='Full Name'
                  name='name'
                  rules={[
                    { required: true, message: "Please enter the user's name" },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder='Enter full name' />
                </Form.Item>

                <Form.Item
                  label='Email Address'
                  name='email'
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input placeholder='Enter email address' />
                </Form.Item>

                <Form.Item label='Role' name='role' rules={[{ required: true, message: 'Please select a role' }]}>
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
                </Form.Item>

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
            </Card>

            {/* Permissions */}
            <Card
              title={
                <div className='flex items-center space-x-3'>
                  <FontAwesomeIcon icon={faShieldAlt} className='text-emerald-600' />
                  <span>Permissions</span>
                </div>
              }
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
              <div className='space-y-4'>
                {Object.entries(permissionLabels).map(([key, config]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600'
                  >
                    <div className='flex items-center space-x-3'>
                      <FontAwesomeIcon icon={config.icon} className='text-emerald-600' />
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>{config.label}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>{config.description}</div>
                      </div>
                    </div>
                    <Form.Item name={key} valuePropName='checked' noStyle>
                      <Switch />
                    </Form.Item>
                  </div>
                ))}
              </div>
            </Card>
          </Form>
        </div>
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
