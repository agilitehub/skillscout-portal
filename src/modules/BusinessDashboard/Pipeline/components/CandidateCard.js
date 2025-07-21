// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faArrowRight,
  faGripVertical,
  faEnvelope,
  faPhone,
  faCalendar,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { Tag, Dropdown } from 'antd'
import { Button } from '../../../../core/components'

/**
 * Individual candidate card component with drag functionality
 */
const CandidateCard = React.memo(
  ({ candidate, stageKey, onEditCandidate, onCandidateAction, darkMode, isBeingDragged = false }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isDraggingState,
      isSorting
    } = useSortable({
      id: candidate.id,
      transition: {
        duration: 200,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || (isSorting ? 'transform 200ms ease-out' : undefined),
      zIndex: isDraggingState ? 1000 : 1
    }

    const getPriorityColor = (priority) => {
      const colors = {
        high: darkMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200',
        medium: darkMode
          ? 'bg-yellow-900 text-yellow-200 border-yellow-700'
          : 'bg-yellow-100 text-yellow-800 border-yellow-200',
        low: darkMode ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200'
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
            action.danger ? 'text-red-600' : action.success ? 'text-green-600' : 'text-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={action.icon} className='w-3 h-3' />
          <span>{action.label}</span>
        </div>
      ),
      onClick: () => onCandidateAction(candidate, action.key)
    }))

    // Add edit option to all actions
    actionItems.unshift({
      key: 'edit',
      label: (
        <div className='flex items-center space-x-2 text-blue-600'>
          <FontAwesomeIcon icon={faEdit} className='w-3 h-3' />
          <span>Edit Candidate</span>
        </div>
      ),
      onClick: () => onEditCandidate(candidate)
    })

    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch {
        return dateString
      }
    }

    const cardClasses = `
    group relative p-3 rounded-lg border transform-gpu
    ${
      isDraggingState || isBeingDragged
        ? `opacity-80 shadow-2xl scale-[1.02] rotate-1 ${
            darkMode
              ? 'bg-gray-700/90 border-gray-600 backdrop-blur-sm'
              : 'bg-white/90 border-gray-300 backdrop-blur-sm'
          }`
        : `opacity-100 hover:shadow-md transition-all duration-200 ${
            darkMode
              ? 'bg-gray-700/80 border-gray-600/60 hover:border-gray-500 hover:bg-gray-700/90 backdrop-blur-sm'
              : 'bg-white/80 border-gray-200/60 hover:border-gray-300 hover:bg-white/90 backdrop-blur-sm'
          }`
    }
    ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'}
  `

    return (
      <div ref={setNodeRef} style={style} className={cardClasses} {...attributes} {...listeners}>
        {/* Drag Handle Indicator */}
        <div
          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`}
        >
          <FontAwesomeIcon icon={faGripVertical} className='w-3 h-3' />
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
          <div className='flex items-center justify-start pt-2'>
            <Dropdown
              menu={{ items: actionItems }}
              placement='bottomLeft'
              trigger={['click']}
              disabled={isDraggingState || isBeingDragged}
            >
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
        </div>
      </div>
    )
  }
)

export default CandidateCard
