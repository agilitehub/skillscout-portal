import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTabs } from '../../../ui/TabContext'
import Logo from '../../../ui/components/Logo'
import {
  faCalendarDays,
  faChartSimple,
  faClipboardList,
  faClock,
  faUsers,
  faFolder,
  faTachometer,
  faMoneyBillWave,
  faFileInvoiceDollar,
  faCreditCard,
  faBuilding,
  faHandshake,
  faFileContract,
  faFileSignature,
  faHandHoldingUsd,
  faShoppingCart,
  faAddressBook,
  faAddressCard,
  faLaptop,
  faFileInvoice,
  faUserTie,
  faClipboardUser,
  faReceipt,
  faCalendarCheck,
  faHandshakeAngle,
  faHeadset,
  faNetworkWired,
  faDesktop,
  faCode
} from '@fortawesome/free-solid-svg-icons'

/**
 * Sidebar navigation component
 */
const Sidebar = () => {
  const { switchToTab } = useTabs()

  // Custom NavLink component that uses our tab system
  const TabNavLink = ({ to, icon, children, className }) => {
    return (
      <NavLink
        to={to}
        onClick={() => switchToTab(to)}
        className={({ isActive }) =>
          `flex items-center py-2.5 px-4 rounded ${
            isActive
              ? 'bg-agilite-grey-light dark:bg-agilite-slate text-secondary-dark dark:text-white'
              : 'hover:bg-agilite-grey-light dark:hover:bg-agilite-slate hover:text-secondary-dark dark:hover:text-agilite-grey-light'
          } ${className || ''}`
        }
      >
        <FontAwesomeIcon icon={icon} className='w-5 h-5 mr-3 opacity-80' />
        <span className='text-sm tracking-wide'>{children}</span>
      </NavLink>
    )
  }

  return (
    <div className='bg-white dark:bg-agilite-black text-secondary dark:text-agilite-grey w-64 flex-shrink-0 h-screen fixed left-0 top-0 overflow-y-auto shadow-md dark:shadow-none'>
      {/* Sidebar Header/Logo Section */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-agilite-black z-10'>
        <Link to='/dashboard' className='flex items-center'>
          <Logo className='h-10 w-auto mr-2' alt='Agilite Logo' />
          <h1 className='text-xl font-bold text-secondary-dark dark:text-white tracking-tight'>Agilite</h1>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className='py-6'>
        {/* Dashboard - Top Level */}
        <div className='px-4 py-2'>
          <TabNavLink to='/dashboard' icon={faTachometer}>
            DASHBOARD
          </TabNavLink>
        </div>

        {/* ERM Section (formerly Accounts) */}
        <div className='mt-8'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            ERM
          </div>
          <div className='px-4'>
            <TabNavLink to='/accounts' icon={faAddressBook}>
              ACCOUNTS
            </TabNavLink>

            <TabNavLink to='/customers' icon={faHandshake} className='mt-1'>
              CUSTOMERS
            </TabNavLink>

            <TabNavLink to='/suppliers' icon={faBuilding} className='mt-1'>
              SUPPLIERS
            </TabNavLink>

            <TabNavLink to='/contacts' icon={faAddressCard} className='mt-1'>
              CONTACTS
            </TabNavLink>

            <TabNavLink to='/quotes' icon={faFileContract} className='mt-1'>
              PROPOSALS
            </TabNavLink>

            <TabNavLink to='/sla' icon={faHandshakeAngle} className='mt-1'>
              SLAS
            </TabNavLink>

            <TabNavLink to='/purchase-orders' icon={faShoppingCart} className='mt-1'>
              PURCHASE REQUISITIONS
            </TabNavLink>
          </div>
        </div>

        {/* Finance Section */}
        <div className='mt-8'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            FINANCE
          </div>
          <div className='px-4'>
            <TabNavLink to='/invoices' icon={faFileInvoiceDollar}>
              INVOICES
            </TabNavLink>

            <TabNavLink to='/bills' icon={faFileInvoice} className='mt-1'>
              BILLS
            </TabNavLink>

            <TabNavLink to='/expenses' icon={faMoneyBillWave} className='mt-1'>
              EXPENSES
            </TabNavLink>

            <TabNavLink to='/payments' icon={faCreditCard} className='mt-1'>
              PAYMENTS
            </TabNavLink>
          </div>
        </div>

        {/* HR Section (formerly Assets) */}
        <div className='mt-8'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            HR
          </div>
          <div className='px-4'>
            <TabNavLink to='/assets' icon={faLaptop}>
              ASSET REGISTER
            </TabNavLink>

            <TabNavLink to='/employee-info' icon={faUserTie} className='mt-1'>
              EMPLOYEE INFORMATION
            </TabNavLink>

            <TabNavLink to='/leave' icon={faCalendarCheck} className='mt-1'>
              LEAVE MANAGEMENT
            </TabNavLink>

            <TabNavLink to='/claims' icon={faReceipt} className='mt-1'>
              CLAIMS
            </TabNavLink>
          </div>
        </div>

        {/* IT Support Section */}
        <div className='mt-8'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            IT SUPPORT
          </div>
          <div className='px-4'>
            <TabNavLink to='/helpdesk' icon={faHeadset}>
              HELP DESK
            </TabNavLink>

            <TabNavLink to='/helpdesk?category=network' icon={faNetworkWired} className='mt-1'>
              NETWORK
            </TabNavLink>

            <TabNavLink to='/helpdesk?category=desktop' icon={faDesktop} className='mt-1'>
              DESKTOP
            </TabNavLink>

            <TabNavLink to='/helpdesk?category=application' icon={faCode} className='mt-1'>
              APPLICATIONS
            </TabNavLink>
          </div>
        </div>

        {/* Time Tracking Section */}
        <div className='mt-8'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            TIME TRACKING
          </div>
          <div className='px-4'>
            <TabNavLink to='/timesheet' icon={faCalendarDays}>
              TIMESHEET
            </TabNavLink>

            <TabNavLink to='/time-tracker' icon={faClock} className='mt-1'>
              TIME TRACKER
            </TabNavLink>
          </div>
        </div>

        {/* Projects Section */}
        <div className='mt-8'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            PROJECTS
          </div>
          <div className='px-4'>
            <TabNavLink to='/projects' icon={faFolder}>
              PROJECTS
            </TabNavLink>

            <TabNavLink to='/team' icon={faUsers} className='mt-1'>
              TEAM
            </TabNavLink>

            <TabNavLink to='/tasks' icon={faClipboardList} className='mt-1'>
              TASKS
            </TabNavLink>
          </div>
        </div>

        {/* Reports */}
        <div className='mt-8 mb-12'>
          <div className='px-6 py-2 text-sm text-primary dark:text-primary-light uppercase font-semibold tracking-wider'>
            REPORTS
          </div>
          <div className='px-4'>
            <TabNavLink to='/reports' icon={faChartSimple}>
              REPORTS
            </TabNavLink>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
