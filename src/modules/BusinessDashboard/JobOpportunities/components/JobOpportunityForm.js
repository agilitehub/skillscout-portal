// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Modal, Form, Row, Col, Divider, Tabs, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faBriefcase, faUser, faFileText, faCog } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import FormInput from '../../../../core/components/form-components/form-fields/FormInput'
import FormTextArea from '../../../../core/components/form-components/form-fields/FormTextArea'
import FormSelect from '../../../../core/components/form-components/form-fields/FormSelect'
import FormCheckbox from '../../../../core/components/form-components/form-fields/FormCheckbox'
import FormSwitch from '../../../../core/components/form-components/form-fields/FormSwitch'
import { createJobOpportunity, updateJobOpportunity, getJobOpportunityById } from '../utils/controller'
import { getDefaultJobOpportunityData, getDropdownOptions } from '../utils/data-model'

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
              <FormInput
                label='Job Title'
                name='title'
                placeholder='e.g. Senior Software Engineer'
                rules={[
                  { required: true, message: 'Job title is required' },
                  { max: 255, message: 'Job title must be 255 characters or less' }
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormInput
                label='Company'
                name='company'
                placeholder='e.g. TechCorp Inc.'
                rules={[
                  { required: true, message: 'Company name is required' },
                  { max: 255, message: 'Company name must be 255 characters or less' }
                ]}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormInput
                label='Location'
                name='location'
                placeholder='e.g. New York, NY'
                rules={[
                  { required: true, message: 'Location is required' },
                  { max: 255, message: 'Location must be 255 characters or less' }
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Job Type'
                name='type'
                placeholder='Select job type'
                options={dropdownOptions.type}
                rules={[{ required: true, message: 'Job type is required' }]}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormInput
                label='Salary Range'
                name='salary'
                placeholder='e.g. $80,000 - $120,000'
                rules={[
                  { required: true, message: 'Salary range is required' },
                  { max: 100, message: 'Salary must be 100 characters or less' }
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Work Arrangement'
                name='workArrangement'
                placeholder='Select work arrangement'
                options={dropdownOptions.workArrangement}
                rules={[{ required: true, message: 'Work arrangement is required' }]}
              />
            </Col>
          </Row>

          <FormTextArea
            label='Job Description'
            name='description'
            placeholder='Detailed description of the role, responsibilities, and what makes this opportunity unique...'
            rows={4}
            rules={[{ required: true, message: 'Job description is required' }]}
          />

          <FormTextArea
            label='Benefits & Perks'
            name='benefits'
            placeholder='Health insurance, retirement plans, flexible PTO, professional development...'
            rows={3}
          />

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormSelect label='Status' name='status' placeholder='Select status' options={dropdownOptions.status} />
            </Col>
            <Col xs={24} lg={12}>
              <FormSwitch label='Remote Work Available' name='remote' checkedChildren='Yes' unCheckedChildren='No' />
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
              <FormSelect
                label='Experience Required'
                name='experienceRequired'
                placeholder='Select experience level'
                options={dropdownOptions.experienceRequired}
                rules={[{ required: true, message: 'Experience level is required' }]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Education Level'
                name='educationLevel'
                placeholder='Select education level'
                options={dropdownOptions.educationLevel}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormInput
                label='Field of Study'
                name='fieldOfStudy'
                placeholder='e.g. Computer Science, Engineering'
                rules={[{ max: 255, message: 'Field of study must be 255 characters or less' }]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Industry Experience'
                name='industryExperience'
                placeholder='Select industry'
                options={dropdownOptions.industryExperience}
              />
            </Col>
          </Row>

          <FormTextArea
            label='Required Skills'
            name='requiredSkills'
            placeholder='JavaScript, React, Node.js, SQL, Git...'
            rows={3}
            rules={[{ required: true, message: 'Required skills are required' }]}
            formItemProps={{
              extra: 'List the essential technical and professional skills'
            }}
          />

          <FormTextArea
            label='Soft Skills'
            name='softSkills'
            placeholder='Communication, teamwork, problem-solving, leadership...'
            rows={3}
            formItemProps={{
              extra: 'List desired interpersonal and soft skills'
            }}
          />

          <FormTextArea
            label='Tools & Technologies'
            name='toolsRequired'
            placeholder='VS Code, Jira, Slack, AWS, Docker...'
            rows={3}
            formItemProps={{
              extra: 'List specific tools and technologies'
            }}
          />

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormInput
                label='Certifications Required'
                name='certificationsRequired'
                placeholder='e.g. AWS Certified, PMP, etc.'
                rules={[{ max: 255, message: 'Certifications must be 255 characters or less' }]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Visa Sponsorship'
                name='visaSponsorship'
                placeholder='Select sponsorship availability'
                options={dropdownOptions.visaSponsorship}
              />
            </Col>
          </Row>

          <FormSelect
            label='Travel Requirements'
            name='travelRequirements'
            placeholder='Select travel requirements'
            options={dropdownOptions.travelRequirements}
          />
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
          <FormCheckbox
            label='Employment Types'
            name='employmentTypes'
            options={dropdownOptions.employmentTypes}
            rules={[{ required: true, message: 'At least one employment type is required' }]}
            formItemProps={{
              extra: 'Select all applicable employment types'
            }}
          />

          <Divider>Application Requirements</Divider>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormSwitch
                label='Resume Required'
                name='resumeRequired'
                checkedChildren='Required'
                unCheckedChildren='Optional'
                defaultChecked={true}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Cover Letter'
                name='coverLetterRequired'
                placeholder='Select requirement level'
                options={dropdownOptions.coverLetterRequired}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <FormSelect
                label='Portfolio'
                name='portfolioRequired'
                placeholder='Select requirement level'
                options={dropdownOptions.portfolioRequired}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormSelect
                label='References'
                name='referencesRequired'
                placeholder='Select requirement level'
                options={dropdownOptions.referencesRequired}
              />
            </Col>
          </Row>

          <FormTextArea
            label='Application Instructions'
            name='applicationInstructions'
            placeholder='Special instructions for applicants, submission guidelines, or additional requirements...'
            rows={4}
            formItemProps={{
              extra: 'Provide any special instructions for applicants'
            }}
          />

          <FormTextArea
            label='Screening Questions'
            name='screeningQuestions'
            placeholder='1. Why are you interested in this role?&#10;2. What is your experience with [specific technology]?&#10;3. Are you authorized to work in [country]?'
            rows={4}
            formItemProps={{
              extra: 'Add custom questions to screen candidates'
            }}
          />
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
              <FormInput
                label='Current Applicants'
                name='applicants'
                placeholder='0'
                type='number'
                min={0}
                formItemProps={{
                  extra: 'Current number of applicants (auto-updated)'
                }}
              />
            </Col>
            <Col xs={24} lg={12}>
              <FormInput
                label='Date Posted'
                name='datePosted'
                type='date'
                formItemProps={{
                  extra: 'When this job was first posted'
                }}
              />
            </Col>
          </Row>

          <FormTextArea
            label='Custom Fields (JSON)'
            name='customFields'
            placeholder='[{"field": "value"}, {"another": "field"}]'
            rows={4}
            formItemProps={{
              extra: 'Additional custom data in JSON format (for advanced users)'
            }}
          />
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
