// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { createContext, useContext, useState, useCallback } from 'react'

/**
 * Authentication context for email-based login
 * Replaces DeSo authentication with simple email auth simulation
 */
const AuthContext = createContext()

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Authentication provider component
 * Manages user authentication state for email login
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Simulate email login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For simulation, create a mock user
      const mockUser = {
        id: '1',
        email: email || 'user@example.com',
        name: 'Demo User',
        avatar: null,
        ProfileEntryResponse: {
          Username: 'DemoUser',
          PublicKeyBase58Check: 'demo-key',
          ProfilePic: null
        }
      }
      
      setCurrentUser(mockUser)
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // Check if user is authenticated
  const isAuthenticated = Boolean(currentUser)

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 