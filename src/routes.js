import React, { useEffect, useState } from 'react'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
import Login from './modules/Login'
import Dashboard from './modules/Dashboard'
import Header from './ui/layout/Header'
import { useAuth } from './ui/AuthContext'

// Layout components
export const DashboardLayout = ({ children, user }) => {
  return (
    <div className='flex flex-col h-screen bg-white/0 dark:bg-gray-950/50'>
      <Header user={user} />
      <main className='flex-1 p-6 overflow-auto relative z-0'>{children}</main>
    </div>
  )
}

export const DefaultLayout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container-padded py-8'>{children}</main>
    </div>
  )
}

/**
 * AppRoutes component containing all application routes
 * @returns {React.ReactElement} Routes component with all application routes
 */
const AppRoutes = () => {
  const { currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser.ProfileEntryResponse)
      console.log('User:', user)
    } else {
      setUser(null)
    }
  }, [currentUser, user])

  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path='/'
        element={
          user ? (
            <Navigate to='/dashboard' replace user={user} />
          ) : (
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          )
        }
      />

      {/* Protected routes */}
      <Route
        path='/dashboard'
        element={
          user ? (
            <DashboardLayout user={user}>
              <Dashboard user={user} />
            </DashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      {/* Fallback - redirect to dashboard if logged in, otherwise to login */}
      <Route path='*' element={user ? <Navigate to='/dashboard' replace /> : <Navigate to='/' replace />} />
    </Routes>
  )
}

export default AppRoutes
