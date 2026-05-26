// Global Instructions Rule Applied!

import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const PDF_MAX_PAGES = 15

/**
 * @param {File} file
 * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
 */
export async function extractTextFromCvFile(file) {
  if (!file || !(file instanceof File)) {
    return { success: false, error: 'Invalid file' }
  }

  const type = file.type
  const name = (file.name || '').toLowerCase()

  try {
    if (type === 'text/plain' || name.endsWith('.txt')) {
      const text = await file.text()
      return text.trim() ? { success: true, text } : { success: false, error: 'The text file is empty' }
    }

    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      return await extractTextFromPdf(file)
    }

    if (
      type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      name.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file)
    }

    if (type === 'application/msword' || name.endsWith('.doc')) {
      return {
        success: false,
        error: 'Legacy .doc files are not supported. Please convert to PDF or DOCX.'
      }
    }

    return { success: false, error: 'Unsupported file type for CV extraction' }
  } catch (error) {
    console.error('extractTextFromCvFile error:', error)
    return { success: false, error: 'Could not read text from this file' }
  }
}

async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const pageCount = Math.min(pdf.numPages, PDF_MAX_PAGES)
  const parts = []

  for (let i = 1; i <= pageCount; i += 1) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    parts.push(pageText)
  }

  const text = parts.join('\n').trim()
  return text ? { success: true, text } : { success: false, error: 'No readable text found in this PDF' }
}

async function extractTextFromDocx(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  const text = (result.value || '').trim()
  return text ? { success: true, text } : { success: false, error: 'No readable text found in this document' }
}
