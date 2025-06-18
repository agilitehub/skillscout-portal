import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'antd'
import './styles.css'

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
 * @returns {React.ReactElement} FormSelect component
 */
const FormSelect = ({
  label,
  name,
  rules = [],
  placeholder = '',
  options = [],
  selectProps = {},
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <Select placeholder={placeholder} {...selectProps}>
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
  formItemProps: PropTypes.object
}

export default FormSelect
