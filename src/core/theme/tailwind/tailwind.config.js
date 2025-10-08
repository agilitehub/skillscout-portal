/**
 * Core Tailwind configuration for Agilit-e design system
 * This can be imported and extended by the parent application's tailwind config
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#33C187', // Light Green from the logo
          DEFAULT: '#006B3C', // Emerald Green (middle shade)
          dark: '#003921' // Dark Green Shadow (background)
        },
        secondary: {
          light: '#4FA8FF', // Light Blue accent
          DEFAULT: '#0E5A94', // Medium Blue from logo
          dark: '#00334F' // Dark Blue shade
        },
        // Legacy brand colors (keeping for backward compatibility)
        'agilite-red': '#E30613',
        'agilite-black': '#151515',
        'agilite-slate': '#1E293B',
        'agilite-grey': {
          light: '#E2E8F0',
          DEFAULT: '#718096',
          dark: '#4A5568'
        },
        'agilite-grey-light': '#F5F5F5'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'slow-pulse': 'slow-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-pulse-delay': 'slow-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite 4s',
        'slow-float': 'slow-float 15s ease-in-out infinite',
        'slow-float-delay': 'slow-float 15s ease-in-out infinite 7.5s',
        'float-small': 'float-small 6s ease-in-out infinite',
        'float-particle': 'float-particle 15s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ping: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        slide: 'slide 20s linear infinite',
        glow: 'glow 10s ease-in-out infinite',
        'float-1': 'float-1 8s ease-in-out infinite',
        'float-2': 'float-2 12s ease-in-out infinite',
        'float-3': 'float-3 10s ease-in-out infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fade-in 1s ease-out forwards'
      },
      keyframes: {
        'slow-pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.1)' }
        },
        'slow-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-2%, -2%) scale(1.05)' }
        },
        'float-small': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'float-particle': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -20px) rotate(90deg)' },
          '50%': { transform: 'translate(-15px, -35px) rotate(180deg)' },
          '75%': { transform: 'translate(-25px, -10px) rotate(270deg)' }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0
          }
        },
        slide: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(50px) translateY(50px)' }
        },
        glow: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' }
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' }
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg) translateX(0)' },
          '33%': { transform: 'translateY(-10px) rotate(3deg) translateX(5px)' },
          '66%': { transform: 'translateY(5px) rotate(-3deg) translateX(-5px)' }
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
          '25%': { transform: 'translateY(-7px) scale(1.05) rotate(2deg)' },
          '75%': { transform: 'translateY(7px) scale(0.95) rotate(-2deg)' }
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: 0.5 },
          '75%, 100%': { transform: 'scale(2)', opacity: 0 }
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      container: {
        center: true,
        padding: '1rem'
      },
      backgroundImage: {
        'stripes-light':
          'repeating-linear-gradient(45deg, rgba(227, 6, 19, 0.03), rgba(227, 6, 19, 0.03) 12px, transparent 12px, transparent 24px)'
      }
    }
  },
  plugins: [
    function ({ addUtilities, addComponents }) {
      // Enhanced Table Components
      addComponents({
        '.enhanced-table': {
          // Table Header Styling
          '& .ant-table-thead > tr > th': {
            fontWeight: '600',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            padding: '16px 12px',
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            color: '#374151',
            borderBottom: '2px solid #e5e7eb'
          },

          // Table Body Cells
          '& .ant-table-tbody > tr > td': {
            padding: '16px 12px',
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent',
            borderBottom: '1px solid #f3f4f6',
            color: '#111827'
          },

          // Table Row Hover Effects
          '& .ant-table-tbody > tr:hover > td': {
            transform: 'translateY(-1px)',
            background: 'linear-gradient(90deg, #f0f9ff 0%, #ecfdf5 100%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          },

          // Selected Row Styling
          '& .ant-table-tbody > tr.ant-table-row-selected > td': {
            background: 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%)',
            color: '#065f46'
          },

          // Search Input Styling
          '& .ant-input-search:hover': {
            borderColor: '#059669 !important'
          },

          '& .ant-input-search:focus-within': {
            borderColor: '#059669 !important',
            boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2) !important'
          }
        },

        // Dark Mode Enhanced Table
        '.dark .enhanced-table': {
          '& .ant-table-thead > tr > th': {
            background: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
            color: '#e5e7eb',
            borderBottom: '2px solid #6b7280'
          },

          '& .ant-table-tbody > tr > td': {
            borderBottom: '1px solid #4b5563',
            color: '#f9fafb'
          },

          '& .ant-table-tbody > tr:hover > td': {
            background: 'linear-gradient(90deg, #374151 0%, #4b5563 100%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          },

          '& .ant-table-tbody > tr.ant-table-row-selected > td': {
            background: 'linear-gradient(90deg, #065f46 0%, #047857 100%)',
            color: '#ffffff'
          }
        },

        // Dark Search Components
        '.dark .dark-search': {
          '& .ant-input': {
            backgroundColor: '#4b5563 !important',
            borderColor: '#6b7280 !important',
            color: '#ffffff !important',
            borderRadius: '8px !important'
          },

          '& .ant-input:focus': {
            borderColor: '#059669 !important',
            boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2) !important'
          },

          '& .ant-input::placeholder': {
            color: '#ffffff !important'
          },

          '& .ant-input-search-button': {
            backgroundColor: '#6b7280 !important',
            borderColor: '#6b7280 !important',
            borderRadius: '0 8px 8px 0 !important'
          },

          '& .ant-input-search-button:hover': {
            backgroundColor: '#059669 !important',
            borderColor: '#059669 !important'
          }
        },

        // Dark Table Components
        '.dark .dark-table': {
          '& .ant-table-placeholder': {
            color: '#9ca3af !important'
          },

          '& .ant-empty-description': {
            color: '#9ca3af !important'
          },

          '& .ant-table-filter-trigger': {
            color: '#9ca3af !important'
          },

          '& .ant-table-filter-trigger:hover': {
            color: '#ffffff !important'
          },

          '& .ant-table-filter-trigger-container': {
            backgroundColor: 'transparent !important'
          },

          '& .ant-table-filter-icon': {
            color: '#9ca3af !important'
          },

          '& .ant-table-column-sorter': {
            color: '#9ca3af !important'
          },

          '& .ant-table-column-sorter:hover': {
            color: '#ffffff !important'
          },

          '& .ant-table-column-sorter-up, & .ant-table-column-sorter-down': {
            color: '#9ca3af !important'
          },

          '& .ant-table-column-sorter-up:hover, & .ant-table-column-sorter-down:hover': {
            color: '#ffffff !important'
          }
        },

        // Dark Pagination Components
        '.dark .dark-pagination': {
          '& .ant-pagination-item': {
            backgroundColor: '#4b5563 !important',
            borderColor: '#6b7280 !important'
          },

          '& .ant-pagination-item a': {
            color: '#ffffff !important'
          },

          '& .ant-pagination-item-active': {
            backgroundColor: '#059669 !important'
          },

          '& .ant-pagination-item-active a': {
            color: '#ffffff !important'
          },

          '& .ant-pagination-prev, & .ant-pagination-next': {
            backgroundColor: '#4b5563 !important',
            borderColor: '#6b7280 !important'
          },

          '& .ant-pagination-prev a, & .ant-pagination-next a': {
            color: '#ffffff !important'
          },

          '& .ant-pagination-jump-prev, & .ant-pagination-jump-next': {
            backgroundColor: '#4b5563 !important',
            borderColor: '#6b7280 !important'
          },

          '& .ant-pagination-jump-prev a, & .ant-pagination-jump-next a': {
            color: '#ffffff !important'
          },

          '& .ant-pagination-options': {
            color: '#ffffff !important'
          },

          '& .ant-select-selector': {
            backgroundColor: '#4b5563 !important',
            borderColor: '#6b7280 !important',
            color: '#ffffff !important'
          },

          '& .ant-select-arrow': {
            color: '#ffffff !important'
          },

          '& .ant-pagination-total-text': {
            color: '#ffffff !important'
          }
        },

        // Magic Link Components
        '.magic-link-button': {
          background: 'linear-gradient(135deg, #5ba3d4, #16a085)',
          border: 'none'
        },

        '.magic-link-resend-button': {
          color: 'white',
          border: '1px solid #d9d9d9',
          backgroundColor: 'white'
        },

        '.dark .magic-link-resend-button': {
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        },

        '.magic-link-submit-button': {
          background: 'linear-gradient(135deg, #5ba3d4 0%, #4a90a4 25%, #16a085 60%, #059669 100%)'
        },

        '.dark .magic-link-submit-button': {
          background: 'linear-gradient(135deg, #1e3a52 0%, #4a90a4 35%, #059669 70%, #065f46 100%)'
        },

        // Chat Components
        '.chat-drop-zone': {
          background: 'rgba(59, 130, 246, 0.05)'
        },

        '.dark .chat-drop-zone': {
          background: 'rgba(59, 130, 246, 0.1)'
        },

        '.chat-attach-button': {
          borderRadius: '8px',
          minHeight: '44px',
          width: '44px',
          padding: '0',
          color: '#16a085'
        },

        '.dark .chat-attach-button': {
          color: '#4a90a4'
        },

        '.chat-textarea': {
          padding: '12px 16px',
          fontSize: '0.875rem',
          borderRadius: '8px',
          resize: 'none',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#000000'
        },

        '.dark .chat-textarea': {
          background: '#374151',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#f9fafb'
        },

        '.chat-send-button': {
          background: 'linear-gradient(to right, #059669, #16a085)',
          borderRadius: '8px',
          minHeight: '44px',
          width: '44px',
          padding: '0',
          border: '0'
        },

        // Kanban Components
        '.kanban-select': {
          width: '140px',
          height: '32px'
        },

        '.kanban-job-select': {
          minWidth: '200px'
        },

        '.kanban-search-input': {
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          borderColor: '#d1d5db',
          color: '#111827'
        },

        '.dark .kanban-search-input': {
          backgroundColor: '#4b5563',
          borderColor: '#6b7280',
          color: '#f9fafb'
        },

        '.kanban-drop-indicator': {
          height: '4px',
          margin: '8px 0'
        },

        '.kanban-drop-indicator-line': {
          width: '100%',
          height: '0.25rem',
          borderRadius: '9999px',
          transition: 'all 0.2s',
          backgroundColor: '#10b981',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)'
        },

        '.dark .kanban-drop-indicator-line': {
          backgroundColor: '#34d399',
          boxShadow: '0 0 12px rgba(52, 211, 153, 0.8)'
        },

        '.kanban-column-title': {
          wordBreak: 'break-word',
          hyphens: 'auto',
          lineHeight: '1.2'
        },

        // Common Form Components
        '.form-input-base': {
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          color: '#111827'
        },

        '.dark .form-input-base': {
          backgroundColor: '#4b5563',
          border: '1px solid #6b7280',
          color: '#f9fafb'
        },

        '.form-input-base:focus': {
          borderColor: '#059669',
          boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)'
        },

        // Common Modal Components
        '.modal-base': {
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        },

        '.dark .modal-base': {
          backgroundColor: '#1f2937',
          border: '1px solid #374151'
        },

        // Common Card Components
        '.card-base': {
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },

        '.dark .card-base': {
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        },

        '.card-base:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },

        '.dark .card-base:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
        },

        // Global Form Components - Dark Mode Support
        '.global-form': {
          '& .ant-form-item-label > label': {
            color: '#111827',
            fontWeight: '500'
          },

          '& .ant-form-item-extra': {
            color: '#6b7280'
          },

          // Input Fields
          '& .ant-input, & input.ant-input, & input[type="text"], & input[type="number"], & input[type="date"], & input':
            {
              backgroundColor: '#ffffff',
              borderColor: '#d1d5db',
              color: '#111827',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            },

          '& .ant-input:focus, & input.ant-input:focus, & input[type="text"]:focus, & input[type="number"]:focus, & input[type="date"]:focus, & input:focus':
            {
              borderColor: '#059669',
              boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
              backgroundColor: '#ffffff',
              color: '#111827'
            },

          '& .ant-input::placeholder, & input::placeholder': {
            color: '#9ca3af',
            opacity: '1'
          },

          // TextArea Fields
          '& textarea.ant-input, & textarea': {
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            color: '#111827',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          },

          '& textarea.ant-input:focus, & textarea:focus': {
            borderColor: '#059669',
            boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
            backgroundColor: '#ffffff',
            color: '#111827'
          },

          '& textarea.ant-input::placeholder, & textarea::placeholder': {
            color: '#9ca3af',
            opacity: '1'
          },

          // Select Components
          '& .ant-select, & .ant-select-selector, & .ant-select-single .ant-select-selector': {
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            color: '#111827',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          },

          '& .ant-select-focused .ant-select-selector, & .ant-select:focus .ant-select-selector': {
            borderColor: '#059669',
            boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
            backgroundColor: '#ffffff'
          },

          '& .ant-select-selection-placeholder': {
            color: '#9ca3af',
            opacity: '1'
          },

          '& .ant-select-selection-item': {
            color: '#111827',
            backgroundColor: 'transparent'
          },

          '& .ant-select-arrow': {
            color: '#6b7280'
          },

          // Multi-select tags
          '& .ant-select-multiple .ant-select-selection-item': {
            backgroundColor: '#f3f4f6',
            borderColor: '#d1d5db',
            color: '#111827',
            borderRadius: '4px'
          },

          '& .ant-select-selection-item-remove': {
            color: '#6b7280'
          },

          '& .ant-select-selection-item-remove:hover': {
            color: '#111827',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          },

          // Switch Components
          '& .ant-switch': {
            backgroundColor: '#d1d5db'
          },

          '& .ant-switch-checked': {
            backgroundColor: '#10b981'
          },

          '& .ant-switch-inner': {
            color: '#ffffff'
          },

          // Input affix wrapper
          '& .ant-input-affix-wrapper': {
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            borderRadius: '6px'
          },

          '& .ant-input-affix-wrapper input': {
            backgroundColor: 'transparent',
            color: '#111827'
          },

          '& .ant-input-prefix': {
            color: '#6b7280'
          },

          // Character count
          '& .ant-input-show-count-suffix, & .ant-input-data-count': {
            color: '#6b7280'
          }
        },

        // Dark Mode Global Form
        '.dark .global-form': {
          '& .ant-form-item-label > label': {
            color: '#e5e7eb',
            fontWeight: '500'
          },

          '& .ant-form-item-extra': {
            color: '#9ca3af'
          },

          // Input Fields - Dark Mode
          '& .ant-input, & input.ant-input, & input[type="text"], & input[type="number"], & input[type="date"], & input':
            {
              backgroundColor: '#4b5563',
              borderColor: '#6b7280',
              color: '#f9fafb'
            },

          '& .ant-input:focus, & input.ant-input:focus, & input[type="text"]:focus, & input[type="number"]:focus, & input[type="date"]:focus, & input:focus':
            {
              borderColor: '#059669',
              boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
              backgroundColor: '#4b5563',
              color: '#f9fafb'
            },

          '& .ant-input::placeholder, & input::placeholder': {
            color: '#9ca3af',
            opacity: '1'
          },

          // TextArea Fields - Dark Mode
          '& textarea.ant-input, & textarea': {
            backgroundColor: '#4b5563',
            borderColor: '#6b7280',
            color: '#f9fafb'
          },

          '& textarea.ant-input:focus, & textarea:focus': {
            borderColor: '#059669',
            boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
            backgroundColor: '#4b5563',
            color: '#f9fafb'
          },

          '& textarea.ant-input::placeholder, & textarea::placeholder': {
            color: '#9ca3af',
            opacity: '1'
          },

          // Select Components - Dark Mode
          '& .ant-select, & .ant-select-selector, & .ant-select-single .ant-select-selector': {
            backgroundColor: '#4b5563',
            borderColor: '#6b7280',
            color: '#f9fafb'
          },

          '& .ant-select-focused .ant-select-selector, & .ant-select:focus .ant-select-selector': {
            borderColor: '#059669',
            boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
            backgroundColor: '#4b5563'
          },

          '& .ant-select-selection-placeholder': {
            color: '#9ca3af',
            opacity: '1'
          },

          '& .ant-select-selection-item': {
            color: '#f9fafb',
            backgroundColor: 'transparent'
          },

          '& .ant-select-arrow': {
            color: '#9ca3af'
          },

          // Multi-select tags - Dark Mode
          '& .ant-select-multiple .ant-select-selection-item': {
            backgroundColor: '#374151',
            borderColor: '#6b7280',
            color: '#f9fafb'
          },

          '& .ant-select-selection-item-remove': {
            color: '#9ca3af'
          },

          '& .ant-select-selection-item-remove:hover': {
            color: '#f9fafb',
            backgroundColor: 'rgba(239, 68, 68, 0.2)'
          },

          // Switch Components - Dark Mode
          '& .ant-switch': {
            backgroundColor: '#6b7280'
          },

          '& .ant-switch-checked': {
            backgroundColor: '#10b981'
          },

          '& .ant-switch-inner': {
            color: '#f9fafb'
          },

          // Input affix wrapper - Dark Mode
          '& .ant-input-affix-wrapper': {
            backgroundColor: '#4b5563',
            borderColor: '#6b7280'
          },

          '& .ant-input-affix-wrapper input': {
            backgroundColor: 'transparent',
            color: '#f9fafb'
          },

          '& .ant-input-prefix': {
            color: '#9ca3af'
          },

          // Character count - Dark Mode
          '& .ant-input-show-count-suffix, & .ant-input-data-count': {
            color: '#9ca3af'
          }
        },

        // Global Form Action Buttons - High Specificity to Override Ant Design
        '.form-btn-primary, .form-btn-primary.ant-btn': {
          backgroundColor: '#059669 !important',
          borderColor: '#059669 !important',
          color: '#ffffff !important',
          fontWeight: '500 !important',
          padding: '8px 24px !important',
          height: 'auto !important',
          minHeight: '40px !important',
          display: 'inline-flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          fontSize: '14px !important',
          borderRadius: '6px !important',
          transition: 'all 0.2s ease !important',
          border: '1px solid #059669 !important',
          boxShadow: 'none !important'
        },

        '.form-btn-primary:hover, .form-btn-primary.ant-btn:hover': {
          backgroundColor: '#047857 !important',
          borderColor: '#047857 !important',
          color: '#ffffff !important',
          transform: 'none !important'
        },

        '.form-btn-primary:focus, .form-btn-primary.ant-btn:focus': {
          backgroundColor: '#059669 !important',
          borderColor: '#059669 !important',
          color: '#ffffff !important',
          boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2) !important'
        },

        '.form-btn-primary .anticon, .form-btn-primary svg': {
          color: '#ffffff !important',
          marginRight: '8px !important'
        },

        '.form-btn-secondary, .form-btn-secondary.ant-btn': {
          backgroundColor: '#ffffff !important',
          borderColor: '#d1d5db !important',
          color: '#374151 !important',
          fontWeight: '500 !important',
          padding: '8px 24px !important',
          height: 'auto !important',
          minHeight: '40px !important',
          display: 'inline-flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          fontSize: '14px !important',
          borderRadius: '6px !important',
          transition: 'all 0.2s ease !important',
          border: '1px solid #d1d5db !important',
          boxShadow: 'none !important'
        },

        '.form-btn-secondary:hover, .form-btn-secondary.ant-btn:hover': {
          backgroundColor: '#f9fafb !important',
          borderColor: '#9ca3af !important',
          color: '#111827 !important',
          transform: 'none !important'
        },

        '.form-btn-secondary:focus, .form-btn-secondary.ant-btn:focus': {
          backgroundColor: '#ffffff !important',
          borderColor: '#059669 !important',
          color: '#374151 !important',
          boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2) !important'
        },

        '.form-btn-secondary .anticon, .form-btn-secondary svg': {
          color: '#374151 !important',
          marginRight: '8px !important'
        },

        // Dark Mode Secondary Button
        '.dark .form-btn-secondary, .dark .form-btn-secondary.ant-btn': {
          backgroundColor: '#4b5563 !important',
          borderColor: '#6b7280 !important',
          color: '#f9fafb !important'
        },

        '.dark .form-btn-secondary:hover, .dark .form-btn-secondary.ant-btn:hover': {
          backgroundColor: '#374151 !important',
          borderColor: '#4b5563 !important',
          color: '#ffffff !important',
          transform: 'none !important'
        },

        '.dark .form-btn-secondary:focus, .dark .form-btn-secondary.ant-btn:focus': {
          backgroundColor: '#4b5563 !important',
          borderColor: '#059669 !important',
          color: '#f9fafb !important',
          boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2) !important'
        },

        '.dark .form-btn-secondary .anticon, .dark .form-btn-secondary svg': {
          color: '#f9fafb !important',
          marginRight: '8px !important'
        },

        '.form-btn-danger, .form-btn-danger.ant-btn': {
          backgroundColor: '#dc2626 !important',
          borderColor: '#dc2626 !important',
          color: '#ffffff !important',
          fontWeight: '500 !important',
          padding: '8px 24px !important',
          height: 'auto !important',
          minHeight: '40px !important',
          display: 'inline-flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          fontSize: '14px !important',
          borderRadius: '6px !important',
          transition: 'all 0.2s ease !important',
          border: '1px solid #dc2626 !important',
          boxShadow: 'none !important'
        },

        '.form-btn-danger:hover, .form-btn-danger.ant-btn:hover': {
          backgroundColor: '#b91c1c !important',
          borderColor: '#b91c1c !important',
          color: '#ffffff !important',
          transform: 'none !important'
        },

        '.form-btn-danger:focus, .form-btn-danger.ant-btn:focus': {
          backgroundColor: '#dc2626 !important',
          borderColor: '#dc2626 !important',
          color: '#ffffff !important',
          boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.2) !important'
        },

        '.form-btn-danger .anticon, .form-btn-danger svg': {
          color: '#ffffff !important',
          marginRight: '8px !important'
        },

        // Global Dropdown Styling (Light Mode)
        '.global-dropdown': {
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },

        '.global-dropdown .ant-select-item': {
          color: '#111827',
          backgroundColor: 'transparent',
          padding: '8px 12px'
        },

        '.global-dropdown .ant-select-item:hover': {
          backgroundColor: '#f3f4f6',
          color: '#111827'
        },

        '.global-dropdown .ant-select-item-option-selected': {
          backgroundColor: '#10b981',
          color: '#ffffff'
        },

        '.global-dropdown .ant-select-item-option-active': {
          backgroundColor: '#f3f4f6',
          color: '#111827'
        },

        // Global Dropdown Styling (Dark Mode)
        '.dark .global-dropdown': {
          backgroundColor: '#374151',
          border: '1px solid #4b5563',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        },

        '.dark .global-dropdown .ant-select-item': {
          color: '#f9fafb',
          backgroundColor: 'transparent'
        },

        '.dark .global-dropdown .ant-select-item:hover': {
          backgroundColor: '#4b5563',
          color: '#f9fafb'
        },

        '.dark .global-dropdown .ant-select-item-option-selected': {
          backgroundColor: '#10b981',
          color: '#ffffff'
        },

        '.dark .global-dropdown .ant-select-item-option-active': {
          backgroundColor: '#4b5563',
          color: '#f9fafb'
        }
      })

      // Utility Classes
      addUtilities({
        // Chat File Input
        '.chat-file-input': {
          display: 'none'
        },

        // Magic Link Icon
        '.magic-link-icon': {
          color: '#059669'
        },

        // Chat Text Utilities
        '.chat-drop-text': {
          fontWeight: '500',
          color: '#059669'
        },

        '.dark .chat-drop-text': {
          color: '#34d399'
        },

        '.chat-drop-subtext': {
          fontSize: '0.75rem',
          marginTop: '0.25rem',
          color: 'rgba(75, 85, 99, 1)'
        },

        '.dark .chat-drop-subtext': {
          color: 'rgba(229, 231, 235, 0.9)'
        },

        '.chat-status-text': {
          fontSize: '0.75rem',
          color: 'rgba(75, 85, 99, 0.8)'
        },

        '.dark .chat-status-text': {
          color: 'rgba(229, 231, 235, 0.9)'
        },

        '.chat-streaming-dot': {
          width: '0.375rem',
          height: '0.375rem',
          backgroundColor: '#10b981',
          borderRadius: '9999px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        },

        '.chat-streaming-dot:nth-child(2)': {
          animationDelay: '0.2s'
        },

        '.chat-streaming-dot:nth-child(3)': {
          animationDelay: '0.4s'
        },

        '.chat-cancel-button': {
          color: '#ef4444'
        },

        '.chat-streaming-toggle-text': {
          fontSize: '0.75rem',
          color: 'rgba(75, 85, 99, 0.8)'
        },

        '.dark .chat-streaming-toggle-text': {
          color: 'rgba(229, 231, 235, 0.9)'
        },

        '.chat-streaming-toggle-enabled': {
          color: '#059669'
        },

        '.chat-streaming-toggle-disabled': {
          color: 'rgba(75, 85, 99, 0.6)'
        },

        '.dark .chat-streaming-toggle-disabled': {
          color: 'rgba(229, 231, 235, 0.6)'
        },

        // Common Button Gradients
        '.gradient-button-primary': {
          background: 'linear-gradient(135deg, #5ba3d4 0%, #4a90a4 25%, #16a085 60%, #059669 100%)'
        },

        '.dark .gradient-button-primary': {
          background: 'linear-gradient(135deg, #1e3a52 0%, #4a90a4 35%, #059669 70%, #065f46 100%)'
        },

        '.gradient-button-secondary': {
          background: 'linear-gradient(135deg, #5ba3d4, #16a085)'
        },

        // Common Text Utilities
        '.text-primary': {
          color: '#111827'
        },

        '.dark .text-primary': {
          color: '#f9fafb'
        },

        '.text-secondary': {
          color: '#6b7280'
        },

        '.dark .text-secondary': {
          color: '#d1d5db'
        },

        '.text-muted': {
          color: '#9ca3af'
        },

        '.dark .text-muted': {
          color: '#6b7280'
        },

        '.text-brand-primary': {
          color: '#4a90a4'
        },

        '.text-brand-secondary': {
          color: '#059669'
        },

        '.bg-brand-primary': {
          backgroundColor: '#4a90a4'
        },

        '.bg-brand-secondary': {
          backgroundColor: '#059669'
        },

        // Loading and Disabled States
        '.loading-opacity': {
          opacity: '0.6'
        },

        '.disabled-opacity': {
          opacity: '0.5'
        },

        // Spacing Utilities
        '.spacing-xs': {
          margin: '4px'
        },

        '.spacing-sm': {
          margin: '8px'
        },

        '.spacing-md': {
          margin: '16px'
        },

        '.spacing-lg': {
          margin: '24px'
        },

        '.spacing-xl': {
          margin: '32px'
        },

        // Border Radius Utilities
        '.rounded-xs': {
          borderRadius: '4px'
        },

        '.rounded-sm': {
          borderRadius: '6px'
        },

        '.rounded-md': {
          borderRadius: '8px'
        },

        '.rounded-lg': {
          borderRadius: '12px'
        },

        '.rounded-xl': {
          borderRadius: '16px'
        }
      })
    }
  ]
}
