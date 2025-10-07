// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { message, Tag, Space, Modal, Descriptions } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import BusinessSidebar from '../../../../core/components/layout/Sidebar'
import KanbanBoard from './KanbanBoard'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

/**
 * Candidates Management Page
 * Kanban-style board for managing job application candidates with drag and drop
 */
const Candidates = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [draggedCandidate, setDraggedCandidate] = useState(null)
  const [lastDroppedCard, setLastDroppedCard] = useState(null)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'table'
  const [searchTerm, setSearchTerm] = useState('')
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [selectedJobListing, setSelectedJobListing] = useState(null) // Job listing filter

  // Load candidates data from localStorage or use default sample data
  const getInitialCandidatesData = () => {
    try {
      const saved = localStorage.getItem('candidatesData')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Error loading candidates data from localStorage:', error)
    }

    // Default sample data
    return {
      'application-received': [
        {
          id: 1,
          name: 'John Smith',
          position: 'Senior React Developer',
          jobListingId: 1,
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          appliedDate: '2024-01-15',
          priority: 'high',
          tags: ['React', 'JavaScript', 'Senior'],
          notes: 'Strong technical background with 5+ years experience'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          position: 'UX Designer',
          jobListingId: 2,
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 987-6543',
          appliedDate: '2024-01-14',
          priority: 'medium',
          tags: ['UI/UX', 'Figma', 'Design'],
          notes: 'Impressive portfolio with modern design approach'
        }
      ],
      screening: [
        {
          id: 3,
          name: 'Mike Chen',
          position: 'Full Stack Developer',
          jobListingId: 3,
          email: 'mike.chen@email.com',
          phone: '+1 (555) 456-7890',
          appliedDate: '2024-01-10',
          priority: 'high',
          tags: ['Full Stack', 'Node.js', 'Python'],
          notes: 'Passed initial screening, scheduling technical interview'
        }
      ],
      assessment: [
        {
          id: 7,
          name: 'Alex Rodriguez',
          position: 'Backend Developer',
          jobListingId: 5,
          email: 'alex.rodriguez@email.com',
          phone: '+1 (555) 678-9012',
          appliedDate: '2024-01-12',
          priority: 'medium',
          tags: ['Backend', 'Java', 'Spring'],
          notes: 'Completed coding assessment, results under review'
        }
      ],
      'technical-interview': [
        {
          id: 4,
          name: 'Emily Davis',
          position: 'Frontend Developer',
          jobListingId: 4,
          email: 'emily.davis@email.com',
          phone: '+1 (555) 234-5678',
          appliedDate: '2024-01-08',
          priority: 'medium',
          tags: ['Vue.js', 'CSS', 'Frontend'],
          notes: 'Technical interview scheduled for tomorrow'
        }
      ],
      'final-interview': [
        {
          id: 5,
          name: 'David Wilson',
          position: 'DevOps Engineer',
          jobListingId: 6,
          email: 'david.wilson@email.com',
          phone: '+1 (555) 345-6789',
          appliedDate: '2024-01-05',
          priority: 'high',
          tags: ['AWS', 'Docker', 'Kubernetes'],
          notes: 'Excellent technical skills, final interview with team lead'
        }
      ],
      'offer-extended': [
        {
          id: 6,
          name: 'Lisa Brown',
          position: 'Product Manager',
          jobListingId: 7,
          email: 'lisa.brown@email.com',
          phone: '+1 (555) 567-8901',
          appliedDate: '2024-01-01',
          priority: 'high',
          tags: ['Product Management', 'Agile', 'Strategy'],
          notes: 'Offer extended, awaiting response'
        }
      ]
    }
  }

  const [candidatesData, setCandidatesData] = useState(getInitialCandidatesData)

  // Save candidates data to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('candidatesData', JSON.stringify(candidatesData))
    } catch (error) {
      console.warn('Error saving candidates data to localStorage:', error)
    }
  }, [candidatesData])

  // Sample job listings - in real app this would come from API
  const jobListings = useMemo(
    () => [
      { id: 1, title: 'Senior React Developer', department: 'Engineering' },
      { id: 2, title: 'UX Designer', department: 'Design' },
      { id: 3, title: 'Full Stack Developer', department: 'Engineering' },
      { id: 4, title: 'Frontend Developer', department: 'Engineering' },
      { id: 5, title: 'Backend Developer', department: 'Engineering' },
      { id: 6, title: 'DevOps Engineer', department: 'Engineering' },
      { id: 7, title: 'Product Manager', department: 'Product' },
      { id: 8, title: 'Data Scientist', department: 'Data' },
      { id: 9, title: 'QA Engineer', department: 'Quality Assurance' },
      { id: 10, title: 'Marketing Manager', department: 'Marketing' }
    ],
    []
  )

  // Helper function to get stage title
  const getStageTitle = useCallback((stageKey) => {
    const stageTitles = {
      'application-received': 'Application Received',
      screening: 'Screening',
      assessment: 'Assessment',
      'technical-interview': 'Technical Interview',
      'final-interview': 'Final Interview',
      'offer-extended': 'Offer Extended'
    }
    return stageTitles[stageKey] || stageKey
  }, [])

  // Handle edit candidate
  const handleEdit = useCallback(
    (candidate) => {
      navigate('/business-dashboard/candidates/edit', {
        state: {
          editId: candidate.id,
          initialData: candidate
        }
      })
    },
    [navigate]
  )

  // Handle view candidate details
  const handleView = useCallback((candidate) => {
    setSelectedCandidate(candidate)
    setViewModalVisible(true)
  }, [])

  // Handle close view modal
  const handleCloseViewModal = useCallback(() => {
    setViewModalVisible(false)
    setSelectedCandidate(null)
  }, [])

  // Transform candidates data for table view (flatten nested stages)
  const flattenedCandidates = useMemo(() => {
    const flattened = []
    for (const [stageKey, candidates] of Object.entries(candidatesData)) {
      candidates.forEach((candidate) => {
        flattened.push({
          ...candidate,
          stage: stageKey,
          stageTitle: getStageTitle(stageKey)
        })
      })
    }
    return flattened
  }, [candidatesData, getStageTitle])

  // Table columns configuration
  const tableColumns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record) => (
          <div className='font-medium'>
            <div
              className={`cursor-pointer transition-colors duration-200 ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => handleEdit(record)}
            >
              {text}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{record.email}</div>
          </div>
        )
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        width: 200,
        sorter: (a, b) => a.position.localeCompare(b.position)
      },
      {
        title: 'Stage',
        dataIndex: 'stageTitle',
        key: 'stage',
        width: 150,
        sorter: (a, b) => a.stageTitle.localeCompare(b.stageTitle),
        render: (text, record) => {
          const stageColors = {
            'application-received': BRAND_COLORS.shakespeare,
            screening: BRAND_COLORS.emeraldPrimary,
            assessment: BRAND_COLORS.pictonBlue,
            'technical-interview': BRAND_COLORS.toreaBay,
            'final-interview': BRAND_COLORS.emeraldLight,
            'offer-extended': BRAND_COLORS.forestGreen
          }
          return (
            <Tag color={stageColors[record.stage]} style={{ color: 'white', fontWeight: '500' }}>
              {text}
            </Tag>
          )
        }
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
        sorter: (a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        },
        render: (priority) => {
          const priorityColors = {
            high: SEMANTIC_COLORS.error,
            medium: SEMANTIC_COLORS.warning,
            low: SEMANTIC_COLORS.success
          }
          return (
            <Tag color={priorityColors[priority]} style={{ color: 'white', fontWeight: '500' }}>
              {priority.toUpperCase()}
            </Tag>
          )
        }
      },
      {
        title: 'Applied Date',
        dataIndex: 'appliedDate',
        key: 'appliedDate',
        width: 120,
        sorter: (a, b) => new Date(a.appliedDate) - new Date(b.appliedDate),
        render: (date) => new Date(date).toLocaleDateString()
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        width: 200,
        render: (tags) => (
          <Space wrap>
            {tags.map((tag) => (
              <Tag
                key={tag}
                className='text-xs'
                style={{
                  backgroundColor: darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.lightGray,
                  color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                  border: `1px solid ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray}`
                }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        )
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: 140
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <Space>
            <Button
              type='text'
              size='small'
              icon={<FontAwesomeIcon icon={faEye} />}
              onClick={() => handleView(record)}
              className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            />
            <Button
              type='text'
              size='small'
              icon={<FontAwesomeIcon icon={faEdit} />}
              onClick={() => handleEdit(record)}
              className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            />
          </Space>
        )
      }
    ],
    [darkMode, handleView, handleEdit]
  )

  // Candidates stages configuration
  const stages = useMemo(
    () => [
      {
        key: 'application-received',
        title: 'Application Received',
        color: 'teal',
        count: candidatesData['application-received'].length
      },
      {
        key: 'screening',
        title: 'Screening',
        color: 'emerald',
        count: candidatesData['screening'].length
      },
      {
        key: 'assessment',
        title: 'Assessment',
        color: 'blue',
        count: candidatesData['assessment'].length
      },
      {
        key: 'technical-interview',
        title: 'Technical Interview',
        color: 'emerald-light',
        count: candidatesData['technical-interview'].length
      },
      {
        key: 'final-interview',
        title: 'Final Interview',
        color: 'blue-light',
        count: candidatesData['final-interview'].length
      },
      {
        key: 'offer-extended',
        title: 'Offer Extended',
        color: 'emerald-success',
        count: candidatesData['offer-extended'].length
      }
    ],
    [candidatesData]
  )

  // Helper function to find candidate and its location
  const findCandidateById = useCallback(
    (candidateId) => {
      const id = typeof candidateId === 'string' ? parseInt(candidateId) : candidateId

      for (const [stageKey, candidates] of Object.entries(candidatesData)) {
        const candidateIndex = candidates.findIndex((c) => c.id === id)
        if (candidateIndex !== -1) {
          return {
            candidate: candidates[candidateIndex],
            stageKey,
            index: candidateIndex
          }
        }
      }
      return null
    },
    [candidatesData]
  )

  // Handle add new candidate
  const handleAdd = useCallback(() => {
    navigate('/business-dashboard/candidates/create')
  }, [navigate])

  // Handle candidate actions (non-drag actions)
  const handleCandidateAction = useCallback(
    (candidate, action) => {
      const actionStageMap = {
        'move-to-screening': 'screening',
        'move-to-assessment': 'assessment',
        'move-to-technical': 'technical-interview',
        'move-to-final': 'final-interview',
        'move-to-offer': 'offer-extended'
      }

      const targetStage = actionStageMap[action]
      if (!targetStage) return

      setCandidatesData((prev) => {
        const newData = { ...prev }

        // Find and remove candidate from current stage
        for (const stageKey in newData) {
          const candidateIndex = newData[stageKey].findIndex((c) => c.id === candidate.id)
          if (candidateIndex !== -1) {
            newData[stageKey] = newData[stageKey].filter((c) => c.id !== candidate.id)
            break
          }
        }

        // Add candidate to target stage
        newData[targetStage] = [...newData[targetStage], candidate]

        return newData
      })

      const targetStageTitle = stages.find((s) => s.key === targetStage)?.title
      message.success(`Moved ${candidate.name} to ${targetStageTitle}`)
    },
    [stages]
  )

  // Handle drag start
  const handleDragStart = useCallback((candidate) => {
    setDraggedCandidate(candidate)
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedCandidate(null)
  }, [])

  // Handle drop on stage
  const handleDropOnStage = useCallback(
    (candidate, targetStage, position) => {
      if (!candidate || !targetStage) return

      const sourceInfo = findCandidateById(candidate.id)
      if (!sourceInfo) return

      const { stageKey: sourceStage } = sourceInfo

      // Don't move if already in target stage at the same position
      if (sourceStage === targetStage) {
        const currentIndex = candidatesData[sourceStage].findIndex((c) => c.id === candidate.id)
        if (currentIndex === position || (currentIndex === position - 1 && position > 0)) {
          return // No change needed
        }
      }

      setCandidatesData((prev) => {
        const newData = { ...prev }

        // Remove from source stage
        newData[sourceStage] = newData[sourceStage].filter((c) => c.id !== candidate.id)

        // Add to target stage at specified position
        const targetCandidates = [...newData[targetStage]]

        if (position >= targetCandidates.length) {
          // Add to end
          targetCandidates.push(candidate)
        } else {
          // Insert at specific position
          targetCandidates.splice(position, 0, candidate)
        }

        newData[targetStage] = targetCandidates

        return newData
      })

      // Set the dropped card for flash effect
      setLastDroppedCard(candidate.id)

      // Clear the flash effect after 2 seconds
      setTimeout(() => {
        setLastDroppedCard(null)
      }, 2000)

      // Show success message for cross-stage moves or reordering
      if (sourceStage !== targetStage) {
        const targetStageTitle = stages.find((s) => s.key === targetStage)?.title
        message.success(`Moved ${candidate.name} to ${targetStageTitle}`)
      } else {
        message.success(`Reordered ${candidate.name}`)
      }
    },
    [findCandidateById, candidatesData, stages]
  )

  // Handle view toggle
  const handleViewToggle = useCallback((mode) => {
    setViewMode(mode)
  }, [])

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  // Handle job listing filter change
  const handleJobListingChange = useCallback((jobListingId) => {
    setSelectedJobListing(jobListingId)
  }, [])

  // Filter candidates based on search term
  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return flattenedCandidates

    const searchLower = searchTerm.toLowerCase()
    return flattenedCandidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.position.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  }, [flattenedCandidates, searchTerm])

  // Filter candidates data for Kanban board (filters by job listing and search)
  const filteredCandidatesData = useMemo(() => {
    const filtered = {}

    // Initialize all stages with empty arrays
    Object.keys(candidatesData).forEach((stage) => {
      filtered[stage] = []
    })

    // Filter each stage's candidates
    Object.keys(candidatesData).forEach((stage) => {
      const stageCandidates = candidatesData[stage] || []

      filtered[stage] = stageCandidates.filter((candidate) => {
        // Filter by job listing if selected
        const jobListingMatch = !selectedJobListing || candidate.jobListingId === selectedJobListing

        // Filter by search term if provided
        let searchMatch = true
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase()
          searchMatch =
            candidate.name.toLowerCase().includes(searchLower) ||
            candidate.position.toLowerCase().includes(searchLower) ||
            candidate.email.toLowerCase().includes(searchLower) ||
            candidate.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        }

        return jobListingMatch && searchMatch
      })
    })

    return filtered
  }, [candidatesData, selectedJobListing, searchTerm])

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`min-h-screen ${
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
        />

        {/* Sidebar */}
        <BusinessSidebar />

        {/* Main Content */}
        <div className='flex-1 ml-64 relative'>
          {/* Header */}
          <div
            className={`relative px-8 py-4 border-b flex-shrink-0 shadow-lg ${
              darkMode
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            }`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-white'>Candidates</h1>
              </div>
              <Button
                type='default'
                size='large'
                icon={<FontAwesomeIcon icon={faPlus} className='mr-2' />}
                onClick={handleAdd}
                className='add-candidate-visible font-medium'
                style={{
                  background: '#ffffff',
                  backgroundColor: '#ffffff',
                  color: '#059669',
                  border: '1px solid #ffffff',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  opacity: '1'
                }}
              >
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Content Area - Kanban Board or Table View */}
          <div className='relative p-6'>
            {viewMode === 'kanban' ? (
              /* Kanban Board with Drag and Drop */
              <KanbanBoard
                candidatesData={filteredCandidatesData}
                stages={stages}
                onEditCandidate={handleEdit}
                onCandidateAction={handleCandidateAction}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDropOnStage={handleDropOnStage}
                draggedCandidate={draggedCandidate}
                lastDroppedCard={lastDroppedCard}
                darkMode={darkMode}
                jobListings={jobListings}
                selectedJobListing={selectedJobListing}
                onJobListingChange={handleJobListingChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                showFilters={true}
                viewMode={viewMode}
                onViewModeChange={handleViewToggle}
                showViewToggle={true}
              />
            ) : (
              /* Table View */
              <div>
                {/* Use the same FilterBar component for consistency */}
                <KanbanBoard.FilterBar
                  jobListings={jobListings}
                  selectedJobListing={selectedJobListing}
                  onJobListingChange={handleJobListingChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  darkMode={darkMode}
                  viewMode={viewMode}
                  onViewModeChange={handleViewToggle}
                  showViewToggle={true}
                />

                <TableView
                  columns={tableColumns}
                  dataSource={filteredCandidates}
                  showSearch={false}
                  pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`
                  }}
                  scroll={{ x: 1400 }}
                  emptyText='No candidates found'
                  toolbarActions={[]}
                  cardProps={{
                    className: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Candidate Details Modal */}
        <Modal
          title={
            <div className='flex items-center space-x-3'>
              <FontAwesomeIcon icon={faEye} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                Candidate Details - {selectedCandidate?.name}
              </span>
            </div>
          }
          open={viewModalVisible}
          onCancel={handleCloseViewModal}
          footer={null}
          width={800}
          className={darkMode ? 'dark-modal' : ''}
          styles={{
            content: {
              backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
              color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
            },
            header: {
              backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
              borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`
            }
          }}
          style={{
            top: 20
          }}
          maskStyle={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
          }}
        >
          {/* Dark Mode Styles for Modal and Components */}
          <style jsx global>{`
            /* Dropdown Container Styles */
            .ant-select-dropdown {
              background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
              border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
              border-radius: 6px !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, ${darkMode ? '0.3' : '0.15'}) !important;
            }

            /* Dropdown Options Styles */
            .ant-select-dropdown .ant-select-item-option {
              color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
              background-color: transparent !important;
              padding: 8px 12px !important;
              border-radius: 4px !important;
              margin: 2px 4px !important;
            }

            .ant-select-dropdown .ant-select-item-option:hover {
              background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.lightGray} !important;
            }

            .ant-select-dropdown .ant-select-item-option-selected {
              background-color: ${BRAND_COLORS.emeraldPrimary} !important;
              color: white !important;
              font-weight: 500 !important;
            }

            .ant-select-dropdown .ant-select-item-option-selected:hover {
              background-color: ${BRAND_COLORS.emeraldLight} !important;
            }

            ${darkMode
              ? `
              /* Dark Mode Modal Styles */
              .dark-modal .ant-modal-content {
                background-color: ${BRAND_COLORS.darkSlateAlt} !important;
                color: ${BRAND_COLORS.white} !important;
                border: 1px solid ${BRAND_COLORS.mediumSlate} !important;
              }
              .dark-modal .ant-modal-header {
                background-color: ${BRAND_COLORS.darkSlateAlt} !important;
                border-bottom: 1px solid ${BRAND_COLORS.mediumSlate} !important;
              }
              .dark-modal .ant-modal-close {
                color: ${BRAND_COLORS.white} !important;
              }
              .dark-modal .ant-modal-close:hover {
                color: ${BRAND_COLORS.emeraldLight} !important;
              }
              .dark-descriptions .ant-descriptions-item-label {
                background-color: ${BRAND_COLORS.mediumSlate} !important;
                color: ${BRAND_COLORS.white} !important;
                border-color: ${BRAND_COLORS.darkSlate} !important;
              }
              .dark-descriptions .ant-descriptions-item-content {
                background-color: ${BRAND_COLORS.darkSlateAlt} !important;
                color: ${BRAND_COLORS.white} !important;
                border-color: ${BRAND_COLORS.darkSlate} !important;
              }
              .dark-descriptions .ant-descriptions-bordered .ant-descriptions-item {
                border-bottom: 1px solid ${BRAND_COLORS.darkSlate} !important;
              }
              .dark-descriptions .ant-descriptions-bordered .ant-descriptions-row {
                border-bottom: 1px solid ${BRAND_COLORS.darkSlate} !important;
              }
            `
              : ''}

            /* Force Add Candidate Button Visibility */
            .add-candidate-visible,
            .add-candidate-visible.ant-btn,
            button.add-candidate-visible {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #059669 !important;
              border: 1px solid #ffffff !important;
              opacity: 1 !important;
              visibility: visible !important;
            }

            .add-candidate-visible:hover,
            .add-candidate-visible.ant-btn:hover,
            button.add-candidate-visible:hover {
              background: #f8f9fa !important;
              background-color: #f8f9fa !important;
              color: #047857 !important;
              border: 1px solid #f8f9fa !important;
            }
          `}</style>

          {selectedCandidate && (
            <div className='space-y-6'>
              {/* Basic Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Basic Information
                </h3>
                <Descriptions
                  bordered
                  column={2}
                  size='middle'
                  className={darkMode ? 'dark-descriptions' : ''}
                  labelStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.offWhite,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                    fontWeight: '500'
                  }}
                  contentStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  }}
                >
                  <Descriptions.Item label='Full Name'>{selectedCandidate.name}</Descriptions.Item>
                  <Descriptions.Item label='Position'>{selectedCandidate.position}</Descriptions.Item>
                  <Descriptions.Item label='Email'>{selectedCandidate.email}</Descriptions.Item>
                  <Descriptions.Item label='Phone'>{selectedCandidate.phone}</Descriptions.Item>
                  <Descriptions.Item label='Applied Date'>
                    {new Date(selectedCandidate.appliedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label='Current Stage'>
                    <Tag
                      color={(() => {
                        const stageColors = {
                          'application-received': BRAND_COLORS.shakespeare,
                          screening: BRAND_COLORS.emeraldPrimary,
                          assessment: BRAND_COLORS.pictonBlue,
                          'technical-interview': BRAND_COLORS.toreaBay,
                          'final-interview': BRAND_COLORS.emeraldLight,
                          'offer-extended': BRAND_COLORS.forestGreen
                        }
                        return stageColors[selectedCandidate.stage]
                      })()}
                      style={{ color: 'white', fontWeight: '500' }}
                    >
                      {getStageTitle(selectedCandidate.stage)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Priority' span={2}>
                    <Tag
                      color={(() => {
                        const priorityColors = {
                          high: SEMANTIC_COLORS.error,
                          medium: SEMANTIC_COLORS.warning,
                          low: SEMANTIC_COLORS.success
                        }
                        return priorityColors[selectedCandidate.priority]
                      })()}
                      style={{ color: 'white', fontWeight: '500' }}
                    >
                      {selectedCandidate.priority.toUpperCase()} PRIORITY
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Skills & Tags */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Skills & Expertise
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {selectedCandidate.tags.map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        backgroundColor: darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.lightGray,
                        color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                        border: `1px solid ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray}`,
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedCandidate.notes && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notes</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } border`}
                  >
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{selectedCandidate.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DndProvider>
  )
})

export default Candidates
