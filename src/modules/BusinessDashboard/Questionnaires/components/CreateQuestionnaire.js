// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Form, message, Input, Select, Switch } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { createQuestionnaire } from '../utils/controller'
import { parseTags } from '../utils/data-model'

const { Option } = Select

/**
 * CreateQuestionnaire page for creating new skill questionnaires
 * Features a streamlined form layout optimized for the new data model
 */
const CreateQuestionnaire = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)



  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        // Handle tags properly - Select with mode='tags' returns an array
        const processedValues = {
          ...values,
          tags: Array.isArray(values.tags) ? values.tags : parseTags(values.tags)
        }

        const result = await createQuestionnaire(processedValues, user)
        if (result.success) {
          message.success('Questionnaire created successfully!')
          navigate('/business-dashboard/questionnaires')
        } else {
                      console.error('Error creating questionnaire:', result.error)
            message.error('Failed to create questionnaire: ' + result.error)
          }
        } catch (error) {
          console.error('Unexpected error creating questionnaire:', error)
          message.error('An unexpected error occurred while creating the questionnaire')
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

        <div className='relative z-10'>
          <div className='px-6 pb-6'>
            <div className='max-w-5xl mx-auto'>
              {/* Toolbar with Title */}
              <div
                className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${
                  darkMode
                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                }`}
              >
              <div className='flex items-center'>
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  className={`text-lg mr-3 ${darkMode ? 'text-emerald-100' : 'text-white'}`}
                />
                <div>
                  <h1 className='text-xl font-bold text-white'>Create New Questionnaire</h1>
                  <p className='text-emerald-100 text-sm mt-1'>
                    Create a new questionnaire with title, category, and other details
                  </p>
                </div>
              </div>
            </div>

              {/* Form */}
              <Form
                form={form}
                layout='vertical'
                onFinish={handleFormSubmit}
                className='global-form'
                initialValues={{
                  status: 'Draft',
                  isActive: true
                }}
              >
                <Card
                  className={`shadow-xl ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    borderColor: darkMode ? '#4B5563' : '#e5e7eb'
                  }}
                >
                  <div className='space-y-6'>
                    {/* Active Toggle */}
                    <div className='mb-4'>
                      <Form.Item label='Active' name='isActive' valuePropName='checked'>
                        <Switch defaultChecked={true} className='mr-3' />
                      </Form.Item>
                    </div>

                    {/* Questionnaire Title */}
                    <Form.Item
                      label='Questionnaire Title'
                      name='title'
                      rules={[{ required: true, message: 'Please enter an questionnaire title' }]}
                    >
                      <Input placeholder='Enter questionnaire title...' style={{ fontWeight: '500' }} />
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
                        type='default'
                        onClick={() => {
                          form.resetFields()
                          navigate('/business-dashboard/questionnaires')
                        }}
                        size='large'
                        className='form-btn-secondary'
                      >
                        Cancel
                      </Button>
                      <Button 
                        type='primary' 
                        htmlType='submit' 
                        size='large' 
                        loading={loading}
                        className='form-btn-primary'
                      >
                        Create Questionnaire
                      </Button>
                    </div>
                  </div>
                </Card>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default CreateQuestionnaire
