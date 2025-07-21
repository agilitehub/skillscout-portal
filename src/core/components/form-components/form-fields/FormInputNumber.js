import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber } from 'antd'
import './styles.css'

/**
 * A reusable form number input component that wraps Ant Design's Form.Item and InputNumber
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the number input
 * @param {number} props.min - Minimum value allowed
 * @param {number} props.max - Maximum value allowed
 * @param {number} props.step - The number to increment/decrement by
 * @param {number} props.precision - Number of decimal places
 * @param {Object} props.numberProps - Additional props to pass to the InputNumber component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @param {string} props.className - Additional class names for the number input
 * @returns {React.ReactElement} FormInputNumber component
 */
const FormInputNumber = ({
  label,
  name,
  rules = [],
  placeholder = '',
  min,
  max,
  step,
  precision,
  className = '',
  numberProps = {},
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <InputNumber
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        precision={precision}
        className={`${className} w-full`}
        {...numberProps}
      />
    </Form.Item>
  )
}

FormInputNumber.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  precision: PropTypes.number,
  className: PropTypes.string,
  numberProps: PropTypes.object,
  formItemProps: PropTypes.object
}

export default FormInputNumber
