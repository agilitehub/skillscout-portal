// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo, useCallback } from 'react'
import { Table, Input, Card } from 'antd'
import { Button } from '../../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../context/ThemeContext'

const { Search } = Input

// Extracted style configurations
const createTableStyles = (darkMode) => ({
  header: {
    backgroundColor: darkMode ? '#4b5563' : '#fafafa',
    color: darkMode ? '#ffffff' : '#000000',
    borderBottom: darkMode ? '1px solid #6b7280' : '1px solid #f0f0f0'
  },
  row: {
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
    borderBottom: darkMode ? '1px solid #4b5563' : '1px solid #f0f0f0'
  },
  rowHover: {
    backgroundColor: darkMode ? '#4b5563' : '#fafafa'
  },
  cell: {
    backgroundColor: 'transparent',
    color: darkMode ? '#ffffff' : '#000000',
    borderBottom: darkMode ? '1px solid #4b5563' : '1px solid #f0f0f0'
  }
})

const createPaginationItemRender = (darkMode) => (current, type, originalElement) => {
  const baseStyle = {
    color: darkMode ? '#ffffff' : '#000000',
    backgroundColor: darkMode ? '#4b5563' : '#ffffff',
    borderColor: darkMode ? '#6b7280' : '#d9d9d9'
  }

  if (['prev', 'next', 'jump-prev', 'jump-next', 'page'].includes(type)) {
    return React.cloneElement(originalElement, {
      style: { ...originalElement.props.style, ...baseStyle }
    })
  }
  return originalElement
}

