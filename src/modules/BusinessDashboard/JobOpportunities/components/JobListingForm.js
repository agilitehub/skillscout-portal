// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Form, message, Row, Col } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { createJobListing } from '../utils/listing-controller'

// Import enhanced form field components
import FormInput from '../../../../core/components/form-components/form-fields/FormInput'
import FormTextArea from '../../../../core/components/form-components/form-fields/FormTextArea'

/**
 * CreateJobListing page for creating engaging job listings
 */
const CreateJobListing = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const state = useLocation().state

  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)
        await createJobListing(values)
        message.success('Job listing created successfully')
        navigate('/business-dashboard')
      } catch (error) {
        message.error('Failed to create job listing')
        console.error('Error creating job listing:', error)
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const handleGoBack = useCallback(() => {
    navigate('/business-dashboard')
  }, [navigate])

  return (
    <div className='flex h-screen bg-gray-100'>
      <BusinessSidebar />
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {/* Header */}
        <div
          className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} px-6 py-4 ml-64`}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Job Listing</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a professional job listing</p>
            </div>
          </div>
        </div>

        {/* Dark Mode Styles */}
        {darkMode && (
          <style jsx global>{`
            /* Form Labels */
            .dark-form .ant-form-item-label > label {
              color: #e5e7eb !important;
            }
            .dark-form .ant-form-item-extra {
              color: #9ca3af !important;
            }

            /* Form Inputs */
            .dark-form .ant-input,
            .dark-form .ant-select-selector,
            .dark-form .ant-input-number,
            .dark-form .ant-picker,
            .dark-form textarea.ant-input {
              background-color: #374151 !important;
              border-color: #4b5563 !important;
              color: #e5e7eb !important;
            }

            /* Input Focus States */
            .dark-form .ant-input:focus,
            .dark-form .ant-select-focused .ant-select-selector,
            .dark-form .ant-input-number:focus,
            .dark-form .ant-picker-focused {
              border-color: #059669 !important;
              box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            }

            /* Placeholders */
            .dark-form .ant-input::placeholder,
            .dark-form .ant-select-selection-placeholder {
              color: #9ca3af !important;
            }

            /* Select Dropdown */
            .ant-select-dropdown {
              background-color: #374151 !important;
            }
            .ant-select-item {
              color: #e5e7eb !important;
            }
            .ant-select-item:hover {
              background-color: #4b5563 !important;
            }
            .ant-select-item-option-selected {
              background-color: #059669 !important;
              color: #ffffff !important;
            }
          `}</style>
        )}

        <div className='flex-1 overflow-auto p-6 ml-64'>
          <Card className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleFormSubmit}
              className={`${darkMode ? 'dark-form' : ''}`}
              initialValues={state?.jobData}
            >
              {/* Job Title and Source */}
              <Row gutter={24}>
                <Col span={16}>
                  <FormInput
                    label='Job Title'
                    name='title'
                    placeholder='e.g. Marketing Manager'
                    rules={[{ required: true, message: 'Please enter job title' }]}
                    customStyle={{
                      fontWeight: '500'
                    }}
                  />
                </Col>
                <Col span={8}>
                  <FormInput
                    label='Source'
                    name='source'
                    placeholder='e.g. Indeed'
                    rules={[{ required: true, message: 'Please enter source' }]}
                    customStyle={{
                      fontWeight: '500'
                    }}
                  />
                </Col>
              </Row>

              {/* Role Overview */}
              <FormTextArea
                label='Role Overview'
                name='overview'
                placeholder='Brief overview of the role and its main purpose'
                rows={3}
                rules={[{ required: true, message: 'Please enter role overview' }]}
                customStyle={{
                  fontWeight: '500'
                }}
              />

              {/* Key Duties */}
              <FormTextArea
                label='Key Duties'
                name='duties'
                placeholder={`• Communicate with senior management on marketing strategies
• Organize events like trade shows & oversee logistics
• Coordinate content creation and campaign optimization
• Manage budgets and improve campaign ROI`}
                rows={6}
                rules={[{ required: true, message: 'Please enter key duties' }]}
                formItemProps={{
                  extra: 'Enter each duty on a new line. They will be displayed as bullet points.'
                }}
                customStyle={{
                  fontWeight: '500'
                }}
              />

              {/* Qualifications */}
              <FormTextArea
                label='Qualifications'
                name='qualifications'
                placeholder={`• Strong communication & decision-making
• Familiarity with marketing software tools
• Attention to detail and analytical mindset
• Bachelor's degree (MBA preferred) with several years of marketing experience`}
                rows={6}
                rules={[{ required: true, message: 'Please enter qualifications' }]}
                formItemProps={{
                  extra: 'Enter each qualification on a new line. They will be displayed as bullet points.'
                }}
                customStyle={{
                  fontWeight: '500'
                }}
              />

              {/* Additional Details */}
              <Row gutter={24}>
                <Col span={12}>
                  <FormInput
                    label='Company'
                    name='company'
                    placeholder='Company name'
                    rules={[{ required: true, message: 'Please enter company name' }]}
                    customStyle={{
                      fontWeight: '500'
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FormInput
                    label='Last Updated'
                    name='lastUpdated'
                    placeholder='e.g. June 24, 2025'
                    rules={[{ required: true, message: 'Please enter last updated date' }]}
                    customStyle={{
                      fontWeight: '500'
                    }}
                  />
                </Col>
              </Row>

              {/* Form Actions */}
              <div className='flex justify-end space-x-4 mt-6'>
                <Button icon={<FontAwesomeIcon icon={faTimes} />} onClick={handleGoBack} size='large'>
                  Cancel
                </Button>
                <Button
                  type='primary'
                  icon={<FontAwesomeIcon icon={faSave} />}
                  onClick={() => form.submit()}
                  loading={loading}
                  size='large'
                  style={{
                    background: darkMode ? '#059669' : '#10b981',
                    borderColor: darkMode ? '#059669' : '#10b981'
                  }}
                >
                  Create Job Listing
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
})

export default CreateJobListing
