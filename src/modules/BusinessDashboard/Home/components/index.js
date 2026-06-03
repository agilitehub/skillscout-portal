// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Card, Row, Col, Typography, Dropdown } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faUser,
  faBriefcase,
  faPlus,
  faSliders,
  faEdit,
  faUserPlus,
  faQuestion,
  faFileAlt,
  faChevronDown,
  faRefresh
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button, BusinessDashboardPageShell, DashboardToolbarButton, Toolbar } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'
import { setUserProfileOpen } from '../../../../core/store/slices/profileSlice'
import { useDispatch } from 'react-redux'
import { getDashboardStats } from '../controllers'
import { buildBusinessDashboardPath } from '../../../../constants'
import { getUserOrganization } from '../../../../core/infra/supabase-controller'
import { usePotentialCandidates } from '../hooks/usePotentialCandidates'
import PotentialCandidatesSection from './PotentialCandidatesSection'

import '../styles/dashboard.css'

const { Title, Text } = Typography

/**
 * Business Dashboard Main Page - AI-powered recruitment matching system
 */
const Dashboard = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dashboardStats, setDashboardStats] = useState({
    listingCount: 0,
    descriptionCount: 0,
    questionnaireCount: 0
  })
  const [orgId, setOrgId] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const { matches, loading: matchesLoading, error: matchesError, refresh: refreshMatches } =
    usePotentialCandidates(orgId)

  useEffect(() => {
    const loadOrg = async () => {
      if (!user?.id) {
        setOrgId(null)
        return
      }
      const result = await getUserOrganization(user.id)
      if (result.success && result.data?.organization?.id) {
        setOrgId(result.data.organization.id)
      } else {
        setOrgId(null)
      }
    }
    loadOrg()
  }, [user?.id])

  const handleRefresh = useCallback(async () => {
    setStatsLoading(true)
    try {
      const data = await getDashboardStats()
      setDashboardStats(data)
      await refreshMatches()
    } catch (e) {
      console.error('Dashboard: Error refreshing:', e)
      setDashboardStats({
        listingCount: 0,
        descriptionCount: 0,
        questionnaireCount: 0
      })
    } finally {
      setStatsLoading(false)
    }
  }, [refreshMatches])

  useEffect(() => {
    handleRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const workspaceCards = useMemo(
    () => [
      {
        title: 'Organization Profile',
        description: 'Manage company information, culture, and requirements',
        icon: faBuilding,
        color: SEMANTIC_COLORS.primary,
        stats: null,
        action: () => navigate(buildBusinessDashboardPath('org-settings')),
        buttonText: 'Manage'
      },
      {
        title: 'User Profile',
        description: 'Update your personal information and preferences',
        icon: faUser,
        color: SEMANTIC_COLORS.success,
        stats: null,
        action: () => dispatch(setUserProfileOpen(true)),
        buttonText: 'Update'
      },
      {
        title: 'Job Listings',
        description: 'Job postings and requirements',
        icon: faBriefcase,
        color: BRAND_COLORS.pictonBlue,
        stats: { value: dashboardStats.listingCount, label: 'Active Listings' },
        action: () => navigate(buildBusinessDashboardPath('job-listings')),
        buttonText: 'View All'
      },
      {
        title: 'Job Descriptions',
        description: 'Job descriptions and requirements',
        icon: faFileAlt,
        color: BRAND_COLORS.pictonBlue,
        stats: { value: dashboardStats.descriptionCount, label: 'Descriptions' },
        action: () => navigate(buildBusinessDashboardPath('job-descriptions')),
        buttonText: 'View All'
      },
      {
        title: 'Questionnaires',
        description: 'Questionnaires for job postings',
        icon: faQuestion,
        color: BRAND_COLORS.pictonBlue,
        stats: { value: dashboardStats.questionnaireCount, label: 'Questionnaires' },
        action: () => navigate(buildBusinessDashboardPath('questionnaires')),
        buttonText: 'View All'
      },
      {
        title: 'Administration',
        description: 'User management, settings, and system configuration',
        icon: faSliders,
        color: SEMANTIC_COLORS.warning,
        stats: { value: 4, label: 'Admin Tools' },
        action: () => navigate(buildBusinessDashboardPath('user-management')),
        buttonText: 'Manage'
      }
    ],
    [navigate, dashboardStats, dispatch]
  )

  const quickActionsMenu = useMemo(
    () => ({
      className: darkMode ? 'quick-actions-menu-dark' : 'quick-actions-menu',
      items: [
        {
          key: 'create-listing',
          label: 'Create Listing',
          icon: <FontAwesomeIcon icon={faPlus} />,
          onClick: () => navigate(buildBusinessDashboardPath('job-listings/create'))
        },
        {
          key: 'update-org-profile',
          label: 'Update Organization Profile',
          icon: <FontAwesomeIcon icon={faEdit} />,
          onClick: () => navigate(buildBusinessDashboardPath('org-settings'))
        },
        {
          key: 'update-user-profile',
          label: 'Update User Profile',
          icon: <FontAwesomeIcon icon={faUserPlus} />,
          onClick: () => dispatch(setUserProfileOpen(true))
        },
        {
          key: 'manage-listing',
          label: 'Manage Listing',
          icon: <FontAwesomeIcon icon={faEdit} />,
          onClick: () => navigate(buildBusinessDashboardPath('job-listings'))
        }
      ]
    }),
    [navigate, darkMode, dispatch]
  )

  return (
    <BusinessDashboardPageShell className='min-h-full'>
      <div className='flex flex-col'>
        <Toolbar
          title='Dashboard'
          description='AI-powered recruitment matching system'
          renderActions={() => (
            <div className='flex items-center space-x-2'>
              <Dropdown menu={quickActionsMenu} trigger={['click']} placement='bottomRight'>
                <DashboardToolbarButton className='gap-1'>
                  <FontAwesomeIcon icon={faPlus} className='text-[11px]' />
                  <span>Quick Actions</span>
                  <FontAwesomeIcon icon={faChevronDown} className='text-[10px]' />
                </DashboardToolbarButton>
              </Dropdown>

              <DashboardToolbarButton
                onClick={handleRefresh}
                loading={statsLoading || matchesLoading}
                icon={<FontAwesomeIcon icon={faRefresh} className='text-[11px]' />}
              >
                <span>Refresh</span>
              </DashboardToolbarButton>
            </div>
          )}
        />

        <div className='dashboard-workspace px-3 py-4 sm:px-4'>
          <div>
            <Title
              level={2}
              className={`!mb-4 !text-base !font-bold ${
                darkMode ? '!text-white' : '!text-gray-900'
              }`}
            >
              Workspace
            </Title>

            <Row gutter={[16, 16]}>
              {workspaceCards.map((card, index) => (
                <Col xs={24} lg={8} key={index} className='flex'>
                  <Card
                    hoverable
                    className={`transition-all duration-300 hover:shadow-lg w-full flex flex-col h-full ${
                      darkMode
                        ? '!bg-gray-800 !border-gray-700'
                        : '!bg-white !border-gray-200'
                    }`}
                    styles={{
                      body: {
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                      }
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
                              className={`!mb-0 !text-base !font-semibold ${
                                darkMode ? '!text-white' : '!text-gray-900'
                              }`}
                            >
                              {card.title}
                            </Title>
                          </div>
                        </div>

                        <Text
                          className={`block text-sm mb-3 leading-snug ${
                            darkMode ? '!text-gray-300' : '!text-gray-600'
                          }`}
                        >
                          {card.description}
                        </Text>

                        <div className={`flex items-center ${card.stats ? 'justify-between' : 'justify-end'} mt-auto`}>
                          {card.stats && (
                            <div>
                              <Text
                                className={`block text-sm ${
                                  darkMode ? '!text-gray-400' : '!text-gray-600'
                                }`}
                              >
                                {card.stats.label}
                              </Text>
                              <Text
                                className={`block text-xl font-bold leading-tight ${
                                  darkMode ? '!text-white' : '!text-gray-900'
                                }`}
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

        <PotentialCandidatesSection
          matches={matches}
          loading={matchesLoading}
          error={matchesError}
        />
      </div>
    </BusinessDashboardPageShell>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard
