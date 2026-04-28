// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { Modal, Card, Row, Col, Tag, Alert, Divider, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faRocket,
  faCheck,
  faCrown,
  faGem,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'

import '../styles/billing.css'

const { Title, Text } = Typography

/**
 * Plan Upgrade Modal Component
 * Displays available plans and handles plan upgrades/downgrades
 */
const PlanUpgradeModal = React.memo(({ 
  visible, 
  onCancel, 
  onSuccess, 
  darkMode, 
  currentPlan, 
  availablePlans 
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Plan comparison data
  const planFeatures = useMemo(() => ({
    starter: {
      icon: faBriefcase,
      color: BRAND_COLORS.bluePrimary,
      highlight: false
    },
    professional: {
      icon: faRocket,
      color: BRAND_COLORS.emeraldPrimary,
      highlight: true
    },
    enterprise: {
      icon: faCrown,
      color: BRAND_COLORS.purplePrimary,
      highlight: false
    }
  }), [])

  // Handle plan selection
  const handlePlanSelect = useCallback((plan) => {
    setSelectedPlan(plan)
  }, [])

  // Handle plan upgrade/downgrade
  const handleConfirmUpgrade = useCallback(async () => {
    if (!selectedPlan) return

    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update plan
      const updatedPlan = {
        ...selectedPlan,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      }
      
      onSuccess(updatedPlan)
    } catch (error) {
      console.error('Error updating plan:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedPlan, onSuccess])

  // Handle cancel
  const handleCancel = useCallback(() => {
    setSelectedPlan(null)
    onCancel()
  }, [onCancel])

  const isUpgrade = selectedPlan && selectedPlan.price > currentPlan.price
  const isDowngrade = selectedPlan && selectedPlan.price < currentPlan.price
  const isSamePlan = selectedPlan && selectedPlan.id === currentPlan.name.toLowerCase()

  return (
    <>
      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: BRAND_COLORS.emeraldPrimary }}
            >
              <FontAwesomeIcon icon={faRocket} className='text-white text-sm' />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              Choose Your Plan
            </span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={900}
        className="plan-upgrade-modal"
        footer={
          <div className="flex justify-between items-center">
            <div>
              {selectedPlan && (
                <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {isUpgrade && '⬆️ Upgrade to '}
                  {isDowngrade && '⬇️ Downgrade to '}
                  {isSamePlan && '✓ Current plan '}
                  <strong>{selectedPlan.name}</strong>
                  {!isSamePlan && ` - ${isUpgrade ? 'Billed immediately' : 'Change at next billing cycle'}`}
                </Text>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              
              {selectedPlan && !isSamePlan && (
                <Button
                  type="primary"
                  onClick={handleConfirmUpgrade}
                  loading={loading}
                  style={{
                    backgroundColor: isUpgrade ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.orangePrimary,
                    borderColor: isUpgrade ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.orangePrimary
                  }}
                >
                  {isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
                </Button>
              )}
            </div>
          </div>
        }
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <div className="space-y-6">
          {/* Plan Selection Info */}
          <Alert
            message="Plan Comparison"
            description="Choose the plan that best fits your team's needs. You can upgrade or downgrade at any time."
            type="info" 
            showIcon
            className="mb-6"
            style={{
              backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : undefined,
              borderColor: darkMode ? BRAND_COLORS.mediumSlate : undefined,
              color: darkMode ? BRAND_COLORS.white : undefined
            }}
          />

          {/* Plans Grid */}
          <Row gutter={[16, 16]}>
            {availablePlans.map(plan => {
              const isCurrentPlan = plan.id === currentPlan.name.toLowerCase()
              const isSelected = selectedPlan?.id === plan.id
              const planConfig = planFeatures[plan.id]
              
              return (
                <Col xs={24} md={8} key={plan.id}>
                  <Card
                    className={`plan-card h-full ${isSelected ? 'selected' : ''} ${isCurrentPlan ? 'current' : ''}`}
                    onClick={() => handlePlanSelect(plan)}
                    style={{
                      backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                      borderColor: darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray
                    }}
                  >
                    <div className="text-center space-y-4">
                      {/* Plan Header */}
                      <div>
                        <div 
                          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${planConfig.color}20` }}
                        >
                          <FontAwesomeIcon 
                            icon={planConfig.icon} 
                            className="text-2xl"
                            style={{ color: planConfig.color }}
                          />
                        </div>
                        
                        <div className="plan-header-flex flex items-center justify-center space-x-2 mb-2">
                          <Title level={4} className={`plan-title !mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {plan.name}
                          </Title>
                          {plan.popular && (
                            <Tag color="gold">
                              <FontAwesomeIcon icon={faGem} className="mr-1" />
                              Popular
                            </Tag>
                          )}
                          {isCurrentPlan && (
                            <Tag color="blue">Current</Tag>
                          )}
                        </div>
                        
                        <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {plan.description}
                        </Text>
                      </div>

                      {/* Pricing */}
                      <div>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span 
                            className="text-3xl font-bold"
                            style={{ color: planConfig.color }}
                          >
                            ${plan.price}
                          </span>
                          <Text className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                            /month
                          </Text>
                        </div>
                      </div>

                      <Divider className={darkMode ? 'border-gray-600' : 'border-gray-200'} />

                      {/* Features List */}
                      <div className="text-left space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <FontAwesomeIcon 
                              icon={faCheck} 
                              className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" 
                            />
                            <Text 
                              className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              {feature}
                            </Text>
                          </div>
                        ))}
                      </div>

                      {/* Plan Limits */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {typeof plan.limits.jobPostings === 'number' ? plan.limits.jobPostings : '∞'}
                            </Text>
                            <br />
                            <Text className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Jobs
                            </Text>
                          </div>
                          <div>
                            <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {typeof plan.limits.teamMembers === 'number' ? plan.limits.teamMembers : '∞'}
                            </Text>
                            <br />
                            <Text className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Users
                            </Text>
                          </div>
                          <div>
                            <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {typeof plan.limits.storage === 'number' ? `${plan.limits.storage}GB` : '∞'}
                            </Text>
                            <br />
                            <Text className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Storage
                            </Text>
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="mt-4">
                          <div 
                            className="w-full py-2 px-4 rounded-lg text-white font-medium"
                            style={{ backgroundColor: planConfig.color }}
                          >
                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
                            Selected
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>

          {/* Additional Information */}
          {selectedPlan && !isSamePlan && (
            <Alert
              message={isUpgrade ? "Plan Upgrade" : "Plan Downgrade"}
              description={
                <div>
                  {isUpgrade ? (
                    <>
                      Your account will be upgraded immediately and you'll be charged the prorated amount for the remaining billing period. 
                      Your next billing date will remain the same.
                    </>
                  ) : (
                    <>
                      Your plan will be downgraded at the end of your current billing period. 
                      You'll continue to have access to all current features until then.
                    </>
                  )}
                </div>
              }
              type={isUpgrade ? "success" : "warning"}
              showIcon
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    </>
  )
})

PlanUpgradeModal.displayName = 'PlanUpgradeModal'

export default PlanUpgradeModal 