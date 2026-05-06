// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { Card, Row, Col, Tag, Space, Progress, message, Typography, Divider, Statistic } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCreditCard,
  faReceipt,
  faRocket,
  faCheck,
  faDownload,
  faEdit,
  faCrown,
  faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button, BusinessDashboardPageShell, Toolbar } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import PlanUpgradeModal from './PlanUpgradeModal'
import PaymentMethodModal from './PaymentMethodModal'
import InvoiceDetailsModal from './InvoiceDetailsModal'
import TableView from '../../../../core/components/view-components/table-view/TableView'

import '../styles/billing.css'

const { Title, Text } = Typography

/**
 * Billing & Subscription Management Page
 * Manages subscription plans, billing history, and payment methods
 */
const Billing = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  const [planUpgradeModalVisible, setPlanUpgradeModalVisible] = useState(false)
  const [paymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false)
  const [invoiceDetailsModalVisible, setInvoiceDetailsModalVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Mock billing data - in real app this would come from API
  const [billingData, setBillingData] = useState({
    currentPlan: {
      name: 'Professional',
      price: 49,
      billingCycle: 'monthly',
      features: [
        'Up to 50 job postings',
        'Advanced candidate screening',
        'Custom questionnaires',
        'Team collaboration tools',
        'Analytics & reporting',
        'API access',
        'Priority support'
      ],
      limits: {
        jobPostings: { used: 23, total: 50 },
        teamMembers: { used: 8, total: 15 },
        storage: { used: 2.3, total: 10 } // GB
      },
      nextBillingDate: '2024-02-15',
      status: 'active'
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true
    },
    invoices: [
      {
        id: 'INV-2024-001',
        date: '2024-01-15',
        amount: 49.0,
        status: 'paid',
        plan: 'Professional',
        period: '2024-01-15 to 2024-02-14',
        downloadUrl: '#'
      },
      {
        id: 'INV-2023-012',
        date: '2023-12-15',
        amount: 49.0,
        status: 'paid',
        plan: 'Professional',
        period: '2023-12-15 to 2024-01-14',
        downloadUrl: '#'
      },
      {
        id: 'INV-2023-011',
        date: '2023-11-15',
        amount: 29.0,
        status: 'paid',
        plan: 'Starter',
        period: '2023-11-15 to 2023-12-14',
        downloadUrl: '#'
      }
    ]
  })

  // Available plans
  const availablePlans = useMemo(
    () => [
      {
        id: 'starter',
        name: 'Starter',
        price: 29,
        billingCycle: 'monthly',
        description: 'Perfect for small teams getting started',
        popular: false,
        features: [
          'Up to 10 job postings',
          'Basic candidate screening',
          'Standard questionnaires',
          'Email support',
          'Basic analytics'
        ],
        limits: {
          jobPostings: 10,
          teamMembers: 5,
          storage: 5
        }
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 49,
        billingCycle: 'monthly',
        description: 'Most popular for growing companies',
        popular: true,
        features: [
          'Up to 50 job postings',
          'Advanced candidate screening',
          'Custom questionnaires',
          'Team collaboration tools',
          'Analytics & reporting',
          'API access',
          'Priority support'
        ],
        limits: {
          jobPostings: 50,
          teamMembers: 15,
          storage: 10
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        billingCycle: 'monthly',
        description: 'Advanced features for large organizations',
        popular: false,
        features: [
          'Unlimited job postings',
          'AI-powered screening',
          'Custom integrations',
          'Advanced analytics',
          'White-label options',
          'Dedicated account manager',
          '24/7 phone support',
          'Custom SLA'
        ],
        limits: {
          jobPostings: 'unlimited',
          teamMembers: 'unlimited',
          storage: 'unlimited'
        }
      }
    ],
    []
  )

  // Handle plan upgrade
  const handlePlanUpgrade = useCallback(() => {
    setPlanUpgradeModalVisible(true)
  }, [])

  // Handle payment method update
  const handlePaymentMethod = useCallback(() => {
    setPaymentMethodModalVisible(true)
  }, [])

  // Handle invoice view
  const handleViewInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice)
    setInvoiceDetailsModalVisible(true)
  }, [])

  // Handle invoice download
  const handleDownloadInvoice = useCallback((invoice) => {
    // In real app, this would trigger download
    message.success(`Downloading invoice ${invoice.id}`)
  }, [])

  // Calculate usage percentages
  const usagePercentages = useMemo(() => {
    const { limits } = billingData.currentPlan
    return {
      jobPostings: Math.round((limits.jobPostings.used / limits.jobPostings.total) * 100),
      teamMembers: Math.round((limits.teamMembers.used / limits.teamMembers.total) * 100),
      storage: Math.round((limits.storage.used / limits.storage.total) * 100)
    }
  }, [billingData.currentPlan])

  // Invoice table columns
  const invoiceColumns = [
    {
      title: 'Invoice',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
          {id}
        </Text>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Text className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{new Date(date).toLocaleDateString()}</Text>
      )
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan) => <Text className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{plan}</Text>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
          ${amount.toFixed(2)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'error'} className='capitalize'>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, invoice) => (
        <Space>
          <Button
            type='primary'
            size='small'
            icon={<FontAwesomeIcon icon={faEdit} />}
            onClick={() => handleViewInvoice(invoice)}
            className='invoice-view-btn'
          >
            View
          </Button>
          <Button
            type='primary'
            size='small'
            icon={<FontAwesomeIcon icon={faDownload} />}
            onClick={() => handleDownloadInvoice(invoice)}
            className='invoice-download-btn'
          >
            Download
          </Button>
        </Space>
      )
    }
  ]

  return (
    <BusinessDashboardPageShell>
      {/* Main Content */}
      <div className='flex-1 relative'>
        <Toolbar title='Billing & Subscription' description='Manage your subscription plan and billing information' />

        {/* Content Area */}
        <div className='relative p-6 space-y-6'>
          {/* Current Plan Overview */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div className='flex items-center space-x-3'>
                    <FontAwesomeIcon icon={faCrown} className='text-emerald-600' />
                    <span>Current Plan</span>
                  </div>
                }
                className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                headStyle={{
                  backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                  borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                  color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                }}
                bodyStyle={{
                  backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                  color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                }}
                extra={
                  <Button
                    type='primary'
                    icon={<FontAwesomeIcon icon={faRocket} className='mr-2' />}
                    onClick={handlePlanUpgrade}
                    style={{
                      backgroundColor: BRAND_COLORS.emeraldPrimary,
                      borderColor: BRAND_COLORS.emeraldPrimary
                    }}
                  >
                    Upgrade Plan
                  </Button>
                }
              >
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Title level={3} className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {billingData.currentPlan.name}
                      </Title>
                      <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        ${billingData.currentPlan.price}/month • Next billing:{' '}
                        {new Date(billingData.currentPlan.nextBillingDate).toLocaleDateString()}
                      </Text>
                    </div>
                    <Tag color='success' className='uppercase font-semibold'>
                      {billingData.currentPlan.status}
                    </Tag>
                  </div>

                  <Divider className={darkMode ? 'border-gray-600' : 'border-gray-200'} />

                  {/* Usage Statistics */}
                  <div className='space-y-4'>
                    <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                      Usage Overview
                    </Text>

                    <Row gutter={16}>
                      <Col xs={24} sm={8}>
                        <div className='text-center'>
                          <Progress
                            type='circle'
                            percent={usagePercentages.jobPostings}
                            size={80}
                            strokeColor={BRAND_COLORS.emeraldPrimary}
                          />
                          <div className='mt-2'>
                            <Text className={darkMode ? 'text-white' : 'text-gray-900'}>Job Postings</Text>
                            <br />
                            <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {billingData.currentPlan.limits.jobPostings.used} /{' '}
                              {billingData.currentPlan.limits.jobPostings.total}
                            </Text>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={8}>
                        <div className='text-center'>
                          <Progress
                            type='circle'
                            percent={usagePercentages.teamMembers}
                            size={80}
                            strokeColor={BRAND_COLORS.bluePrimary}
                          />
                          <div className='mt-2'>
                            <Text className={darkMode ? 'text-white' : 'text-gray-900'}>Team Members</Text>
                            <br />
                            <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {billingData.currentPlan.limits.teamMembers.used} /{' '}
                              {billingData.currentPlan.limits.teamMembers.total}
                            </Text>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={8}>
                        <div className='text-center'>
                          <Progress
                            type='circle'
                            percent={usagePercentages.storage}
                            size={80}
                            strokeColor={BRAND_COLORS.purplePrimary}
                          />
                          <div className='mt-2'>
                            <Text className={darkMode ? 'text-white' : 'text-gray-900'}>Storage</Text>
                            <br />
                            <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {billingData.currentPlan.limits.storage.used}GB /{' '}
                              {billingData.currentPlan.limits.storage.total}GB
                            </Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Divider className={darkMode ? 'border-gray-600' : 'border-gray-200'} />

                  {/* Plan Features */}
                  <div>
                    <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                      Plan Features
                    </Text>
                    <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-2'>
                      {billingData.currentPlan.features.map((feature, index) => (
                        <div key={index} className='flex items-center space-x-2'>
                          <FontAwesomeIcon icon={faCheck} className='text-emerald-500 text-sm' />
                          <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{feature}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Space direction='vertical' size='middle' className='w-full'>
                {/* Payment Method Card */}
                <Card
                  title={
                    <div className='flex items-center space-x-3'>
                      <FontAwesomeIcon icon={faCreditCard} className='text-emerald-600' />
                      <span>Payment Method</span>
                    </div>
                  }
                  className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                  headStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  }}
                  bodyStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  }}
                  extra={
                    <Button
                      type='text'
                      icon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={handlePaymentMethod}
                      className={
                        darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                      }
                    >
                      Edit
                    </Button>
                  }
                >
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`w-12 h-8 rounded flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <Text strong className='text-xs'>
                          {billingData.paymentMethod.brand.toUpperCase()}
                        </Text>
                      </div>
                      <div>
                        <Text className={darkMode ? 'text-white' : 'text-gray-900'}>
                          •••• •••• •••• {billingData.paymentMethod.last4}
                        </Text>
                        <br />
                        <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'} size='small'>
                          Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                        </Text>
                      </div>
                    </div>
                    {billingData.paymentMethod.isDefault && (
                      <Tag color='success' size='small'>
                        Default
                      </Tag>
                    )}
                  </div>
                </Card>

                {/* Quick Stats Card */}
                <Card
                  title={
                    <div className='flex items-center space-x-3'>
                      <FontAwesomeIcon icon={faChartLine} className='text-emerald-600' />
                      <span>Quick Stats</span>
                    </div>
                  }
                  className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                  headStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  }}
                  bodyStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>This Month</Text>}
                        value={49}
                        prefix='$'
                        valueStyle={{
                          color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                          fontSize: '18px'
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Spent</Text>}
                        value={245}
                        prefix='$'
                        valueStyle={{
                          color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                          fontSize: '18px'
                        }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Space>
            </Col>
          </Row>

          {/* Invoice History */}
          <Card
            title={
              <div className='flex items-center space-x-3'>
                <FontAwesomeIcon icon={faReceipt} className='text-emerald-600' />
                <span>Invoice History</span>
              </div>
            }
            className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            headStyle={{
              backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
              borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
              color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
            }}
            bodyStyle={{
              backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
              color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
            }}
          >
            <TableView
              columns={invoiceColumns}
              dataSource={billingData.invoices}
              rowKey='id'
              showSearch={false}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              scroll={{ x: 'max-content' }}
              cardProps={{
                bordered: false,
                className: '!shadow-none border-0 bg-transparent',
                styles: { body: { padding: 0 } }
              }}
              tableProps={{
                className: darkMode ? 'dark-table' : ''
              }}
            />
          </Card>
        </div>
      </div>

      {/* Modals */}
      <PlanUpgradeModal
        visible={planUpgradeModalVisible}
        onCancel={() => setPlanUpgradeModalVisible(false)}
        onSuccess={(newPlan) => {
          setBillingData((prev) => ({ ...prev, currentPlan: { ...prev.currentPlan, ...newPlan } }))
          setPlanUpgradeModalVisible(false)
          message.success('Plan updated successfully!')
        }}
        darkMode={darkMode}
        currentPlan={billingData.currentPlan}
        availablePlans={availablePlans}
      />

      <PaymentMethodModal
        visible={paymentMethodModalVisible}
        onCancel={() => setPaymentMethodModalVisible(false)}
        onSuccess={(newPaymentMethod) => {
          setBillingData((prev) => ({ ...prev, paymentMethod: newPaymentMethod }))
          setPaymentMethodModalVisible(false)
          message.success('Payment method updated successfully!')
        }}
        darkMode={darkMode}
        currentPaymentMethod={billingData.paymentMethod}
      />

      <InvoiceDetailsModal
        visible={invoiceDetailsModalVisible}
        onCancel={() => setInvoiceDetailsModalVisible(false)}
        darkMode={darkMode}
        invoice={selectedInvoice}
      />
    </BusinessDashboardPageShell>
  )
})

Billing.displayName = 'Billing'

export default Billing
