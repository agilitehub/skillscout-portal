// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState } from 'react'
import { Modal, Form, Input, Select, Row, Col, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faGlobe,
  faDollarSign,
  faLanguage,
  faBriefcase,
  faHome,
  faUsers,
  faTags,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { useTheme } from '../../../../core/context/ThemeContext'

const { TextArea } = Input
const { Option } = Select

/**
 * Business Dashboard Setup Modal Component
 * Handles the initial setup for business dashboard access
 */
const BusinessSetupModal = ({ isOpen, onClose, onSubmit, form }) => {
  const { darkMode } = useTheme()
  const [loading, setLoading] = useState(false)

  // Options data
  const workArrangementOptions = [
    { value: 'remote', label: 'Remote', icon: faHome, description: 'Fully remote work' },
    { value: 'hybrid', label: 'Hybrid', icon: faUsers, description: 'Mix of remote and office work' },
    { value: 'onsite', label: 'On-site', icon: faBuilding, description: 'Primarily office-based work' }
  ]

  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']

  const countryOptions = [
    'United States',
    'United Kingdom',
    'Canada',
    'Germany',
    'France',
    'Australia',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Switzerland'
  ]

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Danish'
  ]

  const employeeRangeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+']

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Media',
    'Government',
    'Non-profit',
    'Real Estate',
    'Other'
  ]

  const commonIndustryTags = [
    'Software Development',
    'Cloud Computing',
    'AI/Machine Learning',
    'Data Analytics',
    'Cybersecurity',
    'Mobile Development',
    'Web Development',
    'DevOps',
    'SaaS',
    'E-commerce',
    'Fintech',
    'Healthcare Tech',
    'EdTech',
    'PropTech'
  ]

  const timezoneOptions = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Amsterdam',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney'
  ]

  // Handle form submission with loading state
  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setLoading(false)
    }
  }

  // Handle close with loading reset
  const handleClose = () => {
    setLoading(false)
    onClose()
  }

  return (
    <>
      {/* Business Setup Modal */}
      <Modal
        title={
          <div className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faBuilding} style={{ color: darkMode ? '#10b981' : '#059669' }} />
            <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>Organization Profile Setup</span>
          </div>
        }
        open={isOpen}
        onCancel={handleClose}
        closable={false}
        maskClosable={false}
        footer={null}
        width='90%'
        style={{ maxWidth: '1200px', height: '90vh' }}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          },
          body: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            height: 'calc(90vh - 120px)',
            padding: '24px'
          },
          header: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderBottom: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
          },
          mask: {
            backgroundColor: '#000',
            opacity: 0.6
          }
        }}
      >
        {/* Dark Mode Form Styling */}
        {darkMode && (
          <style>
            {`
               .business-setup-form .ant-form-item-label > label {
                 color: #E5E7EB !important;
               }
               .business-setup-form .ant-form-item-extra {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-input,
               .business-setup-form input.ant-input,
               .business-setup-form input[type="text"],
               .business-setup-form input[type="number"],
               .business-setup-form input {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-input:focus,
               .business-setup-form input.ant-input:focus,
               .business-setup-form input[type="text"]:focus,
               .business-setup-form input[type="number"]:focus,
               .business-setup-form input:focus {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                 background-color: #4B5563 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-input::placeholder,
               .business-setup-form input::placeholder {
                 color: #D1D5DB !important;
               }
               .business-setup-form textarea.ant-input,
               .business-setup-form textarea {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form textarea.ant-input:focus,
               .business-setup-form textarea:focus {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                 background-color: #4B5563 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form textarea.ant-input::placeholder,
               .business-setup-form textarea::placeholder {
                 color: #D1D5DB !important;
               }
               .business-setup-form .ant-input-show-count-suffix {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-select,
               .business-setup-form .ant-select-selector,
               .business-setup-form .ant-select-single .ant-select-selector {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-select-focused .ant-select-selector,
               .business-setup-form .ant-select:focus .ant-select-selector {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                 background-color: #4B5563 !important;
               }
               .business-setup-form .ant-select-selection-placeholder {
                 color: #D1D5DB !important;
               }
               .business-setup-form .ant-select-selection-item {
                 color: #F9FAFB !important;
                 background-color: transparent !important;
               }
               .business-setup-form .ant-select-arrow {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-select-multiple .ant-select-selection-item {
                 background-color: #374151 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-select-multiple .ant-select-selection-item-remove {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-select-multiple .ant-select-selection-item-remove:hover {
                 color: #F9FAFB !important;
               }
               
               /* Dark mode dropdown options */
               .business-setup-dark-dropdown {
                 background-color: #374151 !important;
               }
               
               .business-setup-dark-dropdown .ant-select-item {
                 color: #F9FAFB !important;
               }
               
               .business-setup-dark-dropdown .ant-select-item:hover {
                 background-color: #4B5563 !important;
               }
               
               .business-setup-dark-dropdown .ant-select-item-option-selected {
                 background-color: #059669 !important;
                 color: #FFFFFF !important;
               }
               
               /* Work arrangement dropdown specific styles */
               .work-arrangement-dropdown .ant-select-item {
                 min-height: 60px !important;
                 padding: 8px 12px !important;
                 line-height: 1.4 !important;
               }
               
               .work-arrangement-dropdown.business-setup-dark-dropdown .ant-select-item {
                 background-color: #374151 !important;
                 color: #F9FAFB !important;
               }
               
               .work-arrangement-dropdown:not(.business-setup-dark-dropdown) .ant-select-item {
                 background-color: #FFFFFF !important;
                 color: #374151 !important;
               }
               
               .work-arrangement-dropdown .ant-select-item:hover {
                 background-color: #4B5563 !important;
               }
               
               .work-arrangement-dropdown .ant-select-item-option-selected {
                 background-color: #10B981 !important;
                 color: #FFFFFF !important;
               }
             `}
          </style>
        )}

        <div className='h-full flex flex-col'>
          {/* Header Info */}
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            <p className='mb-3'>
              Please provide your organization information to set up your Business Dashboard. This helps us customize
              your experience and organize your business data.
            </p>
            <div
              className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}
            >
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-0`}>
                <strong>Note:</strong> All fields are optional except for the organization name. You can always update
                this information later.
              </p>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className='flex-1 overflow-y-auto pr-2'>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              className={`${darkMode ? 'business-setup-form' : ''}`}
            >
              {/* Organization Profile Section */}
              <div className='mb-8'>
                <div className='flex items-center space-x-2 mb-4'>
                  <FontAwesomeIcon icon={faBuilding} className='text-emerald-600' />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Organization Profile
                  </h3>
                </div>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Organization Name</span>}
                      name='organization_name'
                      rules={[
                        { required: true, message: 'Please enter your organization name' },
                        { min: 2, message: 'Organization name must be at least 2 characters' }
                      ]}
                    >
                      <Input placeholder='e.g. TechCorp Solutions' autoFocus />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Industry</span>}
                      name='industry'
                    >
                      <Select
                        placeholder='Select industry'
                        dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                      >
                        {industryOptions.map((industry) => (
                          <Option key={industry} value={industry}>
                            {industry}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Website</span>}
                      name='website'
                      rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                      <Input placeholder='https://company.com' />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Founded Year</span>}
                      name='founded_year'
                      rules={[
                        {
                          type: 'number',
                          min: 1800,
                          max: new Date().getFullYear(),
                          message: 'Please enter a valid year'
                        }
                      ]}
                    >
                      <Input type='number' placeholder='2020' />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      label={<span className={darkMode ? 'text-gray-300' : ''}>Employee Range</span>}
                      name='employee_range'
                    >
                      <Select
                        placeholder='Select range'
                        dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                      >
                        {employeeRangeOptions.map((range) => (
                          <Option key={range} value={range}>
                            {range}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Description</span>}
                  name='description'
                  extra="Brief description of your organization's mission and services"
                >
                  <TextArea rows={3} placeholder='Describe your organization...' showCount maxLength={500} />
                </Form.Item>
              </div>

              {/* Work Arrangement Section */}
              <div className='mb-8'>
                <div className='flex items-center space-x-2 mb-4'>
                  <FontAwesomeIcon icon={faBriefcase} className='text-emerald-600' />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Default Work Arrangement
                  </h3>
                </div>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Default Work Arrangement</span>}
                  name='default_work_arrangement'
                  extra='This will be the default setting for new job postings'
                >
                  <Select
                    placeholder='Select default work arrangement'
                    size='large'
                    dropdownClassName={
                      darkMode ? 'business-setup-dark-dropdown work-arrangement-dropdown' : 'work-arrangement-dropdown'
                    }
                  >
                    {workArrangementOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        <div className='flex items-center space-x-3 py-1'>
                          <FontAwesomeIcon icon={option.icon} className='flex-shrink-0' />
                          <div className='flex-1'>
                            <div className='font-medium text-sm'>{option.label}</div>
                            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Regional Preferences Section */}
              <div className='mb-8'>
                <div className='flex items-center space-x-2 mb-4'>
                  <FontAwesomeIcon icon={faGlobe} className='text-emerald-600' />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Regional Preferences
                  </h3>
                </div>

                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <Space className={darkMode ? 'text-gray-300' : ''}>
                          <FontAwesomeIcon icon={faDollarSign} />
                          <span>Preferred Currency</span>
                        </Space>
                      }
                      name='currency'
                    >
                      <Select
                        placeholder='Select currency'
                        dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                      >
                        {currencyOptions.map((currency) => (
                          <Option key={currency} value={currency}>
                            {currency}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <Space className={darkMode ? 'text-gray-300' : ''}>
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          <span>Primary Country</span>
                        </Space>
                      }
                      name='country'
                    >
                      <Select
                        placeholder='Select country'
                        dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                      >
                        {countryOptions.map((country) => (
                          <Option key={country} value={country}>
                            {country}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <Space className={darkMode ? 'text-gray-300' : ''}>
                          <FontAwesomeIcon icon={faLanguage} />
                          <span>Primary Language</span>
                        </Space>
                      }
                      name='language'
                    >
                      <Select
                        placeholder='Select language'
                        dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                      >
                        {languageOptions.map((language) => (
                          <Option key={language} value={language}>
                            {language}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={<span className={darkMode ? 'text-gray-300' : ''}>Timezone</span>} name='timezone'>
                  <Select
                    placeholder='Select timezone'
                    dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                  >
                    {timezoneOptions.map((timezone) => (
                      <Option key={timezone} value={timezone}>
                        {timezone}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Industry Tags & Classifications Section */}
              <div className='mb-8'>
                <div className='flex items-center space-x-2 mb-4'>
                  <FontAwesomeIcon icon={faTags} className='text-emerald-600' />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Industry Tags & Classifications
                  </h3>
                </div>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Industry Tags</span>}
                  name='industry_tags'
                  extra='Select or add tags that describe your industry focus areas'
                >
                  <Select
                    mode='tags'
                    placeholder='Add industry tags'
                    style={{ width: '100%' }}
                    tokenSeparators={[',']}
                    dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                    options={commonIndustryTags.map((tag) => ({ value: tag, label: tag }))}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={darkMode ? 'text-gray-300' : ''}>Custom Classifications</span>}
                  name='custom_classifications'
                  extra='Add custom tags that uniquely describe your organization'
                >
                  <Select
                    mode='tags'
                    placeholder='Add custom classifications'
                    dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                    style={{ width: '100%' }}
                    tokenSeparators={[',']}
                  />
                </Form.Item>
              </div>
            </Form>
          </div>

          {/* Footer Actions */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600 mt-6'>
            <Button
              onClick={handleClose}
              disabled={loading}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : ''}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              onClick={() => form.submit()}
              loading={loading}
              style={{
                backgroundColor: darkMode ? '#059669' : '#10b981',
                borderColor: darkMode ? '#059669' : '#10b981'
              }}
            >
              Setup Organization Profile
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BusinessSetupModal
