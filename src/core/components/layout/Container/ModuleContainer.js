// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'

/**
 * @param {'default'|'padded'} variant - default matches toolbar+table spacing; padded uses wider horizontal padding used on some list pages.
 */
const ModuleContainer = ({ children, variant = 'default', className = '' }) => {
  const base =
    variant === 'padded' ? 'relative min-w-0 w-full max-w-full pl-5 pr-5 pt-2' : 'min-w-0 w-full max-w-full pt-2 pl-2 pr-2'
  return <div className={`${base} ${className}`.trim()}>{children}</div>
}

export default ModuleContainer
