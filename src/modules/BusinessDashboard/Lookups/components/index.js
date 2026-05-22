// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSpinner, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { message, Spin } from 'antd'
import { BusinessDashboardPageShell, DashboardToolbarButton } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import { getAllLookups, deleteLookup } from '../controllers'
import { Toolbar } from '../../../../core/components'

import '../../styles/dashboard-toolbar-buttons.css'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'

/**
 * Lookups Management Page
 * Manages system lookup values for job categories, departments, locations, etc.
 */
const Lookups = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup] = useState('all')
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
      navigate(`/business-dashboard/lookups/${profile.id}/edit`, {
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
      render: (isActive) => {
        const activeClass = darkMode
          ? 'bg-emerald-900/75 text-emerald-100 ring-1 ring-emerald-600/60'
          : 'bg-green-100 text-green-800'
        const inactiveClass = darkMode
          ? 'bg-red-900/70 text-red-100 ring-1 ring-red-600/50'
          : 'bg-red-100 text-red-800'
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              isActive ? activeClass : inactiveClass
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      },
      width: 100
    },
    {
      title: 'ITEMS',
      dataIndex: 'totalItems',
      key: 'totalItems',
      render: (count) => <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count}</span>,
      width: 100
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
              onClick: () => {
                // Edit the first profile in the category for now
                if (record.profiles.length > 0) {
                  handleEdit(record.profiles[0])
                }
              }
            },
            {
              key: 'delete',
              icon: faTrash,
              tooltip: 'Delete Category',
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
      <BusinessDashboardPageShell className='relative overflow-hidden'>
        <Toolbar
          title='Lookups'
          description='Manage your lookups'
          renderActions={() => (
            <DashboardToolbarButton
              onClick={handleAdd}
              icon={<FontAwesomeIcon icon={faPlus} className='text-[11px]' />}
            >
              <span>Create New</span>
            </DashboardToolbarButton>
          )}
        />

        <ModuleContainer>
          <Spin spinning={loading} indicator={<FontAwesomeIcon icon={faSpinner} spin />}>
            <TableView
              columns={columns}
              dataSource={groupedData}
              rowKey='key'
              expandedRowRender={expandedRowRender}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              searchPlaceholder='Search lookups...'
              pagination={{
                total: groupedData.length,
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`
              }}
              emptyText='No lookup categories found'
            />
          </Spin>
        </ModuleContainer>
      </BusinessDashboardPageShell>
    </>
  )
})

Lookups.displayName = 'Lookups'

export default Lookups
