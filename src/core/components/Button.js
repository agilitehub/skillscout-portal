// Global Instructions Rule Applied!

import React from 'react'
import { Button as AntButton } from 'antd'

/**
 * Reusable Button component that combines Ant Design with Tailwind CSS variants
 * Provides consistent styling across the application using predefined variants
 */

// Base button classes - consistent styling foundation
const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

// Button variant classes for different styling options
const BUTTON_VARIANTS = {
  primary: `${BUTTON_BASE_CLASSES} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`,
  secondary: `${BUTTON_BASE_CLASSES} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`,
  outline: `${BUTTON_BASE_CLASSES} border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 bg-transparent`,
  ghost: `${BUTTON_BASE_CLASSES} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white shadow-none border-transparent`,
  danger: `${BUTTON_BASE_CLASSES} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`,
  success: `${BUTTON_BASE_CLASSES} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`
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

  // Get the corresponding Tailwind classes for the variant
  const tailwindClasses = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary

  // Combine Tailwind classes with any additional custom classes
  const buttonClasses = combineClasses(tailwindClasses, className)

  return (
    <AntButton
      type={getAntButtonType(variant)}
      size={size}
      loading={loading}
      disabled={disabled}
      icon={icon}
      onClick={onClick}
      htmlType={htmlType}
      className={buttonClasses}
      {...restProps}
    >
      {children}
    </AntButton>
  )
}

export default Button
