// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useEffect } from 'react'
import { useTheme } from '../ThemeContext'

/**
 * GlobalStyles component - Applies global styles programmatically using Tailwind classes
 * This replaces the need for global CSS by applying styles directly to the document
 */
const GlobalStyles = () => {
  const { darkMode } = useTheme()

  useEffect(() => {
    const body = document.body
    const html = document.documentElement

    // Remove all existing body classes to start fresh
    body.className = ''
    
    // Apply base classes that were previously in CSS
    const baseClasses = [
      'transition-colors',
      'duration-200',
      'min-h-screen',
      'font-sans'
    ]

    // Apply theme-specific classes
    if (darkMode) {
      const darkClasses = [
        'bg-gray-900',
        'text-white'
      ]
      body.classList.add(...baseClasses, ...darkClasses)
      
      // Apply dark mode gradient background
      body.style.backgroundImage = 'linear-gradient(to bottom right, rgba(0, 107, 60, 0.2) 0%, rgba(0, 51, 79, 0.8) 50%, rgba(20, 20, 20, 1) 100%)'
    } else {
      const lightClasses = [
        'bg-white',
        'text-gray-900'
      ]
      body.classList.add(...baseClasses, ...lightClasses)
      
      // Apply light mode gradient background
      body.style.backgroundImage = 'linear-gradient(to bottom right, rgba(51, 193, 135, 0.1) 0%, rgba(14, 90, 148, 0.1) 50%, rgba(255, 255, 255, 1) 100%)'
    }

    // Remove any border-top that might cause issues
    body.style.borderTop = 'none'
    html.style.borderTop = 'none'

    // Apply custom scrollbar styles using CSS-in-JS for webkit browsers
    const scrollbarStyles = `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background-color: ${darkMode ? '#1F2937' : '#F3F4F6'};
      }
      ::-webkit-scrollbar-thumb {
        background-color: ${darkMode ? '#4B5563' : '#D1D5DB'};
        border-radius: 9999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: ${darkMode ? '#6B7280' : '#9CA3AF'};
      }
    `

    // Inject scrollbar styles
    let scrollbarStyleElement = document.getElementById('custom-scrollbar-styles')
    if (!scrollbarStyleElement) {
      scrollbarStyleElement = document.createElement('style')
      scrollbarStyleElement.id = 'custom-scrollbar-styles'
      document.head.appendChild(scrollbarStyleElement)
    }
    scrollbarStyleElement.textContent = scrollbarStyles

    // Cleanup function
    return () => {
      // Remove the injected styles when component unmounts
      const styleElement = document.getElementById('custom-scrollbar-styles')
      if (styleElement) {
        styleElement.remove()
      }
    }
  }, [darkMode])

  // This component doesn't render anything
  return null
}

export default GlobalStyles 