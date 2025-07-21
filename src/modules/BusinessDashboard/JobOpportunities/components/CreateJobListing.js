// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Button, Form, Input, message, Row, Col } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { createJobListing } from '../utils/listing-controller'

const { TextArea } = Input

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
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Job Title</span>}
                    name='title'
                    rules={[{ required: true, message: 'Please enter job title' }]}
                  >
                    <Input placeholder='e.g. Marketing Manager' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Source</span>}
                    name='source'
                    rules={[{ required: true, message: 'Please enter source' }]}
                  >
                    <Input placeholder='e.g. Indeed' />
                  </Form.Item>
                </Col>
              </Row>

              {/* Role Overview */}
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Role Overview</span>}
                name='overview'
                rules={[{ required: true, message: 'Please enter role overview' }]}
              >
                <TextArea rows={3} placeholder='Brief overview of the role and its main purpose' />
              </Form.Item>

              {/* Key Duties */}
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Key Duties</span>}
                name='duties'
                rules={[{ required: true, message: 'Please enter key duties' }]}
                extra='Enter each duty on a new line. They will be displayed as bullet points.'
              >
                <TextArea
                  rows={6}
                  placeholder='• Communicate with senior management on marketing strategies
• Organize events like trade shows & oversee logistics
• Coordinate content creation and campaign optimization
• Manage budgets and improve campaign ROI'
                />
              </Form.Item>

              {/* Qualifications */}
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Qualifications</span>}
                name='qualifications'
                rules={[{ required: true, message: 'Please enter qualifications' }]}
                extra='Enter each qualification on a new line. They will be displayed as bullet points.'
              >
                <TextArea
                  rows={6}
                  placeholder="• Strong communication & decision-making
• Familiarity with marketing software tools
• Attention to detail and analytical mindset
• Bachelor's degree (MBA preferred) with several years of marketing experience"
                />
              </Form.Item>

              {/* Additional Details */}
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Company</span>}
                    name='company'
                    rules={[{ required: true, message: 'Please enter company name' }]}
                  >
                    <Input placeholder='Company name' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span className={darkMode ? 'text-gray-300' : ''}>Last Updated</span>}
                    name='lastUpdated'
                    rules={[{ required: true, message: 'Please enter last updated date' }]}
                  >
                    <Input placeholder='e.g. June 24, 2025' />
                  </Form.Item>
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
