// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useEffect } from 'react'
import { Card, Form, message, Tabs, Modal, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  // faRobot,
  faGlobe,
  // faFileAlt,
  faSave,
  faCog,
  faIndustry,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import { clearUserOrganization, createOrganizationAndAssignToUser } from '../../../../core/lib/supabase-controller'
import orgSettingsController from '../utils/controller'
import AIProfileModal from './AIProfileModal'
import BusinessSetupModal from './BusinessSetupModal'
import OrganizationProfileForm from './OrganizationProfileForm'
import Toolbar from '../../../../core/components/Toolbar'

const { TabPane } = Tabs

/**
 * Organization Settings Page
 * Manages company-wide settings, preferences, and configurations
 */
const OrgSettings = React.memo(({ user }) => {
  const { darkMode } = useTheme()
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

  // Organization data - loaded from API
  const [orgSettings, setOrgSettings] = useState({})

  // Load organization data on mount
  useEffect(() => {
    const loadOrganizationData = async () => {
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
            // User has no organization
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
    }

    loadOrganizationData()
    // eslint-disable-next-line
  }, [])

  // Update form values when organization data changes
  useEffect(() => {
    if (Object.keys(orgSettings).length > 0) {
      form.setFieldsValue(orgSettings)
    }
  }, [orgSettings, form])

  // Handle form values change
  const handleValuesChange = useCallback(() => {
    setHasChanges(true)
  }, [])

  // Handle form submission
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

  // // Handle AI profile interaction
  // const handleAiProfileUpdate = useCallback(() => {
  //   setAiModalVisible(true)
  // }, [])

  // Tab change handler
  const handleTabChange = useCallback((key) => {
    setActiveTab(key)
  }, [])

  // Handle leave organization
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
          // Clear the user's org_id from the database
          const result = await clearUserOrganization(user?.id)

          if (result.success) {
            // Clear local state and show setup modal
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
  }, [orgSettings.organizationName, darkMode, leavingOrganization, user?.id, form, modal])

  // Handle business setup modal close
  const handleBusinessSetupModalClose = useCallback(() => {
    setBusinessSetupModalVisible(false)
  }, [])

  // Handle business setup submission
  const handleBusinessSetupSubmit = useCallback(
    async (values) => {
      let result = null
      try {
        // Prepare organization data
        const organizationData = {
          ...values,
          // Transform founded_year to number if provided
          founded_year: values.founded_year ? parseInt(values.founded_year, 10) : null
        }

        // Create organization and assign to user in Supabase
        result = await createOrganizationAndAssignToUser(organizationData, user.id)

        if (result.success) {
          setBusinessSetupModalVisible(false)
          message.success('Organization setup completed successfully!')
        }

        // Reload organization data
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

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      {contextHolder}

      {/* Main Content */}
      <div className='flex-1 relative'>
        <Toolbar
          title='Organization Settings'
          description='Manage your organization profile and preferences'
          renderActions={() => (
            <div className='flex space-x-3'>
              <Button
                danger
                onClick={handleLeaveOrganization}
                loading={leavingOrganization}
                disabled={leavingOrganization}
                className='org-settings-leave-btn'
                style={{
                  backgroundColor: darkMode ? '#DC2626' : '#EF4444',
                  borderColor: darkMode ? '#DC2626' : '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  height: '32px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
                title='Leave this organization'
              >
                <Space>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Leave Organization</span>
                </Space>
              </Button>
            </div>
          )}
        />

        {/* Content Area */}
        <div className='relative pl-2 pr-2 pt-2'>
          {loadingOrgData ? (
            <div className='flex justify-center items-center h-64'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto'></div>
                <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading organization data...</p>
              </div>
            </div>
          ) : !hasOrganization ? (
            <div className='flex justify-center items-center h-64'>
              <div className='text-center'>
                <FontAwesomeIcon icon={faBuilding} className='text-6xl text-gray-400 mb-4' />
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Organization Found
                </h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You need to be part of an organization to access these settings.
                </p>
                <Button
                  type='primary'
                  icon={<FontAwesomeIcon icon={faBuilding} className='mr-2' />}
                  onClick={() => setBusinessSetupModalVisible(true)}
                  style={{
                    backgroundColor: BRAND_COLORS.emeraldPrimary,
                    borderColor: BRAND_COLORS.emeraldPrimary
                  }}
                >
                  Create or Join Organization
                </Button>
              </div>
            </div>
          ) : (
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              onValuesChange={handleValuesChange}
              className='global-form'
            >
              <Card
                className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                styles={{
                  head: {
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                  },
                  body: {
                    backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                    color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
                    padding: 0
                  }
                }}
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  type='card'
                  size='middle'
                  className={`org-settings-tabs ${darkMode ? 'org-settings-tabs-dark' : ''}`}
                >
                  {/* General Tab */}
                  <TabPane
                    tab={
                      <span className='flex items-center space-x-2'>
                        <FontAwesomeIcon icon={faCog} />
                        <span>General</span>
                      </span>
                    }
                    key='general'
                  >
                    <div className='space-y-6'>
                      {/* Organization Profile and Work Arrangement - Using Shared Form */}
                      <Card
                        title={
                          <div className='flex items-center space-x-3'>
                            <FontAwesomeIcon icon={faBuilding} className='text-emerald-600' />
                            <span>Organization Profile</span>
                          </div>
                        }
                        className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                        headStyle={{
                          backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                          borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                          color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                        }}
                        bodyStyle={{
                          backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                          color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                        }}
                        // extra={
                        //   <div className='flex space-x-2'>
                        //     <Button
                        //       type='text'
                        //       icon={<FontAwesomeIcon icon={faRobot} />}
                        //       onClick={handleAiProfileUpdate}
                        //       className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                        //       title='Re-interact with AI'
                        //     >
                        //       AI Update
                        //     </Button>
                        //   </div>
                        // }
                      >
                        <OrganizationProfileForm
                          fieldNameFormat='camelCase'
                          showSections={{
                            organizationProfile: true,
                            workArrangement: true,
                            regionalPreferences: false,
                            industryTags: false,
                            timezone: false
                          }}
                          darkMode={darkMode}
                          dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}
                          cardWrapper={false}
                        />
                      </Card>
                    </div>
                  </TabPane>

                  {/* Regional Preferences Tab */}
                  <TabPane
                    tab={
                      <span className='flex items-center space-x-2'>
                        <FontAwesomeIcon icon={faGlobe} />
                        <span>Regional Preferences</span>
                      </span>
                    }
                    key='regional'
                  >
                    <Card
                      title={
                        <div className='flex items-center space-x-3'>
                          <FontAwesomeIcon icon={faGlobe} className='text-emerald-600' />
                          <span>Regional Preferences</span>
                        </div>
                      }
                      className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                      headStyle={{
                        backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                        borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                        color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                      }}
                      bodyStyle={{
                        backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                        color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                      }}
                    >
                      <OrganizationProfileForm
                        fieldNameFormat='camelCase'
                        showSections={{
                          organizationProfile: false,
                          workArrangement: false,
                          regionalPreferences: true,
                          industryTags: false,
                          timezone: false
                        }}
                        darkMode={darkMode}
                        dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}
                        cardWrapper={false}
                      />
                    </Card>
                  </TabPane>

                  {/* Industry & Classifications Tab */}
                  <TabPane
                    tab={
                      <span className='flex items-center space-x-2'>
                        <FontAwesomeIcon icon={faIndustry} />
                        <span>Industry & Classifications</span>
                      </span>
                    }
                    key='industry'
                  >
                    <div className='space-y-6'>
                      {/* Industry Selection */}
                      <Card
                        title={
                          <div className='flex items-center space-x-3'>
                            <FontAwesomeIcon icon={faIndustry} className='text-emerald-600' />
                            <span>Industry</span>
                          </div>
                        }
                        className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                        headStyle={{
                          backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                          borderBottom: `1px solid ${darkMode ? BRAND_COLORS.mediumSlate : BRAND_COLORS.borderGray}`,
                          color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                        }}
                        bodyStyle={{
                          backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                          color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray
                        }}
                      >
                        <OrganizationProfileForm
                          fieldNameFormat='camelCase'
                          showSections={{
                            organizationProfile: false,
                            workArrangement: false,
                            regionalPreferences: false,
                            industryTags: true,
                            timezone: false
                          }}
                          darkMode={darkMode}
                          dropdownClassName={darkMode ? 'org-settings-dark-dropdown' : ''}
                          cardWrapper={false}
                        />
                      </Card>
                    </div>
                  </TabPane>
                </Tabs>
                <div className='flex justify-end space-x-3 mt-1'>
                  <Button
                    type='primary'
                    size='middle'
                    icon={<FontAwesomeIcon icon={faSave} style={{ fontSize: '11px', marginRight: '4px' }} />}
                    onClick={() => form.submit()}
                    loading={loading}
                    disabled={!hasChanges}
                    className='form-btn-primary'
                    style={{
                      backgroundColor: hasChanges ? BRAND_COLORS.emeraldPrimary : darkMode ? '#4B5563' : '#E5E7EB',
                      borderColor: hasChanges ? BRAND_COLORS.emeraldPrimary : darkMode ? '#4B5563' : '#E5E7EB',
                      color: hasChanges ? '#FFFFFF' : darkMode ? '#9CA3AF' : '#6B7280',
                      fontSize: '13px',
                      height: '32px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      marginTop: '5px',
                      marginBottom: '10px',
                      marginRight: '5px'
                    }}
                  >
                    <span>Save Changes</span>
                  </Button>
                </div>
              </Card>
            </Form>
          )}
        </div>
      </div>

      {/* AI Profile Modal */}
      <AIProfileModal
        visible={aiModalVisible}
        onCancel={() => setAiModalVisible(false)}
        onSuccess={(updatedProfile) => {
          setOrgSettings((prev) => ({
            ...prev,
            ...updatedProfile
            // Removed lastAiUpdate as it's not in the database schema
          }))
          form.setFieldsValue(updatedProfile)
          setAiModalVisible(false)
          message.success('Organization profile updated with AI assistance!')
        }}
        darkMode={darkMode}
        currentProfile={orgSettings}
      />

      {/* Business Setup Modal */}
      <BusinessSetupModal
        isOpen={businessSetupModalVisible}
        onClose={handleBusinessSetupModalClose}
        onSubmit={handleBusinessSetupSubmit}
        form={businessSetupForm}
      />

      {/* Dark mode styles */}
      <style jsx global>{`
        /* Dark Mode Form Styling */
        ${darkMode
          ? `
          .org-settings-form .ant-form-item-label > label {
            color: #E5E7EB !important;
          }
          .org-settings-form .ant-form-item-extra {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-input,
          .org-settings-form input.ant-input,
          .org-settings-form input[type="text"],
          .org-settings-form input {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-input:focus,
          .org-settings-form input.ant-input:focus,
          .org-settings-form input[type="text"]:focus,
          .org-settings-form input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-input::placeholder,
          .org-settings-form input::placeholder {
            color: #D1D5DB !important;
          }
          .org-settings-form textarea.ant-input,
          .org-settings-form textarea {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form textarea.ant-input:focus,
          .org-settings-form textarea:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form textarea.ant-input::placeholder,
          .org-settings-form textarea::placeholder {
            color: #D1D5DB !important;
          }
          .org-settings-form .ant-input-show-count-suffix {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-select,
          .org-settings-form .ant-select-selector,
          .org-settings-form .ant-select-single .ant-select-selector {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-select-focused .ant-select-selector,
          .org-settings-form .ant-select:focus .ant-select-selector {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
            background-color: #4B5563 !important;
          }
          .org-settings-form .ant-select-selection-placeholder {
            color: #D1D5DB !important;
          }
          .org-settings-form .ant-select-selection-item {
            color: #F9FAFB !important;
            background-color: transparent !important;
          }
          .org-settings-form .ant-select-arrow {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-select-multiple .ant-select-selection-item {
            background-color: #374151 !important;
            border-color: #6B7280 !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-select-multiple .ant-select-selection-item-remove {
            color: #9CA3AF !important;
          }
          .org-settings-form .ant-select-multiple .ant-select-selection-item-remove:hover {
            color: #F9FAFB !important;
          }
          
          /* Form validation messages */
          .org-settings-form .ant-form-item-explain-error {
            color: #F87171 !important;
          }
          
          /* Character count */
          .org-settings-form .ant-input-data-count {
            color: #9CA3AF !important;
          }
          
          /* Additional comprehensive styling */
          .org-settings-form .ant-form-item-control-input {
            background-color: transparent !important;
          }
          .org-settings-form .ant-form-item-control-input-content input {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item-control-input-content textarea {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item-control-input-content .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          
          /* Ultimate override for any remaining light elements */
          .org-settings-form .ant-form-item input,
          .org-settings-form .ant-form-item textarea,
          .org-settings-form .ant-form-item .ant-select-selector {
            background-color: #4B5563 !important;
            color: #F9FAFB !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item .ant-input-affix-wrapper {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }
          .org-settings-form .ant-form-item .ant-input-affix-wrapper input {
            background-color: transparent !important;
            color: #F9FAFB !important;
          }
          .org-settings-form .ant-form-item .ant-input-prefix {
            color: #9CA3AF !important;
          }
          
          /* Alert component styling */
          .org-settings-form .ant-alert {
            background-color: #374151 !important;
            border-color: #4B5563 !important;
          }
          
          .org-settings-form .ant-alert-message {
            color: #F9FAFB !important;
          }
          
          .org-settings-form .ant-alert-description {
            color: #D1D5DB !important;
          }
          
          .org-settings-form .ant-alert-icon {
            color: #10B981 !important;
          }
          
          /* Future features section */
          .future-features-section {
            background-color: #374151 !important;
            border-color: #4B5563 !important;
          }
          
          .future-features-content {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
          }

          /* Tabs styling */
          .org-settings-tabs-dark .ant-tabs-nav {
            background-color: #374151 !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab {
            background-color: #4B5563 !important;
            border-color: #6B7280 !important;
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab .ant-tabs-tab-btn {
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab:hover {
            color: #10B981 !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab:hover .ant-tabs-tab-btn {
            color: #10B981 !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tab-active {
            background-color: #059669 !important;
            border-color: #059669 !important;
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-content-holder {
            background-color: transparent !important;
          }
          
          .org-settings-tabs-dark .ant-tabs-tabpane {
            color: #F9FAFB !important;
          }
        `
          : ''}

        ${!darkMode
          ? `
          /* Light mode tabs styling */
          .org-settings-tabs .ant-tabs-tab-active {
            background-color: #059669 !important;
            border-color: #059669 !important;
          }

          .org-settings-tabs {
            background-color: #ffffff !important;
            border-color: #d1d5db !important;
          }
          
          .org-settings-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #FFFFFF !important;
          }
          
          .org-settings-tabs .ant-tabs-tab:hover {
            color: #059669 !important;
          }
        `
          : ''}
        
        /* Dark mode dropdown options */
        .org-settings-dark-dropdown {
          background-color: #374151 !important;
        }

        .org-settings-dark-dropdown .ant-select-item {
          color: #f9fafb !important;
        }

        .org-settings-dark-dropdown .ant-select-item:hover {
          background-color: #4b5563 !important;
        }

        .org-settings-dark-dropdown .ant-select-item-option-selected {
          background-color: #059669 !important;
          color: #ffffff !important;
        }

        /* Work arrangement dropdown specific styles */
        .work-arrangement-dropdown .ant-select-item {
          min-height: 60px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }

        .work-arrangement-dropdown.org-settings-dark-dropdown .ant-select-item {
          background-color: #374151 !important;
          color: #f9fafb !important;
        }

        .work-arrangement-dropdown:not(.org-settings-dark-dropdown) .ant-select-item {
          background-color: #ffffff !important;
          color: #374151 !important;
        }

        .work-arrangement-dropdown .ant-select-item:hover {
          background-color: ${darkMode ? '#4B5563' : '#F3F4F6'} !important;
        }

        .work-arrangement-dropdown .ant-select-item-option-selected {
          background-color: #10b981 !important;
          color: #ffffff !important;
        }

        /* Form item styling for proper spacing */
        .ant-form-item {
          margin-bottom: 20px !important;
        }

        .ant-form-item-label {
          padding-bottom: 8px !important;
        }

        /* Button hover states */
        .ant-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .ant-btn:active {
          transform: translateY(0) !important;
        }

        /* Specific button styling for org settings */
        .org-settings-save-btn:hover:not(:disabled) {
          background-color: #059669 !important;
          border-color: #059669 !important;
        }

        .org-settings-reset-btn:hover {
          background-color: ${darkMode ? '#4B5563' : '#6B7280'} !important;
          border-color: ${darkMode ? '#4B5563' : '#6B7280'} !important;
        }

        .org-settings-leave-btn:hover {
          background-color: ${darkMode ? '#B91C1C' : '#DC2626'} !important;
          border-color: ${darkMode ? '#B91C1C' : '#DC2626'} !important;
        }

        /* Tab content spacing */
        .ant-tabs-tabpane {
          padding-top: 0px !important;
          margin-top: -15px !important;
        }
      `}</style>
    </div>
  )
})

OrgSettings.displayName = 'OrgSettings'

export default OrgSettings
export { BusinessSetupModal }
