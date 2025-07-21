// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { useTheme } from '../../../core/context/ThemeContext'
import { BRAND_COLORS } from '../../../core/theme/colors'

/**
 * BackgroundElements component - Swirling animated background effect
 * Features rotating spiral gradients, curved color transitions, and layered swirl patterns
 * Follows responsive design patterns and theme support
 */
const BackgroundElements = React.memo(() => {
  const { darkMode } = useTheme()

  return (
    <>
      {/* Primary swirling spiral */}
      <div
        className='fixed inset-0 opacity-15'
        style={{
          background: darkMode
            ? `conic-gradient(from 0deg, ${BRAND_COLORS.darkBlue}40, ${BRAND_COLORS.shakespeare}30, transparent, ${BRAND_COLORS.emeraldPrimary}35, ${BRAND_COLORS.forestGreen}25, transparent, ${BRAND_COLORS.tealGreen}30, transparent)`
            : `conic-gradient(from 0deg, ${BRAND_COLORS.pictonBlue}30, ${BRAND_COLORS.shakespeare}25, transparent, ${BRAND_COLORS.seaGreen}30, ${BRAND_COLORS.emeraldPrimary}20, transparent, ${BRAND_COLORS.tealGreen}25, transparent)`,
          animation: 'swirl-clockwise 60s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Counter-rotating spiral */}
      <div
        className='fixed inset-0 opacity-12'
        style={{
          background: darkMode
            ? `conic-gradient(from 180deg, transparent, ${BRAND_COLORS.emeraldBright}25, ${BRAND_COLORS.shakespeare}30, transparent, ${BRAND_COLORS.darkBlue}20, ${BRAND_COLORS.tealGreen}35, transparent)`
            : `conic-gradient(from 180deg, transparent, ${BRAND_COLORS.emeraldPrimary}20, ${BRAND_COLORS.pictonBlue}25, transparent, ${BRAND_COLORS.toreaBay}18, ${BRAND_COLORS.seaGreen}30, transparent)`,
          animation: 'swirl-counter-clockwise 80s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Offset swirling center */}
      <div
        className='fixed inset-0 opacity-10'
        style={{
          background: darkMode
            ? `conic-gradient(from 90deg at 30% 30%, ${BRAND_COLORS.tealGreen}30, transparent, ${BRAND_COLORS.shakespeare}25, ${BRAND_COLORS.forestGreen}20, transparent, ${BRAND_COLORS.emeraldPrimary}35, transparent)`
            : `conic-gradient(from 90deg at 30% 30%, ${BRAND_COLORS.seaGreen}25, transparent, ${BRAND_COLORS.pictonBlue}20, ${BRAND_COLORS.emeraldPrimary}18, transparent, ${BRAND_COLORS.tealGreen}30, transparent)`,
          animation: 'swirl-clockwise 90s linear infinite',
          transformOrigin: '30% 30%'
        }}
      />

      {/* Secondary offset swirl */}
      <div
        className='fixed inset-0 opacity-8'
        style={{
          background: darkMode
            ? `conic-gradient(from 270deg at 70% 70%, transparent, ${BRAND_COLORS.emeraldBright}20, transparent, ${BRAND_COLORS.shakespeare}30, ${BRAND_COLORS.darkBlue}25, transparent, ${BRAND_COLORS.tealGreen}28)`
            : `conic-gradient(from 270deg at 70% 70%, transparent, ${BRAND_COLORS.emeraldPrimary}18, transparent, ${BRAND_COLORS.pictonBlue}25, ${BRAND_COLORS.toreaBay}20, transparent, ${BRAND_COLORS.seaGreen}25)`,
          animation: 'swirl-counter-clockwise 100s linear infinite',
          transformOrigin: '70% 70%'
        }}
      />

      {/* Radial swirling gradients */}
      <div
        className='fixed inset-0 opacity-12'
        style={{
          background: darkMode
            ? `radial-gradient(ellipse at 20% 50%, ${BRAND_COLORS.shakespeare}25 0%, transparent 60%),
               radial-gradient(ellipse at 80% 50%, ${BRAND_COLORS.emeraldPrimary}30 0%, transparent 60%)`
            : `radial-gradient(ellipse at 20% 50%, ${BRAND_COLORS.pictonBlue}20 0%, transparent 60%),
               radial-gradient(ellipse at 80% 50%, ${BRAND_COLORS.seaGreen}25 0%, transparent 60%)`,
          animation: 'swirl-slow-clockwise 120s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Curved gradient paths */}
      <div
        className='fixed inset-0 opacity-6'
        style={{
          background: darkMode
            ? `conic-gradient(from 45deg at 50% 20%, ${BRAND_COLORS.tealGreen}20, transparent 30%, ${BRAND_COLORS.forestGreen}15, transparent 60%, ${BRAND_COLORS.shakespeare}25, transparent 90%)`
            : `conic-gradient(from 45deg at 50% 20%, ${BRAND_COLORS.emeraldPrimary}15, transparent 30%, ${BRAND_COLORS.tealGreen}12, transparent 60%, ${BRAND_COLORS.pictonBlue}20, transparent 90%)`,
          animation: 'swirl-clockwise 130s linear infinite',
          transformOrigin: '50% 20%'
        }}
      />

      <div
        className='fixed inset-0 opacity-6'
        style={{
          background: darkMode
            ? `conic-gradient(from 225deg at 50% 80%, ${BRAND_COLORS.emeraldBright}18, transparent 30%, ${BRAND_COLORS.darkBlue}20, transparent 60%, ${BRAND_COLORS.tealGreen}22, transparent 90%)`
            : `conic-gradient(from 225deg at 50% 80%, ${BRAND_COLORS.emeraldPrimary}15, transparent 30%, ${BRAND_COLORS.toreaBay}18, transparent 60%, ${BRAND_COLORS.seaGreen}20, transparent 90%)`,
          animation: 'swirl-counter-clockwise 140s linear infinite',
          transformOrigin: '50% 80%'
        }}
      />

      {/* Multi-arm spiral */}
      <div
        className='fixed inset-0 opacity-8'
        style={{
          background: darkMode
            ? `conic-gradient(from 0deg, ${BRAND_COLORS.shakespeare}15, transparent 12.5%, ${BRAND_COLORS.emeraldPrimary}20, transparent 25%, ${BRAND_COLORS.tealGreen}18, transparent 37.5%, ${BRAND_COLORS.forestGreen}15, transparent 50%, ${BRAND_COLORS.darkBlue}22, transparent 62.5%, ${BRAND_COLORS.emeraldBright}16, transparent 75%, ${BRAND_COLORS.shakespeare}20, transparent 87.5%)`
            : `conic-gradient(from 0deg, ${BRAND_COLORS.pictonBlue}12, transparent 12.5%, ${BRAND_COLORS.seaGreen}18, transparent 25%, ${BRAND_COLORS.emeraldPrimary}15, transparent 37.5%, ${BRAND_COLORS.tealGreen}12, transparent 50%, ${BRAND_COLORS.toreaBay}20, transparent 62.5%, ${BRAND_COLORS.emeraldPrimary}14, transparent 75%, ${BRAND_COLORS.pictonBlue}18, transparent 87.5%)`,
          animation: 'swirl-clockwise 45s linear infinite',
          transformOrigin: 'center'
        }}
      />

      {/* Subtle depth vignette */}
      <div
        className='fixed inset-0 opacity-4 pointer-events-none'
        style={{
          background: darkMode
            ? `radial-gradient(circle at center, transparent 0%, ${BRAND_COLORS.darkBlue}15 100%)`
            : `radial-gradient(circle at center, transparent 0%, ${BRAND_COLORS.shakespeare}10 100%)`
        }}
      />
    </>
  )
})

BackgroundElements.displayName = 'BackgroundElements'

export default BackgroundElements
