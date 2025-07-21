import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { useTheme } from '../../../../ui/ThemeContext'

/**
 * FormLayout component to standardize form layout across the application
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.content - The main content component for the form
 * @param {React.ReactNode} props.sidebar - The sidebar component for the form
 * @param {string} props.className - Additional CSS classes to apply to the form
 * @returns {React.ReactElement} FormLayout component
 */
const FormLayout = ({ content, sidebar, className = '' }) => {
  const { darkMode } = useTheme()

  return (
    <div className={`form-layout max-w-7xl mx-auto ${darkMode ? 'dark' : ''} ${className}`}>
      <Row gutter={[16, 16]} className='form-content'>
        <Col xs={24} lg={16}>
          {content}
        </Col>
        {sidebar && (
          <Col xs={24} lg={8}>
            {sidebar}
          </Col>
        )}
      </Row>
    </div>
  )
}

FormLayout.propTypes = {
  content: PropTypes.node.isRequired,
  sidebar: PropTypes.node,
  className: PropTypes.string
}

export default FormLayout
