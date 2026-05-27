// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'

import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, AuthCallback } from './core/auth'
import { DefaultLayout } from './core/components/layout/DefaultLayout'
import { DashboardLayout } from './core/components/layout/DashboardLayout'
import { CandidateLayout } from './core/components/layout/CandidateLayout'
import { getDefaultDashboardPath } from './constants/paths'

import Login from './modules/Login'
import CandidateDashboard from './modules/CandidateAssessment'
import BusinessDashboard from './modules/BusinessDashboard/Home'
import JobListings, { JobOpportunityForm } from './modules/BusinessDashboard/JobListings'
import JobDescriptions, { JobDescriptionForm } from './modules/BusinessDashboard/JobDescriptions'
import Questionnaires, { CreateQuestionnaire, QuestionnaireForm } from './modules/BusinessDashboard/Questionnaires'
import Lookups, { LookupForm } from './modules/BusinessDashboard/Lookups'
import UserManagement, { InviteUserPage, UserEditPage } from './modules/BusinessDashboard/UserManagement'
import BranchManagement, { BranchEditPage } from './modules/BusinessDashboard/BranchManagement'
import OrgSettings from './modules/BusinessDashboard/OrgSettings'
import Billing from './modules/BusinessDashboard/Billing'
import Candidates, { CandidateForm } from './modules/BusinessDashboard/Candidates'
import CandidateManagement from './modules/BusinessDashboard/CandidateManagement'

// Protect routes with an element wrapper
function Protected() {
  const { isAuthenticated } = useAuth()
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
        <Route path='/login' element={user ? <Navigate to={getDefaultDashboardPath()} replace /> : <Login />} />
      </Route>

      {/* Default redirect */}
      <Route
        path='/'
        element={user ? <Navigate to={getDefaultDashboardPath()} replace /> : <Navigate to='/login' replace />}
      />

      {/* Protected area */}
      <Route element={<Protected />}>
        {/* Candidate / personal dashboard — AI chat, resume prep */}
        <Route path='/dashboard' element={<CandidateLayout user={user} />}>
          <Route index element={<CandidateDashboard user={user} />} />
        </Route>

        <Route path='/business-dashboard' element={<DashboardLayout user={user} />}>
          {/* Index route = business home */}
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

          <Route path='candidate-management' element={<CandidateManagement user={user} />} />

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
      <Route path='*' element={<Navigate to={user ? getDefaultDashboardPath() : '/login'} replace />} />
    </Routes>
  )
}
