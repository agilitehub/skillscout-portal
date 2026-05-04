// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/** Ordered Kanban pipeline stages used by the dashboard UI */
export const PIPELINE_STAGE_KEYS = [
  'application-received',
  'screening',
  'assessment',
  'technical-interview',
  'final-interview',
  'offer-extended'
]

export const STORAGE_KEY_CANDIDATES_BOARD = 'candidatesData'

export const STAGE_TITLE_MAP = {
  'application-received': 'Application Received',
  screening: 'Screening',
  assessment: 'Assessment',
  'technical-interview': 'Technical Interview',
  'final-interview': 'Final Interview',
  'offer-extended': 'Offer Extended'
}

export function getStageTitle(stageKey) {
  return STAGE_TITLE_MAP[stageKey] || stageKey
}

/** Demo job listings until API-backed listings exist */
export const MOCK_JOB_LISTINGS = [
  { id: 1, title: 'Senior React Developer', department: 'Engineering' },
  { id: 2, title: 'UX Designer', department: 'Design' },
  { id: 3, title: 'Full Stack Developer', department: 'Engineering' },
  { id: 4, title: 'Frontend Developer', department: 'Engineering' },
  { id: 5, title: 'Backend Developer', department: 'Engineering' },
  { id: 6, title: 'DevOps Engineer', department: 'Engineering' },
  { id: 7, title: 'Product Manager', department: 'Product' },
  { id: 8, title: 'Data Scientist', department: 'Data' },
  { id: 9, title: 'QA Engineer', department: 'Quality Assurance' },
  { id: 10, title: 'Marketing Manager', department: 'Marketing' }
]

export function createDefaultBoardData() {
  return {
    'application-received': [
      {
        id: 1,
        name: 'John Smith',
        position: 'Senior React Developer',
        jobListingId: 1,
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
        jobListingId: 2,
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
        jobListingId: 3,
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
        jobListingId: 5,
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
        jobListingId: 4,
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
        jobListingId: 6,
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
        jobListingId: 7,
        email: 'lisa.brown@email.com',
        phone: '+1 (555) 567-8901',
        appliedDate: '2024-01-01',
        priority: 'high',
        tags: ['Product Management', 'Agile', 'Strategy'],
        notes: 'Offer extended, awaiting response'
      }
    ]
  }
}

export function ensureBoardShape(raw) {
  const defaults = createDefaultBoardData()
  if (!raw || typeof raw !== 'object') {
    return { ...defaults }
  }
  const next = {}
  PIPELINE_STAGE_KEYS.forEach((key) => {
    next[key] = Array.isArray(raw[key]) ? raw[key] : defaults[key] ? [...defaults[key]] : []
  })
  return next
}

export function readPersistedBoard(storageKey = STORAGE_KEY_CANDIDATES_BOARD) {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      return ensureBoardShape(JSON.parse(saved))
    }
  } catch (error) {
    console.warn('Error loading candidates data from localStorage:', error)
  }
  return null
}

export function persistBoard(board, storageKey = STORAGE_KEY_CANDIDATES_BOARD) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(board))
  } catch (error) {
    console.warn('Error saving candidates data to localStorage:', error)
  }
}

export function getInitialBoardState(storageKey = STORAGE_KEY_CANDIDATES_BOARD) {
  const persisted = readPersistedBoard(storageKey)
  if (persisted) return persisted
  return createDefaultBoardData()
}

export function flattenBoard(board) {
  const flattened = []
  PIPELINE_STAGE_KEYS.forEach((stageKey) => {
    const candidates = board[stageKey] || []
    candidates.forEach((candidate) => {
      flattened.push({
        ...candidate,
        stage: stageKey,
        stageTitle: getStageTitle(stageKey)
      })
    })
  })
  return flattened
}

export function candidateMatchesSearch(candidate, searchLower) {
  return (
    candidate.name.toLowerCase().includes(searchLower) ||
    candidate.position.toLowerCase().includes(searchLower) ||
    candidate.email.toLowerCase().includes(searchLower) ||
    candidate.tags.some((tag) => tag.toLowerCase().includes(searchLower))
  )
}

