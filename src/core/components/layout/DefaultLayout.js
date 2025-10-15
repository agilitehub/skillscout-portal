import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export const DefaultLayout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container-padded py-8'>
        {children}
        <Outlet />
      </main>
    </div>
  )
}
