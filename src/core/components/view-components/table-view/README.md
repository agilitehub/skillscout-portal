# TableView and TableActions Components

## Overview

The `TableView` and `TableActions` components are reusable table components designed to standardize table functionality across the application. They provide comprehensive support for dark mode, search, pagination, expandable rows, and action buttons.

## Components

### TableView

A comprehensive table component with dark mode support, search, pagination, and expandable rows.

### TableActions

A reusable component for common table action buttons (view, edit, delete, etc.).

## Features

- ✅ **Dark Mode Support**: Automatic dark mode styling
- ✅ **Search Integration**: Built-in search functionality
- ✅ **Pagination**: Customizable pagination with dark mode support
- ✅ **Expandable Rows**: Support for expandable row content
- ✅ **Action Buttons**: Reusable action button components
- ✅ **Responsive Design**: Mobile-friendly table layouts
- ✅ **Custom Styling**: Flexible styling options
- ✅ **Performance Optimized**: React.memo and callback optimizations

## Installation

```javascript
import TableView from './core/View/TableView'
import TableActions, { ACTION_PRESETS } from './core/View/TableActions'
```

## TableView Props

| Prop                | Type       | Default               | Description                             |
| ------------------- | ---------- | --------------------- | --------------------------------------- | ------------------------ |
| `columns`           | `Array`    | `[]`                  | Table columns configuration             |
| `dataSource`        | `Array`    | `[]`                  | Table data source                       |
| `loading`           | `boolean`  | `false`               | Loading state                           |
| `searchTerm`        | `string`   | `''`                  | Current search term                     |
| `onSearch`          | `function` | `undefined`           | Search handler function                 |
| `searchPlaceholder` | `string`   | `'Search...'`         | Search input placeholder                |
| `pagination`        | `Object    | boolean`              | `true`                                  | Pagination configuration |
| `expandedRowRender` | `function` | `undefined`           | Function to render expanded row content |
| `scroll`            | `Object`   | `{ x: 1200 }`         | Table scroll configuration              |
| `rowKey`            | `string`   | `'id'`                | Row key property                        |
| `onRow`             | `function` | `undefined`           | Row event handlers                      |
| `showSearch`        | `boolean`  | `true`                | Whether to show search input            |
| `cardProps`         | `Object`   | `{}`                  | Additional card props                   |
| `tableProps`        | `Object`   | `{}`                  | Additional table props                  |
| `rowClassName`      | `function` | `undefined`           | Custom row className function           |
| `toolbarActions`    | `Array`    | `[]`                  | Custom toolbar actions                  |
| `emptyText`         | `string`   | `'No data available'` | Custom empty text                       |

## TableActions Props

| Prop      | Type      | Default     | Description                    |
| --------- | --------- | ----------- | ------------------------------ |
| `record`  | `Object`  | `undefined` | Table record data              |
| `actions` | `Array`   | `[]`        | Array of action configurations |
| `size`    | `string`  | `'small'`   | Button size                    |
| `wrap`    | `boolean` | `true`      | Whether to wrap actions        |

## Action Presets

```javascript
import { ACTION_PRESETS } from './core/View/TableActions'

// Available presets:
ACTION_PRESETS.BASIC // ['view', 'edit', 'delete']
ACTION_PRESETS.VIEW_ONLY // ['view']
ACTION_PRESETS.EDIT_DELETE // ['edit', 'delete']
ACTION_PRESETS.JOB_ACTIONS // ['view', 'description', 'assessment', 'edit', 'delete']
ACTION_PRESETS.DOCUMENT_ACTIONS // ['view', 'edit', 'download', 'share', 'delete']
ACTION_PRESETS.ASSESSMENT_ACTIONS // ['view', 'edit', 'copy', 'delete']
```

## Basic Usage

### Simple Table with Search

```javascript
import React, { useState } from 'react'
import TableView from './core/View/TableView'
import TableActions from './core/View/TableActions'

const MyTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([{ id: 1, name: 'John Doe', email: 'john@example.com' }])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <TableActions
          record={record}
          actions={[
            { key: 'view', onClick: (record) => console.log('View:', record) },
            { key: 'edit', onClick: (record) => console.log('Edit:', record) },
            {
              key: 'delete',
              onClick: (record) => console.log('Delete:', record),
              confirm: {
                title: 'Delete Item',
                description: 'Are you sure?'
              }
            }
          ]}
        />
      )
    }
  ]

  return (
    <TableView
      columns={columns}
      dataSource={data}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder='Search users...'
    />
  )
}
```

### Table with Expandable Rows

```javascript
const TableWithExpandableRows = () => {
  const expandedRowRender = (record) => (
    <div className='p-4'>
      <p>Additional details for {record.name}</p>
      <p>More information here...</p>
    </div>
  )

  return (
    <TableView
      columns={columns}
      dataSource={data}
      expandedRowRender={expandedRowRender}
      // ... other props
    />
  )
}
```

### Table with Toolbar Actions

