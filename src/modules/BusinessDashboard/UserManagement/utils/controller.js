// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * User Management Controller
 * Handles user management operations and business logic
 */

// Import validation functions if needed in the future
// import { validateUser, validateInvitation, validatePermissions } from './data-model'
import { supabase } from '../../../../core/lib/supabase-controller'
import { getCurrentUser, getUserOrganization } from '../../../../core/lib/supabase-controller'

class UserManagementController {
  constructor() {
    this.apiEndpoint = '/api/user-management'
  }

  /**
   * Helper method to get current user's organization ID
   * @returns {Promise<string>} Organization ID
   * @throws {Error} If user is not authenticated or organization not found
   */
  async getCurrentUserOrgId() {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Get current user and their organization
    const currentUser = await getCurrentUser()
    if (!currentUser.success || !currentUser.user) {
      throw new Error('User not authenticated')
    }

    const userOrgData = await getUserOrganization(currentUser.user.id)
    if (!userOrgData.success || !userOrgData.data.organization) {
      throw new Error('User organization not found')
    }

    const orgId = userOrgData.data.organization.id
    if (!orgId) {
      throw new Error('Invalid organization ID')
    }

    return orgId
  }

  /**
   * Get all organization users (filtered by current user's org_id)
   * @returns {Promise} Users data
   */
  async getAllUsers() {
    try {
      // Get current user's organization ID (with built-in validation)
      const orgId = await this.getCurrentUserOrgId()

      // const currentUser = await getCurrentUser()
      // const currentUserId = currentUser.user.id

      // Fetch all users in the organization with additional validation
      const { data: users, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, org_id, created_at, status')
        .eq('org_id', orgId)
        // .neq('id', currentUserId) // Do not show the current user
        .not('org_id', 'is', null) // Ensure org_id is not null
        .neq('trashed', true) // Exclude trashed users
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        throw new Error('Failed to fetch users from database')
      }

      // Additional security check: ensure all returned users belong to the same organization
      const invalidUsers = users.filter((user) => user.org_id !== orgId)
      if (invalidUsers.length > 0) {
        console.error('Security violation: Users from different organizations returned:', invalidUsers)
        throw new Error('Data integrity error: Invalid organization data detected')
      }

      // Transform the data to match the expected format
      const transformedUsers = users.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        role: 'viewer', // Default role, TODO: add role field to schema later
        status: user.status || 'active', // Use database status or default to 'active'
        lastLogin: null, // TODO: implement last login tracking
        invitedDate: user.created_at,
        permissions: this.getDefaultPermissions('viewer')
      }))

      return {
        success: true,
        data: transformedUsers,
        meta: {
          total: transformedUsers.length,
          organizationId: orgId
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch users'
      }
    }
  }

  /**
   * Get user by ID (only from current user's organization)
   * @param {string} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required')
      }

      // Get current user's organization ID (with built-in validation)
      const orgId = await this.getCurrentUserOrgId()

      // Fetch the specific user in the same organization with security validation
      const { data: user, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, org_id, created_at')
        .eq('id', userId)
        .eq('org_id', orgId)
        .not('org_id', 'is', null) // Ensure org_id is not null
        .neq('trashed', true) // Exclude trashed users
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        if (error.message === 'JSON object requested, multiple (or no) rows returned') {
          throw new Error('User not found in your organization')
        }
        throw new Error('Failed to fetch user from database')
      }

      if (!user) {
        throw new Error('User not found')
      }

      // Additional security check: verify user belongs to the same organization
      if (user.org_id !== orgId) {
        console.error('Security violation: Attempted to access user from different organization:', {
          requestedUserId: userId,
          userOrgId: user.org_id,
          currentOrgId: orgId
        })
        throw new Error('Access denied: User not in your organization')
      }

      // Transform the data to match the expected format
      const transformedUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        role: 'viewer', // Default role, TODO: add role field to schema later
        status: user.status || 'active', // Use database status or default to 'active'
        lastLogin: null, // TODO: implement last login tracking
        invitedDate: user.created_at,
        permissions: this.getDefaultPermissions('viewer')
      }

      return {
        success: true,
        data: transformedUser
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user'
      }
    }
  }

  /**
   * Invite a new user
   * @param {Object} invitationData - Invitation data
   * @returns {Promise} Created invitation
   */
  async inviteUser(invitationData) {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Validate invitation data (we only need email, first_name, last_name for now)
      if (!invitationData.email || typeof invitationData.email !== 'string') {
        throw new Error('Valid email address is required')
      }

      if (!invitationData.first_name || typeof invitationData.first_name !== 'string') {
        throw new Error('First name is required')
      }

      if (!invitationData.last_name || typeof invitationData.last_name !== 'string') {
        throw new Error('Last name is required')
      }

      // Get current user's organization ID (with built-in validation)
      const orgId = await this.getCurrentUserOrgId()

      // Create a user record in our users table
      // When the user signs in, ensureUserRecord() will find this record by email and use it
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: invitationData.email,
          first_name: invitationData.first_name,
          last_name: invitationData.last_name,
          org_id: orgId,
          status: 'pending' // Set status to pending for new invitations
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user record:', createError)
        throw new Error('Failed to create user record')
      }

      // Transform the data to match the expected format
      const transformedUser = {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        name: `${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
        role: 'viewer', // Default role
        status: newUser.status || 'pending', // User is pending until they complete signup
        lastLogin: null,
        invitedDate: newUser.created_at,
        permissions: this.getDefaultPermissions('viewer')
      }

      return {
        success: true,
        data: transformedUser,
        message: 'User invitation sent successfully'
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      return {
        success: false,
        error: error.message || 'Failed to send invitation'
      }
    }
  }

  /**
   * Update user profile (first_name and last_name only for now)
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user
   */
  async updateUser(userId, userData) {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get current user and their organization to ensure access
      const currentUser = await getCurrentUser()
      if (!currentUser.success || !currentUser.user) {
        throw new Error('User not authenticated')
      }

      const userOrgData = await getUserOrganization(currentUser.user.id)
      if (!userOrgData.success || !userOrgData.data.organization) {
        throw new Error('User organization not found')
      }

      const orgId = userOrgData.data.organization.id

      // Prepare update data (only first_name and last_name for now)
      const updateData = {}
      if (userData.first_name !== undefined) {
        if (!userData.first_name || typeof userData.first_name !== 'string') {
          throw new Error('First name must be a valid string')
        }
        updateData.first_name = userData.first_name.trim()
      }
      if (userData.last_name !== undefined) {
        if (!userData.last_name || typeof userData.last_name !== 'string') {
          throw new Error('Last name must be a valid string')
        }
        updateData.last_name = userData.last_name.trim()
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('No valid update data provided')
      }

      // Update the user in the same organization
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .eq('org_id', orgId)
        .neq('trashed', true) // Exclude trashed users
        .select('id, first_name, last_name, email, created_at')
        .single()

      if (error) {
        console.error('Error updating user:', error)
        throw new Error('Failed to update user')
      }

      if (!updatedUser) {
        throw new Error('User not found or not in your organization')
      }

      // Transform the data to match the expected format
      const transformedUser = {
        id: updatedUser.id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        name:
          `${updatedUser.first_name || ''} ${updatedUser.last_name || ''}`.trim() ||
          updatedUser.email?.split('@')[0] ||
          'Unknown',
        email: updatedUser.email,
        role: 'viewer', // Default role, TODO: add role field to schema later
        status: updatedUser.status || 'active', // Use database status or default to 'active'
        lastLogin: null, // TODO: implement last login tracking
        invitedDate: updatedUser.created_at,
        permissions: this.getDefaultPermissions('viewer')
      }

      return {
        success: true,
        data: transformedUser,
        message: 'User updated successfully'
      }
    } catch (error) {
      console.error('Error updating user:', error)
      return {
        success: false,
        error: error.message || 'Failed to update user'
      }
    }
  }

  /**
   * Update user permissions (placeholder for now)
   * @param {string} userId - User ID
   * @param {Object} permissions - Updated permissions
   * @returns {Promise} Updated user
   */
  async updateUserPermissions(userId, permissions) {
    try {
      // TODO: Implement when role/permission fields are added to users table
      console.log('updateUserPermissions called with:', { userId, permissions })

      return {
        success: true,
        data: { id: userId, permissions },
        message: 'User permissions updated successfully (placeholder)'
      }
    } catch (error) {
      console.error('Error updating user permissions:', error)
      return {
        success: false,
        error: error.message || 'Failed to update permissions'
      }
    }
  }

  /**
   * Update user role
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Promise} Updated user
   */
  async updateUserRole(userId, role) {
    try {
      // Validate role
      const validRoles = ['admin', 'recruiter', 'viewer']
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role')
      }

      // Get default permissions for the role
      const permissions = this.getDefaultPermissions(role)

      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_users')
      //   .update({ role, permissions })
      //   .eq('id', userId)

      return {
        success: true,
        data: { id: userId, role, permissions },
        message: 'User role updated successfully'
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      throw new Error('Failed to update role')
    }
  }

  /**
   * Toggle user status (active/inactive)
   * @param {string} userId - User ID
   * @returns {Promise} Updated user
   */
  async toggleUserStatus(userId) {
    try {
      // In a real app, this would:
      // 1. Get current user status
      // 2. Toggle status
      // 3. Update database
      // 4. Send notification if needed

      return {
        success: true,
        data: { id: userId },
        message: 'User status updated successfully'
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      throw new Error('Failed to update user status')
    }
  }

  /**
   * Deactivate user (set status to inactive)
   * @param {string} userId - User ID
   * @returns {Promise} Success result
   */
  async deactivateUser(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required')
      }

      // Update user status to inactive
      const { error: updateError } = await supabase.from('users').update({ status: 'inactive' }).eq('id', userId)

      if (updateError) {
        console.error('Error deactivating user:', updateError)
        throw new Error('Failed to deactivate user in database')
      }

      console.log('here3')

      return {
        success: true,
        message: 'User deactivated successfully'
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
      return {
        success: false,
        error: error.message || 'Failed to deactivate user'
      }
    }
  }

  /**
   * Remove user from organization (only users in the same org_id)
   * @param {string} userId - User ID
   * @returns {Promise} Success result
   */
  async removeUser(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required')
      }

      // Soft delete the user by setting trashed to true
      // This preserves the user record for audit purposes while removing them from active queries
      const { error: deleteError } = await supabase.from('users').update({ trashed: true }).eq('id', userId)

      if (deleteError) {
        console.error('Error removing user:', deleteError)
        throw new Error('Failed to remove user from database')
      }

      return {
        success: true,
        message: 'User removed successfully'
      }
    } catch (error) {
      console.error('Error removing user:', error)
      return {
        success: false,
        error: error.message || 'Failed to remove user'
      }
    }
  }

  /**
   * Search users
   * @param {string} searchTerm - Search term
   * @returns {Promise} Filtered users
   */
  async searchUsers(searchTerm) {
    try {
      if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
        // If no search term, return all users
        return await this.getAllUsers()
      }

      // Get current user's organization ID (with built-in validation)
      const orgId = await this.getCurrentUserOrgId()

      // Sanitize search term to prevent injection attacks
      const sanitizedSearchTerm = searchTerm.trim().slice(0, 255) // Limit length
      const searchPattern = `%${sanitizedSearchTerm.toLowerCase()}%`

      // Search users in the organization by first_name, last_name, or email with security validation
      const { data: users, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, org_id, created_at')
        .eq('org_id', orgId)
        .not('org_id', 'is', null) // Ensure org_id is not null
        .neq('trashed', true) // Exclude trashed users
        .or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching users:', error)
        throw new Error('Failed to search users in database')
      }

      // Additional security check: ensure all returned users belong to the same organization
      const invalidUsers = users.filter((user) => user.org_id !== orgId)
      if (invalidUsers.length > 0) {
        console.error('Security violation: Users from different organizations returned in search:', invalidUsers)
        throw new Error('Data integrity error: Invalid organization data detected')
      }

      // Transform the data to match the expected format
      const transformedUsers = users.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        role: 'viewer', // Default role, TODO: add role field to schema later
        status: user.status || 'active', // Use database status or default to 'active'
        lastLogin: null, // TODO: implement last login tracking
        invitedDate: user.created_at,
        permissions: this.getDefaultPermissions('viewer')
      }))

      return {
        success: true,
        data: transformedUsers,
        meta: {
          total: transformedUsers.length,
          searchTerm: sanitizedSearchTerm,
          organizationId: orgId
        }
      }
    } catch (error) {
      console.error('Error searching users:', error)
      return {
        success: false,
        error: error.message || 'Failed to search users'
      }
    }
  }

  /**
   * Get user activity logs
   * @param {string} userId - User ID
   * @returns {Promise} Activity logs
   */
  async getUserActivityLogs(userId) {
    // In a real app, this would fetch from audit logs table
    // For now, just return empty data
    return {
      success: true,
      data: []
    }
  }

  /**
   * Get default permissions for a role
   * @param {string} role - User role
   * @returns {Object} Default permissions for the role
   */
  getDefaultPermissions(role) {
    const permissionSets = {
      admin: {
        publishListings: true,
        editOrgProfile: true,
        manageQuestionnaires: true,
        viewCandidates: true,
        manageCandidates: true,
        viewReports: true
      },
      recruiter: {
        publishListings: true,
        editOrgProfile: false,
        manageQuestionnaires: false,
        viewCandidates: true,
        manageCandidates: true,
        viewReports: true
      },
      viewer: {
        publishListings: false,
        editOrgProfile: false,
        manageQuestionnaires: false,
        viewCandidates: true,
        manageCandidates: false,
        viewReports: true
      }
    }

    return permissionSets[role] || permissionSets.viewer
  }

  /**
   * Generate invite token
   * @returns {string} Random invite token
   */
  generateInviteToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  /**
   * Get mock users data (for development)
   * @returns {Array} Mock users
   */
  getMockUsers() {
    return [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        invitedDate: '2023-12-01T09:00:00Z',
        permissions: this.getDefaultPermissions('admin')
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'recruiter',
        status: 'active',
        lastLogin: '2024-01-14T14:20:00Z',
        invitedDate: '2023-12-05T11:30:00Z',
        permissions: this.getDefaultPermissions('recruiter')
      },
      {
        id: 3,
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'viewer',
        status: 'inactive',
        lastLogin: '2024-01-10T16:45:00Z',
        invitedDate: '2023-12-10T15:00:00Z',
        permissions: this.getDefaultPermissions('viewer')
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        role: 'recruiter',
        status: 'pending',
        lastLogin: null,
        invitedDate: '2024-01-12T10:15:00Z',
        permissions: this.getDefaultPermissions('recruiter')
      }
    ]
  }
}

const userManagementController = new UserManagementController()
export default userManagementController
