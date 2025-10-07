import React, { useEffect, useState } from 'react'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
import Login from './modules/Login'
// import Dashboard from './modules/Dashboard'
import BusinessDashboard from './modules/BusinessDashboard/Dashboard/components'
import JobListings from './modules/BusinessDashboard/JobListings/components'
import JobDescriptions from './modules/BusinessDashboard/JobDescriptions/components'
import JobDescriptionForm from './modules/BusinessDashboard/JobDescriptions/components/JobDescriptionForm'
import Questionnaires from './modules/BusinessDashboard/Questionnaires/components'
import CreateQuestionnaire from './modules/BusinessDashboard/Questionnaires/components/CreateQuestionnaire'
import QuestionnaireForm from './modules/BusinessDashboard/Questionnaires/components/QuestionnaireForm'
import JobOpportunityForm from './modules/BusinessDashboard/JobListings/components/JobOpportunityForm'
import Lookups from './modules/BusinessDashboard/Lookups/components'
import LookupForm from './modules/BusinessDashboard/Lookups/components/LookupForm'
import UserManagement from './modules/BusinessDashboard/UserManagement/components'
import InviteUserPage from './modules/BusinessDashboard/UserManagement/components/InviteUserPage'
import UserEditPage from './modules/BusinessDashboard/UserManagement/components/UserEditPage'
import BranchManagement from './modules/BusinessDashboard/BranchManagement/components'
import BranchEditPage from './modules/BusinessDashboard/BranchManagement/components/BranchEditPage'
import OrgSettings from './modules/BusinessDashboard/OrgSettings/components'
import Billing from './modules/BusinessDashboard/Billing/components'
import Candidates from './modules/BusinessDashboard/Candidates/components'
import CandidateForm from './modules/BusinessDashboard/Candidates/components/CandidateForm'
import Header from './core/components/layout/Header'
import BusinessDashboardLayout from './core/components/layout/BusinessDashboardLayout'
import { useAuth } from './core/context/AuthContext'
import { useTheme } from './core/context/ThemeContext'

// Layout components
export const DashboardLayout = ({ children, user }) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800'
          : 'bg-gradient-to-br from-sky-100 via-gray-50 to-emerald-100'
      }`}
    >
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
  const { currentUser, isAuthenticated } = useAuth()
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      // Transform Supabase user to match expected format
      const transformedUser = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
        avatar: currentUser.user_metadata?.avatar_url || null
      }

      setUser(transformedUser)
    } else {
      setUser(null)
    }
  }, [currentUser, isAuthenticated])

  // Track page views
  useEffect(() => {
    // Analytics tracking would go here
  }, [location])

  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path='/'
        element={
          user ? (
            (() => {
              // Check for saved dashboard preference
              // const savedDashboard = localStorage.getItem('skillscout_dashboard_type')
              // const targetPath = savedDashboard === 'business' ? '/business-dashboard' : '/dashboard'
              return <Navigate to='/business-dashboard' replace user={user} />
            })()
          ) : (
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          )
        }
      />

      {/* Protected routes */}
      {/* <Route
        path='/dashboard'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <Dashboard user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      /> */}

      <Route
        path='/business-dashboard'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <BusinessDashboard user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/candidates'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <Candidates user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/candidates/create'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <CandidateForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/candidates/edit'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <CandidateForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/job-listings'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobListings user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/job-listings/create'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobOpportunityForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/job-descriptions'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobDescriptions user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/job-descriptions/create'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobDescriptionForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/job-descriptions/edit'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobDescriptionForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/questionnaires'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <Questionnaires user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/questionnaires/create'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <CreateQuestionnaire user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/questionnaires/edit'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <QuestionnaireForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/create-job-listing'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobOpportunityForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/edit-job-listing'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <JobOpportunityForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/user-management'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <UserManagement user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/user-management/invite'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <InviteUserPage user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/user-management/edit'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <UserEditPage user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/branch-management'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <BranchManagement user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/branch-management/edit'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <BranchEditPage user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/branch-management/create'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <BranchEditPage user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/org-settings'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <OrgSettings user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/billing'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <Billing user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/lookups'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <Lookups user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/lookups/create'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <LookupForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      <Route
        path='/business-dashboard/lookups/edit'
        element={
          user ? (
            <BusinessDashboardLayout user={user}>
              <LookupForm user={user} />
            </BusinessDashboardLayout>
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
          )
        }
      />

      {/* Fallback - redirect to dashboard if logged in, otherwise to login */}
      <Route path='*' element={user ? <Navigate to='/business-dashboard' replace /> : <Navigate to='/' replace />} />
    </Routes>
  )
}

export default AppRoutes