// Enhanced CSS styles for table theming
const getTableCSS = (darkMode) => `
  /* Enhanced Table Styling */
  .enhanced-table .ant-table-thead > tr > th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 16px 12px;
    ${
      darkMode
        ? `background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
         color: #E5E7EB;
         border-bottom: 2px solid #6B7280;`
        : `background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
         color: #374151;
         border-bottom: 2px solid #E5E7EB;`
    }
  }

  .enhanced-table .ant-table-tbody > tr > td {
    padding: 16px 12px;
    border-bottom: 1px solid ${darkMode ? '#4B5563' : '#F3F4F6'};
    transition: all 0.2s ease;
    ${darkMode ? `background-color: transparent; color: #F9FAFB;` : `background-color: transparent; color: #111827;`}
  }

  .enhanced-table .ant-table-tbody > tr:hover > td {
    ${
      darkMode
        ? `background: linear-gradient(90deg, #374151 0%, #4B5563 100%);
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);`
        : `background: linear-gradient(90deg, #F0F9FF 0%, #ECFDF5 100%);
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`
    }
    transform: translateY(-1px);
  }

  .enhanced-table .ant-table-tbody > tr.ant-table-row-selected > td {
    ${
      darkMode
        ? `background: linear-gradient(90deg, #065F46 0%, #047857 100%); color: #FFFFFF;`
        : `background: linear-gradient(90deg, #ECFDF5 0%, #D1FAE5 100%); color: #065F46;`
    }
  }

  ${
    darkMode
      ? `
    .dark-search .ant-input {
      background-color: #4b5563 !important;
      border-color: #6b7280 !important;
      color: #ffffff !important;
      border-radius: 8px !important;
    }
    .dark-search .ant-input:focus {
      border-color: #059669 !important;
      box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
    }
    .dark-search .ant-input::placeholder { color: #ffffff !important; }
    .dark-search .ant-input-search-button {
      background-color: #6b7280 !important;
      border-color: #6b7280 !important;
      border-radius: 0 8px 8px 0 !important;
    }
    .dark-search .ant-input-search-button:hover {
      background-color: #059669 !important;
      border-color: #059669 !important;
    }
  `
      : `
    .enhanced-table .ant-input-search:hover { border-color: #059669 !important; }
    .enhanced-table .ant-input-search:focus-within {
      border-color: #059669 !important;
      box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
    }
  `
  }

  .dark-table .ant-table-placeholder { color: #9ca3af !important; }
  .dark-table .ant-empty-description { color: #9ca3af !important; }
  .dark-pagination .ant-pagination-item {
    background-color: #4b5563 !important;
    border-color: #6b7280 !important;
  }
  .dark-pagination .ant-pagination-item a { color: #ffffff !important; }
  .dark-pagination .ant-pagination-item-active {
    background-color: #059669 !important;
  }
  .dark-pagination .ant-pagination-item-active a { color: #ffffff !important; }
  .dark-pagination .ant-pagination-prev,
  .dark-pagination .ant-pagination-next {
    background-color: #4b5563 !important;
    border-color: #6b7280 !important;
  }
  .dark-pagination .ant-pagination-prev a,
  .dark-pagination .ant-pagination-next a { color: #ffffff !important; }
  .dark-pagination .ant-pagination-jump-prev,
  .dark-pagination .ant-pagination-jump-next {
    background-color: #4b5563 !important;
    border-color: #6b7280 !important;
  }
  .dark-pagination .ant-pagination-jump-prev a,
  .dark-pagination .ant-pagination-jump-next a { color: #ffffff !important; }
  .dark-pagination .ant-pagination-options { color: #ffffff !important; }
  .dark-pagination .ant-select-selector {
    background-color: #4b5563 !important;
    border-color: #6b7280 !important;
    color: #ffffff !important;
  }
  .dark-pagination .ant-select-arrow { color: #ffffff !important; }
  .dark-pagination .ant-pagination-total-text { color: #ffffff !important; }
  .dark-table .ant-table-filter-trigger { color: #9ca3af !important; }
  .dark-table .ant-table-filter-trigger:hover { color: #ffffff !important; }
  .dark-table .ant-table-filter-trigger-container { background-color: transparent !important; }
  .dark-table .ant-table-filter-icon { color: #9ca3af !important; }
  .dark-table .ant-table-column-sorter { color: #9ca3af !important; }
  .dark-table .ant-table-column-sorter:hover { color: #ffffff !important; }
  .dark-table .ant-table-column-sorter-up,
  .dark-table .ant-table-column-sorter-down { color: #9ca3af !important; }
  .dark-table .ant-table-column-sorter-up:hover,
  .dark-table .ant-table-column-sorter-down:hover { color: #ffffff !important; }
`

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
    showSearch = false,
    cardProps = {},
    tableProps = {},
    rowClassName,
    toolbarActions = [],
    emptyText = 'No data available'
  }) => {
    const { darkMode } = useTheme()

    // Simplified pagination configuration
    const defaultPagination = useMemo(
      () => ({
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => (
          <span style={{ color: darkMode ? '#ffffff' : '#000000' }}>{`${range[0]}-${range[1]} of ${total} items`}</span>
        ),
        className: darkMode ? 'dark-pagination' : '',
        itemRender: createPaginationItemRender(darkMode)
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

    // Simplified table components configuration
    const tableStyles = useMemo(() => createTableStyles(darkMode), [darkMode])

    const tableComponents = useMemo(
      () => ({
        header: {
          cell: (props) => <th {...props} style={{ ...tableStyles.header, ...props.style }} />
        },
        body: {
          row: (props) => {
            const customClassName = rowClassName ? rowClassName(props.record, props.index) : ''
            return (
              <tr
                {...props}
                className={customClassName}
                style={{ ...tableStyles.row, ...props.style }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tableStyles.rowHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = tableStyles.row.backgroundColor
                }}
              />
            )
          },
          cell: (props) => <td {...props} style={{ ...tableStyles.cell, ...props.style }} />
        }
      }),
      [tableStyles, rowClassName]
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
        {/* Enhanced Dark Mode & Light Mode Styles */}
        <style jsx global>
          {getTableCSS(darkMode)}
        </style>

        <Card
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl rounded-lg overflow-hidden`}
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
                      size='large'
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
          <div className='p-2'>
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
