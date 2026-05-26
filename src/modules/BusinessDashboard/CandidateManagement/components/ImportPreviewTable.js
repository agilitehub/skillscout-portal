// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useMemo } from 'react'
import { Input, Tag, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import { DRAFT_STATUS } from '../model'

const ImportPreviewTable = React.memo(({ drafts, onUpdateDraft, onRemoveDraft }) => {
  const { darkMode } = useTheme()

  const columns = useMemo(
    () => [
      {
        title: 'CV FILE',
        dataIndex: 'cvOriginalFilename',
        key: 'file',
        width: 160,
        render: (text) => (
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{text}</span>
        )
      },
      {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status, record) => {
          if (status === DRAFT_STATUS.FAILED) {
            return (
              <Tag color='error' className='m-0'>
                Failed
              </Tag>
            )
          }
          if (status === DRAFT_STATUS.READY) {
            return (
              <Tag color='success' className='m-0'>
                Ready
              </Tag>
            )
          }
          return (
            <Tag className='m-0'>{status}</Tag>
          )
        }
      },
      {
        title: 'FIRST NAME',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 140,
        render: (_, record) => (
          <Input
            value={record.firstName}
            onChange={(e) => onUpdateDraft(record.id, { firstName: e.target.value })}
            disabled={record.status === DRAFT_STATUS.FAILED}
            placeholder='First name'
            size='small'
          />
        )
      },
      {
        title: 'LAST NAME',
        dataIndex: 'lastName',
        key: 'lastName',
        width: 140,
        render: (_, record) => (
          <Input
            value={record.lastName}
            onChange={(e) => onUpdateDraft(record.id, { lastName: e.target.value })}
            disabled={record.status === DRAFT_STATUS.FAILED}
            placeholder='Last name'
            size='small'
          />
        )
      },
      {
        title: 'EMAIL',
        dataIndex: 'email',
        key: 'email',
        width: 180,
        render: (_, record) => (
          <Input
            value={record.email}
            onChange={(e) => onUpdateDraft(record.id, { email: e.target.value })}
            disabled={record.status === DRAFT_STATUS.FAILED}
            placeholder='Email'
            size='small'
          />
        )
      },
      {
        title: 'PHONE',
        dataIndex: 'phone',
        key: 'phone',
        width: 140,
        render: (_, record) => (
          <Input
            value={record.phone}
            onChange={(e) => onUpdateDraft(record.id, { phone: e.target.value })}
            disabled={record.status === DRAFT_STATUS.FAILED}
            placeholder='Phone'
            size='small'
          />
        )
      },
      {
        title: '',
        key: 'actions',
        width: 56,
        render: (_, record) => (
          <Button
            type='text'
            danger
            size='small'
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => onRemoveDraft(record.id)}
            aria-label='Remove row'
          />
        )
      }
    ],
    [darkMode, onUpdateDraft, onRemoveDraft]
  )

  const expandedRowRender = (record) => {
    if (!record.errorMessage) return null
    return (
      <p className={`px-2 py-1 text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{record.errorMessage}</p>
    )
  }

  return (
    <div className='candidate-import-preview-table'>
      <TableView
        columns={columns}
        dataSource={drafts}
        rowKey='id'
        showSearch={false}
        scroll={{ x: 1100 }}
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
        emptyText='No processed CVs to preview'
        tableProps={{
          expandable: {
            expandedRowRender: (record) => (record.errorMessage ? expandedRowRender(record) : null),
            rowExpandable: (record) => Boolean(record.errorMessage)
          }
        }}
      />
    </div>
  )
})

ImportPreviewTable.displayName = 'ImportPreviewTable'

export default ImportPreviewTable
