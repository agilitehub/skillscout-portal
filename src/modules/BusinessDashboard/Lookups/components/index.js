// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../ui/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlus, faFilter, faArrowLeft, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, Select, Modal, Form, message, Switch, Row, Col, Spin } from 'antd'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import { getAllLookups, createLookup, updateLookup, deleteLookup } from '../utils/controller'

const { Option } = Select

/**
 * Lookups Management Page
 * Manages system lookup values for job categories, departments, locations, etc.
 */
const Lookups = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)
  const [labelValuePairs, setLabelValuePairs] = useState([{ label: '', value: '' }])
  const [profileData, setProfileData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

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
    setIsModalVisible(true)
    setEditingProfile(null)
    form.resetFields()
    setLabelValuePairs([{ label: '', value: '' }])
  }, [form])

  // Handle edit existing profile
  const handleEdit = useCallback(
    (profile) => {
      setEditingProfile(profile)
      setIsModalVisible(true)

      // Populate form with existing data
      form.setFieldsValue({
        profileKey: profile.profileKey,
        groupName: profile.groupName,
        solutions: profile.solutions || [],
        isActive: profile.isActive
      })

      // Set existing label-value pairs
      setLabelValuePairs(
        profile.labelValuePairs && profile.labelValuePairs.length > 0
          ? profile.labelValuePairs
          : [{ label: '', value: '' }]
      )
    },
    [form]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      try {
        setModalLoading(true)

        const validPairs = labelValuePairs.filter((pair) => pair.label && pair.label.trim())

        if (validPairs.length === 0) {
          message.error('Please add at least one label-value pair')
          return
        }

        const lookupData = {
          ...values,
          labelValuePairs: validPairs.map((pair, index) => ({
            ...pair,
            sortOrder: index + 1
          }))
        }

        let result
        if (editingProfile) {
          result = await updateLookup(editingProfile.id, lookupData, user)
        } else {
          result = await createLookup(lookupData, user)
        }

        if (result.success) {
          message.success(`${editingProfile ? 'Updated' : 'Created'} lookup successfully`)
          setIsModalVisible(false)
          setEditingProfile(null)
          form.resetFields()
          setLabelValuePairs([{ label: '', value: '' }])

          // Reload data to get fresh state
          await loadLookups()
        } else {
          message.error(result.error || `Failed to ${editingProfile ? 'update' : 'create'} lookup`)
        }
      } catch (error) {
        console.error('Error saving lookup:', error)
        message.error('An unexpected error occurred while saving')
      } finally {
        setModalLoading(false)
      }
    },
    [editingProfile, labelValuePairs, form, user, loadLookups]
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

  // Handle label-value pair changes
  const handleLabelValueChange = useCallback((index, field, value) => {
    setLabelValuePairs((prev) => prev.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair)))
  }, [])

  // Add new label-value pair
  const addLabelValuePair = useCallback(() => {
    setLabelValuePairs((prev) => [...prev, { label: '', value: '' }])
  }, [])

  // Remove label-value pair
  const removeLabelValuePair = useCallback(
    (index) => {
      if (labelValuePairs.length > 1) {
        setLabelValuePairs((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [labelValuePairs.length]
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
              onClick: () => {
                // Edit the first profile in the category for now
                if (record.profiles.length > 0) {
                  handleEdit(record.profiles[0])
                }
              }
            },
            {
              key: 'delete',
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
      {darkMode && (
        <style jsx global>
          {`
            .dark-select .ant-select-selector {
              background-color: #4b5563 !important;
              border-color: #6b7280 !important;
              color: #ffffff !important;
              font-weight: 500 !important;
              font-size: 14px !important;
            }
            .dark-select .ant-select-selection-item {
              background-color: transparent !important;
              color: #ffffff !important;
              border: none !important;
            }
            .dark-select .ant-select-arrow {
              color: #9ca3af !important;
            }
            .dark-select .ant-select:focus .ant-select-selector {
              border-color: #6b7280 !important;
              box-shadow: none !important;
            }
            .dark-select .ant-select-selection-placeholder {
              color: #9ca3af !important;
              opacity: 0.8 !important;
            }
            .dark-select .ant-select-dropdown {
              background-color: #374151 !important;
              border-color: #4b5563 !important;
            }
            .dark-select .ant-select-item {
              background-color: #374151 !important;
              color: #ffffff !important;
            }
            .dark-select .ant-select-item:hover {
              background-color: #4b5563 !important;
              color: #ffffff !important;
            }
            .dark-select .ant-select-item-option-selected {
              background-color: #059669 !important;
              color: #ffffff !important;
            }
            .dark-select .ant-select-item-option-active {
              background-color: #4b5563 !important;
              color: #ffffff !important;
            }
            .light-select .ant-select-selector {
              background-color: rgba(255, 255, 255, 0.9) !important;
              border-color: rgba(255, 255, 255, 0.3) !important;
              color: #374151 !important;
              font-weight: 500 !important;
              font-size: 14px !important;
            }
            .light-select .ant-select-selection-item {
              background-color: transparent !important;
              color: #374151 !important;
              border: none !important;
            }
            .light-select .ant-select-arrow {
              color: #6b7280 !important;
            }
            .light-select .ant-select-selection-placeholder {
              color: #6b7280 !important;
              opacity: 0.8 !important;
            }
          `}
        </style>
      )}

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

        <BusinessSidebar />
        <div className='p-6 ml-64 relative z-10'>
          <div className='max-w-7xl mx-auto'>
            {/* Breadcrumb Navigation */}
            <div className='flex items-center mb-4'>
              <Button
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate('/business-dashboard')}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  borderColor: darkMode ? '#6b7280' : '#d1d5db',
                  color: darkMode ? '#e5e7eb' : '#6b7280',
                  marginRight: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#4b5563' : '#f9fafb'
                  e.target.style.borderColor = darkMode ? '#4b5563' : '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#374151' : '#ffffff'
                  e.target.style.borderColor = darkMode ? '#6b7280' : '#d1d5db'
                }}
              >
                Back to Dashboard
              </Button>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Business Dashboard / Settings / Lookup Profiles
              </div>
            </div>

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
                  <Button key='create' type='primary' icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleAdd}>
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

        {/* Add/Edit Modal */}
        <Modal
          title={
            <span className='text-white font-semibold text-lg'>
              {editingProfile ? `Edit Lookup Profile - ${editingProfile.profileKey}` : 'New Lookup Profile'}
            </span>
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            setEditingProfile(null)
            form.resetFields()
            setLabelValuePairs([{ label: '', value: '' }])
          }}
          footer={null}
          width={700}
          styles={{
            content: {
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '12px',
              border: `2px solid ${darkMode ? '#059669' : '#10b981'}`
            },
            header: {
              backgroundColor: darkMode ? '#059669' : '#10b981',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '20px 24px'
            }
          }}
          className={darkMode ? 'dark-modal' : ''}
        >
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg mb-4`}>
            <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ isActive: true }}>
              {/* Active Toggle */}
              <div className='mb-6'>
                <Form.Item name='isActive' valuePropName='checked'>
                  <div className='flex items-center'>
                    <Switch
                      defaultChecked={true}
                      className='mr-3'
                      style={{
                        backgroundColor: darkMode ? '#059669' : '#10b981'
                      }}
                    />
                    <span className={`text-base font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      Active
                    </span>
                  </div>
                </Form.Item>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='profileKey'
                    label={
                      <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                        Profile Key
                      </span>
                    }
                    rules={[{ required: true, message: 'Please enter a profile key' }]}
                  >
                    <Input
                      placeholder='Provide a unique Profile Key'
                      className={darkMode ? 'dark-input' : 'light-input'}
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        borderColor: darkMode ? '#10b981' : '#10b981',
                        color: darkMode ? '#ffffff' : '#111827',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='groupName'
                    label={
                      <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                        Group Name (optional)
                      </span>
                    }
                  >
                    <Input
                      placeholder='Used to group Profiles'
                      className={darkMode ? 'dark-input' : 'light-input'}
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        borderColor: darkMode ? '#10b981' : '#10b981',
                        color: darkMode ? '#ffffff' : '#111827',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name='solutions'
                label={
                  <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                    Solution(s) (optional)
                  </span>
                }
              >
                <Select
                  mode='multiple'
                  placeholder='Used to link solutions'
                  className={darkMode ? 'dark-select' : 'light-select'}
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#111827',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  dropdownStyle={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff'
                  }}
                  options={[
                    { label: 'Solution A', value: 'solution-a' },
                    { label: 'Solution B', value: 'solution-b' },
                    { label: 'Solution C', value: 'solution-c' }
                  ]}
                />
              </Form.Item>

              {/* Label-Value Pairs Section */}
              <div
                className={`mt-6 p-4 rounded-lg border-2 ${
                  darkMode ? 'bg-gray-700 border-emerald-600' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className='flex items-center justify-between mb-4'>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                    Label-Value Pairs
                  </h4>
                  <Button
                    type='primary'
                    size='small'
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={addLabelValuePair}
                    className={`font-medium ${
                      darkMode
                        ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600'
                        : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500'
                    }`}
                  >
                    Add Pair
                  </Button>
                </div>

                <div className='space-y-3'>
                  <Row gutter={8} className='mb-3'>
                    <Col span={10}>
                      <div
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          darkMode ? 'text-emerald-200' : 'text-emerald-700'
                        }`}
                      >
                        Label
                      </div>
                    </Col>
                    <Col span={10}>
                      <div
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          darkMode ? 'text-emerald-200' : 'text-emerald-700'
                        }`}
                      >
                        Value
                      </div>
                    </Col>
                    <Col span={4}>
                      <div
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          darkMode ? 'text-emerald-200' : 'text-emerald-700'
                        }`}
                      >
                        Actions
                      </div>
                    </Col>
                  </Row>

                  {labelValuePairs.map((pair, index) => (
                    <Row key={index} gutter={8} align='middle' className='mb-2'>
                      <Col span={10}>
                        <Input
                          placeholder='Provide a Label'
                          value={pair.label}
                          onChange={(e) => handleLabelValueChange(index, 'label', e.target.value)}
                          className={darkMode ? 'dark-input' : 'light-input'}
                          style={{
                            backgroundColor: darkMode ? '#374151' : '#ffffff',
                            borderColor: darkMode ? '#10b981' : '#10b981',
                            color: darkMode ? '#ffffff' : '#111827',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        />
                      </Col>
                      <Col span={10}>
                        <Input
                          placeholder='Provide a Value'
                          value={pair.value}
                          onChange={(e) => handleLabelValueChange(index, 'value', e.target.value)}
                          className={darkMode ? 'dark-input' : 'light-input'}
                          style={{
                            backgroundColor: darkMode ? '#374151' : '#ffffff',
                            borderColor: darkMode ? '#10b981' : '#10b981',
                            color: darkMode ? '#ffffff' : '#111827',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        />
                      </Col>
                      <Col span={4}>
                        {labelValuePairs.length > 1 && (
                          <Button
                            type='text'
                            size='small'
                            danger
                            icon={<FontAwesomeIcon icon={faTimes} />}
                            onClick={() => removeLabelValuePair(index)}
                            className={`${
                              darkMode
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                          />
                        )}
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>

              <div className='flex justify-end space-x-3 mt-8'>
                <Button
                  onClick={() => {
                    setIsModalVisible(false)
                    setEditingProfile(null)
                    form.resetFields()
                    setLabelValuePairs([{ label: '', value: '' }])
                  }}
                  disabled={modalLoading}
                  className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700'
                      : 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                  }`}
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={modalLoading}
                  className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500'
                  }`}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </>
  )
})

Lookups.displayName = 'Lookups'

export default Lookups
