import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import './styles.css'

/**
 * A reusable form input component that wraps Ant Design's Form.Item and Input
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {Object} props.inputProps - Additional props to pass to the Input component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @returns {React.ReactElement} FormInput component
 */
const FormInput = ({ label, name, rules = [], placeholder = '', inputProps = {}, formItemProps = {} }) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <Input placeholder={placeholder} {...inputProps} />
    </Form.Item>
  )
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
  formItemProps: PropTypes.object
}

export default FormInput
