// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../../../core/ThemeContext'

/**
 * BackgroundElements component - Swirling animated background effect
 * Features rotating spiral gradients, curved color transitions, and layered swirl patterns
 * Follows responsive design patterns and theme support
 */
const BackgroundElements = React.memo(() => {
  const { darkMode } = useTheme()

  // Skill Scout color palette for swirling effects
  const colors = {
    // Blues
    darkBlue: '#1E3A52',
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    toreaBay: '#2E5984',
    // Greens
    seaGreen: '#16A085',
    emeraldPrimary: '#059669',
    emeraldBright: '#34D399',
    tealGreen: '#14B8A6',
    forestGreen: '#065F46'
  }

  return (
    <>
      {/* Primary swirling spiral */}
      <div
        className='fixed inset-0 opacity-15'
        style={{
          background: darkMode
            ? `conic-gradient(from 0deg, ${colors.darkBlue}40, ${colors.shakespeare}30, transparent, ${colors.emeraldPrimary}35, ${colors.forestGreen}25, transparent, ${colors.tealGreen}30, transparent)`
            : `conic-gradient(from 0deg, ${colors.pictonBlue}30, ${colors.shakespeare}25, transparent, ${colors.seaGreen}30, ${colors.emeraldPrimary}20, transparent, ${colors.tealGreen}25, transparent)`,
          animation: 'swirl-clockwise 60s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Counter-rotating spiral */}
      <div
        className='fixed inset-0 opacity-12'
        style={{
          background: darkMode
            ? `conic-gradient(from 180deg, transparent, ${colors.emeraldBright}25, ${colors.shakespeare}30, transparent, ${colors.darkBlue}20, ${colors.tealGreen}35, transparent)`
            : `conic-gradient(from 180deg, transparent, ${colors.emeraldPrimary}20, ${colors.pictonBlue}25, transparent, ${colors.toreaBay}18, ${colors.seaGreen}30, transparent)`,
          animation: 'swirl-counter-clockwise 80s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Offset swirling center */}
      <div
        className='fixed inset-0 opacity-10'
        style={{
          background: darkMode
            ? `conic-gradient(from 90deg at 30% 30%, ${colors.tealGreen}30, transparent, ${colors.shakespeare}25, ${colors.forestGreen}20, transparent, ${colors.emeraldPrimary}35, transparent)`
            : `conic-gradient(from 90deg at 30% 30%, ${colors.seaGreen}25, transparent, ${colors.pictonBlue}20, ${colors.emeraldPrimary}18, transparent, ${colors.tealGreen}30, transparent)`,
          animation: 'swirl-clockwise 90s linear infinite',
          transformOrigin: '30% 30%'
        }}
      />

      {/* Secondary offset swirl */}
      <div
        className='fixed inset-0 opacity-8'
        style={{
          background: darkMode
            ? `conic-gradient(from 270deg at 70% 70%, transparent, ${colors.emeraldBright}20, transparent, ${colors.shakespeare}30, ${colors.darkBlue}25, transparent, ${colors.tealGreen}28)`
            : `conic-gradient(from 270deg at 70% 70%, transparent, ${colors.emeraldPrimary}18, transparent, ${colors.pictonBlue}25, ${colors.toreaBay}20, transparent, ${colors.seaGreen}25)`,
          animation: 'swirl-counter-clockwise 100s linear infinite',
          transformOrigin: '70% 70%'
        }}
      />

      {/* Radial swirling gradients */}
      <div
        className='fixed inset-0 opacity-12'
        style={{
          background: darkMode
            ? `radial-gradient(ellipse at 20% 50%, ${colors.shakespeare}25 0%, transparent 60%),
               radial-gradient(ellipse at 80% 50%, ${colors.emeraldPrimary}30 0%, transparent 60%)`
            : `radial-gradient(ellipse at 20% 50%, ${colors.pictonBlue}20 0%, transparent 60%),
               radial-gradient(ellipse at 80% 50%, ${colors.seaGreen}25 0%, transparent 60%)`,
          animation: 'swirl-slow-clockwise 120s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Curved gradient paths */}
      <div
        className='fixed inset-0 opacity-6'
        style={{
          background: darkMode
            ? `conic-gradient(from 45deg at 50% 20%, ${colors.tealGreen}20, transparent 30%, ${colors.forestGreen}15, transparent 60%, ${colors.shakespeare}25, transparent 90%)`
            : `conic-gradient(from 45deg at 50% 20%, ${colors.emeraldPrimary}15, transparent 30%, ${colors.tealGreen}12, transparent 60%, ${colors.pictonBlue}20, transparent 90%)`,
          animation: 'swirl-clockwise 130s linear infinite',
          transformOrigin: '50% 20%'
        }}
      />

      <div
        className='fixed inset-0 opacity-6'
        style={{
          background: darkMode
            ? `conic-gradient(from 225deg at 50% 80%, ${colors.emeraldBright}18, transparent 30%, ${colors.darkBlue}20, transparent 60%, ${colors.tealGreen}22, transparent 90%)`
            : `conic-gradient(from 225deg at 50% 80%, ${colors.emeraldPrimary}15, transparent 30%, ${colors.toreaBay}18, transparent 60%, ${colors.seaGreen}20, transparent 90%)`,
          animation: 'swirl-counter-clockwise 140s linear infinite',
          transformOrigin: '50% 80%'
        }}
      />

      {/* Multi-arm spiral */}
      <div
        className='fixed inset-0 opacity-8'
        style={{
          background: darkMode
            ? `conic-gradient(from 0deg, ${colors.shakespeare}15, transparent 12.5%, ${colors.emeraldPrimary}20, transparent 25%, ${colors.tealGreen}18, transparent 37.5%, ${colors.forestGreen}15, transparent 50%, ${colors.darkBlue}22, transparent 62.5%, ${colors.emeraldBright}16, transparent 75%, ${colors.shakespeare}20, transparent 87.5%)`
            : `conic-gradient(from 0deg, ${colors.pictonBlue}12, transparent 12.5%, ${colors.seaGreen}18, transparent 25%, ${colors.emeraldPrimary}15, transparent 37.5%, ${colors.tealGreen}12, transparent 50%, ${colors.toreaBay}20, transparent 62.5%, ${colors.emeraldPrimary}14, transparent 75%, ${colors.pictonBlue}18, transparent 87.5%)`,
          animation: 'swirl-clockwise 45s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Subtle depth vignette */}
      <div
        className='fixed inset-0 opacity-4 pointer-events-none'
        style={{
          background: darkMode
            ? `radial-gradient(circle at center, transparent 0%, ${colors.darkBlue}15 100%)`
            : `radial-gradient(circle at center, transparent 0%, ${colors.shakespeare}10 100%)`
        }}
      />
    </>
  )
})

BackgroundElements.displayName = 'BackgroundElements'

export default BackgroundElements
