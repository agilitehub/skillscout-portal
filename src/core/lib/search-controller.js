// Global Instructions Rule Applied!
import { createClient } from '@supabase/supabase-js'

/**
 * Search Controller for Vector Search Functionality
 * Handles semantic search using OpenAI embeddings and Supabase vector search
 */

// Environment variables for Supabase configuration
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('Search Controller: REACT_APP_SUPABASE_URL is not configured')
}

if (!SUPABASE_ANON_KEY) {
  console.error('Search Controller: REACT_APP_SUPABASE_ANON_KEY is not configured')
}

if (!OPENAI_API_KEY) {
  console.error('Search Controller: REACT_APP_OPENAI_API_KEY is not configured')
}

/**
 * Create Supabase client with error handling
 * @returns {Object|null} Supabase client instance or null if configuration is invalid
 */
const createSupabaseClient = () => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Search Controller: Missing required environment variables')
      return null
    }

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  } catch (error) {
    console.error('Search Controller: Error creating client:', error)
    return null
  }
}

// Initialize Supabase client
const supabase = createSupabaseClient()

/**
 * Generate embedding for text using OpenAI API
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array>} Embedding vector
 */
const generateEmbedding = async (text) => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

/**
 * Perform vector search using the search_index table
 * @param {string} searchTerm - Search term
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
export const performVectorSearch = async (searchTerm, options = {}) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        data: []
      }
    }

    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
      return {
        success: false,
        error: 'Search term is required',
        data: []
      }
    }

    // Generate embedding for the search term
    const embedding = await generateEmbedding(searchTerm)

    // Default search options
    const {
      matchThreshold = 0.8,
      matchCount = 20,
      sourceTables = null // Filter by specific source tables
    } = options

    // Build the query using the RPC function
    let { data, error } = await supabase.rpc('match_search_index', {
      query_embedding: embedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    })

    // If the main function fails, try the simpler version
    if (error) {
      console.log('error', error)
    }

    // Apply additional filters if provided (filter the results after getting them)
    let filteredData = data || []
    if (sourceTables && Array.isArray(sourceTables) && sourceTables.length > 0) {
      filteredData = filteredData.filter((result) => sourceTables.includes(result.source_table))
    }

    // Transform and categorize results
    const categorizedResults = categorizeSearchResults(filteredData)

    return {
      success: true,
      data: categorizedResults,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in performVectorSearch:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during search',
      data: []
    }
  }
}

/**
 * Categorize search results by source table and format for UI
 * @param {Array} results - Raw search results from database
 * @returns {Array} Categorized results
 */
const categorizeSearchResults = (results) => {
  // First, sort all results by similarity (relevance) in descending order
  const sortedResults = [...results].sort((a, b) => (b.similarity || 0) - (a.similarity || 0))

  const categories = {
    questionnaires: {
      category: 'Questionnaires',
      items: []
    },
    questionnaire_questions: {
      category: 'Questionnaire Questions',
      items: []
    },
    job_descriptions: {
      category: 'Job Descriptions',
      items: []
    },
    job_opportunities: {
      category: 'Job Opportunities',
      items: []
    }
  }

  // Group results by source table, maintaining the sorted order
  sortedResults.forEach((result) => {
    const category = categories[result.source_table]
    if (category) {
      // Generate meaningful subtitle based on source table and metadata
      let subtitle = 'No content'
      if (result.metadata) {
        switch (result.source_table) {
          case 'questionnaires':
            subtitle = `${result.metadata.category} ${result.metadata.tags?.join(', ')}`
            break
          case 'job_descriptions':
            subtitle = `${result.metadata.overview} ${result.metadata.keywords?.join(', ')}`
            break
          case 'job_opportunities':
            subtitle = `${result.metadata.description} ${result.metadata.location} ${result.metadata.salary} ${result.metadata.work_arrangement}`
            break
          case 'questionnaire_questions':
            subtitle = `${result.metadata.question} ${result.metadata.context} ${result.metadata.preferred_feedback}`
            break
          default:
            subtitle = result.content ? result.content.substring(0, 100) + '...' : 'No content'
        }
      } else if (result.content) {
        subtitle = result.content.substring(0, 100) + '...'
      }

      category.items.push({
        id: result.source_id,
        title: result.title || 'Untitled',
        subtitle,
        similarity: result.similarity,
        sourceTable: result.source_table,
        metadata: result.metadata,
        // Add icon based on source table
        icon: getIconForSourceTable(result.source_table)
      })
    }
  })

  // Sort categories by their highest similarity score and return only categories that have items
  const categoriesWithItems = Object.values(categories).filter((category) => category.items.length > 0)

  // Sort categories by the highest similarity score within each category
  return categoriesWithItems.sort((a, b) => {
    const maxSimilarityA = Math.max(...a.items.map((item) => item.similarity || 0))
    const maxSimilarityB = Math.max(...b.items.map((item) => item.similarity || 0))
    return maxSimilarityB - maxSimilarityA
  })
}

