// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React from 'react'
import { Card, Form, Space, Row, Col, Tabs, Spin, Input, Select } from 'antd'
import { Button, BusinessDashboardPageShell, Toolbar, ThemedModal } from '../../../../core/components'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
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
import { useJobDescriptionForm } from '../hooks/useJobDescriptionForm'
import { groupJobDescriptionValidationErrorsByTab } from '../model'

import '../styles/job-description-form.css'

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
  const {
    form,
    loading,
    departments,
    experienceLevels,
    lookupsLoading,
    initialDataLoading,
    tabValidationErrors,
    validationModalVisible,
    setValidationModalVisible,
    validationErrors,
    activeTab,
    fieldCompletionCounts,
    isEditMode,
    handleFormSubmit,
    handleSaveClick,
    handleValidationModalOk,
    handleFormChange,
    handleTabChange
  } = useJobDescriptionForm(user)

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
    <BusinessDashboardPageShell className='relative overflow-hidden'>
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
                    size='small'
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
                                  notFoundContent={
                                    lookupsLoading ? <Spin size='small' /> : 'No experience levels found'
                                  }
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
                                    Add relevant keywords to help with categorization and search. Press Enter or comma
                                    to separate.
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
                                  Enter each responsibility on a new line. Bullet points will be automatically
                                  formatted.
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
                              rules={[
                                { required: true, message: 'Please enter education and experience requirements' }
                              ]}
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
                      type='default'
                      onClick={() => navigate('/business-dashboard/job-descriptions')}
                      size='large'
                      className='form-btn-secondary'
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
              <ThemedModal
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
                    {groupJobDescriptionValidationErrorsByTab(validationErrors).map((tabGroup) => (
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
                      💡 <strong>Tip:</strong> Click "Take Me There" to automatically navigate to the first missing
                      field.
                    </p>
                  </div>
                </div>
              </ThemedModal>
            </Card>
          </div>
        </div>
      </div>

    </BusinessDashboardPageShell>
  )
})

export default CreateJobDescription
