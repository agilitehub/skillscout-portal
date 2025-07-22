// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardCheck, faPlus, faArrowLeft, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Select, Modal, Form, message, Row, Col, Tag, Spin, Alert } from 'antd'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'

// Import enhanced form field components
import FormSelect from '../../../../core/components/form-components/form-fields/FormSelect'
import FormTextArea from '../../../../core/components/form-components/form-fields/FormTextArea'
import FormSwitch from '../../../../core/components/form-components/form-fields/FormSwitch'

// Import controller functions
import {
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  searchAssessments
} from '../utils/controller'

const { Option } = Select

/**
 * Assessments Management Page
 * Manages assessments with Question, Context, and Preferred Feedback fields
 */
const Assessments = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState(null)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)

  // Data states
  const [assessmentData, setAssessmentData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Fetch assessments data
  const fetchAssessments = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const result = await getAllAssessments(filters)

      if (result.success) {
        setAssessmentData(result.data)
      } else {
        setError(result.error)
        message.error(`Failed to fetch assessments: ${result.error}`)
      }
    } catch (err) {
      setError(err.message)
      message.error('An unexpected error occurred while fetching assessments')
      console.error('Error fetching assessments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Search assessments
  const handleSearch = useCallback(
    async (searchValue) => {
      if (!searchValue.trim()) {
        // If search is empty, fetch all assessments
        await fetchAssessments()
        return
      }

      try {
        setLoading(true)
        setError(null)

        const result = await searchAssessments(searchValue, {
          status: selectedStatus !== 'all' ? selectedStatus : undefined
        })

        if (result.success) {
          setAssessmentData(result.data)
        } else {
          setError(result.error)
          message.error(`Search failed: ${result.error}`)
        }
      } catch (err) {
        setError(err.message)
        message.error('Search failed')
        console.error('Error searching assessments:', err)
      } finally {
        setLoading(false)
      }
    },
    [selectedStatus, fetchAssessments]
  )

  // Effect to fetch data on component mount and when filters change
  useEffect(() => {
    const filters = {}
    if (selectedStatus !== 'all') {
      filters.status = selectedStatus
    }
    fetchAssessments(filters)
  }, [fetchAssessments, selectedStatus])

  // Effect to handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm)
      } else {
        const filters = {}
        if (selectedStatus !== 'all') {
          filters.status = selectedStatus
        }
        fetchAssessments(filters)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, handleSearch, fetchAssessments, selectedStatus])

  // Filter data based on search and status (client-side backup filtering)
  const filteredData = assessmentData.filter((assessment) => {
    const matchesSearch =
      searchTerm === '' ||
      assessment.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Handle add new assessment
  const handleAdd = useCallback(() => {
    setIsModalVisible(true)
    setEditingAssessment(null)
    form.resetFields()
  }, [form])

  // Handle edit existing assessment
  const handleEdit = useCallback(
    (assessment) => {
      setEditingAssessment(assessment)
      setIsModalVisible(true)

      // Populate form with existing data
      form.setFieldsValue({
        question: assessment.question,
        context: assessment.context,
        preferredFeedback: assessment.preferredFeedback,
        status: assessment.status,
        isActive: assessment.isActive,
        category: assessment.category,
        tags: assessment.tags || []
      })
    },
    [form]
  )

  // Handle view assessment
  const handleView = useCallback((assessment) => {
    setSelectedAssessment(assessment)
    setIsViewModalVisible(true)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      try {
        setSubmitLoading(true)
        setError(null)

        let result
        if (editingAssessment) {
          // Update existing assessment
          result = await updateAssessment(editingAssessment.id, values)
        } else {
          // Create new assessment
          result = await createAssessment(values)
        }

        if (result.success) {
          message.success(`${editingAssessment ? 'Updated' : 'Created'} assessment successfully`)
          setIsModalVisible(false)
          setEditingAssessment(null)
          form.resetFields()

          // Refresh the assessments list
          await fetchAssessments()
        } else {
          message.error(`Failed to ${editingAssessment ? 'update' : 'create'} assessment: ${result.error}`)
        }
      } catch (error) {
        message.error(`Failed to ${editingAssessment ? 'update' : 'create'} assessment`)
        console.error('Error submitting assessment:', error)
      } finally {
        setSubmitLoading(false)
      }
    },
    [editingAssessment, form, fetchAssessments]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (id) => {
      try {
        const result = await deleteAssessment(id)

        if (result.success) {
          message.success('Assessment deleted successfully')
          // Refresh the assessments list
          await fetchAssessments()
        } else {
          message.error(`Failed to delete assessment: ${result.error}`)
        }
      } catch (error) {
        message.error('Failed to delete assessment')
        console.error('Error deleting assessment:', error)
      }
    },
    [fetchAssessments]
  )

  // Truncate text for display
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text || ''
    return text.substring(0, maxLength) + '...'
  }

  // Table columns
  const columns = [
    {
      title: 'QUESTION',
      dataIndex: 'question',
      key: 'question',
      render: (text) => (
        <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{truncateText(text, 80)}</div>
      )
    },
    {
      title: 'CATEGORY',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag color={text === 'Technical' ? 'blue' : 'green'}>{text}</Tag>,
      width: 120
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          <FontAwesomeIcon icon={status === 'Active' ? faCheckCircle : faTimesCircle} className='mr-1' />
          {status}
        </span>
      ),
      width: 100
    },
    {
      title: 'COMPLETIONS',
      dataIndex: 'completions',
      key: 'completions',
      render: (count) => <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count}</span>,
      width: 100
    },
    {
      title: 'AVG SCORE',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score) => (
        <span
          className={`font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
        >
          {score}%
        </span>
      ),
      width: 100
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <TableActions
          record={record}
          actions={[
            {
              key: 'view',
              onClick: handleView
            },
            {
              key: 'edit',
              onClick: handleEdit
            },
            {
              key: 'delete',
              confirm: {
                title: 'Delete Assessment',
                description: 'Are you sure you want to delete this assessment?',
                okText: 'Yes',
                cancelText: 'No',
                onConfirm: (record) => handleDelete(record.id)
              }
            }
          ]}
        />
      ),
      width: 120
    }
  ]

  // Expandable row content
  const expandedRowRender = (record) => {
    return (
      <div className='px-4 pb-4'>
        <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Context:</h4>
            <p className='text-sm leading-relaxed'>{record.context}</p>
          </div>

          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Preferred Feedback:
            </h4>
            <p className='text-sm leading-relaxed'>{record.preferredFeedback}</p>
          </div>

          {record.tags && record.tags.length > 0 && (
            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Tags:</h4>
              <div className='flex flex-wrap gap-2'>
                {record.tags.map((tag, index) => (
                  <Tag key={index} color='blue' className='text-xs'>
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

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
        <div className='p-6 ml-64 relative z-10'>
          <div className='max-w-7xl mx-auto'>
            {/* Breadcrumb Navigation */}
            <div className='flex items-center mb-4'>
              <Button
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate('/business-dashboard')}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  borderColor: darkMode ? '#6b7280' : '#d1d5db',
                  color: darkMode ? '#e5e7eb' : '#6b7280',
                  marginRight: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#4b5563' : '#f9fafb'
                  e.target.style.borderColor = darkMode ? '#4b5563' : '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#374151' : '#ffffff'
                  e.target.style.borderColor = darkMode ? '#6b7280' : '#d1d5db'
                }}
              >
                Back to Dashboard
              </Button>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Business Dashboard / Assessments
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                message='Error'
                description={error}
                type='error'
                showIcon
                closable
                onClose={() => setError(null)}
                className='mb-4'
              />
            )}

            {/* Toolbar with Title */}
            <div
              className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : ''}`}
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className={`text-lg mr-3 ${darkMode ? 'text-emerald-400' : 'text-white'}`}
                  />
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>Assessments</h1>
                </div>

                <div className='flex items-center space-x-3'>
                  <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    className={`w-48 ${darkMode ? 'dark-select' : ''}`}
                    style={{
                      backgroundColor: darkMode ? '#4b5563' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Option value='all'>All Status</Option>
                    <Option value='Active'>Active</Option>
                    <Option value='Draft'>Draft</Option>
                    <Option value='Inactive'>Inactive</Option>
                    <Option value='Archived'>Archived</Option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assessment Data Table */}
            <Spin spinning={loading} tip='Loading assessments...'>
              <TableView
                columns={columns}
                dataSource={filteredData}
                rowKey='id'
                expandedRowRender={expandedRowRender}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                searchPlaceholder='Search assessments...'
                toolbarActions={[
                  <Button key='create' type='primary' icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleAdd}>
                    Create New
                  </Button>
                ]}
                pagination={{
                  total: filteredData.length,
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} assessments`
                }}
                emptyText={loading ? 'Loading assessments...' : 'No assessments found'}
              />
            </Spin>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          title={
            <span className='text-white font-semibold text-lg'>
              {editingAssessment ? 'Edit Assessment' : 'New Assessment'}
            </span>
          }
          open={isModalVisible}
          onCancel={() => {
            if (!submitLoading) {
              setIsModalVisible(false)
              setEditingAssessment(null)
              form.resetFields()
            }
          }}
          footer={null}
          width={800}
          styles={{
            content: {
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '12px',
              border: `2px solid ${darkMode ? '#059669' : '#10b981'}`
            },
            header: {
              backgroundColor: darkMode ? '#059669' : '#10b981',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '20px 24px'
            }
          }}
          className={darkMode ? 'dark-modal' : ''}
          closable={!submitLoading}
        >
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg mb-4`}>
            <Spin spinning={submitLoading} tip={`${editingAssessment ? 'Updating' : 'Creating'} assessment...`}>
              <Form
                form={form}
                layout='vertical'
                onFinish={handleSubmit}
                onFinishFailed={(errorInfo) => {
                  message.error('Please fill in all required fields')
                }}
                initialValues={{ isActive: true, status: 'Draft' }}
              >
                {/* Active Toggle */}
                <div className='mb-6'>
                  <FormSwitch
                    label='Active'
                    name='isActive'
                    defaultChecked={true}
                    switchProps={{
                      className: 'mr-3',
                      style: {
                        backgroundColor: darkMode ? '#059669' : '#10b981'
                      }
                    }}
                  />
                </div>

                <Row gutter={16}>
                  <Col span={16}>
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
                  </Col>
                  <Col span={8}>
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
                  </Col>
                </Row>

                <FormTextArea
                  label='Question'
                  name='question'
                  placeholder='Enter the assessment question...'
                  rows={3}
                  rules={[{ required: true, message: 'Please enter a question' }]}
                  customStyle={{
                    borderColor: darkMode ? '#10b981' : '#10b981',
                    fontWeight: '500'
                  }}
                />

                <FormTextArea
                  label='Context'
                  name='context'
                  placeholder='Provide context about what this question assesses...'
                  rows={4}
                  rules={[{ required: true, message: 'Please enter the context' }]}
                  customStyle={{
                    borderColor: darkMode ? '#10b981' : '#10b981',
                    fontWeight: '500'
                  }}
                />

                <FormTextArea
                  label='Preferred Feedback'
                  name='preferredFeedback'
                  placeholder='Describe what to look for in good answers and how to evaluate responses...'
                  rows={4}
                  rules={[{ required: true, message: 'Please enter preferred feedback guidelines' }]}
                  customStyle={{
                    borderColor: darkMode ? '#10b981' : '#10b981',
                    fontWeight: '500'
                  }}
                />

                <FormSelect
                  label='Tags'
                  name='tags'
                  placeholder='Add tags (press Enter to add)'
                  options={[]}
                  selectProps={{
                    mode: 'tags'
                  }}
                  customStyle={{
                    fontWeight: '500'
                  }}
                />

                <div className='flex justify-end space-x-3 mt-8'>
                  <Button
                    onClick={() => {
                      if (!submitLoading) {
                        setIsModalVisible(false)
                        setEditingAssessment(null)
                        form.resetFields()
                      }
                    }}
                    disabled={submitLoading}
                    className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                      darkMode
                        ? 'bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                    className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                      darkMode
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500'
                    }`}
                  >
                    {editingAssessment ? 'Update' : 'Create'}
                  </Button>
                </div>
              </Form>
            </Spin>
          </div>
        </Modal>

        {/* View Modal */}
        <Modal
          title={<span className='text-white font-semibold text-lg'>Assessment Details</span>}
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={null}
          width={800}
          styles={{
            content: {
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '12px',
              border: `2px solid ${darkMode ? '#059669' : '#10b981'}`
            },
            header: {
              backgroundColor: darkMode ? '#059669' : '#10b981',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '20px 24px'
            }
          }}
          className={darkMode ? 'dark-modal' : ''}
        >
          {selectedAssessment && (
            <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
              <div className='space-y-6'>
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Question
                  </h3>
                  <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedAssessment.question}
                  </p>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Context
                  </h3>
                  <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedAssessment.context}
                  </p>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Preferred Feedback
                  </h3>
                  <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedAssessment.preferredFeedback}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      Category
                    </h4>
                    <Tag color={selectedAssessment.category === 'Technical' ? 'blue' : 'green'}>
                      {selectedAssessment.category}
                    </Tag>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Status</h4>
                    <Tag color={selectedAssessment.status === 'Active' ? 'green' : 'orange'}>
                      {selectedAssessment.status}
                    </Tag>
                  </div>
                </div>

                {selectedAssessment.tags && selectedAssessment.tags.length > 0 && (
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Tags</h4>
                    <div className='flex flex-wrap gap-2'>
                      {selectedAssessment.tags.map((tag, index) => (
                        <Tag key={index} color='blue'>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                <div className='grid grid-cols-3 gap-4 mt-6'>
                  <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedAssessment.completions}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completions</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedAssessment.totalAttempts}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Attempts</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div
                      className={`text-2xl font-bold ${
                        selectedAssessment.averageScore >= 80
                          ? 'text-green-500'
                          : selectedAssessment.averageScore >= 60
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}
                    >
                      {selectedAssessment.averageScore}%
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Average Score</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  )
})

Assessments.displayName = 'Assessments'

export default Assessments
