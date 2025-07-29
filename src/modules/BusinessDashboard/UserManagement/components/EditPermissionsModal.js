// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Form, Switch, Alert } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShieldAlt, 
  faEye, 
  faUsers, 
  faClipboardCheck, 
  faFileText,
  faChartBar,
  faBuilding,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

/**
 * Edit Permissions Modal Component
 * Handles individual permission management for users
 */
const EditPermissionsModal = React.memo(({ visible, user, onCancel, onSuccess, darkMode }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Permission definitions with descriptions and icons
  const permissionConfig = {
    publishListings: {
      label: 'Publish Job Listings',
      description: 'Create, edit, and publish job listings',
      icon: faFileText,
      category: 'Job Management'
    },
    editOrgProfile: {
      label: 'Edit Organization Profile',
      description: 'Modify company information and settings',
      icon: faBuilding,
      category: 'Organization'
    },
    manageQuestionnaires: {
      label: 'Manage Questionnaires',
      description: 'Create, edit, and delete questionnaires',
      icon: faClipboardCheck,
      category: 'Assessments'
    },
    viewCandidates: {
      label: 'View Candidates',
      description: 'Access candidate profiles and information',
      icon: faEye,
      category: 'Candidates'
    },
    manageCandidates: {
      label: 'Manage Candidates',
      description: 'Edit candidate information and move through pipeline',
      icon: faUsers,
      category: 'Candidates'
    },
    viewReports: {
      label: 'View Reports',
      description: 'Access analytics and reporting features',
      icon: faChartBar,
      category: 'Analytics'
    }
  }

  // Group permissions by category
  const permissionsByCategory = Object.entries(permissionConfig).reduce((acc, [key, config]) => {
    if (!acc[config.category]) {
      acc[config.category] = []
    }
    acc[config.category].push({ key, ...config })
    return acc
  }, {})

  // Set initial form values when user changes
  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue(user.permissions)
      setHasChanges(false)
    }
  }, [user, visible, form])

  // Handle form values change
  const handleValuesChange = useCallback(() => {
    setHasChanges(true)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onSuccess(values)
      setHasChanges(false)
    } catch (error) {
      console.error('Error updating permissions:', error)
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  // Handle cancel with unsaved changes check
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to close without saving?',
        okText: 'Discard Changes',
        okType: 'danger',
        cancelText: 'Continue Editing',
        onOk() {
          setHasChanges(false)
          form.resetFields()
          onCancel()
        }
      })
    } else {
      onCancel()
    }
  }, [hasChanges, form, onCancel])

  // Get role color
  const getRoleColor = useCallback((role) => {
    switch (role) {
      case 'admin': return SEMANTIC_COLORS.error
      case 'recruiter': return BRAND_COLORS.emeraldPrimary
      case 'viewer': return BRAND_COLORS.shakespeare
      default: return BRAND_COLORS.mediumGray
    }
  }, [])

  if (!user) return null

  return (
    <>
      {/* Modal Styles */}
      <style jsx global>{`
        .permissions-modal .ant-modal-content {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          border: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .permissions-modal .ant-modal-header {
          background-color: ${darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white} !important;
          border-bottom: 1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .permissions-modal .ant-modal-close {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .permissions-modal .ant-modal-close:hover {
          color: ${BRAND_COLORS.emeraldLight} !important;
        }
        
        .permissions-modal .ant-form-item-label > label {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          font-weight: 500 !important;
        }
        
        .permissions-modal .ant-switch-checked {
          background-color: ${BRAND_COLORS.emeraldPrimary} !important;
        }
        
        .permissions-modal .ant-alert {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.lightGray} !important;
          border-color: ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.borderGray} !important;
        }
        
        .permissions-modal .ant-alert-message {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
        }
        
        .permissions-modal .ant-alert-description {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
        }
        
        .permission-category {
          background-color: ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.offWhite} !important;
          border: 1px solid ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.lightBorderGray} !important;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .permission-category-title {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .permission-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid ${darkMode ? BRAND_COLORS.darkSlate : BRAND_COLORS.lightBorderGray};
        }
        
        .permission-item:last-child {
          border-bottom: none;
        }
        
        .permission-info {
          flex: 1;
          margin-right: 16px;
        }
        
        .permission-label {
          color: ${darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray} !important;
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .permission-description {
          color: ${darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray} !important;
          font-size: 12px;
          line-height: 1.4;
        }
      `}</style>

      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              <FontAwesomeIcon icon={faShieldAlt} className='text-white text-sm' />
            </div>
            <div>
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                Edit Permissions
              </span>
              <div className="text-sm text-gray-400 mt-1">
                {user.name} ({user.email})
              </div>
            </div>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={700}
        className="permissions-modal"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className={darkMode ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            disabled={!hasChanges}
            style={{
              backgroundColor: hasChanges ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.mediumGray,
              borderColor: hasChanges ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.mediumGray
            }}
          >
            Save Changes
          </Button>
        ]}
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <div className="mb-4">
          <Alert
            message="Permission Management"
            description={`Customize ${user.name}'s access permissions. Changes will take effect immediately after saving.`}
            type="info"
            icon={<FontAwesomeIcon icon={faExclamationCircle} />}
            showIcon
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
        >
          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <div key={category} className="permission-category">
              <div className="permission-category-title">
                {category}
              </div>
              
              {permissions.map(permission => (
                <div key={permission.key} className="permission-item">
                  <div className="permission-info">
                    <div className="flex items-center space-x-2 mb-1">
                      <FontAwesomeIcon 
                        icon={permission.icon} 
                        className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      />
                      <div className="permission-label">
                        {permission.label}
                      </div>
                    </div>
                    <div className="permission-description">
                      {permission.description}
                    </div>
                  </div>
                  
                  <Form.Item
                    name={permission.key}
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch size="small" />
                  </Form.Item>
                </div>
              ))}
            </div>
          ))}

          {hasChanges && (
            <Alert
              message="You have unsaved changes"
              description="Don't forget to save your changes before closing this dialog."
              type="warning"
              showIcon
              className="mt-4"
            />
          )}
        </Form>
      </Modal>
    </>
  )
})

EditPermissionsModal.displayName = 'EditPermissionsModal'

export default EditPermissionsModal 