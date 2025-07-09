// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../ui/ThemeContext'
import BusinessSidebar from '../../components/BusinessSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faColumns, 
  faArrowLeft, 
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { Button, Form, message } from 'antd'
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core'
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
    'screening': [
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
    'assessment': [
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
  const stages = useMemo(() => [
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
  ], [pipelineData])

  // Handle add new candidate
  const handleAdd = useCallback(() => {
    setIsModalVisible(true)
    setEditingCandidate(null)
    form.resetFields()
  }, [form])

  // Handle edit candidate
  const handleEdit = useCallback((candidate) => {
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
  }, [form])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    try {
      const newCandidate = {
        ...values,
        id: editingCandidate ? editingCandidate.id : Date.now(),
        appliedDate: editingCandidate ? editingCandidate.appliedDate : new Date().toISOString().split('T')[0]
      }

      setPipelineData(prev => {
        const newData = { ...prev }
        
        if (editingCandidate) {
          // Find and update existing candidate
          for (const stageKey in newData) {
            const stageIndex = newData[stageKey].findIndex(c => c.id === editingCandidate.id)
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
  }, [editingCandidate, form])

  // Handle candidate actions (non-drag actions)
  const handleCandidateAction = useCallback((candidate, action) => {
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

    setPipelineData(prev => {
      const newData = { ...prev }
      
      // Find and remove candidate from current stage
      for (const stageKey in newData) {
        const candidateIndex = newData[stageKey].findIndex(c => c.id === candidate.id)
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

    message.success(`Moved ${candidate.name} to ${stages.find(s => s.key === targetStage)?.title}`)
  }, [stages])

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event
    const candidateId = parseInt(active.id)
    
    // Find the candidate being dragged
    for (const stageKey in pipelineData) {
      const candidate = pipelineData[stageKey].find(c => c.id === candidateId)
      if (candidate) {
        setActiveCandidate(candidate)
        break
      }
    }
  }, [pipelineData])

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    setActiveCandidate(null)

    if (!over) return

    const candidateId = parseInt(active.id)
    const targetStageId = over.id

    // Move candidate to new stage using functional update to avoid stale state
    setPipelineData(prev => {
      // Find source stage and candidate in current state
      let sourceStage = null
      let candidateIndex = -1
      let candidate = null

      for (const stageKey in prev) {
        const index = prev[stageKey].findIndex(c => c.id === candidateId)
        if (index !== -1) {
          sourceStage = stageKey
          candidateIndex = index
          candidate = prev[stageKey][index]
          break
        }
      }

      if (!candidate || !sourceStage) return prev

      // If dropped on same stage, do nothing
      if (sourceStage === targetStageId) return prev

      // Create new data with candidate moved
      const newData = { ...prev }
      
      // Create new arrays to avoid mutation
      newData[sourceStage] = [...prev[sourceStage]]
      newData[targetStageId] = [...prev[targetStageId]]
      
      // Remove from source stage
      newData[sourceStage].splice(candidateIndex, 1)
      
      // Add to target stage
      newData[targetStageId].push(candidate)
      
      // Show success message
      const targetStageTitle = stages.find(s => s.key === targetStageId)?.title
      message.success(`Moved ${candidate.name} to ${targetStageTitle}`)
      
      return newData
    })
  }, [stages])

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <BusinessSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 pt-20">
        {/* Header */}
        <div className={`px-8 py-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                type="text"
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate('/business-dashboard')}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              />
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                  darkMode ? 'from-purple-600 to-purple-800' : 'from-purple-500 to-purple-700'
                }`}>
                  <FontAwesomeIcon icon={faColumns} className="text-white text-sm" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Pipeline
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manage your recruitment pipeline - drag candidates between stages
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleAdd}
              className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            >
              Add Candidate
            </Button>
          </div>
        </div>

        {/* Kanban Board with Drag and Drop */}
        <div className="p-4 overflow-x-auto">
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <KanbanBoard
              pipelineData={pipelineData}
              stages={stages}
              onEditCandidate={handleEdit}
              onCandidateAction={handleCandidateAction}
              darkMode={darkMode}
            />
            <DragOverlay>
              {activeCandidate ? (
                <div className={`transform rotate-6 opacity-90 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
                  <CandidateCard
                    candidate={activeCandidate}
                    stageKey="dragging"
                    onEditCandidate={() => {}}
                    onCandidateAction={() => {}}
                    darkMode={darkMode}
                    isDragging={true}
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