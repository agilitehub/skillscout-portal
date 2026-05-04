// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import {
  getInitialBoardState,
  MOCK_JOB_LISTINGS,
  persistBoard,
  flattenBoard,
  filterFlattenedBySearch,
  filterBoardForKanban,
  findCandidateLocation,
  buildKanbanStages,
  boardAfterQuickMove,
  boardAfterDrop,
  getStageTitle,
  QUICK_ACTION_TARGET_STAGE
} from '../model/candidatesWorkspace'

/**
 * Candidates pipeline page: persisted board state, filters, drag/move actions.
 */
export function useCandidatesWorkspace(_user) {
  const navigate = useNavigate()
  const flashTimerRef = useRef(null)

  const [draggedCandidate, setDraggedCandidate] = useState(null)
  const [lastDroppedCard, setLastDroppedCard] = useState(null)
  const [viewMode, setViewMode] = useState('kanban')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [selectedJobListing, setSelectedJobListing] = useState(null)

  const [candidatesData, setCandidatesData] = useState(() => getInitialBoardState())

  useEffect(() => {
    persistBoard(candidatesData)
  }, [candidatesData])

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current)
      }
    }
  }, [])

  const jobListings = useMemo(() => MOCK_JOB_LISTINGS, [])

  const handleEdit = useCallback(
    (candidate) => {
      navigate(`/business-dashboard/candidates/${candidate.id}/edit`, {
        state: {
          editId: candidate.id,
          initialData: candidate
        }
      })
    },
    [navigate]
  )

  const handleView = useCallback(
    (candidate) => {
      const loc = findCandidateLocation(candidatesData, candidate.id)
      setSelectedCandidate(
        loc ? { ...candidate, stage: loc.stageKey, stageTitle: getStageTitle(loc.stageKey) } : candidate
      )
      setViewModalVisible(true)
    },
    [candidatesData]
  )

  const handleCloseViewModal = useCallback(() => {
    setViewModalVisible(false)
    setSelectedCandidate(null)
  }, [])

  const flattenedCandidates = useMemo(() => flattenBoard(candidatesData), [candidatesData])

  const filteredCandidates = useMemo(
    () => filterFlattenedBySearch(flattenedCandidates, searchTerm),
    [flattenedCandidates, searchTerm]
  )

  const filteredCandidatesData = useMemo(
    () => filterBoardForKanban(candidatesData, selectedJobListing, searchTerm),
    [candidatesData, selectedJobListing, searchTerm]
  )

  const stages = useMemo(() => buildKanbanStages(candidatesData), [candidatesData])

  const handleAdd = useCallback(() => {
    navigate('/business-dashboard/candidates/create')
  }, [navigate])

  const handleCandidateAction = useCallback((candidate, action) => {
    const targetStage = QUICK_ACTION_TARGET_STAGE[action]
    if (!targetStage) return

    setCandidatesData((prev) => boardAfterQuickMove(prev, candidate, action))
    message.success(`Moved ${candidate.name} to ${getStageTitle(targetStage)}`)
  }, [])

  const handleDragStart = useCallback((candidate) => {
    setDraggedCandidate(candidate)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedCandidate(null)
  }, [])

  const handleDropOnStage = useCallback(
    (candidate, targetStage, position) => {
      if (!candidate || !targetStage) return

      const sourceInfo = findCandidateLocation(candidatesData, candidate.id)
      if (!sourceInfo) return

      const { stageKey: sourceStage } = sourceInfo

      if (sourceStage === targetStage) {
        const currentIndex = candidatesData[sourceStage].findIndex((c) => c.id === candidate.id)
        if (currentIndex === position || (currentIndex === position - 1 && position > 0)) {
          return
        }
      }

      setCandidatesData((prev) => boardAfterDrop(prev, candidate, targetStage, position))

      setLastDroppedCard(candidate.id)
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current)
      }
      flashTimerRef.current = window.setTimeout(() => setLastDroppedCard(null), 2000)

      if (sourceStage !== targetStage) {
        message.success(`Moved ${candidate.name} to ${getStageTitle(targetStage)}`)
      } else {
        message.success(`Reordered ${candidate.name}`)
      }
    },
    [candidatesData]
  )

  const handleViewToggle = useCallback((mode) => {
    setViewMode(mode)
  }, [])

  const handleSearch = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const handleJobListingChange = useCallback((jobListingId) => {
    setSelectedJobListing(jobListingId)
  }, [])

  return {
    draggedCandidate,
    lastDroppedCard,
    viewMode,
    searchTerm,
    viewModalVisible,
    selectedCandidate,
    selectedJobListing,
    candidatesData,
    jobListings,
    flattenedCandidates,
    filteredCandidates,
    filteredCandidatesData,
    stages,
    handleEdit,
    handleView,
    handleCloseViewModal,
    handleAdd,
    handleCandidateAction,
    handleDragStart,
    handleDragEnd,
    handleDropOnStage,
    handleViewToggle,
    handleSearch,
    handleJobListingChange,
    getStageTitle
  }
}
