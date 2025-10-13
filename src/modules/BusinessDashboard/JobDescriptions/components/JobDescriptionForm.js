// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect } from 'react'
import { Card, Form, Space, message, Row, Col, Tabs, Spin, Input, Select, Modal } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faTimes,
  faFileText,
  faBuilding,
  faTasks,
  faClipboardList,
  faGraduationCap,
  faCode,
  faUsers,
  faStar,
  faUserTie,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import Toolbar from '../../../../core/components/Toolbar'
import {
  createJobDescription,
  updateJobDescription,
  getJobDescriptionById,
  getDepartments,
  getExperienceLevels
} from '../utils/controller'
import { parseKeywords } from '../utils/data-model'

const { TextArea } = Input
const { Option } = Select

const { TabPane } = Tabs

/**
 * CreateJobDescription page for creating new job descriptions and editing existing ones
 * Features a three-column layout for better organization of comprehensive form fields
 */
const CreateJobDescription = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [experienceLevels, setExperienceLevels] = useState([])
  const [lookupsLoading, setLookupsLoading] = useState(true)
  const [initialDataLoading, setInitialDataLoading] = useState(false)
  const [tabValidationErrors, setTabValidationErrors] = useState({
    basicInfo: false,
    detailedInfo: false
  })
  const [validationModalVisible, setValidationModalVisible] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [isFormReady, setIsFormReady] = useState(false)

  const [fieldCompletionCounts, setFieldCompletionCounts] = useState({
    basicInfo: { completed: 0, total: 6 },
    detailedInfo: { completed: 0, total: 5 }
  })

  // Check if we're in edit mode
  const isEditMode = location.state?.isEdit
  const editId = location.state?.editId

  // Calculate field completion counts
  const calculateFieldCounts = useCallback(() => {
    try {
      const values = form.getFieldsValue()

      // Debug log to see what values we're getting
      console.log('Calculating field counts with values:', values)

      // Basic Info required fields
      const basicInfoFields = ['title', 'department', 'reportsToRole', 'experienceLevel', 'keywords', 'overview']
      const basicInfoCompleted = basicInfoFields.filter((field) => {
        const value = values[field]
        if (field === 'keywords') {
          return Array.isArray(value) && value.length > 0
        }
        return value && String(value).trim().length > 0
      }).length

      // Detailed Info required fields
      const detailedInfoFields = [
        'responsibilities',
        'requirements',
        'educationExperience',
        'technicalSkills',
        'softSkills'
      ]
      const detailedInfoCompleted = detailedInfoFields.filter((field) => {
        const value = values[field]
        return value && String(value).trim().length > 0
      }).length

      console.log('Field counts calculated:', {
        basicInfo: { completed: basicInfoCompleted, total: 6 },
        detailedInfo: { completed: detailedInfoCompleted, total: 5 }
      })

      setFieldCompletionCounts({
        basicInfo: { completed: basicInfoCompleted, total: 6 },
        detailedInfo: { completed: detailedInfoCompleted, total: 5 }
      })
    } catch (error) {
      console.error('Error calculating field counts:', error)
    }
  }, [form])

  // Load lookup data on component mount
  useEffect(() => {
    loadLookupData()
    // For new forms (not edit mode), mark as ready after lookups load
    if (!isEditMode) {
      setTimeout(() => {
        console.log('New form ready after lookups loaded')
        setIsFormReady(true)
      }, 1000)
    }
  }, [isEditMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load existing data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      loadExistingJobDescription(editId)
    }
  }, [isEditMode, editId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate initial field counts when component mounts and when lookups are loaded
  useEffect(() => {
    if (!lookupsLoading && !initialDataLoading) {
      // Add a delay to ensure form values are properly set
      setTimeout(() => {
        calculateFieldCounts()
      }, 200)
    }
    // eslint-disable-next-line
  }, [lookupsLoading, initialDataLoading])

  // Additional effect to recalculate when form gets populated (especially useful for edit mode)
  useEffect(() => {
    if (!lookupsLoading && !initialDataLoading) {
      const formValues = form.getFieldsValue()
      // Check if form has been populated with meaningful data
      if (formValues.title || formValues.overview || formValues.responsibilities) {
        setTimeout(() => {
          calculateFieldCounts()
        }, 100)
      }
    }
  }, [form, lookupsLoading, initialDataLoading, calculateFieldCounts])

  // Force recalculation when the component is fully mounted and form is ready
  useEffect(() => {
    if (!lookupsLoading && !initialDataLoading) {
      // Use multiple attempts to ensure we catch the form when it's fully populated
      const timeouts = [500, 1000, 1500] // Try at 500ms, 1s, and 1.5s

      timeouts.forEach((delay) => {
        setTimeout(() => {
          const values = form.getFieldsValue()
          if (Object.keys(values).length > 0) {
            console.log('Force recalculating at', delay, 'ms with values:', values)
            calculateFieldCounts()
            setIsFormReady(true)
          }
        }, delay)
      })
    }
  }, [lookupsLoading, initialDataLoading, form, calculateFieldCounts])

  // Recalculate whenever the form becomes ready
  useEffect(() => {
    if (isFormReady) {
      console.log('Form is ready, calculating field counts...')
      calculateFieldCounts()
    }
  }, [isFormReady, calculateFieldCounts])

  // Load existing job description data for editing
  const loadExistingJobDescription = useCallback(
    async (id) => {
      try {
        setInitialDataLoading(true)
        const result = await getJobDescriptionById(id)

        if (result.success && result.data) {
          // Populate form with existing data
          form.setFieldsValue({
            title: result.data.title,
            overview: result.data.overview,
            department: result.data.department,
            reportsToRole: result.data.reportsToRole,
            experienceLevel: result.data.experienceLevel,
            keywords: result.data.keywords || [],
            responsibilities: result.data.responsibilities,
            requirements: result.data.requirements,
            educationExperience: result.data.educationExperience,
            technicalSkills: result.data.technicalSkills,
            softSkills: result.data.softSkills,
            preferredSkills: result.data.preferredSkills
          })

          // Calculate field counts after loading data and mark form as ready
          setTimeout(() => {
            calculateFieldCounts()
            setIsFormReady(true)
          }, 300)
        } else {
          console.error('Error loading job description for edit:', result.error)
          message.error('Failed to load job description data: ' + result.error)
          // Navigate back to list if we can't load the data
          navigate('/business-dashboard/job-descriptions')
        }
      } catch (error) {
        console.error('Unexpected error loading job description for edit:', error)
        message.error('An unexpected error occurred while loading the job description')
        navigate('/business-dashboard/job-descriptions')
      } finally {
        setInitialDataLoading(false)
      }
    },
    // eslint-disable-next-line
    [form, navigate]
  )

  // Load departments and experience levels
  const loadLookupData = useCallback(async () => {
    try {
      setLookupsLoading(true)

      const [departmentsResult, experienceLevelsResult] = await Promise.all([getDepartments(), getExperienceLevels()])

      if (departmentsResult.success) {
        setDepartments(departmentsResult.data)
      } else {
        console.error('Error loading departments:', departmentsResult.error)
        message.error('Failed to load departments')
      }

      if (experienceLevelsResult.success) {
        setExperienceLevels(experienceLevelsResult.data)
      } else {
        console.error('Error loading experience levels:', experienceLevelsResult.error)
        message.error('Failed to load experience levels')
      }
    } catch (error) {
      console.error('Error loading lookup data:', error)
      message.error('Failed to load lookup data')
    } finally {
      setLookupsLoading(false)
    }
  }, [])

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        const processedValues = {
          title: values.title?.trim(),
          overview: values.overview?.trim(),
          department: values.department,
          reportsToRole: values.reportsToRole?.trim(),
          experienceLevel: values.experienceLevel,
          keywords: typeof values.keywords === 'string' ? parseKeywords(values.keywords) : values.keywords || [],
          responsibilities: values.responsibilities?.trim() || '',
          requirements: values.requirements?.trim() || '',
          educationExperience: values.educationExperience?.trim() || '',
          technicalSkills: values.technicalSkills?.trim() || '',
          softSkills: values.softSkills?.trim() || '',
          preferredSkills: values.preferredSkills?.trim() || ''
        }

        // Clear validation errors on successful validation
        setTabValidationErrors({
          basicInfo: false,
          detailedInfo: false
        })

        let result
        if (isEditMode && editId) {
          // Update existing job description
          result = await updateJobDescription(editId, processedValues, user)
          if (result.success) {
            message.success('Job description updated successfully!')
            navigate('/business-dashboard/job-descriptions')
          } else {
            console.error('Error updating job description:', result.error)
            message.error('Failed to update job description: ' + result.error)
          }
        } else {
          // Create new job description
          result = await createJobDescription(processedValues, user)
          if (result.success) {
            message.success('Job description created successfully!')
            navigate('/business-dashboard/job-descriptions')
          } else {
            console.error('Error creating job description:', result.error)
            message.error('Failed to create job description: ' + result.error)
          }
        }
      } catch (error) {
        console.error('Unexpected error submitting job description:', error)
        message.error('An unexpected error occurred while saving the job description')
      } finally {
        setLoading(false)
      }
    },
    [user, navigate, isEditMode, editId]
  )

  // Handle form validation and submission
  const handleSaveClick = useCallback(async () => {
    try {
      // Validate all fields first
      const values = await form.validateFields()
      await handleFormSubmit(values)
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo)

      // Count errors by tab
      const basicInfoFields = ['title', 'department', 'reportsToRole', 'experienceLevel', 'keywords', 'overview']
      const detailedInfoFields = [
        'responsibilities',
        'requirements',
        'educationExperience',
        'technicalSkills',
        'softSkills'
      ]

      const basicInfoErrors = errorInfo.errorFields?.filter((field) => basicInfoFields.includes(field.name[0])) || []

      const detailedInfoErrors =
        errorInfo.errorFields?.filter((field) => detailedInfoFields.includes(field.name[0])) || []

      // Create structured error list for modal
      const errorList = []
      const fieldLabels = {
        title: 'Job Title',
        department: 'Department',
        reportsToRole: 'Reports To Role',
        experienceLevel: 'Experience Level',
        keywords: 'Keywords',
        overview: 'Job Overview',
        responsibilities: 'Responsibilities',
        requirements: 'Requirements',
        educationExperience: 'Education and Experience',
        technicalSkills: 'Technical Skills',
        softSkills: 'Soft Skills'
      }

      if (basicInfoErrors.length > 0) {
        basicInfoErrors.forEach((field) => {
          errorList.push({
            tab: 'Basic Information',
            tabKey: '1',
            field: fieldLabels[field.name[0]] || field.name[0],
            type: 'basic'
          })
        })
      }

      if (detailedInfoErrors.length > 0) {
        detailedInfoErrors.forEach((field) => {
          errorList.push({
            tab: 'Detailed Information',
            tabKey: '2',
            field: fieldLabels[field.name[0]] || field.name[0],
            type: 'detailed'
          })
        })
      }

      // Update tab validation states
      setTabValidationErrors({
        basicInfo: basicInfoErrors.length > 0,
        detailedInfo: detailedInfoErrors.length > 0
      })

      // Set validation errors and show modal
      setValidationErrors(errorList)
      setValidationModalVisible(true)

      // Switch to the first tab with errors
      if (basicInfoErrors.length > 0) {
        setActiveTab('1')
      } else if (detailedInfoErrors.length > 0) {
        setActiveTab('2')
      }
    }
  }, [form, handleFormSubmit])

  // Handle validation modal close and navigate to field
  const handleValidationModalOk = useCallback(() => {
    setValidationModalVisible(false)

    // Switch to first tab with errors and scroll to first error
    const firstError = validationErrors[0]
    if (firstError) {
      setActiveTab(firstError.tabKey)

      // Map field labels back to field names for scrolling
      const fieldNameMap = {
        'Job Title': 'title',
        Department: 'department',
        'Reports To Role': 'reportsToRole',
        'Experience Level': 'experienceLevel',
        Keywords: 'keywords',
        'Job Overview': 'overview',
        Responsibilities: 'responsibilities',
        Requirements: 'requirements',
        'Education and Experience': 'educationExperience',
        'Technical Skills': 'technicalSkills',
        'Soft Skills': 'softSkills'
      }

      const fieldName = fieldNameMap[firstError.field]

      // Small delay to allow tab switch, then scroll to first error
      setTimeout(() => {
        if (fieldName) {
          form.scrollToField(fieldName)
        }
      }, 300)
    }
  }, [validationErrors, form])

  // Clear validation errors when form values change
  const handleFormChange = useCallback(() => {
    // Update field completion counts with multiple attempts to ensure accuracy
    setTimeout(() => {
      calculateFieldCounts()
    }, 50)

    setTimeout(() => {
      calculateFieldCounts()
    }, 200)

    // Clear validation error indicators when user starts making changes
    if (tabValidationErrors.basicInfo || tabValidationErrors.detailedInfo || validationModalVisible) {
      setTabValidationErrors({
        basicInfo: false,
        detailedInfo: false
      })
      setValidationModalVisible(false)
      setValidationErrors([])
    }
    // eslint-disable-next-line
  }, [tabValidationErrors, validationModalVisible, calculateFieldCounts])

  // Handle tab change and recalculate counts
  const handleTabChange = useCallback((newActiveKey) => {
    setActiveTab(newActiveKey)
    // Recalculate field counts when switching tabs
    setTimeout(() => {
      calculateFieldCounts()
    }, 50)
    // eslint-disable-next-line
  }, [])

  // Completion Badge Component
  const CompletionBadge = ({ completed, total, darkMode }) => {
    const isComplete = completed === total
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
      <span
        className={`completion-badge inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${
          isComplete
            ? darkMode
              ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : darkMode
              ? 'bg-orange-900 text-orange-200 border border-orange-700'
              : 'bg-orange-100 text-orange-800 border border-orange-200'
        }`}
        title={`${completed} of ${total} required fields completed (${percentage}%)`}
      >
        {completed}/{total}
      </span>
    )
  }

  return (
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

      {/* Main Content */}
      <div className='relative z-10'>
        {/* Toolbar */}
        <Toolbar
          title={isEditMode ? 'Edit Job Description' : 'Create New Job Description'}
          description={
            isEditMode
              ? 'Update the job description details below'
              : 'Create a comprehensive job description to attract the right candidates'
          }
        />

        <div className='p-6'>
          <div className='max-w-7xl mx-auto'>
            <Card
            className={`shadow-xl ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              borderColor: darkMode ? '#4B5563' : '#e5e7eb'
            }}
          >
            {/* Show loading spinner while loading initial data */}
            {initialDataLoading ? (
              <div className='flex justify-center items-center py-20'>
                <Spin size='large' />
                <span className={`ml-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading job description data...
                </span>
              </div>
            ) : (
              <Form
                form={form}
                layout='vertical'
                onFinish={handleFormSubmit}
                onValuesChange={handleFormChange}
                scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
                className='global-form'
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  size='large'
                  className={`${darkMode ? 'dark-tabs' : ''}`}
                >
                  {/* Tab 1: Basic Information & Job Details */}
                  <TabPane
                    tab={
                      <span className='flex items-center'>
                        <FontAwesomeIcon icon={faBuilding} />
                        <span className='ml-2'>Basic Information</span>
                        <CompletionBadge
                          completed={fieldCompletionCounts.basicInfo.completed}
                          total={fieldCompletionCounts.basicInfo.total}
                          darkMode={darkMode}
                        />
                        {tabValidationErrors.basicInfo && (
                          <span className='tab-error-indicator ml-2' title='Required fields missing'></span>
                        )}
                      </span>
                    }
                    key='1'
                  >
                    <Row gutter={32}>
                      <Col span={12}>
                        <div
                          className={`space-y-4 p-6 rounded-lg border ${
                            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                          style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}
                        >
                          <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              Basic Details
                            </h3>
                          </div>

                          <div
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Form.Item
                              label='Job Title'
                              name='title'
                              rules={[
                                { required: true, message: 'Please enter job title' },
                                { max: 255, message: 'Job title must be 255 characters or less' }
                              ]}
                            >
                              <Input
                                placeholder='e.g. Senior React Developer'
                                prefix={<FontAwesomeIcon icon={faFileText} className='text-gray-400' />}
                                style={{ fontWeight: '500' }}
                              />
                            </Form.Item>

                            <Form.Item
                              label='Department'
                              name='department'
                              rules={[{ required: true, message: 'Please select a department' }]}
                              extra={
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Select the department this role belongs to
                                </span>
                              }
                            >
                              <Select
                                placeholder={lookupsLoading ? 'Loading departments...' : 'Select department'}
                                allowClear={true}
                                loading={lookupsLoading}
                                disabled={lookupsLoading}
                                notFoundContent={lookupsLoading ? <Spin size='small' /> : 'No departments found'}
                                dropdownClassName={darkMode ? 'dark-select-dropdown' : ''}
                                style={{ fontWeight: '500' }}
                              >
                                {departments.map((dept) => (
                                  <Option key={dept.id} value={dept.id}>
                                    {dept.label}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              label='Reports To Role'
                              name='reportsToRole'
                              rules={[
                                { required: true, message: 'Please enter the role this position reports to' },
                                { max: 255, message: 'Reports To Role must be 255 characters or less' }
                              ]}
                              extra={
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Specify the job title or role that this position will report to
                                </span>
                              }
                            >
                              <Input
                                placeholder='e.g. Engineering Manager, Director of Product, VP of Engineering'
                                prefix={<FontAwesomeIcon icon={faUserTie} className='text-gray-400' />}
                                style={{ fontWeight: '500' }}
                              />
                            </Form.Item>

                            <Form.Item
                              label='Experience Level'
                              name='experienceLevel'
                              rules={[{ required: true, message: 'Please select an experience level' }]}
                              extra={
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Select the required experience level for this role
                                </span>
                              }
                            >
                              <Select
                                placeholder={
                                  lookupsLoading ? 'Loading experience levels...' : 'Select experience level'
                                }
                                allowClear={true}
                                loading={lookupsLoading}
                                disabled={lookupsLoading}
                                notFoundContent={lookupsLoading ? <Spin size='small' /> : 'No experience levels found'}
                                dropdownClassName={darkMode ? 'dark-select-dropdown' : ''}
                                style={{ fontWeight: '500' }}
                              >
                                {experienceLevels.map((level) => (
                                  <Option key={level.id} value={level.id}>
                                    {level.label}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              label='Keywords'
                              name='keywords'
                              rules={[{ required: true, message: 'Please add at least one keyword' }]}
                              extra={
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Add relevant keywords to help with categorization and search. Press Enter or comma to
                                  separate.
                                </span>
                              }
                            >
                              <Select
                                mode='tags'
                                placeholder='Add keywords like: javascript, react, senior, remote, frontend, engineer'
                                tokenSeparators={[',', '\n']}
                                dropdownClassName={darkMode ? 'dark-select-dropdown' : ''}
                                style={{ fontWeight: '500' }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div
                          className={`space-y-4 p-6 rounded-lg border ${
                            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                          style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}
                        >
                          <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              Job Overview
                            </h3>
                          </div>

                          <Form.Item
                            name='overview'
                            rules={[{ required: true, message: 'Please enter job overview' }]}
                            extra={
                              <span className={darkMode ? 'text-gray-400 mt-2' : 'text-gray-600 mt-2'}>
                                Provide a compelling overview of the role and what makes it attractive to candidates
                              </span>
                            }
                            style={{ marginBottom: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}
                          >
                            <TextArea
                              placeholder='Describe the role, its importance to the company, and what the successful candidate will achieve...'
                              showCount={true}
                              maxLength={2000}
                              style={{
                                fontWeight: '500',
                                marginBottom: '15px',
                                flex: 1,
                                minHeight: '485px',
                                resize: 'vertical'
                              }}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>

                  {/* Tab 2: Detailed Information */}
                  <TabPane
                    tab={
                      <span className='flex items-center'>
                        <FontAwesomeIcon icon={faTasks} />
                        <span className='ml-2'>Detailed Information</span>
                        <CompletionBadge
                          completed={fieldCompletionCounts.detailedInfo.completed}
                          total={fieldCompletionCounts.detailedInfo.total}
                          darkMode={darkMode}
                        />
                        {tabValidationErrors.detailedInfo && (
                          <span className='tab-error-indicator ml-2' title='Required fields missing'></span>
                        )}
                      </span>
                    }
                    key='2'
                  >
                    <Row gutter={32}>
                      <Col span={24}>
                        <div
                          className={`space-y-6 p-6 rounded-lg border ${
                            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              Detailed Information
                            </h3>
                          </div>

                          <Form.Item
                            label={
                              <Space>
                                <span>Responsibilities</span>
                                <FontAwesomeIcon icon={faTasks} className='text-gray-400' />
                              </Space>
                            }
                            name='responsibilities'
                            rules={[{ required: true, message: 'Please enter job responsibilities' }]}
                            extra={
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Enter each responsibility on a new line. Bullet points will be automatically formatted.
                              </span>
                            }
                          >
                            <TextArea
                              placeholder={`• Lead development of new features and products
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews and architecture decisions`}
                              rows={8}
                              showCount={true}
                              style={{ fontWeight: '500' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <Space>
                                <span>Requirements</span>
                                <FontAwesomeIcon icon={faClipboardList} className='text-gray-400' />
                              </Space>
                            }
                            name='requirements'
                            rules={[{ required: true, message: 'Please enter job requirements' }]}
                            extra={
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                List the essential skills, qualifications, and experience needed for this role
                              </span>
                            }
                          >
                            <TextArea
                              placeholder={`• 5+ years of experience with React and modern JavaScript
• Strong understanding of software engineering principles
• Experience with REST APIs and database design
• Excellent communication and collaboration skills`}
                              rows={8}
                              showCount={true}
                              style={{ fontWeight: '500' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <Space>
                                <span>Education and Experience</span>
                                <FontAwesomeIcon icon={faGraduationCap} className='text-gray-400' />
                              </Space>
                            }
                            name='educationExperience'
                            rules={[{ required: true, message: 'Please enter education and experience requirements' }]}
                            extra={
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Specify educational background and years of experience required
                              </span>
                            }
                          >
                            <TextArea
                              placeholder={`• Bachelor's degree in Computer Science, Engineering, or related field
• 5+ years of professional software development experience
• Master's degree preferred
• Experience in agile development environments`}
                              rows={6}
                              showCount={true}
                              style={{ fontWeight: '500' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <Space>
                                <span>Technical Skills</span>
                                <FontAwesomeIcon icon={faCode} className='text-gray-400' />
                              </Space>
                            }
                            name='technicalSkills'
                            rules={[{ required: true, message: 'Please enter required technical skills' }]}
                            extra={
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                List the specific technical skills and technologies required
                              </span>
                            }
                          >
                            <TextArea
                              placeholder={`• Proficiency in JavaScript, TypeScript, React, Node.js
• Experience with databases (SQL, NoSQL)
• Knowledge of cloud platforms (AWS, Azure, GCP)
• Familiarity with CI/CD pipelines and DevOps practices`}
                              rows={6}
                              showCount={true}
                              style={{ fontWeight: '500' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <Space>
                                <span>Soft Skills</span>
                                <FontAwesomeIcon icon={faUsers} className='text-gray-400' />
                              </Space>
                            }
                            name='softSkills'
                            rules={[{ required: true, message: 'Please enter required soft skills' }]}
                            extra={
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Describe the interpersonal and communication skills needed
                              </span>
                            }
                          >
                            <TextArea
                              placeholder={`• Excellent written and verbal communication skills
• Strong problem-solving and analytical thinking
• Ability to work collaboratively in cross-functional teams
• Leadership and mentoring capabilities`}
                              rows={6}
                              showCount={true}
                              style={{ fontWeight: '500' }}
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <Space>
                                <span>Preferred/Bonus Skills</span>
                                <FontAwesomeIcon icon={faStar} className='text-gray-400' />
                              </Space>
                            }
                            name='preferredSkills'
                            extra={
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                List any additional skills that would be beneficial but not required
                              </span>
                            }
                          >
                            <TextArea
                              placeholder={`• Experience with machine learning or AI technologies
• Contributions to open-source projects
• Public speaking or technical writing experience
• Additional certifications in relevant technologies`}
                              rows={6}
                              showCount={true}
                              style={{ fontWeight: '500' }}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>

                {/* Form Actions at Bottom */}
                <div
                  className={`flex justify-end space-x-3 pt-6 mt-6 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                >
                  <Button
                    icon={<FontAwesomeIcon icon={faTimes} className='mr-2' />}
                    onClick={() => navigate('/business-dashboard/job-descriptions')}
                    size='large'
                    style={{
                      backgroundColor: darkMode ? '#dc2626' : '#6b7280',
                      borderColor: darkMode ? '#dc2626' : '#6b7280',
                      color: '#ffffff',
                      fontWeight: '500'
                    }}
                    className={
                      darkMode ? 'hover:bg-red-700 hover:border-red-700' : 'hover:bg-gray-600 hover:border-gray-600'
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type='primary'
                    icon={<FontAwesomeIcon icon={faSave} className='mr-2' />}
                    onClick={handleSaveClick}
                    loading={loading}
                    disabled={initialDataLoading}
                    size='large'
                    style={{
                      backgroundColor: '#10b981',
                      borderColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: '500'
                    }}
                    className='hover:bg-emerald-700 hover:border-emerald-700'
                  >
                    {isEditMode ? 'Update Job Description' : 'Save Job Description'}
                  </Button>
                </div>
              </Form>
            )}

            {/* Validation Error Modal */}
            <Modal
              title={
                <div className='flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faExclamationTriangle} className='text-red-500' />
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>Incomplete Required Fields</span>
                </div>
              }
              open={validationModalVisible}
              onOk={handleValidationModalOk}
              onCancel={() => setValidationModalVisible(false)}
              okText='Take Me There'
              cancelText='Close'
              width={500}
              className={darkMode ? 'dark-modal' : ''}
              okButtonProps={{
                icon: <FontAwesomeIcon icon={faCheckCircle} className='mr-2' />,
                size: 'large',
                style: {
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                  color: '#ffffff'
                },
                className: 'hover:bg-emerald-700 hover:border-emerald-700'
              }}
              cancelButtonProps={{
                size: 'large',
                style: {
                  backgroundColor: darkMode ? '#4b5563' : '#6b7280',
                  borderColor: darkMode ? '#4b5563' : '#6b7280',
                  color: '#ffffff'
                },
                className: darkMode
                  ? 'hover:bg-gray-700 hover:border-gray-700'
                  : 'hover:bg-gray-600 hover:border-gray-600'
              }}
            >
              <div className='py-4'>
                <p className={`text-base mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Please complete the following required fields before saving:
                </p>

                <div className='space-y-3'>
                  {validationErrors
                    .reduce((acc, error) => {
                      const existingTab = acc.find((tab) => tab.tabKey === error.tabKey)
                      if (existingTab) {
                        existingTab.fields.push(error.field)
                      } else {
                        acc.push({
                          tabKey: error.tabKey,
                          tab: error.tab,
                          fields: [error.field]
                        })
                      }
                      return acc
                    }, [])
                    .map((tabGroup) => (
                      <div
                        key={tabGroup.tabKey}
                        className={`p-3 rounded-lg border ${
                          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className='flex items-center space-x-2 mb-2'>
                          <FontAwesomeIcon
                            icon={tabGroup.tabKey === '1' ? faBuilding : faTasks}
                            className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}
                          />
                          <span className={`font-semibold text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                            {tabGroup.tab}
                          </span>
                        </div>
                        <ul className='space-y-1 ml-5'>
                          {tabGroup.fields.map((field, index) => (
                            <li
                              key={index}
                              className={`text-sm flex items-center space-x-2 ${
                                darkMode ? 'text-gray-300' : 'text-red-600'
                              }`}
                            >
                              <span className='w-1 h-1 bg-current rounded-full'></span>
                              <span>{field}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>

                <div
                  className={`mt-4 p-3 rounded-lg ${
                    darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    💡 <strong>Tip:</strong> Click "Take Me There" to automatically navigate to the first missing field.
                  </p>
                </div>
              </div>
            </Modal>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreateJobDescription
