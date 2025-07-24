// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { Form, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'
import KanbanBoard from './KanbanBoard'
import CandidateModal from './CandidateModal'

/**
 * Pipeline Management Page
 * Kanban-style board for managing job application pipeline with drag and drop
 */
const Pipeline = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const [form] = Form.useForm()

  // State management
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [draggedCandidate, setDraggedCandidate] = useState(null)
  const [lastDroppedCard, setLastDroppedCard] = useState(null)

  // Sample pipeline data - in real app this would come from API
  const [pipelineData, setPipelineData] = useState({
    'application-received': [
      {
        id: 1,
        name: 'John Smith',
        position: 'Senior React Developer',
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
        email: 'lisa.brown@email.com',
        phone: '+1 (555) 567-8901',
        appliedDate: '2024-01-01',
        priority: 'high',
        tags: ['Product Management', 'Agile', 'Strategy'],
        notes: 'Offer extended, awaiting response'
      }
    ]
  })

  // Pipeline stages configuration
  const stages = useMemo(
    () => [
      {
        key: 'application-received',
        title: 'Application Received',
        color: 'blue',
        count: pipelineData['application-received'].length
      },
      {
        key: 'screening',
        title: 'Screening',
        color: 'orange',
        count: pipelineData['screening'].length
      },
      {
        key: 'assessment',
        title: 'Assessment',
        color: 'indigo',
        count: pipelineData['assessment'].length
      },
      {
        key: 'technical-interview',
        title: 'Technical Interview',
        color: 'purple',
        count: pipelineData['technical-interview'].length
      },
      {
        key: 'final-interview',
        title: 'Final Interview',
        color: 'cyan',
        count: pipelineData['final-interview'].length
      },
      {
        key: 'offer-extended',
        title: 'Offer Extended',
        color: 'gold',
        count: pipelineData['offer-extended'].length
      }
    ],
    [pipelineData]
  )

  // Helper function to find candidate and its location
  const findCandidateById = useCallback(
    (candidateId) => {
      const id = typeof candidateId === 'string' ? parseInt(candidateId) : candidateId

      for (const [stageKey, candidates] of Object.entries(pipelineData)) {
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
    [pipelineData]
  )

  // Handle add new candidate
  const handleAdd = useCallback(() => {
    setIsModalVisible(true)
    setEditingCandidate(null)
    form.resetFields()
  }, [form])

  // Handle edit candidate
  const handleEdit = useCallback(
    (candidate) => {
      setEditingCandidate(candidate)
      setIsModalVisible(true)
      form.setFieldsValue({
        name: candidate.name,
        position: candidate.position,
        email: candidate.email,
        phone: candidate.phone,
        priority: candidate.priority,
        tags: candidate.tags || [],
        notes: candidate.notes
      })
    },
    [form]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      try {
        const newCandidate = {
          ...values,
          id: editingCandidate ? editingCandidate.id : Date.now(),
          appliedDate: editingCandidate ? editingCandidate.appliedDate : new Date().toISOString().split('T')[0]
        }

        setPipelineData((prev) => {
          const newData = { ...prev }

          if (editingCandidate) {
            // Find and update existing candidate
            for (const stageKey in newData) {
              const stageIndex = newData[stageKey].findIndex((c) => c.id === editingCandidate.id)
              if (stageIndex !== -1) {
                newData[stageKey][stageIndex] = newCandidate
                break
              }
            }
          } else {
            // Add new candidate to "application-received" stage
            newData['application-received'] = [...newData['application-received'], newCandidate]
          }

          return newData
        })

        message.success(`${editingCandidate ? 'Updated' : 'Added'} candidate successfully`)
        setIsModalVisible(false)
        setEditingCandidate(null)
        form.resetFields()
      } catch (error) {
        console.error('Error saving candidate:', error)
        message.error('Failed to save candidate')
      }
    },
    [editingCandidate, form]
  )

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

      setPipelineData((prev) => {
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
        const currentIndex = pipelineData[sourceStage].findIndex((c) => c.id === candidate.id)
        if (currentIndex === position || (currentIndex === position - 1 && position > 0)) {
          return // No change needed
        }
      }

      setPipelineData((prev) => {
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
    [findCandidateById, pipelineData, stages]
  )

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
            className={`relative px-8 py-4 border-b flex-shrink-0 ${
              darkMode
                ? 'border-gray-700/50 bg-gray-800/30 backdrop-blur-sm'
                : 'border-gray-200/50 bg-white/30 backdrop-blur-sm'
            }`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-3'>
                  <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pipeline</h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Manage your recruitment pipeline - drag candidates between stages
                    </p>
                  </div>
                </div>
              </div>
              <Button
                type='primary'
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleAdd}
                className='bg-emerald-600 hover:bg-emerald-700 border-emerald-600'
              >
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Kanban Board with Drag and Drop */}
          <div className='relative p-6'>
            <KanbanBoard
              pipelineData={pipelineData}
              stages={stages}
              onEditCandidate={handleEdit}
              onCandidateAction={handleCandidateAction}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDropOnStage={handleDropOnStage}
              draggedCandidate={draggedCandidate}
              lastDroppedCard={lastDroppedCard}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Add/Edit Candidate Modal */}
        <CandidateModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            setEditingCandidate(null)
            form.resetFields()
          }}
          onSubmit={handleSubmit}
          form={form}
          editingCandidate={editingCandidate}
          darkMode={darkMode}
        />
      </div>
    </DndProvider>
  )
})

export default Pipeline
