// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardCheck, faPlus, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Select, message, Tag, Spin, Alert } from 'antd'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'

// Import controller functions
import { getAllAssessments, deleteAssessment, searchAssessments } from '../utils/controller'

const { Option } = Select

/**
 * Assessments Management Page
 * Manages assessments with multiple questions using TableView component
 */
const Assessments = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Data states
  const [assessmentData, setAssessmentData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  // Handle add new assessment - navigate to separate page
  const handleAdd = useCallback(() => {
    console.log('Create Assessment button clicked - navigating to create page')
    try {
      navigate('/business-dashboard/assessments/create')
      console.log('Navigation called successfully')
    } catch (error) {
      console.error('Navigation error:', error)
      message.error('Failed to navigate to create page: ' + error.message)
    }
  }, [navigate])

  // Handle edit existing assessment
  const handleEdit = useCallback(
    (assessment) => {
      navigate('/business-dashboard/assessments/edit', {
        state: {
          editId: assessment.id,
          initialData: assessment
        }
      })
    },
    [navigate]
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
      render: (text, record) => (
        <div
          className={`font-medium cursor-pointer transition-colors duration-200 ${
            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
          }`}
          onClick={() => handleEdit(record)}
        >
          {truncateText(text, 80)}
        </div>
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
        <div className='ml-64 relative z-10'>
          <div className='p-6'>
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
                    Create Assessment
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
      </div>
    </>
  )
})

Assessments.displayName = 'Assessments'

export default Assessments
