// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React, { useMemo } from 'react'
import { Card, Col, Row, Typography, Spin, Empty } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../../core/context/ThemeContext'
import { SEMANTIC_COLORS, LIGHT_THEME, DARK_THEME } from '../../../../core/theme/colors'

const { Title, Text } = Typography

const formatRelativeTime = (iso) => {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/**
 * Group matches by job listing for recruiter scanning.
 * @param {object[]} matches
 */
const groupByListing = (matches) => {
  const map = new Map()
  for (const m of matches) {
    const key = m.jobOpportunityId || m.jobListingTitle
    if (!map.has(key)) {
      map.set(key, { listingTitle: m.jobListingTitle, location: m.jobListingLocation, items: [] })
    }
    map.get(key).items.push(m)
  }
  return Array.from(map.values())
}

const PotentialCandidatesSection = React.memo(({ matches, loading, error }) => {
  const { darkMode } = useTheme()
  const groups = useMemo(() => groupByListing(matches), [matches])

  return (
    <div className='dashboard-potential-candidates px-3 pb-6 sm:px-4'>
      <div className='flex items-center gap-2 mb-4'>
        <FontAwesomeIcon icon={faUserCheck} style={{ color: SEMANTIC_COLORS.primary }} />
        <Title
          level={2}
          className={`!mb-0 !text-base !font-bold ${darkMode ? '!text-white' : '!text-gray-900'}`}
        >
          Potential Candidates
        </Title>
      </div>

      {loading && (
        <div className='flex justify-center py-8'>
          <Spin />
        </div>
      )}

      {!loading && error && (
        <Text type='danger' className='block mb-4'>
          {error}
        </Text>
      )}

      {!loading && !error && groups.length === 0 && (
        <Empty
          description={
            <span className={darkMode ? 'text-muted' : 'text-gray-500'}>
              No potential candidates yet. Matching runs every few minutes in the background.
            </span>
          }
        />
      )}

      {!loading && !error && groups.length > 0 && (
        <Row gutter={[16, 16]}>
          {groups.map((group) => (
            <Col xs={24} lg={12} key={group.listingTitle + (group.location || '')}>
              <Card
                className={`h-full ${darkMode ? '!bg-gray-800 !border-gray-700' : '!bg-white !border-gray-200'}`}
                styles={{ body: { padding: '16px' } }}
              >
                <Title
                  level={5}
                  className={`!mt-0 !mb-1 ${darkMode ? '!text-white' : '!text-gray-900'}`}
                >
                  {group.listingTitle}
                </Title>
                {group.location && (
                  <Text
                    className='block text-xs mb-3'
                    style={{ color: darkMode ? DARK_THEME.text.secondary : LIGHT_THEME.text.secondary }}
                  >
                    {group.location}
                  </Text>
                )}
                <ul className='space-y-3 list-none p-0 m-0'>
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      className='rounded-lg border border-border p-3 bg-surface'
                    >
                      <div className='flex justify-between items-start gap-2'>
                        <div>
                          <Text strong className='text-foreground block'>
                            {item.candidateName}
                          </Text>
                          {item.candidateTitle && (
                            <Text className='text-muted text-xs block'>{item.candidateTitle}</Text>
                          )}
                        </div>
                        <span
                          className='shrink-0 text-xs font-semibold px-2 py-1 rounded-full'
                          style={{
                            backgroundColor: `${SEMANTIC_COLORS.primary}20`,
                            color: SEMANTIC_COLORS.primary
                          }}
                        >
                          {item.confidenceScore}%
                        </span>
                      </div>
                      {item.rationale && (
                        <Text className='text-muted text-sm block mt-2'>{item.rationale}</Text>
                      )}
                      <Text className='text-muted text-xs block mt-1'>
                        {formatRelativeTime(item.updatedAt)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
})

PotentialCandidatesSection.displayName = 'PotentialCandidatesSection'

export default PotentialCandidatesSection
