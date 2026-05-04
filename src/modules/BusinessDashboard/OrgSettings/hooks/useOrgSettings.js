// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { useState, useCallback, useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import orgSettingsController from '../controllers'

/**
 * Org settings page: load org, save profile, leave org, business setup modal.
 */
export function useOrgSettings(user, darkMode) {
  const [form] = Form.useForm()
  const [businessSetupForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [aiModalVisible, setAiModalVisible] = useState(false)
  const [businessSetupModalVisible, setBusinessSetupModalVisible] = useState(false)
  const [leavingOrganization, setLeavingOrganization] = useState(false)
  const [loadingOrgData, setLoadingOrgData] = useState(true)
  const [organizationId, setOrganizationId] = useState(null)
  const [hasOrganization, setHasOrganization] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [modal, contextHolder] = Modal.useModal()
  const [orgSettings, setOrgSettings] = useState({})

  const loadOrganizationData = useCallback(async () => {
    if (!user?.id) {
      setLoadingOrgData(false)
      return
    }

    try {
      setLoadingOrgData(true)
      const result = await orgSettingsController.getOrgSettings(user.id)

      if (result.success) {
        if (result.hasOrganization && result.data) {
          setOrgSettings(result.data)
          setOrganizationId(result.data.id)
          setHasOrganization(true)
          form.setFieldsValue(result.data)
        } else {
          setHasOrganization(false)
          setOrgSettings({})
          setOrganizationId(null)
        }
      } else {
        console.error('Failed to load organization data:', result.error)
        message.error(`Failed to load organization data: ${result.error}`)
      }
    } catch (error) {
      console.error('Error loading organization data:', error)
      message.error('An error occurred while loading organization data')
    } finally {
      setLoadingOrgData(false)
    }
  }, [user?.id, form])

  useEffect(() => {
    loadOrganizationData()
  }, [loadOrganizationData])

  useEffect(() => {
    if (Object.keys(orgSettings).length > 0) {
      form.setFieldsValue(orgSettings)
    }
  }, [orgSettings, form])

  const handleValuesChange = useCallback(() => {
    setHasChanges(true)
  }, [])

  const handleSubmit = useCallback(
    async (values) => {
      if (!organizationId || !user?.id) {
        message.error('Unable to update organization settings: Missing organization or user information')
        return
      }

      setLoading(true)
      try {
        const result = await orgSettingsController.updateOrgSettings(organizationId, values, user.id)

        if (result.success) {
          setOrgSettings(result.data)
          setHasChanges(false)
          message.success(result.message || 'Organization settings updated successfully!')
        } else {
          console.error('Error updating organization settings:', result.error)
          message.error(`Failed to update organization settings: ${result.error}`)
        }
      } catch (error) {
        console.error('Unexpected error updating organization settings:', error)
        message.error('An unexpected error occurred while updating organization settings')
      } finally {
        setLoading(false)
      }
    },
    [organizationId, user?.id]
  )

  const handleTabChange = useCallback((key) => {
    setActiveTab(key)
  }, [])

  const handleLeaveOrganization = useCallback(() => {
    modal.confirm({
      title: 'Leave Organization',
      content: (
        <div>
          <p>
            Are you sure you want to leave <strong>{orgSettings.organizationName}</strong>?
          </p>
          <p className='text-red-600 mt-2'>
            <strong>Warning:</strong> This action will remove you from the organization and you will lose access to all
            organization data.
          </p>
        </div>
      ),
      okText: 'Leave Organization',
      okType: 'danger',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
        loading: leavingOrganization
      },
      onOk: async () => {
        setLeavingOrganization(true)
        try {
          const result = await orgSettingsController.leaveOrganization(user?.id)

          if (result.success) {
            setOrgSettings({})
            form.resetFields()
            setBusinessSetupModalVisible(true)
            message.success('You have successfully left the organization.')
          } else {
            console.error('Error leaving organization:', result.error)
            message.error(`Failed to leave organization: ${result.error}`)
          }
        } catch (error) {
          console.error('Unexpected error leaving organization:', error)
          message.error('An unexpected error occurred while leaving the organization.')
        } finally {
          setLeavingOrganization(false)
        }
      },
      className: darkMode ? 'ant-modal-dark' : ''
    })
  }, [orgSettings.organizationName, leavingOrganization, user?.id, form, modal, darkMode])

  const handleBusinessSetupModalClose = useCallback(() => {
    setBusinessSetupModalVisible(false)
  }, [])

  const handleBusinessSetupSubmit = useCallback(
    async (values) => {
      if (!user?.id) {
        message.error('Unable to create organization: missing user.')
        return
      }
      try {
        const organizationData = {
          ...values,
          founded_year: values.founded_year ? parseInt(values.founded_year, 10) : null
        }

        let result = await orgSettingsController.createOrganizationForUser(organizationData, user?.id)

        if (result.success) {
          setBusinessSetupModalVisible(false)
          message.success('Organization setup completed successfully!')
        }

        setLoadingOrgData(true)
        result = await orgSettingsController.getOrgSettings(user?.id)

        if (result.success && result.hasOrganization && result.data) {
          setOrgSettings(result.data)
          setOrganizationId(result.data.id || null)
          setHasOrganization(true)
          form.setFieldsValue(result.data)
        }

        setLoadingOrgData(false)
      } catch (error) {
        console.error('Error setting up organization:', error)
        message.error('Failed to set up organization')
        setLoadingOrgData(false)
      }
    },
    [form, user?.id]
  )

  return {
    form,
    businessSetupForm,
    loading,
    hasChanges,
    aiModalVisible,
    setAiModalVisible,
    businessSetupModalVisible,
    setBusinessSetupModalVisible,
    leavingOrganization,
    loadingOrgData,
    organizationId,
    hasOrganization,
    activeTab,
    contextHolder,
    orgSettings,
    setOrgSettings,
    handleValuesChange,
    handleSubmit,
    handleTabChange,
    handleLeaveOrganization,
    handleBusinessSetupModalClose,
    handleBusinessSetupSubmit
  }
}
