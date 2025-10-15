import React from 'react'

import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './core/context/AuthContext'
import { DefaultLayout } from './core/components/layout/DefaultLayout'
import { DashboardLayout } from './core/components/layout/DashboardLayout'

import Login from './modules/Login'
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
import AuthCallback from './AuthCallback'

// Protect routes with an element wrapper
function Protected() {
  const { isAuthenticated } = useAuth()
  console.log('isAuthenticated', isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }
  return <Outlet />
}

// Optional: compute a thin user object once
function useViewUser() {
  const { currentUser, isAuthenticated } = useAuth()

  if (!isAuthenticated || !currentUser) return null

  return {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
    avatar: currentUser.user_metadata?.avatar_url || null
  }
}

export default function AppRoutes() {
  const user = useViewUser()

  return (
    <Routes>
      {/* Auth */}
      <Route path='/auth/callback' element={<AuthCallback />} />

      {/* Public layout */}
      <Route element={<DefaultLayout />}>
        <Route path='/login' element={user ? <Navigate to='/business-dashboard' replace /> : <Login />} />
      </Route>

      {/* Default redirect */}
      <Route
        path='/'
        element={user ? <Navigate to='/business-dashboard' replace /> : <Navigate to='/login' replace />}
      />

      {/* Protected area */}
      <Route element={<Protected />}>
        <Route path='/business-dashboard' element={<DashboardLayout user={user} />}>
          {/* Index route = Dashboard home */}
          <Route index element={<BusinessDashboard user={user} />} />

          {/* Candidates */}
          <Route path='candidates'>
            <Route index element={<Candidates user={user} />} />
            <Route path='create' element={<CandidateForm user={user} />} />
            <Route path=':id/edit' element={<CandidateForm user={user} />} />
          </Route>

          {/* Job Listings */}
          <Route path='job-listings'>
            <Route index element={<JobListings user={user} />} />
            <Route path='create' element={<JobOpportunityForm user={user} />} />
            <Route path=':id/edit' element={<JobOpportunityForm user={user} />} />
          </Route>

          {/* Job Descriptions */}
          <Route path='job-descriptions'>
            <Route index element={<JobDescriptions user={user} />} />
            <Route path='create' element={<JobDescriptionForm user={user} />} />
            <Route path=':id/edit' element={<JobDescriptionForm user={user} />} />
          </Route>

          {/* Questionnaires */}
          <Route path='questionnaires'>
            <Route index element={<Questionnaires user={user} />} />
            <Route path='create' element={<CreateQuestionnaire user={user} />} />
            <Route path=':id/edit' element={<QuestionnaireForm user={user} />} />
          </Route>

          {/* User Management */}
          <Route path='user-management'>
            <Route index element={<UserManagement user={user} />} />
            <Route path='invite' element={<InviteUserPage user={user} />} />
            <Route path=':id/edit' element={<UserEditPage user={user} />} />
          </Route>

          {/* Branches */}
          <Route path='branch-management'>
            <Route index element={<BranchManagement user={user} />} />
            <Route path='create' element={<BranchEditPage user={user} />} />
            <Route path=':id/edit' element={<BranchEditPage user={user} />} />
          </Route>

          {/* Org */}
          <Route path='org-settings' element={<OrgSettings user={user} />} />
          <Route path='billing' element={<Billing user={user} />} />
          <Route path='lookups'>
            <Route index element={<Lookups user={user} />} />
            <Route path='create' element={<LookupForm user={user} />} />
            <Route path=':id/edit' element={<LookupForm user={user} />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path='*' element={<Navigate to={user ? '/business-dashboard' : '/login'} replace />} />
    </Routes>
  )
}
