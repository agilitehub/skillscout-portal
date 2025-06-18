import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd'
import { useTheme } from '../../../../ui/ThemeContext'

/**
 * FormContent component for the main content area of forms
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The form content/children
 * @param {Array} props.tabs - Array of tab objects for tabbed content
 * @param {string} props.tabs[].key - Unique key for the tab
 * @param {string} props.tabs[].label - Display label for the tab
 * @param {React.ReactNode} props.tabs[].content - Content for the tab
 * @param {string} props.activeTabKey - Currently active tab key
 * @param {Function} props.onTabChange - Function to call when tab changes
 * @param {boolean} props.useTabs - Whether to display the content in tabs
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} FormContent component
 */
const FormContent = ({ children, tabs = [], activeTabKey, onTabChange, useTabs = false, className = '' }) => {
  const { darkMode } = useTheme()

  // If using tabs, render tabbed interface
  if (useTabs && tabs.length > 0) {
    return (
      <div className={`form-content ${className}`}>
        <Tabs
          activeKey={activeTabKey}
          onChange={onTabChange}
          type='card'
          className={darkMode ? 'dark-tabs' : ''}
          items={tabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
            children: (
              <div className={`py-4 ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>{tab.content}</div>
            )
          }))}
        />
      </div>
    )
  }

  // Otherwise, render standard content
  return (
    <div className={`form-content p-4 ${className} ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
      <Row gutter={[16, 16]}>
        <Col span={24}>{children}</Col>
      </Row>
    </div>
  )
}

FormContent.propTypes = {
  children: PropTypes.node,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired
    })
  ),
  activeTabKey: PropTypes.string,
  onTabChange: PropTypes.func,
  useTabs: PropTypes.bool,
  className: PropTypes.string
}

export default FormContent
