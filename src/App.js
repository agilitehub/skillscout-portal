import React from 'react'
import { Provider } from 'react-redux'
import GlobalStyles from './core/theme/GlobalStyles'
import AppRoutes from './routes'
import { ThemeProvider } from './core/context/ThemeContext'
import { AuthProvider } from './core/context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { store } from './core/store'
import 'react-toastify/dist/ReactToastify.css'

import 'antd/dist/reset.css'
import './styles/styles.css'

/**
 * Main App component
 */
const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <GlobalStyles />
          <Router>
            <AppRoutes />
            <ToastContainer position='top-right' autoClose={3000} />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
