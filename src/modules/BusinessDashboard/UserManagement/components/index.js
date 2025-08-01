// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { message, Tag, Space, Modal, Select, Switch, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faUserPlus,
  faEnvelope,
  faUserCheck,
  faUserTimes,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'
import userManagementController from '../utils/controller'

/**
 * User Management Page
 * Manages organization users, roles, permissions, and invitations
 */
const UserManagement = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Load users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await userManagementController.getAllUsers()

        if (result.success) {
          setUsers(result.data)
        } else {
          setError(result.error || 'Failed to load users')
          message.error(result.error || 'Failed to load users')
        }
      } catch (error) {
        console.error('Error loading users:', error)
        setError('An unexpected error occurred')
        message.error('An unexpected error occurred while loading users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Handle role change
  const handleRoleChange = useCallback(
    (userId, newRole) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: newRole,
                // Update permissions based on role
                permissions: getDefaultPermissions(newRole)
              }
            : user
        )
      )
      message.success(`Role updated successfully`)
    },
    [getDefaultPermissions]
  )

  // Handle status toggle
  const handleStatusToggle = useCallback(
    (userId) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === 'active' ? 'inactive' : 'active'
              }
            : user
        )
      )
      const user = users.find((u) => u.id === userId)
      const newStatus = user?.status === 'active' ? 'inactive' : 'active'
      message.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    },
    [users]
  )

  // Handle user deletion
  const handleDeleteUser = useCallback(
    async (userId) => {
      const user = users.find((u) => u.id === userId)
      Modal.confirm({
        title: 'Delete User',
        content: `Are you sure you want to remove ${user?.name} from the organization? This action cannot be undone.`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        icon: <FontAwesomeIcon icon={faExclamationTriangle} className='text-red-500' />,
        onOk: async () => {
          try {
            const result = await userManagementController.removeUser(userId)

            if (result.success) {
              setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId))
              message.success(`${user?.name} has been removed from the organization`)
            } else {
              message.error(result.error || 'Failed to remove user')
            }
          } catch (error) {
            console.error('Error removing user:', error)
            message.error('An unexpected error occurred while removing user')
          }
        }
      })
    },
    [users]
  )

  // Handle invite user
  const handleInviteUser = useCallback(() => {
    navigate('/business-dashboard/user-management/invite')
  }, [navigate])

  // Handle edit user (click on name)
  const handleEditUser = useCallback(
    (userToEdit) => {
      navigate('/business-dashboard/user-management/edit', {
        state: {
          user: userToEdit,
          isEdit: true
        }
      })
    },
    [navigate]
  )

  // Handle search
  const handleSearch = useCallback(async (value) => {
    setSearchTerm(value)

    if (!value || value.trim() === '') {
      // If search term is empty, reload all users
      try {
        setLoading(true)
        const result = await userManagementController.getAllUsers()

        if (result.success) {
          setUsers(result.data)
        } else {
          message.error(result.error || 'Failed to load users')
        }
      } catch (error) {
        console.error('Error loading users:', error)
        message.error('An unexpected error occurred while loading users')
      } finally {
        setLoading(false)
      }
      return
    }

    // Perform backend search
    try {
      setLoading(true)
      const result = await userManagementController.searchUsers(value.trim())

      if (result.success) {
        setUsers(result.data)
      } else {
        message.error(result.error || 'Failed to search users')
      }
    } catch (error) {
      console.error('Error searching users:', error)
      message.error('An unexpected error occurred while searching users')
    } finally {
      setLoading(false)
    }
  }, [])

  // Since we're using backend search, filteredUsers is just users
  const filteredUsers = useMemo(() => users, [users])

  // Table columns configuration
  const tableColumns = useMemo(
    () => [
      {
        title: 'User',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record) => (
          <div>
            <div
              className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200'
              onClick={() => handleEditUser(record)}
            >
              {text}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{record.email}</div>
          </div>
        )
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: 150,
        sorter: (a, b) => a.role.localeCompare(b.role),
        render: (role, record) => (
          <Select
            value={role}
            onChange={(newRole) => handleRoleChange(record.id, newRole)}
            style={{ width: 120 }}
            size='small'
            className='role-select'
            dropdownClassName={darkMode ? 'user-mgmt-dark-dropdown' : ''}
          >
            {Object.entries(roles).map(([key, config]) => (
              <Select.Option key={key} value={key}>
                <Space>
                  <div className='w-2 h-2 rounded-full' style={{ backgroundColor: config.color }} />
                  {config.label}
                </Space>
              </Select.Option>
            ))}
          </Select>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => {
          const config = statusConfig[status]
          return (
            <Tag color={config.color} style={{ fontWeight: '500' }}>
              <Space size={4}>
                <FontAwesomeIcon icon={config.icon} />
                <span>{config.label}</span>
              </Space>
            </Tag>
          )
        }
      },
      {
        title: 'Last Login',
        dataIndex: 'lastLogin',
        key: 'lastLogin',
        width: 140,
        sorter: (a, b) => {
          if (!a.lastLogin && !b.lastLogin) return 0
          if (!a.lastLogin) return 1
          if (!b.lastLogin) return -1
          return new Date(a.lastLogin) - new Date(b.lastLogin)
        },
        render: (lastLogin) => (
          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {lastLogin ? new Date(lastLogin).toLocaleDateString() : <span className='italic'>Never</span>}
          </div>
        )
      },
      {
        title: 'Invited',
        dataIndex: 'invitedDate',
        key: 'invitedDate',
        width: 120,
        sorter: (a, b) => new Date(a.invitedDate) - new Date(b.invitedDate),
        render: (date) => new Date(date).toLocaleDateString()
      },
      {
        title: 'Active',
        key: 'active',
        width: 80,
        render: (_, record) => (
          <Switch
            checked={record.status === 'active'}
            onChange={() => handleStatusToggle(record.id)}
            disabled={record.status === 'pending'}
            size='small'
          />
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        render: (_, record) => (
          <Button
            type='text'
            size='small'
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => handleDeleteUser(record.id)}
            className='text-red-500 hover:text-red-700'
            title='Remove User'
            disabled={record.id === user?.id} // Prevent self-deletion
          />
        )
      }
    ],
    [darkMode, roles, statusConfig, handleRoleChange, handleStatusToggle, handleDeleteUser, handleEditUser, user]
  )

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
            <div className='flex flex-col space-y-3'>
              <div>
                <h1 className='text-2xl font-bold text-white'>User Management</h1>
              </div>
            </div>

            <Button
              type='default'
              size='large'
              icon={<FontAwesomeIcon icon={faUserPlus} className='mr-2' />}
              onClick={handleInviteUser}
              className='invite-user-btn font-medium'
            >
              Invite User
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-6'>
          {loading && (
            <div className='flex justify-center items-center py-12'>
              <Spin size='large' />
            </div>
          )}

          {error && (
            <div className='flex justify-center items-center py-12'>
              <div className={`text-center ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                <p className='text-lg mb-2'>Error loading users</p>
                <p className='text-sm'>{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className='mt-4'
                  type='primary'
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    borderColor: BRAND_COLORS.emeraldPrimary
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <TableView
              columns={tableColumns}
              dataSource={filteredUsers}
              searchTerm={searchTerm}
              onSearch={handleSearch}
              searchPlaceholder='Search users by name, email, or role...'
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
              }}
              scroll={{ x: 1200 }}
              emptyText='No users found'
              toolbarActions={[]}
              cardProps={{
                className: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }}
            />
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Force white button background for invite button only */
        .invite-user-btn {
          background-color: #ffffff !important;
          color: #059669 !important;
          border: none !important;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24) !important;
          padding: 8px 16px !important;
          height: auto !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          outline: none !important;
        }

        .invite-user-btn:hover {
          background-color: #f8f9fa !important;
          color: #047857 !important;
          box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23) !important;
          outline: none !important;
        }

        .invite-user-btn:focus {
          background-color: #ffffff !important;
          color: #059669 !important;
          outline: none !important;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24) !important;
        }

        .invite-user-btn span,
        .invite-user-btn .anticon {
          text-shadow: none !important;
          outline: none !important;
          border: none !important;
        }

        .role-select .ant-select-selector {
          border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }

        .role-select .ant-select-arrow {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }

        .role-select.ant-select-focused .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }

        .user-mgmt-dark-dropdown {
          background-color: ${BRAND_COLORS.darkSlateAlt} !important;
        }

        .user-mgmt-dark-dropdown .ant-select-item {
          color: ${BRAND_COLORS.white} !important;
        }

        .user-mgmt-dark-dropdown .ant-select-item:hover {
          background-color: ${BRAND_COLORS.mediumSlate} !important;
        }

        .user-mgmt-dark-dropdown .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: ${BRAND_COLORS.white} !important;
        }
      `}</style>
    </div>
  )
})

UserManagement.displayName = 'UserManagement'

export default UserManagement
