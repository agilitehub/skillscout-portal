// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Candidates Data Model
 * Defines the structure and validation for candidates
 */

export const CANDIDATES_STAGES = {
  APPLICATION_RECEIVED: 'application-received',
  SCREENING: 'screening',
  TECHNICAL_INTERVIEW: 'technical-interview',
  FINAL_INTERVIEW: 'final-interview',
  OFFER_EXTENDED: 'offer-extended',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

export const STAGE_COLORS = {
  [CANDIDATES_STAGES.APPLICATION_RECEIVED]: 'blue',
  [CANDIDATES_STAGES.SCREENING]: 'orange',
  [CANDIDATES_STAGES.TECHNICAL_INTERVIEW]: 'purple',
  [CANDIDATES_STAGES.FINAL_INTERVIEW]: 'cyan',
  [CANDIDATES_STAGES.OFFER_EXTENDED]: 'gold',
  [CANDIDATES_STAGES.HIRED]: 'green',
  [CANDIDATES_STAGES.REJECTED]: 'red'
}

export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.HIGH]: 'red',
  [PRIORITY_LEVELS.MEDIUM]: 'orange',
  [PRIORITY_LEVELS.LOW]: 'green'
}

/**
 * Candidate Model
 * Defines the structure for a candidates candidate
 */
export class CandidateModel {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.position = data.position || ''
    this.email = data.email || ''
    this.phone = data.phone || ''
    this.appliedDate = data.appliedDate || new Date().toISOString().split('T')[0]
    this.priority = data.priority || PRIORITY_LEVELS.MEDIUM
    this.tags = data.tags || []
    this.notes = data.notes || ''
    this.stage = data.stage || CANDIDATES_STAGES.APPLICATION_RECEIVED
  }

  /**
   * Validate the candidate data
   * @returns {Object} Validation result
   */
  validate() {
    const errors = []

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required')
    }

    if (!this.position || this.position.trim().length === 0) {
      errors.push('Position is required')
    }

    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      errors.push('Email format is invalid')
    }

    if (!Object.values(PRIORITY_LEVELS).includes(this.priority)) {
      errors.push('Priority must be high, medium, or low')
    }

    if (!Object.values(CANDIDATES_STAGES).includes(this.stage)) {
      errors.push('Stage is invalid')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      email: this.email,
      phone: this.phone,
      appliedDate: this.appliedDate,
      priority: this.priority,
      tags: this.tags,
      notes: this.notes,
      stage: this.stage
    }
  }
}

/**
 * Candidates Data Model
 * Manages the overall candidates structure
 */
export class CandidatesDataModel {
  constructor() {
    this.data = {}
    this.initializeStages()
  }

  /**
   * Initialize empty stages
   */
  initializeStages() {
    Object.values(CANDIDATES_STAGES).forEach(stage => {
      this.data[stage] = []
    })
  }

  /**
   * Add candidate to a stage
   * @param {CandidateModel} candidate - The candidate to add
   * @param {string} stage - The stage to add to
   */
  addCandidate(candidate, stage = CANDIDATES_STAGES.APPLICATION_RECEIVED) {
    if (!this.data[stage]) {
      this.data[stage] = []
    }
    this.data[stage].push(candidate)
  }

  /**
   * Remove candidate from candidates
   * @param {number} candidateId - The candidate ID
   * @returns {boolean} Success status
   */
  removeCandidate(candidateId) {
    for (const stage in this.data) {
      const index = this.data[stage].findIndex(c => c.id === candidateId)
      if (index !== -1) {
        this.data[stage].splice(index, 1)
        return true
      }
    }
    return false
  }

  /**
   * Move candidate between stages
   * @param {number} candidateId - The candidate ID
   * @param {string} fromStage - Source stage
   * @param {string} toStage - Target stage
   * @returns {boolean} Success status
   */
  moveCandidate(candidateId, fromStage, toStage) {
    const candidateIndex = this.data[fromStage]?.findIndex(c => c.id === candidateId)
    if (candidateIndex === -1) return false

    const candidate = this.data[fromStage][candidateIndex]
    this.data[fromStage].splice(candidateIndex, 1)
    this.data[toStage].push(candidate)
    return true
  }

  /**
   * Get candidate by ID
   * @param {number} candidateId - The candidate ID
   * @returns {CandidateModel|null} The candidate or null
   */
  getCandidateById(candidateId) {
    for (const stage in this.data) {
      const candidate = this.data[stage].find(c => c.id === candidateId)
      if (candidate) return candidate
    }
    return null
  }

  /**
   * Get all candidates
   * @returns {Object} All candidates data
   */
  getAllData() {
    return this.data
  }

  /**
   * Get stage statistics
   * @returns {Object} Stage statistics
   */
  getStageStats() {
    const stats = {}
    Object.keys(this.data).forEach(stage => {
      stats[stage] = {
        count: this.data[stage].length,
        highPriority: this.data[stage].filter(c => c.priority === PRIORITY_LEVELS.HIGH).length,
        mediumPriority: this.data[stage].filter(c => c.priority === PRIORITY_LEVELS.MEDIUM).length,
        lowPriority: this.data[stage].filter(c => c.priority === PRIORITY_LEVELS.LOW).length
      }
    })
    return stats
  }
}

export default {
  CandidateModel,
  CandidatesDataModel,
  CANDIDATES_STAGES,
  PRIORITY_LEVELS,
  STAGE_COLORS,
  PRIORITY_COLORS
} 