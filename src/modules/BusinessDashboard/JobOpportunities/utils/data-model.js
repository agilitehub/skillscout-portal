// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for Job Opportunities
 * Provides validation, transformation, and mapping functions
 * Updated to match complete Supabase schema
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
  resumeRequired: { type: 'boolean', required: false, default: true },
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
    date_posted: formData.datePosted || null,
    remote: formData.workArrangement === 'Remote' || formData.workArrangement === 'Hybrid',
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
 * Transform database data to form format
 * @param {Object} dbData - Data from the database
 * @returns {Object} Transformed data for form display
 */
export const transformFromDatabase = (dbData) => {
  if (!dbData) return getDefaultJobOpportunityData()

  return {
    id: dbData.id,
    title: dbData.title || '',
    company: dbData.company || '',
    location: dbData.location || '',
    type: dbData.type || '',
    salary: dbData.salary || '',
    workArrangement: dbData.work_arrangement || '',
    description: dbData.description || '',
    benefits: dbData.benefits || '',
    experienceRequired: dbData.experience_required || '',
    educationLevel: dbData.education_level || '',
    fieldOfStudy: dbData.field_of_study || '',
    industryExperience: dbData.industry_experience || '',
    requiredSkills: dbData.required_skills || '',
    softSkills: dbData.soft_skills || '',
    toolsRequired: dbData.tools_required || '',
    certificationsRequired: dbData.certifications_required || '',
    visaSponsorship: dbData.visa_sponsorship || '',
    travelRequirements: dbData.travel_requirements || '',
    employmentTypes: Array.isArray(dbData.employment_types) ? dbData.employment_types : [],
    resumeRequired: dbData.resume_required !== undefined ? dbData.resume_required : true,
    coverLetterRequired: dbData.cover_letter_required || '',
    portfolioRequired: dbData.portfolio_required || '',
    referencesRequired: dbData.references_required || '',
    applicationInstructions: dbData.application_instructions || '',
    screeningQuestions: dbData.screening_questions || '',
    status: dbData.status || 'Active',
    applicants: dbData.applicants || 0,
    datePosted: dbData.date_posted || null,
    remote: dbData.remote || false,
    customFields: Array.isArray(dbData.custom_fields) ? dbData.custom_fields : [],
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

  if (!data.company?.trim()) {
    errors.push('Company name is required')
  } else if (data.company.length > 255) {
    errors.push('Company name must be 255 characters or less')
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
    errors.push('Job description is required')
  }

  if (!data.experienceRequired) {
    errors.push('Experience required is required')
  } else if (!JobOpportunitySchema.experienceRequired.enum.includes(data.experienceRequired)) {
    errors.push('Invalid experience level')
  }

  if (!data.requiredSkills?.trim()) {
    errors.push('Required skills are required')
  }

  if (!Array.isArray(data.employmentTypes) || data.employmentTypes.length === 0) {
    errors.push('At least one employment type is required')
  }

  // Optional field validation with enum checks
  if (data.educationLevel && !JobOpportunitySchema.educationLevel.enum.includes(data.educationLevel)) {
    errors.push('Invalid education level')
  }

  if (data.industryExperience && !JobOpportunitySchema.industryExperience.enum.includes(data.industryExperience)) {
    errors.push('Invalid industry experience')
  }

  if (data.visaSponsorship && !JobOpportunitySchema.visaSponsorship.enum.includes(data.visaSponsorship)) {
    errors.push('Invalid visa sponsorship option')
  }

  if (data.travelRequirements && !JobOpportunitySchema.travelRequirements.enum.includes(data.travelRequirements)) {
    errors.push('Invalid travel requirements option')
  }

  if (data.coverLetterRequired && !JobOpportunitySchema.coverLetterRequired.enum.includes(data.coverLetterRequired)) {
    errors.push('Invalid cover letter requirement option')
  }

  if (data.portfolioRequired && !JobOpportunitySchema.portfolioRequired.enum.includes(data.portfolioRequired)) {
    errors.push('Invalid portfolio requirement option')
  }

  if (data.referencesRequired && !JobOpportunitySchema.referencesRequired.enum.includes(data.referencesRequired)) {
    errors.push('Invalid references requirement option')
  }

  if (data.status && !JobOpportunitySchema.status.enum.includes(data.status)) {
    errors.push('Invalid status')
  }

  // String length validation
  if (data.fieldOfStudy && data.fieldOfStudy.length > 255) {
    errors.push('Field of study must be 255 characters or less')
  }

  if (data.certificationsRequired && data.certificationsRequired.length > 255) {
    errors.push('Certifications required must be 255 characters or less')
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
  company: '',
  location: '',
  type: '',
  salary: '',
  workArrangement: '',
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
  datePosted: null,
  remote: false,
  customFields: []
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
  experienceRequired: [
    { value: '0-1', label: '0-1 years' },
    { value: '2-4', label: '2-4 years' },
    { value: '5-7', label: '5-7 years' },
    { value: '8+', label: '8+ years' }
  ],
  educationLevel: [
    { value: 'High School', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: 'PhD', label: 'PhD' }
  ],
  industryExperience: [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Education', label: 'Education' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Other', label: 'Other' }
  ],
  visaSponsorship: [
    { value: 'Available', label: 'Available' },
    { value: 'Not Available', label: 'Not Available' },
    { value: 'Case by Case', label: 'Case by Case' }
  ],
  travelRequirements: [
    { value: 'None', label: 'None' },
    { value: 'Occasional', label: 'Occasional' },
    { value: 'Frequent', label: 'Frequent' },
    { value: 'Extensive', label: 'Extensive' }
  ],
  coverLetterRequired: [
    { value: 'Required', label: 'Required' },
    { value: 'Preferred', label: 'Preferred' },
    { value: 'Optional', label: 'Optional' }
  ],
  portfolioRequired: [
    { value: 'Required', label: 'Required' },
    { value: 'Preferred', label: 'Preferred' },
    { value: 'Optional', label: 'Optional' }
  ],
  referencesRequired: [
    { value: 'Required', label: 'Required' },
    { value: 'Upon Request', label: 'Upon Request' },
    { value: 'Optional', label: 'Optional' }
  ],
  status: [
    { value: 'Active', label: 'Active' },
    { value: 'Paused', label: 'Paused' },
    { value: 'Closed', label: 'Closed' }
  ],
  employmentTypes: [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Temporary', label: 'Temporary' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Volunteer', label: 'Volunteer' },
    { value: 'Freelance', label: 'Freelance' }
  ]
})
