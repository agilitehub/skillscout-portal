import React from 'react'
import { Tabs, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './styles.css'

/**
 * Reusable TabBar component that can be used for both navigation and form-based tabs
 *
 * @param {Object} props Component props
 * @param {Array} props.items Array of tab items with { key, title, closeable, content } properties
 * @param {string} props.activeKey Key of the currently active tab
 * @param {function} props.onChange Callback when tab is changed, receives key of new tab
 * @param {function} props.onClose Callback when tab is closed, receives key of closed tab and event
 * @param {function} props.onCloseAll Callback when all tabs are closed
 * @param {boolean} props.showCloseAll Whether to show the "Close All" button (default: false)
 * @param {boolean} props.renderTabContent Whether to render tab content inside the component (default: false)
 * @param {boolean} props.showTabs Whether to show tab navigation (default: true)
 * @param {string} props.containerClassName Additional class name for the container
 * @param {Object} props.tabBarExtraContent Content to render on the right side of the tab bar
 *
 * @returns {React.ReactElement} Reusable TabBar component
 */
const TabBar = ({
  items = [],
  activeKey,
  onChange,
  onClose,
  onCloseAll,
  showCloseAll = false,
  renderTabContent = false,
  showTabs = true,
  containerClassName = '',
  tabBarExtraContent = null
}) => {
  // Handle tab close with stopPropagation to prevent tab activation
  const handleTabClose = (key, e) => {
    if (e) {
      e.stopPropagation()
    }
    if (onClose) {
      onClose(key, e)
    }
  }

  // Transform the items into the format expected by Ant Design Tabs
  const tabItems = items.map((item) => ({
    key: item.key,
    label: (
      <div className='flex items-center h-full'>
        <span className='font-medium text-sm truncate max-w-[150px]'>{item.title}</span>
        {item.closeable && (
          <button
            onClick={(e) => handleTabClose(item.key, e)}
            className='ml-2 text-secondary hover:text-secondary-dark dark:text-agilite-grey dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-secondary p-1 h-5 w-5 flex items-center justify-center'
            aria-label={`Close ${item.title} tab`}
          >
            <FontAwesomeIcon icon={faTimes} className='text-xs' />
          </button>
        )}
      </div>
    ),
    children: renderTabContent ? item.content : null
  }))

  // Prepare the Close All button to add to tabBarExtraContent
  const closeAllButton = showCloseAll && onCloseAll && (
    <Button
      onClick={onCloseAll}
      size='small'
      type='text'
      className='close-all-btn flex items-center px-3 py-1 mx-3 text-xs font-medium text-secondary dark:text-agilite-grey-light hover:text-primary dark:hover:text-primary self-center'
      icon={<FontAwesomeIcon icon={faTimesCircle} className='mr-1' />}
      title='Close all tabs except first tab'
    >
      Close All
    </Button>
  )

  // Combine custom tabBarExtraContent with closeAllButton
  const combinedExtraContent = (
    <div className='flex items-center'>
      {closeAllButton}
      {tabBarExtraContent}
    </div>
  )

  return (
    <div className={`tab-bar-container border-b border-gray-200 dark:border-gray-700 ${containerClassName}`}>
      {showTabs && (
        <Tabs
          activeKey={activeKey}
          onChange={onChange}
          items={tabItems}
          className='flex-1 antd-tabs-custom'
          tabBarStyle={{ margin: 0, padding: 0 }}
          tabBarGutter={1}
          styles={{
            nav: {
              marginBottom: 0,
              overflow: 'visible'
            },
            tabPane: {
              padding: renderTabContent ? '16px 0' : 0,
              overflow: 'hidden'
            }
          }}
          destroyInactiveTabPane={true}
          tabBarExtraContent={combinedExtraContent}
        />
      )}
    </div>
  )
}

export default TabBar
