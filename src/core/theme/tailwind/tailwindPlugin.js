// Global Instructions Rule Applied!

const themeTokens = require('./themeTokens')

const t = themeTokens

/**
 * Tailwind plugin — shared component styles using CSS tokens from tokens.css.
 * Light/dark values switch via .dark on <html>; no duplicate .dark rules unless Ant Design needs !important.
 */
module.exports = function skillScoutTailwindPlugin({ addUtilities, addComponents }) {
  addComponents({
    '.enhanced-table': {
      '& .ant-table-thead > tr > th': {
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        padding: '16px 12px',
        background: t.tableHeaderGradient,
        color: t.tableHeaderText,
        borderBottom: `2px solid ${t.border}`
      },
      '& .ant-table-tbody > tr > td': {
        padding: '16px 12px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${t.tableRowBorder}`,
        color: t.foreground
      },
      '& .ant-table-tbody > tr:hover > td': {
        transform: 'translateY(-1px)',
        background: t.tableRowHoverGradient,
        boxShadow: t.tableRowHoverShadow
      },
      '& .ant-table-tbody > tr.ant-table-row-selected > td': {
        background: t.tableSelectedGradient,
        color: t.tableSelectedText
      },
      '& .ant-input-search:hover': {
        borderColor: `${t.brandSecondary} !important`
      },
      '& .ant-input-search:focus-within': {
        borderColor: `${t.brandSecondary} !important`,
        boxShadow: `${t.focusRingShadow} !important`
      }
    },

    '.dark-search': {
      '& .ant-input': {
        backgroundColor: `${t.inputBg} !important`,
        borderColor: `${t.inputBorder} !important`,
        color: `${t.onPrimary} !important`,
        borderRadius: '8px !important'
      },
      '& .ant-input:focus': {
        borderColor: `${t.brandSecondary} !important`,
        boxShadow: `${t.focusRingShadow} !important`
      },
      '& .ant-input::placeholder': {
        color: `${t.onPrimary} !important`
      },
      '& .ant-input-search-button': {
        backgroundColor: `${t.inputBorder} !important`,
        borderColor: `${t.inputBorder} !important`,
        borderRadius: '0 8px 8px 0 !important'
      },
      '& .ant-input-search-button:hover': {
        backgroundColor: `${t.brandSecondary} !important`,
        borderColor: `${t.brandSecondary} !important`
      }
    },

    '.dark-table': {
      '& .ant-table-placeholder, & .ant-empty-description, & .ant-table-filter-trigger, & .ant-table-filter-icon, & .ant-table-column-sorter, & .ant-table-column-sorter-up, & .ant-table-column-sorter-down':
        {
          color: `${t.subtle} !important`
        },
      '& .ant-table-filter-trigger:hover, & .ant-table-column-sorter:hover, & .ant-table-column-sorter-up:hover, & .ant-table-column-sorter-down:hover':
        {
          color: `${t.foreground} !important`
        },
      '& .ant-table-filter-trigger-container': {
        backgroundColor: 'transparent !important'
      }
    },

    '.dark-pagination': {
      '& .ant-pagination-item, & .ant-pagination-prev, & .ant-pagination-next, & .ant-pagination-jump-prev, & .ant-pagination-jump-next':
        {
          backgroundColor: `${t.inputBg} !important`,
          borderColor: `${t.inputBorder} !important`
        },
      '& .ant-pagination-item a, & .ant-pagination-prev a, & .ant-pagination-next a, & .ant-pagination-jump-prev a, & .ant-pagination-jump-next a, & .ant-pagination-options, & .ant-pagination-total-text, & .ant-select-arrow':
        {
          color: `${t.onPrimary} !important`
        },
      '& .ant-pagination-item-active': {
        backgroundColor: `${t.brandSecondary} !important`
      },
      '& .ant-select-selector': {
        backgroundColor: `${t.inputBg} !important`,
        borderColor: `${t.inputBorder} !important`,
        color: `${t.onPrimary} !important`
      }
    },

    '.magic-link-button': {
      background: t.gradientMagicLink,
      border: 'none'
    },

    '.magic-link-resend-button': {
      color: 'white',
      border: `1px solid ${t.borderInput}`,
      backgroundColor: t.surface
    },

    '.dark .magic-link-resend-button': {
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },

    '.magic-link-submit-button': {
      background: t.gradientMagicLinkSubmit
    },

    '.chat-drop-zone': {
      background: t.chatDropZone
    },

    '.chat-attach-button': {
      borderRadius: '8px',
      minHeight: '44px',
      width: '44px',
      padding: '0',
      color: t.chatAttach
    },

    '.chat-textarea': {
      padding: '12px 16px',
      fontSize: '0.875rem',
      borderRadius: '8px',
      resize: 'none',
      background: t.inputBg,
      border: `1px solid ${t.borderInput}`,
      color: t.inputText
    },

    '.chat-send-button': {
      background: t.gradientChatSend,
      borderRadius: '8px',
      minHeight: '44px',
      width: '44px',
      padding: '0',
      border: '0'
    },

    '.kanban-select': { width: '140px', height: '32px' },
    '.kanban-job-select': { minWidth: '200px' },

    '.kanban-search-input': {
      borderRadius: '6px',
      backgroundColor: t.inputBg,
      borderColor: t.inputBorder,
      color: t.inputText
    },

    '.kanban-drop-indicator': { height: '4px', margin: '8px 0' },

    '.kanban-drop-indicator-line': {
      width: '100%',
      height: '0.25rem',
      borderRadius: '9999px',
      transition: 'all 0.2s',
      backgroundColor: t.kanbanIndicator,
      boxShadow: t.kanbanIndicatorGlow
    },

    '.kanban-column-title': {
      wordBreak: 'break-word',
      hyphens: 'auto',
      lineHeight: '1.2'
    },

    '.form-input-base': {
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      backgroundColor: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      color: t.inputText
    },

    '.form-input-base:focus': {
      borderColor: t.brandSecondary,
      boxShadow: t.focusRingShadow
    },

    '.modal-base': {
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`
    },

    '.card-base': {
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`,
      boxShadow: t.cardShadow
    },

    '.card-base:hover': {
      transform: 'translateY(-1px)',
      boxShadow: t.cardHoverShadow
    },

    '.global-form': {
      '& .ant-form-item-label > label': {
        color: t.foreground,
        fontWeight: '500'
      },
      '& .ant-form-item-extra': {
        color: t.muted
      },
      '& .ant-input, & input.ant-input, & input[type="text"], & input[type="number"], & input[type="date"], & input':
        {
          backgroundColor: t.inputBg,
          borderColor: t.inputBorder,
          color: t.inputText,
          borderRadius: '6px',
          transition: 'all 0.2s ease'
        },
      '& .ant-input:focus, & input.ant-input:focus, & input[type="text"]:focus, & input[type="number"]:focus, & input[type="date"]:focus, & input:focus':
        {
          borderColor: t.brandSecondary,
          boxShadow: t.focusRingShadow,
          backgroundColor: t.inputBg,
          color: t.inputText
        },
      '& .ant-input::placeholder, & input::placeholder': {
        color: t.placeholder,
        opacity: '1'
      },
      '& textarea.ant-input, & textarea': {
        backgroundColor: t.inputBg,
        borderColor: t.inputBorder,
        color: t.inputText,
        borderRadius: '6px',
        transition: 'all 0.2s ease'
      },
      '& textarea.ant-input:focus, & textarea:focus': {
        borderColor: t.brandSecondary,
        boxShadow: t.focusRingShadow,
        backgroundColor: t.inputBg,
        color: t.inputText
      },
      '& textarea.ant-input::placeholder, & textarea::placeholder': {
        color: t.placeholder,
        opacity: '1'
      },
      '& .ant-select, & .ant-select-selector, & .ant-select-single .ant-select-selector': {
        backgroundColor: t.inputBg,
        borderColor: t.inputBorder,
        color: t.inputText,
        borderRadius: '6px',
        transition: 'all 0.2s ease'
      },
      '& .ant-select-focused .ant-select-selector, & .ant-select:focus .ant-select-selector': {
        borderColor: t.brandSecondary,
        boxShadow: t.focusRingShadow,
        backgroundColor: t.inputBg
      },
      '& .ant-select-selection-placeholder': {
        color: t.placeholder,
        opacity: '1'
      },
      '& .ant-select-selection-item': {
        color: t.inputText,
        backgroundColor: 'transparent'
      },
      '& .ant-select-arrow': {
        color: t.muted
      },
      '& .ant-select:not(.ant-select-disabled)': {
        cursor: 'pointer'
      },
      '& .ant-select:not(.ant-select-disabled) .ant-select-input, & .ant-select:not(.ant-select-disabled) .ant-select-content, & .ant-select:not(.ant-select-disabled) .ant-select-content-value, & .ant-select:not(.ant-select-disabled) .ant-select-suffix, & .ant-select:not(.ant-select-disabled) .ant-select-selector':
        {
          cursor: 'pointer'
        },
      '& .ant-select-multiple .ant-select-selection-item': {
        backgroundColor: t.tagBg,
        borderColor: t.inputBorder,
        color: t.inputText,
        borderRadius: '4px'
      },
      '& .ant-select-selection-item-remove': {
        color: t.muted
      },
      '& .ant-select-selection-item-remove:hover': {
        color: t.foreground,
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      },
      '& .ant-switch': {
        backgroundColor: t.switchTrack
      },
      '& .ant-switch-checked': {
        backgroundColor: t.success
      },
      '& .ant-switch-inner': {
        color: t.onPrimary
      },
      '& .ant-input-affix-wrapper': {
        backgroundColor: t.inputBg,
        borderColor: t.inputBorder,
        borderRadius: '6px'
      },
      '& .ant-input-affix-wrapper input': {
        backgroundColor: 'transparent',
        color: t.inputText
      },
      '& .ant-input-prefix, & .ant-input-show-count-suffix, & .ant-input-data-count': {
        color: t.muted
      }
    },

    '.dark .global-form': {
      '--ant-color-text': 'rgb(var(--color-input-text))',
      '--ant-color-text-placeholder': 'rgb(var(--color-placeholder))',
      '--ant-color-text-description': 'rgb(var(--color-placeholder))',

      '& .ant-input, & input.ant-input, & input[type="text"], & input[type="number"], & input[type="date"], & input':
        {
          color: `${t.inputText} !important`
        },
      '& .ant-input:focus, & input.ant-input:focus, & input[type="text"]:focus, & input[type="number"]:focus, & input[type="date"]:focus, & input:focus':
        {
          color: `${t.inputText} !important`
        },
      '& textarea.ant-input, & textarea, & textarea.ant-input:focus, & textarea:focus': {
        color: `${t.inputText} !important`
      },
      '& .ant-select, & .ant-select-selector, & .ant-select-single .ant-select-selector': {
        '--ant-select-color': 'rgb(var(--color-input-text))',
        '--ant-color-text-placeholder': 'rgb(var(--color-placeholder))'
      },
      '& .ant-select-selection-placeholder, & .ant-select .ant-select-placeholder': {
        WebkitTextFillColor: 'rgb(var(--color-placeholder))'
      },
      '& .ant-select .ant-select-content, & .ant-select .ant-select-content-value, & .ant-select-selection-item, & .ant-select-multiple .ant-select-selection-item-content':
        {
          color: `${t.inputText} !important`
        },
      '& .ant-select .ant-select-content-value.ant-select-selection-placeholder, & .ant-select input.ant-select-input::placeholder':
        {
          color: 'rgb(var(--color-placeholder)) !important',
          WebkitTextFillColor: 'rgb(var(--color-placeholder))'
        },
      '& .ant-select input.ant-select-input': {
        color: `${t.inputText} !important`,
        WebkitTextFillColor: 'rgb(var(--color-input-text))'
      },
      '& .ant-select-arrow, & .ant-select-suffix, & .ant-select-selection-item-remove, & .ant-input-prefix, & .ant-input-show-count-suffix, & .ant-input-data-count':
        {
          color: 'rgb(var(--color-placeholder))'
      },
      '& .ant-select-selection-item-remove:hover': {
        color: t.inputText,
        backgroundColor: 'rgba(239, 68, 68, 0.2)'
      },
      '& .ant-input-affix-wrapper input': {
        color: `${t.inputText} !important`
      }
    },

    '.form-btn-primary, .form-btn-primary.ant-btn': {
      backgroundColor: `${t.brandSecondary} !important`,
      borderColor: `${t.brandSecondary} !important`,
      color: `${t.onPrimary} !important`,
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
      border: `1px solid ${t.brandSecondary} !important`,
      boxShadow: 'none !important'
    },

    '.form-btn-primary:hover, .form-btn-primary.ant-btn:hover': {
      backgroundColor: `${t.brandSecondaryHover} !important`,
      borderColor: `${t.brandSecondaryHover} !important`,
      color: `${t.onPrimary} !important`,
      transform: 'none !important'
    },

    '.form-btn-primary:focus, .form-btn-primary.ant-btn:focus': {
      backgroundColor: `${t.brandSecondary} !important`,
      borderColor: `${t.brandSecondary} !important`,
      color: `${t.onPrimary} !important`,
      boxShadow: `${t.focusRingShadow} !important`
    },

    '.form-btn-primary .anticon, .form-btn-primary svg': {
      color: `${t.onPrimary} !important`,
      marginRight: '8px !important'
    },

    '.form-btn-secondary, .form-btn-secondary.ant-btn': {
      backgroundColor: `${t.btnSecondaryBg} !important`,
      borderColor: `${t.btnSecondaryBorder} !important`,
      color: `${t.btnSecondaryText} !important`,
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
      border: `1px solid ${t.btnSecondaryBorder} !important`,
      boxShadow: 'none !important'
    },

    '.form-btn-secondary:hover, .form-btn-secondary.ant-btn:hover': {
      backgroundColor: `${t.btnSecondaryHoverBg} !important`,
      borderColor: `${t.btnSecondaryHoverBorder} !important`,
      color: `${t.btnSecondaryHoverText} !important`,
      transform: 'none !important'
    },

    '.form-btn-secondary:focus, .form-btn-secondary.ant-btn:focus': {
      backgroundColor: `${t.btnSecondaryBg} !important`,
      borderColor: `${t.brandSecondary} !important`,
      color: `${t.btnSecondaryText} !important`,
      boxShadow: `${t.focusRingShadow} !important`
    },

    '.form-btn-secondary .anticon, .form-btn-secondary svg': {
      color: `${t.btnSecondaryText} !important`,
      marginRight: '8px !important'
    },

    '.form-btn-danger, .form-btn-danger.ant-btn': {
      backgroundColor: `${t.danger} !important`,
      borderColor: `${t.danger} !important`,
      color: `${t.onPrimary} !important`,
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
      border: `1px solid ${t.danger} !important`,
      boxShadow: 'none !important'
    },

    '.form-btn-danger:hover, .form-btn-danger.ant-btn:hover': {
      backgroundColor: `${t.dangerHover} !important`,
      borderColor: `${t.dangerHover} !important`,
      color: `${t.onPrimary} !important`,
      transform: 'none !important'
    },

    '.form-btn-danger:focus, .form-btn-danger.ant-btn:focus': {
      backgroundColor: `${t.danger} !important`,
      borderColor: `${t.danger} !important`,
      color: `${t.onPrimary} !important`,
      boxShadow: '0 0 0 2px rgb(220 38 38 / 0.2) !important'
    },

    '.form-btn-danger .anticon, .form-btn-danger svg': {
      color: `${t.onPrimary} !important`,
      marginRight: '8px !important'
    },

    '.global-dropdown': {
      backgroundColor: t.dropdownBg,
      border: `1px solid ${t.dropdownBorder}`,
      borderRadius: '6px',
      boxShadow: t.dropdownShadow
    },

    '.global-dropdown .ant-select-item': {
      color: t.foreground,
      backgroundColor: 'transparent',
      padding: '8px 12px'
    },

    '.global-dropdown .ant-select-item:hover, .global-dropdown .ant-select-item-option-active': {
      backgroundColor: t.dropdownHoverBg,
      color: t.foreground
    },

    '.global-dropdown .ant-select-item-option-selected': {
      backgroundColor: t.success,
      color: t.onPrimary
    },

    '.global-dropdown .ant-select-item-empty, .global-dropdown .ant-empty, .global-dropdown .ant-empty-description':
      {
        color: t.dropdownEmptyText
      },

    '.dark .global-dropdown .ant-empty-image svg': {
      fill: 'rgb(var(--color-placeholder))'
    }
  })

  addUtilities({
    '.chat-file-input': { display: 'none' },
    '.magic-link-icon': { color: t.brandSecondary },
    '.chat-drop-text': { fontWeight: '500', color: t.brandSecondary },
    '.dark .chat-drop-text': { color: t.brandAccentLight },
    '.chat-drop-subtext, .chat-status-text, .chat-streaming-toggle-text': {
      fontSize: '0.75rem',
      color: t.chatSubtext
    },
    '.chat-drop-subtext': { marginTop: '0.25rem' },
    '.chat-streaming-dot': {
      width: '0.375rem',
      height: '0.375rem',
      backgroundColor: t.success,
      borderRadius: '9999px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    '.chat-streaming-dot:nth-child(2)': { animationDelay: '0.2s' },
    '.chat-streaming-dot:nth-child(3)': { animationDelay: '0.4s' },
    '.chat-cancel-button': { color: '#ef4444' },
    '.chat-streaming-toggle-enabled': { color: t.brandSecondary },
    '.chat-streaming-toggle-disabled': { color: t.chatSubtext },
    '.gradient-button-primary': { background: t.gradientButtonPrimary },
    '.gradient-button-secondary': { background: t.gradientButtonSecondary },
    '.text-primary': { color: t.foreground },
    '.text-secondary': { color: t.muted },
    '.text-muted': { color: t.subtle },
    '.text-brand-primary': { color: t.brandPrimary },
    '.text-brand-secondary': { color: t.brandSecondary },
    '.bg-brand-primary': { backgroundColor: t.brandPrimary },
    '.bg-brand-secondary': { backgroundColor: t.brandSecondary },
    '.loading-opacity': { opacity: '0.6' },
    '.disabled-opacity': { opacity: '0.5' },
    '.spacing-xs': { margin: '4px' },
    '.spacing-sm': { margin: '8px' },
    '.spacing-md': { margin: '16px' },
    '.spacing-lg': { margin: '24px' },
    '.spacing-xl': { margin: '32px' },
    '.rounded-xs': { borderRadius: '4px' },
    '.rounded-sm': { borderRadius: '6px' },
    '.rounded-md': { borderRadius: '8px' },
    '.rounded-lg': { borderRadius: '12px' },
    '.rounded-xl': { borderRadius: '16px' }
  })
}
