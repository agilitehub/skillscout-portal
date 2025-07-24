// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useDrop } from 'react-dnd'
import CandidateCard from './CandidateCard'

/**
 * Drop zone component for inserting cards at specific positions
 */
const DropZone = React.memo(({ position, onDrop, darkMode, isOver, canDrop }) => {
  const [{ isOver: isOverLocal, canDrop: canDropLocal }, drop] = useDrop({
    accept: 'candidate',
    drop: (item) => {
      onDrop(item.candidate)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    hover: (item, monitor) => {
      // Add a small delay to prevent jumping
      if (!monitor.isOver({ shallow: true })) {
        return
      }
    }
  })

  const isActive = isOver || isOverLocal
  const canDropHere = canDrop && canDropLocal

  return (
    <div
      ref={drop}
      className={`transition-all duration-300 rounded-lg ${
        isActive && canDropHere
          ? 'bg-gray-100/90 h-32 border-2 border-gray-300 border-dashed shadow-lg'
          : 'bg-transparent h-2 border-2 border-transparent'
      }`}
      style={{
        minHeight: isActive && canDropHere ? '128px' : '8px',
        margin: isActive && canDropHere ? '16px 0' : '2px 0',
        transform: isActive && canDropHere ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease-out',
        // Add padding to create a larger hit area
        padding: isActive && canDropHere ? '8px' : '0px'
      }}
    >
      {isActive && canDropHere && (
        <div className='flex items-center justify-center h-full'>
          <div className={`text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <FontAwesomeIcon icon={faPlus} className='text-4xl mb-4 opacity-30' />
            <p className='text-sm font-medium mb-2'>Drop candidates here</p>
            <p className='text-xs opacity-70'>or use the action menu to move them</p>
          </div>
        </div>
      )}
    </div>
  )
})

/**
 * Individual stage column for the Kanban board
 */
const StageColumn = React.memo(
  ({
    stage,
    candidates,
    onEditCandidate,
    onCandidateAction,
    onDropOnStage,
    onDragStart,
    onDragEnd,
    lastDroppedCard,
    darkMode
  }) => {
    // Safety check for stage data
    if (!stage || !stage.key) {
      return (
        <div
          className={`w-full min-h-[500px] flex items-center justify-center ${
            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
          } rounded-lg border`}
        >
          <p>Error loading stage data</p>
        </div>
      )
    }

    // Safety check for candidates array
    const safeCandidates = Array.isArray(candidates) ? candidates : []

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

    return (
      <div
        className={`w-full min-h-[500px] flex flex-col ${
          darkMode ? 'bg-gray-800/80 backdrop-blur-sm shadow-xl' : 'bg-white/80 backdrop-blur-sm shadow-lg'
        } rounded-lg border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} transition-all duration-200`}
      >
        {/* Stage Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  darkMode ? getStageDarkColor(stage.color) : getStageColor(stage.color)
                }`}
              >
                {stage.count}
              </div>
              <h3
                className={`text-sm font-semibold whitespace-nowrap truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {stage.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Droppable Area */}
        <div className='p-4 min-h-32 flex-1'>
          <div className='space-y-2'>
            {/* Drop zone at the beginning */}
            <DropZone
              position='start'
              onDrop={(candidate) => onDropOnStage(candidate, stage.key, 0)}
              darkMode={darkMode}
              isOver={false}
              canDrop={true}
            />

            {/* Candidate cards with drop zones between them */}
            {safeCandidates.map((candidate, index) => (
              <React.Fragment key={candidate.id}>
                <CandidateCard
                  candidate={candidate}
                  stageKey={stage.key}
                  onEditCandidate={onEditCandidate}
                  onCandidateAction={onCandidateAction}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  darkMode={darkMode}
                />
                {/* Drop zone after each card */}
                <DropZone
                  position={index + 1}
                  onDrop={(candidate) => onDropOnStage(candidate, stage.key, index + 1)}
                  darkMode={darkMode}
                  isOver={false}
                  canDrop={true}
                />
              </React.Fragment>
            ))}

            {/* Enhanced drop zone for empty stages */}
            {safeCandidates.length === 0 && (
              <DropZone
                position='empty'
                onDrop={(candidate) => onDropOnStage(candidate, stage.key, 0)}
                darkMode={darkMode}
                isOver={false}
                canDrop={true}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
)

/**
 * Main Kanban Board component
 */
const KanbanBoard = React.memo(
  ({
    pipelineData,
    stages,
    onEditCandidate,
    onCandidateAction,
    onDragStart,
    onDragEnd,
    onDropOnStage,
    draggedCandidate,
    lastDroppedCard,
    darkMode
  }) => {
    // Safety checks
    if (!pipelineData || !Array.isArray(stages)) {
      return (
        <div
          className={`w-full min-h-[400px] flex items-center justify-center ${
            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
          } rounded-lg border`}
        >
          <p>Error loading pipeline data</p>
        </div>
      )
    }

    return (
      <div className='w-full'>
        {/* Desktop Layout - 6 columns on large screens */}
        <div className='hidden xl:grid xl:grid-cols-6 gap-6 pb-6'>
          {stages.map((stage) => (
            <StageColumn
              key={stage.key}
              stage={stage}
              candidates={pipelineData[stage.key] || []}
              onEditCandidate={onEditCandidate}
              onCandidateAction={onCandidateAction}
              onDropOnStage={onDropOnStage}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              lastDroppedCard={lastDroppedCard}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* Tablet Layout - 3 columns */}
        <div className='hidden lg:grid xl:hidden lg:grid-cols-3 gap-4 pb-6'>
          {stages.map((stage) => (
            <StageColumn
              key={stage.key}
              stage={stage}
              candidates={pipelineData[stage.key] || []}
              onEditCandidate={onEditCandidate}
              onCandidateAction={onCandidateAction}
              onDropOnStage={onDropOnStage}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              lastDroppedCard={lastDroppedCard}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* Mobile/Small Tablet Layout - Horizontal scroll */}
        <div className='lg:hidden overflow-x-auto pb-6'>
          <div className='flex space-x-4 min-w-max'>
            {stages.map((stage) => (
              <div key={stage.key} className='w-80 flex-shrink-0'>
                <StageColumn
                  stage={stage}
                  candidates={pipelineData[stage.key] || []}
                  onEditCandidate={onEditCandidate}
                  onCandidateAction={onCandidateAction}
                  onDropOnStage={onDropOnStage}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  lastDroppedCard={lastDroppedCard}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

export default KanbanBoard
