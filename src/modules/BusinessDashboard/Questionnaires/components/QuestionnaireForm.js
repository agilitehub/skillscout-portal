// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect } from 'react'
import { Card, Form, message, Row, Col, Select, Input, Switch, Divider, Spin } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faQuestion, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Toolbar } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import { updateQuestionnaire, getQuestionnaireById } from '../utils/controller'
import {
  getQuestionsByQuestionnaireId,
  createQuestionnaireQuestion,
  updateQuestionnaireQuestion,
  deleteQuestionnaireQuestion
} from '../utils/questionnaire-questions-controller'

const { Option } = Select
const { TextArea } = Input

/**
 * Questionnaire Form Page Component
 * Supports editing questionnaire profiles with questions
 */
const QuestionnaireForm = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [questionForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  // Question management state
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionnaireQuestions, setQuestionnaireQuestions] = useState([])
  const [questionLoading, setQuestionLoading] = useState(false)
  const [questionSubmitLoading, setQuestionSubmitLoading] = useState(false)

  // Get edit data from navigation state
  const editId = location.state?.editId || null
  const initialData = location.state?.initialData || null
  const isEditMode = Boolean(editId)

  // Fetch questions for a questionnaire
  const fetchQuestionsForQuestionnaire = useCallback(async (questionnaireId) => {
    if (!questionnaireId) {
      setQuestionnaireQuestions([])
      return
    }

    try {
      setQuestionLoading(true)
      const result = await getQuestionsByQuestionnaireId(questionnaireId)

      if (result.success) {
        setQuestionnaireQuestions(result.data)
      } else {
        message.error(`Failed to fetch questions: ${result.error}`)
        setQuestionnaireQuestions([])
      }
    } catch (err) {
      message.error('Failed to fetch questions')
      setQuestionnaireQuestions([])
      console.error('Error fetching questions:', err)
    } finally {
      setQuestionLoading(false)
    }
  }, [])

  // Load data for edit mode
  useEffect(() => {
    const loadQuestionnaireData = async () => {
      if (isEditMode) {
        if (initialData) {
          // Use provided initial data
          form.setFieldsValue({
            title: initialData.title,
            status: initialData.status,
            isActive: initialData.isActive,
            category: initialData.category,
            tags: initialData.tags || []
          })

          // Fetch questions for this questionnaire
          await fetchQuestionsForQuestionnaire(initialData.id)
        } else if (editId) {
          // Fallback: fetch if somehow we don't have the data
          setLoadingData(true)
          try {
            const result = await getQuestionnaireById(editId)
            if (result.success) {
              form.setFieldsValue({
                title: result.data.title,
                status: result.data.status,
                isActive: result.data.isActive,
                category: result.data.category,
                tags: result.data.tags || []
              })

              await fetchQuestionsForQuestionnaire(result.data.id)
            } else {
              message.error('Failed to load questionnaire data: ' + result.error)
              navigate('/business-dashboard/questionnaires')
            }
          } catch (error) {
            console.error('Error loading questionnaire data:', error)
            message.error('An unexpected error occurred while loading questionnaire data')
            navigate('/business-dashboard/questionnaires')
          } finally {
            setLoadingData(false)
          }
        }
      } else {
        // Set default values for new questionnaire
        form.setFieldsValue({
          isActive: true,
          status: 'Draft'
        })
      }
    }

    loadQuestionnaireData()
  }, [editId, isEditMode, form, initialData, navigate, fetchQuestionsForQuestionnaire])

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)

        if (isEditMode && editId) {
          const result = await updateQuestionnaire(editId, values)
          if (result.success) {
            message.success('Questionnaire updated successfully')
            navigate('/business-dashboard/questionnaires')
          } else {
            message.error(`Failed to update questionnaire: ${result.error}`)
          }
        } else {
          message.error('Only editing is supported on this page')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        message.error(`An unexpected error occurred while ${isEditMode ? 'updating' : 'creating'} the questionnaire`)
      } finally {
        setLoading(false)
      }
    },
    [isEditMode, editId, navigate]
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
      if (editId) {
        try {
          const result = await deleteQuestionnaireQuestion(questionId)
          if (result.success) {
            message.success('Question deleted successfully')
            await fetchQuestionsForQuestionnaire(editId)
          } else {
            message.error(`Failed to delete question: ${result.error}`)
          }
        } catch (error) {
          message.error('Failed to delete question')
          console.error('Error deleting question:', error)
        }
      }
    },
    [editId, fetchQuestionsForQuestionnaire]
  )

  const handleQuestionSubmit = useCallback(
    async (values) => {
      try {
        setQuestionSubmitLoading(true)
        if (editId) {
          let result
          if (editingQuestion) {
            result = await updateQuestionnaireQuestion(editingQuestion.id, values)
          } else {
            result = await createQuestionnaireQuestion(editId, values)
          }

          if (result.success) {
            message.success(`${editingQuestion ? 'Updated' : 'Added'} question successfully`)
            await fetchQuestionsForQuestionnaire(editId)
          } else {
            message.error(`Failed to ${editingQuestion ? 'update' : 'add'} question: ${result.error}`)
            return
          }
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
    [editId, editingQuestion, questionForm, fetchQuestionsForQuestionnaire]
  )

  const handleCancel = useCallback(() => {
    form.resetFields()
    navigate('/business-dashboard/questionnaires')
  }, [form, navigate])

  // Truncate text for display
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text || ''
    return text.substring(0, maxLength) + '...'
  }

  // Questions table columns
  const questionColumns = [
    {
      title: 'ORDER',
      dataIndex: 'questionOrder',
      key: 'questionOrder',
      width: '10%',
      render: (order) => <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>#{order}</span>
    },
    {
      title: 'QUESTION',
      dataIndex: 'question',
      key: 'question',
      width: '80%',
      render: (text) => (
        <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{truncateText(text, 80)}</div>
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <TableActions
          record={record}
          actions={[
            {
              key: 'edit',
              tooltip: 'Edit Question',
              className: 'form-btn-primary',
              onClick: handleEditQuestion
            },
            {
              key: 'delete',
              icon: faTrash,
              tooltip: 'Delete Question',
              className: 'form-btn-danger',
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
        className={`min-h-screen ${
          darkMode
            ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
            : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
        }`}
      >
        <div className='relative z-10'>
          {/* Toolbar */}
          <Toolbar
            title='Edit Questionnaire'
            description='Update your questionnaire details and questions'
          />

          <div className='p-4 md:p-6'>
            <div className='max-w-7xl mx-auto'>

            {/* Form Card */}
            <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-lg`}>
              <Form
                form={form}
                layout='vertical'
                onFinish={handleFormSubmit}
                className='global-form'
                preserve={false}
                initialValues={{ isActive: true, status: 'Draft' }}
                loading={loadingData}
              >
                {/* Questionnaire Details Section */}
                <div className='mb-6'>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                    Questionnaire Details
                  </h3>

                  {/* Active Toggle */}
                  <div className='mb-6'>
                    <Form.Item label='Active' name='isActive' valuePropName='checked'>
                      <Switch defaultChecked={true} className='mr-3' />
                    </Form.Item>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label='Questionnaire Title'
                        name='title'
                        rules={[{ required: true, message: 'Please enter an questionnaire title' }]}
                      >
                        <Input placeholder='Enter questionnaire title...' style={{ fontWeight: '500' }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label='Status'
                        name='status'
                        rules={[{ required: true, message: 'Please select a status' }]}
                      >
                        <Select
                          placeholder='Select status'
                          style={{ fontWeight: '500' }}
                          dropdownClassName='global-dropdown'
                        >
                          <Option value='Draft'>Draft</Option>
                          <Option value='Active'>Active</Option>
                          <Option value='Inactive'>Inactive</Option>
                          <Option value='Archived'>Archived</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label='Category' name='category'>
                        <Select
                          placeholder='Select category'
                          style={{ fontWeight: '500' }}
                          dropdownClassName='global-dropdown'
                        >
                          <Option value='Technical'>Technical</Option>
                          <Option value='Behavioral'>Behavioral</Option>
                          <Option value='Cognitive'>Cognitive</Option>
                          <Option value='Portfolio'>Portfolio</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label='Tags' name='tags'>
                    <Select
                      mode='tags'
                      placeholder='Add tags (press Enter to add)'
                      style={{ fontWeight: '500' }}
                      dropdownClassName='global-dropdown'
                    />
                  </Form.Item>
                </div>

                <Divider className={darkMode ? 'border-gray-600' : 'border-gray-200'} />

                {/* Questions Management Section */}
                <div className='mb-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      Questionnaire Questions ({questionnaireQuestions.length})
                    </h3>
                    <Button
                      type='primary'
                      icon={<FontAwesomeIcon icon={faQuestion} />}
                      onClick={handleAddQuestion}
                      className='form-btn-primary'
                      size='large'
                    >
                      Add Question
                    </Button>
                  </div>

                  <Spin spinning={questionLoading} tip='Loading questions...'>
                    <TableView
                      columns={questionColumns}
                      dataSource={questionnaireQuestions}
                      rowKey='id'
                      pagination={false}
                      emptyText='No questions added yet. Click "Add Question" to get started.'
                      size='small'
                    />
                  </Spin>
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
                    style={{ minWidth: '180px' }}
                  >
                    Update Questionnaire
                  </Button>
                </div>
              </Form>
            </Card>
            </div>
          </div>
        </div>

        {/* Add/Edit Question Modal - keeping this as modal since it's a sub-action */}
        {isQuestionModalVisible && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div
                className={`px-6 py-4 border-b ${darkMode ? 'border-gray-600 bg-emerald-700' : 'border-gray-200 bg-emerald-500'} rounded-t-lg`}
              >
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-white'>
                    {editingQuestion ? 'Edit Question' : 'Add Question'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsQuestionModalVisible(false)
                      setEditingQuestion(null)
                      questionForm.resetFields()
                    }}
                    className='text-white hover:text-gray-200 transition-colors p-1 rounded'
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>

              <div className='p-6'>
                <Form form={questionForm} layout='vertical' onFinish={handleQuestionSubmit} className='global-form'>
                  <Form.Item
                    label='Question'
                    name='question'
                    rules={[{ required: true, message: 'Please enter a question' }]}
                  >
                    <TextArea
                      placeholder='Enter the questionnaire question...'
                      rows={3}
                      style={{ fontWeight: '500' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label='Context'
                    name='context'
                    rules={[{ required: true, message: 'Please enter the context' }]}
                  >
                    <TextArea
                      placeholder='Provide context about what this question assesses...'
                      rows={4}
                      style={{ fontWeight: '500' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label='Preferred Feedback'
                    name='preferredFeedback'
                    rules={[{ required: true, message: 'Please enter preferred feedback guidelines' }]}
                  >
                    <TextArea
                      placeholder='Describe what to look for in good answers and how to evaluate responses...'
                      rows={4}
                      style={{ fontWeight: '500' }}
                    />
                  </Form.Item>

                  <div className='flex justify-end space-x-3 mt-6'>
                    <Button
                      variant='secondary'
                      onClick={() => {
                        setIsQuestionModalVisible(false)
                        setEditingQuestion(null)
                        questionForm.resetFields()
                      }}
                      disabled={questionSubmitLoading}
                      className='form-btn-secondary'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={questionSubmitLoading}
                      className='form-btn-primary'
                    >
                      {editingQuestion ? 'Update Question' : 'Add Question'}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
})

QuestionnaireForm.displayName = 'QuestionnaireForm'

export default QuestionnaireForm
