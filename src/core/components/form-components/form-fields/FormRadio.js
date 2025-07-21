import React from 'react'
import PropTypes from 'prop-types'
import { Form, Radio } from 'antd'
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
 * Helper function to get theme-aware class names for radio groups
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customRadioClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareRadioClasses = (darkMode, customRadioClasses = '') => {
  const defaultClasses = darkMode ? 'dark-input' : 'light-input'
  return `${defaultClasses} ${customRadioClasses}`.trim()
}

/**
 * A reusable form radio component that wraps Ant Design's Form.Item and Radio.Group
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {Array} props.options - Array of options for the radio group
 * @param {string} props.buttonStyle - Style of radio buttons ('outline' or 'solid')
 * @param {boolean} props.optionType - Type of radio options ('default' or 'button')
 * @param {Object} props.radioProps - Additional props to pass to the Radio.Group component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.radioClasses - Custom class names for the radio group
 * @returns {React.ReactElement} FormRadio component
 */
const FormRadio = ({
  label,
  name,
  rules = [],
  options = [],
  buttonStyle = 'outline',
  optionType = 'default',
  radioProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  radioClasses = ''
}) => {
  const { darkMode } = useTheme()

  // Merge theme-aware styling with any existing style from radioProps
  const mergedStyle = getThemeAwareStyle(darkMode, {
    ...customStyle,
    ...radioProps.style
  })

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const radioClassNames = getThemeAwareRadioClasses(darkMode, radioClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} {...formItemProps}>
      <Radio.Group
        buttonStyle={buttonStyle}
        optionType={optionType}
        {...radioProps}
        className={`${radioClassNames} ${radioProps.className || ''}`.trim()}
        style={mergedStyle}
      >
        {options.map((option) =>
          optionType === 'button' ? (
            <Radio.Button key={option.value} value={option.value}>
              {option.label}
            </Radio.Button>
          ) : (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          )
        )}
      </Radio.Group>
    </Form.Item>
  )
}

FormRadio.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  buttonStyle: PropTypes.oneOf(['outline', 'solid']),
  optionType: PropTypes.oneOf(['default', 'button']),
  radioProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  radioClasses: PropTypes.string
}

export default FormRadio
