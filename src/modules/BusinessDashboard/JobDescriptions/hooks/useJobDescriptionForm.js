// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, message } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  createJobDescription,
  updateJobDescription,
  getJobDescriptionById,
  getDepartments,
  getExperienceLevels
} from '../controllers'
import {
  parseKeywords,
  computeJobDescriptionFieldCompletion,
  buildJobDescriptionSubmitPayload,
  mapJobDescriptionRecordToFormValues,
  parseJobDescriptionValidationErrors,
  JOB_DESC_LABEL_TO_FIELD_NAME
} from '../model'

const JOB_DESCRIPTIONS_LIST_PATH = '/business-dashboard/job-descriptions'

/**
 * Orchestration for create/edit job description form: lookups, edit load,
 * completion counts, validation modal, and submit.
 */
export function useJobDescriptionForm(user) {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [experienceLevels, setExperienceLevels] = useState([])
  const [lookupsLoading, setLookupsLoading] = useState(true)
  const [initialDataLoading, setInitialDataLoading] = useState(false)
  const [tabValidationErrors, setTabValidationErrors] = useState({
    basicInfo: false,
    detailedInfo: false
  })
  const [validationModalVisible, setValidationModalVisible] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [isFormReady, setIsFormReady] = useState(false)

  const [fieldCompletionCounts, setFieldCompletionCounts] = useState(() =>
    computeJobDescriptionFieldCompletion({})
  )

  const isEditMode = Boolean(location.state?.isEdit)
  const editId = location.state?.editId

  const timeoutRefs = useRef([])

  const scheduleTimeout = useCallback((fn, ms) => {
    const id = window.setTimeout(fn, ms)
    timeoutRefs.current.push(id)
    return id
  }, [])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id))
      timeoutRefs.current = []
    }
  }, [])

  const refreshFieldCounts = useCallback(() => {
    try {
      const values = form.getFieldsValue()
      setFieldCompletionCounts(computeJobDescriptionFieldCompletion(values))
    } catch {
      /* ignore */
    }
  }, [form])

  const loadLookupData = useCallback(async () => {
    try {
      setLookupsLoading(true)

      const [departmentsResult, experienceLevelsResult] = await Promise.all([getDepartments(), getExperienceLevels()])

      if (departmentsResult.success) {
        setDepartments(departmentsResult.data)
      } else {
        console.error('Error loading departments:', departmentsResult.error)
        message.error('Failed to load departments')
      }

      if (experienceLevelsResult.success) {
        setExperienceLevels(experienceLevelsResult.data)
      } else {
        console.error('Error loading experience levels:', experienceLevelsResult.error)
        message.error('Failed to load experience levels')
      }
    } catch (error) {
      console.error('Error loading lookup data:', error)
      message.error('Failed to load lookup data')
    } finally {
      setLookupsLoading(false)
    }
  }, [])

  const loadExistingJobDescription = useCallback(
    async (id) => {
      try {
        setInitialDataLoading(true)
        const result = await getJobDescriptionById(id)

        if (result.success && result.data) {
          form.setFieldsValue(mapJobDescriptionRecordToFormValues(result.data))

          scheduleTimeout(() => {
            refreshFieldCounts()
            setIsFormReady(true)
          }, 300)
        } else {
          console.error('Error loading job description for edit:', result.error)
          message.error(`Failed to load job description data: ${result.error}`)
          navigate(JOB_DESCRIPTIONS_LIST_PATH)
        }
      } catch (error) {
        console.error('Unexpected error loading job description for edit:', error)
        message.error('An unexpected error occurred while loading the job description')
        navigate(JOB_DESCRIPTIONS_LIST_PATH)
      } finally {
        setInitialDataLoading(false)
      }
    },
    [form, navigate, refreshFieldCounts, scheduleTimeout]
  )

  useEffect(() => {
    loadLookupData()
  }, [loadLookupData])

  useEffect(() => {
    if (!isEditMode) {
      scheduleTimeout(() => setIsFormReady(true), 1000)
    }
  }, [isEditMode, scheduleTimeout])

  useEffect(() => {
    if (isEditMode && editId) {
      loadExistingJobDescription(editId)
    }
  }, [isEditMode, editId, loadExistingJobDescription])

  useEffect(() => {
    if (!lookupsLoading && !initialDataLoading) {
      scheduleTimeout(refreshFieldCounts, 200)
    }
  }, [lookupsLoading, initialDataLoading, refreshFieldCounts, scheduleTimeout])

  useEffect(() => {
    if (!lookupsLoading && !initialDataLoading) {
      const formValues = form.getFieldsValue()
      if (formValues.title || formValues.overview || formValues.responsibilities) {
        scheduleTimeout(refreshFieldCounts, 100)
      }
    }
  }, [form, lookupsLoading, initialDataLoading, refreshFieldCounts, scheduleTimeout])

  useEffect(() => {
    if (!lookupsLoading && !initialDataLoading) {
      ;[500, 1000, 1500].forEach((delay) => {
        scheduleTimeout(() => {
          const values = form.getFieldsValue()
          if (Object.keys(values).length > 0) {
            refreshFieldCounts()
            setIsFormReady(true)
          }
        }, delay)
      })
    }
  }, [lookupsLoading, initialDataLoading, form, refreshFieldCounts, scheduleTimeout])

  useEffect(() => {
    if (isFormReady) {
      refreshFieldCounts()
    }
  }, [isFormReady, refreshFieldCounts])

  const handleFormSubmit = useCallback(
    async (values) => {
      setLoading(true)
      try {
        const processedValues = buildJobDescriptionSubmitPayload(values, parseKeywords)

        setTabValidationErrors({
          basicInfo: false,
          detailedInfo: false
        })

        let result
        if (isEditMode && editId) {
          result = await updateJobDescription(editId, processedValues, user)
          if (result.success) {
            message.success('Job description updated successfully!')
            navigate(JOB_DESCRIPTIONS_LIST_PATH)
          } else {
            console.error('Error updating job description:', result.error)
            message.error(`Failed to update job description: ${result.error}`)
          }
        } else {
          result = await createJobDescription(processedValues, user)
          if (result.success) {
            message.success('Job description created successfully!')
            navigate(JOB_DESCRIPTIONS_LIST_PATH)
          } else {
            console.error('Error creating job description:', result.error)
            message.error(`Failed to create job description: ${result.error}`)
          }
        }
      } catch (error) {
        console.error('Unexpected error submitting job description:', error)
        message.error('An unexpected error occurred while saving the job description')
      } finally {
        setLoading(false)
      }
    },
    [user, navigate, isEditMode, editId]
  )

  const handleSaveClick = useCallback(async () => {
    try {
      const values = await form.validateFields()
      await handleFormSubmit(values)
    } catch (errorInfo) {
      const parsed = parseJobDescriptionValidationErrors(errorInfo)
      setTabValidationErrors(parsed.tabValidationErrors)
      setValidationErrors(parsed.validationErrors)
      setValidationModalVisible(true)
      if (parsed.suggestedActiveTab) {
        setActiveTab(parsed.suggestedActiveTab)
      }
    }
  }, [form, handleFormSubmit])

  const handleValidationModalOk = useCallback(() => {
    setValidationModalVisible(false)

    const firstError = validationErrors[0]
    if (firstError) {
      setActiveTab(firstError.tabKey)
      const fieldName = JOB_DESC_LABEL_TO_FIELD_NAME[firstError.field]
      scheduleTimeout(() => {
        if (fieldName) {
          form.scrollToField(fieldName)
        }
      }, 300)
    }
  }, [validationErrors, form, scheduleTimeout])

  const handleFormChange = useCallback(() => {
    scheduleTimeout(refreshFieldCounts, 50)
    scheduleTimeout(refreshFieldCounts, 200)

    if (tabValidationErrors.basicInfo || tabValidationErrors.detailedInfo || validationModalVisible) {
      setTabValidationErrors({
        basicInfo: false,
        detailedInfo: false
      })
      setValidationModalVisible(false)
      setValidationErrors([])
    }
  }, [refreshFieldCounts, scheduleTimeout, tabValidationErrors, validationModalVisible])

  const handleTabChange = useCallback(
    (newActiveKey) => {
      setActiveTab(newActiveKey)
      scheduleTimeout(refreshFieldCounts, 50)
    },
    [refreshFieldCounts, scheduleTimeout]
  )

  return {
    form,
    loading,
    departments,
    experienceLevels,
    lookupsLoading,
    initialDataLoading,
    tabValidationErrors,
    validationModalVisible,
    setValidationModalVisible,
    validationErrors,
    activeTab,
    fieldCompletionCounts,
    isEditMode,
    handleFormSubmit,
    handleSaveClick,
    handleValidationModalOk,
    handleFormChange,
    handleTabChange
  }
}
