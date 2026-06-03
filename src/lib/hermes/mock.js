// Global Instructions Rule Applied!

import { isHermesConfigured } from './config'

/** True when mock responses should be used instead of calling Hermes. */
export const isHermesMockMode = () => {
  if (process.env.REACT_APP_MOCK_AI === 'true') {
    return true
  }
  return !isHermesConfigured()
}

const MOCK_CHAT_RESPONSES = {
  resume:
    "I'd be happy to help you with your resume! To get started, could you tell me about your current experience level and the type of position you're targeting?",
  interview:
    "Great! Let's prepare for your interview. What specific role or company are you interviewing for? I can help with common questions and behavioral responses.",
  career:
    'Career guidance is one of my specialties! What area of your career would you like to focus on — growth, transition, or skill development?',
  default:
    "Thank you for your message! I'm here to help with resume building, interview preparation, and career guidance. What would you like to work on today?"
}

/**
 * @param {string} userMessage
 * @returns {string}
 */
export const getMockCandidateChatResponse = (userMessage) => {
  const lower = String(userMessage || '').toLowerCase()

  if (lower.includes('resume') || lower.includes('cv')) {
    return MOCK_CHAT_RESPONSES.resume
  }
  if (lower.includes('interview') || lower.includes('prepare')) {
    return MOCK_CHAT_RESPONSES.interview
  }
  if (lower.includes('career') || lower.includes('advice')) {
    return MOCK_CHAT_RESPONSES.career
  }

  return MOCK_CHAT_RESPONSES.default
}

export const buildWelcomeMessage = (userName) => ({
  id: 'welcome',
  type: 'assistant',
  content: `Hello${userName ? ` ${userName}` : ''}! I'm your SkillScout assistant. I'm here to help you with resume building, interview preparation, and career guidance. What would you like to work on today?`,
  timestamp: new Date().toISOString()
})

/** Full resume mock for Personal Dashboard CV ingestion */
export const buildMockFullResume = (cvText = '') => {
  const snippet = cvText.slice(0, 80).replace(/\s+/g, ' ').trim()
  return {
    contact: {
      first_name: 'Alex',
      middle_name: '',
      last_name: 'Sample',
      email: 'alex.sample@example.com',
      phone: '+1 555 0100',
      location: 'Cape Town, South Africa',
      professional_title: 'Software Developer',
      summary:
        'Experienced software developer with expertise in full-stack web development, React, and Node.js. Passionate about building scalable applications.'
    },
    content: {
      summary:
        'Experienced software developer with expertise in full-stack web development, React, and Node.js. Passionate about building scalable applications.',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'Git'],
      experience: [
        {
          title: 'Senior Software Developer',
          company: 'Tech Solutions Ltd',
          location: 'Cape Town',
          start_date: 'Jan 2021',
          end_date: '',
          is_current: true,
          description: 'Lead development of web applications using React and Node.js. Mentored junior developers.'
        },
        {
          title: 'Software Developer',
          company: 'Digital Agency',
          location: 'Johannesburg',
          start_date: 'Mar 2018',
          end_date: 'Dec 2020',
          is_current: false,
          description: 'Built client-facing web applications and REST APIs.'
        }
      ],
      education: [
        {
          degree: 'BSc',
          field: 'Computer Science',
          institution: 'University of Cape Town',
          start_date: '2014',
          end_date: '2017',
          description: ''
        }
      ],
      certifications: [{ name: 'AWS Cloud Practitioner', issuer: 'Amazon', date: '2022' }],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Afrikaans', proficiency: 'Fluent' }
      ],
      references: [],
      _mockNote: snippet ? `Parsed from: ${snippet}…` : undefined
    }
  }
}
