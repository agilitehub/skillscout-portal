// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Form, Input, Select, Space, Row, Col, Switch, Tag } from 'antd'
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
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

const { TextArea } = Input
const { Option } = Select

/**
 * Add/Edit Branch Modal Component
 * Handles branch creation and editing with comprehensive form fields
 */
const AddEditBranchModal = React.memo(({ visible, mode, branch, onCancel, onSuccess, darkMode }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Timezone options (sample)
  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ]

  // Department options (sample)
  const departmentOptions = [
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
  ]

  // Country options (sample)
  const countryOptions = [
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
  ]

  // Set initial form values when branch changes
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && branch) {
        form.setFieldsValue({
          name: branch.name,
          code: branch.code,
          street: branch.address.street,
          city: branch.address.city,
          state: branch.address.state,
          zipCode: branch.address.zipCode,
          country: branch.address.country,
          phone: branch.phone,
          email: branch.email,
          manager: branch.manager,
          status: branch.status,
          timezone: branch.timezone,
          description: branch.description,
          departments: branch.departments,
          isHeadquarters: branch.isHeadquarters
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          status: 'active',
          isHeadquarters: false,
          country: 'United States',
          timezone: 'America/New_York'
        })
      }
    }
  }, [visible, mode, branch, form])

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
      
      onSuccess(branchData)
      form.resetFields()
    } catch (error) {
      console.error('Error saving branch:', error)
    } finally {
      setLoading(false)
    }
  }, [form, onSuccess])

  // Handle cancel
  const handleCancel = useCallback(() => {
    form.resetFields()
    onCancel()
  }, [form, onCancel])

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
    <>
      {/* Modal Styles */}
      <style jsx global>{`
        .branch-modal .ant-modal-content {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .branch-modal .ant-modal-header {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          border-bottom: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .branch-modal .ant-modal-close {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal .ant-modal-close:hover {
          color: ${BRAND_COLORS.emeraldLight} !important;
        }
        
        .branch-modal .ant-form-item-label > label {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal .ant-input {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal .ant-input:focus,
        .branch-modal .ant-input-focused {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .branch-modal .ant-select-selector {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal .ant-select-arrow {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
        }
        
        .branch-modal .ant-select-focused .ant-select-selector {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .branch-modal .ant-select-selection-item {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal .ant-select-selection-placeholder {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .branch-modal textarea.ant-input {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .branch-modal textarea.ant-input:focus {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .branch-modal textarea.ant-input::placeholder {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .branch-modal .ant-input-data-count {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .branch-modal .ant-switch {
          background-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.lightGray} !important;
        }
        
        .branch-modal .ant-switch-checked {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
        }
        
        .branch-modal .ant-form-item-extra {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .branch-modal .ant-input::placeholder {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .branch-mgmt-dark-dropdown {
          background-color: ${BRAND_COLORS.darkSlateAlt} !important;
        }
        
        .branch-mgmt-dark-dropdown .ant-select-item {
          color: ${BRAND_COLORS.white} !important;
        }
        
        .branch-mgmt-dark-dropdown .ant-select-item:hover {
          background-color: ${BRAND_COLORS.mediumSlate} !important;
        }
        
        .branch-mgmt-dark-dropdown .ant-select-item-option-selected {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
          color: ${BRAND_COLORS.white} !important;
        }
      `}</style>

      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: BRAND_COLORS.emeraldPrimary }}
            >
              <FontAwesomeIcon icon={faBuilding} className='text-white text-sm' />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              {mode === 'add' ? 'Add New Branch' : 'Edit Branch'}
            </span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={800}
        className="branch-modal"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className={darkMode ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            style={{
              backgroundColor: BRAND_COLORS.emeraldPrimary,
              borderColor: BRAND_COLORS.emeraldPrimary
            }}
          >
            {mode === 'add' ? 'Create Branch' : 'Update Branch'}
          </Button>
        ]}
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={`${darkMode ? 'branch-form' : ''}`}
        >
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Basic Information
            </h3>
            
            <Row gutter={16}>
              <Col xs={24} sm={16}>
                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                      <span>Branch Name</span>
                    </Space>
                  }
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter branch name' },
                    { min: 2, message: 'Branch name must be at least 2 characters' }
                  ]}
                >
                  <Input 
                    placeholder="e.g., New York Office"
                    style={{ fontWeight: '500' }}
                    onChange={handleNameChange}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={8}>
                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faCode} className="text-gray-400" />
                      <span>Branch Code</span>
                    </Space>
                  }
                  name="code"
                  rules={[
                    { required: true, message: 'Please enter branch code' },
                    { max: 10, message: 'Code must be 10 characters or less' }
                  ]}
                >
                  <Input 
                    placeholder="NY"
                    style={{ fontWeight: '500', textTransform: 'uppercase' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Description"
              name="description"
              extra={
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Brief description of this branch's purpose and operations
                </span>
              }
            >
              <TextArea
                placeholder="e.g., Primary headquarters handling executive operations, HR, and finance"
                rows={3}
                style={{ fontWeight: '500' }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Address
            </h3>
            
            <Form.Item
              label={
                <Space>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                  <span>Street Address</span>
                </Space>
              }
              name="street"
              rules={[{ required: true, message: 'Please enter street address' }]}
            >
              <Input 
                placeholder="123 Business Street"
                style={{ fontWeight: '500' }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input 
                    placeholder="New York"
                    style={{ fontWeight: '500' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={8}>
                <Form.Item
                  label="State/Province"
                  name="state"
                  rules={[{ required: true, message: 'Please enter state/province' }]}
                >
                  <Input 
                    placeholder="NY"
                    style={{ fontWeight: '500' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={8}>
                <Form.Item
                  label="ZIP/Postal Code"
                  name="zipCode"
                  rules={[{ required: true, message: 'Please enter ZIP code' }]}
                >
                  <Input 
                    placeholder="10001"
                    style={{ fontWeight: '500' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <Space>
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-400" />
                  <span>Country</span>
                </Space>
              }
              name="country"
              rules={[{ required: true, message: 'Please select country' }]}
            >
                              <Select placeholder="Select country" style={{ fontWeight: '500' }} dropdownClassName={darkMode ? 'branch-mgmt-dark-dropdown' : ''}>
                {countryOptions.map(country => (
                  <Option key={country} value={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact Information
            </h3>
            
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                      <span>Phone Number</span>
                    </Space>
                  }
                  name="phone"
                  rules={[
                    { required: true, message: 'Please enter phone number' }
                  ]}
                >
                  <Input 
                    placeholder="+1 (555) 123-4567"
                    style={{ fontWeight: '500' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <Space>
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                      <span>Email Address</span>
                    </Space>
                  }
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    placeholder="branch@company.com"
                    style={{ fontWeight: '500' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <Space>
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  <span>Branch Manager</span>
                </Space>
              }
              name="manager"
              rules={[{ required: true, message: 'Please enter manager name' }]}
            >
              <Input 
                placeholder="John Smith"
                style={{ fontWeight: '500' }}
              />
            </Form.Item>
          </div>

          {/* Operational Details */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Operational Details
            </h3>
            
            <Form.Item
              label={
                <Space>
                  <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                  <span>Timezone</span>
                </Space>
              }
              name="timezone"
              rules={[{ required: true, message: 'Please select timezone' }]}
            >
                              <Select placeholder="Select timezone" style={{ fontWeight: '500' }} dropdownClassName={darkMode ? 'branch-mgmt-dark-dropdown' : ''}>
                {timezoneOptions.map(tz => (
                  <Option key={tz.value} value={tz.value}>
                    {tz.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                  <span>Departments</span>
                </Space>
              }
              name="departments"
              extra={
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Select the departments that operate from this branch
                </span>
              }
            >
              <Select 
                mode="multiple"
                placeholder="Select departments"
                style={{ fontWeight: '500' }}
                dropdownClassName={darkMode ? 'branch-mgmt-dark-dropdown' : ''}
                tagRender={({ label, closable, onClose }) => (
                  <Tag
                    color={BRAND_COLORS.emeraldPrimary}
                    closable={closable}
                    onClose={onClose}
                    style={{ marginRight: 3, fontWeight: '500' }}
                  >
                    {label}
                  </Tag>
                )}
              >
                {departmentOptions.map(dept => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select style={{ fontWeight: '500' }} dropdownClassName={darkMode ? 'branch-mgmt-dark-dropdown' : ''}>
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
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Headquarters"
                  name="isHeadquarters"
                  valuePropName="checked"
                  extra={
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Mark this branch as the company headquarters
                    </span>
                  }
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </>
  )
})

AddEditBranchModal.displayName = 'AddEditBranchModal'

export default AddEditBranchModal 