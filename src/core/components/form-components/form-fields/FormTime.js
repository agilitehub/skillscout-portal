import React from 'react'
import PropTypes from 'prop-types'
import { Form, TimePicker } from 'antd'
import './styles.css'

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
  formItemProps = {}
}) => {
  const TimeComponent = isRange ? TimePicker.RangePicker : TimePicker

  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <TimeComponent
        placeholder={placeholder}
        format={format}
        use12Hours={use12Hours}
        className={`${className} w-full`}
        {...timeProps}
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
  formItemProps: PropTypes.object
}

export default FormTime
