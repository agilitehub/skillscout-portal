// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { message, Tag, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPlus,
  faEnvelope,
  faUserCheck,
  faUserTimes,
  faUserSlash,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'
import userManagementController from '../utils/controller'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import Toolbar from '../../../../core/components/Toolbar'
import dayjs from 'dayjs'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'

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

  // Role definitions (currently unused but kept for future use)
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

  // Get default permissions for role (currently unused but kept for future use)
  // const getDefaultPermissions = useCallback((role) => {
  //   switch (role) {
  //     case 'admin':
  //       return {
  //         publishListings: true,
  //         editOrgProfile: true,
  //         manageQuestionnaires: true,
  //         viewCandidates: true,
  //         manageCandidates: true,
  //         viewReports: true
  //       }
  //     case 'recruiter':
  //       return {
  //         publishListings: true,
  //         editOrgProfile: false,
  //         manageQuestionnaires: false,
  //         viewCandidates: true,
  //         manageCandidates: true,
  //         viewReports: true
  //       }
  //     case 'viewer':
  //       return {
  //         publishListings: false,
  //         editOrgProfile: false,
  //         manageQuestionnaires: false,
  //         viewCandidates: true,
  //         manageCandidates: false,
  //         viewReports: true
  //       }
  //     default:
  //       return {}
  //   }
  // }, [])

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

  // Handle role change (currently unused but kept for future use)
  // const handleRoleChange = useCallback(
  //   (userId, newRole) => {
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user.id === userId
  //           ? {
  //               ...user,
  //               role: newRole,
  //               // Update permissions based on role
  //               permissions: getDefaultPermissions(newRole)
  //             }
  //           : user
  //       )
  //     )
  //     message.success(`Role updated successfully`)
  //   },
  //   [getDefaultPermissions]
  // )

  // Handle status toggle (currently unused but kept for future use)
  // const handleStatusToggle = useCallback(
  //   (userId) => {
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user.id === userId
  //           ? {
  //               ...user,
  //               status: user.status === 'active' ? 'inactive' : 'active'
  //             }
  //           : user
  //       )
  //     )
  //     const user = users.find((u) => u.id === userId)
  //     const newStatus = user?.status === 'active' ? 'inactive' : 'active'
  //     message.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  //   },
  //   [users]
  // )

  // Handle user deactivation
  const handleDeactivateUser = useCallback(
    async (userId) => {
      const user = users.find((u) => u.id === userId)
      try {
        const result = await userManagementController.deactivateUser(userId)

        if (result.success) {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === userId
                ? {
                    ...u,
                    status: 'inactive'
                  }
                : u
            )
          )
          message.success(`${user?.name} has been deactivated`)
        } else {
          message.error(result.error || 'Failed to deactivate user')
        }
      } catch (error) {
        console.error('Error deactivating user:', error)
        message.error('An unexpected error occurred while deactivating user')
      }
    },
    [users]
  )

  // Handle user deletion
  const handleDeleteUser = useCallback(
    async (userId) => {
      const user = users.find((u) => u.id === userId)
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
      navigate(`/business-dashboard/user-management/${userToEdit.id}/edit`, {
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
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
        width: '20%',
        sorter: (a, b) => a.first_name.localeCompare(b.first_name),
        render: (text, record) => {
          return (
            <div>
              <div
                className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200'
                onClick={() => handleEditUser(record)}
              >
                {record.first_name}
              </div>
            </div>
          )
        }
      },
      {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
        width: '20%',
        sorter: (a, b) => a.last_name.localeCompare(b.last_name),
        render: (text, record) => {
          return (
            <div>
              <div>{record.last_name}</div>
            </div>
          )
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '20%',
        sorter: (a, b) => a.email.localeCompare(b.email),
        render: (text, record) => {
          return (
            <div>
              <div>{record.email}</div>
            </div>
          )
        }
      },
      // {
      //   title: 'Role',
      //   dataIndex: 'role',
      //   key: 'role',
      //   width: 150,
      //   sorter: (a, b) => a.role.localeCompare(b.role),
      //   render: (role, record) => (
      //     <Select
      //       value={role}
      //       onChange={(newRole) => handleRoleChange(record.id, newRole)}
      //       style={{ width: 120 }}
      //       size='small'
      //       className='role-select'
      //       dropdownClassName={darkMode ? 'user-mgmt-dark-dropdown' : ''}
      //     >
      //       {Object.entries(roles).map(([key, config]) => (
      //         <Select.Option key={key} value={key}>
      //           <Space>
      //             <div className='w-2 h-2 rounded-full' style={{ backgroundColor: config.color }} />
      //             {config.label}
      //           </Space>
      //         </Select.Option>
      //       ))}
      //     </Select>
      //   )
      // },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status, record) => {
          const config = statusConfig[status]
          return (
            <div className='flex items-center justify-center'>
              <Tag color={config.color} style={{ fontWeight: '500' }}>
                <Space size={4}>
                  <FontAwesomeIcon icon={config.icon} />
                  <span>{config.label}</span>
                </Space>
              </Tag>
            </div>
          )
        }
      },
      // {
      //   title: 'Last Login',
      //   dataIndex: 'lastLogin',
      //   key: 'lastLogin',
      //   width: 140,
      //   sorter: (a, b) => {
      //     if (!a.lastLogin && !b.lastLogin) return 0
      //     if (!a.lastLogin) return 1
      //     if (!b.lastLogin) return -1
      //     return new Date(a.lastLogin) - new Date(b.lastLogin)
      //   },
      //   render: (lastLogin) => (
      //     <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
      //       {lastLogin ? new Date(lastLogin).toLocaleDateString() : <span className='italic'>Never</span>}
      //     </div>
      //   )
      // },
      {
        title: 'Invitation Date',
        dataIndex: 'invitedDate',
        key: 'invitedDate',
        width: '10%',
        sorter: (a, b) => new Date(a.invitedDate) - new Date(b.invitedDate),
        render: (date) => {
          return <div className='text-center'>{dayjs(new Date(date)).format('YYYY-MM-DD')}</div>
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '5%',
        render: (_, record) => {
          // Show different actions based on user status
          const actions = []

          if (record.status === 'active') {
            // For active users, show deactivate action
            actions.push({
              key: 'deactivate',
              icon: faUserSlash,
              tooltip: 'Deactivate User',
              color: 'text-orange-500 hover:text-orange-400',
              onClick: (record) => handleDeactivateUser(record.id),
              confirm: {
                title: 'Deactivate User',
                description: `Are you sure you want to deactivate ${record.email}?`,
                okText: 'Yes',
                cancelText: 'Cancel',
                okType: 'danger'
              }
            })
          } else if (record.status === 'inactive' || record.status === 'pending') {
            // For inactive users, show delete action
            actions.push({
              key: 'delete',
              icon: faTrash,
              tooltip: 'Remove User',
              color: 'text-red-500 hover:text-red-400',
              onClick: (record) => handleDeleteUser(record.id),
              confirm: {
                title: 'Remove User',
                description: `Are you sure you want to permanently remove ${record.email} from the organization?`,
                okText: 'Remove',
                cancelText: 'Cancel',
                okType: 'danger'
              }
            })
          }

          return <TableActions record={record} actions={actions} />
        }
      }
    ],
    [statusConfig, handleDeleteUser, handleDeactivateUser, handleEditUser]
  )

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
        <Toolbar
          title='User Management'
          description='Manage your users and their roles'
          renderActions={() => (
            <Button
              type='default'
              size='middle'
              className='dashboard-button'
              style={{
                backgroundColor: '#ffffff',
                borderColor: '#ffffff',
                color: '#059669',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                fontSize: '13px',
                height: '32px',
                paddingLeft: '12px',
                paddingRight: '12px'
              }}
              onClick={handleInviteUser}
            >
              <FontAwesomeIcon icon={faUserPlus} style={{ fontSize: '11px', marginRight: '4px' }} />
              <span>Invite User</span>
            </Button>
          )}
        />

        {/* Content Area */}
        <ModuleContainer>
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

          <TableView
            loading={loading}
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
            cardProps={{
              className: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }}
          />
        </ModuleContainer>
      </div>

      {/* Dashboard Button Styles */}
      <style jsx global>{`
        .dashboard-button,
        .dashboard-button.ant-btn,
        button.dashboard-button {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .dashboard-button:hover,
        .dashboard-button.ant-btn:hover,
        button.dashboard-button:hover {
          background: #f8f9fa !important;
          background-color: #f8f9fa !important;
          color: #047857 !important;
          border: 1px solid #f8f9fa !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
        }

        ${darkMode
          ? `
          .dashboard-button,
          .dashboard-button.ant-btn,
          button.dashboard-button {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #059669 !important;
            border: 1px solid #ffffff !important;
          }
          
          .dashboard-button:hover,
          .dashboard-button.ant-btn:hover,
          button.dashboard-button:hover {
            background: #f8f9fa !important;
            background-color: #f8f9fa !important;
            color: #047857 !important;
            border: 1px solid #f8f9fa !important;
          }
        `
          : ''}
      `}</style>
    </div>
  )
})

UserManagement.displayName = 'UserManagement'

export default UserManagement