export function filterFlattenedBySearch(flattened, searchTerm) {
  if (!searchTerm?.trim()) return flattened
  const searchLower = searchTerm.toLowerCase()
  return flattened.filter((c) => candidateMatchesSearch(c, searchLower))
}

export function filterBoardForKanban(board, selectedJobListing, searchTerm) {
  const filtered = {}
  PIPELINE_STAGE_KEYS.forEach((stage) => {
    filtered[stage] = []
  })

  const searchLower = searchTerm?.trim().toLowerCase()

  PIPELINE_STAGE_KEYS.forEach((stage) => {
    const stageCandidates = board[stage] || []
    filtered[stage] = stageCandidates.filter((candidate) => {
      const jobListingMatch = !selectedJobListing || candidate.jobListingId === selectedJobListing
      const searchMatch = !searchLower || candidateMatchesSearch(candidate, searchLower)
      return jobListingMatch && searchMatch
    })
  })

  return filtered
}

export function findCandidateLocation(board, candidateId) {
  const id = typeof candidateId === 'string' ? parseInt(candidateId, 10) : candidateId

  for (const stageKey of PIPELINE_STAGE_KEYS) {
    const candidates = board[stageKey] || []
    const candidateIndex = candidates.findIndex((c) => c.id === id)
    if (candidateIndex !== -1) {
      return {
        candidate: candidates[candidateIndex],
        stageKey,
        index: candidateIndex
      }
    }
  }
  return null
}

/** Kanban toolbar metadata (counts filled by caller) */
export const KANBAN_STAGE_META = [
  { key: 'application-received', title: 'Application Received', color: 'teal' },
  { key: 'screening', title: 'Screening', color: 'emerald' },
  { key: 'assessment', title: 'Assessment', color: 'blue' },
  { key: 'technical-interview', title: 'Technical Interview', color: 'emerald-light' },
  { key: 'final-interview', title: 'Final Interview', color: 'blue-light' },
  { key: 'offer-extended', title: 'Offer Extended', color: 'emerald-success' }
]

export function buildKanbanStages(board) {
  return KANBAN_STAGE_META.map((meta) => ({
    ...meta,
    count: (board[meta.key] || []).length
  }))
}

export const QUICK_ACTION_TARGET_STAGE = {
  'move-to-screening': 'screening',
  'move-to-assessment': 'assessment',
  'move-to-technical': 'technical-interview',
  'move-to-final': 'final-interview',
  'move-to-offer': 'offer-extended'
}

export function boardAfterQuickMove(board, candidate, action) {
  const targetStage = QUICK_ACTION_TARGET_STAGE[action]
  if (!targetStage) return board

  const next = {}
  PIPELINE_STAGE_KEYS.forEach((k) => {
    next[k] = [...(board[k] || [])]
  })

  let moved = null
  PIPELINE_STAGE_KEYS.forEach((sk) => {
    next[sk] = next[sk].filter((c) => {
      if (c.id === candidate.id) {
        moved = c
        return false
      }
      return true
    })
  })

  if (!moved) return board
  next[targetStage] = [...next[targetStage], moved]
  return next
}

export function boardAfterDrop(board, candidate, targetStage, position) {
  const sourceInfo = findCandidateLocation(board, candidate.id)
  if (!sourceInfo) return board

  const { stageKey: sourceStage } = sourceInfo

  const next = {}
  PIPELINE_STAGE_KEYS.forEach((k) => {
    next[k] = [...(board[k] || [])]
  })

  next[sourceStage] = next[sourceStage].filter((c) => c.id !== candidate.id)
  const targetCandidates = [...next[targetStage]]

  if (position >= targetCandidates.length) {
    targetCandidates.push(candidate)
  } else {
    targetCandidates.splice(position, 0, candidate)
  }
  next[targetStage] = targetCandidates

  return next
}
