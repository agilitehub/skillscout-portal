// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * User Management Controller
 * Handles user management operations and business logic
 */

import { validateUser, validateInvitation, validatePermissions } from './data-model'

class UserManagementController {
  constructor() {
    this.apiEndpoint = '/api/user-management'
  }

  /**
   * Get all organization users
   * @returns {Promise} Users data
   */
  async getAllUsers() {
    try {
      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_users').select('*')
      
      // For now, return mock data
      return {
        success: true,
        data: this.getMockUsers()
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    try {
      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_users').select('*').eq('id', userId).single()
      
      const users = this.getMockUsers()
      const user = users.find(u => u.id === userId)
      
      if (!user) {
        throw new Error('User not found')
      }

      return {
        success: true,
        data: user
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
    }
  }

  /**
   * Invite a new user
   * @param {Object} invitationData - Invitation data
   * @returns {Promise} Created invitation
   */
  async inviteUser(invitationData) {
    try {
      // Validate invitation data
      const validationResult = validateInvitation(invitationData)
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '))
      }

      // In a real app, this would:
      // 1. Create invitation record in database
      // 2. Send email invitation
      // 3. Generate invitation token
      
      const invitation = {
        id: Date.now(),
        ...invitationData,
        status: 'pending',
        invitedDate: new Date().toISOString(),
        invitedBy: 'current_user_id', // Would come from auth context
        inviteToken: this.generateInviteToken(),
        permissions: this.getDefaultPermissions(invitationData.role)
      }

      return {
        success: true,
        data: invitation,
        message: 'User invitation sent successfully'
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      throw new Error('Failed to send invitation')
    }
  }

  /**
   * Update user permissions
   * @param {string} userId - User ID
   * @param {Object} permissions - Updated permissions
   * @returns {Promise} Updated user
   */
  async updateUserPermissions(userId, permissions) {
    try {
      // Validate permissions
      const validationResult = validatePermissions(permissions)
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '))
      }

      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_users')
      //   .update({ permissions })
      //   .eq('id', userId)

      return {
        success: true,
        data: { id: userId, permissions },
        message: 'User permissions updated successfully'
      }
    } catch (error) {
      console.error('Error updating user permissions:', error)
      throw new Error('Failed to update permissions')
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
   * Remove user from organization
   * @param {string} userId - User ID
   * @returns {Promise} Success result
   */
  async removeUser(userId) {
    try {
      // In a real app, this would:
      // 1. Soft delete or archive user
      // 2. Revoke access tokens
      // 3. Send notification
      // 4. Update audit logs

      return {
        success: true,
        message: 'User removed successfully'
      }
    } catch (error) {
      console.error('Error removing user:', error)
      throw new Error('Failed to remove user')
    }
  }

  /**
   * Search users
   * @param {string} searchTerm - Search term
   * @returns {Promise} Filtered users
   */
  async searchUsers(searchTerm) {
    try {
      const users = this.getMockUsers()
      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )

      return {
        success: true,
        data: filteredUsers
      }
    } catch (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search users')
    }
  }

  /**
   * Get user activity logs
   * @param {string} userId - User ID
   * @returns {Promise} Activity logs
   */
  async getUserActivityLogs(userId) {
    try {
      // In a real app, this would fetch from audit logs table
      return {
        success: true,
        data: []
      }
    } catch (error) {
      console.error('Error fetching user activity:', error)
      throw new Error('Failed to fetch user activity')
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
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
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

export default new UserManagementController() 