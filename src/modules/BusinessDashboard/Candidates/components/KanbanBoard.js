// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { Select, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBriefcase, faColumns, faTable } from '@fortawesome/free-solid-svg-icons'
import CandidateCard from './CandidateCard'

const { Option } = Select

/**
 * Filter bar component for searching and filtering candidates
 */
const FilterBar = React.memo(
  ({
    jobListings,
    selectedJobListing,
    onJobListingChange,
    searchTerm,
    onSearchChange,
    darkMode,
    // View toggle props
    viewMode,
    onViewModeChange,
    showViewToggle = false
  }) => {
    return (
      <div
        className={`mb-6 p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          {/* Left side - View as controls */}
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>View as:</span>
            </div>

            {/* View Toggle (when enabled) */}
            {showViewToggle && (
              <div className='min-w-32'>
                <Select
                  value={viewMode}
                  onChange={onViewModeChange}
                  style={{
                    width: 140,
                    height: 32
                  }}
                  className={`${darkMode ? 'kanban-select-dark' : ''}`}
                  size='small'
                  dropdownClassName={darkMode ? 'kanban-dark-dropdown' : ''}
                  options={[
                    {
                      value: 'kanban',
                      label: (
                        <div className='flex items-center space-x-2'>
                          <FontAwesomeIcon icon={faColumns} />
                          <span>Board</span>
                        </div>
                      )
                    },
                    {
                      value: 'table',
                      label: (
                        <div className='flex items-center space-x-2'>
                          <FontAwesomeIcon icon={faTable} />
                          <span>Table</span>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            )}
          </div>

          {/* Right side - Filter and Search */}
          <div className='flex items-center space-x-4'>
            {/* Job Listing Filter */}
            <div className='min-w-48'>
              <Select
                placeholder={
                  <div className='flex items-center space-x-2'>
                    <FontAwesomeIcon icon={faBriefcase} className='text-xs' />
                    <span>Filter by Job Listing</span>
                  </div>
                }
                value={selectedJobListing}
                onChange={onJobListingChange}
                allowClear
                className={`w-full ${darkMode ? 'kanban-select-dark' : ''}`}
                style={{ minWidth: 200 }}
                dropdownClassName={darkMode ? 'kanban-dark-dropdown' : ''}
              >
                {jobListings.map((listing) => (
                  <Option key={listing.id} value={listing.id}>
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faBriefcase} className='text-xs' />
                      <span>{listing.title}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>

            {/* General Search */}
            <div className='min-w-56'>
              <Input
                id='candidates-search-input'
                placeholder='Search candidates...'
                prefix={<FontAwesomeIcon icon={faSearch} className='text-gray-400' />}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={darkMode ? 'kanban-input-dark' : ''}
                style={{
                  backgroundColor: darkMode ? '#4B5563' : '#ffffff',
                  borderColor: darkMode ? '#6B7280' : '#d1d5db',
                  color: darkMode ? '#F9FAFB' : '#111827',
                  '--placeholder-color': darkMode ? '#ffffff' : '#9ca3af'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

// Force placeholder styling for dark mode
const applyPlaceholderStyles = () => {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style')
    style.textContent = `
      #candidates-search-input::placeholder {
        color: #ffffff !important;
        opacity: 1 !important;
      }
      .kanban-input-dark::placeholder {
        color: #ffffff !important;
        opacity: 1 !important;
      }
      .ant-input.kanban-input-dark::placeholder {
        color: #ffffff !important;
        opacity: 1 !important;
      }
    `
    document.head.appendChild(style)
  }
}

// Apply styles when component mounts
if (typeof window !== 'undefined') {
  setTimeout(applyPlaceholderStyles, 100)
}

/**
 * Smart drop indicator that shows where card will be inserted
 */
const DropIndicator = React.memo(({ position, darkMode }) => {
  return (
    <div className='relative w-full flex justify-center' style={{ height: '4px', margin: '8px 0' }}>
      <div
        className={`w-full h-1 rounded-full transition-all duration-200 ${
          darkMode ? 'bg-emerald-400' : 'bg-emerald-500'
        }`}
        style={{
          boxShadow: `0 0 12px ${darkMode ? 'rgba(52, 211, 153, 0.8)' : 'rgba(16, 185, 129, 0.8)'}`
        }}
      />
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
    const [dropPosition, setDropPosition] = useState(null)
    const columnRef = useRef(null)

    // Smart column drop that calculates insertion position automatically
    const [{ isOver: columnIsOver }, drop] = useDrop({
      accept: 'candidate',
      drop: (item, monitor) => {
        const finalPosition = dropPosition !== null ? dropPosition : (candidates || []).length
        onDropOnStage(item.candidate, stage.key, finalPosition)
        setDropPosition(null)
      },
      hover: (item, monitor) => {
        if (!columnRef.current) return

        const hoverBoundingRect = columnRef.current.getBoundingClientRect()
        const clientOffset = monitor.getClientOffset()

        if (!clientOffset) return

        // Calculate mouse position relative to column
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Find all candidate cards and their positions
        const candidateElements = columnRef.current.querySelectorAll('[data-candidate-id]')
        const candidates = safeCandidates || []

        let newPosition = candidates.length // Default to end

        // Find the best insertion position based on mouse Y position
        for (let i = 0; i < candidateElements.length; i++) {
          const candidateRect = candidateElements[i].getBoundingClientRect()
          const candidateY = candidateRect.top - hoverBoundingRect.top
          const candidateHeight = candidateRect.height
          const candidateCenter = candidateY + candidateHeight / 2

          if (hoverClientY < candidateCenter) {
            newPosition = i
            break
          }
        }

        setDropPosition(newPosition)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver()
      })
    })

    // Combine refs
    drop(columnRef)

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

    return (
      <div
        ref={columnRef}
        className={`w-full min-h-[500px] flex flex-col transition-all duration-200 cursor-pointer ${
          darkMode ? 'bg-gray-800/80 backdrop-blur-sm shadow-xl' : 'bg-white/80 backdrop-blur-sm shadow-lg'
        } rounded-lg border ${
          columnIsOver
            ? darkMode
              ? 'border-emerald-500/60 bg-emerald-500/8 shadow-2xl ring-2 ring-emerald-500/20'
              : 'border-emerald-500/60 bg-emerald-500/8 shadow-2xl ring-2 ring-emerald-500/20'
            : darkMode
              ? 'border-gray-700/50'
              : 'border-gray-200/50'
        }`}
      >
        {/* Stage Header */}
        <div
          className={`p-3 border-b transition-colors duration-200 ${
            columnIsOver
              ? darkMode
                ? 'border-emerald-500/50'
                : 'border-emerald-500/50'
              : darkMode
                ? 'border-gray-700'
                : 'border-gray-200'
          }`}
        >
          <div className='text-center space-y-2'>
            <div
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border transition-colors duration-200 ${
                columnIsOver
                  ? darkMode
                    ? 'bg-emerald-800 text-emerald-200 border-emerald-600'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : darkMode
                    ? getStageDarkColor(stage.color)
                    : getStageColor(stage.color)
              }`}
            >
              {stage.count}
            </div>
            <h3
              className={`text-xs font-semibold leading-tight transition-colors duration-200 ${
                columnIsOver
                  ? darkMode
                    ? 'text-emerald-200'
                    : 'text-emerald-800'
                  : darkMode
                    ? 'text-white'
                    : 'text-gray-900'
              }`}
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
          <div className='space-y-3'>
            {/* Smart drop indicator before first card */}
            {columnIsOver && dropPosition === 0 && <DropIndicator position={0} darkMode={darkMode} />}

            {/* Candidate cards with smart drop indicators */}
            {safeCandidates.map((candidate, index) => (
              <React.Fragment key={candidate.id}>
                <div data-candidate-id={candidate.id}>
                  <CandidateCard
                    candidate={candidate}
                    stageKey={stage.key}
                    onEditCandidate={onEditCandidate}
                    onCandidateAction={onCandidateAction}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    darkMode={darkMode}
                  />
                </div>
                {/* Smart drop indicator after each card */}
                {columnIsOver && dropPosition === index + 1 && (
                  <DropIndicator position={index + 1} darkMode={darkMode} />
                )}
              </React.Fragment>
            ))}

            {/* Drop indicator at the end */}
            {columnIsOver && dropPosition === safeCandidates.length && safeCandidates.length > 0 && (
              <DropIndicator position={safeCandidates.length} darkMode={darkMode} />
            )}

            {/* For empty columns */}
            {safeCandidates.length === 0 && !columnIsOver && (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className='text-sm opacity-40'>Drop candidates here</p>
              </div>
            )}

            {/* Drop indicator for empty columns */}
            {safeCandidates.length === 0 && columnIsOver && <DropIndicator position={0} darkMode={darkMode} />}
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
    candidatesData,
    stages,
    onEditCandidate,
    onCandidateAction,
    onDragStart,
    onDragEnd,
    onDropOnStage,
    draggedCandidate,
    lastDroppedCard,
    darkMode,
    // New filter props
    jobListings = [],
    selectedJobListing,
    onJobListingChange,
    searchTerm = '',
    onSearchChange,
    showFilters = true,
    // View toggle props
    viewMode,
    onViewModeChange,
    showViewToggle = false
  }) => {
    // Safety checks
    if (!candidatesData || !Array.isArray(stages)) {
      return (
        <div
          className={`w-full min-h-[400px] flex items-center justify-center ${
            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
          } rounded-lg border`}
        >
          <p>Error loading candidates data</p>
        </div>
      )
    }

    return (
      <div className='w-full'>
        {/* Filter Bar */}
        {showFilters && (
          <FilterBar
            jobListings={jobListings}
            selectedJobListing={selectedJobListing}
            onJobListingChange={onJobListingChange}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            darkMode={darkMode}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            showViewToggle={showViewToggle}
          />
        )}

        {/* Desktop Layout - 6 columns on large screens */}
        <div className='hidden xl:grid xl:grid-cols-6 gap-6 pb-6'>
          {stages.map((stage) => (
            <StageColumn
              key={stage.key}
              stage={stage}
              candidates={candidatesData[stage.key] || []}
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
              candidates={candidatesData[stage.key] || []}
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
                  candidates={candidatesData[stage.key] || []}
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

// Add FilterBar to the main component exports
KanbanBoard.FilterBar = FilterBar

export default KanbanBoard

// Global styles for dark mode components
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    /* Dark mode styles for Kanban filters */
    .kanban-select-dark .ant-select-selector {
      background-color: #4B5563 !important;
      border-color: #6B7280 !important;
      color: #F9FAFB !important;
    }
    
    .kanban-select-dark .ant-select-selection-placeholder {
      color: #9CA3AF !important;
    }
    
    .kanban-select-dark .ant-select-selection-item {
      color: #F9FAFB !important;
    }
    
    .kanban-select-dark .ant-select-arrow {
      color: #9CA3AF !important;
    }
    
    .kanban-select-dark:hover .ant-select-selector {
      border-color: #10B981 !important;
    }
    
    .kanban-select-dark.ant-select-focused .ant-select-selector {
      border-color: #10B981 !important;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
    }
    
    .kanban-input-dark::placeholder {
      color: #FFFFFF !important;
    }
    
    .kanban-input-dark.ant-input::placeholder {
      color: #FFFFFF !important;
    }
    
    .kanban-input-dark input::placeholder {
      color: #FFFFFF !important;
    }
    
    .ant-input.kanban-input-dark::placeholder {
      color: #FFFFFF !important;
    }
    
    /* More specific Ant Design placeholder selectors */
    .ant-input-affix-wrapper.kanban-input-dark input::placeholder {
      color: #FFFFFF !important;
    }
    
    .ant-input-affix-wrapper.kanban-input-dark .ant-input::placeholder {
      color: #FFFFFF !important;
    }
    
    .kanban-input-dark .ant-input::placeholder {
      color: #FFFFFF !important;
    }
    
    /* Ultra-specific placeholder selectors to override everything */
    div .kanban-input-dark.ant-input::placeholder,
    div .kanban-input-dark input::placeholder,
    .ant-input-affix-wrapper div .kanban-input-dark::placeholder,
    .kanban-input-dark[placeholder] {
      color: #FFFFFF !important;
      opacity: 1 !important;
    }
    
    /* Force placeholder with CSS variable */
    .kanban-input-dark::placeholder {
      color: var(--placeholder-color, #FFFFFF) !important;
    }
    
    /* Target specific input by ID - highest specificity */
    #candidates-search-input::placeholder,
    #candidates-search-input.ant-input::placeholder,
    .ant-input-affix-wrapper #candidates-search-input::placeholder,
    input#candidates-search-input::placeholder {
      color: #FFFFFF !important;
      opacity: 1 !important;
    }
    
    .kanban-input-dark:hover {
      border-color: #10B981 !important;
    }
    
    .kanban-input-dark:focus {
      border-color: #10B981 !important;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
    }
    
    /* Dark mode dropdown options */
    .kanban-dark-dropdown {
      background-color: #374151 !important;
    }
    
    .kanban-dark-dropdown .ant-select-item {
      color: #F9FAFB !important;
    }
    
    .kanban-dark-dropdown .ant-select-item:hover {
      background-color: #4B5563 !important;
    }
    
    .kanban-dark-dropdown .ant-select-item-option-selected {
      background-color: #10B981 !important;
      color: #FFFFFF !important;
    }
    
  `
  if (!document.head.querySelector('#kanban-filter-styles')) {
    style.id = 'kanban-filter-styles'
    document.head.appendChild(style)
  }
}
