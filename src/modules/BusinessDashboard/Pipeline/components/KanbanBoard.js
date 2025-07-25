// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useDrop } from 'react-dnd'
import CandidateCard from './CandidateCard'

/**
 * Drop zone component for precise positioning
 */
const DropZone = React.memo(({ position, onDrop, darkMode }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'candidate',
    drop: (item) => {
      onDrop(item.candidate)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  const isActive = isOver && canDrop

  return (
    <div
      ref={drop}
      className={`transition-all duration-150 rounded ${
        isActive
          ? `${darkMode ? 'bg-emerald-500/30' : 'bg-emerald-500/20'} border-emerald-500/60 border-dashed`
          : 'bg-transparent border-transparent'
      } border`}
      style={{
        minHeight: isActive ? '40px' : '16px',
        margin: '6px 0',
        transition: 'all 0.15s ease-out',
        // Much larger hit area
        padding: '12px 8px',
        cursor: isActive ? 'copy' : 'default'
      }}
    >
      {isActive && (
        <div className={`text-center ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
          <div className="text-xs font-medium">Drop here (position {position})</div>
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
    // Column-level drop for visual feedback only - doesn't handle drops, just provides hover state
    const [{ isOver: columnIsOver, canDrop: columnCanDrop }, columnDrop] = useDrop({
      accept: 'candidate',
      // No drop handler - let DropZones handle the actual drops
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }), // Only when directly over column
        canDrop: monitor.canDrop()
      })
    })

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
        teal: 'bg-teal-100 text-teal-800 border-teal-200',
        emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'emerald-light': 'bg-emerald-50 text-emerald-700 border-emerald-150',
        'emerald-success': 'bg-green-100 text-green-800 border-green-200',
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        'blue-light': 'bg-sky-100 text-sky-800 border-sky-200',
        green: 'bg-green-100 text-green-800 border-green-200',
        red: 'bg-red-100 text-red-800 border-red-200'
      }
      return colors[color] || colors.emerald
    }

    const getStageDarkColor = (color) => {
      const colors = {
        teal: 'bg-teal-900 text-teal-200 border-teal-700',
        emerald: 'bg-emerald-900 text-emerald-200 border-emerald-700',
        'emerald-light': 'bg-emerald-800 text-emerald-100 border-emerald-600',
        'emerald-success': 'bg-green-900 text-green-200 border-green-700',
        blue: 'bg-blue-900 text-blue-200 border-blue-700',
        'blue-light': 'bg-sky-900 text-sky-200 border-sky-700',
        green: 'bg-green-900 text-green-200 border-green-700',
        red: 'bg-red-900 text-red-200 border-red-700'
      }
      return colors[color] || colors.emerald
    }

    const isColumnDropActive = columnIsOver && columnCanDrop

    return (
      <div
        ref={columnDrop}
        className={`w-full min-h-[500px] flex flex-col ${
          darkMode ? 'bg-gray-800/80 backdrop-blur-sm shadow-xl' : 'bg-white/80 backdrop-blur-sm shadow-lg'
        } rounded-lg border ${
          isColumnDropActive
            ? darkMode
              ? 'border-emerald-400/60 bg-emerald-500/10 shadow-2xl ring-2 ring-emerald-500/20'
              : 'border-emerald-400/60 bg-emerald-500/8 shadow-2xl ring-2 ring-emerald-500/20'
            : darkMode
            ? 'border-gray-700/50'
            : 'border-gray-200/50'
        } transition-all duration-200`}
      >
        {/* Stage Header */}
        <div className={`p-3 border-b ${
          isColumnDropActive 
            ? darkMode ? 'border-emerald-500/50' : 'border-emerald-500/50'
            : darkMode ? 'border-gray-700' : 'border-gray-200'
        } transition-colors duration-200`}>
          <div className='text-center space-y-2'>
            <div
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                isColumnDropActive
                  ? darkMode ? 'bg-emerald-800 text-emerald-200 border-emerald-600' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : darkMode ? getStageDarkColor(stage.color) : getStageColor(stage.color)
              } transition-colors duration-200`}
            >
              {stage.count}
            </div>
            <h3
              className={`text-xs font-semibold leading-tight ${
                isColumnDropActive
                  ? darkMode ? 'text-emerald-200' : 'text-emerald-800'
                  : darkMode ? 'text-white' : 'text-gray-900'
              } transition-colors duration-200`}
              style={{ 
                wordBreak: 'break-word',
                hyphens: 'auto',
                lineHeight: '1.2'
              }}
            >
              {stage.title}
            </h3>
          </div>
        </div>

        {/* Droppable Area */}
        <div className='p-4 min-h-32 flex-1'>
          <div className='space-y-1'>
            {/* Drop zone at the beginning */}
            <DropZone
              position='start'
              onDrop={(candidate) => onDropOnStage(candidate, stage.key, 0)}
              darkMode={darkMode}
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
                />
              </React.Fragment>
            ))}

            {/* For empty columns, show a message but the first drop zone will handle drops */}
            {safeCandidates.length === 0 && (
              <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className='text-sm opacity-40'>No candidates</p>
              </div>
            )}

            {/* Final drop zone for dropping at the very end */}
            {safeCandidates.length > 0 && (
              <DropZone
                position="end"
                onDrop={(candidate) => onDropOnStage(candidate, stage.key, safeCandidates.length)}
                darkMode={darkMode}
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
