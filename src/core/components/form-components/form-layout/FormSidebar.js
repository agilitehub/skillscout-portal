import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography, Card, Progress, Input, Row, Col } from 'antd'
import { Button } from '../../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../ui/ThemeContext'
import './form-sidebar.css'

const { Title, Text } = Typography
const { TextArea } = Input

/**
 * FormSidebar component that displays form metadata and actions in a vertical card
 * that sits to the right of the form.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Metadata for the form
 * @param {boolean} props.data.isAutoStep - Whether the step is auto
 * @param {string} props.data.submitLabel - Label for the submit button
 * @param {string} props.data.selectedOption - Selected option for the workflow
 * @param {Object} props.data.options - Options for the workflow
 * @param {string} props.data.refNo - Form ID or reference number
 * @param {string} props.data.title - Form title
 * @param {string} props.data.role - Role of the current user
 * @param {string} props.data.phase - Current phase of the workflow
 * @param {string} props.data.duration - Expected duration
 * @param {string} props.data.dueDate - Due date for the current step
 * @param {string} props.data.requester - Name of the requester
 * @param {string} props.data.responsible - Person responsible
 * @param {string} props.data.instruction - Instruction for the current step
 * @param {function} props.onSubmit - Callback for when form is submitted
 * @param {function} props.onApprove - Callback for approval action
 * @param {function} props.onReject - Callback for rejection action
 * @param {function} props.onReturn - Callback for return action
 * @param {number} props.requiredCompletion - Percentage of required fields completed
 * @param {number} props.additionalCompletion - Percentage of additional fields completed
 * @param {Array} props.actions - Custom actions array
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} FormSidebar component
 */
