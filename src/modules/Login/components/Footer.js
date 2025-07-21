// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Typography } from 'antd'
import { useTheme } from '../../../ui/ThemeContext'
import { BRAND_COLORS } from '../../../core/theme/colors'

const { Paragraph } = Typography

/**
 * Footer component - Displays attribution and project information
 * Implements responsive design and theme support
 */
const Footer = React.memo(() => {
  const { darkMode } = useTheme()

  return (
    <footer className='w-full py-6 md:py-8 z-10'>
      <div className='text-center'>
        <Paragraph
          className='mt-2 md:mt-3 text-sm sm:text-base md:text-lg px-2'
          style={{
            color: darkMode ? BRAND_COLORS.lightGray : BRAND_COLORS.mediumGray
          }}
        >
          A DeSo project by{' '}
          <a
            href='https://focus.xyz/MoneyQuest'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:text-blue-600 transition-colors duration-200 underline'
          >
            @MoneyQuest
          </a>
          . Developed by{' '}
          <a
            href='https://focus.xyz/JohnJardin'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:text-blue-600 transition-colors duration-200 underline'
          >
            @JohnJardin
          </a>{' '}
          &{' '}
          <a
            href='https://focus.xyz/MarianneC'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:text-blue-600 transition-colors duration-200 underline'
          >
            @MarianneC
          </a>
          .
        </Paragraph>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
