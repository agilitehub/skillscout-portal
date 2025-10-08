// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useCallback, useEffect } from 'react'
import { Card, Form, message, Row, Col, Input, Select, Space } from 'antd'
import { Button } from '../../../../core/components'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faGift } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { createJobListing } from '../utils/listing-controller'
import { getJobDescriptionsForSelection } from '../utils/controller'
import JobDescriptionPreview from './JobDescriptionPreview'

const { TextArea } = Input

/**
 * CreateJobListing page for creating engaging job listings
 */
const CreateJobListing = React.memo(({ user }) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [jobDescriptions, setJobDescriptions] = useState([])
  const [loadingJobDescriptions, setLoadingJobDescriptions] = useState(false)
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState(null)
  const state = useLocation().state

  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true)
        await createJobListing(values)
        message.success('Job listing created successfully')
        navigate('/business-dashboard')
      } catch (error) {
        message.error('Failed to create job listing')
        console.error('Error creating job listing:', error)
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const handleGoBack = useCallback(() => {
    navigate('/business-dashboard')
  }, [navigate])

  // Load job descriptions on component mount
  useEffect(() => {
    const loadJobDescriptions = async () => {
      try {
        setLoadingJobDescriptions(true)
        const result = await getJobDescriptionsForSelection()
        if (result.success) {
          setJobDescriptions(result.data)
        } else {
          console.error('Error loading job descriptions:', result.error)
          message.error('Failed to load job descriptions')
        }
      } catch (error) {
        console.error('Error loading job descriptions:', error)
        message.error('Failed to load job descriptions')
      } finally {
        setLoadingJobDescriptions(false)
      }
    }

    loadJobDescriptions()
  }, [])

  // Handle job description selection
  const handleJobDescriptionChange = useCallback((value) => {
    setSelectedJobDescriptionId(value)
  }, [])

  return (
    <div className='flex h-screen bg-gray-100'>
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {/* Header */}
        <div
          className={`sticky top-0 z-10 border-b px-6 py-4 ${
            darkMode ? 'bg-gray-700 border-gray-600 shadow-lg' : 'bg-white border-gray-200 shadow-sm'
          }`}
          style={{
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderBottomColor: darkMode ? '#4B5563' : '#E5E7EB'
          }}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Job Listing</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a professional job listing</p>
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-auto p-6'>
          <Card className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleFormSubmit}
              className='global-form'
              initialValues={state?.jobData}
            >
              {/* Job Description Selection */}
              <Form.Item
                label='Job Description'
                name='jobDescriptionId'
                rules={[{ required: true, message: 'Please select a job description' }]}
              >
                <Select
                  placeholder='Select a job description'
                  loading={loadingJobDescriptions}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={handleJobDescriptionChange}
                  dropdownClassName={darkMode ? 'job-listing-dark-dropdown' : ''}
                  style={{ fontWeight: '500' }}
                >
                  {jobDescriptions.map((jobDesc) => (
                    <Select.Option key={jobDesc.id} value={jobDesc.id}>
                      {jobDesc.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Job Description Preview */}
              <JobDescriptionPreview jobDescriptionId={selectedJobDescriptionId} visible={!!selectedJobDescriptionId} />

              {/* Job Title and Source */}
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item
                    label='Job Title'
                    name='title'
                    rules={[{ required: true, message: 'Please enter job title' }]}
                  >
                    <Input placeholder='e.g. Marketing Manager' style={{ fontWeight: '500' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Source' name='source' rules={[{ required: true, message: 'Please enter source' }]}>
                    <Input placeholder='e.g. Indeed' style={{ fontWeight: '500' }} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Role Overview */}
              <Form.Item
                label='Role Overview'
                name='overview'
                rules={[{ required: true, message: 'Please enter role overview' }]}
              >
                <TextArea
                  placeholder='Brief overview of the role and its main purpose'
                  rows={3}
                  style={{ fontWeight: '500' }}
                />
              </Form.Item>

              {/* Key Duties */}
              <Form.Item
                label='Key Duties'
                name='duties'
                rules={[{ required: true, message: 'Please enter key duties' }]}
                extra='Enter each duty on a new line. They will be displayed as bullet points.'
              >
                <TextArea
                  placeholder={`• Communicate with senior management on marketing strategies
• Organize events like trade shows & oversee logistics
• Coordinate content creation and campaign optimization
• Manage budgets and improve campaign ROI`}
                  rows={6}
                  style={{ fontWeight: '500' }}
                />
              </Form.Item>

              {/* Qualifications */}
              <Form.Item
                label='Qualifications'
                name='qualifications'
                rules={[{ required: true, message: 'Please enter qualifications' }]}
                extra='Enter each qualification on a new line. They will be displayed as bullet points.'
              >
                <TextArea
                  placeholder={`• Strong communication & decision-making
• Familiarity with marketing software tools
• Attention to detail and analytical mindset
• Bachelor's degree (MBA preferred) with several years of marketing experience`}
                  rows={6}
                  style={{ fontWeight: '500' }}
                />
              </Form.Item>

              {/* Benefits */}
              <Form.Item
                label={
                  <Space>
                    <span>Benefits</span>
                    <FontAwesomeIcon icon={faGift} className='text-gray-400' />
                  </Space>
                }
                name='benefits'
                rules={[{ required: true, message: 'Please enter job benefits' }]}
                extra={
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    List the benefits and perks offered with this position
                  </span>
                }
              >
                <TextArea
                  placeholder={`• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible PTO and work-from-home options
• Professional development budget`}
                  rows={8}
                  showCount={true}
                  style={{ fontWeight: '500' }}
                />
              </Form.Item>

              {/* Additional Details */}
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label='Last Updated'
                    name='lastUpdated'
                    rules={[{ required: true, message: 'Please enter last updated date' }]}
                  >
                    <Input placeholder='e.g. June 24, 2025' style={{ fontWeight: '500' }} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Form Actions */}
              <div className='flex justify-end space-x-4 mt-6'>
                <Button
                  icon={<FontAwesomeIcon icon={faTimes} />}
                  onClick={handleGoBack}
                  size='large'
                  type='default'
                  className='job-listing-cancel-btn'
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  icon={<FontAwesomeIcon icon={faSave} />}
                  onClick={() => form.submit()}
                  loading={loading}
                  size='large'
                  className='job-listing-create-btn'
                >
                  Create Job Listing
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
})

export default CreateJobListing
