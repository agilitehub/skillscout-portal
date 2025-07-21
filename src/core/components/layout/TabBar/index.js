import React from 'react'
import { useTabs } from '../../../ui/TabContext'
import ReusableTabBar from '../../../core/components/tab-bar/TabBar'

/**
 * TabBar component that displays the currently open tabs in the application
 * Uses the reusable TabBar component with navigation-specific configuration
 */
const TabBar = () => {
  const { openTabs, activeTab, switchToTab, closeTab, closeAllTabs } = useTabs()

  // Map our tabs data to the format expected by the reusable component
  const tabItems = openTabs.map((tab) => ({
    key: tab.path,
    title: tab.title,
    closeable: tab.closeable
  }))

  return (
    <ReusableTabBar
      items={tabItems}
      activeKey={activeTab}
      onChange={switchToTab}
      onClose={(path, e) => closeTab(path, e)}
      onCloseAll={closeAllTabs}
      showCloseAll={true}
      renderTabContent={false}
    />
  )
}

export default TabBar
