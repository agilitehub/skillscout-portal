// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Derives demo resume preview state from chat messages and uploads (pure heuristic).
 */
export function deriveResumePreviewFromChat(user, uploadedFiles, messages) {
  const userMessages = messages.filter((m) => m.type === 'user').map((m) => m.content.toLowerCase())
  const chatContent = userMessages.join(' ')

  const extractedInfo = {
    skills: [],
    experience: [],
    education: [],
    achievements: []
  }

  if (chatContent.includes('javascript') || chatContent.includes('js')) extractedInfo.skills.push('JavaScript')
  if (chatContent.includes('react')) extractedInfo.skills.push('React')
  if (chatContent.includes('python')) extractedInfo.skills.push('Python')
  if (chatContent.includes('node')) extractedInfo.skills.push('Node.js')
  if (chatContent.includes('sql') || chatContent.includes('database')) extractedInfo.skills.push('SQL')
  if (chatContent.includes('aws') || chatContent.includes('cloud')) extractedInfo.skills.push('AWS')
  if (chatContent.includes('git')) extractedInfo.skills.push('Git')

  if (chatContent.includes('developer') || chatContent.includes('engineer')) {
    extractedInfo.experience.push({
      title: 'Software Developer',
      company: 'Technology Company',
      duration: 'Present',
      description: 'Developing software applications and solutions'
    })
  }
  if (chatContent.includes('manager') || chatContent.includes('lead')) {
    extractedInfo.experience.push({
      title: 'Team Lead',
      company: 'Previous Company',
      duration: '2+ years',
      description: 'Leading development teams and projects'
    })
  }

  if (
    chatContent.includes('university') ||
    chatContent.includes('degree') ||
    chatContent.includes('bachelor') ||
    chatContent.includes('master')
  ) {
    extractedInfo.education.push({
      degree: "Bachelor's Degree",
      field: 'Computer Science',
      school: 'University',
      year: '2020'
    })
  }

  const baseScore = 20
  const fileScore = Math.min(uploadedFiles.length * 15, 30)
  const chatScore = Math.min(userMessages.length * 8, 50)
  const completeness = Math.min(baseScore + fileScore + chatScore, 100)

  return {
    basicInfo: {
      name: user?.Username || 'Your Name',
      email: user?.PublicKeyBase58Check ? 'demo@example.com' : 'your.email@example.com',
      phone: '+1 (555) 123-4567',
      location: 'City, State',
      title: extractedInfo.experience.length > 0 ? extractedInfo.experience[0].title : 'Professional Title'
    },
    summary:
      chatContent.length > 50
        ? 'Experienced professional with expertise in software development and technology solutions. Passionate about creating innovative applications and leading successful projects.'
        : 'Add a professional summary by sharing your background and career goals in the chat.',
    skills: extractedInfo.skills.length > 0 ? extractedInfo.skills : ['Add skills by mentioning them in the chat'],
    experience:
      extractedInfo.experience.length > 0
        ? extractedInfo.experience
        : [
            {
              title: 'Share your work experience',
              company: 'Tell me about your current or previous roles',
              duration: '',
              description: 'Describe your responsibilities and achievements'
            }
          ],
    education:
      extractedInfo.education.length > 0
        ? extractedInfo.education
        : [
            {
              degree: 'Your Education',
              field: 'Field of Study',
              school: 'Educational Institution',
              year: 'Year'
            }
          ],
    documents: uploadedFiles.map((file) => ({
      name: file.name,
      type: file.name.split('.').pop().toUpperCase(),
      uploadedAt: new Date().toLocaleDateString()
    })),
    completeness
  }
}
