import React from 'react'
import PropTypes from 'prop-types'
import { Form, TimePicker } from 'antd'
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
 * Helper function to get theme-aware class names for time pickers
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customTimeClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareTimeClasses = (darkMode, customTimeClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customTimeClasses}`.trim()
}

/**
 * A reusable form time picker component that wraps Ant Design's Form.Item and TimePicker
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the time picker
 * @param {string} props.format - Time format string (e.g., 'HH:mm')
 * @param {boolean} props.use12Hours - Whether to use 12-hour format
 * @param {boolean} props.isRange - Whether to use RangePicker
 * @param {Object} props.timeProps - Additional props to pass to the TimePicker component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {string} props.className - Additional class names for the time picker
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.timeClasses - Custom class names for the time picker
 * @returns {React.ReactElement} FormTime component
 */
const FormTime = ({
  label,
  name,
  rules = [],
  placeholder = 'Select time',
  format = 'HH:mm',
  use12Hours = false,
  isRange = false,
  className = '',
  timeProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  timeClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from timeProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...timeProps.style
  })

  // Apply dark mode specific popup styling
  const popupStyle = {
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    borderColor: darkMode ? '#6b7280' : '#d1d5db'
  }

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const timeClassNames = getThemeAwareTimeClasses(darkMode, timeClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  const TimeComponent = isRange ? TimePicker.RangePicker : TimePicker

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <TimeComponent
        placeholder={placeholder}
        format={format}
        use12Hours={use12Hours}
        {...timeProps}
        className={`${className} ${timeClassNames} ${timeProps.className || ''} w-full`.trim()}
        style={mergedStyle}
        popupStyle={popupStyle}
      />
    </Form.Item>
  )
}

FormTime.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  format: PropTypes.string,
  use12Hours: PropTypes.bool,
  isRange: PropTypes.bool,
  className: PropTypes.string,
  timeProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  timeClasses: PropTypes.string
}

export default FormTime
