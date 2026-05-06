// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Steps, Alert, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faRobot,
  faQuestionCircle,
  faBrain,
  faCheckCircle,
  faWandMagicSparkles,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons'
import { Button, ThemedModal } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'

import '../styles/org-settings.css'

const { TextArea } = Input
const { Step } = Steps

/**
 * AI Profile Modal Component
 * Handles AI-powered organization profile generation and updates
 */
const AIProfileModal = React.memo(({ visible, onCancel, onSuccess, darkMode, currentProfile }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState(null)

  // AI interaction questions
  const aiQuestions = [
    {
      key: 'businessFocus',
      question: 'What is your primary business focus or main products/services?',
      placeholder: 'e.g., We develop cloud-based software solutions for small businesses...',
      required: true
    },
    {
      key: 'targetMarket',
      question: 'Who is your target market or ideal customer?',
      placeholder: 'e.g., Small to medium-sized businesses in retail and hospitality...',
      required: true
    },
    {
      key: 'uniqueValue',
      question: 'What makes your organization unique or competitive?',
      placeholder: 'e.g., Our AI-powered analytics provide real-time insights...',
      required: false
    },
    {
      key: 'companySize',
      question: 'What is your current company size and growth stage?',
      placeholder: 'e.g., 50 employees, Series A startup, rapidly growing...',
      required: false
    },
    {
      key: 'workCulture',
      question: 'How would you describe your work culture and values?',
      placeholder: 'e.g., Innovation-focused, collaborative, remote-first culture...',
      required: false
    }
  ]

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      form.resetFields()
      setCurrentStep(0)
      setAiSuggestions(null)
    }
  }, [visible, form])

  // Handle step navigation
  const handleNext = useCallback(() => {
    setCurrentStep(prev => prev + 1)
  }, [])

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => prev - 1)
  }, [])

  // Generate AI description based on user inputs
  const generateAIDescription = useCallback((inputs) => {
    const { businessFocus, targetMarket, uniqueValue, workCulture } = inputs
    
    let description = businessFocus || currentProfile.description
    
    if (targetMarket) {
      description += ` We serve ${targetMarket.toLowerCase()}, providing tailored solutions that meet their specific needs.`
    }
    
    if (uniqueValue) {
      description += ` ${uniqueValue} This sets us apart in the competitive landscape.`
    }
    
    if (workCulture) {
      description += ` Our ${workCulture.toLowerCase()} drives everything we do, ensuring we attract top talent and deliver exceptional results.`
    }
    
    return description
  }, [currentProfile])

  // Generate industry tags based on business focus
  const generateIndustryTags = useCallback((inputs) => {
    const { businessFocus } = inputs
    const baseTags = [...currentProfile.industryTags]
    
    if (businessFocus?.toLowerCase().includes('cloud')) {
      baseTags.push('Cloud Computing')
    }
    if (businessFocus?.toLowerCase().includes('ai') || businessFocus?.toLowerCase().includes('artificial intelligence')) {
      baseTags.push('AI/Machine Learning')
    }
    if (businessFocus?.toLowerCase().includes('analytics')) {
      baseTags.push('Data Analytics')
    }
    if (businessFocus?.toLowerCase().includes('mobile')) {
      baseTags.push('Mobile Development')
    }
    if (businessFocus?.toLowerCase().includes('saas') || businessFocus?.toLowerCase().includes('software as a service')) {
      baseTags.push('SaaS')
    }
    
    return [...new Set(baseTags)]
  }, [currentProfile])

  // Generate custom classifications
  const generateCustomClassifications = useCallback((inputs) => {
    const { companySize, workCulture } = inputs
    const baseClassifications = [...currentProfile.customClassifications]
    
    if (companySize?.toLowerCase().includes('startup') || companySize?.toLowerCase().includes('series')) {
      baseClassifications.push('Startup')
    }
    if (companySize?.toLowerCase().includes('growing') || companySize?.toLowerCase().includes('scale')) {
      baseClassifications.push('High Growth')
    }
    if (workCulture?.toLowerCase().includes('remote')) {
      baseClassifications.push('Remote-First')
    }
    if (workCulture?.toLowerCase().includes('innovation')) {
      baseClassifications.push('Innovation-Driven')
    }
    
    return [...new Set(baseClassifications)]
  }, [currentProfile])

  // Handle AI profile generation
  const handleGenerateProfile = useCallback(async (values) => {
    setLoading(true)
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI-generated suggestions based on user input
      const suggestions = {
        organizationName: currentProfile.organizationName,
        industry: currentProfile.industry,
        description: generateAIDescription(values),
        website: currentProfile.website,
        foundedYear: currentProfile.foundedYear,
        employeeRange: values.companySize?.includes('50') ? '50-200' : currentProfile.employeeRange,
        industryTags: generateIndustryTags(values),
        customClassifications: generateCustomClassifications(values)
      }
      
      setAiSuggestions(suggestions)
      handleNext()
    } catch (error) {
      console.error('Error generating AI profile:', error)
    } finally {
      setLoading(false)
    }
      }, [currentProfile, generateAIDescription, generateIndustryTags, generateCustomClassifications, handleNext])

  // Handle accepting AI suggestions
  const handleAcceptSuggestions = useCallback(() => {
    onSuccess(aiSuggestions)
  }, [onSuccess, aiSuggestions])

  // Handle cancel
  const handleCancel = useCallback(() => {
    form.resetFields()
    setCurrentStep(0)
    setAiSuggestions(null)
    onCancel()
  }, [form, onCancel])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Alert
              message="AI Profile Enhancement"
              description="Answer a few questions about your organization and let AI enhance your profile with relevant, professional content."
              type="info"
              icon={<FontAwesomeIcon icon={faLightbulb} />}
              showIcon
            />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleGenerateProfile}
            >
              {aiQuestions.map(question => (
                <Form.Item
                  key={question.key}
                  label={
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faQuestionCircle} className="text-emerald-600" />
                      <span>{question.question}</span>
                    </div>
                  }
                  name={question.key}
                  rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
                >
                  <TextArea
                    placeholder={question.placeholder}
                    rows={3}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              ))}
            </Form>
          </div>
        )
      
      case 1:
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="relative">
                <Spin size="large" />
                <FontAwesomeIcon 
                  icon={faBrain} 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-600" 
                />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI is analyzing your responses...
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Generating professional profile content and relevant tags
                </p>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <Alert
              message="AI-Generated Profile Suggestions"
              description="Review the AI-generated content below and click 'Apply Changes' to update your organization profile."
              type="success"
              icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
              showIcon
            />
            
            {aiSuggestions && (
              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    📝 Enhanced Description
                  </h4>
                  <div 
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {aiSuggestions.description}
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    🏷️ Suggested Industry Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.industryTags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    🎯 Custom Classifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.customClassifications.map(classification => (
                      <span
                        key={classification}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {classification}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      <ThemedModal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: BRAND_COLORS.emeraldPrimary }}
            >
              <FontAwesomeIcon icon={faRobot} className='text-white text-sm' />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              AI Profile Enhancement
            </span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={700}
        className="ai-profile-modal"
        footer={
          <div className="flex justify-between">
            <div>
              {currentStep > 0 && currentStep < 2 && (
                <Button onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              
              {currentStep === 0 && (
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={loading}
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    borderColor: BRAND_COLORS.emeraldPrimary
                  }}
                >
                  Generate with AI
                </Button>
              )}
              
              {currentStep === 2 && (
                <Button
                  type="primary"
                  onClick={handleAcceptSuggestions}
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    borderColor: BRAND_COLORS.emeraldPrimary
                  }}
                >
                  Apply Changes
                </Button>
              )}
            </div>
          </div>
        }
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <div className="mb-6">
          <Steps current={currentStep} size="small">
            <Step
              title="Questions"
              icon={<FontAwesomeIcon icon={faQuestionCircle} />}
            />
            <Step
              title="AI Processing"
              icon={<FontAwesomeIcon icon={faBrain} />}
            />
            <Step
              title="Review & Apply"
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
            />
          </Steps>
        </div>

        {renderStepContent()}
      </ThemedModal>
    </>
  )
})

AIProfileModal.displayName = 'AIProfileModal'

export default AIProfileModal 