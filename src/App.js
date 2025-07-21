import React from 'react'
import { ThemeProvider } from './core/context/ThemeContext'
import { AuthProvider } from './core/context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import GlobalStyles from './core/theme/GlobalStyles'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes'

/**
 * Main App component
 */
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyles />
        <Router>
          <AppRoutes />
          <ToastContainer position='top-right' autoClose={3000} />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
