// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Form, Input, Select, Row, Col, Alert, Card, Tag } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCreditCard,
  faLock,
  faShieldAlt,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'

const { Option } = Select

/**
 * Payment Method Modal Component
 * Handles adding and updating payment methods
 */
const PaymentMethodModal = React.memo(({ 
  visible, 
  onCancel, 
  onSuccess, 
  darkMode, 
  currentPaymentMethod 
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [cardType, setCardType] = useState('')

  // Credit card types
  const cardTypes = {
    visa: { name: 'Visa', color: '#1A1F71' },
    mastercard: { name: 'Mastercard', color: '#EB001B' },
    amex: { name: 'American Express', color: '#006FCF' },
    discover: { name: 'Discover', color: '#FF6000' }
  }

  // Set initial form values
  useEffect(() => {
    if (visible && currentPaymentMethod) {
      form.setFieldsValue({
        cardNumber: `****-****-****-${currentPaymentMethod.last4}`,
        expiryMonth: currentPaymentMethod.expiryMonth,
        expiryYear: currentPaymentMethod.expiryYear,
        holderName: 'John Doe', // Mock data
        billingAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      })
      setCardType(currentPaymentMethod.brand.toLowerCase())
    }
  }, [visible, currentPaymentMethod, form])

  // Detect card type from number
  const detectCardType = useCallback((cardNumber) => {
    const number = cardNumber.replace(/\D/g, '')
    
    if (number.startsWith('4')) {
      return 'visa'
    } else if (number.startsWith('5') || number.startsWith('2')) {
      return 'mastercard'
    } else if (number.startsWith('3')) {
      return 'amex'
    } else if (number.startsWith('6')) {
      return 'discover'
    }
    
    return ''
  }, [])

  // Handle card number input
  const handleCardNumberChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '')
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-')
    
    form.setFieldValue('cardNumber', formattedValue)
    setCardType(detectCardType(value))
  }, [form, detectCardType])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Extract last 4 digits
      const cardNumber = values.cardNumber.replace(/\D/g, '')
      const last4 = cardNumber.slice(-4)
      
      const updatedPaymentMethod = {
        type: 'card',
        last4,
        brand: cardType.charAt(0).toUpperCase() + cardType.slice(1),
        expiryMonth: values.expiryMonth,
        expiryYear: values.expiryYear,
        isDefault: true,
        holderName: values.holderName,
        billingAddress: {
          address: values.billingAddress,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country
        }
      }
      
      onSuccess(updatedPaymentMethod)
    } catch (error) {
      console.error('Error updating payment method:', error)
    } finally {
      setLoading(false)
    }
  }, [cardType, onSuccess])

  // Handle cancel
  const handleCancel = useCallback(() => {
    form.resetFields()
    setCardType('')
    onCancel()
  }, [form, onCancel])

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1).padStart(2, '0')
  }))

  // Generate year options (next 10 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear + i,
    label: String(currentYear + i)
  }))

  return (
    <>
      {/* Dark mode styles for PaymentMethodModal */}
      <style jsx global>{`
        ${darkMode ? `
          .payment-method-modal .ant-modal-content {
            background-color: #374151 !important;
            color: #F9FAFB !important;
          }
          .payment-method-modal .ant-modal-header {
            background-color: #374151 !important;
            border-bottom-color: #4B5563 !important;
          }
          .payment-method-modal .ant-modal-title {
            color: #F9FAFB !important;
          }
          .payment-method-modal .ant-modal-close-x {
            color: #9CA3AF !important;
          }
          .payment-method-modal .ant-modal-close-x:hover {
            color: #F9FAFB !important;
          }
          .payment-method-modal .ant-alert {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }
          .payment-method-modal .ant-alert-message,
          .payment-method-modal .ant-alert-description {
            color: #F9FAFB !important;
          }
          .payment-method-modal .ant-card {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }
          .payment-method-modal .ant-card-body * {
            color: #F9FAFB !important;
          }
          .payment-method-modal span,
          .payment-method-modal div,
          .payment-method-modal p {
            color: inherit !important;
          }
        ` : ''}
      `}</style>
      
      {/* Modal Styles */}
      <style jsx global>{`
        .payment-method-modal .ant-modal-content {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .payment-method-modal .ant-modal-header {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          border-bottom: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .payment-method-modal .ant-modal-close {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .payment-method-modal .ant-modal-close:hover {
          color: ${BRAND_COLORS.emeraldLight} !important;
        }
        
        .payment-method-modal .ant-form-item-label > label {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .payment-method-modal .ant-input {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .payment-method-modal .ant-input:focus,
        .payment-method-modal .ant-input-focused {
          border-color: ${BRAND_COLORS.emeraldPrimary} !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
        }
        
        .payment-method-modal .ant-select-selector {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.white} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .card-preview {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 20px;
          color: white;
          font-family: 'Courier New', monospace;
          position: relative;
          overflow: hidden;
        }
        
        .card-preview::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        
        .payment-dark-dropdown {
          background-color: #374151 !important;
        }
        
        .payment-dark-dropdown .ant-select-item {
          color: #F9FAFB !important;
        }
        
        .payment-dark-dropdown .ant-select-item:hover {
          background-color: #4B5563 !important;
        }
        
        .payment-dark-dropdown .ant-select-item-option-selected {
          background-color: #10B981 !important;
          color: #FFFFFF !important;
        }
      `}</style>

      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: BRAND_COLORS.emeraldPrimary }}
            >
              <FontAwesomeIcon icon={faCreditCard} className='text-white text-sm' />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              Update Payment Method
            </span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={700}
        className="payment-method-modal"
        footer={
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Your payment information is encrypted and secure
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={loading}
                style={{
                  backgroundColor: BRAND_COLORS.emeraldPrimary,
                  borderColor: BRAND_COLORS.emeraldPrimary
                }}
              >
                Update Payment Method
              </Button>
            </div>
          </div>
        }
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <div className="space-y-6">
          {/* Security Notice */}
          <Alert
            message="Secure Payment Processing"
            description="We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers."
            type="info"
            icon={<FontAwesomeIcon icon={faLock} />}
            showIcon
          />

          <Row gutter={24}>
            <Col xs={24} lg={14}>
                      <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={`${darkMode ? 'billing-form' : ''}`}
        >
                {/* Card Information */}
                <div className="space-y-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Card Information
                  </h3>
                  
                  <Form.Item
                    label="Card Number"
                    name="cardNumber"
                    rules={[
                      { required: true, message: 'Please enter card number' },
                      { min: 19, message: 'Please enter a valid card number' }
                    ]}
                  >
                    <Input
                      placeholder="1234-5678-9012-3456"
                      maxLength={19}
                      onChange={handleCardNumberChange}
                      suffix={
                        cardType && (
                          <Tag 
                            color="default" 
                            className="border-0"
                            style={{ 
                              backgroundColor: cardTypes[cardType]?.color + '20',
                              color: cardTypes[cardType]?.color 
                            }}
                          >
                            {cardTypes[cardType]?.name}
                          </Tag>
                        )
                      }
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Expiry Month"
                        name="expiryMonth"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Select placeholder="MM" dropdownClassName={darkMode ? 'billing-dark-dropdown' : ''}>
                          {monthOptions.map(month => (
                            <Option key={month.value} value={month.value}>
                              {month.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Expiry Year"
                        name="expiryYear"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Select placeholder="YYYY" dropdownClassName={darkMode ? 'billing-dark-dropdown' : ''}>
                          {yearOptions.map(year => (
                            <Option key={year.value} value={year.value}>
                              {year.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Cardholder Name"
                    name="holderName"
                    rules={[
                      { required: true, message: 'Please enter cardholder name' }
                    ]}
                  >
                    <Input placeholder="John Doe" />
                  </Form.Item>
                </div>

                {/* Billing Address */}
                <div className="mt-6 space-y-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Billing Address
                  </h3>
                  
                  <Form.Item
                    label="Address"
                    name="billingAddress"
                    rules={[{ required: true, message: 'Please enter billing address' }]}
                  >
                    <Input placeholder="123 Main Street" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Input placeholder="New York" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="State"
                        name="state"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Input placeholder="NY" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="ZIP Code"
                        name="zipCode"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Input placeholder="10001" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Country"
                    name="country"
                    rules={[{ required: true, message: 'Please select country' }]}
                  >
                    <Select placeholder="Select country" dropdownClassName={darkMode ? 'billing-dark-dropdown' : ''}>
                      <Option value="United States">United States</Option>
                      <Option value="Canada">Canada</Option>
                      <Option value="United Kingdom">United Kingdom</Option>
                      <Option value="Germany">Germany</Option>
                      <Option value="France">France</Option>
                      <Option value="Australia">Australia</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </Col>

            <Col xs={24} lg={10}>
              {/* Card Preview */}
              <div className="space-y-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Card Preview
                </h3>
                
                <div className="card-preview">
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-xs opacity-75">DEBIT</div>
                    <div className="text-right">
                      {cardType && (
                        <div className="text-sm font-semibold">
                          {cardTypes[cardType]?.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-lg font-mono tracking-wider">
                      {form.getFieldValue('cardNumber') || '****-****-****-****'}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-75 mb-1">CARDHOLDER</div>
                      <div className="text-sm font-semibold">
                        {form.getFieldValue('holderName') || 'YOUR NAME'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs opacity-75 mb-1">EXPIRES</div>
                      <div className="text-sm font-semibold">
                        {form.getFieldValue('expiryMonth') && form.getFieldValue('expiryYear') 
                          ? `${String(form.getFieldValue('expiryMonth')).padStart(2, '0')}/${form.getFieldValue('expiryYear')}` 
                          : 'MM/YY'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <Card
                  className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                  bodyStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    padding: '16px'
                  }}
                >
                                      <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          SSL Encrypted
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faLock} className="text-green-500" />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          PCI DSS Compliant
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Bank-level Security
                        </span>
                      </div>
                    </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
})

PaymentMethodModal.displayName = 'PaymentMethodModal'

export default PaymentMethodModal 