const FormSidebar = ({
  data = {},
  onSubmit,
  onApprove,
  onReject,
  onReturn,
  requiredCompletion = 0,
  additionalCompletion = 0,
  className = ''
}) => {
  const { darkMode } = useTheme()
  const [workflowOption, setWorkflowOption] = useState(null)
  const [comments, setComments] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Icon color based on theme
  const iconClass = darkMode ? 'text-agilite-grey' : 'text-secondary'

  const handleSubmit = () => {
    if (workflowOption === 'approve' && onApprove) {
      onApprove(comments)
    } else if (workflowOption === 'reject' && onReject) {
      onReject(comments)
    } else if (workflowOption === 'return' && onReturn) {
      onReturn(comments)
    } else if (onSubmit) {
      onSubmit(workflowOption, comments)
    }
  }

  const handleSaveDraft = () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
    // Call onSubmit with 'draft' option if available
    if (onSubmit) {
      onSubmit('draft', comments)
    }
  }

  const canSubmit = Boolean(workflowOption) && (workflowOption !== 'reject' || comments.trim().length > 0)

  return (
    <Card
      className={`form-sidebar ${darkMode ? 'bg-agilite-slate' : 'bg-white'} rounded-lg shadow-md border-0 p-0 h-full ${className}`}
    >
      {/* Header section with title only */}
      <div className='header-section'>
        <div className='header-row'>
          {data.title && (
            <Title level={5} className='title'>
              {data.title}
            </Title>
          )}
        </div>
      </div>

      <div className='flex-col'>
        {/* Metadata section */}
        <div className='metadata-grid'>
          <Text className='label'>Ref No:</Text>
          <Text className='value'>{data.refNo}</Text>

          {data.requester && (
            <>
              <Text className='label'>Requestor:</Text>
              <Text className='value'>{data.requester}</Text>
            </>
          )}
          {data.role && (
            <>
              <Text className='label'>Role:</Text>
              <Text className='value'>{data.role}</Text>
            </>
          )}
          {data.phase && (
            <>
              <Text className='label'>Phase:</Text>
              <Text className='value'>{data.phase}</Text>
            </>
          )}
          {data.duration && (
            <>
              <Text className='label'>Expected Duration:</Text>
              <Text className='value'>{data.duration}</Text>
            </>
          )}
          {data.dueDate && (
            <>
              <Text className='label'>Step Due:</Text>
              <Text className='value'>{data.dueDate}</Text>
            </>
          )}
          {data.responsible && (
            <>
              <Text className='label'>Responsible:</Text>
              <Text className='value'>{data.responsible}</Text>
            </>
          )}
        </div>

        {/* Instruction section */}
        {data.instruction && (
          <div className='instruction-section'>
            <Text className={`text-xs font-medium ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
              Instruction:
            </Text>
            <div className={`p-2 rounded ${darkMode ? 'bg-agilite-black bg-opacity-40' : 'bg-gray-100'}`}>
              <Text className={`text-xs ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
                {data.instruction}
              </Text>
            </div>
          </div>
        )}

        {/* Workflow section */}
        {data.options.length > 0 && (
          <div className='workflow-section'>
            <Text className={`text-sm font-medium ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
              Select Workflow Option:
            </Text>

            <div className='workflow-options-container'>
              {onApprove && (
                <div
                  className={`workflow-option ${workflowOption === 'approve' ? 'active' : ''}`}
                  onClick={() => setWorkflowOption('approve')}
                >
                  <Text className='option-text'>Approve</Text>
                </div>
              )}
              {onReject && (
                <div
                  className={`workflow-option ${workflowOption === 'reject' ? 'active' : ''}`}
                  onClick={() => setWorkflowOption('reject')}
                >
                  <Text className='option-text'>Reject</Text>
                </div>
              )}
              {onReturn && (
                <div
                  className={`workflow-option ${workflowOption === 'return' ? 'active' : ''}`}
                  onClick={() => setWorkflowOption('return')}
                >
                  <Text className='option-text'>Return</Text>
                </div>
              )}
            </div>
          </div>
        )}
        <div className='workflow-section'>
          <div className='comments-section'>
            <Text className={`text-xs font-medium ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
              {workflowOption === 'reject' ? 'Mandatory step comments' : 'Step comments (optional)'}
            </Text>
            <TextArea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder='Enter your comments here'
              className={darkMode ? 'bg-agilite-black border-gray-700 text-agilite-grey-light' : ''}
            />
          </div>

          <div className='action-buttons-row'>
            <Col>
              <Button
                icon={<FontAwesomeIcon icon={faSave} />}
                onClick={handleSaveDraft}
                loading={isSaving}
                className='action-button'
              >
                Save Draft
              </Button>
            </Col>
            <Col flex='auto'>
              <Button type='primary' onClick={handleSubmit} disabled={!canSubmit} block className='submit-button'>
                {data.submitLabel}
              </Button>
            </Col>
          </div>

          {/* Progress section - moved below buttons */}
          {(requiredCompletion > 0 || additionalCompletion > 0) && (
            <div className='progress-section'>
              <Row gutter={[12, 8]} align='middle'>
                {requiredCompletion > 0 && (
                  <Col span={12}>
                    <div>
                      <Text className={`text-xs ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
                        Required Info: {requiredCompletion}%
                      </Text>
                      <Progress percent={requiredCompletion} size='small' showInfo={false} strokeColor='#1890ff' />
                    </div>
                  </Col>
                )}
                {additionalCompletion > 0 && (
                  <Col span={12}>
                    <div>
                      <Text className={`text-xs ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}>
                        Additional Info: {additionalCompletion}%
                      </Text>
                      <Progress percent={additionalCompletion} size='small' showInfo={false} strokeColor='#52c41a' />
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

FormSidebar.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    refNo: PropTypes.string,
    role: PropTypes.string,
    phase: PropTypes.string,
    duration: PropTypes.string,
    dueDate: PropTypes.string,
    requester: PropTypes.string,
    responsible: PropTypes.string,
    instruction: PropTypes.string
  }),
  onSubmit: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onReturn: PropTypes.func,
  requiredCompletion: PropTypes.number,
  additionalCompletion: PropTypes.number,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.object,
      type: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
      tooltip: PropTypes.string
    })
  ),
  className: PropTypes.string
}

export default FormSidebar
