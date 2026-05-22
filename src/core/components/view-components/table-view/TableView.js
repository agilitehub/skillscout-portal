// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo, useCallback } from 'react'
import { Table, Input, Card } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../context/ThemeContext'

import './styles/table-view.css'

const { Search } = Input

/** Ant Design 6 Select props for pagination page-size control in dark mode */
const DARK_PAGINATION_SIZE_SELECT = {
  className: 'table-pagination-size-select',
  popupClassName: 'table-pagination-size-dropdown',
  classNames: {
    popup: {
      root: 'table-pagination-size-dropdown'
    }
  },
  styles: {
    root: {
      backgroundColor: '#4b5563',
      borderColor: '#6b7280',
      color: '#f9fafb'
    },
    content: {
      color: '#f9fafb'
    },
    suffix: {
      color: '#e5e7eb'
    }
  }
}

const mergeShowSizeChangerForDarkMode = (showSizeChanger, isDark) => {
  if (!isDark || showSizeChanger === false) {
    return showSizeChanger
  }

  if (showSizeChanger === true || showSizeChanger === undefined) {
    return { ...DARK_PAGINATION_SIZE_SELECT }
  }

  if (typeof showSizeChanger === 'object') {
    return {
      ...DARK_PAGINATION_SIZE_SELECT,
      ...showSizeChanger,
      className: [DARK_PAGINATION_SIZE_SELECT.className, showSizeChanger.className].filter(Boolean).join(' '),
      popupClassName: [DARK_PAGINATION_SIZE_SELECT.popupClassName, showSizeChanger.popupClassName]
        .filter(Boolean)
        .join(' '),
      classNames: {
        ...DARK_PAGINATION_SIZE_SELECT.classNames,
        ...showSizeChanger.classNames,
        popup: {
          root: [DARK_PAGINATION_SIZE_SELECT.classNames?.popup?.root, showSizeChanger.classNames?.popup?.root]
            .filter(Boolean)
            .join(' ')
        }
      },
      styles: {
        root: { ...DARK_PAGINATION_SIZE_SELECT.styles.root, ...showSizeChanger.styles?.root },
        content: { ...DARK_PAGINATION_SIZE_SELECT.styles.content, ...showSizeChanger.styles?.content },
        suffix: { ...DARK_PAGINATION_SIZE_SELECT.styles.suffix, ...showSizeChanger.styles?.suffix }
      }
    }
  }

  return showSizeChanger
}

/**
 * Reusable TableView Component
 * A comprehensive table component with dark mode support, search, pagination, and expandable rows
 *
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table columns configuration
 * @param {Array} props.dataSource - Table data source
 * @param {boolean} props.loading - Loading state
 * @param {string} props.searchTerm - Current search term
 * @param {function} props.onSearch - Search handler function
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {Object} props.pagination - Pagination configuration
 * @param {function} props.expandedRowRender - Function to render expanded row content
 * @param {Object} props.scroll - Table scroll configuration
 * @param {string} props.rowKey - Row key property
 * @param {function} props.onRow - Row event handlers
 * @param {boolean} props.showSearch - Whether to show search input
 * @param {Object} props.cardProps - Additional card props
 * @param {Object} props.tableProps - Additional table props
 * @param {function} props.rowClassName - Custom row className function
 * @param {Array} props.toolbarActions - Custom toolbar actions
 * @param {string} props.emptyText - Custom empty text
 */
