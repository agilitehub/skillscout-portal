import React, { useState } from 'react'
import TabBar from '../../tab-bar'
import BasicInformation from './BasicInformation'
import AdditionalDetails from './AdditionalDetails'
import withFormLayout from '../form-layout/withFormLayout'
import dataModel from './data-model'

/**
 * Example component showing how to use the form layout components
 * with the reusable TabBar component
 * @component
 * @returns {React.ReactElement} FormExample component
 */
const FormExample = ({ formFields, loading }) => {
  const [activeTab, setActiveTab] = useState('basic')

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <TabBar
      items={[
        {
          key: 'basic',
          title: 'Basic Information',
          closeable: false,
          content: <BasicInformation formFields={formFields} />
        },
        {
          key: 'additional',
          title: 'Additional Details',
          closeable: false,
          content: <AdditionalDetails formFields={formFields} />
        }
      ]}
      activeKey={activeTab}
      onChange={setActiveTab}
      renderTabContent={true}
      showCloseAll={false}
    />
  )
}

// Wrap the component with the HOC
export default withFormLayout(FormExample, {
  dataModel,
  onDataFetched: (data) => {
    console.log('Form data fetched:', data)
  }
}) 