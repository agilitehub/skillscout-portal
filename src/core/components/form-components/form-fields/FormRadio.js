import React from 'react'
import PropTypes from 'prop-types'
import { Form, Radio } from 'antd'
import './styles.css'

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
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      <Radio.Group buttonStyle={buttonStyle} optionType={optionType} {...radioProps}>
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
  formItemProps: PropTypes.object
}

export default FormRadio
