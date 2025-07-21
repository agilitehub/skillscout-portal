// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Button, Form, Input, Select, Switch, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faEye, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { createAssessment } from '../utils/controller'
import { parseTags } from '../utils/data-model'

const { TextArea } = Input
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

  // DEBUG: Log to console
  console.log('CreateAssessment component rendering, darkMode:', darkMode)

  // Handle navigation back to assessments list
  const handleGoBack = useCallback(() => {
    navigate('/business-dashboard/assessments')
  }, [navigate])

  // Handle preview
  const handlePreview = useCallback(() => {
    const values = form.getFieldsValue()
    console.log('Preview assessment:', values)
    message.info('Preview functionality would show assessment preview')
  }, [form])

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
        className={`min-h-screen relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
            : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
        }`}
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

        <div className='p-4 ml-64 relative z-10'>
          <div className='max-w-6xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center space-x-4'>
                <Button
                  icon={<FontAwesomeIcon icon={faArrowLeft} />}
                  onClick={handleGoBack}
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    borderColor: darkMode ? '#6b7280' : '#d1d5db',
                    color: darkMode ? '#e5e7eb' : '#6b7280'
                  }}
                >
                  Back to Assessments
                </Button>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Create New Assessment
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create assessment with Question, Context, and Preferred Feedback
                  </p>
                </div>
              </div>
              <div className='flex space-x-3'>
                <Button
                  icon={<FontAwesomeIcon icon={faEye} />}
                  onClick={handlePreview}
                  style={{
                    backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                    borderColor: darkMode ? '#6b7280' : '#d1d5db',
                    color: darkMode ? '#e5e7eb' : '#6b7280'
                  }}
                >
                  Preview
                </Button>
                <Button
                  type='primary'
                  icon={<FontAwesomeIcon icon={faSave} />}
                  onClick={() => form.submit()}
                  loading={loading}
                  style={{
                    backgroundColor: darkMode ? '#059669' : '#10b981',
                    borderColor: darkMode ? '#059669' : '#10b981'
                  }}
                >
                  Create Assessment
                </Button>
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
                className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} shadow-lg`}
                bodyStyle={{
                  padding: '24px',
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff'
                }}
              >
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Left Column */}
                  <div className='space-y-4'>
                    {/* Active Toggle */}
                    <div className='mb-4'>
                      <Form.Item name='isActive' valuePropName='checked'>
                        <div className='flex items-center'>
                          <Switch defaultChecked={true} className='mr-3' />
                          <span
                            className={`text-base font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}
                          >
                            Active
                          </span>
                        </div>
                      </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <Form.Item
                        name='status'
                        label={
                          <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                            Status
                          </span>
                        }
                        rules={[{ required: true, message: 'Please select a status' }]}
                      >
                        <Select placeholder='Select status' className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <Option value='Draft'>Draft</Option>
                          <Option value='Active'>Active</Option>
                          <Option value='Inactive'>Inactive</Option>
                          <Option value='Archived'>Archived</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name='category'
                        label={
                          <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                            Category
                          </span>
                        }
                      >
                        <Select
                          placeholder='Select category'
                          className={`${darkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                          <Option value='Technical'>Technical</Option>
                          <Option value='Behavioral'>Behavioral</Option>
                          <Option value='Cognitive'>Cognitive</Option>
                          <Option value='Portfolio'>Portfolio</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <Form.Item
                      name='question'
                      label={
                        <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                          Question
                        </span>
                      }
                      rules={[{ required: true, message: 'Please enter a question' }]}
                    >
                      <TextArea
                        rows={4}
                        placeholder='Enter the assessment question...'
                        showCount
                        maxLength={1000}
                        className={`${darkMode ? 'text-white placeholder-white' : 'text-gray-900 placeholder-gray-500'}`}
                      />
                    </Form.Item>

                    <Form.Item
                      name='context'
                      label={
                        <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                          Context
                        </span>
                      }
                      rules={[{ required: true, message: 'Please enter the context' }]}
                    >
                      <TextArea
                        rows={4}
                        placeholder='Provide context about what this question assesses...'
                        showCount
                        maxLength={2000}
                        className={`${darkMode ? 'text-white placeholder-white' : 'text-gray-900 placeholder-gray-500'}`}
                      />
                    </Form.Item>
                  </div>

                  {/* Right Column */}
                  <div className='space-y-4'>
                    <Form.Item
                      name='preferredFeedback'
                      label={
                        <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                          Preferred Feedback
                        </span>
                      }
                      rules={[{ required: true, message: 'Please enter preferred feedback guidelines' }]}
                    >
                      <TextArea
                        rows={8}
                        placeholder='Describe what to look for in good answers and how to evaluate responses...'
                        showCount
                        maxLength={2000}
                        className={`${darkMode ? 'text-white placeholder-white' : 'text-gray-900 placeholder-gray-500'}`}
                      />
                    </Form.Item>

                    <Form.Item
                      name='tags'
                      label={
                        <span className={`font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                          Tags
                        </span>
                      }
                    >
                      <Select
                        mode='tags'
                        placeholder='Add tags (press Enter to add)'
                        className={`w-full ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      />
                    </Form.Item>

                    {/* Summary Card */}
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-emerald-600' : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <h4
                        className={`text-base font-semibold mb-3 flex items-center ${
                          darkMode ? 'text-emerald-100' : 'text-emerald-800'
                        }`}
                      >
                        <FontAwesomeIcon icon={faClipboardCheck} className='mr-2' />
                        Quick Summary
                      </h4>
                      <div className='space-y-2 text-sm'>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Status:
                          </span>
                          <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('status') || 'Draft'}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Category:
                          </span>
                          <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('category') || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Question:
                          </span>
                          <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('question')
                              ? form.getFieldValue('question').length > 50
                                ? form.getFieldValue('question').substring(0, 50) + '...'
                                : form.getFieldValue('question')
                              : 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600'>
                  <Button
                    onClick={() => {
                      form.resetFields()
                      navigate('/business-dashboard/assessments')
                    }}
                    size='large'
                    style={{
                      backgroundColor: darkMode ? '#dc2626' : '#ef4444',
                      borderColor: darkMode ? '#dc2626' : '#ef4444',
                      color: '#ffffff'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    size='large'
                    loading={loading}
                    style={{
                      backgroundColor: darkMode ? '#059669' : '#10b981',
                      borderColor: darkMode ? '#059669' : '#10b981'
                    }}
                  >
                    Create Assessment
                  </Button>
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
