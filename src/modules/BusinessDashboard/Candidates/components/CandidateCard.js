// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Tag, Dropdown } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faArrowRight,
  faEnvelope,
  faPhone,
  faCalendar,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { useDrag } from 'react-dnd'
import { Button } from '../../../../core/components'

/**
 * Individual candidate card component with drag functionality
 */
const CandidateCard = React.memo(
  ({
    candidate,
    stageKey,
    onEditCandidate,
    onCandidateAction,
    onDragStart,
    onDragEnd,
    lastDroppedCard,
    darkMode,
    isBeingDragged = false
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'candidate',
      item: () => {
        onDragStart?.(candidate)
        return { candidate, stageKey }
      },
      end: () => {
        onDragEnd?.()
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    })

    // Safety check for candidate data (after hooks)
    if (!candidate || !candidate.id || !candidate.name) {
      return (
        <div
          ref={drag}
          className={`p-3 rounded-lg border text-center ${
            darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'
          }`}
        >
          <p className='text-xs'>Invalid candidate data</p>
        </div>
      )
    }

    const getPriorityColor = (priority) => {
      const colors = {
        high: darkMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200',
        medium: darkMode
          ? 'bg-blue-900 text-blue-200 border-blue-700'
          : 'bg-blue-100 text-blue-800 border-blue-200',
        low: darkMode ? 'bg-emerald-900 text-emerald-200 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
      }
      return colors[priority] || colors.medium
    }

    const getPriorityIcon = (priority) => {
      if (priority === 'high') return faExclamationTriangle
      return null
    }

    const getNextStageActions = (currentStage) => {
      const actions = []

      switch (currentStage) {
        case 'application-received':
          actions.push({ key: 'move-to-screening', label: 'Move to Screening', icon: faArrowRight })
          break
        case 'screening':
          actions.push({ key: 'move-to-assessment', label: 'Move to Assessment', icon: faArrowRight })
          break
        case 'assessment':
          actions.push({ key: 'move-to-technical', label: 'Move to Technical', icon: faArrowRight })
          break
        case 'technical-interview':
          actions.push({ key: 'move-to-final', label: 'Move to Final', icon: faArrowRight })
          break
        case 'final-interview':
          actions.push({ key: 'move-to-offer', label: 'Extend Offer', icon: faArrowRight })
          break
        case 'offer-extended':
          // Final stage - no further actions
          break
        default:
          break
      }

      return actions
    }

    const actionItems = getNextStageActions(stageKey).map((action) => ({
      key: action.key,
      label: (
        <div
          className={`flex items-center space-x-2 ${
            action.danger ? 'text-red-600' : action.success ? 'text-emerald-600' : 'text-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={action.icon} className='w-3 h-3' />
          <span>{action.label}</span>
        </div>
      ),
      onClick: () => onCandidateAction(candidate, action.key)
    }))

    // Edit option is now handled by the dedicated edit button

    const formatDate = (dateString) => {
      try {
        if (!dateString) return 'No date'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString

        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch (error) {
        console.warn('Error formatting date:', error)
        return dateString || 'Invalid date'
      }
    }

    const cardClasses = `
    group relative p-3 rounded-lg border cursor-grab
    hover:shadow-md transition-all duration-200 ${
      darkMode
        ? 'bg-gray-700/80 border-gray-600/60 hover:border-gray-500 hover:bg-gray-700/90 backdrop-blur-sm'
        : 'bg-white/80 border-gray-200/60 hover:border-gray-300 hover:bg-white/90 backdrop-blur-sm'
    } ${isDragging || isBeingDragged ? 'opacity-50 shadow-xl ring-2 ring-emerald-500/50' : ''}
    ${lastDroppedCard === candidate.id ? 'animate-pulse ring-2 ring-emerald-500 shadow-lg' : ''}
  `

    // Hide the card if it's being dragged to prevent duplication
    if (isDragging) {
      return <div className='h-20 opacity-0 pointer-events-none'>{/* Invisible placeholder to maintain layout */}</div>
    }

    return (
      <div ref={drag} className={cardClasses}>
        {/* Edit Button */}
        <div
          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Button
            size='small'
            type='text'
            icon={<FontAwesomeIcon icon={faEdit} className='w-3 h-3' />}
            className={`p-1 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={(e) => {
              e.stopPropagation()
              onEditCandidate(candidate)
            }}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>

        {/* Candidate Info */}
        <div className='space-y-2'>
          {/* Name and Position */}
          <div>
            <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{candidate.name}</h4>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{candidate.position}</p>
          </div>

          {/* Contact Info */}
          <div className='space-y-1'>
            <div className={`flex items-center space-x-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FontAwesomeIcon icon={faEnvelope} className='w-3 h-3' />
              <span className='truncate'>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className={`flex items-center space-x-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FontAwesomeIcon icon={faPhone} className='w-3 h-3' />
                <span>{candidate.phone}</span>
              </div>
            )}
            <div className={`flex items-center space-x-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FontAwesomeIcon icon={faCalendar} className='w-3 h-3' />
              <span>Applied: {formatDate(candidate.appliedDate)}</span>
            </div>
          </div>

          {/* Priority and Tags */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(candidate.priority)}`}
              >
                {getPriorityIcon(candidate.priority) && (
                  <FontAwesomeIcon icon={getPriorityIcon(candidate.priority)} className='w-3 h-3 mr-1' />
                )}
                {candidate.priority}
              </div>
            </div>
          </div>

          {/* Tags */}
          {candidate.tags && candidate.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {candidate.tags.slice(0, 3).map((tag, index) => (
                <Tag
                  key={index}
                  size='small'
                  className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                >
                  {tag}
                </Tag>
              ))}
              {candidate.tags.length > 3 && (
                <Tag
                  size='small'
                  className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                >
                  +{candidate.tags.length - 3}
                </Tag>
              )}
            </div>
          )}

          {/* Notes */}
          {candidate.notes && (
            <div
              className={`text-xs p-2 rounded border ${
                darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <p className='line-clamp-2'>{candidate.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          {actionItems.length > 0 && (
            <div className='flex items-center justify-start pt-2'>
              <Dropdown menu={{ items: actionItems }} placement='bottomLeft' trigger={['click']} disabled={isDragging}>
                <Button
                  size='small'
                  type='text'
                  className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  Actions
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default CandidateCard