const TableView = React.memo(
  ({
    columns = [],
    dataSource = [],
    loading = false,
    searchTerm = '',
    onSearch,
    searchPlaceholder = 'Search...',
    pagination = true,
    expandedRowRender,
    scroll = { x: 1200 },
    rowKey = 'id',
    onRow,
    showSearch = true,
    cardProps = {},
    tableProps = {},
    rowClassName,
    toolbarActions = [],
    emptyText = 'No data available'
  }) => {
    const { darkMode } = useTheme()

    // Default pagination configuration
    const defaultPagination = useMemo(
      () => ({
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => (
          <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>{`${range[0]}-${range[1]} of ${total} items`}</span>
        ),
        className: darkMode ? 'dark-pagination' : '',
        itemRender: (current, type, originalElement) => {
          if (type === 'prev' || type === 'next' || type === 'jump-prev' || type === 'jump-next') {
            return React.cloneElement(originalElement, {
              style: {
                ...originalElement.props.style,
                color: darkMode ? '#ffffff' : '#000000',
                backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                borderColor: darkMode ? '#6b7280' : '#d9d9d9'
              }
            })
          }
          if (type === 'page') {
            return React.cloneElement(originalElement, {
              style: {
                ...originalElement.props.style,
                color: darkMode ? '#ffffff' : '#000000',
                backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                borderColor: darkMode ? '#6b7280' : '#d9d9d9'
              }
            })
          }
          return originalElement
        }
      }),
      [darkMode]
    )

    // Merge pagination configurations (preserve dark page-size Select when callers pass showSizeChanger: true)
    const finalPagination = useMemo(() => {
      if (pagination === false) return false

      const base = pagination === true ? defaultPagination : { ...defaultPagination, ...pagination }
      return {
        ...base,
        showSizeChanger: mergeShowSizeChangerForDarkMode(base.showSizeChanger, darkMode)
      }
    }, [pagination, defaultPagination, darkMode])

    // Handle search change
    const handleSearch = useCallback(
      (e) => {
        if (onSearch) {
          onSearch(e.target.value)
        }
      },
      [onSearch]
    )

    // Handle search button click
    const handleSearchClick = useCallback(
      (value) => {
        if (onSearch) {
          onSearch(value)
        }
      },
      [onSearch]
    )

    // Custom table components for dark mode
    const tableComponents = useMemo(
      () => ({
        header: {
          cell: (props) => (
            <th
              {...props}
              style={{
                backgroundColor: darkMode ? '#4b5563' : '#fafafa',
                color: darkMode ? '#ffffff' : '#000000',
                borderBottom: darkMode ? '1px solid #6b7280' : '1px solid #f0f0f0',
                ...props.style
              }}
            />
          )
        },
        body: {
          row: (props) => {
            const customClassName = rowClassName ? rowClassName(props.record, props.index) : ''
            return (
              <tr
                {...props}
                className={customClassName}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderBottom: darkMode ? '1px solid #4b5563' : '1px solid #f0f0f0',
                  ...props.style
                }}
                onMouseEnter={(e) => {
                  if (darkMode) {
                    e.currentTarget.style.backgroundColor = '#4b5563'
                  } else {
                    e.currentTarget.style.backgroundColor = '#fafafa'
                  }
                }}
                onMouseLeave={(e) => {
                  if (darkMode) {
                    e.currentTarget.style.backgroundColor = '#374151'
                  } else {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                  }
                }}
              />
            )
          },
          cell: (props) => (
            <td
              {...props}
              style={{
                backgroundColor: 'transparent',
                color: darkMode ? '#ffffff' : '#000000',
                borderBottom: darkMode ? '1px solid #4b5563' : '1px solid #f0f0f0',
                ...props.style
              }}
            />
          )
        }
      }),
      [darkMode, rowClassName]
    )

    // Expandable configuration
    const expandable = useMemo(() => {
      if (!expandedRowRender) return undefined

      return {
        expandedRowRender,
        expandRowByClick: false,
        expandIcon: ({ expanded, onExpand, record }) => (
          <button
            type='button'
            onClick={(e) => onExpand(record, e)}
            className={`inline-flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-black hover:text-gray-700'
            }`}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <FontAwesomeIcon 
              icon={expanded ? faMinus : faPlus} 
              className="text-sm"
            />
          </button>
        )
      }
    }, [expandedRowRender, darkMode])

    return (
      <>
        <Card
          className={`table-view-card shadow-xl rounded-lg overflow-hidden ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          {...cardProps}
          styles={{ body: { padding: 0 } }}
        >
          {/* Enhanced Toolbar */}
          {(showSearch || toolbarActions.length > 0) && (
            <div
              className={`px-6 py-4 border-b ${
                darkMode
                  ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700'
                  : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white'
              }`}
            >
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
                {/* Search */}
                {showSearch && onSearch && (
                  <div className='flex-1 max-w-md'>
                    <Search
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={handleSearch}
                      onSearch={handleSearchClick}
                      className={`transition-all duration-200 ${darkMode ? 'dark-search' : ''}`}
                      style={{
                        backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                        borderRadius: '8px',
                        boxShadow: darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </div>
                )}

                {/* Enhanced Toolbar Actions */}
                {toolbarActions.length > 0 && (
                  <div className='flex items-center space-x-3'>
                    {toolbarActions.map((action, index) => (
                      <div key={index} className='transform hover:scale-105 transition-transform duration-200'>
                        {action}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Table */}
          <div className='p-6'>
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              rowKey={rowKey}
              pagination={finalPagination}
              className={`${darkMode ? 'dark-table' : ''} enhanced-table`}
              scroll={scroll}
              style={{
                backgroundColor: 'transparent'
              }}
              components={tableComponents}
              expandable={expandable}
              onRow={onRow}
              locale={{
                emptyText: (
                  <div className={`py-16 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className='mb-6'>
                      <div
                        className={`w-20 h-20 mx-auto rounded-full ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } flex items-center justify-center`}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={`text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                        />
                      </div>
                    </div>
                    <h3 className='text-lg font-semibold mb-2'>{emptyText}</h3>
                    <p className='text-sm opacity-75'>Get started by adding your first item.</p>
                  </div>
                )
              }}
              {...tableProps}
            />
          </div>
        </Card>
      </>
    )
  }
)

TableView.displayName = 'TableView'

export default TableView
