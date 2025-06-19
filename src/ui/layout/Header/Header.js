// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../ui/components/Logo'
import ThemeToggle from '../../../ui/components/ThemeToggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Modal } from 'antd'
import { useTheme } from '../../../ui/ThemeContext'
import { useAuth } from '../../../ui/AuthContext'
import { BRAND_COLORS } from '../../../ui/config/colors'

/**
 * Simplified Header component for the application
 */
const Header = ({ user }) => {
  const navigate = useNavigate()
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const { darkMode } = useTheme()
  const { logout } = useAuth()

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

  // Enhanced header gradient with blue-to-green transitions for Career Match AI branding
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
        <div className='flex justify-between h-16 md:h-20 items-center'>
          {/* Logo and Title */}
          <Link to='/' className='flex-shrink-0 flex items-center'>
            <div
              className={`rounded-full p-0 transition-all duration-300 ${
                darkMode ? 'bg-white/15 backdrop-blur-sm shadow-lg' : ''
              }`}
            >
              <Logo size='small' className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16' />
            </div>
            <h1 className='ml-1 sm:ml-2 md:ml-3 text-lg sm:text-xl md:text-4xl font-bold text-white whitespace-nowrap'>
              Career Match AI
            </h1>
          </Link>

          {/* Right side - User and theme toggle */}
          <div className='flex items-center ml-auto'>
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
    </header>
  )
}

export default Header
