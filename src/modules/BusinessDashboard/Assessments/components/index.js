// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { BRAND_COLORS, DARK_THEME } from '../../../../core/theme/colors'
import BusinessSidebar from '../../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardCheck,
  faPlus,
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'
import { Select, Modal, Form, message, Row, Col, Tag, Spin, Alert, Divider } from 'antd'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'

// Import enhanced form field components
import FormSelect from '../../../../core/components/form-components/form-fields/FormSelect'
import FormTextArea from '../../../../core/components/form-components/form-fields/FormTextArea'
import FormSwitch from '../../../../core/components/form-components/form-fields/FormSwitch'
import FormInput from '../../../../core/components/form-components/form-fields/FormInput'

// Import controller functions
import {
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  searchAssessments
} from '../utils/controller'

// Import question controller functions
import {
  getQuestionsByAssessmentId,
  createAssessmentQuestion,
  updateAssessmentQuestion,
  deleteAssessmentQuestion
} from '../utils/assessment-questions-controller'

const { Option } = Select

/**
 * Assessments Management Page
 * Manages assessments with multiple questions using TableView component
 */
const Assessments = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [questionForm] = Form.useForm()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState(null)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)

  // Question management state
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [assessmentQuestions, setAssessmentQuestions] = useState([])
  const [questionLoading, setQuestionLoading] = useState(false)
  const [questionSubmitLoading, setQuestionSubmitLoading] = useState(false)

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

  // Fetch questions for an assessment
  const fetchQuestionsForAssessment = useCallback(async (assessmentId) => {
    if (!assessmentId) {
      setAssessmentQuestions([])
      return
    }

    try {
      setQuestionLoading(true)
      const result = await getQuestionsByAssessmentId(assessmentId)

      if (result.success) {
        setAssessmentQuestions(result.data)
      } else {
        message.error(`Failed to fetch questions: ${result.error}`)
        setAssessmentQuestions([])
      }
    } catch (err) {
      message.error('Failed to fetch questions')
      setAssessmentQuestions([])
      console.error('Error fetching questions:', err)
    } finally {
      setQuestionLoading(false)
    }
  }, [])

  // Search assessments
  const handleSearch = useCallback(
    async (searchValue) => {
      if (!searchValue.trim()) {
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
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, handleSearch, fetchAssessments, selectedStatus])

  // Filter data based on search and status (client-side backup filtering)
  const filteredData = assessmentData.filter((assessment) => {
    const matchesSearch =
      searchTerm === '' ||
      assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Handle add new assessment
  const handleAdd = useCallback(() => {
    setIsModalVisible(true)
    setEditingAssessment(null)
    setAssessmentQuestions([])
    form.resetFields()
  }, [form])

  // Handle edit existing assessment
  const handleEdit = useCallback(
    async (assessment) => {
      setEditingAssessment(assessment)
      setIsModalVisible(true)

      // Populate form with existing data
      form.setFieldsValue({
        title: assessment.title,
        status: assessment.status,
        isActive: assessment.isActive,
        category: assessment.category,
        tags: assessment.tags || []
      })

      // Fetch questions for this assessment
      await fetchQuestionsForAssessment(assessment.id)
    },
    [form, fetchQuestionsForAssessment]
  )

  // Handle view assessment
  const handleView = useCallback(
    async (assessment) => {
      setSelectedAssessment(assessment)
      setIsViewModalVisible(true)
      // Fetch questions for viewing
      await fetchQuestionsForAssessment(assessment.id)
    },
    [fetchQuestionsForAssessment]
  )

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

          // If we have questions to save and this is a new assessment, save them
          if (!editingAssessment && assessmentQuestions.length > 0) {
            for (const question of assessmentQuestions) {
              await createAssessmentQuestion(result.data.id, question)
            }
          }

          setIsModalVisible(false)
          setEditingAssessment(null)
          setAssessmentQuestions([])
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
    [editingAssessment, form, fetchAssessments, assessmentQuestions]
  )

  // Handle delete assessment
  const handleDelete = useCallback(
    async (id) => {
      try {
        const result = await deleteAssessment(id)

        if (result.success) {
          message.success('Assessment deleted successfully')
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

  // Question management functions
  const handleAddQuestion = useCallback(() => {
    setIsQuestionModalVisible(true)
    setEditingQuestion(null)
    questionForm.resetFields()
  }, [questionForm])

  const handleEditQuestion = useCallback(
    (question) => {
      setEditingQuestion(question)
      setIsQuestionModalVisible(true)
      questionForm.setFieldsValue({
        question: question.question,
        context: question.context,
        preferredFeedback: question.preferredFeedback
      })
    },
    [questionForm]
  )

  const handleDeleteQuestion = useCallback(
    async (questionId) => {
      if (editingAssessment) {
        // If editing existing assessment, delete from database
        try {
          const result = await deleteAssessmentQuestion(questionId)
          if (result.success) {
            message.success('Question deleted successfully')
            await fetchQuestionsForAssessment(editingAssessment.id)
          } else {
            message.error(`Failed to delete question: ${result.error}`)
          }
        } catch (error) {
          message.error('Failed to delete question')
          console.error('Error deleting question:', error)
        }
      } else {
        // If creating new assessment, remove from local state
        setAssessmentQuestions((prev) => prev.filter((q) => q.id !== questionId))
        message.success('Question removed')
      }
    },
    [editingAssessment, fetchQuestionsForAssessment]
  )

  const handleQuestionSubmit = useCallback(
    async (values) => {
      try {
        setQuestionSubmitLoading(true)
        if (editingAssessment) {
          // If editing existing assessment, save to database
          let result
          if (editingQuestion) {
            result = await updateAssessmentQuestion(editingQuestion.id, values)
          } else {
            result = await createAssessmentQuestion(editingAssessment.id, values)
          }

          if (result.success) {
            message.success(`${editingQuestion ? 'Updated' : 'Added'} question successfully`)
            await fetchQuestionsForAssessment(editingAssessment.id)
          } else {
            message.error(`Failed to ${editingQuestion ? 'update' : 'add'} question: ${result.error}`)
            return
          }
        } else {
          // If creating new assessment, add to local state
          const newQuestion = {
            id: Date.now(), // Temporary ID for new questions
            question: values.question,
            context: values.context,
            preferredFeedback: values.preferredFeedback,
            questionOrder: assessmentQuestions.length + 1,
            isActive: true
          }

          if (editingQuestion) {
            setAssessmentQuestions((prev) =>
              prev.map((q) => (q.id === editingQuestion.id ? { ...newQuestion, id: editingQuestion.id } : q))
            )
          } else {
            setAssessmentQuestions((prev) => [...prev, newQuestion])
          }
          message.success(`${editingQuestion ? 'Updated' : 'Added'} question successfully`)
        }

        setIsQuestionModalVisible(false)
        setEditingQuestion(null)
        questionForm.resetFields()
      } catch (error) {
        message.error('Failed to save question')
        console.error('Error saving question:', error)
      } finally {
        setQuestionSubmitLoading(false)
      }
    },
    [editingAssessment, editingQuestion, questionForm, fetchQuestionsForAssessment, assessmentQuestions]
  )

  // Truncate text for display
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text || ''
    return text.substring(0, maxLength) + '...'
  }

  // Assessment table columns
  const assessmentColumns = [
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
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
      title: 'QUESTIONS',
      dataIndex: 'questionCount',
      key: 'questionCount',
      render: (count) => (
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count || 0} questions</span>
      ),
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
                description: 'Are you sure you want to delete this assessment? This will also delete all questions.',
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

  // Questions table columns
  const questionColumns = [
    {
      title: 'ORDER',
      dataIndex: 'questionOrder',
      key: 'questionOrder',
      width: 70,
      render: (order) => <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>#{order}</span>
    },
    {
      title: 'QUESTION',
      dataIndex: 'question',
      key: 'question',
      width: 400,
      render: (text) => (
        <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{truncateText(text, 80)}</div>
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <TableActions
          record={record}
          actions={[
            {
              key: 'edit',
              onClick: handleEditQuestion
            },
            {
              key: 'delete',
              confirm: {
                title: 'Delete Question',
                description: 'Are you sure you want to delete this question?',
                okText: 'Yes',
                cancelText: 'No',
                onConfirm: (record) => handleDeleteQuestion(record.id)
              }
            }
          ]}
        />
      )
    }
  ]

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
                variant='ghost'
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate('/business-dashboard')}
                className={`mr-3 ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
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
              className={`rounded-lg mb-6 px-6 py-4 shadow-lg ${
                darkMode
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className={`text-lg mr-3 ${darkMode ? 'text-emerald-100' : 'text-white'}`}
                  />
                  <h1 className='text-xl font-bold text-white'>Assessments</h1>
                </div>

                <div className='flex items-center space-x-3'>
                  <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    className={`w-48 ${darkMode ? 'dark-select' : ''}`}
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
                columns={assessmentColumns}
                dataSource={filteredData}
                rowKey='id'
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                searchPlaceholder='Search assessments...'
                toolbarActions={[
                  <Button key='create' variant='primary' icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleAdd}>
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

        {/* Add/Edit Assessment Modal */}
        <Modal
          title={
            <div className='flex items-center justify-between w-full'>
              <span className='text-white font-semibold text-lg'>
                {editingAssessment ? 'Edit Assessment' : 'New Assessment'}
              </span>
              <button
                onClick={() => {
                  if (!submitLoading) {
                    setIsModalVisible(false)
                    setEditingAssessment(null)
                    form.resetFields()
                  }
                }}
                className='text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded'
                disabled={submitLoading}
              >
                <FontAwesomeIcon icon={faTimes} className='text-lg' />
              </button>
            </div>
          }
          open={isModalVisible}
          onCancel={() => {
            if (!submitLoading) {
              setIsModalVisible(false)
              setEditingAssessment(null)
              setAssessmentQuestions([])
              form.resetFields()
            }
          }}
          footer={null}
          width={1000}
          styles={{
            content: {
              backgroundColor: darkMode ? DARK_THEME.background.secondary : BRAND_COLORS.white,
              borderRadius: '12px',
              border: `2px solid ${darkMode ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.emeraldLight}`
            },
            header: {
              backgroundColor: darkMode ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.emeraldLight,
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '20px 24px'
            }
          }}
          className={darkMode ? 'dark-modal' : ''}
          closable={false}
        >
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg mb-4`}>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              onFinishFailed={(errorInfo) => {
                message.error('Please fill in all required fields')
              }}
              initialValues={{ isActive: true, status: 'Draft' }}
            >
                {/* Assessment Details Section */}
                <div className='mb-6'>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Assessment Details
                  </h3>

                  {/* Active Toggle */}
                  <div className='mb-6'>
                    <FormSwitch
                      label='Active'
                      name='isActive'
                      defaultChecked={true}
                      switchProps={{
                        className: 'mr-3'
                      }}
                    />
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <FormInput
                        label='Assessment Title'
                        name='title'
                        placeholder='Enter assessment title...'
                        rules={[{ required: true, message: 'Please enter an assessment title' }]}
                        customStyle={{
                          borderColor: darkMode ? BRAND_COLORS.emeraldLight : BRAND_COLORS.emeraldLight,
                          fontWeight: '500'
                        }}
                      />
                    </Col>
                    <Col span={6}>
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
                    <Col span={6}>
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
                </div>

                <Divider />

                {/* Questions Management Section */}
                <div className='mb-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      Assessment Questions ({assessmentQuestions.length})
                    </h3>
                    <Button
                      variant='primary'
                      icon={<FontAwesomeIcon icon={faQuestion} />}
                      onClick={handleAddQuestion}
                      className='bg-emerald-600 hover:bg-emerald-700 border-emerald-600'
                    >
                      Add Question
                    </Button>
                  </div>

                  <Spin spinning={questionLoading} tip='Loading questions...'>
                    <TableView
                      columns={questionColumns}
                      dataSource={assessmentQuestions}
                      rowKey='id'
                      pagination={false}
                      emptyText='No questions added yet. Click "Add Question" to get started.'
                      size='small'
                    />
                  </Spin>
                </div>

                <div className='flex justify-end space-x-3 mt-8'>
                  <Button
                    variant='danger'
                    onClick={() => {
                      if (!submitLoading) {
                        setIsModalVisible(false)
                        setEditingAssessment(null)
                        setAssessmentQuestions([])
                        form.resetFields()
                      }
                    }}
                    disabled={submitLoading}
                    className='px-6 py-2'
                  >
                    Cancel
                  </Button>
                  <Button variant='success' htmlType='submit' loading={submitLoading} className='px-6 py-2'>
                    {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
                  </Button>
                                 </div>
               </Form>
           </div>
         </Modal>

        {/* Add/Edit Question Modal */}
        <Modal
          title={
            <span className='text-white font-semibold text-lg'>
              {editingQuestion ? 'Edit Question' : 'Add Question'}
            </span>
          }
          open={isQuestionModalVisible}
                     onCancel={() => {
             if (!questionSubmitLoading) {
               setIsQuestionModalVisible(false)
               setEditingQuestion(null)
               questionForm.resetFields()
             }
           }}
          footer={null}
          width={800}
          styles={{
            content: {
              backgroundColor: darkMode ? DARK_THEME.background.secondary : BRAND_COLORS.white,
              borderRadius: '12px',
              border: `2px solid ${darkMode ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.emeraldLight}`
            },
            header: {
              backgroundColor: darkMode ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.emeraldLight,
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '20px 24px'
            }
          }}
          className={darkMode ? 'dark-modal' : ''}
        >
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg mb-4`}>
            <Form
              form={questionForm}
              layout='vertical'
              onFinish={handleQuestionSubmit}
              onFinishFailed={() => {
                message.error('Please fill in all required fields')
              }}
            >
              <FormTextArea
                label='Question'
                name='question'
                placeholder='Enter the assessment question...'
                rows={3}
                rules={[{ required: true, message: 'Please enter a question' }]}
                customStyle={{
                  borderColor: darkMode ? BRAND_COLORS.emeraldLight : BRAND_COLORS.emeraldLight,
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
                  borderColor: darkMode ? BRAND_COLORS.emeraldLight : BRAND_COLORS.emeraldLight,
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
                  borderColor: darkMode ? BRAND_COLORS.emeraldLight : BRAND_COLORS.emeraldLight,
                  fontWeight: '500'
                }}
              />

              <div className='flex justify-end space-x-3 mt-6'>
                                 <Button
                   variant='danger'
                   onClick={() => {
                     setIsQuestionModalVisible(false)
                     setEditingQuestion(null)
                     questionForm.resetFields()
                   }}
                   disabled={questionSubmitLoading}
                   className='px-6 py-2'
                 >
                   Cancel
                 </Button>
                                 <Button variant='success' htmlType='submit' loading={questionSubmitLoading} className='px-6 py-2'>
                   {editingQuestion ? 'Update Question' : 'Add Question'}
                 </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* View Assessment Modal */}
        <Modal
          title={
            <div className='flex items-center justify-between w-full'>
              <span className='text-white font-semibold text-lg'>Assessment Details</span>
              <button
                onClick={() => setIsViewModalVisible(false)}
                className='text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded'
              >
                <FontAwesomeIcon icon={faTimes} className='text-lg' />
              </button>
            </div>
          }
          open={isViewModalVisible}
          onCancel={() => {
            setIsViewModalVisible(false)
            setSelectedAssessment(null)
            setAssessmentQuestions([])
          }}
          footer={null}
          width={1000}
          styles={{
            content: {
              backgroundColor: darkMode ? DARK_THEME.background.secondary : BRAND_COLORS.white,
              borderRadius: '12px',
              border: `2px solid ${darkMode ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.emeraldLight}`
            },
            header: {
              backgroundColor: darkMode ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.emeraldLight,
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '20px 24px'
            }
          }}
          className={darkMode ? 'dark-modal' : ''}
          closable={false}
        >
          {selectedAssessment && (
            <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
              <div className='space-y-6'>
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {selectedAssessment.title}
                  </h3>
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

                <Divider />

                <div>
                  <h4 className={`font-medium mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Questions ({assessmentQuestions.length})
                  </h4>
                  <Spin spinning={questionLoading} tip='Loading questions...'>
                    <div className='space-y-4'>
                      {assessmentQuestions.map((question, index) => (
                        <div key={question.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                          <div className='flex items-start space-x-3'>
                            <span className={`font-bold text-lg ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                              #{index + 1}
                            </span>
                            <div className='flex-1'>
                              <h5 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {question.question}
                              </h5>
                              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Context:</strong> {question.context}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Feedback:</strong> {question.preferredFeedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {assessmentQuestions.length === 0 && (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No questions found for this assessment.
                        </div>
                      )}
                    </div>
                  </Spin>
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
