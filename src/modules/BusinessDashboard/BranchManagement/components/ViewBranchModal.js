// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Modal, Descriptions, Tag, Space, Row, Col } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBuilding, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faUser,
  faGlobe,
  faClock,
  faUsers,
  faCode,
  faCheckCircle,
  faTimesCircle,
  faCalendarAlt,
  faEye,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../../core/components'
import { BRAND_COLORS, SEMANTIC_COLORS } from '../../../../core/theme/colors'

import '../styles/branch-management.css'

/**
 * View Branch Modal Component
 * Displays comprehensive branch information in a read-only format
 */
const ViewBranchModal = React.memo(({ visible, branch, onCancel, darkMode }) => {
  if (!branch) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTimezoneDisplay = (timezone) => {
    const timezoneMap = {
      'America/New_York': 'Eastern Time (ET)',
      'America/Chicago': 'Central Time (CT)',
      'America/Denver': 'Mountain Time (MT)',
      'America/Los_Angeles': 'Pacific Time (PT)',
      'Europe/London': 'Greenwich Mean Time (GMT)',
      'Europe/Paris': 'Central European Time (CET)',
      'Asia/Tokyo': 'Japan Standard Time (JST)',
      'Asia/Shanghai': 'China Standard Time (CST)',
      'Australia/Sydney': 'Australian Eastern Time (AET)'
    }
    return timezoneMap[timezone] || timezone
  }

  return (
    <>
      <Modal
        title={
          <div className='flex items-center space-x-3'>
            <div 
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: branch.status === 'active' ? BRAND_COLORS.emeraldPrimary : BRAND_COLORS.mediumGray }}
            >
              <FontAwesomeIcon icon={faEye} className='text-white text-sm' />
            </div>
            <div>
              <div className='flex items-center space-x-2'>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {branch.name}
                </span>
                {branch.isHeadquarters && (
                  <Tag 
                    color={BRAND_COLORS.emeraldPrimary} 
                    icon={<FontAwesomeIcon icon={faStar} />}
                    className="text-xs"
                  >
                    HEADQUARTERS
                  </Tag>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Code: {branch.code} • {branch.address.city}, {branch.address.state}
              </div>
            </div>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        width={900}
        className="view-branch-modal"
        footer={[
          <Button
            key="close"
            onClick={onCancel}
            style={{
              backgroundColor: BRAND_COLORS.emeraldPrimary,
              borderColor: BRAND_COLORS.emeraldPrimary,
              color: 'white'
            }}
          >
            Close
          </Button>
        ]}
        maskStyle={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)'
        }}
      >
        <div className='space-y-6'>
          {/* Branch Overview */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Branch Overview
            </h3>
            <Descriptions
              bordered
              column={2}
              size='middle'
              className="view-branch-descriptions"
            >
              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faBuilding} />
                    <span>Branch Name</span>
                  </Space>
                }
                span={1}
              >
                {branch.name}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faCode} />
                    <span>Branch Code</span>
                  </Space>
                }
                span={1}
              >
                {branch.code}
              </Descriptions.Item>

              <Descriptions.Item 
                label="Status"
                span={1}
              >
                <Tag 
                  color={branch.status === 'active' ? SEMANTIC_COLORS.success : BRAND_COLORS.mediumGray}
                  icon={<FontAwesomeIcon icon={branch.status === 'active' ? faCheckCircle : faTimesCircle} style={{ marginRight: '6px' }} />}
                  style={{ fontWeight: '500' }}
                >
                  {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Employee Count</span>
                  </Space>
                }
                span={1}
              >
                {branch.employeeCount} employees
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Established</span>
                  </Space>
                }
                span={2}
              >
                {formatDate(branch.established)}
              </Descriptions.Item>

              {branch.description && (
                <Descriptions.Item label="Description" span={2}>
                  <div className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                    {branch.description}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          {/* Address Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Address
            </h3>
            <Descriptions
              bordered
              column={2}
              size='middle'
              className="view-branch-descriptions"
            >
              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Street Address</span>
                  </Space>
                }
                span={2}
              >
                {branch.address.street}
              </Descriptions.Item>

              <Descriptions.Item label="City" span={1}>
                {branch.address.city}
              </Descriptions.Item>

              <Descriptions.Item label="State/Province" span={1}>
                {branch.address.state}
              </Descriptions.Item>

              <Descriptions.Item label="ZIP/Postal Code" span={1}>
                {branch.address.zipCode}
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>Country</span>
                  </Space>
                }
                span={1}
              >
                {branch.address.country}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact Information
            </h3>
            <Descriptions
              bordered
              column={2}
              size='middle'
              className="view-branch-descriptions"
            >
              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Phone</span>
                  </Space>
                }
                span={1}
              >
                <a 
                  href={`tel:${branch.phone}`}
                  className={darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}
                >
                  {branch.phone}
                </a>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Email</span>
                  </Space>
                }
                span={1}
              >
                <a 
                  href={`mailto:${branch.email}`}
                  className={darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}
                >
                  {branch.email}
                </a>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faUser} />
                    <span>Branch Manager</span>
                  </Space>
                }
                span={2}
              >
                {branch.manager}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Operational Details */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Operational Details
            </h3>
            <Descriptions
              bordered
              column={1}
              size='middle'
              className="view-branch-descriptions"
            >
              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faClock} />
                    <span>Timezone</span>
                  </Space>
                }
              >
                {getTimezoneDisplay(branch.timezone)}
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Departments</span>
                  </Space>
                }
              >
                <div className='flex flex-wrap gap-2'>
                  {branch.departments && branch.departments.length > 0 ? (
                    branch.departments.map(dept => (
                      <Tag 
                        key={dept} 
                        color={BRAND_COLORS.shakespeare}
                        style={{ fontWeight: '500' }}
                      >
                        {dept}
                      </Tag>
                    ))
                  ) : (
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      No departments assigned
                    </span>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Stats
            </h3>
            <Row gutter={16}>
              <Col span={8}>
                <div 
                  className={`p-4 rounded-lg border text-center ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {branch.employeeCount}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Employees
                  </div>
                </div>
              </Col>
              
              <Col span={8}>
                <div 
                  className={`p-4 rounded-lg border text-center ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {branch.departments ? branch.departments.length : 0}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Departments
                  </div>
                </div>
              </Col>
              
              <Col span={8}>
                <div 
                  className={`p-4 rounded-lg border text-center ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`text-2xl font-bold ${
                    branch.status === 'active' 
                      ? 'text-green-500' 
                      : 'text-gray-500'
                  }`}>
                    {branch.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Status
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Future Features Preview */}
          {branch.status === 'active' && (
            <div 
              className={`p-4 rounded-lg border-2 border-dashed ${
                darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50/50'
              }`}
            >
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                🚀 Coming Soon
              </h4>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                • Assign users to specific branches<br/>
                • Location-based job listing assignments<br/>
                • Branch performance analytics<br/>
                • Inter-branch collaboration tools
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
})

ViewBranchModal.displayName = 'ViewBranchModal'

export default ViewBranchModal 