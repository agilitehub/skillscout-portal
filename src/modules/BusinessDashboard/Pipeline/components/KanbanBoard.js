// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Badge } from 'antd'
import CandidateCard from './CandidateCard'

/**
 * Individual stage column for the Kanban board
 */
const StageColumn = React.memo(({ 
  stage, 
  candidates, 
  onEditCandidate, 
  onCandidateAction, 
  darkMode,
  activeId,
  overId 
}) => {
  // Enable visual feedback when an item is dragged over this stage
  const { setNodeRef, isOver } = useDroppable({
    id: stage.key,
  })

  const getStageColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[color] || colors.blue
  }

  const getStageDarkColor = (color) => {
    const colors = {
      blue: 'bg-blue-900 text-blue-200 border-blue-700',
      orange: 'bg-orange-900 text-orange-200 border-orange-700',
      indigo: 'bg-indigo-900 text-indigo-200 border-indigo-700',
      purple: 'bg-purple-900 text-purple-200 border-purple-700',
      cyan: 'bg-cyan-900 text-cyan-200 border-cyan-700',
      gold: 'bg-yellow-900 text-yellow-200 border-yellow-700',
      green: 'bg-green-900 text-green-200 border-green-700',
      red: 'bg-red-900 text-red-200 border-red-700'
    }
    return colors[color] || colors.blue
  }

  const renderCandidates = () => {
    const elements = []
    
    candidates.forEach((candidate, idx) => {
      // Show placeholder line before candidate when hovering over it
      if (overId === candidate.id && activeId && activeId !== candidate.id) {
        elements.push(
          <div
            key={`placeholder-before-${candidate.id}`}
            className="h-0.5 bg-emerald-500 rounded-full mx-2 transition-all duration-200 ease-out"
          />
        )
      }
      
      elements.push(
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          stageKey={stage.key}
          onEditCandidate={onEditCandidate}
          onCandidateAction={onCandidateAction}
          darkMode={darkMode}
          isBeingDragged={activeId === candidate.id}
        />
      )
    })

    // Show placeholder at end when hovering over empty space or after last item
    if (overId === stage.key && activeId && !candidates.some(c => c.id === overId)) {
      elements.push(
        <div
          key="placeholder-end"
          className="h-0.5 bg-emerald-500 rounded-full mx-2 transition-all duration-200 ease-out"
        />
      )
    }

    return elements
  }

  return (
    <div
      className={`w-full min-h-[500px] flex flex-col ${
        darkMode 
          ? 'bg-gray-800/80 backdrop-blur-sm shadow-xl' 
          : 'bg-white/80 backdrop-blur-sm shadow-lg'
      } rounded-lg border ${
        darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      } transition-all duration-200 ${
        isOver && activeId ? 'ring-2 ring-emerald-500/50 border-emerald-500' : ''
      }`}
    >
      {/* Stage Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge 
              count={stage.count} 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                darkMode ? getStageDarkColor(stage.color) : getStageColor(stage.color)
              }`}
            />
            <h3 className={`text-sm font-semibold whitespace-nowrap truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {stage.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef}
        className={`p-3 min-h-32 transition-all duration-200 ${
          isOver && activeId ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
        }`}
      >
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {renderCandidates()}
          </div>
        </SortableContext>
        
        {/* Empty state */}
        {candidates.length === 0 && !activeId && (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FontAwesomeIcon icon={faPlus} className="text-2xl mb-2 opacity-50" />
            <p className="text-sm">Drop candidates here</p>
          </div>
        )}
      </div>
    </div>
  )
})

/**
 * Main Kanban Board component
 */
const KanbanBoard = React.memo(({ 
  pipelineData, 
  stages, 
  onEditCandidate, 
  onCandidateAction, 
  darkMode,
  activeId,
  overId 
}) => {
  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden xl:grid xl:grid-cols-6 gap-4 pb-6">
        {stages.map((stage) => (
          <StageColumn
            key={stage.key}
            stage={stage}
            candidates={pipelineData[stage.key] || []}
            onEditCandidate={onEditCandidate}
            onCandidateAction={onCandidateAction}
            darkMode={darkMode}
            activeId={activeId}
            overId={overId}
          />
        ))}
      </div>
      
      {/* Mobile/Tablet Layout */}
      <div className="xl:hidden overflow-x-auto pb-6">
        <div className="flex space-x-4 min-w-max">
          {stages.map((stage) => (
            <div key={stage.key} className="w-72 flex-shrink-0">
              <StageColumn
                stage={stage}
                candidates={pipelineData[stage.key] || []}
                onEditCandidate={onEditCandidate}
                onCandidateAction={onCandidateAction}
                darkMode={darkMode}
                activeId={activeId}
                overId={overId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default KanbanBoard 