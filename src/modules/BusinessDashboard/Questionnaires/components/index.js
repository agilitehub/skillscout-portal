// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheckCircle, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Select, message, Tag, Spin, Alert } from 'antd'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'

// Import controller functions
import { getAllQuestionnaires, deleteQuestionnaire, searchQuestionnaires } from '../utils/controller'
import Toolbar from '../../../../core/components/Toolbar'

const { Option } = Select

/**
 * Questionnaires Management Page
 * Manages questionnaires with multiple questions using TableView component
 */
const Questionnaires = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Data states
  const [questionnaireData, setQuestionnaireData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch questionnaires data
  const fetchQuestionnaires = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const result = await getAllQuestionnaires(filters)

      if (result.success) {
        setQuestionnaireData(result.data)
      } else {
        setError(result.error)
        message.error(`Failed to fetch questionnaires: ${result.error}`)
      }
    } catch (err) {
      setError(err.message)
      message.error('An unexpected error occurred while fetching questionnaires')
      console.error('Error fetching questionnaires:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Search questionnaires
  const handleSearch = useCallback(
    async (searchValue) => {
      if (!searchValue.trim()) {
        await fetchQuestionnaires()
        return
      }

      try {
        setLoading(true)
        setError(null)

        const result = await searchQuestionnaires(searchValue, {
          status: selectedStatus !== 'all' ? selectedStatus : undefined
        })

        if (result.success) {
          setQuestionnaireData(result.data)
        } else {
          setError(result.error)
          message.error(`Search failed: ${result.error}`)
        }
      } catch (err) {
        setError(err.message)
        message.error('Search failed')
        console.error('Error searching questionnaires:', err)
      } finally {
        setLoading(false)
      }
    },
    [selectedStatus, fetchQuestionnaires]
  )

  // Effect to fetch data on component mount and when filters change
  useEffect(() => {
    const filters = {}
    if (selectedStatus !== 'all') {
      filters.status = selectedStatus
    }
    fetchQuestionnaires(filters)
  }, [fetchQuestionnaires, selectedStatus])

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
        fetchQuestionnaires(filters)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, handleSearch, fetchQuestionnaires, selectedStatus])

  // Filter data based on search and status (client-side backup filtering)
  const filteredData = questionnaireData.filter((questionnaire) => {
    const matchesSearch =
      searchTerm === '' ||
      questionnaire.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questionnaire.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questionnaire.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === 'all' || questionnaire.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Handle add new questionnaire - navigate to separate page
  const handleAdd = useCallback(() => {
    console.log('Create Questionnaire button clicked - navigating to create page')
    try {
      navigate('/business-dashboard/questionnaires/create')
      console.log('Navigation called successfully')
    } catch (error) {
      console.error('Navigation error:', error)
      message.error('Failed to navigate to create page: ' + error.message)
    }
  }, [navigate])

  // Handle edit existing questionnaire
  const handleEdit = useCallback(
    (questionnaire) => {
      navigate('/business-dashboard/questionnaires/edit', {
        state: {
          editId: questionnaire.id,
          initialData: questionnaire
        }
      })
    },
    [navigate]
  )

  // Handle delete questionnaire
  const handleDelete = useCallback(
    async (id) => {
      try {
        const result = await deleteQuestionnaire(id)

        if (result.success) {
          message.success('Questionnaire deleted successfully')
          await fetchQuestionnaires()
        } else {
          message.error(`Failed to delete questionnaire: ${result.error}`)
        }
      } catch (error) {
        message.error('Failed to delete questionnaire')
        console.error('Error deleting questionnaire:', error)
      }
    },
    [fetchQuestionnaires]
  )

  // Truncate text for display
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text || ''
    return text.substring(0, maxLength) + '...'
  }

  // Questionnaire table columns
  const questionnaireColumns = [
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
          className={`font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-400'}`}
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
              key: 'edit',
              tooltip: 'Edit Questionnaire',
              onClick: (record) => handleEdit(record)
            },
            {
              key: 'delete',
              icon: faTrash,
              tooltip: 'Delete Questionnaire',
              confirm: {
                title: 'Delete Questionnaire',
                description: 'Are you sure you want to delete this questionnaire? This will also delete all questions.',
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

        <div className='relative z-10'>
          <Toolbar
            title='Questionnaires'
            description='Manage your questionnaires'
            renderActions={() => {
              return (
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
              )
            }}
          />

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

          <div className='pl-5 pr-5 pt-2'>
            {/* Questionnaire Data Table */}
            <Spin spinning={loading} tip='Loading questionnaires...'>
              <TableView
                columns={questionnaireColumns}
                dataSource={filteredData}
                rowKey='id'
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                searchPlaceholder='Search questionnaires...'
                toolbarActions={[
                  <Button
                    key='create'
                    type='primary'
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleAdd}
                    className='form-btn-primary'
                    size='large'
                  >
                    Create Questionnaire
                  </Button>
                ]}
                pagination={{
                  total: filteredData.length,
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} questionnaires`
                }}
                emptyText={loading ? 'Loading questionnaires...' : 'No questionnaires found'}
              />
            </Spin>
          </div>
        </div>
      </div>
    </>
  )
})

Questionnaires.displayName = 'Questionnaires'

export default Questionnaires
