// Global Instructions Rule Applied!

/**
 * Data Model for Job Opportunities
 * Provides validation, transformation, and mapping functions
 */

/**
 * Job Opportunity data structure definition
 */
export const JobOpportunitySchema = {
  // Basic Information (Required)
  title: { type: 'string', required: true, maxLength: 255 },
  company: { type: 'string', required: true, maxLength: 255 },
  location: { type: 'string', required: true, maxLength: 255 },
  type: { type: 'string', required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  salary: { type: 'string', required: true, maxLength: 100 },
  workArrangement: { type: 'string', required: true, enum: ['On-site', 'Remote', 'Hybrid', 'Flexible'] },
  description: { type: 'string', required: true },

  // Optional Basic Information
  benefits: { type: 'string', required: false },

  // Candidate Requirements (Some Required)
  experienceRequired: { type: 'string', required: true, enum: ['0-1', '2-4', '5-7', '8+'] },
  educationLevel: {
    type: 'string',
    required: false,
    enum: ['High School', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD']
  },
  fieldOfStudy: { type: 'string', required: false, maxLength: 255 },
  industryExperience: {
    type: 'string',
    required: false,
    enum: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Marketing', 'Other']
  },
  requiredSkills: { type: 'string', required: true },
  softSkills: { type: 'string', required: false },
  toolsRequired: { type: 'string', required: false },
  certificationsRequired: { type: 'string', required: false, maxLength: 255 },
  visaSponsorship: { type: 'string', required: false, enum: ['Available', 'Not Available', 'Case by Case'] },
  travelRequirements: { type: 'string', required: false, enum: ['None', 'Occasional', 'Frequent', 'Extensive'] },

  // Application Requirements
  employmentTypes: { type: 'array', required: true },
  resumeRequired: { type: 'boolean', required: true, default: true },
  coverLetterRequired: { type: 'string', required: false, enum: ['Required', 'Preferred', 'Optional'] },
  portfolioRequired: { type: 'string', required: false, enum: ['Required', 'Preferred', 'Optional'] },
  referencesRequired: { type: 'string', required: false, enum: ['Required', 'Upon Request', 'Optional'] },
  applicationInstructions: { type: 'string', required: false },
  screeningQuestions: { type: 'string', required: false },

  // Status and Metadata
  status: { type: 'string', required: false, enum: ['Active', 'Paused', 'Closed'], default: 'Active' },
  applicants: { type: 'number', required: false, default: 0 },
  datePosted: { type: 'date', required: false },
  remote: { type: 'boolean', required: false, default: false },

  // Custom Fields
  customFields: { type: 'array', required: false, default: [] }
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
    company: formData.company?.trim(),
    location: formData.location?.trim(),
    type: formData.type,
    salary: formData.salary?.trim(),
    work_arrangement: formData.workArrangement,
    description: formData.description?.trim(),
    benefits: formData.benefits?.trim() || null,

    // Candidate Requirements
    experience_required: formData.experienceRequired,
    education_level: formData.educationLevel || null,
    field_of_study: formData.fieldOfStudy?.trim() || null,
    industry_experience: formData.industryExperience || null,
    required_skills: formData.requiredSkills?.trim(),
    soft_skills: formData.softSkills?.trim() || null,
    tools_required: formData.toolsRequired?.trim() || null,
    certifications_required: formData.certificationsRequired?.trim() || null,
    visa_sponsorship: formData.visaSponsorship || null,
    travel_requirements: formData.travelRequirements || null,

    // Application Requirements
    employment_types: Array.isArray(formData.employmentTypes) ? formData.employmentTypes : [],
    resume_required: formData.resumeRequired !== undefined ? formData.resumeRequired : true,
    cover_letter_required: formData.coverLetterRequired || null,
    portfolio_required: formData.portfolioRequired || null,
    references_required: formData.referencesRequired || null,
    application_instructions: formData.applicationInstructions?.trim() || null,
    screening_questions: formData.screeningQuestions?.trim() || null,

    // Status and Metadata
    status: formData.status || 'Active',
    applicants: formData.applicants || 0,
    remote: formData.workArrangement === 'Remote' || formData.workArrangement === 'Hybrid',

    // Custom Fields
    custom_fields: Array.isArray(formData.customFields) ? formData.customFields : []
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
 * Transform database data to frontend format
 * @param {Object} dbData - Data from database
 * @returns {Object} Transformed data for frontend consumption
 */
export const transformFromDatabase = (dbData) => {
  if (!dbData) return null

  return {
    // Basic Information
    id: dbData.id,
    title: dbData.title,
    company: dbData.company,
    location: dbData.location,
    type: dbData.type,
    salary: dbData.salary,
    workArrangement: dbData.work_arrangement,
    description: dbData.description,
    benefits: dbData.benefits,

    // Candidate Requirements
    experienceRequired: dbData.experience_required,
    educationLevel: dbData.education_level,
    fieldOfStudy: dbData.field_of_study,
    industryExperience: dbData.industry_experience,
    requiredSkills: dbData.required_skills,
    softSkills: dbData.soft_skills,
    toolsRequired: dbData.tools_required,
    certificationsRequired: dbData.certifications_required,
    visaSponsorship: dbData.visa_sponsorship,
    travelRequirements: dbData.travel_requirements,

    // Application Requirements
    employmentTypes: dbData.employment_types || [],
    resumeRequired: dbData.resume_required,
    coverLetterRequired: dbData.cover_letter_required,
    portfolioRequired: dbData.portfolio_required,
    referencesRequired: dbData.references_required,
    applicationInstructions: dbData.application_instructions,
    screeningQuestions: dbData.screening_questions,

    // Status and Metadata
    status: dbData.status,
    applicants: dbData.applicants || 0,
    datePosted: dbData.date_posted || dbData.created_at?.split('T')[0],
    remote: dbData.remote,

    // Custom Fields
    customFields: dbData.custom_fields || [],

    // Audit fields
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by
  }
}

/**
 * Validate job opportunity data
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result with success status and errors
 */
export const validateJobOpportunity = (data) => {
  const errors = []

  // Required field validation
  const requiredFields = [
    { field: 'title', message: 'Job title is required' },
    { field: 'company', message: 'Company name is required' },
    { field: 'location', message: 'Location is required' },
    { field: 'type', message: 'Job type is required' },
    { field: 'salary', message: 'Salary range is required' },
    { field: 'workArrangement', message: 'Work arrangement is required' },
    { field: 'description', message: 'Job description is required' },
    { field: 'experienceRequired', message: 'Experience level is required' },
    { field: 'requiredSkills', message: 'Required skills are required' },
    { field: 'employmentTypes', message: 'Employment types are required' }
  ]

  requiredFields.forEach(({ field, message }) => {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      errors.push(message)
    }
  })

  // String length validation
  if (data.title && data.title.length > 255) {
    errors.push('Job title must be less than 255 characters')
  }

  if (data.company && data.company.length > 255) {
    errors.push('Company name must be less than 255 characters')
  }

  if (data.location && data.location.length > 255) {
    errors.push('Location must be less than 255 characters')
  }

  // Enum validation
  const enumValidations = [
    { field: 'type', values: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
    { field: 'workArrangement', values: ['On-site', 'Remote', 'Hybrid', 'Flexible'] },
    { field: 'experienceRequired', values: ['0-1', '2-4', '5-7', '8+'] },
    { field: 'status', values: ['Active', 'Paused', 'Closed'] }
  ]

  enumValidations.forEach(({ field, values }) => {
    if (data[field] && !values.includes(data[field])) {
      errors.push(`Invalid ${field}: ${data[field]}`)
    }
  })

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Create default job opportunity object
 * @returns {Object} Default job opportunity data
 */
export const createDefaultJobOpportunity = () => ({
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  salary: '',
  workArrangement: 'On-site',
  description: '',
  benefits: '',
  experienceRequired: '2-4',
  educationLevel: '',
  fieldOfStudy: '',
  industryExperience: '',
  requiredSkills: '',
  softSkills: '',
  toolsRequired: '',
  certificationsRequired: '',
  visaSponsorship: '',
  travelRequirements: '',
  employmentTypes: ['Full-time'],
  resumeRequired: true,
  coverLetterRequired: 'Optional',
  portfolioRequired: 'Optional',
  referencesRequired: 'Upon Request',
  applicationInstructions: '',
  screeningQuestions: '',
  status: 'Active',
  applicants: 0,
  remote: false,
  customFields: []
})
