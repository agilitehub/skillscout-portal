// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import BusinessSidebar from './Sidebar'
import Header from './Header'

/**
 * Business Dashboard Layout Component
 * Provides consistent layout structure for all business dashboard pages
 * Includes header, sidebar, and main content area
 */
const BusinessDashboardLayout = React.memo(({ children, user }) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      {/* Header */}
      <Header user={user} />

      {/* Main Layout Container */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <BusinessSidebar />

        {/* Main Content Area */}
        <div className='flex-1 ml-64 overflow-y-auto relative'>
          {/* Background overlay for content area */}
          <div
            className={`fixed inset-0 ml-64 ${
              darkMode
                ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-emerald-800/40'
                : 'bg-gradient-to-b from-transparent via-sky-100/40 to-emerald-100/50'
            } pointer-events-none`}
          />

          {/* Content */}
          <div className='relative z-10'>{children}</div>
        </div>
      </div>
    </div>
  )
})

BusinessDashboardLayout.displayName = 'BusinessDashboardLayout'

export default BusinessDashboardLayout
