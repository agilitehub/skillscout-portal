// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { message, Tag, Modal, Switch } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faTrash,
  faBuilding,
  faUsers,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

/**
 * Branch Management Page
 * Manages organization branches, locations, and assignments
 * Updated to use dedicated edit pages instead of modals
 */
const BranchManagement = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // Sample branch data - in real app this would come from API
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Headquarters',
      code: 'HQ',
      address: {
        street: '123 Corporate Blvd',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      phone: '+1 (555) 123-4567',
      email: 'hq@company.com',
      manager: 'John Smith',
      status: 'active',
      employeeCount: 150,
      timezone: 'America/New_York',
      established: '2020-01-15',
      description: 'Main headquarters and primary operations center',
      departments: ['Executive', 'HR', 'Finance', 'IT', 'Marketing'],
      isHeadquarters: true
    },
    {
      id: 2,
      name: 'West Coast Office',
      code: 'WC',
      address: {
        street: '456 Innovation Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'United States'
      },
      phone: '+1 (555) 987-6543',
      email: 'westcoast@company.com',
      manager: 'Sarah Johnson',
      status: 'active',
      employeeCount: 85,
      timezone: 'America/Los_Angeles',
      established: '2021-03-10',
      description: 'Technology development and innovation hub',
      departments: ['Engineering', 'Product', 'Design'],
      isHeadquarters: false
    },
    {
      id: 3,
      name: 'European Office',
      code: 'EU',
      address: {
        street: '789 Business Park',
        city: 'London',
        state: 'England',
        zipCode: 'SW1A 1AA',
        country: 'United Kingdom'
      },
      phone: '+44 20 7123 4567',
      email: 'europe@company.com',
      manager: 'Mike Chen',
      status: 'active',
      employeeCount: 42,
      timezone: 'Europe/London',
      established: '2022-06-01',
      description: 'European operations and customer service center',
      departments: ['Sales', 'Customer Support', 'Marketing'],
      isHeadquarters: false
    },
    {
      id: 4,
      name: 'Austin Branch',
      code: 'TX',
      address: {
        street: '321 Tech Square',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'United States'
      },
      phone: '+1 (555) 456-7890',
      email: 'austin@company.com',
      manager: 'Emily Davis',
      status: 'inactive',
      employeeCount: 25,
      timezone: 'America/Chicago',
      established: '2023-01-15',
      description: 'Emerging markets development office',
      departments: ['Business Development', 'Research'],
      isHeadquarters: false
    }
  ])

  // Handle add branch
  const handleAdd = useCallback(() => {
    navigate('/business-dashboard/branch-management/create')
  }, [navigate])

  // Handle edit branch
  const handleEdit = useCallback(
    (branch) => {
      navigate('/business-dashboard/branch-management/edit', {
        state: {
          branch: branch,
          isEdit: true
        }
      })
    },
    [navigate]
  )

  // Handle status toggle
  const handleStatusToggle = useCallback(
    (branchId) => {
      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                status: branch.status === 'active' ? 'inactive' : 'active'
              }
            : branch
        )
      )
      const branch = branches.find((b) => b.id === branchId)
      const newStatus = branch?.status === 'active' ? 'inactive' : 'active'
      message.success(`Branch ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    },
    [branches]
  )

  // Handle branch deletion
  const handleDeleteBranch = useCallback(
    (branchId) => {
      const branch = branches.find((b) => b.id === branchId)

      // Prevent deletion of headquarters
      if (branch?.isHeadquarters) {
        message.error('Cannot delete headquarters branch')
        return
      }

      Modal.confirm({
        title: 'Delete Branch',
        content: `Are you sure you want to delete "${branch?.name}"? This action cannot be undone and may affect associated job listings and users.`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        icon: <FontAwesomeIcon icon={faExclamationTriangle} className='text-red-500' />,
        onOk() {
          setBranches((prevBranches) => prevBranches.filter((b) => b.id !== branchId))
          message.success(`${branch?.name} has been deleted successfully`)
        }
      })
    },
    [branches]
  )

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  // Filter branches based on search term
  const filteredBranches = useMemo(() => {
    if (!searchTerm) return branches

    const searchLower = searchTerm.toLowerCase()
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchLower) ||
        branch.code.toLowerCase().includes(searchLower) ||
        branch.address.city.toLowerCase().includes(searchLower) ||
        branch.address.state.toLowerCase().includes(searchLower) ||
        branch.manager.toLowerCase().includes(searchLower)
    )
  }, [branches, searchTerm])

  // Table columns configuration
  const tableColumns = useMemo(
    () => [
      {
        title: 'Branch',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record) => (
          <div>
            <div className='flex items-center space-x-2'>
              <FontAwesomeIcon icon={faBuilding} className='text-sm' />
              <span
                className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200'
                onClick={() => handleEdit(record)}
              >
                {text}
              </span>
              {record.isHeadquarters && (
                <Tag color={BRAND_COLORS.emeraldPrimary} className='text-xs'>
                  HQ
                </Tag>
              )}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Code: {record.code}</div>
          </div>
        )
      },
      {
        title: 'Location',
        key: 'location',
        width: 200,
        sorter: (a, b) =>
          `${a.address.city}, ${a.address.state}`.localeCompare(`${b.address.city}, ${b.address.state}`),
        render: (_, record) => (
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {record.address.city}, {record.address.state}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{record.address.country}</div>
          </div>
        )
      },
      {
        title: 'Manager',
        dataIndex: 'manager',
        key: 'manager',
        width: 150,
        sorter: (a, b) => a.manager.localeCompare(b.manager),
        render: (text) => <div className={darkMode ? 'text-white' : 'text-gray-900'}>{text}</div>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => (
          <Tag
            color={status === 'active' ? SEMANTIC_COLORS.success : BRAND_COLORS.mediumGray}
            icon={<FontAwesomeIcon icon={status === 'active' ? faCheckCircle : faTimesCircle} />}
            style={{ fontWeight: '500' }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        )
      },
      {
        title: 'Employees',
        dataIndex: 'employeeCount',
        key: 'employeeCount',
        width: 100,
        sorter: (a, b) => a.employeeCount - b.employeeCount,
        render: (count) => (
          <div className={`flex items-center space-x-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FontAwesomeIcon icon={faUsers} className='text-xs' />
            <span>{count}</span>
          </div>
        )
      },
      {
        title: 'Established',
        dataIndex: 'established',
        key: 'established',
        width: 120,
        sorter: (a, b) => new Date(a.established) - new Date(b.established),
        render: (date) => (
          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{new Date(date).toLocaleDateString()}</div>
        )
      },
      {
        title: 'Active',
        key: 'active',
        width: 80,
        render: (_, record) => (
          <Switch
            checked={record.status === 'active'}
            onChange={() => handleStatusToggle(record.id)}
            size='small'
            disabled={record.isHeadquarters} // Prevent deactivating headquarters
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
            onClick={() => handleDeleteBranch(record.id)}
            className='text-red-500 hover:text-red-700'
            title='Delete Branch'
            disabled={record.isHeadquarters} // Prevent deleting headquarters
          />
        )
      }
    ],
    [darkMode, handleStatusToggle, handleEdit, handleDeleteBranch]
  )

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      {/* Dark mode styles */}
      <style jsx global>{`
        /* Dark Mode Form Styling for Branch Management */
        ${darkMode
          ? `
          .branch-form .ant-form-item-label > label {
            color: #E5E7EB !important;
          }
          .branch-form .ant-form-item-extra {
            color: #9CA3AF !important;
          }
          .branch-form .ant-input,
          .branch-form input.ant-input,
          .branch-form input[type="text"],
          .branch-form input {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-form .ant-input:focus,
          .branch-form input.ant-input:focus,
          .branch-form input[type="text"]:focus,
          .branch-form input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .branch-form .ant-input::placeholder,
          .branch-form input::placeholder {
            color: #D1D5DB !important;
          }
          .branch-form textarea.ant-input,
          .branch-form textarea {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-form textarea.ant-input:focus,
          .branch-form textarea:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .branch-form textarea.ant-input::placeholder,
          .branch-form textarea::placeholder {
            color: #D1D5DB !important;
          }
          .branch-form .ant-input-show-count-suffix {
            color: #9CA3AF !important;
          }
          .branch-form .ant-select,
          .branch-form .ant-select-selector,
          .branch-form .ant-select-single .ant-select-selector {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-form .ant-select-focused .ant-select-selector,
          .branch-form .ant-select:focus .ant-select-selector {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
          }
          .branch-form .ant-select-selection-placeholder {
            color: #D1D5DB !important;
          }
          .branch-form .ant-select-selection-item {
            color: #F9FAFB !important;
            background-color: transparent !important;
          }
          .branch-form .ant-select-arrow {
            color: #9CA3AF !important;
          }
          .branch-form .ant-select-multiple .ant-select-selection-item {
            background-color: #374151 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-form .ant-select-multiple .ant-select-selection-item-remove {
            color: #9CA3AF !important;
          }
          .branch-form .ant-select-multiple .ant-select-selection-item-remove:hover {
            color: #F9FAFB !important;
          }
          .branch-form .ant-switch {
            background-color: #6B7280 !important;
          }
          .branch-form .ant-switch-checked {
            background-color: #059669 !important;
          }
          .branch-form .ant-switch-inner {
            color: #F9FAFB !important;
          }
          
          /* Form validation messages */
          .branch-form .ant-form-item-explain-error {
            color: #F87171 !important;
          }
          
          /* Character count */
          .branch-form .ant-input-data-count {
            color: #9CA3AF !important;
          }
          
          /* Additional comprehensive styling */
          .branch-form .ant-form-item-control-input {
            background-color: transparent !important;
          }
          .branch-form .ant-form-item-control-input-content input {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .branch-form .ant-form-item-control-input-content textarea {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .branch-form .ant-form-item-control-input-content .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          
          /* Ultimate override for any remaining light elements */
          .branch-form .ant-form-item input,
          .branch-form .ant-form-item textarea,
          .branch-form .ant-form-item .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .branch-form .ant-form-item .ant-input-affix-wrapper {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }
          .branch-form .ant-form-item .ant-input-affix-wrapper input {
            background-color: transparent !important;
            color: #F9FAFB !important;
          }
          .branch-form .ant-form-item .ant-input-prefix {
            color: #9CA3AF !important;
          }
        `
          : ''}

        /* Dark mode dropdown options */
        .branch-dark-dropdown {
          background-color: #374151 !important;
        }

        .branch-dark-dropdown .ant-select-item {
          color: #f9fafb !important;
        }

        .branch-dark-dropdown .ant-select-item:hover {
          background-color: #4b5563 !important;
        }

        .branch-dark-dropdown .ant-select-item-option-selected {
          background-color: #059669 !important;
          color: #ffffff !important;
        }

        /* Force Add Branch Button Visibility */
        .add-branch-btn,
        .add-branch-btn.ant-btn,
        button.add-branch-btn {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .add-branch-btn:hover,
        .add-branch-btn.ant-btn:hover,
        button.add-branch-btn:hover {
          background: #f8f9fa !important;
          background-color: #f8f9fa !important;
          color: #047857 !important;
          border: 1px solid #f8f9fa !important;
        }
      `}</style>
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
                <h1 className='text-2xl font-bold text-white'>Branch Management</h1>
              </div>
            </div>

            <Button
              type='default'
              size='large'
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleAdd}
              className='add-branch-btn font-medium'
              style={{
                background: '#ffffff',
                backgroundColor: '#ffffff',
                color: '#059669',
                border: '1px solid #ffffff',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: '1'
              }}
            >
              Add Branch
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-6'>
          <TableView
            columns={tableColumns}
            dataSource={filteredBranches}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            searchPlaceholder='Search branches by name, code, location, or manager...'
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} branches`
            }}
            scroll={{ x: 1200 }}
            emptyText='No branches found'
            toolbarActions={[]}
            cardProps={{
              className: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }}
          />
        </div>
      </div>
    </div>
  )
})

BranchManagement.displayName = 'BranchManagement'

export default BranchManagement
