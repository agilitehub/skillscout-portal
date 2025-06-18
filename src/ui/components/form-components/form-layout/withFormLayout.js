import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Form, message } from 'antd'
import { FormLayout, FormSidebar } from './index'
import { useTheme } from '../../../ThemeContext'
import { initNewRecord } from '../../../../lib/agilite-controller'
import { getAuth } from 'firebase/auth'
/**
 * Higher Order Component that provides form layout and data fetching functionality
 * @param {React.ComponentType} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options for the HOC
 * @param {Object} options.dataModel - The data model containing form configuration
 * @param {Function} options.onDataFetched - Optional callback when data is fetched
 * @returns {React.ComponentType} Enhanced component with form layout functionality
 */
const withFormLayout = (WrappedComponent, options = {}) => {
  const { dataModel, onDataFetched } = options

  return function WithFormLayoutComponent(props) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [formFields, setFormFields] = useState(dataModel?.formData || {})
    const [sidebarData, setSidebarData] = useState(dataModel?.sidebarData || {})
    const { darkMode } = useTheme()
    const { recordId } = useParams()

    // Calculate form completion percentages
    const calculateCompletionPercentages = (fields) => {
      const requiredFields = Object.values(fields).filter(field => 
        field.rules?.some(rule => rule.required)
      )
      const optionalFields = Object.values(fields).filter(field => 
        !field.rules?.some(rule => rule.required)
      )

      const requiredCompleted = requiredFields.filter(field => field.value !== undefined && field.value !== '').length
      const optionalCompleted = optionalFields.filter(field => field.value !== undefined && field.value !== '').length

      return {
        required: requiredFields.length ? Math.round((requiredCompleted / requiredFields.length) * 100) : 0,
        additional: optionalFields.length ? Math.round((optionalCompleted / optionalFields.length) * 100) : 0
      }
    }

    useEffect(() => {
      const fetchFormData = async () => {
        if (!dataModel?.bpmProfileKey) {
          console.error('BPM Profile Key is required')
          return
        }

        setLoading(true)
        
        try {
          const auth = getAuth()
          const response = await initNewRecord(dataModel.bpmProfileKey, auth.currentUser?.email || '', recordId || '')
          
          // Merge form data
          const mergedFormData = Object.keys(dataModel.formData).reduce((acc, propName) => {
            acc[propName] = {
              ...dataModel.formData[propName],
              ...(response.formData?.[propName] || {}),
              rules: [
                ...(dataModel.formData[propName]?.rules || []),
                ...(response.formData?.[propName]?.rules || [])
              ]
            }
            return acc
          }, {})

          // Merge sidebar data with dynamic workflow options
          const mergedSidebarData = {
            ...dataModel.sidebarData,
            ...response.sidebarData,
            options: [
              ...(dataModel.sidebarData?.options || []),
              ...(response.sidebarData?.options || [])
            ],
            isAutoStep: response.sidebarData?.isAutoStep ?? dataModel.sidebarData?.isAutoStep ?? false,
            submitLabel: response.sidebarData?.submitLabel || dataModel.sidebarData?.submitLabel || 'Submit'
          }

          setFormFields(mergedFormData)
          setSidebarData(mergedSidebarData)

          if (onDataFetched) {
            onDataFetched({ formData: mergedFormData, sidebarData: mergedSidebarData })
          }
        } catch (error) {
          console.error('Error fetching form data:', error)
          message.error('Failed to load form data')
        } finally {
          setLoading(false)
        }
      }

      fetchFormData()
    }, [dataModel?.bpmProfileKey, props.currentUser, recordId])

    const handleFieldChange = (fieldName, value) => {
      setFormFields((prevFields) => {
        const updatedFields = { ...prevFields }
        const field = updatedFields[fieldName]
        
        if (field) {
          updatedFields[fieldName] = {
            ...field,
            value
          }
        }
        
        return updatedFields
      })
    }

    const handleWorkflowSubmit = (option, comments) => {
      if (props.onWorkflowSubmit) {
        props.onWorkflowSubmit(option, comments, formFields)
      }
    }

    const handleApprove = (comments) => {
      if (props.onApprove) {
        props.onApprove(comments, formFields)
      }
    }

    const handleReject = (comments) => {
      if (props.onReject) {
        props.onReject(comments, formFields)
      }
    }

    const handleReturn = (comments) => {
      if (props.onReturn) {
        props.onReturn(comments, formFields)
      }
    }

    // Calculate completion percentages whenever formFields changes
    const completion = calculateCompletionPercentages(formFields)

    const formContent = (
      <Form
        form={form}
        layout='vertical'
        className={`p-4 ${darkMode ? 'text-agilite-grey-light' : 'text-secondary'}`}
        onValuesChange={(changedValues) => {
          const fieldName = Object.keys(changedValues)[0]
          handleFieldChange(fieldName, changedValues[fieldName])
        }}
      >
        <WrappedComponent
          {...props}
          formFields={formFields}
          loading={loading}
          form={form}
        />
      </Form>
    )

    return (
      <FormLayout
        recordId={recordId}
        bpmProfileKey={dataModel?.bpmProfileKey}
        content={
          <Card bordered={false} className={`${darkMode ? 'bg-agilite-slate' : 'bg-white'} rounded-lg shadow-sm`}>
            {formContent}
          </Card>
        }
        sidebar={
          <FormSidebar
            data={sidebarData}
            onSubmit={handleWorkflowSubmit}
            onApprove={handleApprove}
            onReject={handleReject}
            onReturn={handleReturn}
            requiredCompletion={completion.required}
            additionalCompletion={completion.additional}
          />
        }
      />
    )
  }
}

export default withFormLayout 