// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Billing Controller
 * Handles billing operations, subscription management, and payment processing
 */

import { validateBillingData, validatePaymentMethod } from '../model'

class BillingController {
  constructor() {
    this.apiEndpoint = '/api/billing'
  }

  /**
   * Get current subscription and billing information
   * @returns {Promise} Billing data
   */
  async getBillingData() {
    try {
      // In a real app, this would make an API call
      // const response = await supabaseController.from('subscriptions').select('*').single()
      
      return {
        success: true,
        data: this.getMockBillingData()
      }
    } catch (error) {
      console.error('Error fetching billing data:', error)
      throw new Error('Failed to fetch billing data')
    }
  }

  /**
   * Update subscription plan
   * @param {string} planId - New plan ID
   * @returns {Promise} Updated subscription
   */
  async updateSubscriptionPlan(planId) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const plans = this.getAvailablePlans()
      const newPlan = plans.find(p => p.id === planId)
      
      if (!newPlan) {
        throw new Error('Invalid plan selected')
      }

      // In a real app, this would update the subscription via payment processor
      // const response = await paymentProcessor.updateSubscription({ planId })

      return {
        success: true,
        data: {
          ...newPlan,
          status: 'active',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        message: `Successfully ${newPlan.price > 49 ? 'upgraded' : 'downgraded'} to ${newPlan.name} plan`
      }
    } catch (error) {
      console.error('Error updating subscription plan:', error)
      throw new Error('Failed to update subscription plan')
    }
  }

  /**
   * Update payment method
   * @param {Object} paymentMethodData - New payment method data
   * @returns {Promise} Updated payment method
   */
  async updatePaymentMethod(paymentMethodData) {
    try {
      // Validate payment method data
      const validationResult = validatePaymentMethod(paymentMethodData)
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '))
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real app, this would securely store payment method via payment processor
      // const response = await paymentProcessor.updatePaymentMethod(paymentMethodData)

      return {
        success: true,
        data: paymentMethodData,
        message: 'Payment method updated successfully'
      }
    } catch (error) {
      console.error('Error updating payment method:', error)
      throw new Error('Failed to update payment method')
    }
  }

  /**
   * Get invoice history
   * @param {number} limit - Number of invoices to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise} Invoice list
   */
  async getInvoiceHistory(limit = 10, offset = 0) {
    try {
      // In a real app, this would fetch from database
      // const response = await supabaseController.from('invoices')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      //   .range(offset, offset + limit - 1)

      const invoices = this.getMockInvoices()
      const paginatedInvoices = invoices.slice(offset, offset + limit)

      return {
        success: true,
        data: paginatedInvoices,
        total: invoices.length,
        hasMore: offset + limit < invoices.length
      }
    } catch (error) {
      console.error('Error fetching invoice history:', error)
      throw new Error('Failed to fetch invoice history')
    }
  }

  /**
   * Get detailed invoice information
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise} Invoice details
   */
  async getInvoiceDetails(invoiceId) {
    try {
      // In a real app, this would fetch detailed invoice from database
      // const response = await supabaseController.from('invoices')
      //   .select('*, invoice_items(*)')
      //   .eq('id', invoiceId)
      //   .single()

      const invoices = this.getMockInvoices()
      const invoice = invoices.find(inv => inv.id === invoiceId)
      
      if (!invoice) {
        throw new Error('Invoice not found')
      }

      // Add detailed information
      const detailedInvoice = {
        ...invoice,
        items: [
          {
            description: `${invoice.plan} Plan Subscription`,
            period: invoice.period,
            quantity: 1,
            unitPrice: invoice.amount,
            total: invoice.amount
          }
        ],
        summary: {
          subtotal: invoice.amount,
          tax: 0,
          total: invoice.amount
        },
        paymentMethod: {
          type: 'Credit Card',
          last4: '4242',
          transactionId: `txn_${invoice.id.replace('INV-', '')}_${Math.random().toString(36).substr(2, 9)}`
        }
      }

      return {
        success: true,
        data: detailedInvoice
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error)
      throw new Error('Failed to fetch invoice details')
    }
  }

  /**
   * Download invoice PDF
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise} Download URL or file blob
   */
  async downloadInvoice(invoiceId) {
    try {
      // In a real app, this would generate/fetch PDF from service
      // const response = await invoiceService.generatePDF(invoiceId)
      
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        data: {
          downloadUrl: `#download-${invoiceId}`,
          filename: `${invoiceId}.pdf`
        },
        message: 'Invoice downloaded successfully'
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      throw new Error('Failed to download invoice')
    }
  }

  /**
   * Get available subscription plans
   * @returns {Promise} Available plans
   */
  async getAvailablePlans() {
    try {
      return {
        success: true,
        data: this.getAvailablePlans()
      }
    } catch (error) {
      console.error('Error fetching available plans:', error)
      throw new Error('Failed to fetch available plans')
    }
  }

  /**
   * Get billing statistics
   * @returns {Promise} Billing statistics
   */
  async getBillingStatistics() {
    try {
      const billingData = this.getMockBillingData()
      const invoices = this.getMockInvoices()
      
      const stats = {
        currentMonthSpend: billingData.currentPlan.price,
        totalSpent: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        averageMonthlySpend: invoices.reduce((sum, inv) => sum + inv.amount, 0) / Math.max(invoices.length, 1),
        nextBillingAmount: billingData.currentPlan.price,
        nextBillingDate: billingData.currentPlan.nextBillingDate,
        invoiceCount: invoices.length,
        planUsage: billingData.currentPlan.limits
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching billing statistics:', error)
      throw new Error('Failed to fetch billing statistics')
    }
  }

  /**
   * Cancel subscription
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Cancellation result
   */
  async cancelSubscription(reason) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In a real app, this would cancel via payment processor
      // const response = await paymentProcessor.cancelSubscription({ reason })

      return {
        success: true,
        data: {
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          reason,
          refundAmount: 0 // Pro-rated refund if applicable
        },
        message: 'Subscription cancelled successfully'
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  /**
   * Reactivate cancelled subscription
   * @returns {Promise} Reactivation result
   */
  async reactivateSubscription() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        data: {
          status: 'active',
          reactivatedAt: new Date().toISOString()
        },
        message: 'Subscription reactivated successfully'
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      throw new Error('Failed to reactivate subscription')
    }
  }

  /**
   * Get available plans (static data)
   * @returns {Array} Available plans
   */
  getAvailablePlans() {
    return [
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
    ]
  }

  /**
   * Get mock billing data (for development)
   * @returns {Object} Mock billing data
   */
  getMockBillingData() {
    return {
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
          storage: { used: 2.3, total: 10 }
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
      }
    }
  }

  /**
   * Get mock invoices (for development)
   * @returns {Array} Mock invoice data
   */
  getMockInvoices() {
    return [
      {
        id: 'INV-2024-001',
        date: '2024-01-15',
        amount: 49.00,
        status: 'paid',
        plan: 'Professional',
        period: '2024-01-15 to 2024-02-14',
        downloadUrl: '#'
      },
      {
        id: 'INV-2023-012',
        date: '2023-12-15',
        amount: 49.00,
        status: 'paid',
        plan: 'Professional',
        period: '2023-12-15 to 2024-01-14',
        downloadUrl: '#'
      },
      {
        id: 'INV-2023-011',
        date: '2023-11-15',
        amount: 29.00,
        status: 'paid',
        plan: 'Starter',
        period: '2023-11-15 to 2023-12-14',
        downloadUrl: '#'
      },
      {
        id: 'INV-2023-010',
        date: '2023-10-15',
        amount: 29.00,
        status: 'paid',
        plan: 'Starter',
        period: '2023-10-15 to 2023-11-14',
        downloadUrl: '#'
      },
      {
        id: 'INV-2023-009',
        date: '2023-09-15',
        amount: 29.00,
        status: 'paid',
        plan: 'Starter',
        period: '2023-09-15 to 2023-10-14',
        downloadUrl: '#'
      }
    ]
  }
}

export default new BillingController() 