// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Form, Input, Select, Row, Col, Space } from 'antd'
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

const { TextArea } = Input
const { Option } = Select

/**
 * Shared Organization Profile Form Component
 * Used by both BusinessSetupModal and OrgSettings to avoid duplication
 * Updated to match organizations table schema exactly
 */
const OrganizationProfileForm = ({
  // Configuration props
  fieldNameFormat = 'camelCase', // Default to camelCase to match data transformation
  showSections = {
    organizationProfile: true,
    workArrangement: true,
    regionalPreferences: true,
    industryTags: true,
    timezone: false // Only shown in BusinessSetupModal
  },

  // Styling props
  darkMode = false,
  dropdownClassName = '',
  formClassName = '',

  // Layout props
  layout = 'vertical',
  cardWrapper = false, // Whether to wrap sections in cards

  // Options (can be overridden)
  customOptions = {}
}) => {
  // Field name helper
  const getFieldName = (camelName, snakeName) => {
    return fieldNameFormat === 'snake_case' ? snakeName : camelName
  }

  // Default options
  const workArrangementOptions = customOptions.workArrangementOptions || [
    { value: 'remote', label: 'Remote', icon: faHome, description: 'Fully remote work' },
    { value: 'hybrid', label: 'Hybrid', icon: faUsers, description: 'Mix of remote and office work' },
    { value: 'onsite', label: 'On-site', icon: faBuilding, description: 'Primarily office-based work' }
  ]

  const currencyOptions = customOptions.currencyOptions || [
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'JPY',
    'CHF',
    'SEK',
    'NOK',
    'DKK'
  ]

  const countryOptions = customOptions.countryOptions || [
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

  const languageOptions = customOptions.languageOptions || [
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

  const employeeRangeOptions = customOptions.employeeRangeOptions || [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5000+'
  ]

  const industryOptions = customOptions.industryOptions || [
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

  const commonIndustryTags = customOptions.commonIndustryTags || [
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

  const timezoneOptions = customOptions.timezoneOptions || [
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

  // Section wrapper component
  const SectionWrapper = ({ children, title, icon, ...props }) => {
    if (cardWrapper) {
      return (
        <div className='mb-8'>
          <div className='flex items-center space-x-2 mb-4'>
            <FontAwesomeIcon icon={icon} className='text-emerald-600' />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          </div>
          {children}
        </div>
      )
    }
    return children
  }

  return (
    <div className={`space-y-6 ${formClassName}`}>
      {/* Organization Profile Section */}
      {showSections.organizationProfile && (
        <SectionWrapper title='Organization Profile' icon={faBuilding}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Organization Name</span>}
                name={getFieldName('organizationName', 'organization_name')}
                rules={[
                  { required: true, message: 'Please enter your organization name' },
                  { min: 2, message: 'Organization name must be at least 2 characters' }
                ]}
              >
                <Input placeholder='e.g. TechCorp Solutions' autoFocus />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span className={darkMode ? 'text-gray-300' : ''}>Industry</span>} name='industry'>
                <Select placeholder='Select industry' dropdownClassName={dropdownClassName}>
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
                name={getFieldName('foundedYear', 'founded_year')}
              >
                <Input type='number' placeholder='2020' />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Employee Range</span>}
                name={getFieldName('employeeRange', 'employee_range')}
              >
                <Select placeholder='Select range' dropdownClassName={dropdownClassName}>
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
        </SectionWrapper>
      )}

      {/* Work Arrangement Section */}
      {showSections.workArrangement && (
        <SectionWrapper title='Default Work Arrangement' icon={faBriefcase}>
          <Form.Item
            label={<span className={darkMode ? 'text-gray-300' : ''}>Default Work Arrangement</span>}
            name={getFieldName('defaultWorkArrangement', 'default_work_arrangement')}
            extra='This will be the default setting for new job postings'
          >
            <Select
              placeholder='Select default work arrangement'
              size='large'
              dropdownClassName={`${dropdownClassName} work-arrangement-dropdown`}
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
        </SectionWrapper>
      )}

      {/* Regional Preferences Section */}
      {showSections.regionalPreferences && (
        <SectionWrapper title='Regional Preferences' icon={faGlobe}>
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
                <Select placeholder='Select currency' dropdownClassName={dropdownClassName}>
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
                <Select placeholder='Select country' dropdownClassName={dropdownClassName}>
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
                <Select placeholder='Select language' dropdownClassName={dropdownClassName}>
                  {languageOptions.map((language) => (
                    <Option key={language} value={language}>
                      {language}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {showSections.timezone && (
            <Form.Item label={<span className={darkMode ? 'text-gray-300' : ''}>Timezone</span>} name='timezone'>
              <Select placeholder='Select timezone' dropdownClassName={dropdownClassName}>
                {timezoneOptions.map((timezone) => (
                  <Option key={timezone} value={timezone}>
                    {timezone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </SectionWrapper>
      )}

      {/* Industry Tags & Classifications Section */}
      {showSections.industryTags && (
        <SectionWrapper title='Industry Tags & Classifications' icon={faTags}>
          <Form.Item
            label={<span className={darkMode ? 'text-gray-300' : ''}>Industry Tags</span>}
            name={getFieldName('industryTags', 'industry_tags')}
            extra='Select or add tags that describe your industry focus areas'
          >
            <Select
              mode='tags'
              placeholder='Add industry tags'
              style={{ width: '100%' }}
              tokenSeparators={[',']}
              dropdownClassName={dropdownClassName}
              options={commonIndustryTags.map((tag) => ({ value: tag, label: tag }))}
            />
          </Form.Item>

          <Form.Item
            label={<span className={darkMode ? 'text-gray-300' : ''}>Custom Classifications</span>}
            name={getFieldName('customClassifications', 'custom_classifications')}
            extra='Add custom tags that uniquely describe your organization'
          >
            <Select
              mode='tags'
              placeholder='Add custom classifications'
              dropdownClassName={dropdownClassName}
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>
        </SectionWrapper>
      )}
    </div>
  )
}

export default OrganizationProfileForm
