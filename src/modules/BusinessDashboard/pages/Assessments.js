// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, Button, Modal, Form, Input, Select, Tag, Space, Tooltip, Progress, Statistic, Row, Col, Alert } from 'antd'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faClipboardCheck,
  faCode,
  faBrain,
  faUsers,
  faChartBar,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faPlay,
  faPause
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import BusinessSidebar from '../components/BusinessSidebar'

const { TextArea } = Input
const { Option } = Select

/**
 * Assessments page for managing skill assessments and candidate testing
 * Allows creation and management of various assessment types
 */
const Assessments = React.memo(() => {
  const { darkMode } = useTheme()
  const location = useLocation()
  
  // Get job context from navigation state
  const jobContext = location.state?.jobContext
  const highlightJobId = location.state?.highlightJobId
  
  // State management
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [form] = Form.useForm()

  // Mock data for assessments
  const mockAssessments = useMemo(() => [
    {
      id: '1',
      title: 'React Developer Assessment',
      type: 'Technical',
      category: 'Frontend Development',
      difficulty: 'Intermediate',
      duration: 60,
      questions: 25,
      status: 'Active',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      completions: 45,
      averageScore: 78,
      description: 'Comprehensive assessment covering React fundamentals, hooks, state management, and best practices.',
      skills: ['React', 'JavaScript', 'JSX', 'Hooks', 'State Management'],
      passingScore: 70,
      totalAttempts: 52,
      successRate: 73
    },
    {
      id: '2',
      title: 'Product Management Skills',
      type: 'Behavioral',
      category: 'Product Management',
      difficulty: 'Advanced',
      duration: 45,
      questions: 20,
      status: 'Active',
      createdDate: '2024-01-18',
      lastUpdated: '2024-01-22',
      completions: 23,
      averageScore: 82,
      description: 'Assessment focusing on product strategy, roadmap planning, stakeholder management, and analytical thinking.',
      skills: ['Product Strategy', 'Analytics', 'Leadership', 'Communication'],
      passingScore: 75,
      totalAttempts: 28,
      successRate: 79
    },
    {
      id: '3',
      title: 'Data Science Fundamentals',
      type: 'Technical',
      category: 'Data Science',
      difficulty: 'Advanced',
      duration: 90,
      questions: 30,
      status: 'Draft',
      createdDate: '2024-01-25',
      lastUpdated: '2024-01-26',
      completions: 0,
      averageScore: 0,
      description: 'In-depth assessment covering statistics, machine learning, Python, and data analysis techniques.',
      skills: ['Python', 'Statistics', 'Machine Learning', 'Data Analysis'],
      passingScore: 80,
      totalAttempts: 0,
      successRate: 0
    },
    {
      id: '4',
      title: 'UX Design Principles',
      type: 'Portfolio',
      category: 'Design',
      difficulty: 'Intermediate',
      duration: 120,
      questions: 15,
      status: 'Active',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15',
      completions: 18,
      averageScore: 85,
      description: 'Portfolio-based assessment evaluating design thinking, user research, prototyping, and visual design skills.',
      skills: ['User Research', 'Prototyping', 'Visual Design', 'Figma'],
      passingScore: 75,
      totalAttempts: 21,
      successRate: 86
    }
  ], [])

  // Load assessments
  useEffect(() => {
    const loadAssessments = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        setAssessments(mockAssessments)
      } catch (error) {
        console.error('Error loading assessments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAssessments()
  }, [mockAssessments])

  // Handle modal operations
  const handleCreateAssessment = useCallback(() => {
    setModalMode('create')
    setSelectedAssessment(null)
    form.resetFields()
    setIsModalVisible(true)
  }, [form])

  const handleEditAssessment = useCallback((assessment) => {
    setModalMode('edit')
    setSelectedAssessment(assessment)
    form.setFieldsValue({
      ...assessment,
      skills: assessment.skills.join(', ')
    })
    setIsModalVisible(true)
  }, [form])

  const handleViewAssessment = useCallback((assessment) => {
    setModalMode('view')
    setSelectedAssessment(assessment)
    setIsModalVisible(true)
  }, [])

  const handleDeleteAssessment = useCallback((assessmentId) => {
    Modal.confirm({
      title: 'Delete Assessment',
      content: 'Are you sure you want to delete this assessment? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setAssessments(prev => prev.filter(assessment => assessment.id !== assessmentId))
      }
    })
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
    setSelectedAssessment(null)
    form.resetFields()
  }, [form])

  const handleFormSubmit = useCallback(async (values) => {
    try {
      const processedValues = {
        ...values,
        skills: values.skills ? values.skills.split(',').map(skill => skill.trim()) : []
      }

      if (modalMode === 'create') {
        const newAssessment = {
          id: Date.now().toString(),
          ...processedValues,
          createdDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          completions: 0,
          averageScore: 0,
          totalAttempts: 0,
          successRate: 0
        }
        setAssessments(prev => [newAssessment, ...prev])
      } else if (modalMode === 'edit') {
        setAssessments(prev => 
          prev.map(assessment => 
            assessment.id === selectedAssessment.id 
              ? { ...assessment, ...processedValues, lastUpdated: new Date().toISOString().split('T')[0] }
              : assessment
          )
        )
      }
      handleModalClose()
    } catch (error) {
      console.error('Error saving assessment:', error)
    }
  }, [modalMode, selectedAssessment, handleModalClose])

  // Get assessment type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Technical': return faCode
      case 'Behavioral': return faBrain
      case 'Portfolio': return faClipboardCheck
      default: return faClipboardCheck
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'green'
      case 'Intermediate': return 'orange'
      case 'Advanced': return 'red'
      default: return 'blue'
    }
  }

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const activeAssessments = assessments.filter(a => a.status === 'Active')
    const totalCompletions = assessments.reduce((sum, a) => sum + a.completions, 0)
    const totalAttempts = assessments.reduce((sum, a) => sum + a.totalAttempts, 0)
    const avgSuccessRate = assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.successRate, 0) / assessments.length)
      : 0

    return {
      totalAssessments: assessments.length,
      activeAssessments: activeAssessments.length,
      totalCompletions,
      avgSuccessRate
    }
  }, [assessments])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {darkMode ? (
          <>
            <div 
              className="absolute -top-[10%] -right-[10%] w-1/2 h-1/2 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)' }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl opacity-80" />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl opacity-80" />
            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-amber-400/30 to-transparent rounded-full blur-3xl opacity-80" />
          </>
        )}
      </div>

      <BusinessSidebar />
      <div className="p-6 ml-64 relative z-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Assessments
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage skill assessments for candidate evaluation
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleCreateAssessment}
            style={{
              background: darkMode ? '#059669' : '#10b981',
              borderColor: darkMode ? '#059669' : '#10b981'
            }}
          >
            Create Assessment
          </Button>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={12} sm={6}>
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : ''}>Total Assessments</span>}
                value={overallStats.totalAssessments}
                prefix={<FontAwesomeIcon icon={faClipboardCheck} className="text-blue-500" />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : ''}>Active</span>}
                value={overallStats.activeAssessments}
                prefix={<FontAwesomeIcon icon={faCode} className="text-green-500" />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : ''}>Completions</span>}
                value={overallStats.totalCompletions}
                prefix={<FontAwesomeIcon icon={faUsers} className="text-purple-500" />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <Statistic
                title={<span className={darkMode ? 'text-gray-300' : ''}>Success Rate</span>}
                value={overallStats.avgSuccessRate}
                suffix="%"
                prefix={<FontAwesomeIcon icon={faChartBar} className="text-orange-500" />}
                valueStyle={{ color: darkMode ? '#ffffff' : '#1f2937' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Job Context Alert */}
      {jobContext && (
        <Alert
          message={`Viewing assessments related to: ${jobContext.title} at ${jobContext.company}`}
          description={`You navigated here from the job listing. Assessments suitable for "${jobContext.title}" will be highlighted.`}
          type="info"
          showIcon
          closable
          className="mb-6"
          style={{
            backgroundColor: darkMode ? '#1f2937' : '#e6f3ff',
            borderColor: darkMode ? '#374151' : '#91d5ff',
            color: darkMode ? '#e5e7eb' : '#1f2937'
          }}
        />
      )}

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {assessments.map((assessment) => {
          const isRelated = jobContext && (
            assessment.title.toLowerCase().includes(jobContext.title.toLowerCase()) ||
            assessment.category.toLowerCase().includes(jobContext.title.toLowerCase()) ||
            assessment.skills.some(skill => 
              jobContext.title.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(jobContext.title.toLowerCase())
            )
          )
          
          return (
          <Card
            key={assessment.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} ${
              isRelated ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
            } shadow-lg hover:shadow-xl transition-all duration-200`}
            loading={loading}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                  style={{
                    background: darkMode 
                      ? 'linear-gradient(135deg, #059669, #047857)' 
                      : 'linear-gradient(135deg, #10b981, #059669)'
                  }}
                >
                  <FontAwesomeIcon 
                    icon={getTypeIcon(assessment.type)} 
                    className="text-white text-sm" 
                  />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {assessment.title}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {assessment.category}
                  </p>
                </div>
              </div>
              <Tag color={assessment.status === 'Active' ? 'green' : assessment.status === 'Draft' ? 'orange' : 'red'}>
                {assessment.status}
              </Tag>
            </div>

            {/* Description */}
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {assessment.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {assessment.duration}m
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Duration
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {assessment.questions}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Questions
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {assessment.completions}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {assessment.averageScore}%
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Avg Score
                </div>
              </div>
            </div>

            {/* Success Rate Progress */}
            {assessment.totalAttempts > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Success Rate
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {assessment.successRate}%
                  </span>
                </div>
                <Progress 
                  percent={assessment.successRate} 
                  size="small" 
                  strokeColor={assessment.successRate >= 70 ? '#10b981' : assessment.successRate >= 50 ? '#f59e0b' : '#ef4444'}
                  showInfo={false}
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              <Tag color={getDifficultyColor(assessment.difficulty)} size="small">
                {assessment.difficulty}
              </Tag>
              <Tag color="blue" size="small">
                {assessment.type}
              </Tag>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Skills Assessed:
              </div>
              <div className="flex flex-wrap gap-1">
                {assessment.skills.slice(0, 3).map((skill, index) => (
                  <Tag key={index} size="small" color="purple">
                    {skill}
                  </Tag>
                ))}
                {assessment.skills.length > 3 && (
                  <Tag size="small" color="default">
                    +{assessment.skills.length - 3} more
                  </Tag>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Tooltip title="View Details">
                  <Button
                    type="text"
                    size="small"
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => handleViewAssessment(assessment)}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </Tooltip>
                <Tooltip title="Edit Assessment">
                  <Button
                    type="text"
                    size="small"
                    icon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => handleEditAssessment(assessment)}
                    className="text-green-500 hover:text-green-700"
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    size="small"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    className="text-red-500 hover:text-red-700"
                  />
                </Tooltip>
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Updated {new Date(assessment.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </Card>
          )
        })}
      </div>

      {/* Assessment Modal */}
      <Modal
        title={
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
            {modalMode === 'create' ? 'Create Assessment' : modalMode === 'edit' ? 'Edit Assessment' : 'Assessment Details'}
          </span>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={modalMode === 'view' ? [
          <Button key="close" onClick={handleModalClose}>Close</Button>
        ] : [
          <Button key="cancel" onClick={handleModalClose}>Cancel</Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
            style={{
              background: darkMode ? '#059669' : '#10b981',
              borderColor: darkMode ? '#059669' : '#10b981'
            }}
          >
            {modalMode === 'create' ? 'Create Assessment' : 'Update Assessment'}
          </Button>
        ]}
        width={800}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: { backgroundColor: darkMode ? '#1f2937' : '#ffffff' },
          body: { backgroundColor: darkMode ? '#1f2937' : '#ffffff' }
        }}
      >
        {modalMode === 'view' && selectedAssessment ? (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedAssessment.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedAssessment.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAssessment.type}</span>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAssessment.category}</span>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty:</span>
                <Tag color={getDifficultyColor(selectedAssessment.difficulty)} className="ml-2">
                  {selectedAssessment.difficulty}
                </Tag>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration:</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAssessment.duration} minutes</span>
              </div>
            </div>

            <div>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Skills Assessed:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedAssessment.skills.map((skill, index) => (
                  <Tag key={index} color="purple">
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedAssessment.completions}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Completions
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedAssessment.averageScore}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Average Score
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedAssessment.successRate}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            className={darkMode ? 'dark-form' : ''}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Assessment Title</span>}
                name="title"
                rules={[{ required: true, message: 'Please enter assessment title' }]}
              >
                <Input placeholder="e.g. React Developer Assessment" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Category</span>}
                name="category"
                rules={[{ required: true, message: 'Please enter category' }]}
              >
                <Input placeholder="e.g. Frontend Development" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Assessment Type</span>}
                name="type"
                rules={[{ required: true, message: 'Please select assessment type' }]}
              >
                <Select placeholder="Select assessment type">
                  <Option value="Technical">Technical</Option>
                  <Option value="Behavioral">Behavioral</Option>
                  <Option value="Portfolio">Portfolio</Option>
                  <Option value="Cognitive">Cognitive</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Difficulty Level</span>}
                name="difficulty"
                rules={[{ required: true, message: 'Please select difficulty level' }]}
              >
                <Select placeholder="Select difficulty">
                  <Option value="Beginner">Beginner</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Duration (minutes)</span>}
                name="duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input type="number" placeholder="60" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Number of Questions</span>}
                name="questions"
                rules={[{ required: true, message: 'Please enter number of questions' }]}
              >
                <Input type="number" placeholder="25" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Passing Score (%)</span>}
                name="passingScore"
                rules={[{ required: true, message: 'Please enter passing score' }]}
              >
                <Input type="number" placeholder="70" />
              </Form.Item>

              <Form.Item
                label={<span className={darkMode ? 'text-gray-300' : ''}>Status</span>}
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Draft">Draft</Option>
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Description</span>}
              name="description"
              rules={[{ required: true, message: 'Please enter assessment description' }]}
            >
              <TextArea 
                rows={3} 
                placeholder="Describe what this assessment evaluates..."
              />
            </Form.Item>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Skills (comma-separated)</span>}
              name="skills"
              rules={[{ required: true, message: 'Please enter skills assessed' }]}
            >
              <Input placeholder="React, JavaScript, Node.js, AWS" />
            </Form.Item>
          </Form>
        )}
      </Modal>
      </div>
    </div>
  )
})

Assessments.displayName = 'Assessments'

export default Assessments 