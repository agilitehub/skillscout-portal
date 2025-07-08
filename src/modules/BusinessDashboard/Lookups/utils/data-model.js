// Global Instructions Rule Applied!

/**
 * Lookups Data Model
 * Handles validation and transformation utilities for lookup data
 */

/**
 * Validate lookup data
 * @param {Object} lookupData - Lookup data to validate
 * @returns {Object} Validation result
 */
export const validateLookup = (lookupData) => {
  const errors = []

  // Required fields validation
  if (!lookupData.profileKey || typeof lookupData.profileKey !== 'string' || !lookupData.profileKey.trim()) {
    errors.push('Category is required and must be a non-empty string')
  }

  // Category length validation
  if (lookupData.profileKey && lookupData.profileKey.length > 100) {
    errors.push('Category must be 100 characters or less')
  }

  // Label-value pairs validation
  if (!lookupData.labelValuePairs || !Array.isArray(lookupData.labelValuePairs)) {
    errors.push('Label-value pairs are required and must be an array')
  } else {
    const validPairs = lookupData.labelValuePairs.filter(
      (pair) => pair.label && typeof pair.label === 'string' && pair.label.trim()
    )

    if (validPairs.length === 0) {
      errors.push('At least one valid label-value pair is required')
    }

    // Validate individual pairs
    lookupData.labelValuePairs.forEach((pair, index) => {
      if (!pair.label || typeof pair.label !== 'string' || !pair.label.trim()) {
        errors.push(`Label for pair ${index + 1} is required and must be a non-empty string`)
      } else if (pair.label.length > 255) {
        errors.push(`Label for pair ${index + 1} must be 255 characters or less`)
      }

      if (pair.value && typeof pair.value !== 'string') {
        errors.push(`Value for pair ${index + 1} must be a string`)
      } else if (pair.value && pair.value.length > 255) {
        errors.push(`Value for pair ${index + 1} must be 255 characters or less`)
      }
    })

    // Check for duplicate labels
    const labels = validPairs.map((pair) => pair.label.trim().toLowerCase())
    const duplicateLabels = labels.filter((label, index) => labels.indexOf(label) !== index)
    if (duplicateLabels.length > 0) {
      errors.push('Duplicate labels are not allowed')
    }

    // Check for duplicate values (only if values are provided)
    const values = validPairs
      .filter((pair) => pair.value && pair.value.trim())
      .map((pair) => pair.value.trim().toLowerCase())
    const duplicateValues = values.filter((value, index) => values.indexOf(value) !== index)
    if (duplicateValues.length > 0) {
      errors.push('Duplicate values are not allowed')
    }
  }

  // Active status validation
  if (lookupData.isActive !== undefined && typeof lookupData.isActive !== 'boolean') {
    errors.push('Active status must be a boolean value')
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Sanitize lookup data
 * @param {Object} lookupData - Lookup data to sanitize
 * @returns {Object} Sanitized data
 */
export const sanitizeLookup = (lookupData) => {
  const sanitized = { ...lookupData }

  // Sanitize category
  if (sanitized.profileKey && typeof sanitized.profileKey === 'string') {
    sanitized.profileKey = sanitized.profileKey.trim()
  }

  // Sanitize group name
  if (sanitized.groupName && typeof sanitized.groupName === 'string') {
    sanitized.groupName = sanitized.groupName.trim()
  }

  // Sanitize label-value pairs
  if (sanitized.labelValuePairs && Array.isArray(sanitized.labelValuePairs)) {
    sanitized.labelValuePairs = sanitized.labelValuePairs
      .map((pair) => ({
        ...pair,
        label: typeof pair.label === 'string' ? pair.label.trim() : '',
        value: typeof pair.value === 'string' ? pair.value.trim() : ''
      }))
      .filter((pair) => pair.label) // Remove pairs without labels
  }

  // Ensure solutions is an array
  if (!Array.isArray(sanitized.solutions)) {
    sanitized.solutions = []
  }

  // Set default active status
  if (sanitized.isActive === undefined) {
    sanitized.isActive = true
  }

  return sanitized
}

/**
 * Generate search keywords for a lookup
 * @param {Object} lookupData - Lookup data
 * @returns {string} Space-separated search keywords
 */
export const generateSearchKeywords = (lookupData) => {
  const keywords = new Set()

  // Add category
  if (lookupData.profileKey) {
    keywords.add(lookupData.profileKey.toLowerCase())
  }

  // Add group name
  if (lookupData.groupName) {
    keywords.add(lookupData.groupName.toLowerCase())
  }

  // Add labels and values
  if (lookupData.labelValuePairs && Array.isArray(lookupData.labelValuePairs)) {
    lookupData.labelValuePairs.forEach((pair) => {
      if (pair.label) {
        keywords.add(pair.label.toLowerCase())
      }
      if (pair.value) {
        keywords.add(pair.value.toLowerCase())
      }
    })
  }

  return Array.from(keywords).join(' ')
}

/**
 * Default lookup structure
 */
export const createDefaultLookup = () => ({
  profileKey: '',
  groupName: '',
  solutions: [],
  isActive: true,
  labelValuePairs: [{ label: '', value: '', sortOrder: 1 }]
})

/**
 * Transform lookup for export
 * @param {Object} lookupData - Lookup data
 * @returns {Object} Export-ready data
 */
export const transformForExport = (lookupData) => ({
  category: lookupData.profileKey,
  isActive: lookupData.isActive,
  items:
    lookupData.labelValuePairs?.map((pair) => ({
      label: pair.label,
      value: pair.value,
      sortOrder: pair.sortOrder
    })) || []
})

/**
 * Transform imported data to lookup format
 * @param {Object} importedData - Imported data
 * @returns {Object} Lookup-formatted data
 */
export const transformFromImport = (importedData) => ({
  profileKey: importedData.category || '',
  groupName: '',
  solutions: [],
  isActive: importedData.isActive !== undefined ? importedData.isActive : true,
  labelValuePairs: importedData.items?.map((item, index) => ({
    label: item.label || '',
    value: item.value || '',
    sortOrder: item.sortOrder || index + 1
  })) || [{ label: '', value: '', sortOrder: 1 }]
})

/**
 * Validate import data
 * @param {Object} importedData - Data to validate for import
 * @returns {Object} Validation result
 */
export const validateImportData = (importedData) => {
  const errors = []

  if (!importedData || typeof importedData !== 'object') {
    errors.push('Invalid data format')
    return { success: false, errors }
  }

  if (!importedData.category || typeof importedData.category !== 'string') {
    errors.push('Category is required and must be a string')
  }

  if (!importedData.items || !Array.isArray(importedData.items)) {
    errors.push('Items array is required')
  } else if (importedData.items.length === 0) {
    errors.push('At least one item is required')
  } else {
    importedData.items.forEach((item, index) => {
      if (!item.label || typeof item.label !== 'string') {
        errors.push(`Item ${index + 1}: Label is required and must be a string`)
      }
    })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

/**
 * Get lookup statistics
 * @param {Array} lookups - Array of lookups
 * @returns {Object} Statistics
 */
export const calculateLookupStats = (lookups) => {
  if (!Array.isArray(lookups)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      totalItems: 0,
      averageItemsPerLookup: 0
    }
  }

  const stats = {
    total: lookups.length,
    active: lookups.filter((lookup) => lookup.isActive).length,
    inactive: lookups.filter((lookup) => !lookup.isActive).length,
    totalItems: 0,
    averageItemsPerLookup: 0
  }

  stats.totalItems = lookups.reduce((sum, lookup) => {
    return sum + (lookup.labelValuePairs?.length || 0)
  }, 0)

  stats.averageItemsPerLookup = stats.total > 0 ? Math.round((stats.totalItems / stats.total) * 100) / 100 : 0

  return stats
}
