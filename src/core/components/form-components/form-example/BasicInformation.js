import React from 'react'
import FormInput from '../form-fields/FormInput'
import FormTextArea from '../form-fields/FormTextArea'
import FormRadio from '../form-fields/FormRadio'
import FormCheckbox from '../form-fields/FormCheckbox'
import FormSwitch from '../form-fields/FormSwitch'
import FormDate from '../form-fields/FormDate'
import FormTime from '../form-fields/FormTime'
import FormInputNumber from '../form-fields/FormInputNumber'

/**
 * Basic Information tab content component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formFields - Form fields configuration object
 * @returns {React.ReactElement} BasicInformation component
 */
const BasicInformation = ({ formFields }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <FormInput {...formFields.firstName} />
      <FormInput {...formFields.lastName} />
      <FormInput {...formFields.email} />
      <FormInput {...formFields.phone} />
      <FormInput {...formFields.jobTitle} />
      <FormDate {...formFields.joinDate} />
      <FormTime {...formFields.workingHours} />
      <FormInputNumber {...formFields.projectCount} />
      <FormRadio {...formFields.employmentType} />
      <FormCheckbox {...formFields.benefits} />
      <FormSwitch {...formFields.activeStatus} />
      <div className='col-span-1 md:col-span-2'>
        <FormTextArea {...formFields.bio} />
      </div>
    </div>
  )
}

export default BasicInformation 