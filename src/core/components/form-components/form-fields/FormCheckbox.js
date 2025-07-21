import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox } from 'antd'
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
 * Helper function to get theme-aware class names for checkbox groups
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customCheckboxClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareCheckboxClasses = (darkMode, customCheckboxClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customCheckboxClasses}`.trim()
}

/**
 * A reusable form checkbox group component that wraps Ant Design's Form.Item and Checkbox.Group
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {Array} props.options - Array of options for the checkbox group
 * @param {Object} props.checkboxProps - Additional props to pass to the Checkbox.Group component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {string} props.className - Additional class names for the checkbox group container
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.checkboxClasses - Custom class names for the checkbox group
 * @returns {React.ReactElement} FormCheckbox component
 */
const FormCheckbox = ({
  label,
  name,
  rules = [],
  options = [],
  className = '',
  checkboxProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  checkboxClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from checkboxProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...checkboxProps.style
  })

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const checkboxClassNames = getThemeAwareCheckboxClasses(darkMode, checkboxClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <Checkbox.Group
        {...checkboxProps}
        className={`${className} ${checkboxClassNames} ${checkboxProps.className || ''}`.trim()}
        style={mergedStyle}
      >
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Form.Item>
  )
}

FormCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  className: PropTypes.string,
  checkboxProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  checkboxClasses: PropTypes.string
}

export default FormCheckbox
