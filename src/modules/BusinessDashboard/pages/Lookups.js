// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faList,
  faPlus,
  faMinus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faArrowLeft,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Modal, 
  Form, 
  message, 
  Space,
  Popconfirm,
  Tooltip,
  Switch,
  Row,
  Col
} from 'antd'

const { Search } = Input
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

  // Sample profile data - in real app this would come from API
  const [profileData, setProfileData] = useState([
    {
      id: 1,
      profileKey: 'Gender',
      groupName: '',
      solutions: [],
      isActive: true,
      labelValuePairs: [
        { label: 'Male', value: 'gender_1' },
        { label: 'Female', value: 'gender_2' }
      ]
    },
    {
      id: 2,
      profileKey: 'Industry',
      groupName: '',
      solutions: [],
      isActive: true,
      labelValuePairs: [
        { label: 'Technology', value: 'tech' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Education', value: 'education' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Retail', value: 'retail' },
        { label: 'Consulting', value: 'consulting' }
      ]
    },
    {
      id: 3,
      profileKey: 'Role',
      groupName: '',
      solutions: [],
      isActive: true,
      labelValuePairs: [
        { label: 'Software Engineer', value: 'swe' },
        { label: 'Product Manager', value: 'pm' },
        { label: 'Designer', value: 'designer' },
        { label: 'Data Scientist', value: 'ds' },
        { label: 'Sales Manager', value: 'sales' },
        { label: 'Marketing Specialist', value: 'marketing' }
      ]
    }
  ])

  // Get unique group names for filter
  const groupNames = [...new Set(profileData.map(p => p.groupName).filter(Boolean))]

  // Filter data based on search and group
  const filteredData = profileData.filter(profile => {
    const matchesSearch = searchTerm === '' || 
      profile.profileKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGroup = selectedGroup === 'all' || profile.groupName === selectedGroup
    
    return matchesSearch && matchesGroup
  })

  // Handle add new profile
  const handleAdd = useCallback(() => {
    setIsModalVisible(true)
    setEditingProfile(null)
    form.resetFields()
    setLabelValuePairs([{ label: '', value: '' }])
  }, [form])

  // Handle edit existing profile  
  const handleEdit = useCallback((profile) => {
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
    setLabelValuePairs(profile.labelValuePairs && profile.labelValuePairs.length > 0 
      ? profile.labelValuePairs 
      : [{ label: '', value: '' }]
    )
  }, [form])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    try {
      const validPairs = labelValuePairs.filter(pair => pair.label.trim() && pair.value.trim())
      
      if (validPairs.length === 0) {
        message.error('Please add at least one label-value pair')
        return
      }

      const newProfile = {
        ...values,
        id: editingProfile ? editingProfile.id : Date.now(),
        labelValuePairs: validPairs
      }

      setProfileData(prev => 
        editingProfile
          ? prev.map(profile => profile.id === editingProfile.id ? newProfile : profile)
          : [...prev, newProfile]
      )

      message.success(`${editingProfile ? 'Updated' : 'Added'} profile successfully`)
      setIsModalVisible(false)
      setEditingProfile(null)
      form.resetFields()
      setLabelValuePairs([{ label: '', value: '' }])
    } catch (error) {
      message.error('Failed to save profile')
    }
  }, [editingProfile, labelValuePairs, form])

  // Handle delete
  const handleDelete = useCallback((id) => {
    setProfileData(prev => prev.filter(profile => profile.id !== id))
    message.success('Profile deleted successfully')
  }, [])

  // Handle label-value pair changes
  const handleLabelValueChange = useCallback((index, field, value) => {
    setLabelValuePairs(prev => 
      prev.map((pair, i) => 
        i === index ? { ...pair, [field]: value } : pair
      )
    )
  }, [])

  // Add new label-value pair
  const addLabelValuePair = useCallback(() => {
    setLabelValuePairs(prev => [...prev, { label: '', value: '' }])
  }, [])

  // Remove label-value pair
  const removeLabelValuePair = useCallback((index) => {
    if (labelValuePairs.length > 1) {
      setLabelValuePairs(prev => prev.filter((_, i) => i !== index))
    }
  }, [labelValuePairs.length])

  // Group data by categories and calculate stats
  const groupedData = useMemo(() => {
    const groups = {}
    
    filteredData.forEach(profile => {
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
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      width: 100
    },
    {
      title: 'ITEMS',
      dataIndex: 'totalItems',
      key: 'totalItems',
      render: (count) => (
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {count}
        </span>
      ),
      width: 80
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<FontAwesomeIcon icon={faEdit} />}
              onClick={() => {
                // Edit the first profile in the category for now
                if (record.profiles.length > 0) {
                  handleEdit(record.profiles[0])
                }
              }}
              style={{
                backgroundColor: 'transparent',
                borderColor: darkMode ? '#6b7280' : '#d1d5db',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description="This will delete all profiles in this category."
            onConfirm={() => {
              // Delete all profiles in the category
              record.profiles.forEach(profile => handleDelete(profile.id))
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                size="small"
                danger
                icon={<FontAwesomeIcon icon={faTrash} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: 100
    }
  ]

  // Expandable row content
  const expandedRowRender = (record) => {
    // Collect all label-value pairs from all profiles in this category
    const allPairs = []
    record.profiles.forEach(profile => {
      if (profile.labelValuePairs && profile.labelValuePairs.length > 0) {
        allPairs.push(...profile.labelValuePairs)
      }
    })
    
    if (allPairs.length === 0) {
      return (
        <div className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No label-value pairs defined
        </div>
      )
    }

    return (
      <div className="px-4 pb-4">
        <div className={`overflow-hidden rounded-lg border ${
          darkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <table className="min-w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  LABEL
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  VALUE
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
              darkMode ? 'divide-gray-600' : 'divide-gray-200'
            }`}>
              {allPairs.map((pair, index) => (
                <tr key={index}>
                  <td className={`px-4 py-3 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {pair.label}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {pair.value}
                  </td>
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
      {/* Dark Mode Styles */}
      {darkMode && (
        <style jsx global>{`
          .dark-search .ant-input {
            background-color: #4b5563 !important;
            border-color: #6b7280 !important;
            color: #ffffff !important;
          }
          .dark-search .ant-input::placeholder {
            color: #9ca3af !important;
          }
          .dark-search .ant-input-search-button {
            background-color: #6b7280 !important;
            border-color: #6b7280 !important;
          }
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
          /* Dropdown menu styles */
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
            background-color: #ffffff !important;
            border-color: #10b981 !important;
            color: #111827 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          .light-select .ant-select-selection-item {
            background-color: #10b981 !important;
            color: #ffffff !important;
            border-color: #059669 !important;
          }
          .light-select .ant-select-arrow {
            color: #059669 !important;
          }
          .light-select .ant-select-selection-placeholder {
            color: #6b7280 !important;
            opacity: 0.8 !important;
          }
          .dark-table .ant-table-thead > tr > th {
            background-color: #374151 !important;
            color: #ffffff !important;
            border-bottom: 1px solid #4b5563 !important;
          }
          .dark-table .ant-table-tbody > tr > td {
            background-color: #1f2937 !important;
            color: #e5e7eb !important;
            border-bottom: 1px solid #374151 !important;
          }
          .dark-table .ant-table-tbody > tr:hover > td {
            background-color: #374151 !important;
          }
          .dark-modal .ant-modal-content {
            background-color: #1f2937 !important;
          }
          .dark-modal .ant-modal-header {
            background-color: #1f2937 !important;
            border-bottom: 1px solid #374151 !important;
          }
          .dark-modal .ant-modal-title {
            color: #ffffff !important;
          }
          .dark-input.ant-input {
            background-color: #374151 !important;
            border-color: #10b981 !important;
            color: #ffffff !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          .dark-input .ant-input {
            background-color: #374151 !important;
            border-color: #10b981 !important;
            color: #ffffff !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          .dark-input input {
            background-color: #374151 !important;
            border-color: #10b981 !important;
            color: #ffffff !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          .dark-input .ant-input::placeholder {
            color: #d1d5db !important;
            opacity: 0.7 !important;
          }
          .dark-input input::placeholder {
            color: #d1d5db !important;
            opacity: 0.7 !important;
          }
          .dark-input .ant-input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3) !important;
            background-color: #374151 !important;
            color: #ffffff !important;
          }
          .dark-input input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3) !important;
            background-color: #374151 !important;
            color: #ffffff !important;
          }
          .light-input .ant-input {
            background-color: #ffffff !important;
            border-color: #10b981 !important;
            color: #111827 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          .light-input .ant-input::placeholder {
            color: #6b7280 !important;
            opacity: 0.8 !important;
          }
          .light-input .ant-input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
            background-color: #ffffff !important;
            color: #111827 !important;
          }
          
          /* Additional overrides for input text color */
          .dark-input * {
            color: #ffffff !important;
          }
          .dark-input .ant-input-affix-wrapper input {
            color: #ffffff !important;
            background-color: #374151 !important;
          }
          .dark-input .ant-input-affix-wrapper {
            background-color: #374151 !important;
            border-color: #10b981 !important;
          }
          
          /* Force white text in all dark mode inputs */
          .dark-input input[type="text"],
          .dark-input input[type="password"],
          .dark-input input[type="email"],
          .dark-input input,
          .dark-input textarea {
            color: #ffffff !important;
            background-color: #374151 !important;
            border-color: #10b981 !important;
          }
          
          /* Ant Design specific overrides */
          .ant-modal .dark-input .ant-input {
            color: #ffffff !important;
            background-color: #374151 !important;
          }
          
          .ant-modal .dark-input input {
            color: #ffffff !important;
            background-color: #374151 !important;
          }
          
          /* Global dropdown styles for dark mode */
          .ant-select-dropdown {
            background-color: ${darkMode ? '#374151' : '#ffffff'} !important;
          }
          .ant-select-item {
            background-color: ${darkMode ? '#374151' : '#ffffff'} !important;
            color: ${darkMode ? '#ffffff' : '#000000'} !important;
          }
          .ant-select-item:hover {
            background-color: ${darkMode ? '#4b5563' : '#f5f5f5'} !important;
            color: ${darkMode ? '#ffffff' : '#000000'} !important;
          }
          .ant-select-item-option-selected {
            background-color: ${darkMode ? '#059669' : '#e6f7ff'} !important;
            color: ${darkMode ? '#ffffff' : '#1890ff'} !important;
          }
          .ant-select-item-option-active {
            background-color: ${darkMode ? '#4b5563' : '#f5f5f5'} !important;
            color: ${darkMode ? '#ffffff' : '#000000'} !important;
          }
          
          /* Button styling fixes */
          .ant-btn {
            transition: all 0.2s ease !important;
          }
          .ant-btn:focus {
            outline: none !important;
            box-shadow: none !important;
          }
        `}</style>
      )}
      
      <div className={`min-h-screen relative overflow-hidden ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {/* Background Elements */}
      <div className='fixed inset-0 pointer-events-none'>
        {darkMode ? (
          <>
            <div
              className='absolute -top-[10%] -right-[10%] w-1/2 h-1/2 rounded-full blur-3xl'
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}
            />
            <div
              className='absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 rounded-full blur-3xl'
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)' }}
            />
            <div
              className='absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full blur-3xl'
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div className='absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl opacity-80' />
            <div className='absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl opacity-80' />
            <div className='absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-amber-400/30 to-transparent rounded-full blur-3xl opacity-80' />
          </>
        )}
      </div>

      <BusinessSidebar />
      <div className='p-6 ml-64 relative z-10'>
        <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb Navigation */}
          <div className="flex items-center mb-4">
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

          {/* Toolbar */}
          <div 
            className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${
              darkMode ? 'bg-gray-800 border border-gray-700' : ''
            }`}
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
          >
            <div className="flex items-center justify-between">
              {/* Left Side - Title and View Selector */}
              <div className="flex items-center">
                <div className="flex items-center mr-6">
                  <FontAwesomeIcon 
                    icon={faList} 
                    className={`text-lg mr-3 ${
                      darkMode ? 'text-emerald-400' : 'text-white'
                    }`} 
                  />
                  <h1 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-white'
                  }`}>
                    Lookups
                  </h1>
                </div>
                
                <Select
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                  className={`w-48 ${darkMode ? 'dark-select' : ''}`}
                  style={{ 
                    backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)',
                  }}
                  dropdownStyle={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff'
                  }}
                >
                  <Option value="all">All Groups</Option>
                  {groupNames.map(group => (
                    <Option key={group} value={group}>{group}</Option>
                  ))}
                </Select>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAdd}
                  style={{
                    backgroundColor: darkMode ? '#059669' : '#ffffff',
                    borderColor: darkMode ? '#059669' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#059669',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = darkMode ? '#047857' : '#f0fdf4'
                    e.target.style.borderColor = darkMode ? '#047857' : '#059669'
                    e.target.style.color = darkMode ? '#ffffff' : '#047857'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = darkMode ? '#059669' : '#ffffff'
                    e.target.style.borderColor = darkMode ? '#059669' : '#ffffff'
                    e.target.style.color = darkMode ? '#ffffff' : '#059669'
                  }}
                >
                  Create New
                </Button>
                
                <Button
                  icon={<FontAwesomeIcon icon={faFilter} />}
                  style={{
                    backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: darkMode ? '#6b7280' : 'rgba(255, 255, 255, 0.2)',
                    color: darkMode ? '#e5e7eb' : '#ffffff',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = darkMode ? '#374151' : 'rgba(255, 255, 255, 0.2)'
                    e.target.style.borderColor = darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.3)'
                    e.target.style.color = darkMode ? '#ffffff' : '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)'
                    e.target.style.borderColor = darkMode ? '#6b7280' : 'rgba(255, 255, 255, 0.2)'
                    e.target.style.color = darkMode ? '#e5e7eb' : '#ffffff'
                  }}
                >
                  Filter
                </Button>
                
                <Search
                  placeholder="Search lookups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-64 ${darkMode ? 'dark-search' : ''}`}
                  style={{
                    backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)',
                  }}
                  styles={{
                    input: {
                      backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)',
                      borderColor: darkMode ? '#6b7280' : 'rgba(255, 255, 255, 0.2)',
                      color: darkMode ? '#ffffff' : '#ffffff'
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Profile Data Table */}
          <Card 
            className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} shadow-lg`}
            bodyStyle={{ 
              padding: '24px',
              backgroundColor: darkMode ? '#1f2937' : '#ffffff'
            }}
          >
            <Table
              columns={columns}
              dataSource={groupedData}
              rowKey="key"
              expandable={{
                expandedRowRender,
                rowExpandable: (record) => record.totalItems > 0,
                expandRowByClick: false,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.totalItems > 0 ? (
                    <Button
                      type="text"
                      size="small"
                      icon={<FontAwesomeIcon icon={expanded ? faMinus : faPlus} />}
                      onClick={e => onExpand(record, e)}
                      className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    />
                  ) : (
                    <div className="w-6" />
                  )
              }}
              pagination={{
                total: groupedData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} categories`
              }}
              className={darkMode ? 'dark-table' : ''}
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff'
              }}
              components={{
                header: {
                  cell: (props) => (
                    <th 
                      {...props} 
                      style={{
                        ...props.style,
                        backgroundColor: darkMode ? '#374151' : '#f9fafb',
                        color: darkMode ? '#ffffff' : '#374151',
                        borderBottom: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`
                      }}
                    />
                  )
                },
                body: {
                  row: (props) => (
                    <tr 
                      {...props} 
                      style={{
                        ...props.style,
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderBottom: `1px solid ${darkMode ? '#374151' : '#f3f4f6'}`
                      }}
                    />
                  ),
                  cell: (props) => (
                    <td 
                      {...props} 
                      style={{
                        ...props.style,
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        color: darkMode ? '#e5e7eb' : '#374151',
                        borderBottom: `1px solid ${darkMode ? '#374151' : '#f3f4f6'}`
                      }}
                    />
                  )
                }
              }}
            />
          </Card>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-white font-semibold text-lg">
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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ isActive: true }}
          >
            {/* Active Toggle */}
            <div className="mb-6">
              <Form.Item name="isActive" valuePropName="checked">
                <div className="flex items-center">
                  <Switch 
                    defaultChecked={true}
                    className="mr-3"
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
                name="profileKey"
                label={
                  <div className="flex items-center">
                    <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      Profile Key
                    </span>
                    <Tooltip title="Provide a unique Profile Key">
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className={`ml-2 text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                      />
                    </Tooltip>
                  </div>
                }
                rules={[{ required: true, message: 'Please enter a profile key' }]}
              >
                <Input 
                  placeholder="Provide a unique Profile Key"
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
                name="groupName"
                label={
                  <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                    Group Name (optional)
                  </span>
                }
              >
                <Input 
                  placeholder="Used to group Profiles"
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
            name="solutions"
            label={
              <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                Solution(s) (optional)
              </span>
            }
          >
            <Select 
              mode="multiple"
              placeholder="Used to link solutions"
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
          <div className={`mt-6 p-4 rounded-lg border-2 ${
            darkMode ? 'bg-gray-700 border-emerald-600' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-lg font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                Label-Value Pairs
              </h4>
              <Button
                type="primary"
                size="small"
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

            <div className="space-y-3">
              <Row gutter={8} className="mb-3">
                <Col span={10}>
                  <div className={`text-sm font-semibold uppercase tracking-wide ${
                    darkMode ? 'text-emerald-200' : 'text-emerald-700'
                  }`}>
                    Label
                  </div>
                </Col>
                <Col span={10}>
                  <div className={`text-sm font-semibold uppercase tracking-wide ${
                    darkMode ? 'text-emerald-200' : 'text-emerald-700'
                  }`}>
                    Value
                  </div>
                </Col>
                <Col span={4}>
                  <div className={`text-sm font-semibold uppercase tracking-wide ${
                    darkMode ? 'text-emerald-200' : 'text-emerald-700'
                  }`}>
                    Actions
                  </div>
                </Col>
              </Row>

              {labelValuePairs.map((pair, index) => (
                <Row key={index} gutter={8} align="middle" className="mb-2">
                  <Col span={10}>
                    <Input
                      placeholder="Provide a Label"
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
                      placeholder="Provide a Value"
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
                        type="text"
                        size="small"
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

          <div className="flex justify-end space-x-3 mt-8">
            <Button 
              onClick={() => {
                setIsModalVisible(false)
                setEditingProfile(null)
                form.resetFields()
                setLabelValuePairs([{ label: '', value: '' }])
              }}
              className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700' 
                  : 'bg-red-500 text-white hover:bg-red-600 border-red-500'
              }`}
            >
              Cancel
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
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