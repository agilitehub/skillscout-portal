// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../context/ThemeContext'
import { BUSINESS_SIDEBAR_MAIN_ITEMS, BUSINESS_SIDEBAR_SETTINGS_CATEGORY } from '../../config/navigation'
import { LOCAL_STORAGE_KEYS } from '../../../constants'

/**
 * Business dashboard left sidebar — core shell navigation for authenticated business routes.
 */
const BusinessSidebar = React.memo(() => {
  const { darkMode } = useTheme()

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEYS.BUSINESS_SIDEBAR_SETTINGS_EXPANDED)
      return savedState ? JSON.parse(savedState) : false
    } catch (error) {
      console.warn('Error reading sidebar state from localStorage:', error)
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BUSINESS_SIDEBAR_SETTINGS_EXPANDED, JSON.stringify(isSettingsExpanded))
    } catch (error) {
      console.warn('Error saving sidebar state to localStorage:', error)
    }
  }, [isSettingsExpanded])

  const toggleSettings = () => {
    setIsSettingsExpanded(!isSettingsExpanded)
  }

  const mainNavigationItems = BUSINESS_SIDEBAR_MAIN_ITEMS
  const settingsCategory = BUSINESS_SIDEBAR_SETTINGS_CATEGORY

  return (
    <div
      className={`h-full z-30 transition-all duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } shadow-lg`}
      style={{
        background: darkMode
          ? 'linear-gradient(180deg, #1f2937 0%, #111827 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
      }}
    >
      <div className={`pl-4 pt-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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

      <nav className='p-4 space-y-2'>
        <div className='space-y-1'>
          {mainNavigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

        <div className='space-y-1'>
          <div
            className={`w-full flex items-center px-2 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
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

            <div className='ml-2'>
              <FontAwesomeIcon
                icon={isSettingsExpanded ? faChevronDown : faChevronRight}
                className={`text-sm transition-transform duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              />
            </div>
          </div>

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
                  `flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
