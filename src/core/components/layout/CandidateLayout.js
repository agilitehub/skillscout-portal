// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const DARK_CONTENT_BG = 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
const LIGHT_CONTENT_BG = 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'

/**
 * Candidate / personal dashboard shell — full-width content with header only (no business sidebar).
 */
export const CandidateLayout = ({ user }) => {
  const { darkMode } = useTheme()
  const contentBg = darkMode ? DARK_CONTENT_BG : LIGHT_CONTENT_BG

  return (
    <div className='flex h-screen w-full flex-col overflow-hidden'>
      <header className='flex-shrink-0'>
        <Header user={user} sticky={false} />
      </header>
      <main className={`min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden ${contentBg}`}>
        <Outlet />
      </main>
    </div>
  )
}
