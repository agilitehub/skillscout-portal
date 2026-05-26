// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useMemo, useState, useCallback } from 'react'
import { Spin, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import {
  BusinessDashboardPageShell,
  DashboardToolbarButton,
  Toolbar
} from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import TableActions from '../../../../core/components/view-components/table-view/TableActions'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'
import { useCandidateList } from '../hooks/useCandidateList'
import { useCandidateImport } from '../hooks/useCandidateImport'
import { deleteOrganizationCandidate } from '../controllers'
import CandidateImportWizard from './CandidateImportWizard'

import '../styles/candidate-management.css'

const CandidateManagement = React.memo(({ user: _user }) => {
  const { darkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const { candidates, loading, refetch } = useCandidateList()
  const [deleting, setDeleting] = useState(false)

  const importWizard = useCandidateImport({ onSuccess: refetch })

  const handleDelete = useCallback(
    async (record) => {
      try {
        setDeleting(true)
        const result = await deleteOrganizationCandidate(record.id)

        if (result.success) {
          message.success(
            record.fullName && record.fullName !== '—'
              ? `${record.fullName} removed`
              : 'Candidate deleted successfully'
          )
          await refetch()
        } else {
          message.error(result.error || 'Failed to delete candidate')
        }
      } catch (error) {
        console.error('Error deleting candidate:', error)
        message.error('An unexpected error occurred while deleting')
      } finally {
        setDeleting(false)
      }
    },
    [refetch]
  )

  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return candidates
    const term = searchTerm.toLowerCase()
    return candidates.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(term) ||
        c.firstName?.toLowerCase().includes(term) ||
        c.lastName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.cvOriginalFilename?.toLowerCase().includes(term)
    )
  }, [candidates, searchTerm])

  const formatDate = useCallback((value) => {
    if (!value) return '—'
    try {
      return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return '—'
    }
  }, [])

  const columns = useMemo(
    () => [
      {
        title: 'NAME',
        dataIndex: 'fullName',
        key: 'fullName',
        sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
        render: (text, record) => (
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{text}</div>
            {record.cvOriginalFilename ? (
              <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {record.cvOriginalFilename}
              </div>
            ) : null}
          </div>
        )
      },
      {
        title: 'EMAIL',
        dataIndex: 'email',
        key: 'email',
        render: (text) => (
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{text || '—'}</span>
        )
      },
      {
        title: 'PHONE',
        dataIndex: 'phone',
        key: 'phone',
        render: (text) => (
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{text || '—'}</span>
        )
      },
      {
        title: 'ADDED',
        dataIndex: 'dateCreated',
        key: 'dateCreated',
        width: 120,
        sorter: (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated),
        render: (value) => (
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{formatDate(value)}</span>
        )
      },
      {
        title: 'ACTIONS',
        key: 'actions',
        width: 90,
        render: (_, record) => (
          <TableActions
            record={record}
            actions={[
              {
                key: 'delete',
                icon: faTrash,
                tooltip: 'Delete candidate',
                onClick: handleDelete,
                disabled: deleting,
                confirm: {
                  title: 'Delete candidate',
                  description: `Remove ${record.fullName || 'this candidate'} from your organization? Their CV file will also be deleted. This cannot be undone.`,
                  okText: 'Delete',
                  cancelText: 'Cancel',
                  okType: 'danger'
                }
              }
            ]}
          />
        )
      }
    ],
    [darkMode, formatDate, handleDelete, deleting]
  )

  return (
    <BusinessDashboardPageShell className='relative overflow-hidden'>
      <Toolbar
        title='Candidate Management'
        description='Import and manage candidates who applied to your organization'
        renderActions={() => (
          <DashboardToolbarButton
            onClick={importWizard.openWizard}
            icon={<FontAwesomeIcon icon={faCloudUploadAlt} className='text-[11px]' />}
          >
            <span>Bulk upload CVs</span>
          </DashboardToolbarButton>
        )}
      />

      <ModuleContainer>
        <Spin spinning={loading || deleting} indicator={<FontAwesomeIcon icon={faSpinner} spin />}>
          <div className='candidate-management-table'>
            <TableView
              columns={columns}
              dataSource={filteredCandidates}
              rowKey='id'
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              searchPlaceholder='Search candidates…'
              pagination={{
                total: filteredCandidates.length,
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`
              }}
              emptyText='No candidates yet. Use Bulk upload CVs to import applicants.'
            />
          </div>
        </Spin>
      </ModuleContainer>

      <CandidateImportWizard
        open={importWizard.open}
        onClose={importWizard.requestCloseWizard}
        step={importWizard.step}
        selectedFiles={importWizard.selectedFiles}
        drafts={importWizard.drafts}
        processing={importWizard.processing}
        submitting={importWizard.submitting}
        processSummary={importWizard.processSummary}
        submittableCount={importWizard.submittableCount}
        onAddFiles={importWizard.addFiles}
        onRemoveFile={importWizard.removeFile}
        onProcessCvs={importWizard.processCvs}
        onUpdateDraft={importWizard.updateDraft}
        onRemoveDraft={importWizard.removeDraft}
        onSubmitDrafts={importWizard.submitDrafts}
        onBackToUpload={importWizard.goBackToUpload}
      />
    </BusinessDashboardPageShell>
  )
})

CandidateManagement.displayName = 'CandidateManagement'

export default CandidateManagement
