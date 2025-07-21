import React from 'react'
import PropTypes from 'prop-types'
import { Form, Switch } from 'antd'
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
 * Helper function to get theme-aware class names for switches
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} customSwitchClasses - Custom classes provided by user
 * @returns {string} Combined class names
 */
const getThemeAwareSwitchClasses = (darkMode, customSwitchClasses = '') => {
  const defaultClasses = darkMode ? 'dark-switch' : 'light-switch'
  return `${defaultClasses} ${customSwitchClasses}`.trim()
}

/**
 * A reusable form switch component that wraps Ant Design's Form.Item and Switch
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.checkedChildren - Text or element to show when switch is checked
 * @param {string} props.unCheckedChildren - Text or element to show when switch is unchecked
 * @param {boolean} props.defaultChecked - Default checked state
 * @param {Object} props.switchProps - Additional props to pass to the Switch component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {Object} props.customStyle - Custom styling to override theme defaults
 * @param {string} props.labelClasses - Custom class names for the label
 * @param {string} props.switchClasses - Custom class names for the switch
 * @returns {React.ReactElement} FormSwitch component
 */
const FormSwitch = ({
  label,
  name,
  rules = [],
  checkedChildren,
  unCheckedChildren,
  defaultChecked = false,
  switchProps = {},
  formItemProps = {},
  customStyle = {},
  labelClasses = '',
  switchClasses = ''
}) => {
  const { darkMode } = useTheme()

  // For switches, we'll apply theme-aware custom styling that works well with switch component
  const mergedStyle = {
    ...customStyle,
    ...switchProps.style
  }

  // Get theme-aware class names
  const labelClassNames = getThemeAwareLabelClasses(darkMode, labelClasses)
  const switchClassNames = getThemeAwareSwitchClasses(darkMode, switchClasses)

  // Create themed label component
  const themedLabel = label ? <span className={labelClassNames}>{label}</span> : undefined

  return (
    <Form.Item label={themedLabel} name={name} rules={rules} valuePropName='checked' {...formItemProps}>
      <Switch
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        defaultChecked={defaultChecked}
        {...switchProps}
        className={`${switchClassNames} ${switchProps.className || ''}`.trim()}
        style={mergedStyle}
      />
    </Form.Item>
  )
}

FormSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  checkedChildren: PropTypes.node,
  unCheckedChildren: PropTypes.node,
  defaultChecked: PropTypes.bool,
  switchProps: PropTypes.object,
  formItemProps: PropTypes.object,
  customStyle: PropTypes.object,
  labelClasses: PropTypes.string,
  switchClasses: PropTypes.string
}

export default FormSwitch
