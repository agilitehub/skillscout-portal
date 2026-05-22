// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState } from 'react'
import { Form } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { Button, ThemedModal, ModalTitleWithIcon } from '../../../../core/components'
import { useTheme } from '../../../../core/context/ThemeContext'
import OrganizationProfileForm from './OrganizationProfileForm'
import { BRAND_COLORS, DARK_THEME } from '../../../../core/theme/colors'

import '../styles/business-setup-modal.css'

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
      <ThemedModal
        title={
          <ModalTitleWithIcon icon={<FontAwesomeIcon icon={faBuilding} className='text-emerald-600 dark:text-emerald-400' />}>
            Organization Profile Setup
          </ModalTitleWithIcon>
        }
        open={isOpen}
        onCancel={handleClose}
        closable={false}
        maskClosable={false}
        footer={null}
        width='90%'
        rootClassName='business-setup-themed-modal'
        style={{ maxWidth: '1200px', height: '90vh' }}
        styles={{
          content: {
            backgroundColor: darkMode ? DARK_THEME.background.tertiary : BRAND_COLORS.white,
            color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.black
          },
          body: {
            backgroundColor: darkMode ? DARK_THEME.background.tertiary : BRAND_COLORS.white,
            color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.black,
            height: 'calc(90vh - 120px)',
            padding: '24px'
          },
          header: {
            backgroundColor: darkMode ? DARK_THEME.background.tertiary : BRAND_COLORS.white,
            borderBottom: darkMode ? `1px solid ${DARK_THEME.border.secondary}` : '1px solid #e5e7eb'
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
               /* Ant Design 6: TextArea showCount renders .ant-input-data-count, not -suffix */
               .business-setup-form .ant-input-data-count,
               .business-setup-form .ant-input-affix-wrapper.ant-input-textarea-show-count .ant-input-data-count {
                 color: #F9FAFB !important;
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
               .business-setup-form .ant-select-selection-item {
                 color: #F9FAFB !important;
                 background-color: transparent !important;
               }
               /* Ant Design 6: Select placeholder uses .ant-select-placeholder */
               .business-setup-form .ant-select .ant-select-placeholder,
               .business-setup-form .ant-select-placeholder {
                 color: #D1D5DB !important;
                 -webkit-text-fill-color: #D1D5DB !important;
                 opacity: 1 !important;
               }
               .business-setup-form .ant-select input.ant-select-input::placeholder,
               .business-setup-form .ant-select input.ant-select-input::-webkit-input-placeholder {
                 color: #D1D5DB !important;
                 -webkit-text-fill-color: #D1D5DB !important;
               }
               .business-setup-form .ant-select:not(.ant-select-disabled),
               .business-setup-form .ant-select:not(.ant-select-disabled) .ant-select-content,
               .business-setup-form .ant-select:not(.ant-select-disabled) .ant-select-content-value,
               .business-setup-form .ant-select:not(.ant-select-disabled) .ant-select-input,
               .business-setup-form .ant-select:not(.ant-select-disabled) .ant-select-suffix,
               .business-setup-form .ant-select-multiple .ant-select-selector {
                 cursor: pointer !important;
               }
               .business-setup-form .ant-select-suffix,
               .business-setup-form .ant-select .ant-select-suffix,
               .business-setup-form .ant-select-arrow,
               .business-setup-form .ant-select .anticon,
               .business-setup-form .ant-select-suffix .anticon,
               .business-setup-form .ant-select-suffix svg {
                 color: #F9FAFB !important;
                 fill: currentColor !important;
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

               .business-setup-dark-dropdown {
                 --rc-virtual-list-scrollbar-bg: #6B7280;
               }

               .business-setup-dark-dropdown .rc-virtual-list-scrollbar-thumb {
                 background: #6B7280 !important;
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
              className={`global-form ${darkMode ? 'business-setup-form' : ''}`.trim()}
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
      </ThemedModal>
    </>
  )
}

export default BusinessSetupModal
