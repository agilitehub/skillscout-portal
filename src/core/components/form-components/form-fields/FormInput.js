import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { useTheme } from '../../../context/ThemeContext'
import './styles.css'

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
 * Helper function to get theme-aware class names for inputs
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customInputClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareInputClasses = (darkMode, customInputClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customInputClasses}`.trim()
}

/**
 * A reusable form input component that wraps Ant Design's Form.Item and Input
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {Object} props.inputProps - Additional props to pass to the Input component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.inputClasses - Custom class names for the input
 * @returns {React.ReactElement} FormInput component
 */
const FormInput = ({
  label,
  name,
  rules = [],
  placeholder = '',
  inputProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  inputClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from inputProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...inputProps.style
  })

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const inputClassNames = getThemeAwareInputClasses(darkMode, inputClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <Input
        placeholder={placeholder}
        {...inputProps}
        className={`${inputClassNames} ${inputProps.className || ''}`.trim()}
        style={mergedStyle}
      />
    </Form.Item>
  )
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  inputClasses: PropTypes.string
}

export default FormInput
