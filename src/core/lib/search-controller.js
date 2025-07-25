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
        model: 'text-embedding-ada-002'
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
      matchThreshold = 0.7,
      matchCount = 20,
      sourceTables = null, // Filter by specific source tables
      userId = null // Filter by user if provided
    } = options

    // Build the query using the RPC function
    let { data, error } = await supabase.rpc('match_search_index', {
      query_embedding: embedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    })

    // If the main function fails, try the simpler version
    if (error) {
      console.log('Main function failed, trying simpler version...')
      const { data: simpleData, error: simpleError } = await supabase.rpc('match_search_index_simple', {
        query_embedding: embedding,
        match_threshold: matchThreshold,
        match_count: matchCount
      })

      if (simpleError) {
        console.error('Both functions failed:', simpleError)
        // Fall back to direct query
        const { data: directData, error: directError } = await supabase
          .from('search_index')
          .select('source_table, source_id, title, content, metadata')
          .not('embedding', 'is', null)
          .limit(matchCount)

        if (directError) {
          return {
            success: false,
            error: directError.message,
            data: []
          }
        }

        // For direct query, we can't calculate similarity, so we'll use a default
        const directResults = directData.map((item) => ({
          ...item,
          similarity: 0.5 // Default similarity for direct query results
        }))

        return {
          success: true,
          data: categorizeSearchResults(directResults),
          error: null
        }
      }

      // Use the simpler function results
      data = simpleData
      error = simpleError
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
  const categories = {
    assessments: {
      category: 'Assessments',
      items: []
    },
    assessment_questions: {
      category: 'Assessment Questions',
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

  // Group results by source table
  results.forEach((result) => {
    const category = categories[result.source_table]
    if (category) {
      category.items.push({
        id: result.source_id,
        title: result.title || 'Untitled',
        subtitle: result.content ? result.content.substring(0, 100) + '...' : 'No content',
        similarity: result.similarity,
        sourceTable: result.source_table,
        metadata: result.metadata,
        // Add icon based on source table
        icon: getIconForSourceTable(result.source_table)
      })
    }
  })

  // Return only categories that have items
  return Object.values(categories).filter((category) => category.items.length > 0)
}

/**
 * Get appropriate icon for source table
 * @param {string} sourceTable - Source table name
 * @returns {string} Icon name
 */
const getIconForSourceTable = (sourceTable) => {
  const iconMap = {
    assessments: 'faUserTie',
    assessment_questions: 'faQuestionCircle',
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
 * Get search suggestions based on recent searches and popular terms
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

  // Add popular searches
  const popularSearches = [
    'Software Engineer',
    'Product Manager',
    'Frontend Developer',
    'Data Analyst',
    'Remote Jobs',
    'Technical Assessment',
    'Leadership Skills',
    'JavaScript Proficiency',
    'Communication Skills',
    'Problem Solving'
  ]

  suggestions.push({
    category: 'Popular Searches',
    items: popularSearches.map((search, index) => ({
      id: `popular-${index}`,
      title: search,
      subtitle: 'Popular search',
      type: 'popular'
    }))
  })

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
