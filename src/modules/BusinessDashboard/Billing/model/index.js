// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Data Model for Billing & Subscription Management
 * Defines validation schemas and business logic for billing data
 */

// Subscription status definitions
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  INCOMPLETE: 'incomplete',
  PAUSED: 'paused'
}

// Payment method types
export const PAYMENT_METHOD_TYPES = {
  CARD: 'card',
  BANK_ACCOUNT: 'bank_account',
  PAYPAL: 'paypal',
  APPLE_PAY: 'apple_pay'
}

// Invoice status definitions
export const INVOICE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
}

// Billing cycle definitions
export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
}

// Credit card brands
export const CARD_BRANDS = [
  'visa', 'mastercard', 'amex', 'discover', 'jcb', 'diners', 'unionpay'
]

/**
 * Subscription Schema
 * Defines the structure and validation rules for subscription data
 */
export const SubscriptionSchema = {
  id: { type: 'string', required: true },
  planId: { type: 'string', required: true },
  planName: { type: 'string', required: true },
  price: { type: 'number', required: true, min: 0 },
  billingCycle: { type: 'string', required: true, enum: Object.values(BILLING_CYCLES) },
  status: { type: 'string', required: true, enum: Object.values(SUBSCRIPTION_STATUS) },
  currentPeriodStart: { type: 'string', required: true, format: 'iso-date' },
  currentPeriodEnd: { type: 'string', required: true, format: 'iso-date' },
  nextBillingDate: { type: 'string', required: false, format: 'iso-date' },
  cancelAtPeriodEnd: { type: 'boolean', required: false },
  trialEnd: { type: 'string', required: false, format: 'iso-date' }
}

/**
 * Payment Method Schema
 * Defines the structure and validation rules for payment method data
 */
export const PaymentMethodSchema = {
  type: { type: 'string', required: true, enum: Object.values(PAYMENT_METHOD_TYPES) },
  last4: { type: 'string', required: true, pattern: /^\d{4}$/ },
  brand: { type: 'string', required: true, enum: CARD_BRANDS },
  expiryMonth: { type: 'number', required: true, min: 1, max: 12 },
  expiryYear: { type: 'number', required: true, min: new Date().getFullYear() },
  holderName: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  isDefault: { type: 'boolean', required: false },
  billingAddress: { type: 'object', required: false }
}

/**
 * Invoice Schema
 * Defines the structure and validation rules for invoice data
 */
export const InvoiceSchema = {
  id: { type: 'string', required: true },
  subscriptionId: { type: 'string', required: true },
  amount: { type: 'number', required: true, min: 0 },
  currency: { type: 'string', required: true, default: 'USD' },
  status: { type: 'string', required: true, enum: Object.values(INVOICE_STATUS) },
  invoiceDate: { type: 'string', required: true, format: 'iso-date' },
  dueDate: { type: 'string', required: true, format: 'iso-date' },
  paidDate: { type: 'string', required: false, format: 'iso-date' },
  periodStart: { type: 'string', required: true, format: 'iso-date' },
  periodEnd: { type: 'string', required: true, format: 'iso-date' },
  subtotal: { type: 'number', required: true, min: 0 },
  tax: { type: 'number', required: false, min: 0 },
  total: { type: 'number', required: true, min: 0 }
}

/**
 * Validate billing data
 * @param {Object} billingData - Billing data to validate
 * @returns {Object} Validation result
 */
