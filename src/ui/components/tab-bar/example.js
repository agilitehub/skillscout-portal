import React, { useState } from 'react'
import TabBar from './index'

/**
 * An example component demonstrating the use of TabBar within forms
 * This is for documentation purposes only
 */
const TabBarExample = () => {
  const [activeTab, setActiveTab] = useState('personal')

  // Example tab items with content for a user profile form
  const tabItems = [
    {
      key: 'personal',
      title: 'Personal Info',
      closeable: false,
      content: (
        <div className='p-4'>
          <h3 className='text-lg font-medium mb-4'>Personal Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>First Name</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Last Name</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Email</label>
              <input type='email' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Phone</label>
              <input type='tel' className='w-full p-2 border rounded' />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      title: 'Address',
      closeable: false,
      content: (
        <div className='p-4'>
          <h3 className='text-lg font-medium mb-4'>Address Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='mb-4 col-span-2'>
              <label className='block text-sm font-medium mb-1'>Street Address</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>City</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>State/Province</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Postal Code</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Country</label>
              <input type='text' className='w-full p-2 border rounded' />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'preferences',
      title: 'Preferences',
      closeable: false,
      content: (
        <div className='p-4'>
          <h3 className='text-lg font-medium mb-4'>User Preferences</h3>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <input type='checkbox' id='emailNotifications' className='mr-2' />
              <label htmlFor='emailNotifications'>Enable email notifications</label>
            </div>
            <div className='flex items-center'>
              <input type='checkbox' id='darkMode' className='mr-2' />
              <label htmlFor='darkMode'>Use dark mode</label>
            </div>
            <div className='mt-4'>
              <label className='block text-sm font-medium mb-1'>Language</label>
              <select className='w-full p-2 border rounded'>
                <option value='en'>English</option>
                <option value='fr'>French</option>
                <option value='es'>Spanish</option>
                <option value='de'>German</option>
              </select>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>User Profile</h2>

      <div className='form-tabs'>
        <TabBar items={tabItems} activeKey={activeTab} onChange={setActiveTab} renderTabContent={true} />
      </div>

      <div className='mt-4 flex justify-end'>
        <button className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark'>Save Profile</button>
      </div>
    </div>
  )
}

export default TabBarExample
