// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Form, message } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faEye, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { BRAND_COLORS, DARK_THEME } from '../../../../core/theme/colors'
import BusinessSidebar from '../../components/BusinessSidebar'
import { createAssessment } from '../utils/controller'
import { parseTags } from '../utils/data-model'

// Import enhanced form field components
import FormSelect from '../../../../core/components/form-components/form-fields/FormSelect'
import FormInput from '../../../../core/components/form-components/form-fields/FormInput'
import FormSwitch from '../../../../core/components/form-components/form-fields/FormSwitch'

/**
 * CreateAssessment page for creating new skill assessments
 * Features a streamlined form layout optimized for the new data model
 */
const CreateAssessment = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Debug logging
  console.log('CreateAssessment component loaded, user:', user)

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
                    variant='ghost'
                    icon={<FontAwesomeIcon icon={faArrowLeft} />}
                    onClick={handleGoBack}
                    className='text-white hover:text-emerald-100 hover:bg-emerald-600/30 mr-4'
                  >
                    Back to Assessments
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

                <div className='flex items-center space-x-3'>
                  <Button
                    variant='ghost'
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={handlePreview}
                    className='text-white hover:text-emerald-100 hover:bg-emerald-600/30'
                  >
                    Preview
                  </Button>
                  <Button
                    variant='success'
                    icon={<FontAwesomeIcon icon={faSave} />}
                    onClick={() => form.submit()}
                    loading={loading}
                    className={`${
                      darkMode 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-white border-emerald-100' 
                        : 'bg-white text-emerald-700 hover:bg-emerald-50 border-white'
                    }`}
                  >
                    Create Assessment
                  </Button>
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
                className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} shadow-lg`}
                bodyStyle={{
                  padding: '24px',
                  backgroundColor: darkMode ? DARK_THEME.background.secondary : BRAND_COLORS.white
                }}
              >
                <div className='max-w-4xl mx-auto'>
                  <div className='space-y-6'>
                    {/* Active Toggle */}
                    <div className='mb-4'>
                      <FormSwitch
                        label='Active'
                        name='isActive'
                        defaultChecked={true}
                        switchProps={{
                          className: 'mr-3'
                        }}
                      />
                    </div>

                    {/* Assessment Title */}
                    <FormInput
                      label='Assessment Title'
                      name='title'
                      placeholder='Enter assessment title...'
                      rules={[{ required: true, message: 'Please enter an assessment title' }]}
                      customStyle={{
                        fontWeight: '500'
                      }}
                    />

                    {/* Status and Category Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormSelect
                        label='Status'
                        name='status'
                        placeholder='Select status'
                        rules={[{ required: true, message: 'Please select a status' }]}
                        options={[
                          { label: 'Draft', value: 'Draft' },
                          { label: 'Active', value: 'Active' },
                          { label: 'Inactive', value: 'Inactive' },
                          { label: 'Archived', value: 'Archived' }
                        ]}
                        customStyle={{
                          fontWeight: '500'
                        }}
                      />

                      <FormSelect
                        label='Category'
                        name='category'
                        placeholder='Select category'
                        options={[
                          { label: 'Technical', value: 'Technical' },
                          { label: 'Behavioral', value: 'Behavioral' },
                          { label: 'Cognitive', value: 'Cognitive' },
                          { label: 'Portfolio', value: 'Portfolio' }
                        ]}
                        customStyle={{
                          fontWeight: '500'
                        }}
                      />
                    </div>

                    {/* Tags */}
                    <FormSelect
                      label='Tags'
                      name='tags'
                      placeholder='Add tags (press Enter to add)'
                      options={[]}
                      selectProps={{
                        mode: 'tags',
                        className: 'w-full'
                      }}
                      customStyle={{
                        fontWeight: '500'
                      }}
                    />

                    {/* Summary Card */}
                    <div
                      className={`p-6 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-emerald-600' : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <h4
                        className={`text-lg font-semibold mb-4 flex items-center ${
                          darkMode ? 'text-emerald-100' : 'text-emerald-800'
                        }`}
                      >
                        <FontAwesomeIcon icon={faClipboardCheck} className='mr-2' />
                        Assessment Summary
                      </h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Title:
                          </span>
                          <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('title') || 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Status:
                          </span>
                          <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('status') || 'Draft'}
                          </div>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Category:
                          </span>
                          <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('category') || 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            Tags:
                          </span>
                          <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {form.getFieldValue('tags')?.length > 0 
                              ? form.getFieldValue('tags').join(', ') 
                              : 'None'}
                          </div>
                        </div>
                      </div>
                    </div>

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
