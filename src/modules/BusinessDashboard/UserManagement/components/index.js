// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { message, Tag, Space, Modal, Select, Switch } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faUserPlus, 
  faEnvelope,
  faShieldAlt,
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
import EditPermissionsModal from './EditPermissionsModal'

/**
 * User Management Page
 * Manages organization users, roles, permissions, and invitations
 */
const UserManagement = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Sample user data - in real app this would come from API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      invitedDate: '2023-12-01T09:00:00Z',
      permissions: {
        publishListings: true,
        editOrgProfile: true,
        manageQuestionnaires: true,
        viewCandidates: true,
        manageCandidates: true,
        viewReports: true
      }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'recruiter',
      status: 'active',
      lastLogin: '2024-01-14T14:20:00Z',
      invitedDate: '2023-12-05T11:30:00Z',
      permissions: {
        publishListings: true,
        editOrgProfile: false,
        manageQuestionnaires: false,
        viewCandidates: true,
        manageCandidates: true,
        viewReports: true
      }
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-10T16:45:00Z',
      invitedDate: '2023-12-10T15:00:00Z',
      permissions: {
        publishListings: false,
        editOrgProfile: false,
        manageQuestionnaires: false,
        viewCandidates: true,
        manageCandidates: false,
        viewReports: true
      }
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'recruiter',
      status: 'pending',
      lastLogin: null,
      invitedDate: '2024-01-12T10:15:00Z',
      permissions: {
        publishListings: true,
        editOrgProfile: false,
        manageQuestionnaires: false,
        viewCandidates: true,
        manageCandidates: true,
        viewReports: true
      }
    }
  ])

  // Role definitions
  const roles = useMemo(() => ({
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
  }), [])

  // Status definitions
  const statusConfig = useMemo(() => ({
    active: { label: 'Active', color: SEMANTIC_COLORS.success, icon: faUserCheck },
    inactive: { label: 'Inactive', color: BRAND_COLORS.mediumGray, icon: faUserTimes },
    pending: { label: 'Pending', color: SEMANTIC_COLORS.warning, icon: faEnvelope }
  }), [])

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

  // Handle role change
  const handleRoleChange = useCallback((userId, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
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
  }, [getDefaultPermissions])

  // Handle status toggle
  const handleStatusToggle = useCallback((userId) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              status: user.status === 'active' ? 'inactive' : 'active'
            }
          : user
      )
    )
    const user = users.find(u => u.id === userId)
    const newStatus = user?.status === 'active' ? 'inactive' : 'active'
    message.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  }, [users])

  // Handle user deletion
  const handleDeleteUser = useCallback((userId) => {
    const user = users.find(u => u.id === userId)
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to remove ${user?.name} from the organization? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      icon: <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />,
      onOk() {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId))
        message.success(`${user?.name} has been removed from the organization`)
      }
    })
  }, [users])

  // Handle invite user
  const handleInviteUser = useCallback(() => {
    navigate('/business-dashboard/user-management/invite')
  }, [navigate])

  // Handle edit permissions
  const handleEditPermissions = useCallback((user) => {
    setSelectedUser(user)
    setPermissionsModalVisible(true)
  }, [])

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    
    const searchLower = searchTerm.toLowerCase()
    return users.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  }, [users, searchTerm])

  // Table columns configuration
  const tableColumns = useMemo(() => [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {text}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {record.email}
          </div>
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
          size="small"
          className="role-select"
          dropdownClassName={darkMode ? 'user-mgmt-dark-dropdown' : ''}
        >
          {Object.entries(roles).map(([key, config]) => (
            <Select.Option key={key} value={key}>
              <Space>
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: config.color }}
                />
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
          <Tag 
            color={config.color} 
            style={{ fontWeight: '500' }}
          >
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
          {lastLogin 
            ? new Date(lastLogin).toLocaleDateString()
            : <span className="italic">Never</span>
          }
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
          size="small"
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type='text'
            size='small'
            icon={<FontAwesomeIcon icon={faShieldAlt} />}
            onClick={() => handleEditPermissions(record)}
            className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            title="Edit Permissions"
          />
          <Button
            type='text'
            size='small'
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => handleDeleteUser(record.id)}
            className="text-red-500 hover:text-red-700"
            title="Remove User"
            disabled={record.id === user?.id} // Prevent self-deletion
          />
        </Space>
      )
    }
  ], [darkMode, roles, statusConfig, handleRoleChange, handleStatusToggle, handleDeleteUser, handleEditPermissions, user])

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
              type='primary'
              icon={<FontAwesomeIcon icon={faUserPlus} />}
              onClick={handleInviteUser}
              className={`shadow-md hover:shadow-lg transition-all duration-200 ${
                darkMode
                  ? 'bg-white text-emerald-600 hover:bg-emerald-50 border-white'
                  : 'bg-white text-emerald-600 hover:bg-emerald-50 border-white'
              }`}
              style={{
                backgroundColor: 'white',
                color: '#059669',
                borderColor: 'white'
              }}
            >
              Invite User
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-6'>
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
        </div>
      </div>

      {/* Edit Permissions Modal */}
      <EditPermissionsModal
        visible={permissionsModalVisible}
        user={selectedUser}
        onCancel={() => {
          setPermissionsModalVisible(false)
          setSelectedUser(null)
        }}
        onSuccess={(updatedPermissions) => {
          setUsers(prev => 
            prev.map(user => 
              user.id === selectedUser?.id 
                ? { ...user, permissions: updatedPermissions }
                : user
            )
          )
          setPermissionsModalVisible(false)
          setSelectedUser(null)
          message.success('Permissions updated successfully!')
        }}
        darkMode={darkMode}
      />

      {/* Custom Styles */}
      <style jsx global>{`
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