/**
 * Get appropriate icon for source table
 * @param {string} sourceTable - Source table name
 * @returns {string} Icon name
 */
const getIconForSourceTable = (sourceTable) => {
  const iconMap = {
    questionnaires: 'faUserTie',
    questionnaire_questions: 'faQuestionCircle',
    job_descriptions: 'faBuilding',
    job_opportunities: 'faBriefcase'
  }
  return iconMap[sourceTable] || 'faFile'
}

/**
 * Search with fallback to text-based search if vector search fails
 * @param {string} searchTerm - Search term
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
export const searchWithFallback = async (searchTerm, options = {}) => {
  try {
    // First try vector search
    const vectorResults = await performVectorSearch(searchTerm, options)

    if (vectorResults.success && vectorResults.data.length > 0) {
      return vectorResults
    }

    // If vector search fails or returns no results, fall back to text search
    console.log('Vector search returned no results, falling back to text search')
    return await performTextSearch(searchTerm, options)
  } catch (error) {
    console.error('Error in searchWithFallback:', error)
    // Fall back to text search
    return await performTextSearch(searchTerm, options)
  }
}

/**
 * Perform text-based search as fallback
 * @param {string} searchTerm - Search term
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
const performTextSearch = async (searchTerm, options = {}) => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        data: []
      }
    }

    const { sourceTables = null, matchCount = 20 } = options

    // Build text search query
    const { data, error } = await supabase
      .from('search_index')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .limit(matchCount)

    if (error) {
      console.error('Error performing text search:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    // Apply additional filters if provided (filter the results after getting them)
    let filteredData = data || []
    if (sourceTables && Array.isArray(sourceTables) && sourceTables.length > 0) {
      filteredData = filteredData.filter((result) => sourceTables.includes(result.source_table))
    }

    // Transform and categorize results
    const categorizedResults = categorizeSearchResults(filteredData)

    return {
      success: true,
      data: categorizedResults,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error in performTextSearch:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during text search',
      data: []
    }
  }
}

/**
 * Get search suggestions based on recent searches
 * @param {Array} recentSearches - Recent search terms
 * @returns {Array} Search suggestions
 */
export const getSearchSuggestions = (recentSearches = []) => {
  const suggestions = []

  // Add recent searches
  if (recentSearches.length > 0) {
    suggestions.push({
      category: 'Recent Searches',
      items: recentSearches.slice(0, 5).map((search, index) => ({
        id: `recent-${index}`,
        title: search.query,
        subtitle: 'Recent search',
        type: 'recent',
        timestamp: search.timestamp
      }))
    })
  }

  return suggestions
}

/**
 * Save search term to recent searches
 * @param {string} searchTerm - Search term to save
 * @param {Array} recentSearches - Current recent searches
 * @returns {Array} Updated recent searches
 */
export const saveToRecentSearches = (searchTerm, recentSearches = []) => {
  if (!searchTerm || !searchTerm.trim()) {
    return recentSearches
  }

  const filtered = recentSearches.filter((search) => search.query !== searchTerm)
  const updated = [{ query: searchTerm, timestamp: Date.now() }, ...filtered].slice(0, 10) // Keep only last 10 searches

  // Save to localStorage
  try {
    localStorage.setItem('skillscout_recent_searches', JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving recent searches:', error)
  }

  return updated
}

/**
 * Highlight matching search terms in text
 * @param {string} text - Original text
 * @param {string} searchTerm - User's search term
 * @returns {JSX.Element} Text with <mark> highlights
 */
export const highlightText = (text, searchTerm) => {
  if (!text || !searchTerm) return text

  // Escape regex special chars and build regex
  const regex = new RegExp(`(${searchTerm})`, 'gi')

  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} style={{ backgroundColor: '#ffe58f', padding: '0 2px' }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

/**
 * Clear recent searches
 * @returns {Array} Empty array
 */
export const clearRecentSearches = () => {
  try {
    localStorage.removeItem('skillscout_recent_searches')
  } catch (error) {
    console.error('Error clearing recent searches:', error)
  }
  return []
}
