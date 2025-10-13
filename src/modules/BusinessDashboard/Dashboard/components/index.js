// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Card, Row, Col, Badge, Typography, Menu, Modal, List, Avatar, Dropdown } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faUser,
  faBriefcase,
  faChartLine,
  faPlus,
  faSearch,
  faEye,
  faSliders,
  faRoute,
  faEdit,
  faBell,
  faUserPlus,
  faQuestion,
  faFileAlt,
  faChevronDown,
  faRefresh
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import Toolbar from '../../../../core/components/Toolbar'
import { BRAND_COLORS, SEMANTIC_COLORS, LIGHT_THEME, DARK_THEME } from '../../../../core/theme/colors'
import { setUserProfileOpen } from '../../../../core/components/profile/store/profileSlice'
import { useDispatch } from 'react-redux'
import { getDashboardStats } from '../utils/controller'

const { Title, Text } = Typography

/**
 * Business Dashboard Main Page - AI-powered recruitment matching system
 * Displays key metrics, quick actions, and AI features
 *
 * Color Scheme:
 * - Primary: Shakespeare Blue (#4A90A4) - main organization features
 * - Success: Emerald Green (#10B981) - user/profile actions
 * - Accent: Picton Blue (#5BA3D4) - job-related features
 * - Warning: Orange (#F59E0B) - admin/settings actions
 * - Teal: Teal Green (#14B8A6) - tracking/progress features
 */
