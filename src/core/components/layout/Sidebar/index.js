// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faFileText,
  faClipboardCheck,
  faCogs,
  faList,
  faColumns,
  faUsers,
  faBuilding,
  faSliders,
  faCreditCard,
  faHome,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../context/ThemeContext'

/**
 * Business Dashboard Sidebar Navigation
 * Provides categorized navigation for job management, descriptions, and questionnaires
 */
const BusinessSidebar = React.memo(() => {
  const { darkMode } = useTheme()

  // Initialize settings expanded state from localStorage, default to false
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(() => {
    try {
      const savedState = localStorage.getItem('businessSidebar_settingsExpanded')
      return savedState ? JSON.parse(savedState) : false
    } catch (error) {
      console.warn('Error reading sidebar state from localStorage:', error)
      return false
    }
  })

  // Save settings expanded state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('businessSidebar_settingsExpanded', JSON.stringify(isSettingsExpanded))
    } catch (error) {
      console.warn('Error saving sidebar state to localStorage:', error)
    }
  }, [isSettingsExpanded])

  const toggleSettings = () => {
    setIsSettingsExpanded(!isSettingsExpanded)
  }

  // Main navigation items (without operations header)
  const mainNavigationItems = [
    {
      path: '/business-dashboard',
      icon: faHome,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/business-dashboard/candidates',
      icon: faColumns,
      label: 'Candidates',
      exact: false
    },
    {
      path: '/business-dashboard/job-listings',
      icon: faBriefcase,
      label: 'Job Listings',
      exact: false
    },
    {
      path: '/business-dashboard/questionnaires',
      icon: faClipboardCheck,
      label: 'Questionnaires',
      exact: false
    },
    {
      path: '/business-dashboard/job-descriptions',
      icon: faFileText,
      label: 'Job Descriptions',
      exact: false
    }
  ]

  // Settings category (collapsible)
  const settingsCategory = {
    key: 'settings',
    label: 'Settings',
    icon: faCogs,
    items: [
      {
        path: '/business-dashboard/user-management',
        icon: faUsers,
        label: 'User Management',
        exact: false
      },
      {
        path: '/business-dashboard/branch-management',
        icon: faBuilding,
        label: 'Branch Management',
        exact: false
      },
      {
        path: '/business-dashboard/org-settings',
        icon: faSliders,
        label: 'Organization Settings',
        exact: false
      },
      {
        path: '/business-dashboard/billing',
        icon: faCreditCard,
        label: 'Billing & Subscription',
        exact: false
      },
      {
        path: '/business-dashboard/lookups',
        icon: faList,
        label: 'Lookups',
        exact: false
      }
    ]
  }

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
        <div className='flex items-center'>
          <div
            className='w-8 h-8 rounded-lg flex items-center justify-center mr-3'
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, #059669, #047857)'
                : 'linear-gradient(135deg, #10b981, #059669)'
            }}
          >
            <FontAwesomeIcon icon={faBriefcase} className='text-white text-base' />
          </div>
          <div>
            <h2 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Business Hub</h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recruitment Tools</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className='p-4 space-y-3'>
        {/* Main Navigation Items */}
        <div className='space-y-1'>
          {mainNavigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
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
                      className={`text-base ${
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
                  {isActive && <div className='ml-auto w-2 h-2 bg-emerald-500 rounded-full'></div>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Settings Category */}
        <div className='space-y-1'>
          {/* Settings Header */}
          <div
            className={`w-full flex items-center px-3 py-2 rounded-lg text-base font-bold transition-all duration-200 cursor-pointer ${
              darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={toggleSettings}
          >
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 transition-all duration-200 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <FontAwesomeIcon
                icon={settingsCategory.icon}
                className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              />
            </div>
            <span className='flex-1 text-left'>{settingsCategory.label}</span>

            {/* Collapsible chevron */}
            <div className='ml-2'>
              <FontAwesomeIcon
                icon={isSettingsExpanded ? faChevronDown : faChevronRight}
                className={`text-sm transition-transform duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              />
            </div>
          </div>

          {/* Settings Items */}
          <div
            className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
              !isSettingsExpanded ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
            }`}
          >
            {settingsCategory.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
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
                        className={`text-base ${
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
                    {isActive && <div className='ml-auto w-2 h-2 bg-emerald-500 rounded-full'></div>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
})

BusinessSidebar.displayName = 'BusinessSidebar'

export default BusinessSidebar
