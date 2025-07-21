// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Card } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'
import { BRAND_COLORS } from '../../../core/theme/colors'

/**
 * ProjectCarousel component - Mobile carousel for featured projects
 * Implements responsive design with touch-friendly interactions
 */
const ProjectCarousel = React.memo(({ projects, onProjectClick, isProjectClickable }) => {
  const { darkMode } = useTheme()

  // Validate props
  if (!projects || projects.length === 0) {
    return null
  }

  // Error boundary for carousel
  try {
    return (
      <div className='md:hidden w-full px-1 mt-4 mb-4'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
          {projects.map((project, index) => (
            <div key={index} style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}>
              <Card
                className={`h-full border-0 mx-auto transition-shadow duration-300 ${
                  isProjectClickable(project) ? 'cursor-pointer hover:shadow-lg' : ''
                }`}
                style={{
                  background: BRAND_COLORS.white,
                  border: `1px solid ${BRAND_COLORS.lightBorderGray}`,
                  borderRadius: '6px',
                  overflow: 'visible',
                  width: '100%',
                  minHeight: '140px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }}
                bodyStyle={{ padding: '0', overflow: 'visible' }}
                onClick={isProjectClickable(project) ? () => onProjectClick(project) : undefined}
              >
                <div
                  className='h-2'
                  style={{
                    background: `linear-gradient(to right, ${project.gradientColors[0]}, ${project.gradientColors[1]})`
                  }}
                />
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        flexShrink: 0,
                        background: `linear-gradient(135deg, ${project.gradientColors[0]}, ${project.gradientColors[1]})`,
                        boxShadow: `0 2px 6px 0 ${project.color}40`
                      }}
                    >
                      <FontAwesomeIcon icon={project.icon} style={{ color: 'white', fontSize: '14px' }} />
                    </div>
                    <h4
                      style={{
                        color: BRAND_COLORS.black,
                        fontWeight: '600',
                        fontSize: '16px',
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {project.name}
                    </h4>
                  </div>

                  <p
                    style={{
                      color: BRAND_COLORS.darkGray,
                      fontSize: '13px',
                      lineHeight: '1.4',
                      margin: '0 0 8px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {project.description}
                  </p>

                  {isProjectClickable(project) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: project.color,
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      <span>Tap to explore</span>
                      <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '6px', fontSize: '10px' }} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error rendering ProjectCarousel:', error)
    return null
  }
})

ProjectCarousel.displayName = 'ProjectCarousel'

export default ProjectCarousel
