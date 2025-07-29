// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Branch Management Controller
 * Handles branch management operations and business logic
 */

import { validateBranch, validateBranchAddress, transformToDatabase, transformFromDatabase } from './data-model'

class BranchManagementController {
  constructor() {
    this.apiEndpoint = '/api/branch-management'
  }

  /**
   * Get all organization branches
   * @returns {Promise} Branches data
   */
  async getAllBranches() {
    try {
      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_branches').select('*')
      
      // For now, return mock data
      return {
        success: true,
        data: this.getMockBranches()
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
      throw new Error('Failed to fetch branches')
    }
  }

  /**
   * Get branch by ID
   * @param {string} branchId - Branch ID
   * @returns {Promise} Branch data
   */
  async getBranchById(branchId) {
    try {
      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_branches').select('*').eq('id', branchId).single()
      
      const branches = this.getMockBranches()
      const branch = branches.find(b => b.id === branchId)
      
      if (!branch) {
        throw new Error('Branch not found')
      }

      return {
        success: true,
        data: branch
      }
    } catch (error) {
      console.error('Error fetching branch:', error)
      throw new Error('Failed to fetch branch')
    }
  }

  /**
   * Create a new branch
   * @param {Object} branchData - Branch data
   * @returns {Promise} Created branch
   */
  async createBranch(branchData) {
    try {
      // Validate branch data
      const validationResult = validateBranch(branchData)
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '))
      }

      // Check for duplicate branch codes
      const existingBranches = this.getMockBranches()
      const duplicateCode = existingBranches.find(b => 
        b.code.toLowerCase() === branchData.code.toLowerCase()
      )
      if (duplicateCode) {
        throw new Error('Branch code already exists')
      }

      // In a real app, this would:
      // 1. Create branch record in database
      // 2. Set up branch-specific configurations
      // 3. Send notifications to relevant users
      
      const branch = {
        id: Date.now(),
        ...branchData,
        employeeCount: 0,
        established: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return {
        success: true,
        data: branch,
        message: 'Branch created successfully'
      }
    } catch (error) {
      console.error('Error creating branch:', error)
      throw new Error('Failed to create branch')
    }
  }

  /**
   * Update branch information
   * @param {string} branchId - Branch ID
   * @param {Object} branchData - Updated branch data
   * @returns {Promise} Updated branch
   */
  async updateBranch(branchId, branchData) {
    try {
      // Validate branch data
      const validationResult = validateBranch(branchData)
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '))
      }

      // Check for duplicate branch codes (excluding current branch)
      const existingBranches = this.getMockBranches()
      const duplicateCode = existingBranches.find(b => 
        b.id !== branchId && b.code.toLowerCase() === branchData.code.toLowerCase()
      )
      if (duplicateCode) {
        throw new Error('Branch code already exists')
      }

      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_branches')
      //   .update({ ...branchData, updated_at: new Date().toISOString() })
      //   .eq('id', branchId)

      return {
        success: true,
        data: { id: branchId, ...branchData, updatedAt: new Date().toISOString() },
        message: 'Branch updated successfully'
      }
    } catch (error) {
      console.error('Error updating branch:', error)
      throw new Error('Failed to update branch')
    }
  }

  /**
   * Delete branch
   * @param {string} branchId - Branch ID
   * @returns {Promise} Success result
   */
  async deleteBranch(branchId) {
    try {
      const branch = await this.getBranchById(branchId)
      
      // Prevent deletion of headquarters
      if (branch.data.isHeadquarters) {
        throw new Error('Cannot delete headquarters branch')
      }

      // In a real app, this would:
      // 1. Check for associated data (users, job listings, etc.)
      // 2. Handle data migration or prevent deletion
      // 3. Soft delete branch
      // 4. Update audit logs

      return {
        success: true,
        message: 'Branch deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting branch:', error)
      throw new Error('Failed to delete branch')
    }
  }

