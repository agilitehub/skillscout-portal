// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Form, Row, Col, message, Input, Select, Card, Space, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faGift } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../../../core/components'
import { Toolbar } from '../../../../core/components'
import {
  createJobOpportunity,
  updateJobOpportunity,
  getJobOpportunityById,
  getJobDescriptionsForSelection,
  getQuestionnairesForSelection
} from '../utils/controller'
import { getDefaultJobOpportunityData, getDropdownOptions } from '../utils/data-model'
import JobDescriptionPreview from './JobDescriptionPreview'

const { TextArea } = Input
const { Option } = Select

/**
 * Job Listing Form Page Component
 * Supports creating and editing job listings with essential fields only
 */
const JobOpportunityForm = React.memo(() => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [questionnaires, setQuestionnaires] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState(null)

  // Get edit data from navigation state
  const editId = location.state?.editId || null
  const initialData = location.state?.initialData || null
  const isEditMode = Boolean(editId)

  const dropdownOptions = useMemo(() => getDropdownOptions(), [])

  // Handle job description selection change
  const handleJobDescriptionChange = useCallback((value) => {
    setSelectedJobDescriptionId(value)
  }, [])

  // Load job descriptions and questionnaires for dropdowns
  useEffect(() => {
    const loadOptions = async () => {
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

        // Load questionnaires
        const questionnairesResult = await getQuestionnairesForSelection()
        if (questionnairesResult.success) {
          setQuestionnaires(questionnairesResult.data)
        } else {
          console.error('Error loading questionnaires:', questionnairesResult.error)
          message.error('Failed to load questionnaires: ' + questionnairesResult.error)
        }
      } catch (error) {
        console.error('Unexpected error loading options:', error)
        message.error('An unexpected error occurred while loading form options')
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
  }, [])

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
      if (isEditMode) {
        if (initialData) {
          // Process the data to ensure compatibility with form fields
          const processedData = {
            ...initialData
          }

          // Use setTimeout to ensure form is fully rendered
          setTimeout(() => {
            form.setFieldsValue(processedData)
            // Set selected job description for preview
            if (initialData.jobDescription) {
              setSelectedJobDescriptionId(initialData.jobDescription)
            }
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
              // Set selected job description for preview
              if (result.data.jobDescription) {
                setSelectedJobDescriptionId(result.data.jobDescription)
              }
            } else {
              message.error('Failed to load job listing data: ' + result.error)
              navigate('/business-dashboard')
            }
          } catch (error) {
            console.error('Error loading job data:', error)
            message.error('An unexpected error occurred while loading job data')
            navigate('/business-dashboard')
          } finally {
            setLoadingData(false)
          }
        }
      } else {
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
  }, [editId, isEditMode, form, initialData, navigate])

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
          message.success(`Job listing ${isEditMode ? 'updated' : 'created'} successfully`)
          navigate('/business-dashboard/job-listings')
        } else {
          message.error(`Failed to ${isEditMode ? 'update' : 'create'} job listing: ${result.error}`)
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        message.error(`An unexpected error occurred while ${isEditMode ? 'updating' : 'creating'} the job listing`)
      } finally {
        setLoading(false)
      }
    },
    [isEditMode, editId, navigate]
  )

  const handleCancel = useCallback(() => {
    form.resetFields()
    navigate('/business-dashboard/job-listings')
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
          title={isEditMode ? 'Edit Job Listing' : 'Create Job Listing'}
          description={
            isEditMode ? 'Update your job listing details' : 'Create a new job listing for your organization'
          }
        />

        {/* Form Card */}
        <div className='p-4 md:p-6'>
          <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleFormSubmit}
              className='global-form'
              preserve={false}
              initialValues={formInitialValues}
              loading={loadingData || loadingOptions}
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
                    <Form.Item
                      label='Job Type'
                      name='type'
                      rules={[{ required: true, message: 'Job type is required' }]}
                    >
                      <Select
                        placeholder='Select job type'
                        dropdownClassName={darkMode ? 'job-opportunity-dark-dropdown' : ''}
                      >
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
                      <Select
                        placeholder='Select work arrangement'
                        dropdownClassName={darkMode ? 'job-opportunity-dark-dropdown' : ''}
                      >
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
                      <Select
                        placeholder='Select status'
                        dropdownClassName={darkMode ? 'job-opportunity-dark-dropdown' : ''}
                      >
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
                    {loadingOptions ? (
                      <div
                        className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className='flex flex-col items-center justify-center py-8'>
                          <div className='flex flex-col items-center space-y-3'>
                            <Spin spinning={loadingOptions} size='default' style={{ backgroundColor: 'transparent' }} />
                            <span
                              className={`whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              Loading job descriptions...
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Form.Item
                        label='Job Description'
                        name='jobDescription'
                        rules={[{ required: true, message: 'Job description is required' }]}
                      >
                        <Select
                          placeholder='Select a job description'
                          loading={loadingOptions}
                          showSearch
                          dropdownClassName={darkMode ? 'job-opportunity-dark-dropdown' : ''}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={handleJobDescriptionChange}
                        >
                          {jobDescriptions.map((jobDesc) => (
                            <Option key={jobDesc.id} value={jobDesc.id}>
                              {jobDesc.title}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </Col>
                  <Col xs={24} lg={12}>
                    {loadingOptions ? (
                      <div
                        className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className='flex flex-col items-center justify-center py-8'>
                          <div className='flex flex-col items-center space-y-3'>
                            <Spin spinning={loadingOptions} size='default' style={{ backgroundColor: 'transparent' }} />
                            <span
                              className={`whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              Loading questionnaires...
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Form.Item label='Questionnaires (Optional)' name='questionnaires'>
                        <Select
                          mode='multiple'
                          placeholder='Select questionnaires (optional)'
                          loading={loadingOptions}
                          showSearch
                          dropdownClassName={darkMode ? 'job-opportunity-dark-dropdown' : ''}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {questionnaires.map((questionnaire) => (
                            <Option key={questionnaire.id} value={questionnaire.id}>
                              {questionnaire.title}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                {/* Job Description Preview */}
                <JobDescriptionPreview
                  jobDescriptionId={selectedJobDescriptionId}
                  visible={!!selectedJobDescriptionId}
                />

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

                {/* Benefits */}
                <Form.Item
                  label={
                    <Space>
                      <span>Benefits</span>
                      <FontAwesomeIcon icon={faGift} className='text-gray-400' />
                    </Space>
                  }
                  name='benefits'
                  rules={[{ required: true, message: 'Please enter job benefits' }]}
                  extra={
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      List the benefits and perks offered with this position
                    </span>
                  }
                >
                  <TextArea
                    placeholder={`• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible PTO and work-from-home options
• Professional development budget`}
                    rows={8}
                    showCount={true}
                    style={{ fontWeight: '500' }}
                  />
                </Form.Item>
              </div>

              {/* Form Actions */}
              <div className='flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg'>
                <Button
                  type='default'
                  icon={<FontAwesomeIcon icon={faTimes} />}
                  onClick={handleCancel}
                  disabled={loading}
                  size='large'
                  className='form-btn-secondary'
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  icon={<FontAwesomeIcon icon={faSave} />}
                  onClick={() => form.submit()}
                  loading={loading}
                  size='large'
                  className='form-btn-primary'
                >
                  {isEditMode ? 'Update Job Listing' : 'Create Job Listing'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>

      {/* Dark mode dropdown styles */}
      <style jsx global>{`
        ${darkMode
          ? `
          .job-opportunity-dark-dropdown {
            background-color: #374151 !important;
          }
          
          .job-opportunity-dark-dropdown .ant-select-item {
            color: #F9FAFB !important;
            background-color: #374151 !important;
          }
          
          .job-opportunity-dark-dropdown .ant-select-item:hover {
            background-color: #4B5563 !important;
          }
          
          .job-opportunity-dark-dropdown .ant-select-item-option-selected {
            background-color: #059669 !important;
            color: #FFFFFF !important;
          }
          
          .job-opportunity-dark-dropdown .ant-select-item-option-selected:hover {
            background-color: #047857 !important;
          }
        `
          : ''}
      `}</style>
    </div>
  )
})

JobOpportunityForm.displayName = 'JobOpportunityForm'

export default JobOpportunityForm
