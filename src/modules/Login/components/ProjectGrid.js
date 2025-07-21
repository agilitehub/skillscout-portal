// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Card, Typography, Row, Col } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import { BRAND_COLORS } from '../../../core/theme/colors'

const { Title, Paragraph } = Typography

/**
 * ProjectGrid component - Desktop grid layout for featured projects
 * Implements responsive design with hover effects
 */
const ProjectGrid = React.memo(({ projects, onProjectClick, isProjectClickable }) => {
  const { darkMode } = useTheme()

  // Validate props
  if (!projects || projects.length === 0) {
    return null
  }

  // Error boundary for grid
  try {
    return (
      <div className='hidden md:block w-full max-w-7xl mb-4'>
        <Row gutter={[12, 16]} justify='center'>
          {projects.map((project, index) => (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} key={index}>
              <Card
                className={`h-full border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isProjectClickable(project) ? 'cursor-pointer' : ''
                }`}
                style={{
                  background: darkMode ? 'rgba(10, 25, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(8px)',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 5
                }}
                bodyStyle={{ padding: 0 }}
                onClick={isProjectClickable(project) ? () => onProjectClick(project) : undefined}
              >
                <div
                  className='h-2'
                  style={{
                    background: `linear-gradient(to right, ${project.gradientColors[0]}, ${project.gradientColors[1]})`
                  }}
                />
                <div className='p-4'>
                  <div className='flex items-center mb-3'>
                    <div
                      className='w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0'
                      style={{
                        background: `linear-gradient(135deg, ${project.gradientColors[0]}, ${project.gradientColors[1]})`,
                        boxShadow: `0 4px 10px 0 ${project.color}40`
                      }}
                    >
                      <FontAwesomeIcon icon={project.icon} className='text-white text-sm' />
                    </div>
                    <Title
                      level={4}
                      className='line-clamp-2 m-0 text-sm lg:text-base'
                      style={{
                        color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.logoNavy
                      }}
                    >
                      {project.name}
                    </Title>
                  </div>

                  <Paragraph
                    className='line-clamp-3 mb-3 text-xs lg:text-sm'
                    style={{
                      color: darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray
                    }}
                  >
                    {project.description}
                  </Paragraph>

                  {isProjectClickable(project) && (
                    <div
                      className='flex items-center text-sm transition-colors duration-200'
                      style={{ color: project.color }}
                    >
                      <span>Click to explore</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className='ml-2 transition-transform duration-200 group-hover:translate-x-1'
                      />
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
  } catch (error) {
    console.error('Error rendering ProjectGrid:', error)
    return null
  }
})

ProjectGrid.displayName = 'ProjectGrid'

export default ProjectGrid
