// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { Card, Row, Col, Statistic, Badge, Typography, Dropdown, Menu, Modal, List, Avatar } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faUser,
  faBriefcase,
  faChartLine,
  faPlus,
  faRobot,
  faSearch,
  faEye,
  faSliders,
  faRoute,
  faEdit,
  faBell,
  faUserPlus,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS, SEMANTIC_COLORS, LIGHT_THEME, DARK_THEME } from '../../../../core/theme/colors'

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
const Dashboard = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // State management
  const [alertsVisible, setAlertsVisible] = useState(false)

  // Mock data - in real app this would come from API
  const dashboardStats = useMemo(
    () => ({
      organizations: 1,
      jobDescriptions: 1,
      candidates: 0
    }),
    []
  )

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
        action: () => navigate('/business-dashboard/user-management'),
        buttonText: 'Update'
      },
      {
        title: 'Listings',
        description: 'Job postings, descriptions, and requirements',
        icon: faBriefcase,
        color: BRAND_COLORS.pictonBlue, // Picton blue for job-related features
        stats: { value: dashboardStats.jobDescriptions, label: 'Active Listings' },
        action: () => navigate('/business-dashboard/job-listings'),
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
      },
      {
        title: 'Journey Tracker',
        description: 'Candidate pipeline and recruitment progress',
        icon: faRoute,
        color: BRAND_COLORS.tealGreen, // Teal green for tracking/progress
        stats: { value: dashboardStats.candidates, label: 'Active Candidates' },
        action: () => navigate('/business-dashboard/candidates'),
        buttonText: 'Track'
      }
    ],
    [navigate, dashboardStats]
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
          },
          {
            key: 'review-candidates',
            label: 'Review Candidates',
            icon: <FontAwesomeIcon icon={faEye} />,
            onClick: () => navigate('/business-dashboard/candidates')
          },
          {
            key: 'scouting-search',
            label: 'Scouting / Search',
            icon: <FontAwesomeIcon icon={faSearch} />,
            onClick: () => navigate('/business-dashboard/candidates')
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
      {/* Background overlay */}
      <div
        className={`fixed inset-0 ${
          darkMode
            ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-emerald-800/40'
            : 'bg-gradient-to-b from-transparent via-sky-100/40 to-emerald-100/50'
        } pointer-events-none`}
      />

      {/* Sidebar */}
      <BusinessSidebar />

      {/* Main Content */}
      <div className='flex-1 ml-64 relative z-10'>
        {/* Main Header */}
        <div className='px-8 py-8'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <Title
                level={1}
                className='!mb-2'
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  margin: 0,
                  color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
                }}
              >
                Dashboard
              </Title>
              <Text
                className='text-lg'
                style={{
                  color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                }}
              >
                AI-powered recruitment matching system
              </Text>
            </div>

            <div className='flex items-center space-x-4'>
              {/* Quick Actions Dropdown */}
              <Dropdown overlay={quickActionsMenu} trigger={['click']} placement='bottomRight'>
                <Button
                  type='primary'
                  size='large'
                  className='flex items-center space-x-2'
                  style={{
                    backgroundColor: SEMANTIC_COLORS.secondary,
                    borderColor: SEMANTIC_COLORS.secondary,
                    boxShadow: `0 2px 8px ${SEMANTIC_COLORS.secondary}20`,
                    fontSize: '16px',
                    height: '40px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Quick Actions</span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </Button>
              </Dropdown>

              {/* Alerts Bell */}
              <Badge
                count={alertsData.filter((alert) => !alert.read).length}
                size='small'
                style={{
                  backgroundColor: SEMANTIC_COLORS.error,
                  color: '#ffffff'
                }}
              >
                <Button
                  type='text'
                  className='flex items-center justify-center w-12 h-12 rounded-full bell-button'
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${darkMode ? DARK_THEME.border.secondary : LIGHT_THEME.border.secondary}`,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode
                      ? DARK_THEME.background.tertiary
                      : LIGHT_THEME.background.tertiary
                    e.currentTarget.style.borderColor = SEMANTIC_COLORS.primary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = darkMode
                      ? DARK_THEME.border.secondary
                      : LIGHT_THEME.border.secondary
                  }}
                  onClick={handleShowAlerts}
                >
                  {/* Using Unicode bell as fallback if FontAwesome doesn't work */}
                  <span
                    style={{
                      color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary,
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    🔔
                  </span>
                </Button>
              </Badge>

              {/* AI Powered Badge */}
              <Badge
                count={
                  <div
                    className='flex items-center space-x-2 text-white px-4 py-2 rounded-full text-base font-medium'
                    style={{ backgroundColor: SEMANTIC_COLORS.primary }}
                  >
                    <FontAwesomeIcon icon={faRobot} style={{ fontSize: '16px' }} />
                    <span>AI Powered</span>
                  </div>
                }
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </div>

          {/* Workspace Cards */}
          <div className='mb-12'>
            <Title
              level={2}
              className='!mb-6'
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
              }}
            >
              Workspace
            </Title>

            <Row gutter={[24, 24]}>
              {workspaceCards.map((card, index) => (
                <Col xs={24} lg={index < 3 ? 8 : 12} key={index}>
                  <Card
                    hoverable
                    className='h-48 transition-all duration-300 hover:shadow-lg'
                    style={{
                      backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                      borderColor: darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary
                    }}
                    bodyStyle={{
                      padding: '24px',
                      backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                      height: '100%'
                    }}
                  >
                    <div className='flex h-full'>
                      <div className='flex-1'>
                        <div className='flex items-center mb-4'>
                          <div
                            className='w-12 h-12 rounded-lg flex items-center justify-center mr-4'
                            style={{ backgroundColor: card.color + '20' }}
                          >
                            <FontAwesomeIcon icon={card.icon} style={{ color: card.color, fontSize: '20px' }} />
                          </div>
                          <div className='flex-1'>
                            <Title
                              level={4}
                              className='!mb-0'
                              style={{
                                fontSize: '18px',
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
                          className='block text-sm mb-4'
                          style={{
                            lineHeight: '1.4',
                            color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                          }}
                        >
                          {card.description}
                        </Text>

                        <div className={`flex items-center ${card.stats ? 'justify-between' : 'justify-end'}`}>
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
                                className='block text-2xl font-bold'
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
                              height: '36px',
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

          {/* Recent Activity Summary */}
          <div>
            <Title
              level={2}
              className='!mb-6'
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary
              }}
            >
              Recent Activity
            </Title>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card
                  className='h-28'
                  style={{
                    backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                    borderColor: darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary
                  }}
                  bodyStyle={{
                    padding: '24px',
                    backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: '14px',
                          color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                        }}
                      >
                        New Applications
                      </span>
                    }
                    value={3}
                    prefix={
                      <FontAwesomeIcon icon={faUserPlus} style={{ color: SEMANTIC_COLORS.success, fontSize: '18px' }} />
                    }
                    valueStyle={{
                      color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary,
                      fontSize: '28px'
                    }}
                  />
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  className='h-28'
                  style={{
                    backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                    borderColor: darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary
                  }}
                  bodyStyle={{
                    padding: '24px',
                    backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: '14px',
                          color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                        }}
                      >
                        AI Matches Found
                      </span>
                    }
                    value={7}
                    prefix={
                      <FontAwesomeIcon icon={faSearch} style={{ color: SEMANTIC_COLORS.primary, fontSize: '18px' }} />
                    }
                    valueStyle={{
                      color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary,
                      fontSize: '28px'
                    }}
                  />
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  className='h-28'
                  style={{
                    backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                    borderColor: darkMode ? DARK_THEME.border.primary : LIGHT_THEME.border.primary
                  }}
                  bodyStyle={{
                    padding: '24px',
                    backgroundColor: darkMode ? DARK_THEME.background.secondary : LIGHT_THEME.background.primary,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: '14px',
                          color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary
                        }}
                      >
                        Interviews Scheduled
                      </span>
                    }
                    value={2}
                    prefix={
                      <FontAwesomeIcon
                        icon={faChartLine}
                        style={{ color: SEMANTIC_COLORS.warning, fontSize: '18px' }}
                      />
                    }
                    valueStyle={{
                      color: darkMode ? DARK_THEME.text.primary : LIGHT_THEME.text.primary,
                      fontSize: '28px'
                    }}
                  />
                </Card>
              </Col>
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

      {/* Global CSS */}
      <style jsx global>{`
        /* Bell Button Styling */
        .bell-button:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .bell-button:hover {
          transform: scale(1.05);
        }

        .ant-badge-count {
          box-shadow: 0 0 0 1px ${darkMode ? DARK_THEME.background.primary : LIGHT_THEME.background.primary} !important;
        }

        /* Quick Actions Menu Styling */
        .quick-actions-menu .ant-dropdown-menu-item {
          padding: 8px 16px;
          transition: all 0.2s ease;
        }

        .quick-actions-menu .ant-dropdown-menu-item:hover {
          background-color: ${LIGHT_THEME.background.tertiary};
          color: ${SEMANTIC_COLORS.primary};
        }

        .quick-actions-menu-dark .ant-dropdown-menu {
          background-color: ${DARK_THEME.background.secondary};
          border: 1px solid ${DARK_THEME.border.primary};
        }

        .quick-actions-menu-dark .ant-dropdown-menu-item {
          color: ${DARK_THEME.text.primary};
        }

        .quick-actions-menu-dark .ant-dropdown-menu-item:hover {
          background-color: ${DARK_THEME.background.tertiary};
          color: ${SEMANTIC_COLORS.secondary};
        }

        /* Alerts Modal Dark Mode */
        .alerts-modal-dark .ant-modal-content {
          background-color: ${DARK_THEME.background.secondary};
        }

        .alerts-modal-dark .ant-modal-header {
          background-color: ${DARK_THEME.background.secondary};
          border-bottom-color: ${DARK_THEME.border.primary};
        }

        .alerts-modal-dark .ant-modal-title {
          color: ${DARK_THEME.text.primary};
        }

        .alerts-modal-dark .ant-modal-close-x {
          color: ${DARK_THEME.text.tertiary};
        }

        .alerts-modal-dark .ant-modal-close-x:hover {
          color: ${DARK_THEME.text.primary};
        }
      `}</style>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard
