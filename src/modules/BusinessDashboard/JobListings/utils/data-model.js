// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for Job Listings
 * Provides validation, transformation, and mapping functions
 * Updated to match complete Supabase schema
 */

/**
 * Job Opportunity data structure definition
 */
export const JobOpportunitySchema = {
  // Basic Information (Required)
  title: { type: 'string', required: true, maxLength: 255 },
  location: { type: 'string', required: true, maxLength: 255 },
  type: { type: 'string', required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  salary: { type: 'string', required: true, maxLength: 100 },
  workArrangement: { type: 'string', required: true, enum: ['On-site', 'Remote', 'Hybrid', 'Flexible'] },
  description: { type: 'string', required: true },

  // Job Description and Questionnaires
  jobDescription: { type: 'uuid', required: true }, // References job_descriptions.id
  questionnaires: { type: 'array', required: false, itemType: 'string' }, // Array of questionnaire IDs (optional)

  // Status and Metadata
  status: { type: 'string', required: false, enum: ['Active', 'Paused', 'Closed'], default: 'Active' },
  applicants: { type: 'number', required: false, default: 0 },
  datePosted: { type: 'date', required: false }
}

/**
 * Transform form data to database format
 * @param {Object} formData - Data from the form
 * @returns {Object} Transformed data for database insertion
 */
export const transformToDatabase = (formData) => {
  const transformed = {
    // Basic Information
    title: formData.title?.trim(),
    location: formData.location?.trim(),
    type: formData.type,
    salary: formData.salary?.trim(),
    work_arrangement: formData.workArrangement,
    description: formData.description?.trim(),
    benefits: formData.benefits?.trim(),

    // Job Description and Questionnaires
    job_description: formData.jobDescription,
    questionnaires: Array.isArray(formData.questionnaires) ? formData.questionnaires : [],

    // Status and Metadata
    status: formData.status || 'Active',
    applicants: formData.applicants || 0,
    date_posted: formData.datePosted || null
  }

  // Remove undefined values
  Object.keys(transformed).forEach((key) => {
    if (transformed[key] === undefined) {
      delete transformed[key]
    }
  })

  return transformed
}

/**
 * Transform database data to form format
 * @param {Object} dbData - Data from the database
 * @returns {Object} Transformed data for form display
 */
export const transformFromDatabase = (dbData) => {
  if (!dbData) return getDefaultJobOpportunityData()

  return {
    id: dbData.id,
    title: dbData.title || '',
    location: dbData.location || '',
    type: dbData.type || '',
    salary: dbData.salary || '',
    workArrangement: dbData.work_arrangement || '',
    description: dbData.description || '',
    benefits: dbData.benefits || '',
    jobDescription: dbData.job_description || null,
    questionnaires: Array.isArray(dbData.questionnaires) ? dbData.questionnaires : [],
    status: dbData.status || 'Active',
    applicants: dbData.applicants || 0,
    datePosted: dbData.date_posted || null,
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by
  }
}

/**
 * Validate job opportunity data
 * @param {Object} data - Job opportunity data to validate
 * @returns {Object} Validation result with success flag and errors array
 */
export const validateJobOpportunity = (data) => {
  const errors = []

  // Required field validation
  if (!data.title?.trim()) {
    errors.push('Job title is required')
  } else if (data.title.length > 255) {
    errors.push('Job title must be 255 characters or less')
  }

  if (!data.location?.trim()) {
    errors.push('Location is required')
  } else if (data.location.length > 255) {
    errors.push('Location must be 255 characters or less')
  }

  if (!data.type) {
    errors.push('Job type is required')
  } else if (!JobOpportunitySchema.type.enum.includes(data.type)) {
    errors.push('Invalid job type')
  }

  if (!data.salary?.trim()) {
    errors.push('Salary is required')
  } else if (data.salary.length > 100) {
    errors.push('Salary must be 100 characters or less')
  }

  if (!data.workArrangement) {
    errors.push('Work arrangement is required')
  } else if (!JobOpportunitySchema.workArrangement.enum.includes(data.workArrangement)) {
    errors.push('Invalid work arrangement')
  }

  if (!data.description?.trim()) {
    errors.push('Job overview is required')
  }

  // Job Description validation
  if (!data.jobDescription) {
    errors.push('Job description is required')
  }

  // Questionnaires validation - now optional
  // No validation required as questionnaires are optional

  if (data.status && !JobOpportunitySchema.status.enum.includes(data.status)) {
    errors.push('Invalid status')
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Get default job opportunity data for new forms
 * @returns {Object} Default job opportunity data
 */
export const getDefaultJobOpportunityData = () => ({
  title: '',
  location: '',
  type: '',
  salary: '',
  workArrangement: '',
  description: '',
  jobDescription: null,
  questionnaires: [],
  status: 'Active',
  applicants: 0,
  datePosted: null
})

/**
 * Get dropdown options for various form fields
 */
export const getDropdownOptions = () => ({
  type: [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' }
  ],
  workArrangement: [
    { value: 'On-site', label: 'On-site' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Flexible', label: 'Flexible' }
  ],
  status: [
    { value: 'Active', label: 'Active' },
    { value: 'Paused', label: 'Paused' },
    { value: 'Closed', label: 'Closed' }
  ]
})
