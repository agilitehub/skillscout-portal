// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect } from 'react'
import { Card, Form, message, Row, Col, Input, Switch } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Toolbar } from '../../../../core/components'
import { createLookup, updateLookup, getLookupById } from '../utils/controller'

/**
 * Lookup Form Page Component
 * Supports creating and editing lookup profiles
 */
const LookupForm = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [labelValuePairs, setLabelValuePairs] = useState([{ label: '', value: '' }])

  // Get edit data from navigation state
  const editId = location.state?.editId || null
  const initialData = location.state?.initialData || null
  const isEditMode = Boolean(editId)

  // Load data for edit mode
  useEffect(() => {
    const loadLookupData = async () => {
      if (isEditMode) {
        if (initialData) {
          // Use provided initial data
          form.setFieldsValue({
            profileKey: initialData.profileKey,
            groupName: initialData.groupName,
            isActive: initialData.isActive
          })

          setLabelValuePairs(
            initialData.labelValuePairs && initialData.labelValuePairs.length > 0
              ? initialData.labelValuePairs
              : [{ label: '', value: '' }]
          )
        } else if (editId) {
          // Fallback: fetch if somehow we don't have the data
          setLoadingData(true)
          try {
            const result = await getLookupById(editId)
            if (result.success) {
              form.setFieldsValue({
                profileKey: result.data.profileKey,
                groupName: result.data.groupName,
                isActive: result.data.isActive
              })

              setLabelValuePairs(
                result.data.labelValuePairs && result.data.labelValuePairs.length > 0
                  ? result.data.labelValuePairs
                  : [{ label: '', value: '' }]
              )
            } else {
              message.error('Failed to load lookup data: ' + result.error)
              navigate('/business-dashboard/lookups')
            }
          } catch (error) {
            console.error('Error loading lookup data:', error)
            message.error('An unexpected error occurred while loading lookup data')
            navigate('/business-dashboard/lookups')
          } finally {
            setLoadingData(false)
          }
        }
      } else {
        // Set default values for new lookup
        form.setFieldsValue({
          isActive: true
        })
      }
    }

    loadLookupData()
  }, [editId, isEditMode, form, initialData, navigate])

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)

        const validPairs = labelValuePairs.filter((pair) => pair.label && pair.label.trim())

        if (validPairs.length === 0) {
          message.error('Please add at least one label-value pair')
          return
        }

        const lookupData = {
          ...values,
          labelValuePairs: validPairs.map((pair, index) => ({
            ...pair,
            sortOrder: index + 1
          }))
        }

        let result
        if (isEditMode && editId) {
          result = await updateLookup(editId, lookupData, user)
        } else {
          result = await createLookup(lookupData, user)
        }

        if (result.success) {
          message.success(`Lookup ${isEditMode ? 'updated' : 'created'} successfully`)
          navigate('/business-dashboard/lookups')
        } else {
          message.error(`Failed to ${isEditMode ? 'update' : 'create'} lookup: ${result.error}`)
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        message.error(`An unexpected error occurred while ${isEditMode ? 'updating' : 'creating'} the lookup`)
      } finally {
        setLoading(false)
      }
    },
    [isEditMode, editId, labelValuePairs, user, navigate]
  )

  // Handle label-value pair changes
  const handleLabelValueChange = useCallback((index, field, value) => {
    setLabelValuePairs((prev) => prev.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair)))
  }, [])

  // Add new label-value pair
  const addLabelValuePair = useCallback(() => {
    setLabelValuePairs((prev) => [...prev, { label: '', value: '' }])
  }, [])

  // Remove label-value pair
  const removeLabelValuePair = useCallback(
    (index) => {
      if (labelValuePairs.length > 1) {
        setLabelValuePairs((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [labelValuePairs.length]
  )

  const handleCancel = useCallback(() => {
    form.resetFields()
    navigate('/business-dashboard/lookups')
  }, [form, navigate])

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      <div className='relative z-10'>
        {/* Toolbar */}
        <Toolbar
          title={isEditMode ? 'Edit Lookup Profile' : 'Create New Lookup Profile'}
          description={
            isEditMode
              ? 'Update your lookup profile details'
              : 'Create a new lookup profile for your organization'
          }
        />

        <div className='p-4 md:p-6'>
          <div className='max-w-7xl mx-auto'>

          {/* Form Card */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg lookups-card`}>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleFormSubmit}
              className='global-form'
              preserve={false}
              initialValues={{ isActive: true }}
              loading={loadingData}
            >
              <div className='space-y-4'>
                {/* Active Toggle */}
                <div className='mb-6'>
                  <Form.Item label='Active' name='isActive' valuePropName='checked'>
                    <Switch defaultChecked={true} className='mr-3' />
                  </Form.Item>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label='Profile Key'
                      name='profileKey'
                      rules={[{ required: true, message: 'Please enter a profile key' }]}
                    >
                      <Input placeholder='Provide a unique Profile Key' style={{ fontWeight: '500' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Group Name (optional)' name='groupName'>
                      <Input placeholder='Used to group Profiles' style={{ fontWeight: '500' }} />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Label-Value Pairs Section */}
                <div
                  className={`mt-6 p-4 rounded-lg border-2 ${
                    darkMode ? 'bg-gray-800 border-emerald-600' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      Label-Value Pairs
                    </h4>
                    <Button
                      type='primary'
                      size='small'
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={addLabelValuePair}
                      style={{
                        background: darkMode ? '#059669' : '#10b981',
                        borderColor: darkMode ? '#059669' : '#10b981'
                      }}
                    >
                      Add Pair
                    </Button>
                  </div>

                  <div className='space-y-3'>
                    <Row gutter={8} className='mb-3'>
                      <Col span={10}>
                        <div
                          className={`text-sm font-semibold uppercase tracking-wide ${
                            darkMode ? 'text-emerald-200' : 'text-emerald-700'
                          }`}
                        >
                          Label
                        </div>
                      </Col>
                      <Col span={10}>
                        <div
                          className={`text-sm font-semibold uppercase tracking-wide ${
                            darkMode ? 'text-emerald-200' : 'text-emerald-700'
                          }`}
                        >
                          Value
                        </div>
                      </Col>
                      <Col span={4}>
                        <div
                          className={`text-sm font-semibold uppercase tracking-wide ${
                            darkMode ? 'text-emerald-200' : 'text-emerald-700'
                          }`}
                        >
                          Actions
                        </div>
                      </Col>
                    </Row>

                    {labelValuePairs.map((pair, index) => (
                      <Row key={index} gutter={8} align='middle' className='mb-2'>
                        <Col span={10}>
                          <Input
                            placeholder='Provide a Label'
                            value={pair.label}
                            onChange={(e) => handleLabelValueChange(index, 'label', e.target.value)}
                            style={{ fontWeight: '500' }}
                          />
                        </Col>
                        <Col span={10}>
                          <Input
                            placeholder='Provide a Value'
                            value={pair.value}
                            onChange={(e) => handleLabelValueChange(index, 'value', e.target.value)}
                            style={{ fontWeight: '500' }}
                          />
                        </Col>
                        <Col span={4}>
                          {labelValuePairs.length > 1 && (
                            <Button
                              type='text'
                              size='small'
                              danger
                              icon={<FontAwesomeIcon icon={faTimes} />}
                              onClick={() => removeLabelValuePair(index)}
                            />
                          )}
                        </Col>
                      </Row>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div
                className={`flex justify-end space-x-4 mt-8 pt-6 border-t -mx-6 -mb-6 px-6 pb-6 rounded-b-lg ${
                  darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Button
                  type='default'
                  onClick={handleCancel}
                  disabled={loading}
                  size='large'
                  className='form-btn-secondary'
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  icon={<FontAwesomeIcon icon={faSave} className='mr-2' />}
                  onClick={() => form.submit()}
                  loading={loading}
                  size='large'
                  className='form-btn-primary'
                >
                  {isEditMode ? 'Update Lookup Profile' : 'Create Lookup Profile'}
                </Button>
              </div>
            </Form>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
})

LookupForm.displayName = 'LookupForm'

export default LookupForm
