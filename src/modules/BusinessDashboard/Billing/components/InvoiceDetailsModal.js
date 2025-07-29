// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Modal, Descriptions, Tag, Divider, Typography, Row, Col } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faReceipt,
  faDownload,
  faCalendarAlt,
  faDollarSign,
  faBuilding,
  faEnvelope,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'

const { Title, Text } = Typography

/**
 * Invoice Details Modal Component
 * Displays detailed invoice information and allows download
 */
const InvoiceDetailsModal = React.memo(({ visible, onCancel, darkMode, invoice }) => {
  if (!invoice) return null

  // Mock detailed invoice data
  const invoiceDetails = {
    ...invoice,
    company: {
      name: 'TechCorp Solutions',
      address: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      email: 'billing@techcorp.com',
      phone: '+1 (555) 123-4567'
    },
    items: [
      {
        description: 'Professional Plan Subscription',
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

  const handleDownload = () => {
    // In real app, this would download the PDF
    console.log('Downloading invoice:', invoice.id)
  }

  return (
    <>
      {/* Modal Styles */}
      <style jsx global>{`
        .invoice-details-modal .ant-modal-content {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .invoice-details-modal .ant-modal-header {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          border-bottom: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .invoice-details-modal .ant-modal-close {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invoice-details-modal .ant-modal-close:hover {
          color: ${BRAND_COLORS.emeraldLight} !important;
        }
        
        .invoice-details-modal .ant-descriptions-item-label {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .invoice-details-modal .ant-descriptions-item-content {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .invoice-header {
          background: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.lightGray};
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        
        .invoice-table th {
          background: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.lightGray} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          font-weight: 600;
          padding: 12px;
          border: 1px solid ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray};
        }
        
        .invoice-table td {
          background: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          padding: 12px;
          border: 1px solid ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray};
        }
      `}</style>

      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: BRAND_COLORS.emeraldPrimary }}
            >
              <FontAwesomeIcon icon={faReceipt} className='text-white text-sm' />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              Invoice Details - {invoice.id}
            </span>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        width={800}
        className="invoice-details-modal"
        footer={
          <div className="flex justify-between items-center">
            <div>
              <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Need help? Contact support at billing@techcorp.com
              </Text>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={onCancel}>
                Close
              </Button>
              
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faDownload} />}
                onClick={handleDownload}
                style={{
                  backgroundColor: BRAND_COLORS.emeraldPrimary,
                  borderColor: BRAND_COLORS.emeraldPrimary
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        }
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="invoice-header">
            <Row gutter={16}>
              <Col span={12}>
                <div className="space-y-2">
                  <Title level={4} className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                    {invoiceDetails.company.name}
                  </Title>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    {invoiceDetails.company.address}<br />
                    {invoiceDetails.company.city}, {invoiceDetails.company.state} {invoiceDetails.company.zipCode}<br />
                    {invoiceDetails.company.country}
                  </div>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    {invoiceDetails.company.email}
                  </div>
                </div>
              </Col>
              
              <Col span={12} className="text-right">
                <div className="space-y-2">
                  <Title level={2} className={`!mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {invoice.id}
                  </Title>
                  <div>
                    <Tag 
                      color={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'}
                      className="mb-2 uppercase font-semibold"
                    >
                      {invoice.status}
                    </Tag>
                  </div>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Invoice Date: {new Date(invoice.date).toLocaleDateString()}
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Invoice Details */}
          <Descriptions
            title={
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                Invoice Information
              </span>
            }
            bordered
            column={2}
            size="middle"
          >
            <Descriptions.Item label="Invoice ID">
              {invoice.id}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(invoice.date).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Plan">
              {invoice.plan}
            </Descriptions.Item>
            <Descriptions.Item label="Billing Period">
              {invoice.period}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {invoiceDetails.paymentMethod.type} •••• {invoiceDetails.paymentMethod.last4}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              {invoiceDetails.paymentMethod.transactionId}
            </Descriptions.Item>
          </Descriptions>

          {/* Invoice Items */}
          <div>
            <Title level={4} className={`mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Invoice Items
            </Title>
            
            <table className="invoice-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Description</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Period: {item.period}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-right font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Divider className={darkMode ? 'border-gray-600' : 'border-gray-200'} />

          {/* Invoice Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Subtotal:
                </Text>
                <Text className={darkMode ? 'text-white' : 'text-gray-900'}>
                  ${invoiceDetails.summary.subtotal.toFixed(2)}
                </Text>
              </div>
              
              <div className="flex justify-between">
                <Text className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Tax:
                </Text>
                <Text className={darkMode ? 'text-white' : 'text-gray-900'}>
                  ${invoiceDetails.summary.tax.toFixed(2)}
                </Text>
              </div>
              
              <Divider className={`my-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
              
              <div className="flex justify-between text-lg font-semibold">
                <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                  <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                  Total:
                </Text>
                <Text strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                  ${invoiceDetails.summary.total.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {invoice.status === 'paid' && (
            <div 
              className={`p-4 rounded-lg border-l-4 ${
                darkMode ? 'bg-green-900/20 border-green-500' : 'bg-green-50 border-green-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faDownload} className="text-green-500" />
                <Text strong className="text-green-600">
                  Payment Successful
                </Text>
              </div>
              <Text className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                This invoice has been paid in full. Thank you for your business!
              </Text>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
})

InvoiceDetailsModal.displayName = 'InvoiceDetailsModal'

export default InvoiceDetailsModal 