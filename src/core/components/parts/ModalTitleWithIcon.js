// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../../context/ThemeContext'

/**
 * Consistent modal/section title row: optional FontAwesome (or any) icon + title text.
 */
const ModalTitleWithIcon = ({ icon, children, subtitle, className = '' }) => {
  const { darkMode } = useTheme()

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      {icon ? <span className='inline-flex shrink-0 items-center'>{icon}</span> : null}
      <div className='min-w-0 flex-1'>
        <span
          className={`block font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`.trim()}
        >
          {children}
        </span>
        {subtitle ? (
          <span className={`mt-0.5 block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`.trim()}>{subtitle}</span>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(ModalTitleWithIcon)
