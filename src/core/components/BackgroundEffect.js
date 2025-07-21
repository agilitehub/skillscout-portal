// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { memo } from 'react'
import PropTypes from 'prop-types'

/**
 * BackgroundEffect component provides a dynamic, animated background
 * with different styles for light and dark modes
 *
 * @component
 * @example
 * // Basic usage in a container
 * <div className="relative">
 *   <BackgroundEffect />
 *   <div className="relative z-10">Your content here</div>
 * </div>
 *
 * // With custom opacity
 * <BackgroundEffect className="opacity-50" />
 */
const BackgroundEffect = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Base gradient background - brand red gradient for dark mode */}
      <div className='absolute inset-0 bg-gradient-to-br from-white via-white to-agilite-grey-light dark:from-primary-dark dark:via-primary dark:to-primary-light'></div>

      {/* Light mode dynamic elements - with dark red colors */}
      <div className='absolute inset-0 block dark:hidden'>
        {/* Dark red circular accent positioned at 25% from top and 8% from left */}
        <div className='absolute top-[25%] left-[8%] w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-primary-dark/30 via-primary/20 to-transparent'></div>

        {/* Horizontal bottom accent line extending 70% with a red gradient */}
        <div className='absolute bottom-0 left-0 w-[70%] h-[5px] bg-gradient-to-r from-primary-dark/70 via-primary to-transparent'></div>

        {/* Geometric shape at the bottom left with a dark red gradient */}
        <div className='absolute left-0 bottom-0 w-[350px] h-[350px]'>
          <div className='absolute left-0 bottom-0 w-[300px] h-[300px] bg-gradient-to-tr from-primary-dark/30 via-primary/15 to-transparent transform rotate-12'></div>
          <div className='absolute left-[50px] bottom-[50px] w-[200px] h-[200px] rounded-tl-[80px] bg-gradient-to-tr from-primary-dark/25 via-primary/10 to-transparent'></div>
        </div>

        {/* Blurred circular accent at bottom right (20% from bottom, 15% from right) */}
        <div className='absolute bottom-[20%] right-[15%] w-[270px] h-[270px] rounded-full bg-gradient-to-bl from-primary-dark/25 via-primary/15 to-transparent blur-xl'></div>

        {/* Blurred circular element at 60% from top and 30% from right */}
        <div className='absolute top-[60%] right-[30%] w-[220px] h-[220px] rounded-full bg-gradient-to-tr from-primary-dark/20 via-primary/15 to-transparent blur-lg'></div>
      </div>

      {/* Dark mode white effects with more interesting shapes */}
      <div className='absolute inset-0 hidden dark:block'>
        {/* Decorative white triangle in top right */}
        <div className='absolute top-[8%] right-[12%] w-0 h-0 border-l-[100px] border-l-transparent border-b-[150px] border-b-white/25 border-r-[100px] border-r-transparent transform rotate-12'></div>

        {/* Wavy white pattern at bottom */}
        <div className='absolute bottom-0 inset-x-0 h-[120px] overflow-hidden'>
          <div className='absolute bottom-[-80px] left-0 w-full h-[200px] rounded-[100%] bg-white/20'></div>
        </div>

        {/* Diamond shape */}
        <div className='absolute left-[20%] top-[30%] w-[140px] h-[140px] bg-white/20 transform rotate-45'></div>

        {/* Zigzag line */}
        <div className='absolute right-[15%] top-[45%] flex space-x-1'>
          <div className='w-[20px] h-[6px] bg-white/35 transform rotate-45'></div>
          <div className='w-[20px] h-[6px] bg-white/35 transform -rotate-45'></div>
          <div className='w-[20px] h-[6px] bg-white/35 transform rotate-45'></div>
          <div className='w-[20px] h-[6px] bg-white/35 transform -rotate-45'></div>
          <div className='w-[20px] h-[6px] bg-white/35 transform rotate-45'></div>
          <div className='w-[20px] h-[6px] bg-white/35 transform -rotate-45'></div>
        </div>

        {/* Concentric squares */}
        <div className='absolute bottom-[20%] left-[10%]'>
          <div className='w-[160px] h-[160px] border-[3px] border-white/15 rotate-[15deg]'></div>
          <div className='absolute top-[20px] left-[20px] w-[120px] h-[120px] border-[2px] border-white/20 rotate-[15deg]'></div>
          <div className='absolute top-[40px] left-[40px] w-[80px] h-[80px] border-[2px] border-white/25 rotate-[15deg]'></div>
        </div>

        {/* Cross shape */}
        <div className='absolute top-[70%] right-[35%]'>
          <div className='w-[10px] h-[50px] bg-white/40 rounded-sm'></div>
          <div className='absolute top-[20px] left-[-20px] w-[50px] h-[10px] bg-white/40 rounded-sm'></div>
        </div>

        {/* Half-circle */}
        <div className='absolute top-[15%] left-[30%] w-[100px] h-[50px] overflow-hidden'>
          <div className='w-[100px] h-[100px] rounded-full border-[4px] border-white/30'></div>
        </div>

        {/* Striped rectangle */}
        <div className='absolute top-[85%] right-[20%] w-[120px] h-[60px] flex flex-col space-y-2'>
          <div className='h-[5px] w-full bg-white/25'></div>
          <div className='h-[5px] w-full bg-white/25'></div>
          <div className='h-[5px] w-full bg-white/25'></div>
          <div className='h-[5px] w-full bg-white/25'></div>
        </div>

        {/* Plus symbols */}
        <div className='absolute top-[40%] right-[45%]'>
          <div className='w-[20px] h-[4px] bg-white/35 rounded-full'></div>
          <div className='absolute top-[-8px] left-[8px] w-[4px] h-[20px] bg-white/35 rounded-full'></div>
        </div>
        <div className='absolute top-[42%] right-[40%]'>
          <div className='w-[12px] h-[3px] bg-white/25 rounded-full'></div>
          <div className='absolute top-[-5px] left-[4.5px] w-[3px] h-[12px] bg-white/25 rounded-full'></div>
        </div>
      </div>
    </div>
  )
}

BackgroundEffect.propTypes = {
  /** Additional CSS classes to apply to the background container */
  className: PropTypes.string
}

// Memoize the component since it's purely presentational
export default memo(BackgroundEffect)