const Dashboard = React.memo(() => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dashboardStats, setDashboardStats] = useState({
    listingCount: 0,
    descriptionCount: 0,
    questionnaireCount: 0
  })

  // State management
  const [alertsVisible, setAlertsVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock data - in real app this would come from API
  useEffect(() => {
    handleGetDashboardStats()
    // eslint-disable-next-line
  }, [])

  const handleGetDashboardStats = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setDashboardStats(data)
    } catch (e) {
      console.error('Dashboard: Error fetching dashboard stats:', e)
      // Set default stats on error
      setDashboardStats({
        listingCount: 0,
        descriptionCount: 0,
        questionnaireCount: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Mock alerts data
  const alertsData = useMemo(
    () => [
      {
        id: 1,
        type: 'candidate_submission',
        title: 'New Candidate Application',
        message: 'John Smith applied for Senior React Developer position',
        timestamp: '2 minutes ago',
        read: false,
        avatar: null
      },
      {
        id: 2,
        type: 'match_found',
        title: 'Candidate Match Found',
        message: 'Sarah Johnson matches 92% with UX Designer role',
        timestamp: '15 minutes ago',
        read: false,
        avatar: null
      },
      {
        id: 3,
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: 'Technical interview with Mike Chen scheduled for tomorrow',
        timestamp: '1 hour ago',
        read: true,
        avatar: null
      }
    ],
    []
  )

  // Workspace Cards Data
  const workspaceCards = useMemo(
    () => [
      {
        title: 'Organization Profile',
        description: 'Manage company information, culture, and requirements',
        icon: faBuilding,
        color: SEMANTIC_COLORS.primary, // Shakespeare blue - primary brand color
        stats: null, // No stats needed - user has one organization
        action: () => navigate('/business-dashboard/org-settings'),
        buttonText: 'Manage'
      },
      {
        title: 'User Profile',
        description: 'Update your personal information and preferences',
        icon: faUser,
        color: SEMANTIC_COLORS.success, // Emerald green for success/profile actions
        stats: null, // No stats needed - user has one profile
        action: () => dispatch(setUserProfileOpen(true)),
        buttonText: 'Update'
      },
      {
        title: 'JobListings',
        description: 'Job postings and requirements',
        icon: faBriefcase,
        color: BRAND_COLORS.pictonBlue, // Picton blue for job-related features
        stats: { value: dashboardStats.listingCount, label: 'Active Listings' },
        action: () => navigate('/business-dashboard/job-listings'),
        buttonText: 'View All'
      },
      {
        title: 'Job Descriptions',
        description: 'Job descriptions and requirements',
        icon: faFileAlt,
        color: BRAND_COLORS.pictonBlue, // Picton blue for job-related features
        stats: { value: dashboardStats.descriptionCount, label: 'Active Listings' },
        action: () => navigate('/business-dashboard/job-descriptions'),
        buttonText: 'View All'
      },
      {
        title: 'Questionnaires',
        description: 'Questionnaires for job postings',
        icon: faQuestion,
        color: BRAND_COLORS.pictonBlue, // Picton blue for job-related features
        stats: { value: dashboardStats.questionnaireCount, label: 'Active Listings' },
        action: () => navigate('/business-dashboard/questionnaires'),
        buttonText: 'View All'
      },
      {
        title: 'Administration',
        description: 'User management, settings, and system configuration',
        icon: faSliders,
        color: SEMANTIC_COLORS.warning, // Warning orange for admin/settings
        stats: { value: 4, label: 'Admin Tools' },
        action: () => navigate('/business-dashboard/user-management'),
        buttonText: 'Manage'
      }
    ],
    [navigate, dashboardStats, dispatch]
  )

  // Quick Actions Dropdown Menu
  const quickActionsMenu = useMemo(
    () => (
      <Menu
        className={darkMode ? 'quick-actions-menu-dark' : 'quick-actions-menu'}
        items={[
          {
            key: 'create-listing',
            label: 'Create Listing',
            icon: <FontAwesomeIcon icon={faPlus} />,
            onClick: () => navigate('/business-dashboard/job-listings/create')
          },
          {
            key: 'update-org-profile',
            label: 'Update Organization Profile',
            icon: <FontAwesomeIcon icon={faEdit} />,
            onClick: () => navigate('/business-dashboard/org-settings')
          },
          {
            key: 'update-user-profile',
            label: 'Update User Profile',
            icon: <FontAwesomeIcon icon={faUserPlus} />,
            onClick: () => navigate('/business-dashboard/user-management')
          },
          {
            key: 'manage-listing',
            label: 'Manage Listing',
            icon: <FontAwesomeIcon icon={faEdit} />,
            onClick: () => navigate('/business-dashboard/job-listings')
          }
        ]}
      />
    ),
    [navigate, darkMode]
  )

  // Handle alerts modal
  const handleShowAlerts = useCallback(() => {
    setAlertsVisible(true)
  }, [])

  const handleCloseAlerts = useCallback(() => {
    setAlertsVisible(false)
  }, [])

  // Get alert icon based on type
  const getAlertIcon = useCallback((type) => {
    switch (type) {
      case 'candidate_submission':
        return faUserPlus
      case 'match_found':
        return faSearch
      case 'interview_scheduled':
        return faChartLine
      default:
        return faBell
    }
  }, [])

  // Get alert color based on type
  const getAlertColor = useCallback((type) => {
    switch (type) {
      case 'candidate_submission':
        return SEMANTIC_COLORS.success
      case 'match_found':
        return SEMANTIC_COLORS.primary
      case 'interview_scheduled':
        return SEMANTIC_COLORS.warning
      default:
        return SEMANTIC_COLORS.info
    }
  }, [])

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
      {/* Main Content */}
      <div className='flex flex-col'>
        <Toolbar
          title='Dashboard'
          description='AI-powered recruitment matching system'
          renderActions={() => {
            return (
              <div className='flex items-center space-x-2'>
                {/* Quick Actions Dropdown */}
                <Dropdown overlay={quickActionsMenu} trigger={['click']} placement='bottomRight'>
                  <Button
                    type='default'
                    size='middle'
                    className='flex items-center space-x-1 dashboard-button'
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      color: '#059669',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      fontSize: '13px',
                      height: '32px',
                      paddingLeft: '12px',
                      paddingRight: '12px'
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '11px', marginRight: '4px' }} />
                    <span>Quick Actions</span>
                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px', marginLeft: '4px' }} />
                  </Button>
                </Dropdown>

                {/* Alerts Bell - Hidden for now */}
                {/* <Badge
                  count={alertsData.filter((alert) => !alert.read).length}
                  size='small'
                  style={{
                    backgroundColor: SEMANTIC_COLORS.error,
                    color: '#ffffff'
                  }}
                >
                  <Button
                    type='default'
                    className='flex items-center justify-center w-8 h-8 rounded-full bell-button'
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      color: '#059669',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa'
                      e.currentTarget.style.borderColor = '#f8f9fa'
                      e.currentTarget.style.color = '#047857'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.borderColor = '#ffffff'
                      e.currentTarget.style.color = '#059669'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleShowAlerts}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      🔔
                    </span>
                  </Button>
                </Badge> */}

                {/* Refresh Button */}
                <Button
                  type='default'
                  size='middle'
                  className='flex items-center space-x-1 dashboard-button'
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#ffffff',
                    color: '#059669',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                    height: '32px',
                    paddingLeft: '12px',
                    paddingRight: '12px'
                  }}
                  onClick={() => handleGetDashboardStats()}
                  loading={loading}
                >
                  <FontAwesomeIcon icon={faRefresh} style={{ fontSize: '11px', marginRight: '4px' }} />
                  <span>Refresh</span>
                </Button>
              </div>
            )
          }}
        />

        {/* Workspace Cards */}
        <div className='px-6 py-4'>
          <div>
            <Title
              level={2}
              className='!mb-4'
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
              }}
            >
              Workspace
            </Title>

            <Row gutter={[16, 16]}>
              {workspaceCards.map((card, index) => (
                <Col xs={24} lg={8} key={index} className='flex'>
                  <Card
                    hoverable
                    className='transition-all duration-300 hover:shadow-lg w-full'
                    style={{
                      backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                      borderColor: darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                    bodyStyle={{
                      padding: '16px',
                      backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}
                  >
                    <div className='flex flex-col h-full'>
                      <div className='flex-1 flex flex-col'>
                        <div className='flex items-center mb-3'>
                          <div
                            className='w-10 h-10 rounded-lg flex items-center justify-center mr-3'
                            style={{ backgroundColor: card.color + '20' }}
                          >
                            <FontAwesomeIcon icon={card.icon} style={{ color: card.color, fontSize: '16px' }} />
                          </div>
                          <div className='flex-1'>
                            <Title
                              level={4}
                              className='!mb-0'
                              style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: 0,
                                color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
                              }}
                            >
                              {card.title}
                            </Title>
                          </div>
                        </div>

                        <Text
                          className='block text-sm mb-3'
                          style={{
                            lineHeight: '1.4',
                            color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                          }}
                        >
                          {card.description}
                        </Text>

                        <div className={`flex items-center ${card.stats ? 'justify-between' : 'justify-end'} mt-auto`}>
                          {card.stats && (
                            <div>
                              <Text
                                className='block text-sm'
                                style={{
                                  color: darkMode ? DARK_THEME.text.tertiary : LIGHT_THEME.text.secondary
                                }}
                              >
                                {card.stats.label}
                              </Text>
                              <Text
                                className='block text-xl font-bold'
                                style={{
                                  lineHeight: '1.2',
                                  color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
                                }}
                              >
                                {card.stats.value}
                              </Text>
                            </div>
                          )}

                          <Button
                            type='primary'
                            size='middle'
                            style={{
                              backgroundColor: card.color,
                              borderColor: card.color,
                              boxShadow: 'none',
                              fontSize: '14px',
                              height: '32px',
                              paddingLeft: '16px',
                              paddingRight: '16px'
                            }}
                            onClick={card.action}
                          >
                            {card.buttonText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>

      {/* Alerts Modal */}
      <Modal
        title={
          <div className='flex items-center space-x-2'>
            <span style={{ fontSize: '16px' }}>🔔</span>
            <span>Notifications & Alerts</span>
          </div>
        }
        open={alertsVisible}
        onCancel={handleCloseAlerts}
        footer={null}
        width={600}
        className={darkMode ? 'alerts-modal-dark' : ''}
        styles={{
          content: {
            backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary
          },
          header: {
            backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
            borderBottom: `1px solid ${darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary}`
          }
        }}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <div className='max-h-96 overflow-y-auto'>
          {alertsData.length > 0 ? (
            <List
              dataSource={alertsData}
              renderItem={(alert) => (
                <List.Item
                  className={`${!alert.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''} rounded-lg p-3 mb-2`}
                  style={{
                    border: `1px solid ${darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary}`,
                    backgroundColor: !alert.read
                      ? darkMode
                        ? 'rgba(74, 144, 164, 0.1)'
                        : 'rgba(74, 144, 164, 0.05)'
                      : darkMode
                        ? DARK_THEME.background.secondary
                        : LIGHT_THEME.background.primary
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: darkMode
                            ? `${getAlertColor(alert.type)}15`
                            : `${getAlertColor(alert.type)}20`,
                          border: `2px solid ${getAlertColor(alert.type)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        icon={
                          <FontAwesomeIcon
                            icon={getAlertIcon(alert.type)}
                            style={{
                              color: getAlertColor(alert.type),
                              fontSize: '16px'
                            }}
                          />
                        }
                      />
                    }
                    title={
                      <div className='flex items-center justify-between'>
                        <span
                          className='font-medium'
                          style={{
                            color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
                          }}
                        >
                          {alert.title}
                        </span>
                        {!alert.read && (
                          <Badge
                            count='New'
                            style={{
                              backgroundColor: SEMANTIC_COLORS.primary,
                              color: '#ffffff',
                              fontSize: '11px',
                              height: '20px',
                              lineHeight: '20px',
                              minWidth: '35px',
                              borderRadius: '10px'
                            }}
                          />
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <p
                          className='mb-1'
                          style={{
                            color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                          }}
                        >
                          {alert.message}
                        </p>
                        <Text
                          className='text-xs'
                          style={{
                            color: darkMode ? DARK_THEME.text.tertiary : LIGHT_THEME.text.secondary
                          }}
                        >
                          {alert.timestamp}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className='text-center py-8'>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? `${SEMANTIC_COLORS.primary}15` : `${SEMANTIC_COLORS.primary}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    opacity: 0.7
                  }}
                >
                  🔔
                </span>
              </div>
              <p
                style={{
                  color: darkMode ? DARK_THEME.text.tertiary : LIGHT_THEME.text.secondary,
                  margin: 0
                }}
              >
                No notifications at this time
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Dashboard Button Styles */}
      <style jsx global>{`
        /* Force Dashboard buttons to have white backgrounds */
        .dashboard-button,
        .dashboard-button.ant-btn,
        button.dashboard-button {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .dashboard-button:hover,
        .dashboard-button.ant-btn:hover,
        button.dashboard-button:hover {
          background: #f8f9fa !important;
          background-color: #f8f9fa !important;
          color: #047857 !important;
          border: 1px solid #f8f9fa !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
        }

        /* Bell button specific styles */
        .bell-button,
        .bell-button.ant-btn,
        button.bell-button {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #059669 !important;
          border: 1px solid #ffffff !important;
        }

        .bell-button:hover,
        .bell-button.ant-btn:hover,
        button.bell-button:hover {
          background: #f8f9fa !important;
          background-color: #f8f9fa !important;
          color: #047857 !important;
          border: 1px solid #f8f9fa !important;
        }

        /* Ensure icons and text have proper spacing */
        .dashboard-button .anticon,
        .dashboard-button svg {
          margin-right: 4px !important;
        }

        .dashboard-button span {
          margin-left: 4px !important;
        }

        /* Dark mode overrides */
        ${darkMode
          ? `
          .dashboard-button,
          .dashboard-button.ant-btn,
          button.dashboard-button {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #059669 !important;
            border: 1px solid #ffffff !important;
          }
          
          .dashboard-button:hover,
          .dashboard-button.ant-btn:hover,
          button.dashboard-button:hover {
            background: #f8f9fa !important;
            background-color: #f8f9fa !important;
            color: #047857 !important;
            border: 1px solid #f8f9fa !important;
          }

          .bell-button,
          .bell-button.ant-btn,
          button.bell-button {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #059669 !important;
            border: 1px solid #ffffff !important;
          }
        `
          : ''}
      `}</style>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard
