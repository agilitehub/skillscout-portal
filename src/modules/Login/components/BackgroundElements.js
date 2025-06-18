// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../../../ui/ThemeContext'
import { LOGIN_COLORS } from '../constants/colors'

/**
 * BackgroundElements component - Renders animated background elements
 * Follows responsive design patterns and theme support
 */
const BackgroundElements = React.memo(() => {
  const { darkMode } = useTheme()

  // Use centralized colors for consistency
  const colors = LOGIN_COLORS

  return (
    <>
      <div 
        className="fixed -top-[5%] -left-[5%] w-1/3 h-1/3 rounded-full animate-pulse opacity-20"
        style={{ 
          backgroundColor: darkMode ? colors.darkBlue : colors.shakespeare,
          animationDuration: '4s',
          animationDirection: 'alternate',
          animationIterationCount: 'infinite'
        }}
      />
      <div 
        className="fixed -bottom-[10%] -right-[5%] w-1/2 h-1/2 rounded-full animate-pulse opacity-20"
        style={{ 
          backgroundColor: darkMode ? colors.darkTeal : colors.logoTeal,
          animationDuration: '6s',
          animationDirection: 'alternate',
          animationIterationCount: 'infinite'
        }}
      />
      <div 
        className="fixed top-[30%] right-[5%] w-24 h-24 rounded-full animate-bounce opacity-30"
        style={{ 
          backgroundColor: darkMode ? colors.blueAccent : colors.diSerria,
          animationDuration: '3s'
        }}
      />
      <div 
        className="fixed bottom-[20%] left-[10%] w-32 h-32 rounded-full animate-ping opacity-15"
        style={{ 
          backgroundColor: darkMode ? colors.blueHighlight : colors.logoGoldAccent,
          animationDuration: '4s'
        }}
      />
      <div 
        className="fixed top-[10%] right-[30%] w-20 h-20 rounded-full animate-pulse opacity-25"
        style={{ 
          backgroundColor: darkMode ? colors.darkBlue : colors.shakespeare,
          animationDuration: '5s',
          animationDirection: 'alternate',
          animationIterationCount: 'infinite'
        }}
      />
      <div 
        className="fixed bottom-[40%] left-[20%] w-16 h-16 rounded-full animate-pulse opacity-20"
        style={{ 
          backgroundColor: darkMode ? colors.logoGoldAccent : colors.lightGold,
          animationDuration: '3.5s',
          animationDirection: 'alternate',
          animationIterationCount: 'infinite'
        }}
      />
    </>
  )
})

BackgroundElements.displayName = 'BackgroundElements'

export default BackgroundElements 