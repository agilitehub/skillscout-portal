import { Col, Row } from 'antd'
import Header from './Header'
import BusinessSidebar from './BusinessSidebar'
import { Outlet } from 'react-router-dom'

// Layout components
export const DashboardLayout = ({ children, user }) => {
  return (
    <Row className={`flex flex-col min-h-screen w-full `}>
      <Col span={24} className='flex-shrink-0'>
        <Header user={user} />
      </Col>
      <Col span={24} className='flex-1 flex'>
        <Col flex='260px' className='min-w-[260px] max-w-[280px] flex-shrink-0'>
          <BusinessSidebar />
        </Col>
        <Col flex='1' className='w-full overflow-y-auto'>
          {children}
          <Outlet />
        </Col>
      </Col>
    </Row>
  )
}
