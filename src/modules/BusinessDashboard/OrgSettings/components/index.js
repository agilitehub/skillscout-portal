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
  message
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
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import AIProfileModal from './AIProfileModal'

const { TextArea } = Input
const { Option } = Select

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
                  className={`shadow-md hover:shadow-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-600 text-white hover:bg-gray-500 border-gray-600'
                      : 'bg-gray-500 text-white hover:bg-gray-400 border-gray-500'
                  }`}
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
                className={`shadow-md hover:shadow-lg transition-all duration-200`}
                style={{
                  backgroundColor: hasChanges ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.mediumGray,
                  borderColor: hasChanges ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.mediumGray
                }}
              >
                Save Changes
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
          >
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
                    label="Industry"
                    name="industry"
                    rules={[{ required: true, message: 'Please select industry' }]}
                  >
                    <Select placeholder="Select industry">
                      {industryOptions.map(industry => (
                        <Option key={industry} value={industry}>
                          {industry}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Website"
                    name="website"
                  >
                    <Input placeholder="https://company.com" />
                  </Form.Item>
                </Col>
                
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
                    <Select placeholder="Select range">
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
                label="Default Work Arrangement for New Job Postings"
                name="defaultWorkArrangement"
              >
                <Select placeholder="Select default work arrangement" size="large">
                  {workArrangementOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={option.icon} />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>

            {/* Preferences Settings */}
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
                    <Select placeholder="Select currency">
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
                    <Select placeholder="Select country">
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
                    <Select placeholder="Select language">
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
                  style={{ width: '100%' }}
                  tokenSeparators={[',']}
                />
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
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} opacity-60`}
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
                  darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50/50'
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
    </div>
  )
})

OrgSettings.displayName = 'OrgSettings'

export default OrgSettings 