// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { BRAND_COLORS } from '../colors'

// Define transitions locally since styles.js seems to be unavailable
const TRANSITIONS = {
  FAST: 'transition-all duration-200 ease-in-out',
  MEDIUM: 'transition-all duration-300 ease-in-out',
  SLOW: 'transition-all duration-500 ease-in-out'
}

/**
 * ThemeToggle component provides an animated toggle switch for dark/light mode
 * Features a day/night animation with stars and clouds
 *
 * @component
 * @example
 * // Basic usage
 * <ThemeToggle />
 *
 * // With custom classes
 * <ThemeToggle className="ml-4" />
 */
const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme()

  // Memoize star elements to prevent unnecessary re-renders
  const starElements = useMemo(
    () =>
      [...Array(12)].map((_, i) => (
        <div
          key={i}
          className='absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.7)]'
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `scale(${Math.random() * 0.5 + 0.5})`
          }}
        />
      )),
    []
  )

  // Memoize sun rays
  const sunRays = useMemo(
    () =>
      [...Array(8)].map((_, i) => (
        <div
          key={i}
          className='absolute w-0.5 h-1.5'
          style={{
            backgroundColor: BRAND_COLORS.diSerria,
            transformOrigin: 'center center',
            transform: `rotate(${i * 45}deg) translateY(-3px)`
          }}
        />
      )),
    []
  )

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-16 h-8 rounded-full p-1 ${TRANSITIONS.MEDIUM} flex items-center shadow-md border ${
        darkMode ? 'justify-end border-blue-300/50' : 'justify-start border-transparent'
      } ${className}`}
      style={{
        backgroundColor: darkMode ? BRAND_COLORS.navyDark : BRAND_COLORS.shakespeare,
        borderColor: darkMode ? BRAND_COLORS.blueHighlight + '50' : 'transparent'
      }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className='sr-only'>{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>

      {/* Switch Track Background */}
      <div className='absolute inset-0 rounded-full overflow-hidden'>
        {/* Night Background */}
        <div className={`absolute inset-0 ${TRANSITIONS.MEDIUM} ${darkMode ? 'translate-x-0' : 'translate-x-full'}`}>
          <div
            className='absolute inset-0'
            style={{
              background: `linear-gradient(to right, ${BRAND_COLORS.navyDark}, ${BRAND_COLORS.darkBlue})`
            }}
          >
            {/* Stars - only visible in dark mode */}
            <div className={`absolute inset-0 ${TRANSITIONS.MEDIUM} ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
              {starElements}
            </div>
          </div>
        </div>
        {/* Day Background */}
        <div className={`absolute inset-0 ${TRANSITIONS.MEDIUM} ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}>
          <div
            className='absolute inset-0'
            style={{
              background: `linear-gradient(to right, ${BRAND_COLORS.shakespeare}, ${BRAND_COLORS.pictonBlue})`
            }}
          ></div>
          {/* Clouds - only visible in light mode */}
          <div className={`absolute inset-0 ${TRANSITIONS.MEDIUM} ${darkMode ? 'opacity-0' : 'opacity-30'}`}>
            <div className='absolute top-1 left-2 w-4 h-2 bg-white rounded-full'></div>
            <div className='absolute top-3 right-3 w-3 h-1.5 bg-white rounded-full'></div>
          </div>
        </div>
      </div>

      {/* Toggle Legends */}
      <div className='absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 text-[8px] font-bold'>
        <span className={`text-white ${TRANSITIONS.MEDIUM} ${darkMode ? 'opacity-0' : 'opacity-100'}`}>ON</span>
        <span className={`text-white ${TRANSITIONS.MEDIUM} ${darkMode ? 'opacity-100' : 'opacity-0'}`}>OFF</span>
      </div>

      {/* Toggle Handle */}
      <div
        className={`relative z-10 w-6 h-6 rounded-full shadow-md transform ${TRANSITIONS.MEDIUM} flex items-center justify-center`}
        style={{
          backgroundColor: darkMode ? BRAND_COLORS.blueHighlight : 'white',
          borderWidth: darkMode ? '1px' : '0',
          borderStyle: 'solid',
          borderColor: darkMode ? BRAND_COLORS.logoGoldAccent : 'transparent'
        }}
      >
        {/* Sun Icon - Light Mode */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${TRANSITIONS.MEDIUM} ${darkMode ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className='w-3 h-3 rounded-full' style={{ backgroundColor: BRAND_COLORS.diSerria }}></div>
          {sunRays}
        </div>

        {/* Moon Icon - Dark Mode */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${TRANSITIONS.MEDIUM} ${darkMode ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='w-3.5 h-3.5 bg-white rounded-full'></div>
          <div
            className='absolute top-1 right-1.5 w-2 h-2 rounded-full'
            style={{ backgroundColor: BRAND_COLORS.logoGoldAccent }}
          ></div>
        </div>
      </div>
    </button>
  )
}

ThemeToggle.propTypes = {
  /** Additional CSS classes to apply to the toggle button */
  className: PropTypes.string
}

// Memoize the component for better performance
export default memo(ThemeToggle)
