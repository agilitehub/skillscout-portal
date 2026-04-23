// Global Instructions Rule Applied!

import React from 'react'
import { Button as AntButton } from 'antd'

/**
 * Reusable Button component that combines Ant Design with Tailwind CSS variants
 * Provides consistent styling across the application using predefined variants
 */

// Base button classes - enhanced styling foundation
const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]'

// Size variants for consistent sizing across the app
const BUTTON_SIZES = {
  small: 'px-3 py-1.5 text-xs gap-1.5',
  middle: 'px-4 py-2 text-sm gap-2', 
  large: 'px-6 py-3 text-base gap-2.5'
}

// Enhanced button variant classes with better visual hierarchy
const BUTTON_VARIANTS = {
  primary: `${BUTTON_BASE_CLASSES} bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white focus:ring-emerald-500 shadow-lg hover:shadow-xl`,
  secondary: `${BUTTON_BASE_CLASSES} bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl`,
  outline: `${BUTTON_BASE_CLASSES} border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-700 focus:ring-emerald-500 bg-transparent shadow-md hover:shadow-lg`,
  ghost: `${BUTTON_BASE_CLASSES} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white shadow-none border-transparent focus:ring-gray-500`,
  danger: `${BUTTON_BASE_CLASSES} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 shadow-lg hover:shadow-xl`,
  success: `${BUTTON_BASE_CLASSES} bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500 shadow-lg hover:shadow-xl`,
  warning: `${BUTTON_BASE_CLASSES} bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white focus:ring-yellow-500 shadow-lg hover:shadow-xl`
}

// Utility function to combine CSS classes
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const Button = ({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  loading = false,
  disabled = false,
  size = 'middle',
  icon,
  iconPosition = 'left', // New prop for icon positioning
  onClick,
  htmlType = 'button',
  ...restProps
}) => {
  // Map Tailwind variants to Ant Design button types where appropriate
  const getAntButtonType = (variant) => {
    switch (variant) {
      case 'primary':
        return 'primary'
      case 'danger':
        return 'primary'
      case 'success':
        return 'primary'
      case 'warning':
        return 'primary'
      case 'outline':
        return 'default'
      case 'ghost':
        return 'text'
      case 'secondary':
        return 'default'
      default:
        return 'default'
    }
  }

  // Get the corresponding Tailwind classes for the variant and size
  const tailwindClasses = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary
  const sizeClasses = BUTTON_SIZES[size] || BUTTON_SIZES.middle

  // Combine all classes
  const buttonClasses = combineClasses(tailwindClasses, sizeClasses, className)

  // Enhanced icon handling with position support
  const renderIcon = () => {
    if (!icon) return null
    return <span className={`${children ? 'flex-shrink-0' : ''}`}>{icon}</span>
  }

  // Render button content with proper icon positioning
  const renderContent = () => {
    if (!children && icon) {
      // Icon-only button
      return renderIcon()
    }
    
    if (iconPosition === 'right') {
      return (
        <>
          <span className="flex-1">{children}</span>
          {renderIcon()}
        </>
      )
    }
    
    // Default left position
    return (
      <>
        {renderIcon()}
        <span className="flex-1">{children}</span>
      </>
    )
  }

  return (
    <AntButton
      type={getAntButtonType(variant)}
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      htmlType={htmlType}
      className={buttonClasses}
      style={{
        // Override Ant Design's default styles to use our custom styling
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        height: 'auto',
        ...restProps.style
      }}
      {...restProps}
    >
      {renderContent()}
    </AntButton>
  )
}

export default Button
