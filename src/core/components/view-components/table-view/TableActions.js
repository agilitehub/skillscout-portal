// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Button, Space, Tooltip, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEdit,
  faTrash,
  faFileText,
  faClipboardCheck,
  faDownload,
  faShare,
  faCopy
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../ui/ThemeContext'

/**
 * Reusable TableActions Component
 * Provides common action buttons for table rows
 *
 * @param {Object} props - Component props
 * @param {Object} props.record - Table record data
 * @param {Array} props.actions - Array of action configurations
 * @param {string} props.size - Button size ('small' | 'middle' | 'large')
 * @param {boolean} props.wrap - Whether to wrap actions in multiple lines
 */
const TableActions = React.memo(({ record, actions = [], size = 'small', wrap = true }) => {
  const { darkMode } = useTheme()

  // Default action configurations
  const defaultActions = {
    view: {
      key: 'view',
      icon: faEye,
      tooltip: 'View',
      color: 'text-blue-500 hover:text-blue-700',
      onClick: (record) => console.log('View:', record)
    },
    edit: {
      key: 'edit',
      icon: faEdit,
      tooltip: 'Edit',
      color: 'text-green-500 hover:text-green-700',
      onClick: (record) => console.log('Edit:', record)
    },
    delete: {
      key: 'delete',
      icon: faTrash,
      tooltip: 'Delete',
      color: 'text-red-500 hover:text-red-700',
      onClick: (record) => console.log('Delete:', record),
      confirm: {
        title: 'Delete Item',
        description: 'Are you sure you want to delete this item? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger'
      }
    },
    description: {
      key: 'description',
      icon: faFileText,
      tooltip: 'View Description',
      color: 'text-purple-500 hover:text-purple-700',
      onClick: (record) => console.log('Description:', record)
    },
    assessment: {
      key: 'assessment',
      icon: faClipboardCheck,
      tooltip: 'View Assessment',
      color: 'text-orange-500 hover:text-orange-700',
      onClick: (record) => console.log('Assessment:', record)
    },
    download: {
      key: 'download',
      icon: faDownload,
      tooltip: 'Download',
      color: 'text-indigo-500 hover:text-indigo-700',
      onClick: (record) => console.log('Download:', record)
    },
    share: {
      key: 'share',
      icon: faShare,
      tooltip: 'Share',
      color: 'text-cyan-500 hover:text-cyan-700',
      onClick: (record) => console.log('Share:', record)
    },
    copy: {
      key: 'copy',
      icon: faCopy,
      tooltip: 'Copy',
      color: 'text-gray-500 hover:text-gray-700',
      onClick: (record) => console.log('Copy:', record)
    }
  }

  // Render a single action button
  const renderAction = (action) => {
    const config = typeof action === 'string' ? defaultActions[action] : { ...defaultActions[action.key], ...action }

    if (!config) return null

    const button = (
      <Button
        type='text'
        size={size}
        icon={<FontAwesomeIcon icon={config.icon} />}
        onClick={() => config.onClick(record)}
        className={config.color}
        disabled={config.disabled}
        style={{
          backgroundColor: 'transparent',
          borderColor: darkMode ? '#6b7280' : '#d1d5db',
          ...config.style
        }}
      />
    )

    // Wrap with confirmation if needed
    if (config.confirm) {
      return (
        <Popconfirm
          key={config.key}
          title={config.confirm.title}
          description={config.confirm.description}
          onConfirm={() => config.onClick(record)}
          okText={config.confirm.okText}
          cancelText={config.confirm.cancelText}
          okType={config.confirm.okType}
          placement='topRight'
        >
          <Tooltip title={config.tooltip}>{button}</Tooltip>
        </Popconfirm>
      )
    }

    return (
      <Tooltip key={config.key} title={config.tooltip}>
        {button}
      </Tooltip>
    )
  }

  if (actions.length === 0) return null

  return (
    <Space size='small' wrap={wrap}>
      {actions.map(renderAction)}
    </Space>
  )
})

TableActions.displayName = 'TableActions'

export default TableActions

// Export common action presets
export const ACTION_PRESETS = {
  // Basic CRUD actions
  BASIC: ['view', 'edit', 'delete'],

  // View only
  VIEW_ONLY: ['view'],

  // Edit and delete
  EDIT_DELETE: ['edit', 'delete'],

  // Business dashboard job actions
  JOB_ACTIONS: ['view', 'description', 'assessment', 'edit', 'delete'],

  // Document actions
  DOCUMENT_ACTIONS: ['view', 'edit', 'download', 'share', 'delete'],

  // Assessment actions
  ASSESSMENT_ACTIONS: ['view', 'edit', 'copy', 'delete']
}