export const validateBillingData = (billingData) => {
  const errors = []

  if (!billingData) {
    errors.push('Billing data is required')
    return { isValid: false, errors }
  }

  // Validate subscription data
  if (billingData.subscription) {
    const subErrors = validateSubscription(billingData.subscription)
    if (!subErrors.isValid) {
      errors.push(...subErrors.errors.map(err => `Subscription: ${err}`))
    }
  }

  // Validate payment method
  if (billingData.paymentMethod) {
    const pmErrors = validatePaymentMethod(billingData.paymentMethod)
    if (!pmErrors.isValid) {
      errors.push(...pmErrors.errors.map(err => `Payment Method: ${err}`))
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate subscription data
 * @param {Object} subscription - Subscription data to validate
 * @returns {Object} Validation result
 */
export const validateSubscription = (subscription) => {
  const errors = []

  if (!subscription.planId || typeof subscription.planId !== 'string') {
    errors.push('Plan ID is required and must be a string')
  }

  if (!subscription.planName || typeof subscription.planName !== 'string') {
    errors.push('Plan name is required and must be a string')
  }

  if (typeof subscription.price !== 'number' || subscription.price < 0) {
    errors.push('Price must be a non-negative number')
  }

  if (!subscription.billingCycle || !Object.values(BILLING_CYCLES).includes(subscription.billingCycle)) {
    errors.push('Billing cycle is required and must be valid')
  }

  if (!subscription.status || !Object.values(SUBSCRIPTION_STATUS).includes(subscription.status)) {
    errors.push('Status is required and must be valid')
  }

  if (!subscription.currentPeriodStart || !isValidISODate(subscription.currentPeriodStart)) {
    errors.push('Current period start must be a valid ISO date')
  }

  if (!subscription.currentPeriodEnd || !isValidISODate(subscription.currentPeriodEnd)) {
    errors.push('Current period end must be a valid ISO date')
  }

  if (subscription.nextBillingDate && !isValidISODate(subscription.nextBillingDate)) {
    errors.push('Next billing date must be a valid ISO date')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate payment method data
 * @param {Object} paymentMethod - Payment method data to validate
 * @returns {Object} Validation result
 */
export const validatePaymentMethod = (paymentMethod) => {
  const errors = []

  if (!paymentMethod.type || !Object.values(PAYMENT_METHOD_TYPES).includes(paymentMethod.type)) {
    errors.push('Payment method type is required and must be valid')
  }

  if (!paymentMethod.last4 || !/^\d{4}$/.test(paymentMethod.last4)) {
    errors.push('Last 4 digits must be exactly 4 numeric digits')
  }

  if (!paymentMethod.brand || !CARD_BRANDS.includes(paymentMethod.brand.toLowerCase())) {
    errors.push('Card brand is required and must be valid')
  }

  if (typeof paymentMethod.expiryMonth !== 'number' || 
      paymentMethod.expiryMonth < 1 || paymentMethod.expiryMonth > 12) {
    errors.push('Expiry month must be a number between 1 and 12')
  }

  const currentYear = new Date().getFullYear()
  if (typeof paymentMethod.expiryYear !== 'number' || 
      paymentMethod.expiryYear < currentYear) {
    errors.push('Expiry year must be a number and not in the past')
  }

  if (!paymentMethod.holderName || 
      typeof paymentMethod.holderName !== 'string' || 
      paymentMethod.holderName.trim().length < 2) {
    errors.push('Cardholder name is required and must be at least 2 characters')
  }

  // Validate billing address if provided
  if (paymentMethod.billingAddress) {
    const addressErrors = validateBillingAddress(paymentMethod.billingAddress)
    if (!addressErrors.isValid) {
      errors.push(...addressErrors.errors.map(err => `Billing Address: ${err}`))
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate billing address
 * @param {Object} address - Billing address to validate
 * @returns {Object} Validation result
 */
export const validateBillingAddress = (address) => {
  const errors = []

  if (!address.address || typeof address.address !== 'string' || address.address.trim().length < 5) {
    errors.push('Address is required and must be at least 5 characters')
  }

  if (!address.city || typeof address.city !== 'string' || address.city.trim().length < 2) {
    errors.push('City is required and must be at least 2 characters')
  }

  if (!address.state || typeof address.state !== 'string' || address.state.trim().length < 2) {
    errors.push('State is required and must be at least 2 characters')
  }

  if (!address.zipCode || typeof address.zipCode !== 'string' || address.zipCode.trim().length < 5) {
    errors.push('ZIP code is required and must be at least 5 characters')
  }

  if (!address.country || typeof address.country !== 'string' || address.country.trim().length < 2) {
    errors.push('Country is required and must be at least 2 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate invoice data
 * @param {Object} invoice - Invoice data to validate
 * @returns {Object} Validation result
 */
export const validateInvoice = (invoice) => {
  const errors = []

  if (!invoice.id || typeof invoice.id !== 'string') {
    errors.push('Invoice ID is required and must be a string')
  }

  if (!invoice.subscriptionId || typeof invoice.subscriptionId !== 'string') {
    errors.push('Subscription ID is required and must be a string')
  }

  if (typeof invoice.amount !== 'number' || invoice.amount < 0) {
    errors.push('Amount must be a non-negative number')
  }

  if (!invoice.status || !Object.values(INVOICE_STATUS).includes(invoice.status)) {
    errors.push('Status is required and must be valid')
  }

  if (!invoice.invoiceDate || !isValidISODate(invoice.invoiceDate)) {
    errors.push('Invoice date must be a valid ISO date')
  }

  if (!invoice.dueDate || !isValidISODate(invoice.dueDate)) {
    errors.push('Due date must be a valid ISO date')
  }

  if (invoice.paidDate && !isValidISODate(invoice.paidDate)) {
    errors.push('Paid date must be a valid ISO date')
  }

  if (typeof invoice.total !== 'number' || invoice.total < 0) {
    errors.push('Total must be a non-negative number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Transform billing data for database storage
 * @param {Object} billingData - Billing data from frontend
 * @returns {Object} Transformed data for database
 */
export const transformToDatabase = (billingData) => {
  return {
    subscription: billingData.subscription ? {
      id: billingData.subscription.id,
      plan_id: billingData.subscription.planId,
      plan_name: billingData.subscription.planName,
      price: billingData.subscription.price,
      billing_cycle: billingData.subscription.billingCycle,
      status: billingData.subscription.status,
      current_period_start: billingData.subscription.currentPeriodStart,
      current_period_end: billingData.subscription.currentPeriodEnd,
      next_billing_date: billingData.subscription.nextBillingDate,
      cancel_at_period_end: billingData.subscription.cancelAtPeriodEnd || false,
      trial_end: billingData.subscription.trialEnd,
      updated_at: new Date().toISOString()
    } : null,
    payment_method: billingData.paymentMethod ? {
      type: billingData.paymentMethod.type,
      last4: billingData.paymentMethod.last4,
      brand: billingData.paymentMethod.brand,
      expiry_month: billingData.paymentMethod.expiryMonth,
      expiry_year: billingData.paymentMethod.expiryYear,
      holder_name: billingData.paymentMethod.holderName,
      is_default: billingData.paymentMethod.isDefault || true,
      billing_address: billingData.paymentMethod.billingAddress,
      updated_at: new Date().toISOString()
    } : null
  }
}

/**
 * Transform billing data from database for frontend
 * @param {Object} dbData - Billing data from database
 * @returns {Object} Transformed data for frontend
 */
export const transformFromDatabase = (dbData) => {
  return {
    subscription: dbData.subscription ? {
      id: dbData.subscription.id,
      planId: dbData.subscription.plan_id,
      planName: dbData.subscription.plan_name,
      price: dbData.subscription.price,
      billingCycle: dbData.subscription.billing_cycle,
      status: dbData.subscription.status,
      currentPeriodStart: dbData.subscription.current_period_start,
      currentPeriodEnd: dbData.subscription.current_period_end,
      nextBillingDate: dbData.subscription.next_billing_date,
      cancelAtPeriodEnd: dbData.subscription.cancel_at_period_end,
      trialEnd: dbData.subscription.trial_end,
      updatedAt: dbData.subscription.updated_at
    } : null,
    paymentMethod: dbData.payment_method ? {
      type: dbData.payment_method.type,
      last4: dbData.payment_method.last4,
      brand: dbData.payment_method.brand,
      expiryMonth: dbData.payment_method.expiry_month,
      expiryYear: dbData.payment_method.expiry_year,
      holderName: dbData.payment_method.holder_name,
      isDefault: dbData.payment_method.is_default,
      billingAddress: dbData.payment_method.billing_address,
      updatedAt: dbData.payment_method.updated_at
    } : null
  }
}

/**
 * Calculate subscription metrics
 * @param {Object} subscription - Subscription data
 * @param {Array} invoices - Invoice history
 * @returns {Object} Subscription metrics
 */
export const calculateSubscriptionMetrics = (subscription, invoices = []) => {
  const now = new Date()
  const currentPeriodStart = new Date(subscription.currentPeriodStart)
  const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
  
  // Calculate days in current billing period
  const totalDaysInPeriod = Math.ceil((currentPeriodEnd - currentPeriodStart) / (24 * 60 * 60 * 1000))
  const daysUsed = Math.ceil((now - currentPeriodStart) / (24 * 60 * 60 * 1000))
  const daysRemaining = Math.max(0, Math.ceil((currentPeriodEnd - now) / (24 * 60 * 60 * 1000)))

  // Calculate financial metrics
  const paidInvoices = invoices.filter(inv => inv.status === INVOICE_STATUS.PAID)
  const totalSpent = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const averageMonthlySpend = paidInvoices.length > 0 ? totalSpent / paidInvoices.length : 0

  // Calculate usage percentage for current period
  const periodUsagePercentage = Math.round((daysUsed / totalDaysInPeriod) * 100)

  return {
    totalDaysInPeriod,
    daysUsed,
    daysRemaining,
    periodUsagePercentage,
    totalSpent,
    averageMonthlySpend,
    invoiceCount: invoices.length,
    paidInvoiceCount: paidInvoices.length,
    isTrialActive: subscription.trialEnd && new Date(subscription.trialEnd) > now,
    willCancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false
  }
}

/**
 * Get subscription status display info
 * @param {string} status - Subscription status
 * @returns {Object} Display information
 */
export const getSubscriptionStatusInfo = (status) => {
  const statusInfo = {
    [SUBSCRIPTION_STATUS.ACTIVE]: {
      label: 'Active',
      color: 'success',
      description: 'Your subscription is active and billing normally'
    },
    [SUBSCRIPTION_STATUS.CANCELLED]: {
      label: 'Cancelled',
      color: 'error',
      description: 'Your subscription has been cancelled'
    },
    [SUBSCRIPTION_STATUS.PAST_DUE]: {
      label: 'Past Due',
      color: 'warning',
      description: 'Payment is overdue, please update your payment method'
    },
    [SUBSCRIPTION_STATUS.INCOMPLETE]: {
      label: 'Incomplete',
      color: 'warning',
      description: 'Subscription setup is incomplete'
    },
    [SUBSCRIPTION_STATUS.PAUSED]: {
      label: 'Paused',
      color: 'default',
      description: 'Your subscription is temporarily paused'
    }
  }

  return statusInfo[status] || statusInfo[SUBSCRIPTION_STATUS.ACTIVE]
}

/**
 * Format currency amount
 * @param {number} amount - Amount in cents or smallest currency unit
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount)
}

/**
 * Calculate prorated amount
 * @param {number} fullAmount - Full billing amount
 * @param {string} periodStart - Period start date
 * @param {string} periodEnd - Period end date
 * @param {string} changeDate - Date of change
 * @returns {number} Prorated amount
 */
export const calculateProratedAmount = (fullAmount, periodStart, periodEnd, changeDate = new Date().toISOString()) => {
  const start = new Date(periodStart)
  const end = new Date(periodEnd)
  const change = new Date(changeDate)
  
  const totalDays = Math.ceil((end - start) / (24 * 60 * 60 * 1000))
  const remainingDays = Math.ceil((end - change) / (24 * 60 * 60 * 1000))
  
  return Math.round((fullAmount * remainingDays) / totalDays)
}

/**
 * Check if card is expired
 * @param {number} expiryMonth - Expiry month (1-12)
 * @param {number} expiryYear - Expiry year (full year)
 * @returns {boolean} Whether card is expired
 */
export const isCardExpired = (expiryMonth, expiryYear) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
  
  return expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)
}

/**
 * Generate next billing date
 * @param {string} currentBillingDate - Current billing date
 * @param {string} billingCycle - Billing cycle (monthly, quarterly, yearly)
 * @returns {string} Next billing date
 */
export const generateNextBillingDate = (currentBillingDate, billingCycle) => {
  const current = new Date(currentBillingDate)
  
  switch (billingCycle) {
    case BILLING_CYCLES.MONTHLY:
      current.setMonth(current.getMonth() + 1)
      break
    case BILLING_CYCLES.QUARTERLY:
      current.setMonth(current.getMonth() + 3)
      break
    case BILLING_CYCLES.YEARLY:
      current.setFullYear(current.getFullYear() + 1)
      break
    default:
      current.setMonth(current.getMonth() + 1)
  }
  
  return current.toISOString().split('T')[0]
}

// Utility functions

/**
 * Validate ISO date format
 * @param {string} date - Date string to validate
 * @returns {boolean} Whether date is valid ISO format
 */
const isValidISODate = (date) => {
  const parsedDate = new Date(date)
  return parsedDate instanceof Date && !isNaN(parsedDate) && date === parsedDate.toISOString().split('T')[0]
}

// Export configuration object
const billingConfig = {
  SUBSCRIPTION_STATUS,
  PAYMENT_METHOD_TYPES,
  INVOICE_STATUS,
  BILLING_CYCLES,
  CARD_BRANDS,
  SubscriptionSchema,
  PaymentMethodSchema,
  InvoiceSchema,
  validateBillingData,
  validateSubscription,
  validatePaymentMethod,
  validateBillingAddress,
  validateInvoice,
  transformToDatabase,
  transformFromDatabase,
  calculateSubscriptionMetrics,
  getSubscriptionStatusInfo,
  formatCurrency,
  calculateProratedAmount,
  isCardExpired,
  generateNextBillingDate
}

export default billingConfig 