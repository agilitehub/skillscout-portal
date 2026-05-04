// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

import React from 'react'
import { BRAND_COLORS } from '../../../core/theme/colors'

/**
 * Lightweight markdown renderer for chat bubbles (no external markdown deps).
 */
export function renderChatMarkdown(text, textColor) {
  if (!text || typeof text !== 'string') return text

  const lines = text.split('\n')
  let inCodeBlock = false
  let codeBlockContent = []

  return lines
    .map((line, lineIndex) => {
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeBlockContent = []
          return null
        }
        inCodeBlock = false
        const codeContent = codeBlockContent.join('\n')
        return (
          <pre
            key={lineIndex}
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '12px 16px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              margin: '12px 0',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {codeContent}
          </pre>
        )
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return null
      }

      if (!line.trim()) {
        return <br key={lineIndex} />
      }

      if (line.startsWith('### ')) {
        return (
          <h3
            key={lineIndex}
            style={{
              color: textColor,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '8px 0 4px 0'
            }}
          >
            {line.substring(4)}
          </h3>
        )
      }

      if (line.startsWith('## ')) {
        return (
          <h2
            key={lineIndex}
            style={{
              color: textColor,
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: '12px 0 6px 0'
            }}
          >
            {line.substring(3)}
          </h2>
        )
      }

      if (line.startsWith('# ')) {
        return (
          <h1
            key={lineIndex}
            style={{
              color: textColor,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '16px 0 8px 0'
            }}
          >
            {line.substring(2)}
          </h1>
        )
      }

      if (line.includes('`')) {
        const parts = line.split('`')
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return (
                  <code
                    key={partIndex}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {part}
                  </code>
                )
              }
              return part
            })}
          </span>
        )
      }

      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return <strong key={partIndex}>{part}</strong>
              }
              return part
            })}
          </span>
        )
      }

      if (line.includes('*') && !line.includes('**')) {
        const parts = line.split('*')
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return <em key={partIndex}>{part}</em>
              }
              return part
            })}
          </span>
        )
      }

      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      if (linkRegex.test(line)) {
        linkRegex.lastIndex = 0
        const parts = []
        let lastIndex = 0
        let match

        while ((match = linkRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index))
          }

          parts.push(
            <a
              key={match.index}
              href={match[2]}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: textColor === BRAND_COLORS.white ? BRAND_COLORS.lightBlueAccent : BRAND_COLORS.mediumBlue,
                textDecoration: 'underline'
              }}
            >
              {match[1]}
            </a>
          )

          lastIndex = match.index + match[0].length
        }

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex))
        }

        return <span key={lineIndex}>{parts}</span>
      }

      if (line.match(/^[\s]*[-*+]\s/)) {
        return (
          <div
            key={lineIndex}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              margin: '4px 0'
            }}
          >
            <span
              style={{
                marginRight: '8px',
                color: textColor,
                fontSize: '1.2rem',
                lineHeight: '1.4'
              }}
            >
              •
            </span>
            <span>{line.replace(/^[\s]*[-*+]\s/, '')}</span>
          </div>
        )
      }

      if (line.match(/^[\s]*\d+\.\s/)) {
        const numMatch = line.match(/^[\s]*(\d+)\.\s/)
        return (
          <div
            key={lineIndex}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              margin: '4px 0'
            }}
          >
            <span
              style={{
                marginRight: '8px',
                color: textColor,
                fontWeight: 'bold'
              }}
            >
              {numMatch[1]}.
            </span>
            <span>{line.replace(/^[\s]*\d+\.\s/, '')}</span>
          </div>
        )
      }

      return <span key={lineIndex}>{line}</span>
    })
    .filter(Boolean)
}
