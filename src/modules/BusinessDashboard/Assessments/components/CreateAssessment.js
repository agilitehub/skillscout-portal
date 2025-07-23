// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Form, message, Input, Select, Switch } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { BRAND_COLORS, DARK_THEME } from '../../../../core/theme/colors'
import BusinessSidebar from '../../components/BusinessSidebar'
import { createAssessment } from '../utils/controller'
import { parseTags } from '../utils/data-model'

const { Option } = Select

/**
 * CreateAssessment page for creating new skill assessments
 * Features a streamlined form layout optimized for the new data model
 */
const CreateAssessment = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Handle navigation back to assessments list
  const handleGoBack = useCallback(() => {
    navigate('/business-dashboard/assessments')
  }, [navigate])

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        const processedValues = {
          ...values,
          tags: parseTags(values.tags)
        }

        const result = await createAssessment(processedValues, user)
        if (result.success) {
          message.success('Assessment created successfully!')
          navigate('/business-dashboard/assessments')
        } else {
          console.error('Error creating assessment:', result.error)
          message.error('Failed to create assessment: ' + result.error)
        }
      } catch (error) {
        console.error('Unexpected error creating assessment:', error)
        message.error('An unexpected error occurred while creating the assessment')
      } finally {
        setLoading(false)
      }
    },
    [user, navigate]
  )

  return (
    <>
      <div
        className={`min-h-screen ${
          darkMode
            ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
            : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
        } relative overflow-hidden`}
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

        {/* Dark Mode Form Styling */}
        {darkMode && (
          <style>
            {`
              /* Enhanced Dark Mode Form Styling with Higher Specificity */
              body .dark-form .ant-form-item-label > label,
              .dark-form .ant-form-item-label > label {
                color: #E5E7EB !important;
                font-weight: 500 !important;
              }
              body .dark-form .ant-form-item-extra,
              .dark-form .ant-form-item-extra {
                color: #9CA3AF !important;
              }
              
              /* Input Fields - Multiple selectors for maximum coverage */
              body .dark-form .ant-input,
              body .dark-form input.ant-input,
              body .dark-form input[type="text"],
              body .dark-form input,
              .dark-form .ant-input,
              .dark-form input.ant-input,
              .dark-form input[type="text"],
              .dark-form input {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
                box-shadow: none !important;
              }
              
              body .dark-form .ant-input:focus,
              body .dark-form input.ant-input:focus,
              body .dark-form input[type="text"]:focus,
              body .dark-form input:focus,
              .dark-form .ant-input:focus,
              .dark-form input.ant-input:focus,
              .dark-form input[type="text"]:focus,
              .dark-form input:focus {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                background-color: #4B5563 !important;
                color: #F9FAFB !important;
              }
              
              body .dark-form .ant-input::placeholder,
              body .dark-form input::placeholder,
              .dark-form .ant-input::placeholder,
              .dark-form input::placeholder {
                color: #9CA3AF !important;
                opacity: 1 !important;
              }
              
              /* TextArea Fields */
              body .dark-form textarea.ant-input,
              body .dark-form textarea,
              .dark-form textarea.ant-input,
              .dark-form textarea {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
                box-shadow: none !important;
              }
              
              body .dark-form textarea.ant-input:focus,
              body .dark-form textarea:focus,
              .dark-form textarea.ant-input:focus,
              .dark-form textarea:focus {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                background-color: #4B5563 !important;
                color: #F9FAFB !important;
              }
              
              /* Select Components */
              body .dark-form .ant-select,
              body .dark-form .ant-select-selector,
              body .dark-form .ant-select-single .ant-select-selector,
              .dark-form .ant-select,
              .dark-form .ant-select-selector,
              .dark-form .ant-select-single .ant-select-selector {
                background-color: #4B5563 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
                box-shadow: none !important;
              }
              
              body .dark-form .ant-select-focused .ant-select-selector,
              body .dark-form .ant-select:focus .ant-select-selector,
              .dark-form .ant-select-focused .ant-select-selector,
              .dark-form .ant-select:focus .ant-select-selector {
                border-color: #059669 !important;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                background-color: #4B5563 !important;
              }
              
              body .dark-form .ant-select-selection-placeholder,
              .dark-form .ant-select-selection-placeholder {
                color: #9CA3AF !important;
                opacity: 1 !important;
              }
              
              body .dark-form .ant-select-selection-item,
              .dark-form .ant-select-selection-item {
                color: #F9FAFB !important;
                background-color: transparent !important;
              }
              
              body .dark-form .ant-select-arrow,
              .dark-form .ant-select-arrow {
                color: #9CA3AF !important;
              }
              
              /* Switch Components */
              body .dark-form .ant-switch,
              .dark-form .ant-switch {
                background-color: #6B7280 !important;
              }
              
              body .dark-form .ant-switch-checked,
              .dark-form .ant-switch-checked {
                background-color: #10B981 !important;
              }
              
              body .dark-form .ant-switch-inner,
              .dark-form .ant-switch-inner {
                color: #F9FAFB !important;
              }
              
              /* Tags in Select */
              body .dark-form .ant-select-multiple .ant-select-selection-item,
              .dark-form .ant-select-multiple .ant-select-selection-item {
                background-color: #374151 !important;
                border-color: #6B7280 !important;
                color: #F9FAFB !important;
              }
              
              /* Global Dropdown Styling */
              .ant-select-dropdown {
                background-color: #374151 !important;
                border: 1px solid #4B5563 !important;
              }
              .ant-select-item {
                color: #F9FAFB !important;
                background-color: transparent !important;
              }
              .ant-select-item:hover {
                background-color: #4B5563 !important;
              }
              .ant-select-item-option-selected {
                background-color: #10B981 !important;
                color: #FFFFFF !important;
              }
              .ant-select-item-option-active {
                background-color: #4B5563 !important;
              }
              
              /* Form Item Controls - Ultimate Override */
              body .dark-form .ant-form-item-control-input,
              .dark-form .ant-form-item-control-input {
                background-color: transparent !important;
              }
              
              body .dark-form .ant-form-item-control-input-content input,
              body .dark-form .ant-form-item-control-input-content textarea,
              body .dark-form .ant-form-item-control-input-content .ant-select-selector,
              .dark-form .ant-form-item-control-input-content input,
              .dark-form .ant-form-item-control-input-content textarea,
              .dark-form .ant-form-item-control-input-content .ant-select-selector {
                background-color: #4B5563 !important;
                color: #F9FAFB !important;
                border-color: #6B7280 !important;
              }
              
              /* Validation and Helper Text */
              .ant-form-item-explain-error {
                color: #F87171 !important;
              }
              .ant-input-data-count {
                color: #9CA3AF !important;
              }
            `}
          </style>
        )}

        <div className='ml-64 relative z-10'>
          {/* Breadcrumb Navigation */}
          <div className='p-6 pb-4'>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Business Dashboard / Assessments / Create New
            </div>
          </div>

          {/* Toolbar with Title */}
          <div className='px-6 pb-6'>
            <div
              className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${
                darkMode
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Button
                    icon={<FontAwesomeIcon icon={faArrowLeft} />}
                    onClick={handleGoBack}
                    className={`mr-4 ${
                      darkMode
                        ? 'border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-400'
                        : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                    }`}
                    style={{
                      backgroundColor: darkMode ? '#4B5563' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Back
                  </Button>
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className={`text-lg mr-3 ${darkMode ? 'text-emerald-100' : 'text-white'}`}
                  />
                  <div>
                    <h1 className='text-xl font-bold text-white'>Create New Assessment</h1>
                    <p className='text-emerald-100 text-sm mt-1'>
                      Create a new assessment with title, category, and other details
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <Form
              form={form}
              layout='vertical'
              onFinish={handleFormSubmit}
              className={`${darkMode ? 'dark-form' : ''}`}
              initialValues={{
                status: 'Draft',
                isActive: true
              }}
            >
              <Card
                className={`max-w-5xl mx-auto shadow-xl ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  borderColor: darkMode ? '#4B5563' : '#e5e7eb'
                }}
              >
                <div className='max-w-4xl mx-auto'>
                  <div className='space-y-6'>
                    {/* Active Toggle */}
                    <div className='mb-4'>
                      <Form.Item label='Active' name='isActive' valuePropName='checked'>
                        <Switch defaultChecked={true} className='mr-3' />
                      </Form.Item>
                    </div>

                    {/* Assessment Title */}
                    <Form.Item
                      label='Assessment Title'
                      name='title'
                      rules={[{ required: true, message: 'Please enter an assessment title' }]}
                    >
                      <Input placeholder='Enter assessment title...' style={{ fontWeight: '500' }} />
                    </Form.Item>

                    {/* Status and Category Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <Form.Item
                        label='Status'
                        name='status'
                        rules={[{ required: true, message: 'Please select a status' }]}
                      >
                        <Select placeholder='Select status' style={{ fontWeight: '500' }}>
                          <Option value='Draft'>Draft</Option>
                          <Option value='Active'>Active</Option>
                          <Option value='Inactive'>Inactive</Option>
                          <Option value='Archived'>Archived</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label='Category' name='category'>
                        <Select placeholder='Select category' style={{ fontWeight: '500' }}>
                          <Option value='Technical'>Technical</Option>
                          <Option value='Behavioral'>Behavioral</Option>
                          <Option value='Cognitive'>Cognitive</Option>
                          <Option value='Portfolio'>Portfolio</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    {/* Tags */}
                    <Form.Item label='Tags' name='tags'>
                      <Select
                        mode='tags'
                        placeholder='Add tags (press Enter to add)'
                        className='w-full'
                        style={{ fontWeight: '500' }}
                      />
                    </Form.Item>

                    {/* Action Buttons */}
                    <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600'>
                      <Button
                        variant='danger'
                        onClick={() => {
                          form.resetFields()
                          navigate('/business-dashboard/assessments')
                        }}
                        size='large'
                      >
                        Cancel
                      </Button>
                      <Button variant='success' htmlType='submit' size='large' loading={loading}>
                        Create Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
})

export default CreateAssessment
