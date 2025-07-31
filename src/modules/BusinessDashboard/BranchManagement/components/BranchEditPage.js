// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, Form, Input, Select, Switch, Row, Col, message, Tag, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faUser,
  faGlobe,
  faClock,
  faUsers,
  faCode,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faSave,
  faUndo,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

const { TextArea } = Input
const { Option } = Select

/**
 * Branch Edit Page
 * Full page component for editing branch details and settings
 */
const BranchEditPage = React.memo(({ user: currentUser }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Get branch data from location state
  const branchToEdit = location.state?.branch
  const isEdit = location.state?.isEdit || false
  const mode = isEdit ? 'edit' : 'add'

  // Timezone options
  const timezoneOptions = useMemo(() => [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ], [])

  // Department options
  const departmentOptions = useMemo(() => [
    'Executive',
    'HR',
    'Finance',
    'IT',
    'Marketing',
    'Sales',
    'Engineering',
    'Product',
    'Design',
    'Customer Support',
    'Operations',
    'Legal',
    'Business Development',
    'Research',
    'Quality Assurance'
  ], [])

  // Country options
  const countryOptions = useMemo(() => [
    'United States',
    'United Kingdom',
    'Canada',
    'Germany',
    'France',
    'Japan',
    'Australia',
    'India',
    'Singapore',
    'Netherlands'
  ], [])

  // Set initial form values
  useEffect(() => {
    if (mode === 'edit' && branchToEdit) {
      form.setFieldsValue({
        name: branchToEdit.name,
        code: branchToEdit.code,
        street: branchToEdit.address.street,
        city: branchToEdit.address.city,
        state: branchToEdit.address.state,
        zipCode: branchToEdit.address.zipCode,
        country: branchToEdit.address.country,
        phone: branchToEdit.phone,
        email: branchToEdit.email,
        manager: branchToEdit.manager,
        status: branchToEdit.status,
        timezone: branchToEdit.timezone,
        description: branchToEdit.description,
        departments: branchToEdit.departments,
        isHeadquarters: branchToEdit.isHeadquarters
      })
    } else {
      form.setFieldsValue({
        status: 'active',
        isHeadquarters: false,
        country: 'United States',
        timezone: 'America/New_York'
      })
    }
  }, [mode, branchToEdit, form])

  // Handle form values change
  const handleValuesChange = useCallback(() => {
    setHasChanges(true)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      const branchData = {
        name: values.name,
        code: values.code.toUpperCase(),
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country
        },
        phone: values.phone,
        email: values.email,
        manager: values.manager,
        status: values.status,
        timezone: values.timezone,
        description: values.description,
        departments: values.departments || [],
        isHeadquarters: values.isHeadquarters || false
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Saving branch:', branchData)
      
      setHasChanges(false)
      message.success(`Branch ${mode === 'add' ? 'created' : 'updated'} successfully!`)
      
      // Navigate back to branch management
      navigate('/business-dashboard/branch-management')
    } catch (error) {
      console.error('Error saving branch:', error)
      message.error('Failed to save branch')
    } finally {
      setLoading(false)
    }
  }, [mode, navigate])

  // Handle reset
  const handleReset = useCallback(() => {
    if (mode === 'edit' && branchToEdit) {
      form.setFieldsValue({
        name: branchToEdit.name,
        code: branchToEdit.code,
        street: branchToEdit.address.street,
        city: branchToEdit.address.city,
        state: branchToEdit.address.state,
        zipCode: branchToEdit.address.zipCode,
        country: branchToEdit.address.country,
        phone: branchToEdit.phone,
        email: branchToEdit.email,
        manager: branchToEdit.manager,
        status: branchToEdit.status,
        timezone: branchToEdit.timezone,
        description: branchToEdit.description,
        departments: branchToEdit.departments,
        isHeadquarters: branchToEdit.isHeadquarters
      })
    } else {
      form.setFieldsValue({
        status: 'active',
        isHeadquarters: false,
        country: 'United States',
        timezone: 'America/New_York'
      })
    }
    setHasChanges(false)
    message.info('Changes have been reset')
  }, [form, mode, branchToEdit])

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?')
      if (!confirmed) return
    }
    navigate('/business-dashboard/branch-management')
  }, [navigate, hasChanges])

  // Generate branch code from name
  const handleNameChange = useCallback((e) => {
    const name = e.target.value
    if (mode === 'add' && name) {
      const code = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 4)
      form.setFieldValue('code', code)
    }
  }, [mode, form])

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
                <h1 className='text-2xl font-bold text-white'>
                  {mode === 'add' ? 'Add New Branch' : `Edit Branch - ${branchToEdit?.name}`}
                </h1>
                <p className='text-emerald-100 text-sm'>
                  {mode === 'add' ? 'Create a new branch location' : 'Update branch details and settings'}
                </p>
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
                disabled={!hasChanges && mode === 'edit'}
                className={`shadow-md hover:shadow-lg transition-all duration-200`}
                style={{
                  backgroundColor: (hasChanges || mode === 'add')
                    ? BRAND_COLORS.emeraldPrimary 
                    : darkMode 
                      ? '#4B5563' 
                      : '#E5E7EB',
                  borderColor: (hasChanges || mode === 'add')
                    ? BRAND_COLORS.emeraldPrimary 
                    : darkMode 
                      ? '#4B5563' 
                      : '#E5E7EB',
                  color: (hasChanges || mode === 'add')
                    ? '#FFFFFF' 
                    : darkMode 
                      ? '#9CA3AF' 
                      : '#6B7280'
                }}
              >
                {mode === 'add' ? 'Create Branch' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-6 space-y-6'>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            className={`${darkMode ? 'branch-edit-form' : ''}`}
          >
            {/* Basic Information */}
            <Card
              title={
                <div className='flex items-center space-x-3'>
                  <FontAwesomeIcon icon={faBuilding} className="text-emerald-600" />
                  <span>Basic Information</span>
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
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Branch Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Please enter branch name' },
                      { min: 2, message: 'Branch name must be at least 2 characters' }
                    ]}
                  >
                    <Input 
                      placeholder="Enter branch name" 
                      onChange={handleNameChange}
                      prefix={<FontAwesomeIcon icon={faBuilding} />}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Branch Code"
                    name="code"
                    rules={[
                      { required: true, message: 'Please enter branch code' },
                      { min: 2, max: 10, message: 'Code must be between 2-10 characters' }
                    ]}
                  >
                    <Input 
                      placeholder="Enter branch code" 
                      style={{ textTransform: 'uppercase' }}
                      prefix={<FontAwesomeIcon icon={faCode} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Manager"
                    name="manager"
                    rules={[{ required: true, message: 'Please enter manager name' }]}
                  >
                    <Input 
                      placeholder="Enter manager name" 
                      prefix={<FontAwesomeIcon icon={faUser} />}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter branch email' },
                      { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                  >
                    <Input 
                      placeholder="Enter branch email" 
                      prefix={<FontAwesomeIcon icon={faEnvelope} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input 
                      placeholder="Enter phone number" 
                      prefix={<FontAwesomeIcon icon={faPhone} />}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Timezone"
                    name="timezone"
                    rules={[{ required: true, message: 'Please select timezone' }]}
                  >
                    <Select 
                      placeholder="Select timezone"
                      dropdownClassName={darkMode ? 'branch-edit-dark-dropdown' : ''}
                    >
                      {timezoneOptions.map(tz => (
                        <Option key={tz.value} value={tz.value}>
                          <Space>
                            <FontAwesomeIcon icon={faClock} />
                            {tz.label}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Address Information */}
            <Card
              title={
                <div className='flex items-center space-x-3'>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-emerald-600" />
                  <span>Address Information</span>
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
              <Form.Item
                label="Street Address"
                name="street"
                rules={[{ required: true, message: 'Please enter street address' }]}
              >
                <Input placeholder="Enter street address" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: 'Please enter city' }]}
                  >
                    <Input placeholder="Enter city" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    label="State/Province"
                    name="state"
                    rules={[{ required: true, message: 'Please enter state/province' }]}
                  >
                    <Input placeholder="Enter state/province" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    label="ZIP/Postal Code"
                    name="zipCode"
                    rules={[{ required: true, message: 'Please enter ZIP/postal code' }]}
                  >
                    <Input placeholder="Enter ZIP/postal code" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Please select country' }]}
              >
                <Select 
                  placeholder="Select country"
                  dropdownClassName={darkMode ? 'branch-edit-dark-dropdown' : ''}
                >
                  {countryOptions.map(country => (
                    <Option key={country} value={country}>
                      <Space>
                        <FontAwesomeIcon icon={faGlobe} />
                        {country}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>

            {/* Additional Settings */}
            <Card
              title={
                <div className='flex items-center space-x-3'>
                  <FontAwesomeIcon icon={faInfoCircle} className="text-emerald-600" />
                  <span>Additional Settings</span>
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
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select status' }]}
                  >
                    <Select 
                      placeholder="Select status"
                      dropdownClassName={darkMode ? 'branch-edit-dark-dropdown' : ''}
                    >
                      <Option value="active">
                        <Space>
                          <FontAwesomeIcon icon={faCheckCircle} style={{ color: SEMANTIC_COLORS.success }} />
                          Active
                        </Space>
                      </Option>
                      <Option value="inactive">
                        <Space>
                          <FontAwesomeIcon icon={faTimesCircle} style={{ color: BRAND_COLORS.mediumGray }} />
                          Inactive
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Departments"
                    name="departments"
                  >
                    <Select 
                      mode="multiple"
                      placeholder="Select departments"
                      dropdownClassName={darkMode ? 'branch-edit-dark-dropdown' : ''}
                    >
                      {departmentOptions.map(dept => (
                        <Option key={dept} value={dept}>
                          <Space>
                            <FontAwesomeIcon icon={faUsers} />
                            {dept}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Description"
                name="description"
                extra="Brief description of the branch's purpose and operations"
              >
                <TextArea
                  rows={4}
                  placeholder="Describe the branch..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item
                name="isHeadquarters"
                valuePropName="checked"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Switch />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Headquarters Branch
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Mark this branch as the organization's headquarters
                    </div>
                  </div>
                </div>
              </Form.Item>
            </Card>
          </Form>
        </div>
      </div>

      {/* Dark mode styles */}
      <style jsx global>{`
        /* Dark Mode Form Styling */
        ${darkMode ? `
          .branch-edit-form .ant-form-item-label > label {
            color: #E5E7EB !important;
          }
          .branch-edit-form .ant-form-item-extra {
            color: #9CA3AF !important;
          }
          .branch-edit-form .ant-input,
          .branch-edit-form input.ant-input,
          .branch-edit-form input[type="text"],
          .branch-edit-form input {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-edit-form .ant-input:focus,
          .branch-edit-form input.ant-input:focus,
          .branch-edit-form input[type="text"]:focus,
          .branch-edit-form input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .branch-edit-form .ant-input::placeholder,
          .branch-edit-form input::placeholder {
            color: #D1D5DB !important;
          }
          .branch-edit-form textarea.ant-input,
          .branch-edit-form textarea {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-edit-form textarea.ant-input:focus,
          .branch-edit-form textarea:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .branch-edit-form textarea.ant-input::placeholder,
          .branch-edit-form textarea::placeholder {
            color: #D1D5DB !important;
          }
          .branch-edit-form .ant-input-show-count-suffix {
            color: #9CA3AF !important;
          }
          .branch-edit-form .ant-select,
          .branch-edit-form .ant-select-selector,
          .branch-edit-form .ant-select-single .ant-select-selector {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-edit-form .ant-select-focused .ant-select-selector,
          .branch-edit-form .ant-select:focus .ant-select-selector {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
          }
          .branch-edit-form .ant-select-selection-placeholder {
            color: #D1D5DB !important;
          }
          .branch-edit-form .ant-select-selection-item {
            color: #F9FAFB !important;
            background-color: transparent !important;
          }
          .branch-edit-form .ant-select-arrow {
            color: #9CA3AF !important;
          }
          .branch-edit-form .ant-select-multiple .ant-select-selection-item {
            background-color: #374151 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .branch-edit-form .ant-select-multiple .ant-select-selection-item-remove {
            color: #9CA3AF !important;
          }
          .branch-edit-form .ant-select-multiple .ant-select-selection-item-remove:hover {
            color: #F9FAFB !important;
          }
          
          /* Form validation messages */
          .branch-edit-form .ant-form-item-explain-error {
            color: #F87171 !important;
          }
          
          /* Character count */
          .branch-edit-form .ant-input-data-count {
            color: #9CA3AF !important;
          }
          
          /* Input prefix icons */
          .branch-edit-form .ant-input-prefix {
            color: #9CA3AF !important;
          }
        ` : ''}

        /* Dark mode dropdown options */
        .branch-edit-dark-dropdown {
          background-color: #374151 !important;
        }
        
        .branch-edit-dark-dropdown .ant-select-item {
          color: #F9FAFB !important;
        }
        
        .branch-edit-dark-dropdown .ant-select-item:hover {
          background-color: #4B5563 !important;
        }
        
        .branch-edit-dark-dropdown .ant-select-item-option-selected {
          background-color: #059669 !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </div>
  )
})

BranchEditPage.displayName = 'BranchEditPage'

export default BranchEditPage 