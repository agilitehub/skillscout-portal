// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Create the tab context
const TabContext = createContext()

// Tab info mappings
const tabInfoMap = {
  '/dashboard': { title: 'Dashboard', closeable: false },
  '/timesheet': { title: 'Timesheet', closeable: true },
  '/time-tracker': { title: 'Time Tracker', closeable: true },
  '/calendar': { title: 'Calendar', closeable: true },
  '/reports': { title: 'Reports', closeable: true },
  '/projects': { title: 'Projects', closeable: true },
  '/team': { title: 'Team', closeable: true },
  '/invoices': { title: 'Invoices', closeable: true },
  '/bills': { title: 'Bills', closeable: true },
  '/bills/add': { title: 'Record Bill', closeable: true },
  '/expenses': { title: 'Expenses', closeable: true },
  '/expenses/add': { title: 'Add Expense', closeable: true },
  '/payments': { title: 'Payments', closeable: true },
  '/payments/record': { title: 'Record Payment', closeable: true },
  '/purchase-orders': { title: 'Purchase Orders', closeable: true },
  '/accounts': { title: 'Accounts', closeable: true },
  '/accounts/add': { title: 'Add Account', closeable: true },
  '/contacts': { title: 'Contacts', closeable: true },
  '/contacts/add': { title: 'Add Contact', closeable: true },
  '/customers': { title: 'Customers', closeable: true },
  '/customers/add': { title: 'Add Customer', closeable: true },
  '/suppliers': { title: 'Suppliers', closeable: true },
  '/suppliers/add': { title: 'Add Supplier', closeable: true },
  '/assets': { title: 'Asset Register', closeable: true },
  '/assets/add': { title: 'Add Asset', closeable: true },
  '/employee-info': { title: 'Employee Information', closeable: true },
  '/employee-info/add': { title: 'Add Employee', closeable: true },
  '/leave': { title: 'Leave Management', closeable: true },
  '/leave/request': { title: 'Request Leave', closeable: true },
  '/claims': { title: 'Claims', closeable: true },
  '/claims/add': { title: 'Submit Claim', closeable: true },
  '/quotes': { title: 'Quotes', closeable: true },
  '/estimates': { title: 'Estimates', closeable: true },
  '/opportunities': { title: 'Opportunities', closeable: true },
  '/sla': { title: 'Service Level Agreements', closeable: true },
  '/sla/add': { title: 'Add SLA', closeable: true },
  '/helpdesk': { title: 'Help Desk', closeable: true },
  '/helpdesk/new-ticket': { title: 'New Support Ticket', closeable: true }
}

// Pattern matching helper for dynamic routes
const getDynamicTabInfo = (path) => {
  // Account detail view - /accounts/ACC-123
  if (/^\/accounts\/[^\/]+$/.test(path)) {
    const id = path.split('/').pop()
    return { title: `Account: ${id}`, closeable: true }
  }

  // Account edit view - /accounts/ACC-123/edit
  if (/^\/accounts\/[^\/]+\/edit$/.test(path)) {
    const id = path.split('/')[2]
    return { title: `Edit: ${id}`, closeable: true }
  }

  // Customer detail view - /customers/CUST-123
  if (/^\/customers\/[^\/]+$/.test(path)) {
    const id = path.split('/').pop()
    return { title: `Customer: ${id}`, closeable: true }
  }

  // Customer edit view - /customers/CUST-123/edit
  if (/^\/customers\/[^\/]+\/edit$/.test(path)) {
    const id = path.split('/')[2]
    return { title: `Edit: ${id}`, closeable: true }
  }

  // Supplier detail view - /suppliers/SUP-123
  if (/^\/suppliers\/[^\/]+$/.test(path)) {
    const id = path.split('/').pop()
    return { title: `Supplier: ${id}`, closeable: true }
  }

  // Supplier edit view - /suppliers/SUP-123/edit
  if (/^\/suppliers\/[^\/]+\/edit$/.test(path)) {
    const id = path.split('/')[2]
    return { title: `Edit: ${id}`, closeable: true }
  }

  // Helpdesk ticket detail view - /helpdesk/ticket/TKT-123
  if (/^\/helpdesk\/ticket\/[^\/]+$/.test(path)) {
    const id = path.split('/').pop()
    return { title: `Ticket: ${id}`, closeable: true }
  }

  return null
}

export const TabProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Always include dashboard as the first tab
  const [openTabs, setOpenTabs] = useState([{ path: '/dashboard', ...tabInfoMap['/dashboard'] }])

  const [activeTab, setActiveTab] = useState('/dashboard')

  // When location changes, update tabs
  useEffect(() => {
    const currentPath = location.pathname

    // First check for exact path match
    if (tabInfoMap[currentPath]) {
      // If this path is not already in our tabs, add it
      if (!openTabs.some((tab) => tab.path === currentPath)) {
        setOpenTabs((prev) => [
          ...prev,
          {
            path: currentPath,
            ...tabInfoMap[currentPath]
          }
        ])
      }

      // Set this as the active tab
      setActiveTab(currentPath)
    }
    // Check for dynamic routes
    else {
      const dynamicTabInfo = getDynamicTabInfo(currentPath)
      if (dynamicTabInfo) {
        // If this path is not already in our tabs, add it
        if (!openTabs.some((tab) => tab.path === currentPath)) {
          setOpenTabs((prev) => [
            ...prev,
            {
              path: currentPath,
              ...dynamicTabInfo
            }
          ])
        }

        // Set this as the active tab
        setActiveTab(currentPath)
      }
    }
  }, [location.pathname, openTabs])

  // Switch to a tab
  const switchToTab = (path) => {
    navigate(path)
  }

  // Close a tab
  const closeTab = (path, event) => {
    // Prevent the click from propagating to the parent
    if (event) {
      event.stopPropagation()
    }

    // Can't close the dashboard tab
    if (path === '/dashboard') return

    // Remove the tab
    const newTabs = openTabs.filter((tab) => tab.path !== path)
    setOpenTabs(newTabs)

    // If we're closing the active tab, switch to another tab
    if (path === activeTab) {
      // Find the index of the tab being closed
      const tabIndex = openTabs.findIndex((tab) => tab.path === path)

      // If it's the last tab, go to the tab before it, otherwise go to the next tab
      const newActiveTab = tabIndex === openTabs.length - 1 ? openTabs[tabIndex - 1].path : openTabs[tabIndex + 1].path

      navigate(newActiveTab)
    }
  }

  // Close all tabs except Dashboard
  const closeAllTabs = (event) => {
    // Prevent the click from propagating to the parent
    if (event) {
      event.stopPropagation()
    }

    // Keep only the dashboard tab
    const dashboardTab = openTabs.find((tab) => tab.path === '/dashboard')
    if (dashboardTab) {
      setOpenTabs([dashboardTab])

      // Navigate to dashboard
      if (activeTab !== '/dashboard') {
        navigate('/dashboard')
      }
    }
  }

  return (
    <TabContext.Provider
      value={{
        openTabs,
        activeTab,
        switchToTab,
        closeTab,
        closeAllTabs
      }}
    >
      {children}
    </TabContext.Provider>
  )
}

// Custom hook to use the tab context
export const useTabs = () => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider')
  }
  return context
}
