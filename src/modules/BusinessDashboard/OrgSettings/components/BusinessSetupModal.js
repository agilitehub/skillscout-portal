// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState } from 'react'
import { Modal, Form } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { useTheme } from '../../../../core/context/ThemeContext'
import OrganizationProfileForm from './OrganizationProfileForm'

/**
 * Business Dashboard Setup Modal Component
 * Handles the initial setup for business dashboard access
 */
const BusinessSetupModal = ({ isOpen, onClose, onSubmit, form }) => {
  const { darkMode } = useTheme()
  const [loading, setLoading] = useState(false)

  // Handle form submission with loading state
  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSubmit(form.getFieldsValue())
    } finally {
      setLoading(false)
    }
  }

  // Handle close with loading reset
  const handleClose = () => {
    setLoading(false)
    onClose()
  }

  return (
    <>
      {/* Business Setup Modal */}
      <Modal
        title={
          <div className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faBuilding} style={{ color: darkMode ? '#10b981' : '#059669' }} />
            <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>Organization Profile Setup</span>
          </div>
        }
        open={isOpen}
        onCancel={handleClose}
        closable={false}
        maskClosable={false}
        footer={null}
        width='90%'
        style={{ maxWidth: '1200px', height: '90vh' }}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          },
          body: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            height: 'calc(90vh - 120px)',
            padding: '24px'
          },
          header: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderBottom: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
          },
          mask: {
            backgroundColor: '#000',
            opacity: 0.6
          }
        }}
      >
        {/* Dark Mode Form Styling */}
        {darkMode && (
          <style>
            {`
               .business-setup-form .ant-form-item-label > label {
                 color: #E5E7EB !important;
               }
               .business-setup-form .ant-form-item-extra {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-input,
               .business-setup-form input.ant-input,
               .business-setup-form input[type="text"],
               .business-setup-form input[type="number"],
               .business-setup-form input {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-input:focus,
               .business-setup-form input.ant-input:focus,
               .business-setup-form input[type="text"]:focus,
               .business-setup-form input[type="number"]:focus,
               .business-setup-form input:focus {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                 background-color: #4B5563 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-input::placeholder,
               .business-setup-form input::placeholder {
                 color: #D1D5DB !important;
               }
               .business-setup-form textarea.ant-input,
               .business-setup-form textarea {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form textarea.ant-input:focus,
               .business-setup-form textarea:focus {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                 background-color: #4B5563 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form textarea.ant-input::placeholder,
               .business-setup-form textarea::placeholder {
                 color: #D1D5DB !important;
               }
               .business-setup-form .ant-input-show-count-suffix {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-select,
               .business-setup-form .ant-select-selector,
               .business-setup-form .ant-select-single .ant-select-selector {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-select-focused .ant-select-selector,
               .business-setup-form .ant-select:focus .ant-select-selector {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                 background-color: #4B5563 !important;
               }
               .business-setup-form .ant-select-selection-placeholder {
                 color: #D1D5DB !important;
               }
               .business-setup-form .ant-select-selection-item {
                 color: #F9FAFB !important;
                 background-color: transparent !important;
               }
               .business-setup-form .ant-select-arrow {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-select-multiple .ant-select-selection-item {
                 background-color: #374151 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-select-multiple .ant-select-selection-item-remove {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-select-multiple .ant-select-selection-item-remove:hover {
                 color: #F9FAFB !important;
               }
               
               /* Dark mode dropdown options */
               .business-setup-dark-dropdown {
                 background-color: #374151 !important;
               }
               
               .business-setup-dark-dropdown .ant-select-item {
                 color: #F9FAFB !important;
               }
               
               .business-setup-dark-dropdown .ant-select-item:hover {
                 background-color: #4B5563 !important;
               }
               
               .business-setup-dark-dropdown .ant-select-item-option-selected {
                 background-color: #059669 !important;
                 color: #FFFFFF !important;
               }
               
               /* Work arrangement dropdown specific styles */
               .work-arrangement-dropdown .ant-select-item {
                 min-height: 60px !important;
                 padding: 8px 12px !important;
                 line-height: 1.4 !important;
               }
               
               .work-arrangement-dropdown.business-setup-dark-dropdown .ant-select-item {
                 background-color: #374151 !important;
                 color: #F9FAFB !important;
               }
               
               .work-arrangement-dropdown:not(.business-setup-dark-dropdown) .ant-select-item {
                 background-color: #FFFFFF !important;
                 color: #374151 !important;
               }
               
               .work-arrangement-dropdown .ant-select-item:hover {
                 background-color: #4B5563 !important;
               }
               
               .work-arrangement-dropdown .ant-select-item-option-selected {
                 background-color: #10B981 !important;
                 color: #FFFFFF !important;
               }
             `}
          </style>
        )}

        <div className='h-full flex flex-col'>
          {/* Header Info */}
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            <p className='mb-3'>
              Please provide your organization information to set up your Business Dashboard. This helps us customize
              your experience and organize your business data.
            </p>
            <div
              className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}
            >
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-0`}>
                <strong>Note:</strong> All fields are optional except for the organization name. You can always update
                this information later.
              </p>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className='flex-1 overflow-y-auto pr-2'>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              className={`${darkMode ? 'business-setup-form' : ''}`}
            >
              <OrganizationProfileForm
                fieldNameFormat='snake_case'
                showSections={{
                  organizationProfile: true,
                  workArrangement: true,
                  regionalPreferences: true,
                  industryTags: true,
                  timezone: true
                }}
                darkMode={darkMode}
                dropdownClassName={darkMode ? 'business-setup-dark-dropdown' : ''}
                cardWrapper={true}
              />
            </Form>
          </div>

          {/* Footer Actions */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600 mt-6'>
            <Button
              type='default'
              onClick={handleClose}
              disabled={loading}
              size='large'
              className='form-btn-secondary'
            >
              Cancel
            </Button>
            <Button
              type='primary'
              onClick={() => handleSubmit()}
              loading={loading}
              size='large'
              className='form-btn-primary'
            >
              Setup Organization Profile
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BusinessSetupModal
