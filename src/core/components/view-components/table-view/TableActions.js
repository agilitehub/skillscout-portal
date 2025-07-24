// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Space, Tooltip, Popconfirm } from 'antd'
import { Button } from '../../index'
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
import { useTheme } from '../../../context/ThemeContext'

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

  // Default action configurations with high contrast colors for visibility
  const defaultActions = {
    view: {
      key: 'view',
      icon: faEye,
      tooltip: 'View',
      color: darkMode ? '!text-blue-400 hover:!text-blue-300' : '!text-blue-800 hover:!text-blue-900',
      onClick: (record) => console.log('View:', record)
    },
    edit: {
      key: 'edit',
      icon: faEdit,
      tooltip: 'Edit',
      color: darkMode ? '!text-green-400 hover:!text-green-300' : '!text-green-800 hover:!text-green-900',
      onClick: (record) => console.log('Edit:', record)
    },
    delete: {
      key: 'delete',
      icon: faTrash,
      tooltip: 'Delete',
      color: darkMode ? '!text-red-400 hover:!text-red-300' : '!text-red-800 hover:!text-red-900',
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
      color: darkMode ? '!text-purple-400 hover:!text-purple-300' : '!text-purple-800 hover:!text-purple-900',
      onClick: (record) => console.log('Description:', record)
    },
    assessment: {
      key: 'assessment',
      icon: faClipboardCheck,
      tooltip: 'View Assessment',
      color: darkMode ? '!text-orange-400 hover:!text-orange-300' : '!text-orange-800 hover:!text-orange-900',
      onClick: (record) => console.log('Assessment:', record)
    },
    download: {
      key: 'download',
      icon: faDownload,
      tooltip: 'Download',
      color: darkMode ? '!text-indigo-400 hover:!text-indigo-300' : '!text-indigo-800 hover:!text-indigo-900',
      onClick: (record) => console.log('Download:', record)
    },
    share: {
      key: 'share',
      icon: faShare,
      tooltip: 'Share',
      color: darkMode ? '!text-cyan-400 hover:!text-cyan-300' : '!text-cyan-800 hover:!text-cyan-900',
      onClick: (record) => console.log('Share:', record)
    },
    copy: {
      key: 'copy',
      icon: faCopy,
      tooltip: 'Copy',
      color: darkMode ? '!text-gray-400 hover:!text-gray-300' : '!text-gray-800 hover:!text-gray-900',
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
        icon={<FontAwesomeIcon icon={config.icon} className={`${config.color} transition-colors duration-200`} />}
        onClick={() => config.onClick(record)}
        className={`!bg-transparent !border-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 transition-all duration-200`}
        disabled={config.disabled}
        style={config.style}
      />
    )

    // Wrap with confirmation if needed
    if (config.confirm) {
      return (
        <Tooltip key={config.key} title={config.tooltip}>
          <Popconfirm
            title={config.confirm.title}
            description={config.confirm.description}
            onConfirm={() => {
              // Use onConfirm if provided, otherwise fall back to onClick
              if (config.confirm.onConfirm) {
                config.confirm.onConfirm(record)
              } else {
                config.onClick(record)
              }
            }}
            okText={config.confirm.okText}
            cancelText={config.confirm.cancelText}
            okType={config.confirm.okType}
            placement='topRight'
          >
            <Button
              type='text'
              size={size}
              icon={<FontAwesomeIcon icon={config.icon} className={`${config.color} transition-colors duration-200`} />}
              className={`!bg-transparent !border-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 transition-all duration-200`}
              disabled={config.disabled}
              style={config.style}
            />
          </Popconfirm>
        </Tooltip>
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
