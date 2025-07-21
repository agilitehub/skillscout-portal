import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { useTheme } from '../../../context/ThemeContext'
import './styles.css'

const { TextArea } = Input

/**
 * Helper function to merge theme-aware styling with custom styling
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {Object} customStyle - Custom style object provided by user
 * @returns {Object} Merged style object
 */
const getThemeAwareStyle = (darkMode, customStyle = {}) => {
  const themeStyle = {
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    borderColor: darkMode ? '#6b7280' : '#d1d5db',
    color: darkMode ? '#ffffff' : '#111827',
    fontSize: '14px',
    ...customStyle // Custom styling overrides theme defaults
  }
  return themeStyle
}

/**
 * Helper function to get theme-aware class names for labels
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customLabelClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareLabelClasses = (darkMode, customLabelClasses = '') => {
  const defaultClasses = `font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`
  return `${defaultClasses} ${customLabelClasses}`.trim()
}

/**
 * Helper function to get theme-aware class names for textareas
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customTextAreaClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareTextAreaClasses = (darkMode, customTextAreaClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customTextAreaClasses}`.trim()
}

/**
 * A reusable form textarea component that wraps Ant Design's Form.Item and Input.TextArea
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the textarea
 * @param {number} props.rows - Number of rows for the textarea
 * @param {Object} props.textAreaProps - Additional props to pass to the Input.TextArea component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.textAreaClasses - Custom class names for the textarea
 * @returns {React.ReactElement} FormTextArea component
 */
const FormTextArea = ({
  label,
  name,
  rules = [],
  placeholder = '',
  rows = 4,
  textAreaProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  textAreaClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from textAreaProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...textAreaProps.style
  })

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const textAreaClassNames = getThemeAwareTextAreaClasses(darkMode, textAreaClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <Input.TextArea
        rows={rows}
        placeholder={placeholder}
        {...textAreaProps}
        className={`${textAreaClassNames} ${textAreaProps.className || ''}`.trim()}
        style={mergedStyle}
      />
    </Form.Item>
  )
}

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  textAreaProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  textAreaClasses: PropTypes.string
}

export default FormTextArea
