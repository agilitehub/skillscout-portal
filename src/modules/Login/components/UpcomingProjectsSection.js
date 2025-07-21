// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Typography } from 'antd'
import { useTheme } from '../../../ui/ThemeContext'
import { LOGIN_COLORS } from '../constants/colors'
import ProjectGrid from './ProjectGrid'
import ProjectCarousel from './ProjectCarousel'

const { Title } = Typography

/**
 * UpcomingProjectsSection component - Displays upcoming projects with responsive layout
 * Implements proper accessibility and semantic HTML structure
 *
 * @param {Object} props - Component props
 * @param {Array} props.projects - Array of project objects
 * @param {Function} props.onProjectClick - Handler for project click events
 * @param {Function} props.isProjectClickable - Function to check if project is clickable
 */
const UpcomingProjectsSection = React.memo(({ projects, onProjectClick, isProjectClickable }) => {
  const { darkMode } = useTheme()

  // Use centralized colors for consistency
  const colors = LOGIN_COLORS

  return (
    <section
      className='w-full flex flex-col items-center justify-center p-4 pt-6 pb-4 md:p-6 z-10 relative'
      aria-labelledby='upcoming-projects-title'
    >
      <Title
        id='upcoming-projects-title'
        level={1}
        className={`text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4 font-bold ${
          darkMode ? 'text-white' : ''
        }`}
        style={
          darkMode
            ? {
                color: BRAND_COLORS.white
              }
            : {
                background: `linear-gradient(90deg, ${colors.shakespeare} 15%, ${colors.logoGold} 85%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }
        }
      >
        Upcoming Projects
      </Title>

      {/* Project Grid for Desktop - Hidden on mobile */}
      <div role='list' aria-label='Upcoming projects grid view'>
        <ProjectGrid projects={projects} onProjectClick={onProjectClick} isProjectClickable={isProjectClickable} />
      </div>

      {/* Project Carousel for Mobile - Hidden on desktop */}
      <div role='list' aria-label='Upcoming projects carousel view'>
        <ProjectCarousel projects={projects} onProjectClick={onProjectClick} isProjectClickable={isProjectClickable} />
      </div>
    </section>
  )
})

UpcomingProjectsSection.displayName = 'UpcomingProjectsSection'

export default UpcomingProjectsSection
