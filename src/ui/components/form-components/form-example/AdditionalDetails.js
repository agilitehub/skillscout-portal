import React from 'react'
import FormDate from '../form-fields/FormDate'
import FormSelect from '../form-fields/FormSelect'
import FormTextArea from '../form-fields/FormTextArea'

/**
 * Additional Details tab content component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formFields - Form fields configuration object
 * @returns {React.ReactElement} AdditionalDetails component
 */
const AdditionalDetails = ({ formFields }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <FormDate {...formFields.dob} />
      <FormSelect {...formFields.department} />
      <div className='col-span-1 md:col-span-2'>
        <FormTextArea {...formFields.address} />
      </div>
    </div>
  )
}

export default AdditionalDetails 