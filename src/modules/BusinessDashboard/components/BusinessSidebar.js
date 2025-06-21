// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBriefcase, 
  faFileText, 
  faClipboardCheck,
  faTachometerAlt 
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

/**
 * Business Dashboard Sidebar Navigation
 * Provides navigation for job management, descriptions, and assessments
 */
const BusinessSidebar = React.memo(() => {
  const { darkMode } = useTheme()

  // Navigation items for business dashboard
  const navigationItems = [
    {
      path: '/business-dashboard',
      icon: faTachometerAlt,
      label: 'Overview',
      exact: true
    },
    {
      path: '/business-dashboard/job-descriptions',
      icon: faFileText,
      label: 'Job Descriptions',
      exact: false
    },
    {
      path: '/business-dashboard/assessments',
      icon: faClipboardCheck,
      label: 'Assessments',
      exact: false
    }
  ]

  return (
    <div 
      className={`w-64 h-full fixed left-0 top-16 md:top-20 z-30 transition-all duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-r shadow-lg`}
      style={{
        background: darkMode 
          ? 'linear-gradient(180deg, #1f2937 0%, #111827 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
      }}
    >
      {/* Sidebar Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, #059669, #047857)' 
                : 'linear-gradient(135deg, #10b981, #059669)'
            }}
          >
            <FontAwesomeIcon icon={faBriefcase} className="text-white text-sm" />
          </div>
          <div>
            <h2 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Business Hub
            </h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Recruitment Tools
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? darkMode
                    ? 'bg-emerald-700 text-white shadow-lg'
                    : 'bg-emerald-50 text-emerald-700 shadow-md border-l-4 border-emerald-500'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div 
                  className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 transition-all duration-200 ${
                    isActive
                      ? darkMode
                        ? 'bg-emerald-600'
                        : 'bg-emerald-100'
                      : darkMode
                        ? 'bg-gray-800'
                        : 'bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`text-xs ${
                      isActive
                        ? darkMode
                          ? 'text-white'
                          : 'text-emerald-700'
                        : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`} 
                  />
                </div>
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className={`mx-4 mt-6 p-3 rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } border`}>
        <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Active Jobs
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              4
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Applicants
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              172
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

BusinessSidebar.displayName = 'BusinessSidebar'

export default BusinessSidebar 