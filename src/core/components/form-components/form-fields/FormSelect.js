import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'antd'
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
 * Helper function to get theme-aware class names for selects
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customSelectClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareSelectClasses = (darkMode, customSelectClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customSelectClasses}`.trim()
}

/**
 * A reusable form select component that wraps Ant Design's Form.Item and Select
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the select
 * @param {Array} props.options - Array of options for the select
 * @param {Object} props.selectProps - Additional props to pass to the Select component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.selectClasses - Custom class names for the select
 * @returns {React.ReactElement} FormSelect component
 */
const FormSelect = ({
  label,
  name,
  rules = [],
  placeholder = '',
  options = [],
  selectProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  selectClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from selectProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...selectProps.style
  })

  // Apply dark mode specific dropdown styling
  const dropdownStyle = {
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    borderColor: darkMode ? '#6b7280' : '#d1d5db'
  }

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const selectClassNames = getThemeAwareSelectClasses(darkMode, selectClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <Select
        placeholder={placeholder}
        {...selectProps}
        className={`${selectClassNames} ${selectProps.className || ''}`.trim()}
        style={mergedStyle}
        dropdownStyle={dropdownStyle}
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

FormSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  selectProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  selectClasses: PropTypes.string
}

export default FormSelect
