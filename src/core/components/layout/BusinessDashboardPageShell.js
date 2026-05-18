// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const DARK_GRADIENT = 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
const LIGHT_GRADIENT = 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'

/**
 * Full-height gradient background wrapper used across Business Dashboard list and form pages.
 */
const BusinessDashboardPageShell = ({ children, className = '' }) => {
  const { darkMode } = useTheme()
  const grad = darkMode ? DARK_GRADIENT : LIGHT_GRADIENT
  return <div className={`min-h-full pt-2 ${grad} ${className}`.trim()}>{children}</div>
}

export default React.memo(BusinessDashboardPageShell)
