// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback } from 'react'
import { Card, Form, message, Input, Select, Switch } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import Toolbar from '../../../../core/components/Toolbar'
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
        <div className='relative z-10'>
          {/* Toolbar */}
          <Toolbar
            title='Create New Questionnaire'
            description='Create a new questionnaire with title, category, and other details'
          />

          <div className='px-6 pt-6 pb-6'>
            <div className='max-w-5xl mx-auto'>
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
                        <Select
                          placeholder='Select status'
                          style={{ fontWeight: '500' }}
                          dropdownClassName={darkMode ? 'dark-select-dropdown' : ''}
                        >
                          <Option value='Draft'>Draft</Option>
                          <Option value='Active'>Active</Option>
                          <Option value='Inactive'>Inactive</Option>
                          <Option value='Archived'>Archived</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label='Category' name='category'>
                        <Select
                          placeholder='Select category'
                          style={{ fontWeight: '500' }}
                          dropdownClassName={darkMode ? 'dark-select-dropdown' : ''}
                        >
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
                        dropdownClassName={darkMode ? 'dark-select-dropdown' : ''}
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

      {/* Dark mode dropdown styles */}
      <style jsx global>{`
        .dark-select-dropdown {
          background-color: ${darkMode ? '#374151' : '#ffffff'} !important;
        }

        .dark-select-dropdown .ant-select-item {
          color: ${darkMode ? '#F9FAFB' : '#374151'} !important;
          background-color: ${darkMode ? '#374151' : '#ffffff'} !important;
        }

        .dark-select-dropdown .ant-select-item:hover {
          background-color: ${darkMode ? '#4B5563' : '#F3F4F6'} !important;
        }

        .dark-select-dropdown .ant-select-item-option-selected {
          background-color: ${darkMode ? '#059669' : '#10B981'} !important;
          color: #ffffff !important;
        }

        .dark-select-dropdown .ant-select-item-option-selected:hover {
          background-color: ${darkMode ? '#047857' : '#059669'} !important;
        }
      `}</style>
    </>
  )
})

export default CreateQuestionnaire
