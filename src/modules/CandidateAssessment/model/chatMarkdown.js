// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React from 'react'
import { BRAND_COLORS } from '../../../core/theme/colors'

const HEADING_CLASSES = {
  h1: 'block text-lg font-bold mt-3 mb-1.5',
  h2: 'block text-base font-bold mt-2.5 mb-1',
  h3: 'block text-sm font-bold mt-2 mb-0.5'
}

/**
 * Inline markdown: bold, italic, code, links.
 * @param {string} text
 * @param {string} textColor
 */
function renderInlineMarkdown(text, textColor) {
  if (!text) return null

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const segments = []
  let cursor = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, match.index) })
    }
    segments.push({ type: 'link', label: match[1], href: match[2] })
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) })
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', value: text })
  }

  return segments.map((segment, segmentIndex) => {
    if (segment.type === 'link') {
      return (
        <a
          key={`link-${segmentIndex}`}
          href={segment.href}
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
          style={{
            color: textColor === BRAND_COLORS.white ? BRAND_COLORS.lightBlueAccent : BRAND_COLORS.mediumBlue
          }}
        >
          {segment.label}
        </a>
      )
    }

    return renderStyledText(segment.value, `seg-${segmentIndex}`)
  })
}

/**
 * Bold, italic, and inline code within a text segment.
 * @param {string} text
 * @param {string} keyPrefix
 */
function renderStyledText(text, keyPrefix) {
  if (!text.includes('**') && !text.includes('`') && !text.includes('*')) {
    return text
  }

  const parts = []
  let remaining = text
  let partIndex = 0

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/`([^`]+)`/)
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    const italicMatch = remaining.match(/\*([^*]+)\*/)

    const candidates = [
      codeMatch ? { type: 'code', match: codeMatch } : null,
      boldMatch ? { type: 'bold', match: boldMatch } : null,
      italicMatch && italicMatch.index !== boldMatch?.index ? { type: 'italic', match: italicMatch } : null
    ]
      .filter(Boolean)
      .sort((a, b) => a.match.index - b.match.index)

    if (candidates.length === 0) {
      parts.push(remaining)
      break
    }

    const next = candidates[0]
    const { index } = next.match
    const key = `${keyPrefix}-${partIndex++}`

    if (index > 0) {
      parts.push(remaining.slice(0, index))
    }

    if (next.type === 'code') {
      parts.push(
        <code
          key={key}
          className='rounded px-1.5 py-0.5 font-mono text-[0.85em] bg-black/10 border border-black/10'
        >
          {next.match[1]}
        </code>
      )
    } else if (next.type === 'bold') {
      parts.push(<strong key={key}>{next.match[1]}</strong>)
    } else {
      parts.push(<em key={key}>{next.match[1]}</em>)
    }

    remaining = remaining.slice(index + next.match[0].length)
  }

  return parts
}

/**
 * Lightweight markdown renderer for chat bubbles (no external markdown deps).
 * @param {string} text
 * @param {string} textColor
 */
export function renderChatMarkdown(text, textColor) {
  if (!text || typeof text !== 'string') return text

  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const elements = []
  let inCodeBlock = false
  let codeBlockContent = []
  let listBuffer = null

  const flushList = () => {
    if (!listBuffer || listBuffer.items.length === 0) return

    const ListTag = listBuffer.ordered ? 'ol' : 'ul'
    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        className={`my-1.5 pl-5 ${listBuffer.ordered ? 'list-decimal' : 'list-disc'} space-y-0.5`}
        style={{ color: textColor }}
      >
        {listBuffer.items.map((item, itemIndex) => (
          <li key={itemIndex} className='leading-relaxed'>
            {renderInlineMarkdown(item, textColor)}
          </li>
        ))}
      </ListTag>
    )
    listBuffer = null
  }

  lines.forEach((line, lineIndex) => {
    if (line.trim().startsWith('```')) {
      flushList()

      if (!inCodeBlock) {
        inCodeBlock = true
        codeBlockContent = []
        return
      }

      inCodeBlock = false
      elements.push(
        <pre
          key={`code-${lineIndex}`}
          className='my-2 overflow-x-auto rounded-md border border-black/10 bg-black/10 px-4 py-3 font-mono text-sm whitespace-pre-wrap'
        >
          {codeBlockContent.join('\n')}
        </pre>
      )
      return
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      return
    }

    if (!line.trim()) {
      flushList()
      elements.push(<div key={`space-${lineIndex}`} className='h-2' aria-hidden='true' />)
      return
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      flushList()
      const level = headingMatch[1].length
      const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
      const className = level === 1 ? HEADING_CLASSES.h1 : level === 2 ? HEADING_CLASSES.h2 : HEADING_CLASSES.h3
      elements.push(
        <Tag key={`heading-${lineIndex}`} className={className} style={{ color: textColor }}>
          {renderInlineMarkdown(headingMatch[2], textColor)}
        </Tag>
      )
      return
    }

    const bulletMatch = line.match(/^[\s]*[-*+•]\s+(.+)$/)
    if (bulletMatch) {
      if (listBuffer?.ordered) {
        flushList()
      }
      if (!listBuffer) {
        listBuffer = { ordered: false, items: [] }
      }
      listBuffer.items.push(bulletMatch[1])
      return
    }

    const orderedMatch = line.match(/^[\s]*(\d+)\.\s+(.+)$/)
    if (orderedMatch) {
      if (listBuffer && !listBuffer.ordered) {
        flushList()
      }
      if (!listBuffer) {
        listBuffer = { ordered: true, items: [] }
      }
      listBuffer.items.push(orderedMatch[2])
      return
    }

    flushList()
    elements.push(
      <p key={`p-${lineIndex}`} className='block leading-relaxed my-0.5' style={{ color: textColor }}>
        {renderInlineMarkdown(line, textColor)}
      </p>
    )
  })

  flushList()

  if (inCodeBlock && codeBlockContent.length > 0) {
    elements.push(
      <pre
        key='code-unclosed'
        className='my-2 overflow-x-auto rounded-md border border-black/10 bg-black/10 px-4 py-3 font-mono text-sm whitespace-pre-wrap'
      >
        {codeBlockContent.join('\n')}
      </pre>
    )
  }

  return <div className='flex flex-col gap-0.5'>{elements}</div>
}
