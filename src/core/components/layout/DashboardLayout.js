// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import Header from './Header'
import BusinessSidebar from './BusinessSidebar'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const DARK_CONTENT_BG = 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
const LIGHT_CONTENT_BG = 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'

/**
 * Business dashboard shell. Main content scrolls in <main> because index.html sets html { overflow: hidden }.
 */
export const DashboardLayout = ({ user }) => {
  const { darkMode } = useTheme()
  const contentBg = darkMode ? DARK_CONTENT_BG : LIGHT_CONTENT_BG

  return (
    <div className='flex h-screen w-full flex-col overflow-hidden'>
      <header className='flex-shrink-0'>
        <Header user={user} sticky={false} />
      </header>
      <div className='flex min-h-0 flex-1 overflow-hidden'>
        <aside className='h-full w-[260px] min-w-[260px] max-w-[280px] flex-shrink-0 overflow-y-auto border-r border-gray-700/30'>
          <BusinessSidebar />
        </aside>
        <main className={`min-h-0 flex-1 overflow-y-auto ${contentBg}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

