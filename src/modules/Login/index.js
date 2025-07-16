// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useEffect, useCallback } from 'react'
import { useLoginData } from './hooks/useLoginData'
import BackgroundElements from './components/BackgroundElements'
import HeroSection from './components/HeroSection'

/**
 * Enhanced Login landing page for SkillScout
 * Implements modular design with theme support, responsive layout, and comprehensive error handling
 * Uses React.memo, useMemo, and useCallback for optimal performance
 * Follows accessibility best practices with semantic HTML and ARIA labels
 * Adheres to module-driven development principles
 */
const Login = React.memo(() => {
  const {
    loading,
    colors,
    handleLogin,
    darkMode
  } = useLoginData()

  // Handle body scroll prevention with comprehensive error handling
  const handleBodyScrollPrevention = useCallback(() => {
    try {
      const originalStyles = {
        overflow: document.body.style.overflow,
        overflowX: document.documentElement.style.overflowX,
        overflowY: document.documentElement.style.overflowY
      }
      
      // Prevent scrolling with validation
      if (document.body && document.documentElement) {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflowX = 'hidden'
        document.documentElement.style.overflowY = 'hidden'
      } else {
        console.warn('Login: Document body or documentElement not available for scroll prevention')
      }
      
      // Return cleanup function
      return () => {
        try {
          if (document.body && document.documentElement) {
            document.body.style.overflow = originalStyles.overflow
            document.documentElement.style.overflowX = originalStyles.overflowX
            document.documentElement.style.overflowY = originalStyles.overflowY
          }
        } catch (cleanupError) {
          console.error('Login: Error during scroll cleanup:', cleanupError)
        }
      }
    } catch (error) {
      console.error('Login: Error setting up scroll prevention:', error)
      return () => {} // Return empty cleanup function on error
    }
  }, [])

  // Effect to prevent body scrolling on this page with error handling
  useEffect(() => {
    let cleanup
    
    try {
      cleanup = handleBodyScrollPrevention()
    } catch (error) {
      console.error('Login: Error in scroll prevention effect:', error)
    }
    
    // Cleanup function with error handling
    return () => {
      try {
        if (cleanup && typeof cleanup === 'function') {
          cleanup()
        }
      } catch (error) {
        console.error('Login: Error during effect cleanup:', error)
      }
    }
  }, [handleBodyScrollPrevention])

  // Validate required data with error handling
  if (!handleLogin || typeof handleLogin !== 'function') {
    console.error('Login: Login handler is missing or invalid')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Login functionality unavailable. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <main 
      className={`fixed inset-0 flex flex-col items-center justify-start overflow-auto w-full max-w-full pt-16 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
      role="main"
      aria-label="SkillScout login page"
    >
      {/* Animated background elements */}
      <BackgroundElements />
      
      {/* Hero section with banner and logo */}
      <HeroSection 
        loading={loading} 
        onLogin={handleLogin} 
      />
    </main>
  )
})

// Set display name for debugging purposes
Login.displayName = 'Login'

export default Login