```javascript
const TableWithToolbar = () => {
  const toolbarActions = [
    <Button key='create' type='primary' onClick={() => console.log('Create')}>
      Create New
    </Button>,
    <Button key='export' onClick={() => console.log('Export')}>
      Export
    </Button>
  ]

  return (
    <TableView
      columns={columns}
      dataSource={data}
      toolbarActions={toolbarActions}
      // ... other props
    />
  )
}
```

## Migration Guide

### Migrating from Existing Tables

Here's how to migrate your existing table code to use the new components:

#### Before (Original Code)

```javascript
// Old table implementation
<Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : ''} shadow-lg`}>
  <Table
    columns={columns}
    dataSource={data}
    loading={loading}
    // ... lots of custom styling and dark mode logic
  />
</Card>
```

#### After (Using TableView)

```javascript
// New table implementation
<TableView
  columns={columns}
  dataSource={data}
  loading={loading}
  searchTerm={searchTerm}
  onSearch={setSearchTerm}
  // Dark mode and styling handled automatically
/>
```

### Migrating Action Columns

#### Before (Original Code)

```javascript
{
  title: 'Actions',
  key: 'actions',
  render: (_, record) => (
    <Space size='small' wrap>
      <Tooltip title='View'>
        <Button
          type='text'
          size='small'
          icon={<FontAwesomeIcon icon={faEye} />}
          onClick={() => handleView(record)}
          className='text-blue-500 hover:text-blue-700'
        />
      </Tooltip>
      <Tooltip title='Edit'>
        <Button
          type='text'
          size='small'
          icon={<FontAwesomeIcon icon={faEdit} />}
          onClick={() => handleEdit(record)}
          className='text-green-500 hover:text-green-700'
        />
      </Tooltip>
      <Popconfirm
        title='Delete Item'
        description='Are you sure?'
        onConfirm={() => handleDelete(record)}
      >
        <Tooltip title='Delete'>
          <Button
            type='text'
            size='small'
            icon={<FontAwesomeIcon icon={faTrash} />}
            className='text-red-500 hover:text-red-700'
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  )
}
```

#### After (Using TableActions)

```javascript
{
  title: 'Actions',
  key: 'actions',
  render: (_, record) => (
    <TableActions
      record={record}
      actions={[
        { key: 'view', onClick: handleView },
        { key: 'edit', onClick: handleEdit },
        {
          key: 'delete',
          onClick: handleDelete,
          confirm: {
            title: 'Delete Item',
            description: 'Are you sure?'
          }
        }
      ]}
    />
  )
}
```

## Advanced Usage

### Custom Action Configuration

```javascript
const customActions = [
  {
    key: 'view',
    icon: faEye,
    tooltip: 'View Details',
    color: 'text-blue-500 hover:text-blue-700',
    onClick: (record) => console.log('View:', record)
  },
  {
    key: 'custom',
    icon: faDownload,
    tooltip: 'Download Report',
    color: 'text-green-500 hover:text-green-700',
    onClick: (record) => console.log('Download:', record),
    disabled: (record) => !record.hasReport
  }
]

<TableActions record={record} actions={customActions} />
```

### Custom Row Styling

```javascript
const rowClassName = (record, index) => {
  if (record.status === 'urgent') return 'bg-red-50 dark:bg-red-900'
  if (record.status === 'completed') return 'bg-green-50 dark:bg-green-900'
  return ''
}

;<TableView columns={columns} dataSource={data} rowClassName={rowClassName} />
```

### Custom Pagination

```javascript
<TableView
  columns={columns}
  dataSource={data}
  pagination={{
    pageSize: 20,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    showSizeChanger: true,
    showQuickJumper: true
  }}
/>
```

## Best Practices

1. **Use Action Presets**: Start with predefined action presets and customize as needed
2. **Memoize Callbacks**: Use `useCallback` for action handlers to prevent unnecessary re-renders
3. **Consistent Styling**: Let the components handle dark mode and styling automatically
4. **Performance**: Use `React.memo` for table columns and action configurations
5. **Accessibility**: The components include proper ARIA labels and keyboard navigation

## Examples

See `TableView.example.js` for complete working examples including:

- Business Dashboard Job Listings Table
- Questionnaires Table with Expandable Rows
- Job Descriptions Table

## Troubleshooting

### Common Issues

1. **Dark mode not working**: Ensure `useTheme` is available in your component tree
2. **Search not functioning**: Make sure to pass both `searchTerm` and `onSearch` props
3. **Actions not rendering**: Check that action configurations have the required `key` and `onClick` properties
4. **Styling conflicts**: The components use Tailwind classes that may conflict with custom CSS

### Performance Tips

1. Memoize column definitions with `useMemo`
2. Use `useCallback` for action handlers
3. Implement virtual scrolling for large datasets
4. Use pagination to limit rendered rows

## Contributing

When adding new features:

1. Follow the existing patterns for dark mode support
2. Add comprehensive prop validation
3. Include examples in the documentation
4. Test with both light and dark themes
5. Ensure accessibility compliance
