import React from 'react'
import { ThemeProvider } from './ui/ThemeContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { DeSoIdentityProvider } from 'react-deso-protocol'
import { GlobalStyles } from './ui/styles'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes'

/**
 * Main App component
 */
const App = () => {

  return (
    <DeSoIdentityProvider>
    <ThemeProvider>
        <GlobalStyles />
        <Router>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    </ThemeProvider>
    </DeSoIdentityProvider>
  )
}

export default App
