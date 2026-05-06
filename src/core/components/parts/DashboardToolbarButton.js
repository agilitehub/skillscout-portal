// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Button } from 'antd'

/**
 * White pill action for emerald toolbar regions (matches legacy `.dashboard-button` styling,
 * implemented with Tailwind only — no inline styles).
 */
const DashboardToolbarButton = ({
  children,
  size = 'middle',
  className = '',
  icon,
  ...rest
}) => {
  const sizeClasses = size === 'small' ? 'h-7 px-2.5 text-[13px] gap-1' : 'h-8 px-3 text-[13px] gap-1'
  const base =
    'inline-flex items-center justify-center rounded-md !border !border-white !bg-white font-medium !text-emerald-600 shadow-sm transition-all hover:-translate-y-px hover:!border-gray-50 hover:!bg-gray-50 hover:!text-emerald-800 hover:shadow-md disabled:!opacity-50'

  return (
    <Button type='default' className={`${base} ${sizeClasses} ${className}`.trim()} {...rest}>
      {icon ? <span className='inline-flex shrink-0 items-center'>{icon}</span> : null}
      {children}
    </Button>
  )
}

export default React.memo(DashboardToolbarButton)
