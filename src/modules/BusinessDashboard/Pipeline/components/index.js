// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faColumns, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, message } from 'antd'
import {
  DndContext,
  closestCorners,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import KanbanBoard from './KanbanBoard'
import CandidateModal from './CandidateModal'
import CandidateCard from './CandidateCard'

/**
 * Pipeline Management Page
 * Kanban-style board for managing job application pipeline with drag and drop
 */
const Pipeline = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // State management
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [activeCandidate, setActiveCandidate] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

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
            newData['application-received'].push(newCandidate)
          }

          return newData
        })

        message.success(`${editingCandidate ? 'Updated' : 'Added'} candidate successfully`)
        setIsModalVisible(false)
        setEditingCandidate(null)
        form.resetFields()
      } catch (error) {
        message.error('Failed to save candidate')
      }
    },
    [editingCandidate, form]
  )

  // Handle candidate actions (non-drag actions)
  const handleCandidateAction = useCallback(
    (candidate, action) => {
      let targetStage = null

      switch (action) {
        case 'move-to-screening':
          targetStage = 'screening'
          break
        case 'move-to-assessment':
          targetStage = 'assessment'
          break
        case 'move-to-technical':
          targetStage = 'technical-interview'
          break
        case 'move-to-final':
          targetStage = 'final-interview'
          break
        case 'move-to-offer':
          targetStage = 'offer-extended'
          break
        default:
          return
      }

      setPipelineData((prev) => {
        const newData = { ...prev }

        // Find and remove candidate from current stage
        for (const stageKey in newData) {
          const candidateIndex = newData[stageKey].findIndex((c) => c.id === candidate.id)
          if (candidateIndex !== -1) {
            newData[stageKey].splice(candidateIndex, 1)
            break
          }
        }

        // Add candidate to target stage
        if (targetStage) {
          newData[targetStage].push(candidate)
        }

        return newData
      })

      message.success(`Moved ${candidate.name} to ${stages.find((s) => s.key === targetStage)?.title}`)
    },
    [stages]
  )

  // Handle drag start
  const handleDragStart = useCallback(
    (event) => {
      const { active } = event
      const candidateId = parseInt(active.id)

      // Find the candidate being dragged
      for (const stageKey in pipelineData) {
        const candidate = pipelineData[stageKey].find((c) => c.id === candidateId)
        if (candidate) {
          setActiveCandidate(candidate)
          return
        }
      }

      // If candidate not found, reset state
      setActiveCandidate(null)
    },
    [pipelineData]
  )

  // Handle drag end with reordering & cross-stage moves
  const handleDragEnd = useCallback(
    ({ active, over }) => {
      // Clear drag state with small delay to prevent flashing
      setTimeout(() => {
        setActiveCandidate(null)
        setDragOverId(null)
      }, 50)

      // If not dropped over anything, abort
      if (!over) return

      const activeId = parseInt(active.id)
      const overIdRaw = over.id

      // Identify source stage & index
      let sourceStage = null
      let sourceIndex = -1
      for (const stageKey in pipelineData) {
        const idx = pipelineData[stageKey].findIndex((c) => c.id === activeId)
        if (idx !== -1) {
          sourceStage = stageKey
          sourceIndex = idx
          break
        }
      }

      if (sourceStage === null) return

      // Determine target stage & index
      let targetStage = sourceStage
      let targetIndex = null

      const overIdNum = parseInt(overIdRaw)
      if (!Number.isNaN(overIdNum)) {
        // Dropped over another candidate card
        for (const stageKey in pipelineData) {
          const idx = pipelineData[stageKey].findIndex((c) => c.id === overIdNum)
          if (idx !== -1) {
            targetStage = stageKey
            targetIndex = idx
            break
          }
        }
      } else {
        // Dropped over empty stage area; append to end
        targetStage = overIdRaw
        targetIndex = pipelineData[targetStage]?.length ?? 0
      }

      if (targetStage === null || targetIndex === null) return

      // No change
      if (sourceStage === targetStage && sourceIndex === targetIndex) return

      setPipelineData((prev) => {
        const newData = { ...prev }

        const candidate = newData[sourceStage][sourceIndex]

        // Prepare new arrays
        newData[sourceStage] = [...newData[sourceStage]]
        newData[targetStage] = [...newData[targetStage]]

        // Remove from source
        newData[sourceStage].splice(sourceIndex, 1)

        // Adjust targetIndex if moving within same list and removing earlier element
        let insertIndex = targetIndex
        if (sourceStage === targetStage && sourceIndex < targetIndex) {
          insertIndex = targetIndex - 1
        }

        // Insert into target
        newData[targetStage].splice(insertIndex, 0, candidate)

        // Message
        if (sourceStage !== targetStage) {
          const targetStageTitle = stages.find((s) => s.key === targetStage)?.title
          message.success(`Moved ${candidate.name} to ${targetStageTitle}`)
        }

        return newData
      })
    },
    [pipelineData, stages]
  )

  // Track current drag over id to show placeholder line
  const handleDragOver = useCallback(({ over }) => {
    const newOverId = over ? over.id : null
    setDragOverId((prev) => (prev !== newOverId ? newOverId : prev))
  }, [])

  // Configure sensors for better drag/drop experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // start drag after small movement to prevent accidental drags
        delay: 100,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  return (
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
      ></div>

      {/* Sidebar */}
      <BusinessSidebar />

      {/* Main Content */}
      <div className='flex-1 ml-64 pt-20 relative'>
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
              <Button
                type='text'
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate('/business-dashboard')}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              />
              <div className='flex items-center space-x-3'>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                    darkMode ? 'from-purple-600 to-purple-800' : 'from-purple-500 to-purple-700'
                  }`}
                >
                  <FontAwesomeIcon icon={faColumns} className='text-white text-sm' />
                </div>
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
        <div
          className={`relative p-2 ${darkMode ? 'bg-gray-800/20 backdrop-blur-sm' : 'bg-white/20 backdrop-blur-sm'}`}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <KanbanBoard
              pipelineData={pipelineData}
              stages={stages}
              onEditCandidate={handleEdit}
              onCandidateAction={handleCandidateAction}
              darkMode={darkMode}
              activeId={activeCandidate ? activeCandidate.id : null}
              overId={dragOverId}
            />
            <DragOverlay
              dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              style={{
                zIndex: 1000
              }}
            >
              {activeCandidate ? (
                <div
                  className={`transform rotate-2 opacity-95 ${
                    darkMode ? 'bg-gray-800/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
                  } shadow-2xl rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  <CandidateCard
                    candidate={activeCandidate}
                    stageKey='dragging'
                    onEditCandidate={() => {}}
                    onCandidateAction={() => {}}
                    darkMode={darkMode}
                    isBeingDragged={true}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
  )
})

export default Pipeline