  /**
   * Toggle branch status (active/inactive)
   * @param {string} branchId - Branch ID
   * @returns {Promise} Updated branch
   */
  async toggleBranchStatus(branchId) {
    try {
      const branch = await this.getBranchById(branchId)
      
      // Prevent deactivation of headquarters
      if (branch.data.isHeadquarters && branch.data.status === 'active') {
        throw new Error('Cannot deactivate headquarters branch')
      }

      const newStatus = branch.data.status === 'active' ? 'inactive' : 'active'

      // In a real app, this would make an API call
      // const response = await supabaseController.from('organization_branches')
      //   .update({ status: newStatus, updated_at: new Date().toISOString() })
      //   .eq('id', branchId)

      return {
        success: true,
        data: { id: branchId, status: newStatus },
        message: `Branch ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      }
    } catch (error) {
      console.error('Error updating branch status:', error)
      throw new Error('Failed to update branch status')
    }
  }

  /**
   * Search branches
   * @param {string} searchTerm - Search term
   * @returns {Promise} Filtered branches
   */
  async searchBranches(searchTerm) {
    try {
      const branches = this.getMockBranches()
      const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
      )

      return {
        success: true,
        data: filteredBranches
      }
    } catch (error) {
      console.error('Error searching branches:', error)
      throw new Error('Failed to search branches')
    }
  }

  /**
   * Get branches by status
   * @param {string} status - Branch status ('active' or 'inactive')
   * @returns {Promise} Filtered branches
   */
  async getBranchesByStatus(status) {
    try {
      const branches = this.getMockBranches()
      const filteredBranches = branches.filter(branch => branch.status === status)

      return {
        success: true,
        data: filteredBranches
      }
    } catch (error) {
      console.error('Error fetching branches by status:', error)
      throw new Error('Failed to fetch branches by status')
    }
  }

  /**
   * Get headquarters branch
   * @returns {Promise} Headquarters branch
   */
  async getHeadquarters() {
    try {
      const branches = this.getMockBranches()
      const headquarters = branches.find(branch => branch.isHeadquarters)

      if (!headquarters) {
        throw new Error('No headquarters branch found')
      }

      return {
        success: true,
        data: headquarters
      }
    } catch (error) {
      console.error('Error fetching headquarters:', error)
      throw new Error('Failed to fetch headquarters')
    }
  }

  /**
   * Get branch statistics
   * @returns {Promise} Branch statistics
   */
  async getBranchStatistics() {
    try {
      const branches = this.getMockBranches()
      
      const stats = {
        totalBranches: branches.length,
        activeBranches: branches.filter(b => b.status === 'active').length,
        inactiveBranches: branches.filter(b => b.status === 'inactive').length,
        totalEmployees: branches.reduce((sum, b) => sum + b.employeeCount, 0),
        departmentCoverage: [...new Set(branches.flatMap(b => b.departments))].length,
        countriesPresent: [...new Set(branches.map(b => b.address.country))].length
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching branch statistics:', error)
      throw new Error('Failed to fetch branch statistics')
    }
  }

  /**
   * Assign users to branch (Future feature)
   * @param {string} branchId - Branch ID
   * @param {Array} userIds - Array of user IDs
   * @returns {Promise} Assignment result
   */
  async assignUsersToBranch(branchId, userIds) {
    try {
      // Future implementation
      return {
        success: true,
        message: 'Users assigned to branch successfully'
      }
    } catch (error) {
      console.error('Error assigning users to branch:', error)
      throw new Error('Failed to assign users to branch')
    }
  }

  /**
   * Assign job listings to branch (Future feature)
   * @param {string} branchId - Branch ID
   * @param {Array} jobListingIds - Array of job listing IDs
   * @returns {Promise} Assignment result
   */
  async assignJobListingsToBranch(branchId, jobListingIds) {
    try {
      // Future implementation
      return {
        success: true,
        message: 'Job listings assigned to branch successfully'
      }
    } catch (error) {
      console.error('Error assigning job listings to branch:', error)
      throw new Error('Failed to assign job listings to branch')
    }
  }

  /**
   * Get mock branches data (for development)
   * @returns {Array} Mock branches
   */
  getMockBranches() {
    return [
      {
        id: 1,
        name: 'Headquarters',
        code: 'HQ',
        address: {
          street: '123 Corporate Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        phone: '+1 (555) 123-4567',
        email: 'hq@company.com',
        manager: 'John Smith',
        status: 'active',
        employeeCount: 150,
        timezone: 'America/New_York',
        established: '2020-01-15',
        description: 'Main headquarters and primary operations center',
        departments: ['Executive', 'HR', 'Finance', 'IT', 'Marketing'],
        isHeadquarters: true
      },
      {
        id: 2,
        name: 'West Coast Office',
        code: 'WC',
        address: {
          street: '456 Innovation Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'United States'
        },
        phone: '+1 (555) 987-6543',
        email: 'westcoast@company.com',
        manager: 'Sarah Johnson',
        status: 'active',
        employeeCount: 85,
        timezone: 'America/Los_Angeles',
        established: '2021-03-10',
        description: 'Technology development and innovation hub',
        departments: ['Engineering', 'Product', 'Design'],
        isHeadquarters: false
      },
      {
        id: 3,
        name: 'European Office',
        code: 'EU',
        address: {
          street: '789 Business Park',
          city: 'London',
          state: 'England',
          zipCode: 'SW1A 1AA',
          country: 'United Kingdom'
        },
        phone: '+44 20 7123 4567',
        email: 'europe@company.com',
        manager: 'Mike Chen',
        status: 'active',
        employeeCount: 42,
        timezone: 'Europe/London',
        established: '2022-06-01',
        description: 'European operations and customer service center',
        departments: ['Sales', 'Customer Support', 'Marketing'],
        isHeadquarters: false
      },
      {
        id: 4,
        name: 'Austin Branch',
        code: 'TX',
        address: {
          street: '321 Tech Square',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'United States'
        },
        phone: '+1 (555) 456-7890',
        email: 'austin@company.com',
        manager: 'Emily Davis',
        status: 'inactive',
        employeeCount: 25,
        timezone: 'America/Chicago',
        established: '2023-01-15',
        description: 'Emerging markets development office',
        departments: ['Business Development', 'Research'],
        isHeadquarters: false
      }
    ]
  }
}

export default new BranchManagementController() 