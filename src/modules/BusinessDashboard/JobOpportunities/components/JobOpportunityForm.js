// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Modal, Form, Row, Col, message, Input, Select } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import {
  createJobOpportunity,
  updateJobOpportunity,
  getJobOpportunityById,
  getJobDescriptionsForSelection,
  getAssessmentsForSelection
} from '../utils/controller'
import { getDefaultJobOpportunityData, getDropdownOptions } from '../utils/data-model'

const { TextArea } = Input
const { Option } = Select

/**
 * Simplified Job Opportunity Form Component
 * Supports creating and editing job opportunities with essential fields only
 */
const JobOpportunityForm = React.memo(({ visible, onClose, onSuccess, editId = null, initialData = null }) => {
  const { darkMode } = useTheme()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [assessments, setAssessments] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  const isEditMode = Boolean(editId)
  const dropdownOptions = useMemo(() => getDropdownOptions(), [])

  // Load job descriptions and assessments for dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      if (visible) {
        setLoadingOptions(true)
        try {
          // Load job descriptions
          const jobDescriptionsResult = await getJobDescriptionsForSelection()
          if (jobDescriptionsResult.success) {
            setJobDescriptions(jobDescriptionsResult.data)
          } else {
            console.error('Error loading job descriptions:', jobDescriptionsResult.error)
            message.error('Failed to load job descriptions: ' + jobDescriptionsResult.error)
          }

          // Load assessments
          const assessmentsResult = await getAssessmentsForSelection()
          if (assessmentsResult.success) {
            setAssessments(assessmentsResult.data)
          } else {
            console.error('Error loading assessments:', assessmentsResult.error)
            message.error('Failed to load assessments: ' + assessmentsResult.error)
          }
        } catch (error) {
          console.error('Unexpected error loading options:', error)
          message.error('An unexpected error occurred while loading form options')
        } finally {
          setLoadingOptions(false)
        }
      }
    }

    loadOptions()
  }, [visible])

  // Prepare initial values for the form
  const formInitialValues = useMemo(() => {
    if (isEditMode && initialData) {
      return {
        ...initialData
      }
    }
    if (!isEditMode) {
      const defaultData = getDefaultJobOpportunityData()
      return {
        ...defaultData
      }
    }
    return {}
  }, [isEditMode, initialData])

  // Load data for edit mode
  useEffect(() => {
    const loadJobData = async () => {
      if (isEditMode && visible) {
        // Use provided initialData if available, otherwise fetch (fallback)

        if (initialData) {
          // Process the data to ensure compatibility with form fields
          const processedData = {
            ...initialData
          }

          // Use setTimeout to ensure form is fully rendered
          setTimeout(() => {
            form.setFieldsValue(processedData)
          }, 0)
        } else if (editId) {
          // Fallback: fetch if somehow we don't have the data
          setLoadingData(true)
          try {
            const result = await getJobOpportunityById(editId)
            if (result.success) {
              const processedData = {
                ...result.data
              }
              form.setFieldsValue(processedData)
            } else {
              message.error('Failed to load job opportunity data: ' + result.error)
              onClose()
            }
          } catch (error) {
            console.error('Error loading job data:', error)
            message.error('An unexpected error occurred while loading job data')
            onClose()
          } finally {
            setLoadingData(false)
          }
        }
      } else if (visible && !isEditMode) {
        // Set default values for new job
        const defaultData = initialData || getDefaultJobOpportunityData()
        const processedData = {
          ...defaultData
        }
        setTimeout(() => {
          form.setFieldsValue(processedData)
        }, 0)
      }
    }

    loadJobData()
  }, [visible, editId, isEditMode, form, initialData, onClose])

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  }, [visible, form])

  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)

        let result
        if (isEditMode) {
          result = await updateJobOpportunity(editId, values)
        } else {
          result = await createJobOpportunity(values)
        }

        if (result.success) {
          message.success(`Job opportunity ${isEditMode ? 'updated' : 'created'} successfully`)
          onSuccess?.(result.data)
          onClose()
        } else {
          message.error(`Failed to ${isEditMode ? 'update' : 'create'} job opportunity: ${result.error}`)
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        message.error(`An unexpected error occurred while ${isEditMode ? 'updating' : 'creating'} the job opportunity`)
      } finally {
        setLoading(false)
      }
    },
    [isEditMode, editId, onSuccess, onClose]
  )

  const handleCancel = useCallback(() => {
    form.resetFields()
    onClose()
  }, [form, onClose])

  return (
    <Modal
      title={
        <div className='flex items-center'>
          <FontAwesomeIcon icon={faBriefcase} className='mr-2' />
          {isEditMode ? 'Edit Job Opportunity' : 'Create Job Opportunity'}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='cancel'
          icon={<FontAwesomeIcon icon={faTimes} />}
          onClick={handleCancel}
          disabled={loading}
          size='large'
        >
          Cancel
        </Button>,
        <Button
          key='submit'
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
          {isEditMode ? 'Update Job' : 'Create Job'}
        </Button>
      ]}
      width={800}
      destroyOnClose
      loading={loadingData || loadingOptions}
      className={darkMode ? 'modal-dark' : ''}
      styles={{
        content: {
          backgroundColor: darkMode ? '#374151' : '#ffffff'
        },
        body: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          maxHeight: '70vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px'
        },
        header: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          borderBottom: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
        },
        footer: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          borderTop: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
        }
      }}
    >
      {/* Dark Mode Form Styling */}
      {darkMode && (
        <style>
          {`
            .modal-dark .ant-form-item-label > label {
              color: #E5E7EB !important;
            }
            .modal-dark .ant-form-item-extra {
              color: #9CA3AF !important;
            }
            .modal-dark .ant-input,
            .modal-dark input.ant-input,
            .modal-dark input[type="text"],
            .modal-dark input[type="number"],
            .modal-dark input[type="date"],
            .modal-dark input {
              background-color: #4B5563 !important;
              border-color: #6B7280 !important;
              color: #F9FAFB !important;
            }
            .modal-dark .ant-input:focus,
            .modal-dark input.ant-input:focus,
            .modal-dark input[type="text"]:focus,
            .modal-dark input[type="number"]:focus,
            .modal-dark input[type="date"]:focus,
            .modal-dark input:focus {
              border-color: #059669 !important;
              box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
              background-color: #4B5563 !important;
              color: #F9FAFB !important;
            }
            .modal-dark .ant-input::placeholder,
            .modal-dark input::placeholder {
              color: #9CA3AF !important;
            }
            .modal-dark textarea.ant-input,
            .modal-dark textarea {
              background-color: #4B5563 !important;
              border-color: #6B7280 !important;
              color: #F9FAFB !important;
            }
            .modal-dark textarea.ant-input:focus,
            .modal-dark textarea:focus {
              border-color: #059669 !important;
              box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
              background-color: #4B5563 !important;
              color: #F9FAFB !important;
            }
            .modal-dark textarea.ant-input::placeholder,
            .modal-dark textarea::placeholder {
              color: #9CA3AF !important;
            }
            .modal-dark .ant-input-show-count-suffix {
              color: #9CA3AF !important;
            }
            .modal-dark .ant-select,
            .modal-dark .ant-select-selector,
            .modal-dark .ant-select-single .ant-select-selector {
              background-color: #4B5563 !important;
              border-color: #6B7280 !important;
              color: #F9FAFB !important;
            }
            .modal-dark .ant-select-focused .ant-select-selector,
            .modal-dark .ant-select:focus .ant-select-selector {
              border-color: #059669 !important;
              box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
              background-color: #4B5563 !important;
            }
            .modal-dark .ant-select-selection-placeholder {
              color: #9CA3AF !important;
            }
            .modal-dark .ant-select-selection-item {
              color: #F9FAFB !important;
              background-color: transparent !important;
            }
            .modal-dark .ant-select-arrow {
              color: #9CA3AF !important;
            }
            
            /* Dropdown Options */
            .ant-select-dropdown {
              background-color: #374151 !important;
            }
            .ant-select-item {
              color: #F9FAFB !important;
            }
            .ant-select-item:hover {
              background-color: #4B5563 !important;
            }
            .ant-select-item-option-selected {
              background-color: #10B981 !important;
              color: #FFFFFF !important;
            }
            
            /* Form validation messages */
            .ant-form-item-explain-error {
              color: #F87171 !important;
            }
            
            /* Character count */
            .ant-input-data-count {
              color: #9CA3AF !important;
            }
            
            /* Additional comprehensive styling */
            .modal-dark .ant-form-item-control-input {
              background-color: transparent !important;
            }
            .modal-dark .ant-form-item-control-input-content input {
              background-color: #4B5563 !important;
              color: #F9FAFB !important;
              border-color: #6B7280 !important;
            }
            .modal-dark .ant-form-item-control-input-content textarea {
              background-color: #4B5563 !important;
              color: #F9FAFB !important;
              border-color: #6B7280 !important;
            }
            .modal-dark .ant-form-item-control-input-content .ant-select-selector {
              background-color: #4B5563 !important;
              color: #F9FAFB !important;
              border-color: #6B7280 !important;
            }
            
            /* Ultimate override for any remaining light elements */
            .modal-dark * {
              scrollbar-color: #6B7280 #374151;
            }
            .modal-dark .ant-form-item input,
            .modal-dark .ant-form-item textarea,
            .modal-dark .ant-form-item .ant-select-selector {
              background-color: #4B5563 !important;
              color: #F9FAFB !important;
              border-color: #6B7280 !important;
            }
            .modal-dark .ant-form-item .ant-input-affix-wrapper {
              background-color: #4B5563 !important;
              border-color: #6B7280 !important;
            }
            .modal-dark .ant-form-item .ant-input-affix-wrapper input {
              background-color: transparent !important;
              color: #F9FAFB !important;
            }
            .modal-dark .ant-form-item .ant-input-prefix {
              color: #9CA3AF !important;
            }
          `}
        </style>
      )}

      <Form
        form={form}
        layout='vertical'
        onFinish={handleFormSubmit}
        className={darkMode ? 'modal-dark' : ''}
        preserve={false}
        initialValues={formInitialValues}
      >
        <div className='space-y-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Job Title'
                name='title'
                rules={[
                  { required: true, message: 'Job title is required' },
                  { max: 255, message: 'Job title must be 255 characters or less' }
                ]}
              >
                <Input placeholder='e.g. Senior Software Engineer' />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Location'
                name='location'
                rules={[
                  { required: true, message: 'Location is required' },
                  { max: 255, message: 'Location must be 255 characters or less' }
                ]}
              >
                <Input placeholder='e.g. New York, NY' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label='Job Type' name='type' rules={[{ required: true, message: 'Job type is required' }]}>
                <Select placeholder='Select job type'>
                  {dropdownOptions.type.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Work Arrangement'
                name='workArrangement'
                rules={[{ required: true, message: 'Work arrangement is required' }]}
              >
                <Select placeholder='Select work arrangement'>
                  {dropdownOptions.workArrangement.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Salary Range'
                name='salary'
                rules={[
                  { required: true, message: 'Salary range is required' },
                  { max: 100, message: 'Salary must be 100 characters or less' }
                ]}
              >
                <Input placeholder='e.g. $80,000 - $120,000' />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label='Status' name='status'>
                <Select placeholder='Select status'>
                  {dropdownOptions.status.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Job Description'
                name='jobDescription'
                rules={[{ required: true, message: 'Job description is required' }]}
              >
                <Select
                  placeholder='Select a job description'
                  loading={loadingOptions}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jobDescriptions.map((jobDesc) => (
                    <Option key={jobDesc.id} value={jobDesc.id}>
                      {jobDesc.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Assessments'
                name='assessments'
                rules={[{ required: true, message: 'At least one assessment is required' }]}
              >
                <Select
                  mode='multiple'
                  placeholder='Select assessments'
                  loading={loadingOptions}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {assessments.map((assessment) => (
                    <Option key={assessment.id} value={assessment.id}>
                      {assessment.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Overview'
            name='description'
            rules={[{ required: true, message: 'Job overview is required' }]}
          >
            <TextArea
              placeholder='Detailed overview of the role, responsibilities, and what makes this opportunity unique...'
              rows={4}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
})

JobOpportunityForm.displayName = 'JobOpportunityForm'

export default JobOpportunityForm
