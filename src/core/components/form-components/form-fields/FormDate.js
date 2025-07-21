import React from 'react'
import PropTypes from 'prop-types'
import { Form, DatePicker } from 'antd'
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
 * Helper function to get theme-aware class names for date pickers
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customDateClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareDateClasses = (darkMode, customDateClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customDateClasses}`.trim()
}

/**
 * A reusable form date picker component that wraps Ant Design's Form.Item and DatePicker
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the date picker
 * @param {string} props.format - Date format string (e.g., 'YYYY-MM-DD')
 * @param {boolean} props.showTime - Whether to show time picker
 * @param {Object} props.dateProps - Additional props to pass to the DatePicker component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {string} props.className - Additional class names for the date picker
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.dateClasses - Custom class names for the date picker
 * @returns {React.ReactElement} FormDate component
 */
const FormDate = ({
  label,
  name,
  rules = [],
  placeholder = 'Select date',
  format = 'YYYY-MM-DD',
  showTime = false,
  className = '',
  dateProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  dateClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from dateProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...dateProps.style
  })

  // Apply dark mode specific popup styling
  const popupStyle = {
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    borderColor: darkMode ? '#6b7280' : '#d1d5db'
  }

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const dateClassNames = getThemeAwareDateClasses(darkMode, dateClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <DatePicker
        placeholder={placeholder}
        format={format}
        showTime={showTime}
        {...dateProps}
        className={`${className} ${dateClassNames} ${dateProps.className || ''} w-full`.trim()}
        style={mergedStyle}
        popupStyle={popupStyle}
      />
    </Form.Item>
  )
}

FormDate.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  format: PropTypes.string,
  showTime: PropTypes.bool,
  className: PropTypes.string,
  dateProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  dateClasses: PropTypes.string
}

export default FormDate
