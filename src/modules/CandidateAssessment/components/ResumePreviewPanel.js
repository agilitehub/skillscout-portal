// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useRef, useState } from 'react'
import { Typography, Progress, Switch, Spin, Select } from 'antd'
import { Button } from '../../../core/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileAlt,
  faUser,
  faGraduationCap,
  faBriefcase,
  faAward,
  faList,
  faChartLine,
  faUpload,
  faComments,
  faCertificate,
  faGlobe,
  faAddressBook,
  faCircleExclamation,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons'
import { CV_ACCEPTED_MIME_TYPES } from '../model/chatAttachmentRules'

const { Title, Text } = Typography

/**
 * Live resume preview panel — reads from Supabase-backed resume data.
 */
const ResumePreviewPanel = React.memo(
  ({
    resumeData,
    isLoading,
    isRefreshing,
    isProcessing,
    messages,
    darkMode,
    colors,
    onUploadResume,
    onPromoteResume
  }) => {
    const [viewMode, setViewMode] = useState('preview')
    const fileInputRef = useRef(null)

    const showEmptyState = !isLoading && !resumeData.hasContent && !isProcessing
    const incompleteItems = resumeData.incompleteItems || []

    const handleFileChange = (event) => {
      const file = event.target.files?.[0]
      if (file && onUploadResume) {
        onUploadResume(file)
      }
      event.target.value = ''
    }

    return (
      <div className='hidden lg:flex lg:w-2/5 xl:w-1/2 h-full min-h-0 bg-surface flex-col border-l border-border'>
        <div className='flex-shrink-0 p-4 border-b border-border'>
          <div className='flex items-center justify-between mb-3'>
            <Title level={5} className='!mb-0 text-foreground'>
              Live Resume Preview
            </Title>
            <div className='flex items-center space-x-2'>
              {isRefreshing && (
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className='text-muted text-xs animate-spin'
                  title='Updating resume…'
                />
              )}
              <FontAwesomeIcon
                icon={viewMode === 'preview' ? faFileAlt : faChartLine}
                className='text-muted text-sm'
              />
              <Switch
                size='small'
                checked={viewMode === 'metrics'}
                onChange={(checked) => setViewMode(checked ? 'metrics' : 'preview')}
                style={{
                  backgroundColor: viewMode === 'metrics' ? colors.emeraldPrimary : undefined
                }}
              />
              <Text className='text-xs text-muted'>{viewMode === 'preview' ? 'Resume' : 'Metrics'}</Text>
            </div>
          </div>

          <div className='mb-2'>
            <div className='flex items-center justify-between mb-1'>
              <Text className='text-sm text-muted'>Completeness</Text>
              <Text className='text-sm font-medium' style={{ color: colors.emeraldPrimary }}>
                {resumeData.completeness}%
              </Text>
            </div>
            <Progress
              percent={resumeData.completeness}
              showInfo={false}
              strokeColor={{
                '0%': colors.shakespeare,
                '100%': colors.emeraldPrimary
              }}
              trailColor={darkMode ? 'rgb(var(--color-border))' : 'rgb(var(--color-surface))'}
              size='small'
            />
          </div>

          {incompleteItems.length > 0 && (
            <IncompleteChecklist items={incompleteItems} />
          )}

          {resumeData.documents.length > 1 && onPromoteResume && (
            <div className='mt-2'>
              <Text className='text-xs text-muted block mb-1'>Primary source</Text>
              <Select
                size='small'
                className='w-full'
                value={resumeData.primarySourceId || undefined}
                placeholder='Select primary CV'
                onChange={(sourceId) => {
                  const doc = resumeData.documents.find((d) => d.sourceId === sourceId)
                  if (doc) onPromoteResume(doc.id)
                }}
                options={resumeData.documents.map((doc) => ({
                  value: doc.sourceId,
                  label: doc.name
                }))}
              />
            </div>
          )}
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto p-4'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <Spin tip='Loading resume…' />
            </div>
          ) : isProcessing ? (
            <div className='flex flex-col items-center justify-center h-full text-center px-4'>
              <Spin size='large' />
              <Text className='text-muted mt-4 block'>Analyzing your resume…</Text>
              {resumeData.processingLabel && (
                <Text className='text-xs text-muted mt-1'>{resumeData.processingLabel}</Text>
              )}
            </div>
          ) : showEmptyState ? (
            <div className='flex flex-col items-center justify-center h-full text-center px-6 space-y-6'>
              <FontAwesomeIcon icon={faFileAlt} className='text-4xl text-muted' />
              <div>
                <Title level={5} className='!mb-2 text-foreground'>
                  Build your live resume
                </Title>
                <Text className='text-muted text-sm'>
                  Upload your CV for automatic extraction, or describe your background in the chat.
                </Text>
              </div>
              <div className='flex flex-col w-full max-w-xs gap-3'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={CV_ACCEPTED_MIME_TYPES.join(',')}
                  className='hidden'
                  onChange={handleFileChange}
                />
                <Button
                  variant='primary'
                  icon={<FontAwesomeIcon icon={faUpload} />}
                  onClick={() => fileInputRef.current?.click()}
                  className='w-full'
                >
                  Upload Resume / CV
                </Button>
                <div className='flex items-center gap-2 text-muted text-xs'>
                  <FontAwesomeIcon icon={faComments} />
                  <span>Or tell me about yourself in the chat</span>
                </div>
              </div>
            </div>
          ) : viewMode === 'preview' ? (
            <div className='space-y-4 text-sm'>
              <div className='text-center pb-3 border-b border-border'>
                <Title level={4} className='!mb-1 text-foreground'>
                  {resumeData.basicInfo.name}
                </Title>
                {resumeData.basicInfo.title ? (
                  <Text className='text-muted block'>{resumeData.basicInfo.title}</Text>
                ) : (
                  <MissingFieldHint label='Professional title' inline />
                )}
                <div className='flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs'>
                  <ContactField
                    value={resumeData.basicInfo.email}
                    label='Email'
                    complete={resumeData.basicInfo.emailComplete}
                  />
                  <ContactField
                    value={resumeData.basicInfo.phone}
                    label='Phone'
                    complete={resumeData.basicInfo.phoneComplete}
                  />
                  <ContactField
                    value={resumeData.basicInfo.location}
                    label='Location'
                    complete={resumeData.basicInfo.locationComplete}
                  />
                </div>
              </div>

              <ResumeSection
                title='Professional Summary'
                icon={faUser}
                iconClass='text-blue-500'
                complete={resumeData.summaryComplete}
              >
                {resumeData.summary ? (
                  <Text className='text-muted text-sm leading-relaxed'>{resumeData.summary}</Text>
                ) : (
                  <MissingFieldHint label='Professional summary' />
                )}
              </ResumeSection>

              <ResumeSection
                title='Skills'
                icon={faAward}
                iconClass='text-green-500'
                complete={resumeData.skillsComplete}
                partial={resumeData.skills.length > 0 && !resumeData.skillsComplete}
                partialLabel={`${resumeData.skills.length} of 3 recommended`}
              >
                {resumeData.skills.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {resumeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-surface text-foreground border border-border rounded-full text-xs'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <MissingFieldHint label='Skills' />
                )}
              </ResumeSection>

              <ResumeSection
                title='Experience'
                icon={faBriefcase}
                iconClass='text-purple-500'
                complete={resumeData.experienceComplete}
                partial={resumeData.experience.length === 1}
                partialLabel='1 role — add another for full coverage'
              >
                {resumeData.experience.length > 0 ? (
                  <div className='space-y-3'>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className='border-l-2 border-border pl-3'>
                        {exp.title ? (
                          <Text strong className='text-foreground block'>
                            {exp.title}
                          </Text>
                        ) : (
                          <MissingFieldHint label='Job title' inline />
                        )}
                        <Text className='text-muted text-xs'>
                          {exp.company || 'Company not added'}
                          {exp.duration ? ` • ${exp.duration}` : ''}
                        </Text>
                        {exp.location ? (
                          <Text className='text-muted text-xs block'>{exp.location}</Text>
                        ) : (
                          <MissingFieldHint label='Location' inline className='text-xs' />
                        )}
                        {exp.description ? (
                          <Text className='text-muted text-sm mt-1 block'>{exp.description}</Text>
                        ) : (
                          <MissingFieldHint label='Role description' inline className='text-xs mt-1' />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <MissingFieldHint label='Work experience' />
                )}
              </ResumeSection>

              <ResumeSection
                title='Education'
                icon={faGraduationCap}
                iconClass='text-orange-500'
                complete={resumeData.educationComplete}
              >
                {resumeData.education.length > 0 ? (
                  <div className='space-y-2'>
                    {resumeData.education.map((edu, index) => (
                      <div key={index}>
                        {edu.degree ? (
                          <Text strong className='text-foreground block'>
                            {edu.degree}
                            {edu.field ? ` in ${edu.field}` : ''}
                          </Text>
                        ) : (
                          <MissingFieldHint label='Degree' inline />
                        )}
                        <Text className='text-muted text-xs'>
                          {edu.school || 'Institution not added'}
                          {edu.year ? ` • ${edu.year}` : ''}
                        </Text>
                        {edu.description ? (
                          <Text className='text-muted text-sm mt-1 block'>{edu.description}</Text>
                        ) : (
                          <MissingFieldHint label='Education details' inline className='text-xs mt-1' />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <MissingFieldHint label='Education' />
                )}
              </ResumeSection>

              <ResumeSection
                title='Certifications'
                icon={faCertificate}
                iconClass='text-teal-500'
                complete={resumeData.certificationsComplete}
                optional
              >
                {resumeData.certifications.length > 0 ? (
                  resumeData.certifications.map((cert, index) => (
                    <Text key={index} className='text-muted text-sm block'>
                      {cert.name || 'Certification name not added'}
                      {cert.issuer ? ` — ${cert.issuer}` : ''}
                      {cert.date ? ` (${cert.date})` : ''}
                    </Text>
                  ))
                ) : (
                  <MissingFieldHint label='Certifications' optional />
                )}
              </ResumeSection>

              <ResumeSection
                title='Languages'
                icon={faGlobe}
                iconClass='text-indigo-500'
                complete={resumeData.languagesComplete}
                optional
              >
                {resumeData.languages.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {resumeData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-surface text-foreground border border-border rounded-full text-xs'
                      >
                        {lang.language || 'Language'}
                        {lang.proficiency ? ` (${lang.proficiency})` : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <MissingFieldHint label='Languages' optional />
                )}
              </ResumeSection>

              <ResumeSection
                title='References'
                icon={faAddressBook}
                iconClass='text-pink-500'
                complete={resumeData.referencesComplete}
                optional
              >
                {resumeData.references.length > 0 ? (
                  <div className='space-y-2'>
                    {resumeData.references.map((ref, index) => (
                      <div key={index}>
                        <Text strong className='text-foreground block'>
                          {ref.name || 'Name not added'}
                        </Text>
                        <Text className='text-muted text-xs'>
                          {ref.relationship || 'Relationship not added'}
                          {ref.contact ? ` • ${ref.contact}` : ''}
                        </Text>
                      </div>
                    ))}
                  </div>
                ) : (
                  <MissingFieldHint label='References' optional />
                )}
              </ResumeSection>

              <ResumeSection
                title='Documents'
                icon={faFileAlt}
                iconClass='text-red-500'
                complete={resumeData.documentsComplete}
              >
                {resumeData.documents.length > 0 ? (
                  <div className='space-y-1'>
                    {resumeData.documents.map((doc) => (
                      <div key={doc.id} className='flex items-center text-xs text-muted'>
                        <FontAwesomeIcon icon={faFileAlt} className='mr-2' />
                        <span>{doc.name}</span>
                        {doc.isPrimary && (
                          <span className='ml-2 px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]'>
                            Primary
                          </span>
                        )}
                        <span className='ml-auto'>{doc.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <MissingFieldHint label='Uploaded CV' />
                )}
              </ResumeSection>
            </div>
          ) : (
            <div className='space-y-4'>
              <MetricCard
                label='Messages'
                value={messages.filter((m) => m.type === 'user').length}
                icon={faList}
                iconClass='text-blue-500'
                darkMode={darkMode}
              />
              <MetricCard
                label='Resume uploads'
                value={resumeData.documents.length}
                icon={faFileAlt}
                iconClass='text-green-500'
                darkMode={darkMode}
              />
              <MetricCard
                label='Skills'
                value={resumeData.skills.length}
                icon={faAward}
                iconClass='text-purple-500'
                darkMode={darkMode}
              />
              <MetricCard
                label='Still to complete'
                value={incompleteItems.filter((item) => !item.optional).length}
                icon={faCircleExclamation}
                iconClass='text-amber-500'
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

const IncompleteChecklist = ({ items }) => (
  <div className='mt-3 p-2.5 rounded-lg border border-dashed border-border bg-background'>
    <Text className='text-xs font-medium text-foreground block mb-1.5'>Still to complete</Text>
    <ul className='space-y-1'>
      {items.map((item) => (
        <li key={item.key} className='flex items-center gap-2 text-xs text-muted'>
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              item.optional ? 'bg-muted' : 'bg-amber-500'
            }`}
          />
          <span>{item.label}</span>
          {item.optional && <span className='text-[10px] text-muted'>(optional)</span>}
        </li>
      ))}
    </ul>
  </div>
)

const ResumeSection = ({
  title,
  icon,
  iconClass,
  complete,
  partial,
  partialLabel,
  optional,
  children
}) => (
  <div
    className={`rounded-lg p-3 border ${
      complete ? 'border-border' : 'border-dashed border-border'
    }`}
  >
    <div className='flex items-center justify-between mb-2'>
      <div className='flex items-center'>
        <FontAwesomeIcon icon={icon} className={`mr-2 ${iconClass}`} />
        <Text strong className='text-foreground'>
          {title}
        </Text>
      </div>
      {!complete && !partial && (
        <SectionBadge label={optional ? 'Optional' : 'Missing'} muted={optional} />
      )}
      {partial && partialLabel && <SectionBadge label={partialLabel} partial />}
    </div>
    {children}
  </div>
)

const SectionBadge = ({ label, muted, partial }) => (
  <span
    className={`text-[10px] px-1.5 py-0.5 rounded border ${
      partial
        ? 'border-amber-500/40 text-amber-600 dark:text-amber-400'
        : muted
          ? 'border-border text-muted'
          : 'border-amber-500/40 text-amber-600 dark:text-amber-400'
    }`}
  >
    {label}
  </span>
)

const ContactField = ({ value, label, complete }) =>
  complete ? (
    <span className='text-muted'>{value}</span>
  ) : (
    <span className='text-muted italic opacity-70 border-b border-dashed border-border'>
      {label} not added
    </span>
  )

const MissingFieldHint = ({ label, optional, inline, className = '' }) => (
  <Text
    className={`${inline ? 'inline' : 'block'} text-muted italic opacity-70 ${className}`}
  >
    {label} not added{optional ? ' (optional)' : ''}
  </Text>
)

const MetricCard = ({ label, value, icon, iconClass, darkMode }) => (
  <div
    className='rounded-lg p-3 border border-border'
    style={{ backgroundColor: darkMode ? 'rgb(var(--color-surface))' : 'rgb(var(--color-background))' }}
  >
    <div className='flex items-center justify-between'>
      <div>
        <Text className='text-muted text-xs'>{label}</Text>
        <div className='text-2xl font-bold text-foreground'>{value}</div>
      </div>
      <FontAwesomeIcon icon={icon} className={`${iconClass} text-xl`} />
    </div>
  </div>
)

ResumePreviewPanel.displayName = 'ResumePreviewPanel'

export default ResumePreviewPanel
