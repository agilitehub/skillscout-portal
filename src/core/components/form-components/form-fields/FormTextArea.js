import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import './styles.css'

const { TextArea } = Input

/**
 * A reusable form textarea component that wraps Ant Design's Form.Item and Input.TextArea
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the form field
 * @param {string} props.name - Name/identifier for the form field
 * @param {Array} props.rules - Validation rules for the form field
 * @param {string} props.placeholder - Placeholder text for the textarea
 * @param {number} props.rows - Number of rows for the textarea
 * @param {Object} props.textAreaProps - Additional props to pass to the Input.TextArea component
 * @param {Object} props.formItemProps - Additional props to pass to the Form.Item component
 * @returns {React.ReactElement} FormTextArea component
 */
const FormTextArea = ({
  label,
  name,
  rules = [],
  placeholder = '',
  rows = 4,
  textAreaProps = {},
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <Input.TextArea rows={rows} placeholder={placeholder} {...textAreaProps} />
    </Form.Item>
  )
}

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  textAreaProps: PropTypes.object,
  formItemProps: PropTypes.object
}

export default FormTextArea
