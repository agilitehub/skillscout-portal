// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useState, useEffect } from 'react'
import { Card, Tag, Divider, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faBuilding,
  faGraduationCap,
  faStar,
  faCalendarAlt,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { Button } from '../../../../core/components'
import { getJobDescriptionById } from '../../JobDescriptions/utils/controller'

/**
 * JobDescriptionPreview component
 * Shows a preview of the selected job description in a collapsible panel
 */
const JobDescriptionPreview = React.memo(({ jobDescriptionId, visible = false }) => {
  const { darkMode } = useTheme()
  const [jobDescription, setJobDescription] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!jobDescriptionId || !visible) {
      setJobDescription(null)
      setError(null)
      setIsExpanded(false)
      return
    }

    const loadJobDescription = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getJobDescriptionById(jobDescriptionId)

        if (result.success) {
          setJobDescription(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to load job description')
        console.error('Error loading job description:', err)
      } finally {
        setLoading(false)
      }
    }

    loadJobDescription()
  }, [jobDescriptionId, visible])

  if (!visible || !jobDescriptionId) {
    return null
  }

  if (loading) {
    return (
      <Card
        className={`mt-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
        bodyStyle={{ padding: '12px' }}
      >
        <div className='flex items-center justify-center py-4'>
          <Spin size='default' />
          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading preview...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card
        className={`mt-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
        bodyStyle={{ padding: '12px' }}
      >
        <div className={`text-center py-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          <FontAwesomeIcon icon={faBriefcase} className='mr-1' />
          Error loading preview: {error}
        </div>
      </Card>
    )
  }

  if (!jobDescription) {
    return null
  }

  const formatKeywords = (keywords) => {
    if (!keywords || !Array.isArray(keywords)) return []
    return keywords.slice(0, 3) // Show only first 3 keywords in collapsed view
  }

  const truncateText = (text, maxLength = 100) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Compact view when collapsed
  if (!isExpanded) {
    return (
      <Card
        className={`mt-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
        bodyStyle={{ padding: '12px' }}
      >
        <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center flex-1'>
              <FontAwesomeIcon icon={faBriefcase} className='mr-2 text-emerald-500' />
              <div className='flex-1'>
                <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {jobDescription.title}
                </h4>
                <div className='flex items-center space-x-3 mt-1'>
                  {jobDescription.departmentName && (
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FontAwesomeIcon icon={faBuilding} className='mr-1' />
                      {jobDescription.departmentName}
                    </span>
                  )}
                  {jobDescription.experienceLevelName && (
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FontAwesomeIcon icon={faGraduationCap} className='mr-1' />
                      {jobDescription.experienceLevelName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='small'
              icon={<FontAwesomeIcon icon={faChevronDown} />}
              onClick={handleToggle}
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            />
          </div>

          {/* Quick preview of overview */}
          {jobDescription.overview && (
            <div className='mt-2'>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {truncateText(jobDescription.overview, 120)}
              </p>
            </div>
          )}

          {/* Keywords preview */}
          {jobDescription.keywords && jobDescription.keywords.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {formatKeywords(jobDescription.keywords).map((keyword, index) => (
                <Tag
                  key={index}
                  size='small'
                  color='emerald'
                  className={`text-xs ${darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}
                >
                  {keyword}
                </Tag>
              ))}
              {jobDescription.keywords.length > 3 && (
                <Tag
                  size='small'
                  className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                >
                  +{jobDescription.keywords.length - 3} more
                </Tag>
              )}
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Expanded view
  return (
    <Card
      className={`mt-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
      bodyStyle={{ padding: '16px' }}
    >
      <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {/* Header with collapse button */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FontAwesomeIcon icon={faBriefcase} className='mr-2 text-emerald-500' />
              {jobDescription.title}
            </h3>

            {/* Department and Experience Level */}
            <div className='flex items-center space-x-4 mb-3'>
              {jobDescription.departmentName && (
                <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FontAwesomeIcon icon={faBuilding} className='mr-1' />
                  <span>{jobDescription.departmentName}</span>
                </div>
              )}
              {jobDescription.experienceLevelName && (
                <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FontAwesomeIcon icon={faGraduationCap} className='mr-1' />
                  <span>{jobDescription.experienceLevelName}</span>
                </div>
              )}
            </div>

            {/* Keywords */}
            {jobDescription.keywords && jobDescription.keywords.length > 0 && (
              <div className='mb-3'>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Keywords:</div>
                <div className='flex flex-wrap gap-1'>
                  {jobDescription.keywords.slice(0, 5).map((keyword, index) => (
                    <Tag
                      key={index}
                      color='emerald'
                      className={`${darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}
                    >
                      {keyword}
                    </Tag>
                  ))}
                  {jobDescription.keywords.length > 5 && (
                    <Tag className={`${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      +{jobDescription.keywords.length - 5} more
                    </Tag>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            {/* Last Updated */}
            {jobDescription.lastUpdated && (
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                <FontAwesomeIcon icon={faCalendarAlt} className='mr-1' />
                Updated: {jobDescription.lastUpdated}
              </div>
            )}
            <Button
              variant='ghost'
              size='small'
              icon={<FontAwesomeIcon icon={faChevronUp} />}
              onClick={handleToggle}
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            />
          </div>
        </div>

        <Divider className={`${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />

        {/* Overview */}
        {jobDescription.overview && (
          <div className='mb-4'>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Overview</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {jobDescription.overview}
            </p>
          </div>
        )}

        {/* Responsibilities */}
        {jobDescription.responsibilities && (
          <div className='mb-4'>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Key Responsibilities</h4>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {jobDescription.responsibilities}
            </div>
          </div>
        )}

        {/* Requirements */}
        {jobDescription.requirements && (
          <div className='mb-4'>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Requirements</h4>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {jobDescription.requirements}
            </div>
          </div>
        )}

        {/* Benefits */}
        {jobDescription.benefits && (
          <div>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Benefits</h4>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {jobDescription.benefits}
            </div>
          </div>
        )}

        {/* View Full Details Link */}
        <div className='mt-4 pt-3 border-t border-gray-200 dark:border-gray-600'>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            <FontAwesomeIcon icon={faStar} className='mr-1 text-yellow-500' />
            This is a preview. Full details will be available in the job listing.
          </div>
        </div>
      </div>
    </Card>
  )
})

JobDescriptionPreview.displayName = 'JobDescriptionPreview'

export default JobDescriptionPreview
