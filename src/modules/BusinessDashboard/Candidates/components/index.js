// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useMemo } from 'react'
import { Tag, Space, Descriptions } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTheme } from '../../../../core/context/ThemeContext'
import {
  Button,
  BusinessDashboardPageShell,
  DashboardToolbarButton,
  ModalTitleWithIcon,
  ThemedModal,
  Toolbar
} from '../../../../core/components'
import TableView from '../../../../core/components/view-components/table-view/TableView'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'
import KanbanBoard from './KanbanBoard'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import {
  getStageTagClass,
  getPriorityTagClass,
  getCandidateSkillTagClass
} from '../model'
import { useCandidatesWorkspace } from '../hooks/useCandidatesWorkspace'

import '../styles/candidates.css'

/**
 * Candidates Management Page
 * Kanban-style board for managing job application candidates with drag and drop
 */
const Candidates = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  const {
    draggedCandidate,
    lastDroppedCard,
    viewMode,
    searchTerm,
    viewModalVisible,
    selectedCandidate,
    selectedJobListing,
    filteredCandidates,
    filteredCandidatesData,
    stages,
    jobListings,
    handleEdit,
    handleView,
    handleCloseViewModal,
    handleAdd,
    handleCandidateAction,
    handleDragStart,
    handleDragEnd,
    handleDropOnStage,
    handleViewToggle,
    handleSearch,
    handleJobListingChange,
    getStageTitle
  } = useCandidatesWorkspace(user)

  const tableColumns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record) => (
          <div className='font-medium'>
            <div
              className={`cursor-pointer transition-colors duration-200 ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => handleEdit(record)}
            >
              {text}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{record.email}</div>
          </div>
        )
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        width: 200,
        sorter: (a, b) => a.position.localeCompare(b.position)
      },
      {
        title: 'Stage',
        dataIndex: 'stageTitle',
        key: 'stage',
        width: 150,
        sorter: (a, b) => a.stageTitle.localeCompare(b.stageTitle),
        render: (text, record) => (
          <Tag bordered className={`m-0 font-medium ${getStageTagClass(record.stage, darkMode)}`}>
            {text}
          </Tag>
        )
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
        sorter: (a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        },
        render: (priority) => (
          <Tag bordered className={`m-0 font-medium ${getPriorityTagClass(priority, darkMode)}`}>
            {priority.toUpperCase()}
          </Tag>
        )
      },
      {
        title: 'Applied Date',
        dataIndex: 'appliedDate',
        key: 'appliedDate',
        width: 120,
        sorter: (a, b) => new Date(a.appliedDate) - new Date(b.appliedDate),
        render: (date) => new Date(date).toLocaleDateString()
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        width: 200,
        render: (tags) => (
          <Space wrap>
            {tags.map((tag, index) => (
              <Tag
                key={tag}
                bordered
                className={`m-0 text-xs font-medium ${getCandidateSkillTagClass(index, darkMode)}`}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        )
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: 140
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <Space>
            <Button
              type='text'
              size='small'
              icon={<FontAwesomeIcon icon={faEye} />}
              onClick={() => handleView(record)}
              className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            />
            <Button
              type='text'
              size='small'
              icon={<FontAwesomeIcon icon={faEdit} />}
              onClick={() => handleEdit(record)}
              className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            />
          </Space>
        )
      }
    ],
    [darkMode, handleView, handleEdit]
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <BusinessDashboardPageShell>
        <Toolbar title='Candidates' description='Manage your recruitment pipeline' />

        <div className='flex-1 relative'>
          <ModuleContainer variant='padded'>
            {viewMode === 'kanban' ? (
              <KanbanBoard
                candidatesData={filteredCandidatesData}
                stages={stages}
                onEditCandidate={handleEdit}
                onCandidateAction={handleCandidateAction}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDropOnStage={handleDropOnStage}
                draggedCandidate={draggedCandidate}
                lastDroppedCard={lastDroppedCard}
                darkMode={darkMode}
                jobListings={jobListings}
                selectedJobListing={selectedJobListing}
                onJobListingChange={handleJobListingChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                showFilters={true}
                viewMode={viewMode}
                onViewModeChange={handleViewToggle}
                showViewToggle={true}
              />
            ) : (
              <div>
                <KanbanBoard.FilterBar
                  jobListings={jobListings}
                  selectedJobListing={selectedJobListing}
                  onJobListingChange={handleJobListingChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  darkMode={darkMode}
                  viewMode={viewMode}
                  onViewModeChange={handleViewToggle}
                  showViewToggle={true}
                />

                <div className='candidates-table'>
                <TableView
                  columns={tableColumns}
                  dataSource={filteredCandidates}
                  showSearch={false}
                  pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`
                  }}
                  scroll={{ x: 1400 }}
                  emptyText='No candidates found'
                  toolbarActions={[
                    <DashboardToolbarButton
                      key='add'
                      size='small'
                      onClick={handleAdd}
                      icon={<FontAwesomeIcon icon={faPlus} className='text-[10px]' />}
                    >
                      Add Candidate
                    </DashboardToolbarButton>
                  ]}
                  cardProps={{
                    className: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }}
                />
                </div>
              </div>
            )}
          </ModuleContainer>
        </div>

        <ThemedModal
          title={
            <ModalTitleWithIcon
              icon={<FontAwesomeIcon icon={faEye} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />}
            >
              Candidate Details - {selectedCandidate?.name}
            </ModalTitleWithIcon>
          }
          open={viewModalVisible}
          onCancel={handleCloseViewModal}
          footer={null}
          width={800}
          className={darkMode ? 'dark-modal' : ''}
          style={{
            top: 20
          }}
          maskStyle={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
          }}
        >
          {selectedCandidate && (
            <div className='space-y-6'>
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Basic Information
                </h3>
                <Descriptions
                  bordered
                  column={2}
                  size='middle'
                  className={darkMode ? 'dark-descriptions' : ''}
                  labelStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.offWhite,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                    fontWeight: '500'
                  }}
                  contentStyle={{
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  }}
                >
                  <Descriptions.Item label='Full Name'>{selectedCandidate.name}</Descriptions.Item>
                  <Descriptions.Item label='Position'>{selectedCandidate.position}</Descriptions.Item>
                  <Descriptions.Item label='Email'>{selectedCandidate.email}</Descriptions.Item>
                  <Descriptions.Item label='Phone'>{selectedCandidate.phone}</Descriptions.Item>
                  <Descriptions.Item label='Applied Date'>
                    {new Date(selectedCandidate.appliedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label='Current Stage'>
                    <Tag
                      bordered
                      className={`m-0 font-medium ${getStageTagClass(selectedCandidate.stage, darkMode)}`}
                    >
                      {getStageTitle(selectedCandidate.stage)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Priority' span={2}>
                    <Tag
                      bordered
                      className={`m-0 font-medium ${getPriorityTagClass(selectedCandidate.priority, darkMode)}`}
                    >
                      {selectedCandidate.priority.toUpperCase()} PRIORITY
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Skills & Expertise
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {selectedCandidate.tags.map((tag, index) => (
                    <Tag
                      key={tag}
                      bordered
                      className={`m-0 font-medium ${getCandidateSkillTagClass(index, darkMode)}`}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              {selectedCandidate.notes && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notes</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } border`}
                  >
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{selectedCandidate.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </ThemedModal>
      </BusinessDashboardPageShell>
    </DndProvider>
  )
})

export default Candidates
