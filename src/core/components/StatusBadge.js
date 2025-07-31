// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Tag } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faTimesCircle, 
  faClock, 
  faExclamationTriangle,
  faInfoCircle,
  faUser,
  faBuilding
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../context/ThemeContext'
import { SEMANTIC_COLORS, BRAND_COLORS } from '../theme/colors'

/**
 * Enhanced Status Badge Component
 * Provides consistent status indicators with icons and proper theming
 */

// Status configurations with icons, colors, and labels
const STATUS_CONFIGS = {
  // Common statuses
  active: {
    icon: faCheckCircle,
    color: SEMANTIC_COLORS.success,
    darkColor: '#10B981',
    label: 'Active',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B'
  },
  inactive: {
    icon: faTimesCircle,
    color: '#6B7280',
    darkColor: '#9CA3AF',
    label: 'Inactive',
    bgLight: '#F3F4F6',
    bgDark: '#374151'
  },
  pending: {
    icon: faClock,
    color: SEMANTIC_COLORS.warning,
    darkColor: '#F59E0B',
    label: 'Pending',
    bgLight: '#FEF3C7',
    bgDark: '#92400E'
  },
  error: {
    icon: faExclamationTriangle,
    color: SEMANTIC_COLORS.error,
    darkColor: '#EF4444',
    label: 'Error',
    bgLight: '#FEE2E2',
    bgDark: '#7F1D1D'
  },
  info: {
    icon: faInfoCircle,
    color: BRAND_COLORS.shakespeare,
    darkColor: '#60A5FA',
    label: 'Info',
    bgLight: '#DBEAFE',
    bgDark: '#1E3A8A'
  },
  
  // User-specific statuses
  admin: {
    icon: faUser,
    color: SEMANTIC_COLORS.error,
    darkColor: '#EF4444',
    label: 'Admin',
    bgLight: '#FEE2E2',
    bgDark: '#7F1D1D'
  },
  recruiter: {
    icon: faUser,
    color: BRAND_COLORS.emeraldPrimary,
    darkColor: '#10B981',
    label: 'Recruiter',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B'
  },
  viewer: {
    icon: faUser,
    color: BRAND_COLORS.shakespeare,
    darkColor: '#60A5FA',
    label: 'Viewer',
    bgLight: '#DBEAFE',
    bgDark: '#1E3A8A'
  },
  
  // Branch-specific
  headquarters: {
    icon: faBuilding,
    color: BRAND_COLORS.emeraldPrimary,
    darkColor: '#10B981',
    label: 'HQ',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B'
  }
}

const StatusBadge = React.memo(({ 
  status, 
  size = 'default', 
  showIcon = true, 
  customLabel,
  className = '',
  style = {},
  ...props 
}) => {
  const { darkMode } = useTheme()
  
  // Get status configuration
  const config = STATUS_CONFIGS[status?.toLowerCase()] || STATUS_CONFIGS.info
  
  // Size configurations
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1.5', 
    large: 'text-base px-4 py-2'
  }
  
  const iconSizes = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base'
  }

  const tagStyle = {
    backgroundColor: darkMode ? config.bgDark : config.bgLight,
    borderColor: darkMode ? config.darkColor : config.color,
    color: darkMode ? config.darkColor : config.color,
    borderWidth: '2px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...style
  }

  return (
    <Tag
      className={`${sizeClasses[size]} ${className} transition-all duration-200 hover:scale-105`}
      style={tagStyle}
      {...props}
    >
      {showIcon && (
        <FontAwesomeIcon 
          icon={config.icon} 
          className={iconSizes[size]}
          style={{ color: 'inherit' }}
        />
      )}
      {customLabel || config.label}
    </Tag>
  )
})

StatusBadge.displayName = 'StatusBadge'

export default StatusBadge 