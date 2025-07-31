// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../context/ThemeContext'

/**
 * Enhanced Dark Mode Styles
 * Provides comprehensive dark mode styling improvements for better contrast,
 * readability, and visual hierarchy across the application
 */
const EnhancedDarkModeStyles = React.memo(() => {
  const { darkMode } = useTheme()

  return (
    <style jsx global>{`
      /* Enhanced Global Dark Mode Styles */
      ${darkMode ? `
        /* Root Variables for Dark Mode */
        :root {
          --text-primary: #F9FAFB;
          --text-secondary: #E5E7EB;
          --text-tertiary: #D1D5DB;
          --text-muted: #9CA3AF;
          --bg-primary: #111827;
          --bg-secondary: #1F2937;
          --bg-tertiary: #374151;
          --bg-elevated: #2D3748;
          --border-primary: #374151;
          --border-secondary: #4B5563;
          --border-tertiary: #6B7280;
          --accent-primary: #059669;
          --accent-secondary: #10B981;
          --shadow-light: rgba(0, 0, 0, 0.3);
          --shadow-medium: rgba(0, 0, 0, 0.4);
          --shadow-heavy: rgba(0, 0, 0, 0.6);
        }

        /* Enhanced Body and HTML */
        html, body {
          background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Enhanced Card Styling */
        .ant-card {
          background: linear-gradient(145deg, #1F2937 0%, #374151 100%);
          border: 1px solid var(--border-primary);
          box-shadow: 0 4px 12px var(--shadow-light), 0 2px 4px var(--shadow-light);
          border-radius: 12px;
        }

        .ant-card:hover {
          box-shadow: 0 8px 25px var(--shadow-medium), 0 4px 10px var(--shadow-light);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .ant-card-head {
          background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
          border-bottom: 2px solid var(--border-secondary);
          border-radius: 12px 12px 0 0;
        }

        .ant-card-head-title {
          color: var(--text-primary);
          font-weight: 600;
        }

        .ant-card-body {
          background: transparent;
          color: var(--text-secondary);
        }

        /* Enhanced Modal Styling */
        .ant-modal-content {
          background: linear-gradient(145deg, #1F2937 0%, #374151 100%);
          border: 1px solid var(--border-primary);
          box-shadow: 0 20px 40px var(--shadow-heavy);
          border-radius: 16px;
        }

        .ant-modal-header {
          background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
          border-bottom: 2px solid var(--border-secondary);
          border-radius: 16px 16px 0 0;
        }

        .ant-modal-title {
          color: var(--text-primary);
          font-weight: 600;
        }

        .ant-modal-close {
          color: var(--text-muted);
        }

        .ant-modal-close:hover {
          color: var(--accent-secondary);
        }

        /* Enhanced Typography */
        h1, h2, h3, h4, h5, h6 {
          color: var(--text-primary);
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .ant-typography {
          color: var(--text-secondary);
        }

        .ant-typography-title {
          color: var(--text-primary);
        }

        /* Enhanced Button Improvements */
        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px var(--shadow-light);
        }

        /* Enhanced Drawer/Sidebar */
        .ant-drawer-content {
          background: linear-gradient(180deg, #1F2937 0%, #111827 100%);
          border-right: 1px solid var(--border-primary);
        }

        .ant-drawer-header {
          background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
          border-bottom: 2px solid var(--border-secondary);
        }

        /* Enhanced Menu Styling */
        .ant-menu {
          background: transparent;
          border-right: none;
        }

        .ant-menu-item {
          color: var(--text-tertiary);
          border-radius: 8px;
          margin: 4px 8px;
          transition: all 0.2s ease;
        }

        .ant-menu-item:hover {
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          transform: translateX(4px);
        }

        .ant-menu-item-selected {
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          color: white;
        }

        .ant-menu-submenu-title {
          color: var(--text-tertiary);
        }

        .ant-menu-submenu-title:hover {
          color: var(--accent-secondary);
        }

        /* Enhanced Dropdown */
        .ant-dropdown {
          background: linear-gradient(145deg, #374151 0%, #4B5563 100%);
          border: 1px solid var(--border-secondary);
          border-radius: 12px;
          box-shadow: 0 8px 25px var(--shadow-medium);
        }

        .ant-dropdown-menu {
          background: transparent;
          border-radius: 12px;
        }

        .ant-dropdown-menu-item {
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .ant-dropdown-menu-item:hover {
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          color: white;
        }

        /* Enhanced Alert Components */
        .ant-alert {
          border-radius: 10px;
          border-width: 2px;
        }

        .ant-alert-info {
          background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
          border-color: #60A5FA;
          color: white;
        }

        .ant-alert-success {
          background: linear-gradient(135deg, #064E3B 0%, #059669 100%);
          border-color: #10B981;
          color: white;
        }

        .ant-alert-warning {
          background: linear-gradient(135deg, #92400E 0%, #F59E0B 100%);
          border-color: #FBBF24;
          color: white;
        }

        .ant-alert-error {
          background: linear-gradient(135deg, #7F1D1D 0%, #EF4444 100%);
          border-color: #F87171;
          color: white;
        }

        /* Enhanced Tooltip */
        .ant-tooltip-inner {
          background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
          color: var(--text-primary);
          border: 1px solid var(--border-secondary);
          border-radius: 8px;
          box-shadow: 0 4px 12px var(--shadow-medium);
        }

        .ant-tooltip-arrow::before {
          background: #4B5563;
          border: 1px solid var(--border-secondary);
        }

        /* Enhanced Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--border-secondary), var(--border-tertiary));
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        }

        /* Enhanced Loading States */
        .ant-spin-dot-item {
          background-color: var(--accent-secondary);
        }

        .ant-skeleton-content .ant-skeleton-title {
          background: linear-gradient(90deg, var(--bg-tertiary), var(--bg-elevated), var(--bg-tertiary));
        }

        .ant-skeleton-content .ant-skeleton-paragraph > li {
          background: linear-gradient(90deg, var(--bg-tertiary), var(--bg-elevated), var(--bg-tertiary));
        }

        /* Enhanced Badge and Tag improvements */
        .ant-badge-count {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border: 2px solid var(--bg-primary);
          box-shadow: 0 2px 8px var(--shadow-light);
        }

        .ant-tag {
          border-radius: 6px;
          font-weight: 500;
          border-width: 2px;
        }

        /* Enhanced Divider */
        .ant-divider {
          border-color: var(--border-primary);
          background: linear-gradient(90deg, transparent, var(--border-primary), transparent);
        }

        /* Enhanced Steps */
        .ant-steps-item-process .ant-steps-item-icon {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-color: var(--accent-secondary);
        }

        .ant-steps-item-finish .ant-steps-item-icon {
          background: var(--accent-secondary);
          border-color: var(--accent-secondary);
        }

        /* Enhanced Progress */
        .ant-progress-bg {
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        }

        /* Enhanced Notification */
        .ant-notification {
          background: linear-gradient(145deg, #374151 0%, #4B5563 100%);
          border: 1px solid var(--border-secondary);
          border-radius: 12px;
          box-shadow: 0 8px 25px var(--shadow-medium);
        }

        .ant-notification-notice-message {
          color: var(--text-primary);
          font-weight: 600;
        }

        .ant-notification-notice-description {
          color: var(--text-secondary);
        }
      ` : `
        /* Light Mode Enhancements */
        :root {
          --text-primary: #111827;
          --text-secondary: #374151;
          --text-tertiary: #6B7280;
          --text-muted: #9CA3AF;
          --bg-primary: #FFFFFF;
          --bg-secondary: #F9FAFB;
          --bg-tertiary: #F3F4F6;
          --bg-elevated: #FFFFFF;
          --border-primary: #E5E7EB;
          --border-secondary: #D1D5DB;
          --border-tertiary: #9CA3AF;
          --accent-primary: #059669;
          --accent-secondary: #10B981;
          --shadow-light: rgba(0, 0, 0, 0.1);
          --shadow-medium: rgba(0, 0, 0, 0.15);
          --shadow-heavy: rgba(0, 0, 0, 0.25);
        }

        html, body {
          background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
          color: var(--text-primary);
        }

        .ant-card:hover {
          box-shadow: 0 8px 25px var(--shadow-medium), 0 4px 10px var(--shadow-light);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}
    `}</style>
  )
})

EnhancedDarkModeStyles.displayName = 'EnhancedDarkModeStyles'

export default EnhancedDarkModeStyles 