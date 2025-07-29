// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Organization Settings Controller
 * Handles organization settings operations and business logic
 */

import { validateOrgSettings, transformToDatabase, transformFromDatabase } from './data-model'

class OrgSettingsController {
  constructor() {
    this.apiEndpoint = '/api/org-settings'
  }

  /**
   * Get organization settings
   * @returns {Promise} Organization settings data
   */
  async getOrgSettings() {
    try {
      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_settings').select('*').single()
      
      // For now, return mock data
      return {
        success: true,
        data: this.getMockOrgSettings()
      }
    } catch (error) {
      console.error('Error fetching organization settings:', error)
      throw new Error('Failed to fetch organization settings')
    }
  }

  /**
   * Update organization settings
   * @param {Object} settingsData - Updated settings data
   * @returns {Promise} Updated settings
   */
  async updateOrgSettings(settingsData) {
    try {
      // Validate settings data
      const validationResult = validateOrgSettings(settingsData)
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '))
      }

      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_settings')
      //   .upsert({ ...settingsData, updated_at: new Date().toISOString() })

      return {
        success: true,
        data: { ...settingsData, updatedAt: new Date().toISOString() },
        message: 'Organization settings updated successfully'
      }
    } catch (error) {
      console.error('Error updating organization settings:', error)
      throw new Error('Failed to update organization settings')
    }
  }

  /**
   * Update organization profile with AI assistance
   * @param {Object} aiInputs - AI interaction inputs
   * @returns {Promise} AI-generated profile data
   */
  async updateProfileWithAI(aiInputs) {
    try {
      // In a real app, this would call an AI service
      // const response = await aiService.generateOrgProfile(aiInputs)
      
      // Mock AI processing
      const aiProfile = this.generateMockAIProfile(aiInputs)
      
      return {
        success: true,
        data: aiProfile,
        message: 'Organization profile updated with AI assistance'
      }
    } catch (error) {
      console.error('Error updating profile with AI:', error)
      throw new Error('Failed to update profile with AI')
    }
  }

  /**
   * Get available currencies
   * @returns {Promise} List of currencies
   */
  async getAvailableCurrencies() {
    try {
      return {
        success: true,
        data: [
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
          { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
          { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
          { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
          { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
          { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
          { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
          { code: 'DKK', name: 'Danish Krone', symbol: 'kr' }
        ]
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
      throw new Error('Failed to fetch currencies')
    }
  }

  /**
   * Get available countries
   * @returns {Promise} List of countries
   */
  async getAvailableCountries() {
    try {
      return {
        success: true,
        data: [
          'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
          'Australia', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
          'Spain', 'Italy', 'Portugal', 'Belgium', 'Austria', 'Finland'
        ]
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
      throw new Error('Failed to fetch countries')
    }
  }

  /**
   * Get available languages
   * @returns {Promise} List of languages
   */
  async getAvailableLanguages() {
    try {
      return {
        success: true,
        data: [
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'it', name: 'Italian' },
          { code: 'pt', name: 'Portuguese' },
          { code: 'nl', name: 'Dutch' },
          { code: 'sv', name: 'Swedish' },
          { code: 'no', name: 'Norwegian' },
          { code: 'da', name: 'Danish' }
        ]
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
      throw new Error('Failed to fetch languages')
    }
  }

  /**
   * Get industry options
   * @returns {Promise} List of industries
   */
  async getIndustryOptions() {
    try {
      return {
        success: true,
        data: [
          'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
          'Manufacturing', 'Consulting', 'Media', 'Government', 'Non-profit',
          'Real Estate', 'Transportation', 'Energy', 'Agriculture', 'Other'
        ]
      }
    } catch (error) {
      console.error('Error fetching industries:', error)
      throw new Error('Failed to fetch industries')
    }
  }

  /**
   * Get common industry tags
   * @returns {Promise} List of industry tags
   */
  async getCommonIndustryTags() {
    try {
      return {
        success: true,
        data: [
          'Software Development', 'Cloud Computing', 'AI/Machine Learning', 'Data Analytics',
          'Cybersecurity', 'Mobile Development', 'Web Development', 'DevOps', 'SaaS',
          'E-commerce', 'Fintech', 'Healthcare Tech', 'EdTech', 'PropTech',
          'IoT', 'Blockchain', 'AR/VR', 'Digital Marketing', 'UI/UX Design'
        ]
      }
    } catch (error) {
      console.error('Error fetching industry tags:', error)
      throw new Error('Failed to fetch industry tags')
    }
  }

  /**
   * Validate organization domain/website
   * @param {string} website - Website URL
   * @returns {Promise} Validation result
   */
  async validateWebsite(website) {
    try {
      // In a real app, this would validate the domain
      const isValid = /^https?:\/\/.+\..+/.test(website)
      
      return {
        success: true,
        data: {
          isValid,
          message: isValid ? 'Website is valid' : 'Please enter a valid website URL'
        }
      }
    } catch (error) {
      console.error('Error validating website:', error)
      throw new Error('Failed to validate website')
    }
  }

  /**
   * Get organization statistics
   * @returns {Promise} Organization statistics
   */
  async getOrgStatistics() {
    try {
      const settings = this.getMockOrgSettings()
      
      const stats = {
        profileCompleteness: this.calculateProfileCompleteness(settings),
        lastUpdated: settings.updatedAt || new Date().toISOString(),
        aiEnhanced: settings.aiProfileEnabled,
        totalSettings: Object.keys(settings).length,
        industryTagCount: settings.industryTags?.length || 0,
        customClassificationCount: settings.customClassifications?.length || 0
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching organization statistics:', error)
      throw new Error('Failed to fetch organization statistics')
    }
  }

  /**
   * Calculate profile completeness percentage
   * @param {Object} settings - Organization settings
   * @returns {number} Completeness percentage
   */
  calculateProfileCompleteness(settings) {
    const requiredFields = [
      'organizationName', 'industry', 'description', 'currency', 
      'country', 'language', 'defaultWorkArrangement'
    ]
    
    const optionalFields = [
      'website', 'foundedYear', 'employeeRange', 'industryTags', 'customClassifications'
    ]
    
    let completedRequired = 0
    let completedOptional = 0
    
    requiredFields.forEach(field => {
      if (settings[field] && settings[field] !== '') {
        completedRequired++
      }
    })
    
    optionalFields.forEach(field => {
      if (settings[field] && 
          (Array.isArray(settings[field]) ? settings[field].length > 0 : settings[field] !== '')) {
        completedOptional++
      }
    })
    
    // Required fields are worth 70%, optional 30%
    const requiredScore = (completedRequired / requiredFields.length) * 70
    const optionalScore = (completedOptional / optionalFields.length) * 30
    
    return Math.round(requiredScore + optionalScore)
  }

  /**
   * Generate mock AI profile (for development)
   * @param {Object} inputs - AI inputs
   * @returns {Object} Mock AI-generated profile
   */
  generateMockAIProfile(inputs) {
    const { businessFocus, targetMarket, uniqueValue, companySize, workCulture } = inputs
    
    let description = businessFocus || 'We are a dynamic organization focused on delivering exceptional results.'
    
    if (targetMarket) {
      description += ` We serve ${targetMarket.toLowerCase()}, providing tailored solutions that meet their specific needs.`
    }
    
    if (uniqueValue) {
      description += ` ${uniqueValue} This sets us apart in the competitive landscape.`
    }
    
    if (workCulture) {
      description += ` Our ${workCulture.toLowerCase()} drives everything we do, ensuring we attract top talent and deliver exceptional results.`
    }
    
    // Generate industry tags based on business focus
    const industryTags = ['Software Development', 'Technology']
    if (businessFocus?.toLowerCase().includes('cloud')) {
      industryTags.push('Cloud Computing')
    }
    if (businessFocus?.toLowerCase().includes('ai')) {
      industryTags.push('AI/Machine Learning')
    }
    if (businessFocus?.toLowerCase().includes('saas')) {
      industryTags.push('SaaS')
    }
    
    // Generate custom classifications
    const customClassifications = ['Innovation-Driven']
    if (companySize?.toLowerCase().includes('startup')) {
      customClassifications.push('Startup')
    }
    if (workCulture?.toLowerCase().includes('remote')) {
      customClassifications.push('Remote-First')
    }
    
    return {
      description,
      industryTags: [...new Set(industryTags)],
      customClassifications: [...new Set(customClassifications)],
      lastAiUpdate: new Date().toISOString()
    }
  }

  /**
   * Get mock organization settings (for development)
   * @returns {Object} Mock organization settings
   */
  getMockOrgSettings() {
    return {
      // Organization Profile
      organizationName: 'TechCorp Solutions',
      industry: 'Technology',
      description: 'We are a leading technology company focused on innovative software solutions that help businesses transform digitally.',
      website: 'https://techcorp.com',
      foundedYear: '2020',
      employeeRange: '50-200',
      
      // Work Arrangements
      defaultWorkArrangement: 'hybrid',
      
      // Preferences
      currency: 'USD',
      country: 'United States',
      language: 'English',
      timezone: 'America/New_York',
      
      // Industry Tags
      industryTags: ['Software Development', 'Cloud Computing', 'AI/Machine Learning', 'SaaS'],
      customClassifications: ['Startup', 'B2B', 'Enterprise Solutions'],
      
      // AI Profile settings
      aiProfileEnabled: true,
      lastAiUpdate: '2024-01-15T10:30:00Z',
      
      // System fields
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  }

  /**
   * Reset organization settings to defaults
   * @returns {Promise} Reset result
   */
  async resetToDefaults() {
    try {
      const defaultSettings = {
        organizationName: '',
        industry: '',
        description: '',
        website: '',
        foundedYear: '',
        employeeRange: '',
        defaultWorkArrangement: 'hybrid',
        currency: 'USD',
        country: 'United States',
        language: 'English',
        timezone: 'America/New_York',
        industryTags: [],
        customClassifications: [],
        aiProfileEnabled: true
      }

      return {
        success: true,
        data: defaultSettings,
        message: 'Organization settings reset to defaults'
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw new Error('Failed to reset settings')
    }
  }
}

export default new OrgSettingsController() 