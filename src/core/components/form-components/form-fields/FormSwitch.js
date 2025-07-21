import React from 'react'
import PropTypes from 'prop-types'
import { Form, Switch } from 'antd'
import './styles.css'

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
  formItemProps = {}
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} valuePropName='checked' {...formItemProps}>
      <Switch
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        defaultChecked={defaultChecked}
        {...switchProps}
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
  formItemProps: PropTypes.object
}

export default FormSwitch
