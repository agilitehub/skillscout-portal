// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Form } from 'antd'
import { useTheme } from '../../context/ThemeContext'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../theme/colors'

/**
 * Enhanced Form Component
 * Provides consistent styling and dark mode support for all forms
 * Wraps Ant Design Form with standardized theming
 */
const EnhancedForm = React.memo(({ 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  const { darkMode } = useTheme()

  return (
    <>
      {/* Enhanced Form Styles */}
      <style jsx global>{`
        /* Enhanced Form Styling */
        .enhanced-form .ant-form-item-label > label {
          font-weight: 600;
          font-size: 0.875rem;
          ${darkMode ? `
            color: #E5E7EB !important;
          ` : `
            color: #374151 !important;
          `}
        }
        
        .enhanced-form .ant-form-item-label > label.ant-form-item-required::before {
          color: #EF4444 !important;
        }
        
        .enhanced-form .ant-form-item-extra {
          font-size: 0.75rem;
          ${darkMode ? `
            color: #9CA3AF !important;
          ` : `
            color: #6B7280 !important;
          `}
        }
        
        /* Input Fields */
        .enhanced-form .ant-input,
        .enhanced-form input.ant-input {
          border-radius: 8px !important;
          border-width: 2px !important;
          font-size: 0.875rem !important;
          padding: 12px 16px !important;
          transition: all 0.2s ease !important;
          ${darkMode ? `
            background-color: #374151 !important;
            border-color: #4B5563 !important;
            color: #F9FAFB !important;
          ` : `
            background-color: #FFFFFF !important;
            border-color: #D1D5DB !important;
            color: #111827 !important;
          `}
        }
        
        .enhanced-form .ant-input:hover,
        .enhanced-form input.ant-input:hover {
          ${darkMode ? `
            border-color: #6B7280 !important;
          ` : `
            border-color: #9CA3AF !important;
          `}
        }
        
        .enhanced-form .ant-input:focus,
        .enhanced-form input.ant-input:focus {
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
          ${darkMode ? `
            background-color: #374151 !important;
            color: #F9FAFB !important;
          ` : `
            background-color: #FFFFFF !important;
            color: #111827 !important;
          `}
        }
        
        .enhanced-form .ant-input::placeholder {
          ${darkMode ? `
            color: #9CA3AF !important;
          ` : `
            color: #6B7280 !important;
          `}
        }
        
        /* Textarea */
        .enhanced-form textarea.ant-input {
          border-radius: 8px !important;
          border-width: 2px !important;
          font-size: 0.875rem !important;
          padding: 12px 16px !important;
          transition: all 0.2s ease !important;
          ${darkMode ? `
            background-color: #374151 !important;
            border-color: #4B5563 !important;
            color: #F9FAFB !important;
          ` : `
            background-color: #FFFFFF !important;
            border-color: #D1D5DB !important;
            color: #111827 !important;
          `}
        }
        
        .enhanced-form textarea.ant-input:focus {
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
        }
        
        /* Select */
        .enhanced-form .ant-select-selector {
          border-radius: 8px !important;
          border-width: 2px !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
          ${darkMode ? `
            background-color: #374151 !important;
            border-color: #4B5563 !important;
            color: #F9FAFB !important;
          ` : `
            background-color: #FFFFFF !important;
            border-color: #D1D5DB !important;
            color: #111827 !important;
          `}
        }
        
        .enhanced-form .ant-select:hover .ant-select-selector {
          ${darkMode ? `
            border-color: #6B7280 !important;
          ` : `
            border-color: #9CA3AF !important;
          `}
        }
        
        .enhanced-form .ant-select-focused .ant-select-selector {
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
        }
        
        .enhanced-form .ant-select-selection-placeholder {
          ${darkMode ? `
            color: #9CA3AF !important;
          ` : `
            color: #6B7280 !important;
          `}
        }
        
        .enhanced-form .ant-select-selection-item {
          ${darkMode ? `
            color: #F9FAFB !important;
          ` : `
            color: #111827 !important;
          `}
        }
        
        .enhanced-form .ant-select-arrow {
          ${darkMode ? `
            color: #9CA3AF !important;
          ` : `
            color: #6B7280 !important;
          `}
        }
        
        /* Multi-select tags */
        .enhanced-form .ant-select-multiple .ant-select-selection-item {
          border-radius: 6px !important;
          padding: 2px 8px !important;
          font-size: 0.75rem !important;
          ${darkMode ? `
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #E5E7EB !important;
          ` : `
            background-color: #F3F4F6 !important;
            border-color: #D1D5DB !important;
            color: #374151 !important;
          `}
        }
        
        /* Switch */
        .enhanced-form .ant-switch {
          ${darkMode ? `
            background-color: #4B5563 !important;
          ` : `
            background-color: #D1D5DB !important;
          `}
        }
        
        .enhanced-form .ant-switch-checked {
          background-color: #059669 !important;
        }
        
        /* Form validation */
        .enhanced-form .ant-form-item-explain-error {
          color: #EF4444 !important;
          font-size: 0.75rem !important;
          margin-top: 4px !important;
          font-weight: 500 !important;
        }
        
        .enhanced-form .ant-form-item-has-error .ant-input,
        .enhanced-form .ant-form-item-has-error .ant-select-selector {
          border-color: #EF4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .enhanced-form .ant-form-item-has-success .ant-input,
        .enhanced-form .ant-form-item-has-success .ant-select-selector {
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
        }
        
        /* Character count */
        .enhanced-form .ant-input-data-count {
          font-size: 0.75rem !important;
          ${darkMode ? `
            color: #9CA3AF !important;
          ` : `
            color: #6B7280 !important;
          `}
        }
        
        /* Input groups and affixes */
        .enhanced-form .ant-input-affix-wrapper {
          border-radius: 8px !important;
          border-width: 2px !important;
          ${darkMode ? `
            background-color: #374151 !important;
            border-color: #4B5563 !important;
          ` : `
            background-color: #FFFFFF !important;
            border-color: #D1D5DB !important;
          `}
        }
        
        .enhanced-form .ant-input-affix-wrapper:focus-within {
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
        }
        
        .enhanced-form .ant-input-prefix,
        .enhanced-form .ant-input-suffix {
          ${darkMode ? `
            color: #9CA3AF !important;
          ` : `
            color: #6B7280 !important;
          `}
        }
        
        /* Form sections */
        .enhanced-form .form-section {
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          ${darkMode ? `
            background-color: #1F2937;
            border: 1px solid #374151;
          ` : `
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          `}
        }
        
        .enhanced-form .form-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid;
          ${darkMode ? `
            color: #E5E7EB;
            border-color: #374151;
          ` : `
            color: #374151;
            border-color: #E5E7EB;
          `}
        }
      `}</style>

      <Form
        className={`enhanced-form ${className}`}
        style={style}
        {...props}
      >
        {children}
      </Form>
    </>
  )
})

EnhancedForm.displayName = 'EnhancedForm'

export default EnhancedForm 