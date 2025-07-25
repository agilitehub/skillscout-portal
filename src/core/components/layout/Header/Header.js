// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../Logo'
import ThemeToggle from '../../../theme/components/ThemeToggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignOut,
  faUser,
  faBuilding,
  faUserTie,
  faChevronDown,
  faSearch,
  faTimes,
  faQuestionCircle,
  faBriefcase,
  faFile,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Modal, Form, Input, message } from 'antd'
import { Button } from '../../index'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import { BRAND_COLORS } from '../../../theme/colors'
import {
  searchWithFallback,
  getSearchSuggestions,
  saveToRecentSearches,
  clearRecentSearches,
  highlightText
} from '../../../lib/search-controller'

/**
 * Simplified Header component for the application
 */
const Header = ({ user }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [selectedDashboard, setSelectedDashboard] = useState('personal') // 'personal' or 'business'
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false)
  const [isBusinessSetupOpen, setIsBusinessSetupOpen] = useState(false)
  const [businessInfo, setBusinessInfo] = useState({ name: '', domain: '' })
  const [businessForm] = Form.useForm()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const { darkMode } = useTheme()
  const { logout } = useAuth()
  const searchTimeoutRef = useRef(null)

  // Helper function to get icon from source table
  const getIconFromSourceTable = useCallback((sourceTable) => {
    const iconMap = {
      assessments: faUserTie,
      assessment_questions: faQuestionCircle,
      job_descriptions: faBuilding,
      job_opportunities: faBriefcase
    }
    return iconMap[sourceTable] || faFile
  }, [])

  // Update selected dashboard based on current route
  useEffect(() => {
    if (location.pathname === '/business-dashboard') {
      setSelectedDashboard('business')
    } else if (location.pathname === '/dashboard') {
      setSelectedDashboard('personal')
    }
  }, [location.pathname])

  // Handle logout click - show confirmation dialog
  const handleLogoutClick = useCallback(() => {
    setIsLogoutConfirmOpen(true)
  }, [])

  // Actual logout function using Supabase
  const handleLogout = useCallback(async () => {
    try {
      const result = await logout()
      setIsLogoutConfirmOpen(false)

      if (result.success) {
        navigate('/')
      } else {
        console.error('Logout failed:', result.error)
        // Still navigate to login page even if logout failed
        navigate('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLogoutConfirmOpen(false)
      // Still navigate to login page even if logout failed
      navigate('/')
    }
  }, [navigate, logout])

  // Check if business info is complete
  const isBusinessSetupComplete = useCallback(() => {
    return businessInfo.name && businessInfo.domain
  }, [businessInfo])

  // Handle dashboard switch
  const handleDashboardSwitch = useCallback(
    (dashboardType) => {
      setIsDashboardDropdownOpen(false) // Close dropdown after selection

      if (dashboardType === 'business') {
        // Check if business setup is complete
        if (!isBusinessSetupComplete()) {
          setIsBusinessSetupOpen(true)
          return
        }
        setSelectedDashboard(dashboardType)
        // Store dashboard preference in localStorage
        localStorage.setItem('skillscout_dashboard_type', dashboardType)
        navigate('/business-dashboard')
      } else {
        setSelectedDashboard(dashboardType)
        // Store dashboard preference in localStorage
        localStorage.setItem('skillscout_dashboard_type', dashboardType)
        navigate('/dashboard')
      }
    },
    [navigate, isBusinessSetupComplete]
  )

  // Handle business setup form submission
  const handleBusinessSetup = useCallback(
    async (values) => {
      try {
        // Here you would typically save to a backend/database
        // For now, we'll store in local state and localStorage
        const businessData = {
          name: values.businessName,
          domain: values.emailDomain
        }

        setBusinessInfo(businessData)
        localStorage.setItem('skillscout_business_info', JSON.stringify(businessData))

        message.success('Business information saved successfully!')
        setIsBusinessSetupOpen(false)
        setSelectedDashboard('business')
        // Store dashboard preference in localStorage
        localStorage.setItem('skillscout_dashboard_type', 'business')
        navigate('/business-dashboard')
      } catch (error) {
        console.error('Error saving business info:', error)
        message.error('Failed to save business information. Please try again.')
      }
    },
    [navigate]
  )

  // Handle business setup modal close
  const handleBusinessSetupClose = useCallback(() => {
    setIsBusinessSetupOpen(false)
    businessForm.resetFields()
  }, [businessForm])

  // Load business info from localStorage on mount
  useEffect(() => {
    const savedBusinessInfo = localStorage.getItem('skillscout_business_info')
    if (savedBusinessInfo) {
      try {
        const parsed = JSON.parse(savedBusinessInfo)
        setBusinessInfo(parsed)
      } catch (error) {
        console.error('Error parsing saved business info:', error)
      }
    }
  }, [])

  // Load saved dashboard preference on mount
  useEffect(() => {
    const savedDashboard = localStorage.getItem('skillscout_dashboard_type')
    if (savedDashboard) {
      setSelectedDashboard(savedDashboard)
    }
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    const savedRecentSearches = localStorage.getItem('skillscout_recent_searches')
    if (savedRecentSearches) {
      try {
        const parsed = JSON.parse(savedRecentSearches)
        setRecentSearches(parsed)
      } catch (error) {
        console.error('Error parsing saved recent searches:', error)
      }
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Save search to recent searches
  const saveToRecentSearchesLocal = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return

    setRecentSearches((prev) => {
      const updated = saveToRecentSearches(searchTerm, prev)
      return updated
    })
  }, [])

  // Handle search functionality with debouncing
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value
      setSearchQuery(value)

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      if (value.trim()) {
        // Debounce search for 300ms
        searchTimeoutRef.current = setTimeout(async () => {
          setIsSearchLoading(true)
          try {
            // Perform vector search with fallback
            const searchResults = await searchWithFallback(value, {
              matchThreshold: 0.8,
              matchCount: 20
            })

            if (searchResults.success) {
              // Transform results to include icons
              const transformedResults = searchResults.data.map((category) => ({
                ...category,
                items: category.items.map((item) => ({
                  ...item,
                  icon: getIconFromSourceTable(item.sourceTable)
                }))
              }))
              setSearchResults(transformedResults)
            } else {
              console.error('Search error:', searchResults.error)
              setSearchResults([])
            }
          } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
          } finally {
            setIsSearchLoading(false)
          }
        }, 1000)
      } else {
        // Show recent and popular searches when input is empty
        const suggestions = getSearchSuggestions(recentSearches)
        setSearchResults(suggestions)
        setIsSearchLoading(false)
      }
    },
    // eslint-disable-next-line
    [recentSearches]
  )

  const handleSearchClear = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchFocused(false)
  }, [])

  const clearRecentSearchesLocal = useCallback(() => {
    setRecentSearches([])
    clearRecentSearches()
    // Refresh suggestions
    if (isSearchFocused && !searchQuery.trim()) {
      handleSearchChange({ target: { value: '' } })
    }
  }, [isSearchFocused, searchQuery, handleSearchChange])

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true)
    // Show suggestions when focusing on empty search
    if (!searchQuery.trim()) {
      handleSearchChange({ target: { value: '' } })
    }
  }, [searchQuery, handleSearchChange])

  const handleSearchBlur = useCallback(() => {
    // Delay blur to allow clicking on results
    setTimeout(() => setIsSearchFocused(false), 200)
  }, [])

  const handleSearchResultClick = useCallback(
    (item) => {
      if (item.type === 'recent' || item.type === 'popular') {
        // Handle suggestion clicks
        setSearchQuery(item.title)
        saveToRecentSearchesLocal(item.title)
        // You can navigate or perform search with item.title
        console.log('Searching for:', item.title)
      } else {
        // Handle regular search result clicks
        console.log('Selected:', item)
        saveToRecentSearchesLocal(searchQuery)

        // Navigate based on source table
        if (item.sourceTable) {
          switch (item.sourceTable) {
            case 'assessments':
              navigate(`/business-dashboard/assessments/${item.id}`)
              break
            case 'job_descriptions':
              navigate(`/business-dashboard/job-descriptions/${item.id}`)
              break
            case 'job_opportunities':
              navigate(`/business-dashboard/job-listings/${item.id}`)
              break
            default:
              console.log('Unknown source table:', item.sourceTable)
          }
        }
      }
      handleSearchClear()
    },
    [searchQuery, saveToRecentSearchesLocal, handleSearchClear, navigate]
  )

  const handleSearchSubmit = useCallback(
    (e) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        saveToRecentSearchesLocal(searchQuery)
        console.log('Searching for:', searchQuery)
        setIsSearchFocused(false)
      }
    },
    [searchQuery, saveToRecentSearchesLocal]
  )

  // Dashboard dropdown component
  const renderDashboardDropdown = () => (
    <div
      className={`rounded-md overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} 
                     shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} min-w-[180px]`}
    >
      <button
        onClick={() => handleDashboardSwitch('personal')}
        className={`w-full py-3 px-4 text-left flex items-center text-sm transition-all duration-200
                   ${
                     selectedDashboard === 'personal'
                       ? darkMode
                         ? 'bg-emerald-700 text-white'
                         : 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                       : darkMode
                         ? 'text-white bg-gray-800 hover:bg-gray-700'
                         : 'text-gray-700 bg-white hover:bg-gray-50'
                   }`}
        onMouseEnter={(e) => {
          if (selectedDashboard !== 'personal') {
            if (darkMode) {
              e.target.style.backgroundColor = BRAND_COLORS.emeraldAccent
              e.target.style.color = 'white'
            } else {
              e.target.style.backgroundColor = BRAND_COLORS.seaGreen
              e.target.style.color = 'white'
            }
          }
        }}
        onMouseLeave={(e) => {
          if (selectedDashboard !== 'personal') {
            if (darkMode) {
              e.target.style.backgroundColor = '#374151' // gray-700
              e.target.style.color = 'white'
            } else {
              e.target.style.backgroundColor = 'white'
              e.target.style.color = '#374151' // gray-700
            }
          }
        }}
      >
        <FontAwesomeIcon icon={faUserTie} className='mr-3 w-4' />
        Personal Dashboard
        {selectedDashboard === 'personal' && <div className='ml-auto w-2 h-2 bg-emerald-500 rounded-full'></div>}
      </button>

      <button
        onClick={() => handleDashboardSwitch('business')}
        className={`w-full py-3 px-4 text-left flex items-center text-sm transition-all duration-200
                   ${
                     selectedDashboard === 'business'
                       ? darkMode
                         ? 'bg-emerald-700 text-white'
                         : 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                       : darkMode
                         ? 'text-white bg-gray-800 hover:bg-gray-700'
                         : 'text-gray-700 bg-white hover:bg-gray-50'
                   }`}
        onMouseEnter={(e) => {
          if (selectedDashboard !== 'business') {
            if (darkMode) {
              e.target.style.backgroundColor = BRAND_COLORS.emeraldAccent
              e.target.style.color = 'white'
            } else {
              e.target.style.backgroundColor = BRAND_COLORS.seaGreen
              e.target.style.color = 'white'
            }
          }
        }}
        onMouseLeave={(e) => {
          if (selectedDashboard !== 'business') {
            if (darkMode) {
              e.target.style.backgroundColor = '#374151' // gray-700
              e.target.style.color = 'white'
            } else {
              e.target.style.backgroundColor = 'white'
              e.target.style.color = '#374151' // gray-700
            }
          }
        }}
      >
        <FontAwesomeIcon icon={faBuilding} className='mr-3 w-4' />
        Business Dashboard
        {selectedDashboard === 'business' && <div className='ml-auto w-2 h-2 bg-emerald-500 rounded-full'></div>}
      </button>
    </div>
  )

  // Custom dropdown menu component for better dark mode support
  const renderSignOutDropdown = () => (
    <div
      className={`rounded-md overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} 
                     shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <button
        onClick={handleLogoutClick}
        className={`w-full py-2 px-4 text-left flex items-center text-sm transition-all duration-200
                   ${darkMode ? 'text-white bg-gray-800 hover:bg-gray-700' : 'text-gray-700 bg-white hover:bg-blue-50'}`}
        onMouseEnter={(e) => {
          if (darkMode) {
            e.target.style.backgroundColor = BRAND_COLORS.emeraldAccent
            e.target.style.color = 'white'
          } else {
            e.target.style.backgroundColor = BRAND_COLORS.seaGreen
            e.target.style.color = 'white'
          }
        }}
        onMouseLeave={(e) => {
          if (darkMode) {
            e.target.style.backgroundColor = '#374151' // gray-700
            e.target.style.color = 'white'
          } else {
            e.target.style.backgroundColor = 'white'
            e.target.style.color = '#374151' // gray-700
          }
        }}
      >
        <FontAwesomeIcon icon={faSignOut} className='mr-2 w-4' />
        Sign Out
      </button>
    </div>
  )

  // Search component
  const renderSearchComponent = () => (
    <div className='relative flex-1 max-w-lg mx-4 lg:mx-8 hidden sm:block'>
      <div className={`relative transition-all duration-200 ${isSearchFocused ? 'transform scale-105' : ''}`}>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          {isSearchLoading ? (
            <div className='animate-spin h-4 w-4 flex items-center justify-center'>
              <FontAwesomeIcon
                icon={faSpinner}
                className={`transition-colors duration-200 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
              />
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faSearch}
              className={`h-4 w-4 transition-colors duration-200 ${
                isSearchFocused
                  ? darkMode
                    ? 'text-emerald-400'
                    : 'text-emerald-600'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}
            />
          )}
        </div>
        <input
          type='text'
          placeholder={isSearchLoading ? 'Searching...' : 'Search candidates, jobs, assessments...'}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyDown={handleSearchSubmit}
          disabled={isSearchLoading}
          className={`block w-full pl-10 pr-10 py-2 border rounded-full text-sm transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 backdrop-blur-sm'
              : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
          } ${
            isSearchFocused
              ? darkMode
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-gray-800/80'
                : 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white'
              : 'hover:border-gray-400 dark:hover:border-gray-500'
          } ${
            isSearchLoading
              ? darkMode
                ? 'opacity-70 cursor-not-allowed bg-gray-800/40'
                : 'opacity-70 cursor-not-allowed bg-gray-100/50'
              : ''
          } focus:outline-none`}
        />
        {searchQuery && !isSearchLoading && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            <button
              onClick={handleSearchClear}
              className={`h-4 w-4 transition-colors duration-200 ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isSearchFocused && (searchResults.length > 0 || isSearchLoading) && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
          }`}
        >
          {isSearchLoading && searchResults.length === 0 ? (
            <div className='px-4 py-6 text-center'>
              <div className='flex items-center justify-center space-x-2'>
                <div className='animate-spin h-4 w-4 flex items-center justify-center'>
                  <FontAwesomeIcon icon={faSpinner} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Searching...</span>
              </div>
            </div>
          ) : (
            searchResults.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                    darkMode ? 'text-gray-400 bg-gray-700/50' : 'text-gray-500 bg-gray-50'
                  }`}
                >
                  {category.category}
                </div>
                {category.items.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors duration-150 ${
                      darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-50 text-gray-900'
                    }`}
                    onClick={() => handleSearchResultClick(item)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {highlightText(item.title, searchQuery)}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {highlightText(item.subtitle, searchQuery)}
                      </div>
                    </div>
                  </button>
                ))}
                {/* Clear recent searches option */}
                {category.category === 'Recent Searches' && category.items.length > 0 && (
                  <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <button
                      onClick={clearRecentSearchesLocal}
                      className={`text-xs font-medium transition-colors duration-150 ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                      }`}
                    >
                      Clear recent searches
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          {searchQuery.trim() && (
            <div className={`px-4 py-3 text-center border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <button
                className={`text-xs font-medium transition-colors duration-150 ${
                  darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                }`}
                onClick={() => {
                  console.log('Show all results for:', searchQuery)
                  handleSearchClear()
                }}
              >
                Show all results for "{searchQuery}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Enhanced header gradient with blue-to-green transitions for Skill Scout branding
  const headerGradient = darkMode
    ? `linear-gradient(135deg, ${BRAND_COLORS.darkBlue} 0%, ${BRAND_COLORS.shakespeare} 25%, ${BRAND_COLORS.emeraldAccent} 65%, ${BRAND_COLORS.forestGreen} 100%)`
    : `linear-gradient(135deg, ${BRAND_COLORS.shakespeare} 0%, ${BRAND_COLORS.pictonBlue} 20%, ${BRAND_COLORS.seaGreen} 50%, ${BRAND_COLORS.emeraldPrimary} 80%, ${BRAND_COLORS.tealGreen} 100%)`

  return (
    <header
      className='sticky top-0 z-10 shadow-sm border-b transition-all duration-300 hover:shadow-lg'
      style={{
        background: headerGradient,
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        boxShadow: darkMode
          ? `0 4px 12px 0 ${BRAND_COLORS.emeraldAccent}25, 0 2px 6px 0 ${BRAND_COLORS.forestGreen}15`
          : `0 4px 12px 0 ${BRAND_COLORS.shakespeare}25, 0 2px 6px 0 ${BRAND_COLORS.seaGreen}15`
      }}
    >
      <div className='px-2 sm:px-4 md:px-6'>
        <div className='flex h-16 md:h-20 items-center justify-between'>
          {/* Logo and Title */}
          <Link to='/' className='flex-shrink-0 flex items-center'>
            <div
              className={`rounded-full p-0 transition-all duration-300 ${
                darkMode ? 'bg-white/15 backdrop-blur-sm shadow-lg' : ''
              }`}
            >
              <Logo size='small' className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16' />
            </div>
            <h1 className='ml-1 sm:ml-2 md:ml-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap'>
              <span className='text-blue-500'>Skill</span>
              <span className='text-emerald-500'>Scout</span>
            </h1>
          </Link>

          {/* Search Component - Only show when user is logged in */}
          {user && renderSearchComponent()}

          {/* Right side - Dashboard selector, theme toggle, and user menu */}
          <div className='flex items-center flex-shrink-0'>
            {/* Dashboard Dropdown */}
            {user && (
              <Dropdown
                dropdownRender={renderDashboardDropdown}
                trigger={['click']}
                placement='bottomRight'
                className='mr-2 sm:mr-4 md:mr-6'
                open={isDashboardDropdownOpen}
                onOpenChange={setIsDashboardDropdownOpen}
              >
                <div className='flex items-center cursor-pointer hover:opacity-80 transition-all duration-200 py-1 md:py-2 px-2 md:px-3 rounded-full hover:bg-white/10 dark:hover:bg-black/20'>
                  <div
                    className='w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 flex items-center justify-center text-white mr-1 md:mr-2'
                    style={{
                      background: darkMode
                        ? `linear-gradient(135deg, ${BRAND_COLORS.emeraldAccent}, ${BRAND_COLORS.forestGreen}40)`
                        : `linear-gradient(135deg, ${BRAND_COLORS.tealGreen}, ${BRAND_COLORS.emeraldBright}40)`
                    }}
                  >
                    <FontAwesomeIcon
                      icon={selectedDashboard === 'business' ? faBuilding : faUserTie}
                      className='text-xs md:text-sm'
                    />
                  </div>
                  <span className='hidden sm:block text-xs md:text-sm font-medium text-white mr-1'>
                    {selectedDashboard === 'business' ? 'Business Dashboard' : 'Personal Dashboard'}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className='text-white text-xs opacity-70' />
                </div>
              </Dropdown>
            )}

            {/* Theme Toggle */}
            <ThemeToggle className='ml-2 sm:ml-4 md:ml-6 md:mr-3 scale-90 md:scale-100' />

            {/* User Menu */}
            {user ? (
              <Dropdown dropdownRender={renderSignOutDropdown} trigger={['click']} placement='bottomRight'>
                <div className='flex items-center cursor-pointer hover:opacity-80 transition-opacity py-1 md:py-2 px-2 md:px-3 rounded-full hover:bg-white/10 dark:hover:bg-black/20'>
                  <div
                    className='w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-1 md:mr-2'
                    style={{
                      background: darkMode
                        ? `linear-gradient(135deg, ${BRAND_COLORS.emeraldAccent}, ${BRAND_COLORS.forestGreen}40)`
                        : `linear-gradient(135deg, ${BRAND_COLORS.tealGreen}, ${BRAND_COLORS.emeraldBright}40)`
                    }}
                  >
                    {user.ProfileEntryResponse?.ProfilePic ? (
                      <img
                        src={user.ProfileEntryResponse.ProfilePic}
                        alt={user.ProfileEntryResponse.Username}
                        className='w-full h-full object-cover rounded-full'
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className='text-sm md:text-base' />
                    )}
                  </div>
                  <span className='hidden md:block text-sm font-medium text-white truncate max-w-[100px] lg:max-w-[200px]'>
                    {user.ProfileEntryResponse?.Username || user.name || 'User'}
                  </span>
                </div>
              </Dropdown>
            ) : null}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title={<span style={{ color: darkMode ? '#ffffff' : '#000000' }}>Confirm Sign Out</span>}
        open={isLogoutConfirmOpen}
        onOk={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        okText='Sign Out'
        cancelText='Cancel'
        okButtonProps={{
          style: {
            backgroundColor: darkMode ? BRAND_COLORS.emeraldAccent : BRAND_COLORS.seaGreen,
            borderColor: darkMode ? BRAND_COLORS.emeraldAccent : BRAND_COLORS.seaGreen,
            color: '#ffffff'
          },
          danger: true
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderColor: darkMode ? '#6b7280' : '#d1d5db',
            color: darkMode ? '#ffffff' : '#374151'
          }
        }}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          },
          body: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          },
          header: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
          },
          footer: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderTop: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
          }
        }}
      >
        <p style={{ color: darkMode ? '#e5e7eb' : '#374151', margin: 0 }}>Are you sure you want to sign out?</p>
      </Modal>

      {/* Business Setup Modal */}
      <Modal
        title={
          <div className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faBuilding} style={{ color: darkMode ? '#10b981' : '#059669' }} />
            <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>Business Dashboard Setup</span>
          </div>
        }
        open={isBusinessSetupOpen}
        onCancel={handleBusinessSetupClose}
        footer={null}
        width={500}
        className={darkMode ? 'ant-modal-dark' : ''}
        styles={{
          content: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          },
          body: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          },
          header: {
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderBottom: darkMode ? '1px solid #4B5563' : '1px solid #e5e7eb'
          }
        }}
      >
        {/* Dark Mode Form Styling */}
        {darkMode && (
          <style>
            {`
               .business-setup-form .ant-form-item-label > label {
                 color: #E5E7EB !important;
               }
               .business-setup-form .ant-input {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
               .business-setup-form .ant-input:focus {
                 border-color: #059669 !important;
                 box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
               }
               .business-setup-form .ant-input::placeholder {
                 color: #9CA3AF !important;
               }
               .business-setup-form .ant-input-group-addon {
                 background-color: #4B5563 !important;
                 border-color: #6B7280 !important;
                 color: #F9FAFB !important;
               }
             `}
          </style>
        )}

        <div className='space-y-4'>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className='mb-3'>
              To access the Business Dashboard, please provide your business information. This helps us customize your
              experience and organize your business data.
            </p>
            <div
              className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}
            >
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-0`}>
                <strong>Note:</strong> This information is required to access business features and will be used to
                organize your job postings and assessments.
              </p>
            </div>
          </div>

          <Form
            form={businessForm}
            layout='vertical'
            onFinish={handleBusinessSetup}
            className={`${darkMode ? 'business-setup-form' : ''}`}
          >
            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Business Name</span>}
              name='businessName'
              rules={[
                { required: true, message: 'Please enter your business name' },
                { min: 2, message: 'Business name must be at least 2 characters' }
              ]}
            >
              <Input placeholder='e.g. TechCorp Solutions' autoFocus />
            </Form.Item>

            <Form.Item
              label={<span className={darkMode ? 'text-gray-300' : ''}>Email Domain</span>}
              name='emailDomain'
              rules={[
                { required: true, message: 'Please enter your business email domain' },
                {
                  pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/,
                  message: 'Please enter a valid domain (e.g. company.com)'
                }
              ]}
            >
              <Input placeholder='e.g. company.com' addonBefore='@' />
            </Form.Item>

            <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <Button
                onClick={handleBusinessSetupClose}
                className={darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : ''}
              >
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                style={{
                  backgroundColor: darkMode ? '#059669' : '#10b981',
                  borderColor: darkMode ? '#059669' : '#10b981'
                }}
              >
                Setup Business Dashboard
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </header>
  )
}

export default Header
