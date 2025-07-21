// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo, useCallback } from 'react'
import { Table, Input, Card, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../ui/ThemeContext'

const { Search } = Input

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

    // Merge pagination configurations
    const finalPagination = useMemo(() => {
      if (pagination === false) return false
      if (pagination === true) return defaultPagination
      return { ...defaultPagination, ...pagination }
    }, [pagination, defaultPagination])

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
          <Button
            type='text'
            size='small'
            icon={<FontAwesomeIcon icon={expanded ? faMinus : faPlus} />}
            onClick={(e) => onExpand(record, e)}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          />
        )
      }
    }, [expandedRowRender, darkMode])

    return (
      <>
        {/* Dark Mode Styles */}
        {darkMode && (
          <style jsx global>{`
            .dark-search .ant-input {
              background-color: #4b5563 !important;
              border-color: #6b7280 !important;
              color: #ffffff !important;
            }
            .dark-search .ant-input::placeholder {
              color: #9ca3af !important;
            }
            .dark-search .ant-input-search-button {
              background-color: #6b7280 !important;
              border-color: #6b7280 !important;
            }
            .dark-table .ant-table-thead > tr > th {
              background-color: #4b5563 !important;
              color: #ffffff !important;
              border-bottom: 1px solid #6b7280 !important;
            }
            .dark-table .ant-table-tbody > tr > td {
              background-color: transparent !important;
              color: #ffffff !important;
              border-bottom: 1px solid #4b5563 !important;
            }
            .dark-table .ant-table-tbody > tr:hover > td {
              background-color: #4b5563 !important;
            }
            .dark-table .ant-table-placeholder {
              color: #9ca3af !important;
            }
            .dark-table .ant-empty-description {
              color: #9ca3af !important;
            }
            .dark-pagination .ant-pagination-item {
              background-color: #4b5563 !important;
              border-color: #6b7280 !important;
            }
            .dark-pagination .ant-pagination-item a {
              color: #ffffff !important;
            }
            .dark-pagination .ant-pagination-item-active {
              background-color: #059669 !important;
              border-color: #059669 !important;
            }
            .dark-pagination .ant-pagination-item-active a {
              color: #ffffff !important;
            }
            .dark-pagination .ant-pagination-prev,
            .dark-pagination .ant-pagination-next {
              background-color: #4b5563 !important;
              border-color: #6b7280 !important;
            }
            .dark-pagination .ant-pagination-prev a,
            .dark-pagination .ant-pagination-next a {
              color: #ffffff !important;
            }
            .dark-pagination .ant-pagination-jump-prev,
            .dark-pagination .ant-pagination-jump-next {
              background-color: #4b5563 !important;
              border-color: #6b7280 !important;
            }
            .dark-pagination .ant-pagination-jump-prev a,
            .dark-pagination .ant-pagination-jump-next a {
              color: #ffffff !important;
            }
            .dark-pagination .ant-pagination-options {
              color: #ffffff !important;
            }
            .dark-pagination .ant-select-selector {
              background-color: #4b5563 !important;
              border-color: #6b7280 !important;
              color: #ffffff !important;
            }
            .dark-pagination .ant-select-arrow {
              color: #ffffff !important;
            }
            .dark-pagination .ant-pagination-total-text {
              color: #ffffff !important;
            }
          `}</style>
        )}

        <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : ''} shadow-lg`} {...cardProps}>
          {/* Toolbar */}
          {(showSearch || toolbarActions.length > 0) && (
            <div className='flex items-center justify-between mb-4'>
              {/* Custom toolbar actions */}
              {toolbarActions.length > 0 && <div className='flex items-center space-x-3'>{toolbarActions}</div>}

              {/* Search */}
              {showSearch && onSearch && (
                <Search
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearch}
                  onSearch={handleSearchClick}
                  className={`w-64 ${darkMode ? 'dark-search' : ''}`}
                  style={{
                    backgroundColor: darkMode ? '#4b5563' : '#ffffff'
                  }}
                />
              )}
            </div>
          )}

          {/* Table */}
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey={rowKey}
            pagination={finalPagination}
            className={darkMode ? 'dark-table' : ''}
            scroll={scroll}
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff'
            }}
            components={tableComponents}
            expandable={expandable}
            onRow={onRow}
            locale={{
              emptyText: <div className={`py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emptyText}</div>
            }}
            {...tableProps}
          />
        </Card>
      </>
    )
  }
)

TableView.displayName = 'TableView'

export default TableView
