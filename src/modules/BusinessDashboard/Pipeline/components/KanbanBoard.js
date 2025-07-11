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
      // Insert placeholder line before the item when hovering over it
      if (overId === candidate.id && activeId !== candidate.id) {
        elements.push(
          <div
            key={`placeholder-${candidate.id}`}
            className="h-1 bg-emerald-500 rounded my-1 transition-all duration-150"
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
          activeId={activeId}
          overId={overId}
        />
      )
    })

    // If hovering over empty column, show placeholder at end
    if (candidates.length === 0 && overId === stage.key) {
      elements.push(
        <div key="placeholder-end" className="h-1 bg-emerald-500 rounded my-1 transition-all duration-150" />
      )
    }

    return elements
  }

  return (
    <div
      className={`w-60 flex-shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } transition-colors duration-200 ${isOver ? 'ring-2 ring-emerald-500' : ''}`}
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
        className="p-3 min-h-32"
      >
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {renderCandidates()}
          </div>
        </SortableContext>
        {candidates.length === 0 && overId !== stage.key && (
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
    <div className="flex space-x-2 overflow-x-auto pb-6">
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
  )
})

export default KanbanBoard 