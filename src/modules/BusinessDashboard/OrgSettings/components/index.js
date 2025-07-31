// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  Alert,
  message,
  Tabs
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faRobot,
  faGlobe,
  faDollarSign,
  faLanguage,
  faBriefcase,
  faHome,
  faUsers,
  faTags,
  faFileAlt,
  faSave,
  faUndo,
  faMapMarkerAlt,
  faCog,
  faIndustry
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import AIProfileModal from './AIProfileModal'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

/**
 * Organization Settings Page
 * Manages company-wide settings, preferences, and configurations
 */
const OrgSettings = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [aiModalVisible, setAiModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Mock organization data - in real app this would come from API
  const [orgSettings, setOrgSettings] = useState({
    // Organization Profile
    organizationName: 'TechCorp Solutions',
    industry: 'Technology',
    description: 'We are a leading technology company focused on innovative software solutions that help businesses transform digitally.',
    website: 'https://techcorp.com',
    foundedYear: '2020',
    employeeRange: '50-200',
    
    // Work Arrangements
    defaultWorkArrangement: 'hybrid',
    
    // Preferences
    currency: 'USD',
    country: 'United States',
    language: 'English',
    timezone: 'America/New_York',
    
    // Industry Tags
    industryTags: ['Software Development', 'Cloud Computing', 'AI/Machine Learning', 'SaaS'],
    customClassifications: ['Startup', 'B2B', 'Enterprise Solutions'],
    
    // AI Profile settings
    aiProfileEnabled: true,
    lastAiUpdate: '2024-01-15T10:30:00Z'
  })

  // Options data
  const workArrangementOptions = [
    { value: 'remote', label: 'Remote', icon: faHome, description: 'Fully remote work' },
    { value: 'hybrid', label: 'Hybrid', icon: faUsers, description: 'Mix of remote and office work' },
    { value: 'office', label: 'Office-bound', icon: faBuilding, description: 'Primarily office-based work' }
  ]

  const currencyOptions = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
  ]

  const countryOptions = [
    'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 
    'Australia', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland'
  ]

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Dutch', 'Swedish', 'Norwegian', 'Danish'
  ]

  const employeeRangeOptions = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'
  ]

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Media', 'Government', 'Non-profit', 'Real Estate', 'Other'
  ]

  const commonIndustryTags = [
    'Software Development', 'Cloud Computing', 'AI/Machine Learning', 'Data Analytics',
    'Cybersecurity', 'Mobile Development', 'Web Development', 'DevOps', 'SaaS',
    'E-commerce', 'Fintech', 'Healthcare Tech', 'EdTech', 'PropTech'
  ]

  // Set initial form values
  useEffect(() => {
    form.setFieldsValue(orgSettings)
  }, [orgSettings, form])

  // Handle form values change
  const handleValuesChange = useCallback(() => {
    setHasChanges(true)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrgSettings(prev => ({ ...prev, ...values }))
      setHasChanges(false)
      message.success('Organization settings updated successfully!')
    } catch (error) {
      console.error('Error updating organization settings:', error)
      message.error('Failed to update organization settings')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle reset
  const handleReset = useCallback(() => {
    form.setFieldsValue(orgSettings)
    setHasChanges(false)
    message.info('Changes have been reset')
  }, [form, orgSettings])

  // Handle AI profile interaction
  const handleAiProfileUpdate = useCallback(() => {
    setAiModalVisible(true)
  }, [])

  // Tab change handler
  const handleTabChange = useCallback((key) => {
    setActiveTab(key)
  }, [])

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
                <h1 className='text-2xl font-bold text-white'>Organization Settings</h1>
              </div>
            </div>
            
            <div className='flex space-x-3'>
              {hasChanges && (
                <Button
                  icon={<FontAwesomeIcon icon={faUndo} />}
                  onClick={handleReset}
                  className={`shadow-md hover:shadow-lg transition-all duration-200 org-settings-reset-btn`}
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
                disabled={!hasChanges}
                className={`shadow-md hover:shadow-lg transition-all duration-200 org-settings-save-btn`}
                style={{
                  backgroundColor: hasChanges 
                    ? BRAND_COLORS.emeraldPrimary 
                    : darkMode 
                      ? '#4B5563' 
                      : '#E5E7EB',
                  borderColor: hasChanges 
                    ? BRAND_COLORS.emeraldPrimary 
                    : darkMode 
                      ? '#4B5563' 
                      : '#E5E7EB',
                  color: hasChanges 
                    ? '#FFFFFF' 
                    : darkMode 
                      ? '#9CA3AF' 
                      : '#6B7280'
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-6'>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            className={`${darkMode ? 'org-settings-form' : ''}`}
          >
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              type="card"
              size="large"
              className={`org-settings-tabs ${darkMode ? 'org-settings-tabs-dark' : ''}`}
            >
              {/* General Tab */}
              <TabPane
                tab={
                  <span className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCog} />
                    <span>General</span>
                  </span>
                }
                key="general"
              >
                <div className="space-y-6">
                  {/* Organization Profile Section */}
                  <Card
                    title={
                      <div className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faBuilding} className="text-emerald-600" />
                        <span>Organization Profile</span>
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
                    extra={
                      <div className='flex space-x-2'>
                        <Button
                          type='text'
                          icon={<FontAwesomeIcon icon={faRobot} />}
                          onClick={handleAiProfileUpdate}
                          className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                          title="Re-interact with AI"
                        >
                          AI Update
                        </Button>
                      </div>
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Organization Name"
                          name="organizationName"
                          rules={[{ required: true, message: 'Please enter organization name' }]}
                        >
                          <Input placeholder="Enter organization name" />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Website"
                          name="website"
                        >
                          <Input placeholder="https://company.com" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label="Founded Year"
                          name="foundedYear"
                        >
                          <Input placeholder="2020" />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label="Employee Range"
                          name="employeeRange"
                        >
                          <Select placeholder="Select range" dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}>
                            {employeeRangeOptions.map(range => (
                              <Option key={range} value={range}>
                                {range}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Description"
                      name="description"
                      extra="Brief description of your organization's mission and services"
                    >
                      <TextArea
                        rows={4}
                        placeholder="Describe your organization..."
                        showCount
                        maxLength={1000}
                      />
                    </Form.Item>

                    {orgSettings.aiProfileEnabled && (
                      <Alert
                        message="AI Profile Assistance Available"
                        description={
                          <div>
                            Your organization profile was last updated with AI assistance on{' '}
                            {new Date(orgSettings.lastAiUpdate).toLocaleDateString()}. 
                            Click "AI Update" to refresh your profile with the latest information.
                          </div>
                        }
                        type="info"
                        icon={<FontAwesomeIcon icon={faRobot} />}
                        showIcon
                        className="mt-4"
                      />
                    )}
                  </Card>

                  {/* Work Arrangement Settings */}
                  <Card
                    title={
                      <div className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faBriefcase} className="text-emerald-600" />
                        <span>Default Work Arrangement</span>
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
                      label="Default Work Arrangement"
                      name="defaultWorkArrangement"
                      extra="This will be the default setting for new job postings"
                      style={{ marginBottom: '24px' }}
                    >
                      <Select 
                        placeholder="Select default work arrangement" 
                        size="large" 
                        dropdownClassName={darkMode ? 'org-settings-dark-dropdown work-arrangement-dropdown' : 'work-arrangement-dropdown'}
                      >
                        {workArrangementOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            <div className="flex items-center space-x-3 py-1">
                              <FontAwesomeIcon icon={option.icon} className="flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{option.label}</div>
                                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {option.description}
                                </div>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                                         </Form.Item>
                   </Card>

                   {/* Future Features Preview */}
                   <Card
                     title={
                       <div className='flex items-center space-x-3'>
                         <FontAwesomeIcon icon={faFileAlt} className="text-gray-400" />
                         <span className="text-gray-400">Future Features</span>
                       </div>
                     }
                     className={`${darkMode ? 'bg-gray-800 border-gray-700 future-features-section' : 'bg-white border-gray-200'} opacity-60`}
                     headStyle={{
                       backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                       borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                       color: darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray
                     }}
                     bodyStyle={{
                       backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                       color: darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray
                     }}
                   >
                     <div 
                       className={`p-4 rounded-lg border-2 border-dashed ${
                         darkMode ? 'border-gray-600 bg-gray-700/50 future-features-content' : 'border-gray-300 bg-gray-50/50'
                       }`}
                     >
                       <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                         🚀 Coming Soon
                       </h4>
                       <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                         • <strong>Default Job Description Templates:</strong> Create and manage template settings for consistent job postings<br/>
                         • <strong>Email Templates:</strong> Customize notification and communication templates<br/>
                         • <strong>Integration Settings:</strong> Connect with external HR tools and platforms<br/>
                         • <strong>Compliance Settings:</strong> Configure GDPR, EEOC, and other regulatory requirements
                       </div>
                     </div>
                   </Card>
                 </div>
               </TabPane>

              {/* Regional Preferences Tab */}
              <TabPane
                tab={
                  <span className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>Regional Preferences</span>
                  </span>
                }
                key="regional"
              >
                <Card
                  title={
                    <div className='flex items-center space-x-3'>
                      <FontAwesomeIcon icon={faGlobe} className="text-emerald-600" />
                      <span>Regional Preferences</span>
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
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <Space>
                            <FontAwesomeIcon icon={faDollarSign} />
                            <span>Preferred Currency</span>
                          </Space>
                        }
                        name="currency"
                        rules={[{ required: true, message: 'Please select currency' }]}
                      >
                        <Select placeholder="Select currency" dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}>
                          {currencyOptions.map(currency => (
                            <Option key={currency} value={currency}>
                              {currency}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <Space>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>Primary Country</span>
                          </Space>
                        }
                        name="country"
                        rules={[{ required: true, message: 'Please select country' }]}
                      >
                        <Select placeholder="Select country" dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}>
                          {countryOptions.map(country => (
                            <Option key={country} value={country}>
                              {country}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <Space>
                            <FontAwesomeIcon icon={faLanguage} />
                            <span>Primary Language</span>
                          </Space>
                        }
                        name="language"
                        rules={[{ required: true, message: 'Please select language' }]}
                      >
                        <Select placeholder="Select language" dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}>
                          {languageOptions.map(language => (
                            <Option key={language} value={language}>
                              {language}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              {/* Industry & Classifications Tab */}
              <TabPane
                tab={
                  <span className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faIndustry} />
                    <span>Industry & Classifications</span>
                  </span>
                }
                key="industry"
              >
                <div className="space-y-6">
                  {/* Industry Selection */}
                  <Card
                    title={
                      <div className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faIndustry} className="text-emerald-600" />
                        <span>Industry</span>
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
                      label="Primary Industry"
                      name="industry"
                      rules={[{ required: true, message: 'Please select industry' }]}
                    >
                      <Select placeholder="Select industry" dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}>
                        {industryOptions.map(industry => (
                          <Option key={industry} value={industry}>
                            {industry}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Card>

                  {/* Industry Tags & Classifications */}
                  <Card
                    title={
                      <div className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faTags} className="text-emerald-600" />
                        <span>Industry Tags & Classifications</span>
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
                      label="Industry Tags"
                      name="industryTags"
                      extra="Select or add tags that describe your industry focus areas"
                    >
                      <Select
                        mode="tags"
                        placeholder="Add industry tags"
                        style={{ width: '100%' }}
                        tokenSeparators={[',']}
                        dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}
                        options={commonIndustryTags.map(tag => ({ value: tag, label: tag }))}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Custom Classifications"
                      name="customClassifications"
                      extra="Add custom tags that uniquely describe your organization"
                    >
                      <Select
                        mode="tags"
                        placeholder="Add custom classifications"
                        dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}
                        style={{ width: '100%' }}
                        tokenSeparators={[',']}
                      />
                    </Form.Item>
                  </Card>
                </div>
              </TabPane>
                         </Tabs>
          </Form>
        </div>
      </div>

      {/* AI Profile Modal */}
      <AIProfileModal
        visible={aiModalVisible}
        onCancel={() => setAiModalVisible(false)}
        onSuccess={(updatedProfile) => {
          setOrgSettings(prev => ({ 
            ...prev, 
            ...updatedProfile,
            lastAiUpdate: new Date().toISOString()
          }))
          form.setFieldsValue(updatedProfile)
          setAiModalVisible(false)
          message.success('Organization profile updated with AI assistance!')
        }}
        darkMode={darkMode}
        currentProfile={orgSettings}
      />

      {/* Dark mode styles */}
      <style jsx global>{`
        /* Dark Mode Form Styling */
        ${darkMode ? `
          .org-settings-form .ant-form-item-label > label {
            color: #E5E7EB !important;
          }
          .org-settings-form .ant-form-item-extra {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-input,
          .org-settings-form input.ant-input,
          .org-settings-form input[type="text"],
          .org-settings-form input {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-input:focus,
          .org-settings-form input.ant-input:focus,
          .org-settings-form input[type="text"]:focus,
          .org-settings-form input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-input::placeholder,
          .org-settings-form input::placeholder {
            color: #D1D5DB !important;
          }
          .org-settings-form textarea.ant-input,
          .org-settings-form textarea {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form textarea.ant-input:focus,
          .org-settings-form textarea:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form textarea.ant-input::placeholder,
          .org-settings-form textarea::placeholder {
            color: #D1D5DB !important;
          }
          .org-settings-form .ant-input-show-count-suffix {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-select,
          .org-settings-form .ant-select-selector,
          .org-settings-form .ant-select-single .ant-select-selector {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-select-focused .ant-select-selector,
          .org-settings-form .ant-select:focus .ant-select-selector {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
          }
          .org-settings-form .ant-select-selection-placeholder {
            color: #D1D5DB !important;
          }
          .org-settings-form .ant-select-selection-item {
            color: #F9FAFB !important;
            background-color: transparent !important;
          }
          .org-settings-form .ant-select-arrow {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-select-multiple .ant-select-selection-item {
            background-color: #374151 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-select-multiple .ant-select-selection-item-remove {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-select-multiple .ant-select-selection-item-remove:hover {
            color: #F9FAFB !important;
          }
          
          /* Form validation messages */
          .org-settings-form .ant-form-item-explain-error {
            color: #F87171 !important;
          }
          
          /* Character count */
          .org-settings-form .ant-input-data-count {
            color: #9CA3AF !important;
          }
          
          /* Additional comprehensive styling */
          .org-settings-form .ant-form-item-control-input {
            background-color: transparent !important;
          }
          .org-settings-form .ant-form-item-control-input-content input {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item-control-input-content textarea {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item-control-input-content .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          
          /* Ultimate override for any remaining light elements */
          .org-settings-form .ant-form-item input,
          .org-settings-form .ant-form-item textarea,
          .org-settings-form .ant-form-item .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item .ant-input-affix-wrapper {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item .ant-input-affix-wrapper input {
            background-color: transparent !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-form-item .ant-input-prefix {
            color: #9CA3AF !important;
          }
          
          /* Alert component styling */
          .org-settings-form .ant-alert {
            background-color: #374151 !important;
            border-color: #4B5563 !important;
          }
          
          .org-settings-form .ant-alert-message {
            color: #F9FAFB !important;
          }
          
          .org-settings-form .ant-alert-description {
            color: #D1D5DB !important;
          }
          
          .org-settings-form .ant-alert-icon {
            color: #10B981 !important;
          }
          
          /* Future features section */
          .future-features-section {
            background-color: #374151 !important;
            border-color: #4B5563 !important;
          }
          
          .future-features-content {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }

          /* Tabs styling */
          .org-settings-tabs-dark .ant-tabs-nav {
            background-color: #374151 !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab .ant-tabs-tab-btn {
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab:hover {
            color: #10B981 !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab:hover .ant-tabs-tab-btn {
            color: #10B981 !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab-active {
            background-color: #059669 !important;
            border-color: #059669 !important;
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-content-holder {
            background-color: transparent !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tabpane {
            color: #F9FAFB !important;
          }
        ` : ''}

        ${!darkMode ? `
          /* Light mode tabs styling */
          .org-settings-tabs .ant-tabs-tab-active {
            background-color: #059669 !important;
            border-color: #059669 !important;
          }
          
          .org-settings-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs .ant-tabs-tab:hover {
            color: #059669 !important;
          }
        ` : ''}
        
        /* Dark mode dropdown options */
        .org-settings-dark-dropdown {
          background-color: #374151 !important;
        }
        
        .org-settings-dark-dropdown .ant-select-item {
          color: #F9FAFB !important;
        }
        
        .org-settings-dark-dropdown .ant-select-item:hover {
          background-color: #4B5563 !important;
        }
        
        .org-settings-dark-dropdown .ant-select-item-option-selected {
          background-color: #059669 !important;
          color: #FFFFFF !important;
        }
        
        /* Work arrangement dropdown specific styles */
        .work-arrangement-dropdown .ant-select-item {
          min-height: 60px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }
        
        .work-arrangement-dropdown.org-settings-dark-dropdown .ant-select-item {
          background-color: #374151 !important;
          color: #F9FAFB !important;
        }
        
        .work-arrangement-dropdown:not(.org-settings-dark-dropdown) .ant-select-item {
          background-color: #FFFFFF !important;
          color: #374151 !important;
        }
        
        .work-arrangement-dropdown .ant-select-item:hover {
          background-color: ${darkMode ? '#4B5563' : '#F3F4F6'} !important;
        }
        
        .work-arrangement-dropdown .ant-select-item-option-selected {
          background-color: #10B981 !important;
          color: #FFFFFF !important;
        }
        
        /* Form item styling for proper spacing */
        .ant-form-item {
          margin-bottom: 20px !important;
        }
        
        .ant-form-item-label {
          padding-bottom: 8px !important;
        }
        
        /* Button hover states */
        .ant-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .ant-btn:active {
          transform: translateY(0) !important;
        }
        
        /* Specific button styling for org settings */
        .org-settings-save-btn:hover:not(:disabled) {
          background-color: #059669 !important;
          border-color: #059669 !important;
        }
        
        .org-settings-reset-btn:hover {
          background-color: ${darkMode ? '#4B5563' : '#6B7280'} !important;
          border-color: ${darkMode ? '#4B5563' : '#6B7280'} !important;
        }

        /* Tab content spacing */
        .ant-tabs-tabpane {
          padding-top: 16px !important;
        }
      `}</style>
    </div>
  )
})

OrgSettings.displayName = 'OrgSettings'

export default OrgSettings 