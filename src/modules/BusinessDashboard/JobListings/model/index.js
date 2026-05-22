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

const FALLBACK_TAG = {
  dark: 'bg-gray-700 text-gray-100 border-gray-500',
  light: 'bg-gray-100 text-gray-700 border-gray-300'
}

/**
 * Tailwind classes for job type tags (Ant Design preset colors are low-contrast in dark tables).
 */
export const getJobTypeTagClass = (type, isDark) => {
  const map = isDark
    ? {
        'Full-time': 'bg-blue-900/80 text-blue-100 border-blue-600',
        'Part-time': 'bg-emerald-900/80 text-emerald-100 border-emerald-600',
        Contract: 'bg-amber-900/80 text-amber-100 border-amber-600',
        Internship: 'bg-purple-900/80 text-purple-100 border-purple-600'
      }
    : {
        'Full-time': 'bg-blue-50 text-blue-700 border-blue-200',
        'Part-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Contract: 'bg-amber-50 text-amber-800 border-amber-200',
        Internship: 'bg-purple-50 text-purple-700 border-purple-200'
      }
  return map[type] || (isDark ? FALLBACK_TAG.dark : FALLBACK_TAG.light)
}

/**
 * Tailwind classes for work arrangement tags.
 */
export const getWorkArrangementTagClass = (arrangement, isDark) => {
  const map = isDark
    ? {
        Remote: 'bg-emerald-900/80 text-emerald-100 border-emerald-600',
        Hybrid: 'bg-blue-900/80 text-blue-100 border-blue-600',
        'On-site': 'bg-slate-700 text-slate-100 border-slate-500',
        Flexible: 'bg-violet-900/80 text-violet-100 border-violet-600'
      }
    : {
        Remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Hybrid: 'bg-blue-50 text-blue-700 border-blue-200',
        'On-site': 'bg-gray-100 text-gray-700 border-gray-300',
        Flexible: 'bg-purple-50 text-purple-700 border-purple-200'
      }
  return map[arrangement] || (isDark ? FALLBACK_TAG.dark : FALLBACK_TAG.light)
}

/**
 * Tailwind classes for job status tags.
 */
export const getJobStatusTagClass = (status, isDark) => {
  const map = isDark
    ? {
        Active: 'bg-emerald-900/80 text-emerald-100 border-emerald-600',
        Paused: 'bg-amber-900/80 text-amber-100 border-amber-600',
        Closed: 'bg-red-900/80 text-red-100 border-red-600'
      }
    : {
        Active: 'bg-green-50 text-green-700 border-green-200',
        Paused: 'bg-orange-50 text-orange-800 border-orange-200',
        Closed: 'bg-red-50 text-red-700 border-red-200'
      }
  return map[status] || (isDark ? FALLBACK_TAG.dark : FALLBACK_TAG.light)
}
