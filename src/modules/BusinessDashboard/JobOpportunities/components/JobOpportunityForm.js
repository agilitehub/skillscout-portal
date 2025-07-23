// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Modal, Form, Row, Col, Divider, Tabs, message, Input, Select, Switch, Checkbox } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faBriefcase, faUser, faFileText, faCog } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import { createJobOpportunity, updateJobOpportunity, getJobOpportunityById } from '../utils/controller'
import { getDefaultJobOpportunityData, getDropdownOptions } from '../utils/data-model'

const { TextArea } = Input
const { Option } = Select

/**
 * Comprehensive Job Opportunity Form Component
 * Supports creating and editing job opportunities with all schema fields
 */
const JobOpportunityForm = React.memo(({ visible, onClose, onSuccess, editId = null, initialData = null }) => {
  const { darkMode } = useTheme()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEditMode = Boolean(editId)
  const dropdownOptions = useMemo(() => getDropdownOptions(), [])

  // Prepare initial values for the form
  const formInitialValues = useMemo(() => {
    if (isEditMode && initialData) {
      return {
        ...initialData,
        customFields: Array.isArray(initialData.customFields)
          ? JSON.stringify(initialData.customFields, null, 2)
          : initialData.customFields || '[]'
      }
    }
    if (!isEditMode) {
      const defaultData = getDefaultJobOpportunityData()
      return {
        ...defaultData,
        customFields: Array.isArray(defaultData.customFields)
          ? JSON.stringify(defaultData.customFields, null, 2)
          : defaultData.customFields || '[]'
      }
    }
    return {}
  }, [isEditMode, initialData])

  // Load data for edit mode
  useEffect(() => {
    const loadJobData = async () => {
      if (isEditMode && visible) {
        // Use provided initialData if available, otherwise fetch (fallback)
        console.log('initialData', initialData)
        if (initialData) {
          // Process the data to ensure compatibility with form fields
          const processedData = {
            ...initialData,
            // Ensure customFields is properly formatted for the form
            customFields: Array.isArray(initialData.customFields)
              ? JSON.stringify(initialData.customFields, null, 2)
              : initialData.customFields || '[]'
          }
          console.log('Setting form values with:', processedData)

          // Use setTimeout to ensure form is fully rendered
          setTimeout(() => {
            form.setFieldsValue(processedData)
            console.log('Form values after setting:', form.getFieldsValue())
          }, 0)
        } else if (editId) {
          // Fallback: fetch if somehow we don't have the data
          setLoadingData(true)
          try {
            const result = await getJobOpportunityById(editId)
            if (result.success) {
              const processedData = {
                ...result.data,
                customFields: Array.isArray(result.data.customFields)
                  ? JSON.stringify(result.data.customFields, null, 2)
                  : result.data.customFields || '[]'
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
          ...defaultData,
          customFields: Array.isArray(defaultData.customFields)
            ? JSON.stringify(defaultData.customFields, null, 2)
            : defaultData.customFields || '[]'
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
      setActiveTab('basic')
    }
  }, [visible, form])

  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)

        // Process customFields back to array format
        const processedValues = {
          ...values,
          customFields: (() => {
            try {
              return typeof values.customFields === 'string'
                ? JSON.parse(values.customFields)
                : values.customFields || []
            } catch {
              return []
            }
          })()
        }

        let result
        if (isEditMode) {
          result = await updateJobOpportunity(editId, processedValues)
        } else {
          result = await createJobOpportunity(processedValues)
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

  // Tab items configuration
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span>
          <FontAwesomeIcon icon={faBriefcase} className='mr-2' />
          Basic Information
        </span>
      ),
      children: (
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
                label='Company'
                name='company'
                rules={[
                  { required: true, message: 'Company name is required' },
                  { max: 255, message: 'Company name must be 255 characters or less' }
                ]}
              >
                <Input placeholder='e.g. TechCorp Inc.' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col xs={24} lg={12}>
              <Form.Item
                label='Job Type'
                name='type'
                rules={[{ required: true, message: 'Job type is required' }]}
              >
                <Select placeholder='Select job type'>
                  {dropdownOptions.type.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
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
              <Form.Item
                label='Work Arrangement'
                name='workArrangement'
                rules={[{ required: true, message: 'Work arrangement is required' }]}
              >
                <Select placeholder='Select work arrangement'>
                  {dropdownOptions.workArrangement.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Job Description'
            name='description'
            rules={[{ required: true, message: 'Job description is required' }]}
          >
            <TextArea
              placeholder='Detailed description of the role, responsibilities, and what makes this opportunity unique...'
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label='Benefits & Perks'
            name='benefits'
          >
            <TextArea
              placeholder='Health insurance, retirement plans, flexible PTO, professional development...'
              rows={3}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label='Status' name='status'>
                <Select placeholder='Select status'>
                  {dropdownOptions.status.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label='Remote Work Available' name='remote' valuePropName='checked'>
                <Switch checkedChildren='Yes' unCheckedChildren='No' />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'requirements',
      label: (
        <span>
          <FontAwesomeIcon icon={faUser} className='mr-2' />
          Requirements
        </span>
      ),
      children: (
        <div className='space-y-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Experience Required'
                name='experienceRequired'
                rules={[{ required: true, message: 'Experience level is required' }]}
              >
                <Select placeholder='Select experience level'>
                  {dropdownOptions.experienceRequired.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Education Level'
                name='educationLevel'
              >
                <Select placeholder='Select education level'>
                  {dropdownOptions.educationLevel.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Field of Study'
                name='fieldOfStudy'
                rules={[{ max: 255, message: 'Field of study must be 255 characters or less' }]}
              >
                <Input placeholder='e.g. Computer Science, Engineering' />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Industry Experience'
                name='industryExperience'
              >
                <Select placeholder='Select industry'>
                  {dropdownOptions.industryExperience.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Required Skills'
            name='requiredSkills'
            rules={[{ required: true, message: 'Required skills are required' }]}
            extra='List the essential technical and professional skills'
          >
            <TextArea
              placeholder='JavaScript, React, Node.js, SQL, Git...'
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label='Soft Skills'
            name='softSkills'
            extra='List desired interpersonal and soft skills'
          >
            <TextArea
              placeholder='Communication, teamwork, problem-solving, leadership...'
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label='Tools & Technologies'
            name='toolsRequired'
            extra='List specific tools and technologies'
          >
            <TextArea
              placeholder='VS Code, Jira, Slack, AWS, Docker...'
              rows={3}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Certifications Required'
                name='certificationsRequired'
                rules={[{ max: 255, message: 'Certifications must be 255 characters or less' }]}
              >
                <Input placeholder='e.g. AWS Certified, PMP, etc.' />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Visa Sponsorship'
                name='visaSponsorship'
              >
                <Select placeholder='Select sponsorship availability'>
                  {dropdownOptions.visaSponsorship.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Travel Requirements'
            name='travelRequirements'
          >
            <Select placeholder='Select travel requirements'>
              {dropdownOptions.travelRequirements.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      )
    },
    {
      key: 'application',
      label: (
        <span>
          <FontAwesomeIcon icon={faFileText} className='mr-2' />
          Application Process
        </span>
      ),
      children: (
        <div className='space-y-4'>
          <Form.Item
            label='Employment Types'
            name='employmentTypes'
            rules={[{ required: true, message: 'At least one employment type is required' }]}
            extra='Select all applicable employment types'
          >
            <Checkbox.Group>
              {dropdownOptions.employmentTypes.map(option => (
                <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Divider>Application Requirements</Divider>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Resume Required'
                name='resumeRequired'
                valuePropName='checked'
              >
                <Switch
                  checkedChildren='Required'
                  unCheckedChildren='Optional'
                  defaultChecked={true}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Cover Letter'
                name='coverLetterRequired'
              >
                <Select placeholder='Select requirement level'>
                  {dropdownOptions.coverLetterRequired.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Portfolio'
                name='portfolioRequired'
              >
                <Select placeholder='Select requirement level'>
                  {dropdownOptions.portfolioRequired.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='References'
                name='referencesRequired'
              >
                <Select placeholder='Select requirement level'>
                  {dropdownOptions.referencesRequired.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Application Instructions'
            name='applicationInstructions'
            extra='Provide any special instructions for applicants'
          >
            <TextArea
              placeholder='Special instructions for applicants, submission guidelines, or additional requirements...'
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label='Screening Questions'
            name='screeningQuestions'
            extra='Add custom questions to screen candidates'
          >
            <TextArea
              placeholder='1. Why are you interested in this role?&#10;2. What is your experience with [specific technology]?&#10;3. Are you authorized to work in [country]?'
              rows={4}
            />
          </Form.Item>
        </div>
      )
    },
    {
      key: 'metadata',
      label: (
        <span>
          <FontAwesomeIcon icon={faCog} className='mr-2' />
          Additional Settings
        </span>
      ),
      children: (
        <div className='space-y-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Current Applicants'
                name='applicants'
                extra='Current number of applicants (auto-updated)'
              >
                <Input
                  placeholder='0'
                  type='number'
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Date Posted'
                name='datePosted'
                extra='When this job was first posted'
              >
                <Input type='date' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Custom Fields (JSON)'
            name='customFields'
            extra='Additional custom data in JSON format (for advanced users)'
          >
            <TextArea
              placeholder='[{"field": "value"}, {"another": "field"}]'
              rows={4}
            />
          </Form.Item>
        </div>
      )
    }
  ]

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
      width={1000}
      destroyOnClose
      loading={loadingData}
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
      {/* Dark Mode Styles */}
      {darkMode && (
        <style jsx global>{`
          /* Modal Dark Mode Styles */
          .modal-dark .ant-modal-content {
            background-color: #374151 !important;
          }
          .modal-dark .ant-modal-header {
            background-color: #374151 !important;
            border-bottom: 1px solid #4b5563 !important;
          }
          .modal-dark .ant-modal-title {
            color: #ffffff !important;
          }
          .modal-dark .ant-modal-close {
            color: #9ca3af !important;
          }
          .modal-dark .ant-modal-close:hover {
            color: #ffffff !important;
          }
          .modal-dark .ant-modal-footer {
            background-color: #374151 !important;
            border-top: 1px solid #4b5563 !important;
          }

          /* Tabs Dark Mode */
          .modal-dark .ant-tabs-tab {
            color: #9ca3af !important;
          }
          .modal-dark .ant-tabs-tab-active {
            color: #10b981 !important;
          }
          .modal-dark .ant-tabs-ink-bar {
            background: #10b981 !important;
          }
          .modal-dark .ant-tabs-content-holder {
            background-color: #374151 !important;
          }

          /* Form Labels */
          .modal-dark .ant-form-item-label > label {
            color: #10b981 !important;
          }
          .modal-dark .ant-form-item-extra {
            color: #9ca3af !important;
          }

          /* Form Inputs */
          .modal-dark .ant-input,
          .modal-dark .ant-select-selector,
          .modal-dark .ant-input-number,
          .modal-dark .ant-picker,
          .modal-dark textarea.ant-input {
            background-color: #374151 !important;
            border-color: #4b5563 !important;
            color: #e5e7eb !important;
          }

          /* Input Focus States */
          .modal-dark .ant-input:focus,
          .modal-dark .ant-select-focused .ant-select-selector,
          .modal-dark .ant-input-number:focus,
          .modal-dark .ant-picker-focused {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
          }

          /* Placeholders */
          .modal-dark .ant-input::placeholder,
          .modal-dark .ant-select-selection-placeholder {
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

          /* Checkboxes */
          .modal-dark .ant-checkbox-wrapper {
            color: #e5e7eb !important;
          }
          .modal-dark .ant-checkbox-checked .ant-checkbox-inner {
            background-color: #10b981 !important;
            border-color: #10b981 !important;
          }

          /* Switch */
          .modal-dark .ant-switch-checked {
            background-color: #10b981 !important;
          }

          /* Divider */
          .modal-dark .ant-divider {
            border-color: #4b5563 !important;
          }
          .modal-dark .ant-divider-inner-text {
            color: #9ca3af !important;
          }
        `}</style>
      )}

      <Form
        form={form}
        layout='vertical'
        onFinish={handleFormSubmit}
        className={darkMode ? 'modal-dark' : ''}
        preserve={false}
        initialValues={formInitialValues}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className={darkMode ? 'modal-dark' : ''} />
      </Form>
    </Modal>
  )
})

JobOpportunityForm.displayName = 'JobOpportunityForm'

export default JobOpportunityForm
