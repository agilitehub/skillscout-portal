// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Card, Form, message, Tabs, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faGlobe,
  faSave,
  faCog,
  faIndustry,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import { BRAND_COLORS } from '../../../../core/theme/colors'
import AIProfileModal from './AIProfileModal'
import BusinessSetupModal from './BusinessSetupModal'
import OrganizationProfileForm from './OrganizationProfileForm'
import { Toolbar } from '../../../../core/components'
import ModuleContainer from '../../../../core/components/layout/Container/ModuleContainer'
import { useOrgSettings } from '../hooks/useOrgSettings'

import '../styles/org-settings.css'

const { TabPane } = Tabs

/**
 * Organization Settings Page
 * Manages company-wide settings, preferences, and configurations
 */
const OrgSettings = React.memo(({ user }) => {
  const { darkMode } = useTheme()

  const {
    form,
    businessSetupForm,
    loading,
    hasChanges,
    aiModalVisible,
    setAiModalVisible,
    businessSetupModalVisible,
    setBusinessSetupModalVisible,
    handleBusinessSetupModalClose,
    leavingOrganization,
    loadingOrgData,
    hasOrganization,
    activeTab,
    contextHolder,
    orgSettings,
    setOrgSettings,
    handleValuesChange,
    handleSubmit,
    handleTabChange,
    handleLeaveOrganization,
    handleBusinessSetupSubmit
  } = useOrgSettings(user, darkMode)

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
        <ModuleContainer>
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
        </ModuleContainer>
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

    </div>
  )
})

OrgSettings.displayName = 'OrgSettings'

export default OrgSettings
export { BusinessSetupModal }
