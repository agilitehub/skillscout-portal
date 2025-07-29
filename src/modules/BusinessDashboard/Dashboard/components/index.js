// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback, useMemo } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Badge,
  Typography
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faUser,
  faBriefcase,
  faFileText,
  faUsers,
  faChartLine,
  faPlus,
  faRobot,
  faBrain,
  faSearch,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import BusinessSidebar from '../../components/BusinessSidebar'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

const { Title, Text, Paragraph } = Typography

/**
 * Business Dashboard Main Page - AI-powered recruitment matching system
 * Displays key metrics, quick actions, and AI features
 */
const Dashboard = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  // Mock data - in real app this would come from API
  const dashboardStats = useMemo(() => ({
    organizations: 1,
    jobDescriptions: 1,
    candidates: 0
  }), [])

  // Quick Actions Data
  const quickActions = useMemo(() => [
    {
      title: 'Add Organization',
      description: 'Create a new organization and extract competencies',
      icon: faBuilding,
      color: '#1890ff',
      action: () => navigate('/business-dashboard/org-settings'),
      buttonText: 'Get Started'
    },
    {
      title: 'Create Job Description',
      description: 'Add a new job posting with requirements',
      icon: faFileText,
      color: '#52c41a',
      action: () => navigate('/business-dashboard/job-descriptions/create'),
      buttonText: 'Get Started'
    },
    {
      title: 'Add Candidate',
      description: 'Create candidate profile and extract skills',
      icon: faUsers,
      color: '#722ed1',
      action: () => navigate('/business-dashboard/candidates/create'),
      buttonText: 'Get Started'
    },
    {
      title: 'View Matches',
      description: 'See AI-powered candidate matches',
      icon: faChartLine,
      color: '#fa8c16',
      action: () => navigate('/business-dashboard/candidates'),
      buttonText: 'Get Started'
    }
  ], [navigate])

  // AI Features Data
  const aiFeatures = useMemo(() => [
    {
      title: 'Core Competency Extraction',
      description: 'AI automatically extracts technical skills, soft skills, cultural fit, and experience requirements from conversations with organizations, jobs, and candidates.'
    },
    {
      title: 'AI-Generated Reasoning',
      description: 'Get detailed explanations for why candidates match or don\'t match specific job requirements, helping you make informed hiring decisions.'
    },
    {
      title: 'Intelligent Matching',
      description: 'Advanced algorithm calculates weighted match scores considering technical skills (40%), soft skills (30%), cultural fit (20%), and experience (10%).'
    },
    {
      title: 'Multi-Dimensional Analysis',
      description: 'Comprehensive evaluation across technical capabilities, cultural alignment, work preferences, and career motivations.'
    }
  ], [])

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gray-900'
          : 'bg-gray-50'
      }`}
    >
      {/* Sidebar */}
      <BusinessSidebar />

      {/* Main Content */}
      <div className='flex-1 ml-64 relative'>
        {/* Main Header */}
        <div className='px-8 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <Title 
                level={1} 
                className={`!mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}
              >
                Dashboard
              </Title>
              <Text 
                className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                AI-powered recruitment matching system
              </Text>
            </div>
            
            {/* AI Powered Badge */}
            <Badge 
              count={
                <div className='flex items-center space-x-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                  <FontAwesomeIcon icon={faRobot} />
                  <span>AI Powered</span>
                </div>
              } 
              style={{ backgroundColor: 'transparent' }}
            />
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className='mb-6'>
            <Col xs={24} md={8}>
              <Card 
                className={`h-20 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                bodyStyle={{ 
                  padding: '16px',
                  backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white 
                }}
              >
                <div className='flex items-center'>
                  <div 
                    className='w-10 h-10 rounded-lg flex items-center justify-center mr-3'
                    style={{ backgroundColor: '#1890ff20' }}
                  >
                    <FontAwesomeIcon icon={faBuilding} style={{ color: '#1890ff', fontSize: '16px' }} />
                  </div>
                  <div>
                    <Text className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Organizations
                    </Text>
                    <Title 
                      level={2} 
                      className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}
                    >
                      {dashboardStats.organizations}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                className={`h-20 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                bodyStyle={{ 
                  padding: '16px',
                  backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white 
                }}
              >
                <div className='flex items-center'>
                  <div 
                    className='w-10 h-10 rounded-lg flex items-center justify-center mr-3'
                    style={{ backgroundColor: '#52c41a20' }}
                  >
                    <FontAwesomeIcon icon={faFileText} style={{ color: '#52c41a', fontSize: '16px' }} />
                  </div>
                  <div>
                    <Text className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Job Descriptions
                    </Text>
                    <Title 
                      level={2} 
                      className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}
                    >
                      {dashboardStats.jobDescriptions}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                className={`h-20 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                bodyStyle={{ 
                  padding: '16px',
                  backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white 
                }}
              >
                <div className='flex items-center'>
                  <div 
                    className='w-10 h-10 rounded-lg flex items-center justify-center mr-3'
                    style={{ backgroundColor: '#722ed120' }}
                  >
                    <FontAwesomeIcon icon={faUsers} style={{ color: '#722ed1', fontSize: '16px' }} />
                  </div>
                  <div>
                    <Text className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Candidates
                    </Text>
                    <Title 
                      level={2} 
                      className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}
                    >
                      {dashboardStats.candidates}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <div className='mb-6'>
            <Title 
              level={2} 
              className={`!mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              Quick Actions
            </Title>
            
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                                 <Col xs={24} md={12} key={index}>
                   <Card 
                     hoverable
                     className={`h-36 transition-all duration-300 hover:shadow-lg ${
                       darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                     }`}
                     bodyStyle={{ 
                       padding: '16px',
                       backgroundColor: darkMode ? BRAND_COLORS.darkSlateAlt : BRAND_COLORS.white,
                       height: '100%'
                     }}
                   >
                                         <div className='flex flex-col h-full'>
                       <div className='flex items-center mb-2'>
                         <div 
                           className='w-10 h-10 rounded-lg flex items-center justify-center mr-3'
                           style={{ backgroundColor: action.color + '20' }}
                         >
                           <FontAwesomeIcon 
                             icon={action.icon} 
                             style={{ color: action.color, fontSize: '16px' }} 
                           />
                         </div>
                         <Title 
                           level={4} 
                           className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                           style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}
                         >
                           {action.title}
                         </Title>
                       </div>
                       
                       <Paragraph 
                         className={`text-xs flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                         style={{ margin: '0 0 12px 0', lineHeight: '1.4' }}
                       >
                         {action.description}
                       </Paragraph>
                       
                       <div className='mt-auto'>
                         <Button 
                           type="primary"
                           size="middle"
                           className='quick-action-button font-semibold px-4 py-1 rounded-lg'
                           style={{ 
                             backgroundColor: action.color, 
                             borderColor: action.color,
                             color: 'white',
                             boxShadow: 'none'
                           }}
                           onClick={action.action}
                         >
                           {action.buttonText} <FontAwesomeIcon icon={faPlus} className="ml-1" />
                         </Button>
                       </div>
                     </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* AI Features */}
          <div>
            <Title 
              level={2} 
              className={`!mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              AI Features
            </Title>
            
            <Row gutter={[32, 20]}>
                             {aiFeatures.map((feature, index) => (
                 <Col xs={24} lg={12} key={index}>
                   <div className='space-y-2'>
                     <Title 
                       level={4} 
                       className={`!mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                       style={{ fontSize: '14px', fontWeight: '600' }}
                     >
                       {feature.title}
                     </Title>
                     <Paragraph 
                       className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                       style={{ margin: 0, lineHeight: '1.5', fontSize: '13px' }}
                     >
                       {feature.description}
                     </Paragraph>
                   </div>
                 </Col>
               ))}
            </Row>
          </div>
        </div>
      </div>

      {/* Global CSS for Quick Actions buttons */}
      <style jsx global>{`
        .quick-action-button.ant-btn-primary {
          border: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        .quick-action-button.ant-btn-primary:hover,
        .quick-action-button.ant-btn-primary:focus {
          opacity: 0.9 !important;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        .quick-action-button.ant-btn-primary:active {
          transform: translateY(0px);
        }
      `}</style>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard 