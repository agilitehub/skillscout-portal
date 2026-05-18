// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { Col, Row } from 'antd'
import Header from './Header'
import BusinessSidebar from './BusinessSidebar'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const DARK_CONTENT_BG = 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
const LIGHT_CONTENT_BG = 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'

// Layout components
export const DashboardLayout = ({ children, user }) => {
  const { darkMode } = useTheme()
  const contentBg = darkMode ? DARK_CONTENT_BG : LIGHT_CONTENT_BG

  return (
    <Row className={`flex flex-col min-h-screen w-full `}>
      <Col span={24} className='flex-shrink-0'>
        <Header user={user} sticky={false} />
      </Col>
      <Col span={24} className='flex min-h-0 flex-1'>
        <Col flex='260px' className='min-w-[260px] max-w-[280px] flex-shrink-0'>
          <BusinessSidebar />
        </Col>
        <Col flex='1' className={`w-full min-h-0 overflow-y-auto ${contentBg}`}>
          {children}
          <Outlet />
        </Col>
      </Col>
    </Row>
  )
}
