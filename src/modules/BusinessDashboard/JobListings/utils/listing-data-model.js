// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data model for engaging job listings with storytelling formats
 * Supports Purpose-Driven, Impact-Mission, and Challenge-Call formats
 */

/**
 * Job Listing Schema - Enhanced for storytelling and engagement
 */
export const JobListingSchema = {
  // Basic Information
  title: { type: 'string', required: true, maxLength: 255 },
  industry: { type: 'string', required: true, maxLength: 100 },
  category: { type: 'string', required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'] },
  location: { type: 'string', required: true, maxLength: 255 },
  workStyle: { type: 'string', required: true, enum: ['Remote', 'On-site', 'Hybrid', 'Flexible'] },
  compensation: { type: 'string', required: false, maxLength: 100 },
  experienceLevel: { type: 'string', required: false, enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'] },

  // Listing Style
  listingStyle: {
    type: 'string',
    required: true,
    enum: ['purpose-driven', 'impact-mission', 'challenge-call']
  },

  // Purpose-Driven Format Fields
  intro: { type: 'string', required: false, maxLength: 300 }, // Opening hook/question
  whatYoullDo: { type: 'string', required: false }, // Key activities
  whyUs: { type: 'string', required: false }, // Why join us
  values: { type: 'string', required: false }, // Core values/mission

  // Impact-Mission Format Fields
  headline: { type: 'string', required: false, maxLength: 200 }, // Impact headline
  responsibilities: { type: 'string', required: false }, // Key responsibilities
  whyResonates: { type: 'string', required: false }, // Why it resonates
  impactMetrics: { type: 'string', required: false }, // Impact metrics

  // Challenge-Call Format Fields
  hook: { type: 'string', required: false, maxLength: 300 }, // Technical hook
  duties: { type: 'string', required: false }, // Core duties
  tone: { type: 'string', required: false }, // Tone & culture
  techStack: { type: 'string', required: false }, // Technical stack

  // Application Details
  howToApply: { type: 'string', required: true },
  requirements: { type: 'string', required: false },
  contact: { type: 'string', required: true },
  deadline: { type: 'string', required: false },
  additionalNotes: { type: 'string', required: false },

  // Metadata
  status: { type: 'string', required: false, enum: ['Active', 'Paused', 'Closed'], default: 'Active' },
  applicants: { type: 'number', required: false, default: 0 }
}

/**
 * Transform form data to database format for job listings
 */
export const transformListingToDatabase = (formData) => {
  const transformed = {
    // Basic Information
    title: formData.title?.trim(),
    industry: formData.industry,
    category: formData.category,
    location: formData.location?.trim(),
    work_style: formData.workStyle,
    compensation: formData.compensation?.trim() || null,
    experience_level: formData.experienceLevel || null,

    // Listing Style
    listing_style: formData.listingStyle,

    // Content Fields (conditionally populated based on style)
    intro: formData.intro?.trim() || null,
    what_youll_do: formData.whatYoullDo?.trim() || null,
    why_us: formData.whyUs?.trim() || null,
    values: formData.values?.trim() || null,

    headline: formData.headline?.trim() || null,
    responsibilities: formData.responsibilities?.trim() || null,
    why_resonates: formData.whyResonates?.trim() || null,
    impact_metrics: formData.impactMetrics?.trim() || null,

    hook: formData.hook?.trim() || null,
    duties: formData.duties?.trim() || null,
    tone: formData.tone?.trim() || null,
    tech_stack: formData.techStack?.trim() || null,

    // Application Details
    how_to_apply: formData.howToApply?.trim(),
    requirements: formData.requirements?.trim() || null,
    contact: formData.contact?.trim(),
    deadline: formData.deadline?.trim() || null,
    additional_notes: formData.additionalNotes?.trim() || null,

    // Metadata
    status: formData.status || 'Active',
    applicants: formData.applicants || 0
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
 * Transform database data to frontend format for job listings
 */
export const transformListingFromDatabase = (dbData) => {
  if (!dbData) return null

  return {
    id: dbData.id,
    title: dbData.title,
    industry: dbData.industry,
    category: dbData.category,
    location: dbData.location,
    workStyle: dbData.work_style,
    compensation: dbData.compensation,
    experienceLevel: dbData.experience_level,

    listingStyle: dbData.listing_style,

    // Content fields
    intro: dbData.intro,
    whatYoullDo: dbData.what_youll_do,
    whyUs: dbData.why_us,
    values: dbData.values,

    headline: dbData.headline,
    responsibilities: dbData.responsibilities,
    whyResonates: dbData.why_resonates,
    impactMetrics: dbData.impact_metrics,

    hook: dbData.hook,
    duties: dbData.duties,
    tone: dbData.tone,
    techStack: dbData.tech_stack,

    // Application details
    howToApply: dbData.how_to_apply,
    requirements: dbData.requirements,
    contact: dbData.contact,
    deadline: dbData.deadline,
    additionalNotes: dbData.additional_notes,

    // Metadata
    status: dbData.status,
    applicants: dbData.applicants || 0,
    datePosted: dbData.date_posted || dbData.created_at?.split('T')[0],

    // Audit fields
    createdAt: dbData.created_at,
    modifiedAt: dbData.modified_at,
    createdBy: dbData.created_by,
    modifiedBy: dbData.modified_by
  }
}

/**
 * Validate job listing data based on the selected style
 */
export const validateJobListing = (data) => {
  const errors = []

  // Basic required fields
  const basicRequired = [
    { field: 'title', message: 'Job title is required' },
    { field: 'industry', message: 'Industry is required' },
    { field: 'category', message: 'Job category is required' },
    { field: 'location', message: 'Location is required' },
    { field: 'workStyle', message: 'Work style is required' },
    { field: 'listingStyle', message: 'Listing style is required' },
    { field: 'howToApply', message: 'Application instructions are required' },
    { field: 'contact', message: 'Contact information is required' }
  ]

  basicRequired.forEach(({ field, message }) => {
    if (!data[field] || data[field].trim() === '') {
      errors.push(message)
    }
  })

  // Style-specific required fields
  if (data.listingStyle === 'purpose-driven') {
    const purposeRequired = [
      { field: 'intro', message: 'Opening hook/intro is required for purpose-driven listings' },
      { field: 'whatYoullDo', message: "What you'll do section is required for purpose-driven listings" },
      { field: 'whyUs', message: 'Why us section is required for purpose-driven listings' }
    ]

    purposeRequired.forEach(({ field, message }) => {
      if (!data[field] || data[field].trim() === '') {
        errors.push(message)
      }
    })
  }

  if (data.listingStyle === 'impact-mission') {
    const impactRequired = [
      { field: 'headline', message: 'Impact headline is required for impact-mission listings' },
      { field: 'responsibilities', message: 'Key responsibilities are required for impact-mission listings' },
      { field: 'whyResonates', message: 'Why it resonates section is required for impact-mission listings' }
    ]

    impactRequired.forEach(({ field, message }) => {
      if (!data[field] || data[field].trim() === '') {
        errors.push(message)
      }
    })
  }

  if (data.listingStyle === 'challenge-call') {
    const challengeRequired = [
      { field: 'hook', message: 'Technical hook is required for challenge-call listings' },
      { field: 'duties', message: 'Core duties are required for challenge-call listings' },
      { field: 'tone', message: 'Tone & culture section is required for challenge-call listings' }
    ]

    challengeRequired.forEach(({ field, message }) => {
      if (!data[field] || data[field].trim() === '') {
        errors.push(message)
      }
    })
  }

  // Length validation
  if (data.title && data.title.length > 255) {
    errors.push('Job title must be 255 characters or less')
  }

  if (data.intro && data.intro.length > 300) {
    errors.push('Intro must be 300 characters or less')
  }

  if (data.headline && data.headline.length > 200) {
    errors.push('Headline must be 200 characters or less')
  }

  if (data.hook && data.hook.length > 300) {
    errors.push('Hook must be 300 characters or less')
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Create default job listing object
 */
export const createDefaultJobListing = () => ({
  title: '',
  industry: '',
  category: 'Full-time',
  location: '',
  workStyle: 'Remote',
  compensation: '',
  experienceLevel: 'Mid',
  listingStyle: 'purpose-driven',

  // Purpose-driven fields
  intro: '',
  whatYoullDo: '',
  whyUs: '',
  values: '',

  // Impact-mission fields
  headline: '',
  responsibilities: '',
  whyResonates: '',
  impactMetrics: '',

  // Challenge-call fields
  hook: '',
  duties: '',
  tone: '',
  techStack: '',

  // Application details
  howToApply: '',
  requirements: '',
  contact: '',
  deadline: '',
  additionalNotes: '',

  // Metadata
  status: 'Active',
  applicants: 0
})

/**
 * Generate formatted listing preview based on style
 */
export const generateListingPreview = (data) => {
  const { listingStyle } = data

  if (listingStyle === 'purpose-driven') {
    return {
      title: `${data.intro ? '🎯 ' : ''}${data.title}`,
      sections: [
        { label: 'Intro', content: data.intro, icon: '💡' },
        { label: "What You'll Do", content: data.whatYoullDo, icon: '🚀' },
        { label: 'Why Us', content: data.whyUs, icon: '❤️' },
        { label: 'Values', content: data.values, icon: '🌟' }
      ]
    }
  }

  if (listingStyle === 'impact-mission') {
    return {
      title: `${data.headline ? '🌍 ' : ''}${data.title}`,
      sections: [
        { label: 'Impact Headline', content: data.headline, icon: '📊' },
        { label: 'Responsibilities', content: data.responsibilities, icon: '🎯' },
        { label: 'Why It Resonates', content: data.whyResonates, icon: '💚' },
        { label: 'Impact Metrics', content: data.impactMetrics, icon: '📈' }
      ]
    }
  }

  if (listingStyle === 'challenge-call') {
    return {
      title: `${data.hook ? '⚡ ' : ''}${data.title}`,
      sections: [
        { label: 'Technical Hook', content: data.hook, icon: '🔧' },
        { label: 'Core Duties', content: data.duties, icon: '⚙️' },
        { label: 'Tone & Culture', content: data.tone, icon: '🎮' },
        { label: 'Tech Stack', content: data.techStack, icon: '💻' }
      ]
    }
  }

  return { title: data.title, sections: [] }
}
