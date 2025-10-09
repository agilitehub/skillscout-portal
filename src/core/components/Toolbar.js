import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Typography } from 'antd'

const { Title, Text } = Typography

const Toolbar = ({ title, description, renderActions = () => null }) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`relative px-3 py-1.5 border-b flex-shrink-0 shadow-lg ${
        darkMode
          ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border border-emerald-600'
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
      }`}
    >
      <div className='flex items-center justify-between gap-4'>
        <div>
          <Title
            level={1}
            className='!mb-0.5'
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              margin: 0,
              color: '#ffffff'
            }}
          >
            {title}
          </Title>
          <Text
            className='text-xs'
            style={{
              color: '#d1fae5'
            }}
          >
            {description}
          </Text>
        </div>

        {renderActions()}
      </div>
    </div>
  )
}

export default Toolbar
