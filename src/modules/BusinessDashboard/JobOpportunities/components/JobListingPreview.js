// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React from 'react'
import { Card, Tag, Button, Space, Divider } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faLeaf,
  faCode,
  faMapMarkerAlt,
  faClock,
  faDollarSign,
  faBuilding,
  faEnvelope,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../ui/ThemeContext'

/**
 * JobListingPreview component for displaying formatted job listings
 * Shows the engaging format based on the listing style
 */
const JobListingPreview = React.memo(({ listing, onApply, onShare }) => {
  const { darkMode } = useTheme()

  if (!listing) return null

  const getStyleIcon = (style) => {
    switch (style) {
      case 'purpose-driven': return faHeart
      case 'impact-mission': return faLeaf
      case 'challenge-call': return faCode
      default: return faHeart
    }
  }

  const getStyleColor = (style) => {
    switch (style) {
      case 'purpose-driven': return '#ec4899'
      case 'impact-mission': return '#10b981'
      case 'challenge-call': return '#3b82f6'
      default: return '#6366f1'
    }
  }

  const getStyleLabel = (style) => {
    switch (style) {
      case 'purpose-driven': return 'Purpose-Driven'
      case 'impact-mission': return 'Impact & Mission'
      case 'challenge-call': return 'Challenge-As-A-Call'
      default: return 'Engaging'
    }
  }

  const renderContent = () => {
    switch (listing.listingStyle) {
      case 'purpose-driven':
        return (
          <div className="space-y-6">
            {listing.intro && (
              <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2">
                  💡 Our Question to You
                </h3>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "{listing.intro}"
                </p>
              </div>
            )}

            {listing.whatYoullDo && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FontAwesomeIcon icon={faHeart} className="text-pink-500 mr-2" />
                  What You'll Do
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.whatYoullDo}
                </div>
              </div>
            )}

            {listing.whyUs && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FontAwesomeIcon icon={faHeart} className="text-pink-500 mr-2" />
                  Why Us
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.whyUs}
                </div>
              </div>
            )}

            {listing.values && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  🌟 Our Values
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.values}
                </div>
              </div>
            )}
          </div>
        )

      case 'impact-mission':
        return (
          <div className="space-y-6">
            {listing.headline && (
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                  📊 Impact Statement
                </h3>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "{listing.headline}"
                </p>
              </div>
            )}

            {listing.responsibilities && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-500 mr-2" />
                  Key Responsibilities
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.responsibilities}
                </div>
              </div>
            )}

            {listing.whyResonates && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-500 mr-2" />
                  Why It Resonates
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.whyResonates}
                </div>
              </div>
            )}

            {listing.impactMetrics && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  📈 Impact Metrics
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.impactMetrics}
                </div>
              </div>
            )}
          </div>
        )

      case 'challenge-call':
        return (
          <div className="space-y-6">
            {listing.hook && (
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  🔧 The Challenge
                </h3>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "{listing.hook}"
                </p>
              </div>
            )}

            {listing.duties && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCode} className="text-blue-500 mr-2" />
                  Core Duties
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.duties}
                </div>
              </div>
            )}

            {listing.tone && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCode} className="text-blue-500 mr-2" />
                  Culture & Tone
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.tone}
                </div>
              </div>
            )}

            {listing.techStack && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  💻 Tech Stack
                </h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.techStack}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No content available
          </div>
        )
    }
  }

  return (
    <Card 
      className={`w-full max-w-4xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg`}
      style={{ minHeight: '600px' }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Tag 
                color={getStyleColor(listing.listingStyle)}
                className="text-white font-medium"
              >
                <FontAwesomeIcon icon={getStyleIcon(listing.listingStyle)} className="mr-1" />
                {getStyleLabel(listing.listingStyle)}
              </Tag>
              {listing.status && (
                <Tag color={listing.status === 'Active' ? 'green' : 'orange'}>
                  {listing.status}
                </Tag>
              )}
            </div>
            
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {listing.title}
            </h1>
            
            <h2 className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {listing.organization}
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {listing.location && (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                  {listing.location}
                </span>
              )}
              {listing.workStyle && (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  {listing.workStyle}
                </span>
              )}
              {listing.compensation && (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                  {listing.compensation}
                </span>
              )}
              {listing.category && (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                  {listing.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Application Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Ready to Apply?
        </h3>
        
        {listing.howToApply && (
          <div className="mb-4">
            <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              How to Apply:
            </h4>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line`}>
              {listing.howToApply}
            </p>
          </div>
        )}

        {listing.requirements && (
          <div className="mb-4">
            <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Application Requirements:
            </h4>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line`}>
              {listing.requirements}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {listing.contact && (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                Contact available
              </span>
            )}
            {listing.deadline && (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                Deadline: {listing.deadline}
              </span>
            )}
          </div>

          <Space>
            {onShare && (
              <Button onClick={() => onShare(listing)}>
                Share
              </Button>
            )}
            {onApply && (
              <Button 
                type="primary" 
                onClick={() => onApply(listing)}
                style={{
                  backgroundColor: getStyleColor(listing.listingStyle),
                  borderColor: getStyleColor(listing.listingStyle)
                }}
              >
                Apply Now
              </Button>
            )}
          </Space>
        </div>

        {listing.additionalNotes && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {listing.additionalNotes}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
})

JobListingPreview.displayName = 'JobListingPreview'

export default JobListingPreview 