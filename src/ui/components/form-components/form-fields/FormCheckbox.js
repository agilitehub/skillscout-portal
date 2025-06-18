import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox } from 'antd'
import './styles.css'

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
 * @returns {React.ReactElement} FormCheckbox component
 */
const FormCheckbox = ({
  label,
  name,
  rules = [],
  options = [],
  className = '',
  checkboxProps = {},
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <Checkbox.Group className={className} {...checkboxProps}>
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
  formItemProps: PropTypes.object
}

export default FormCheckbox
