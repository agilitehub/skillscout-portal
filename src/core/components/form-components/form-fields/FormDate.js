import React from 'react'
import PropTypes from 'prop-types'
import { Form, DatePicker } from 'antd'
import './styles.css'

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
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <DatePicker
        placeholder={placeholder}
        format={format}
        showTime={showTime}
        className={`${className} w-full`}
        {...dateProps}
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
  formItemProps: PropTypes.object
}

export default FormDate
