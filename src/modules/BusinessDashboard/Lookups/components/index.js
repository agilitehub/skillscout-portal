// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlus, faFilter, faSpinner, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Select, message, Spin } from 'antd'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import { getAllLookups, deleteLookup } from '../utils/controller'

const { Option } = Select

/**
 * Lookups Management Page
 * Manages system lookup values for job categories, departments, locations, etc.
 */
const Lookups = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [profileData, setProfileData] = useState([])
  const [loading, setLoading] = useState(false)

  // Load lookups data on component mount
  useEffect(() => {
    loadLookups()
    // eslint-disable-next-line
  }, [])

  // Load lookups from API
  const loadLookups = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      const result = await getAllLookups(filters)

      if (result.success) {
        setProfileData(result.data)
      } else {
        message.error(result.error || 'Failed to load lookups')
        setProfileData([])
      }
    } catch (error) {
      console.error('Error loading lookups:', error)
      message.error('An unexpected error occurred while loading lookups')
      setProfileData([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Client-side search - no API calls needed
  const filteredProfileData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return profileData
    }

    const term = searchTerm.toLowerCase()
    return profileData.filter(
      (profile) =>
        profile.profileKey?.toLowerCase().includes(term) ||
        profile.groupName?.toLowerCase().includes(term) ||
        profile.labelValuePairs?.some(
          (pair) => pair.label?.toLowerCase().includes(term) || pair.value?.toLowerCase().includes(term)
        )
    )
  }, [profileData, searchTerm])

  // Get unique group names for filter
  const groupNames = [...new Set(profileData.map((p) => p.groupName).filter(Boolean))]

  // Filter data based on search and group
  const filteredData = filteredProfileData.filter((profile) => {
    const matchesGroup = selectedGroup === 'all' || profile.groupName === selectedGroup
    return matchesGroup
  })

  // Handle add new profile
  const handleAdd = useCallback(() => {
    navigate('/business-dashboard/lookups/create')
  }, [navigate])

  // Handle edit existing profile
  const handleEdit = useCallback(
    (profile) => {
      navigate('/business-dashboard/lookups/edit', {
        state: {
          editId: profile.id,
          initialData: profile
        }
      })
    },
    [navigate]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (id) => {
      try {
        setLoading(true)
        const result = await deleteLookup(id)

        if (result.success) {
          message.success('Lookup deleted successfully')
          await loadLookups()
        } else {
          message.error(result.error || 'Failed to delete lookup')
        }
      } catch (error) {
        console.error('Error deleting lookup:', error)
        message.error('An unexpected error occurred while deleting')
      } finally {
        setLoading(false)
      }
    },
    [loadLookups]
  )

  // Group data by categories and calculate stats
  const groupedData = useMemo(() => {
    const groups = {}

    filteredData.forEach((profile) => {
      const category = profile.profileKey || 'Uncategorized'

      if (!groups[category]) {
        groups[category] = {
          key: category,
          category: category,
          profiles: [],
          isActive: true,
          totalItems: 0
        }
      }

      groups[category].profiles.push(profile)
      groups[category].totalItems += profile.labelValuePairs?.length || 0

      // Set category as inactive if any profile is inactive
      if (!profile.isActive) {
        groups[category].isActive = false
      }
    })

    return Object.values(groups)
  }, [filteredData])

  // Table columns
  const columns = [
    {
      title: 'CATEGORY',
      dataIndex: 'category',
      key: 'category',
      render: (text) => (
        <span className={`font-medium text-sm uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {text}
        </span>
      )
    },
    {
      title: 'STATUS',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      width: 100
    },
    {
      title: 'ITEMS',
      dataIndex: 'totalItems',
      key: 'totalItems',
      render: (count) => <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count}</span>,
      width: 80
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <TableActions
          record={record}
          actions={[
            {
              key: 'edit',
              icon: faEdit,
              tooltip: 'Edit Category',
              color: 'text-white',
              className: 'lookups-edit-btn',
              style: {},
              onClick: () => {
                // Edit the first profile in the category for now
                if (record.profiles.length > 0) {
                  handleEdit(record.profiles[0])
                }
              }
            },
            {
              key: 'delete',
              icon: faTrashAlt,
              tooltip: 'Delete Category',
              color: 'text-white',
              className: 'lookups-delete-btn',
              style: {},
              onClick: () => {
                // Delete all profiles in the category
                record.profiles.forEach((profile) => handleDelete(profile.id))
              },
              confirm: {
                title: 'Delete Category',
                description:
                  'Are you sure you want to delete this category? This will delete all profiles in this category.',
                okText: 'Yes',
                cancelText: 'No'
              }
            }
          ]}
        />
      ),
      width: 100
    }
  ]

  // Expandable row content
  const expandedRowRender = (record) => {
    // Collect all label-value pairs from all profiles in this category
    const allPairs = []
    record.profiles.forEach((profile) => {
      if (profile.labelValuePairs && profile.labelValuePairs.length > 0) {
        allPairs.push(...profile.labelValuePairs)
      }
    })

    if (allPairs.length === 0) {
      return <div className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No label-value pairs defined</div>
    }

    return (
      <div className='px-4 pb-4'>
        <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <table className='min-w-full'>
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  LABEL
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  VALUE
                </th>
              </tr>
            </thead>
            <tbody
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-600' : 'divide-gray-200'
              }`}
            >
              {allPairs.map((pair, index) => (
                <tr key={index}>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{pair.label}</td>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{pair.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Dark Mode Styles for Select Component */}
      {/* Dark mode styles */}
      <style jsx global>{`
        /* Dark Mode Form Styling for Lookups */
        ${darkMode
          ? `
          .lookups-form .ant-form-item-label > label {
            color: #E5E7EB !important;
          }
          .lookups-form .ant-form-item-extra {
            color: #9CA3AF !important;
          }
          .lookups-form .ant-input,
          .lookups-form input.ant-input,
          .lookups-form input[type="text"],
          .lookups-form input {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .lookups-form .ant-input:focus,
          .lookups-form input.ant-input:focus,
          .lookups-form input[type="text"]:focus,
          .lookups-form input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .lookups-form .ant-input::placeholder,
          .lookups-form input::placeholder {
            color: #D1D5DB !important;
          }
          .lookups-form textarea.ant-input,
          .lookups-form textarea {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .lookups-form textarea.ant-input:focus,
          .lookups-form textarea:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .lookups-form textarea.ant-input::placeholder,
          .lookups-form textarea::placeholder {
            color: #D1D5DB !important;
          }
          .lookups-form .ant-input-show-count-suffix {
            color: #9CA3AF !important;
          }
          .lookups-form .ant-select,
          .lookups-form .ant-select-selector,
          .lookups-form .ant-select-single .ant-select-selector {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .lookups-form .ant-select-focused .ant-select-selector,
          .lookups-form .ant-select:focus .ant-select-selector {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
          }
          .lookups-form .ant-select-selection-placeholder {
            color: #D1D5DB !important;
          }
          .lookups-form .ant-select-selection-item {
            color: #F9FAFB !important;
            background-color: transparent !important;
          }
          .lookups-form .ant-select-arrow {
            color: #9CA3AF !important;
          }
          .lookups-form .ant-select-multiple .ant-select-selection-item {
            background-color: #374151 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .lookups-form .ant-select-multiple .ant-select-selection-item-remove {
            color: #9CA3AF !important;
          }
          .lookups-form .ant-select-multiple .ant-select-selection-item-remove:hover {
            color: #F9FAFB !important;
          }
          
          /* Form validation messages */
          .lookups-form .ant-form-item-explain-error {
            color: #F87171 !important;
          }
          
          /* Character count */
          .lookups-form .ant-input-data-count {
            color: #9CA3AF !important;
          }
          
          /* Additional comprehensive styling */
          .lookups-form .ant-form-item-control-input {
            background-color: transparent !important;
          }
          .lookups-form .ant-form-item-control-input-content input {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .lookups-form .ant-form-item-control-input-content textarea {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .lookups-form .ant-form-item-control-input-content .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          
          /* Ultimate override for any remaining light elements */
          .lookups-form .ant-form-item input,
          .lookups-form .ant-form-item textarea,
          .lookups-form .ant-form-item .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .lookups-form .ant-form-item .ant-input-affix-wrapper {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }
          .lookups-form .ant-form-item .ant-input-affix-wrapper input {
            background-color: transparent !important;
            color: #F9FAFB !important;
          }
          .lookups-form .ant-form-item .ant-input-prefix {
            color: #9CA3AF !important;
          }
        `
          : ''}

        /* Dark mode dropdown options */
        .lookups-dark-dropdown {
          background-color: #374151 !important;
        }

        .lookups-dark-dropdown .ant-select-item {
          color: #f9fafb !important;
        }

        .lookups-dark-dropdown .ant-select-item:hover {
          background-color: #4b5563 !important;
        }

        .lookups-dark-dropdown .ant-select-item-option-selected {
          background-color: #059669 !important;
          color: #ffffff !important;
        }

        /* Force Create New Button Visibility */
        .create-new-btn,
        .create-new-btn.ant-btn,
        button.create-new-btn {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          height: auto !important;
          min-height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 6px !important;
        }

        .create-new-btn svg,
        .create-new-btn .anticon,
        .create-new-btn i {
          color: #059669 !important;
          margin-right: 8px !important;
        }

        .create-new-btn:hover,
        .create-new-btn.ant-btn:hover,
        button.create-new-btn:hover {
          background: #f0fdf4 !important;
          background-color: #f0fdf4 !important;
          color: #047857 !important;
          border-color: #f0fdf4 !important;
        }

        .create-new-btn:hover svg,
        .create-new-btn:hover .anticon,
        .create-new-btn:hover i {
          color: #047857 !important;
        }

        /* Lookups Action Button Styling */
        .lookups-delete-btn {
          background-color: #ef4444 !important;
          border-color: #ef4444 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
          height: auto !important;
          min-height: 32px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 6px !important;
        }

        .lookups-delete-btn:hover {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
          color: white !important;
          transform: none !important;
        }

        .lookups-delete-btn:focus {
          background-color: #ef4444 !important;
          border-color: #ef4444 !important;
          color: white !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
        }

        .lookups-edit-btn {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
          height: auto !important;
          min-height: 32px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 6px !important;
        }

        .lookups-edit-btn:hover {
          background-color: #047857 !important;
          border-color: #047857 !important;
          color: white !important;
          transform: none !important;
        }

        .lookups-edit-btn:focus {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
        }

        /* Table Row Expand Icon Styling */
        .ant-table-row-expand-icon-cell button,
        .ant-table-row-expand-icon-cell .ant-btn {
          background-color: #059669 !important;
          border-color: #059669 !important;
          color: white !important;
          width: 24px !important;
          height: 24px !important;
          min-height: 24px !important;
          padding: 4px !important;
          border-radius: 4px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1px solid #059669 !important;
        }

        .ant-table-row-expand-icon-cell button:hover,
        .ant-table-row-expand-icon-cell .ant-btn:hover {
          background-color: #047857 !important;
          border-color: #047857 !important;
          color: white !important;
          transform: none !important;
        }

        .ant-table-row-expand-icon-cell button svg,
        .ant-table-row-expand-icon-cell .ant-btn svg {
          color: white !important;
          width: 12px !important;
          height: 12px !important;
        }

        .ant-table-row-expand-icon-cell button svg path,
        .ant-table-row-expand-icon-cell .ant-btn svg path {
          fill: white !important;
        }
      `}</style>

      <div
        className={`min-h-screen relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
            : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
        }`}
      >
        {/* Background overlay for full coverage */}
        <div
          className={`fixed inset-0 ${
            darkMode
              ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-emerald-800/40'
              : 'bg-gradient-to-b from-transparent via-sky-100/40 to-emerald-100/50'
          } pointer-events-none`}
        ></div>

        <div className='p-6 relative z-10'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div
              className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : ''}`}
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FontAwesomeIcon
                    icon={faList}
                    className={`text-lg mr-3 ${darkMode ? 'text-emerald-400' : 'text-white'}`}
                  />
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>Lookups</h1>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <FontAwesomeIcon
                      icon={faFilter}
                      className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-white'}`}
                    />
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-white'}`}>
                      Group Filter:
                    </span>
                  </div>

                  <Select
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    className={`w-48 ${darkMode ? 'dark-select' : 'light-select'}`}
                    placeholder='Filter by group'
                    style={{
                      backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.9)'
                    }}
                    dropdownStyle={{
                      backgroundColor: darkMode ? '#374151' : '#ffffff'
                    }}
                  >
                    <Option value='all'>All Groups</Option>
                    {groupNames.map((group) => (
                      <Option key={group} value={group}>
                        {group}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Profile Data Table */}
            <Spin spinning={loading} indicator={<FontAwesomeIcon icon={faSpinner} spin />}>
              <TableView
                columns={columns}
                dataSource={groupedData}
                rowKey='key'
                expandedRowRender={expandedRowRender}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                searchPlaceholder='Search lookups...'
                toolbarActions={[
                  <Button
                    key='create'
                    type='default'
                    size='large'
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleAdd}
                    className='create-new-btn font-medium'
                  >
                    Create New
                  </Button>
                ]}
                pagination={{
                  total: groupedData.length,
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`
                }}
                emptyText='No lookup categories found'
              />
            </Spin>
          </div>
        </div>
      </div>
    </>
  )
})

Lookups.displayName = 'Lookups'

export default Lookups
