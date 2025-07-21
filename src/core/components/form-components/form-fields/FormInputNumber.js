import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber } from 'antd'
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
 * Helper function to get theme-aware class names for number inputs
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customNumberClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareNumberClasses = (darkMode, customNumberClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customNumberClasses}`.trim()
}

/**
 * A reusable form number input component that wraps Ant Design's Form.Item and InputNumber
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the number input
 * @param {number} props.min - Minimum value allowed
 * @param {number} props.max - Maximum value allowed
 * @param {number} props.step - The number to increment/decrement by
 * @param {number} props.precision - Number of decimal places
 * @param {Object} props.numberProps - Additional props to pass to the InputNumber component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {string} props.className - Additional class names for the number input
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.numberClasses - Custom class names for the number input
 * @returns {React.ReactElement} FormInputNumber component
 */
const FormInputNumber = ({
  label,
  name,
  rules = [],
  placeholder = '',
  min,
  max,
  step,
  precision,
  className = '',
  numberProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  numberClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from numberProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...numberProps.style
  })

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const numberClassNames = getThemeAwareNumberClasses(darkMode, numberClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <InputNumber
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        precision={precision}
        {...numberProps}
        className={`${className} ${numberClassNames} ${numberProps.className || ''} w-full`.trim()}
        style={mergedStyle}
      />
    </Form.Item>
  )
}

FormInputNumber.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  precision: PropTypes.number,
  className: PropTypes.string,
  numberProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  numberClasses: PropTypes.string
}

export default FormInputNumber
