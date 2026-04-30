// Global Instructions Rule Applied!
import {
  performVectorSearch,
  searchWithFallback,
  getSearchSuggestions,
  saveToRecentSearches,
  clearRecentSearches
} from './search-controller'

/**
 * Simple test suite for search controller functionality
 * This is a basic test to verify the search functions work correctly
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock fetch for OpenAI API
global.fetch = jest.fn()

describe('Search Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSearchSuggestions', () => {
    it('should return suggestions with recent and popular searches', () => {
      const recentSearches = [
        { query: 'Software Engineer', timestamp: Date.now() },
        { query: 'Product Manager', timestamp: Date.now() }
      ]

      const suggestions = getSearchSuggestions(recentSearches)

      expect(suggestions).toHaveLength(2)
      expect(suggestions[0].category).toBe('Recent Searches')
      expect(suggestions[1].category).toBe('Popular Searches')
      expect(suggestions[0].items).toHaveLength(2)
      expect(suggestions[1].items).toHaveLength(10)
    })

    it('should return only popular searches when no recent searches', () => {
      const suggestions = getSearchSuggestions([])

      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].category).toBe('Popular Searches')
    })
  })

  describe('saveToRecentSearches', () => {
    it('should save search term to recent searches', () => {
      const recentSearches = [{ query: 'Software Engineer', timestamp: Date.now() }]

      const updated = saveToRecentSearches('Product Manager', recentSearches)

      expect(updated).toHaveLength(2)
      expect(updated[0].query).toBe('Product Manager')
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should not save empty search terms', () => {
      const recentSearches = [{ query: 'Software Engineer', timestamp: Date.now() }]

      const updated = saveToRecentSearches('', recentSearches)

      expect(updated).toEqual(recentSearches)
    })

    it('should remove duplicates and keep only last 10 searches', () => {
      const recentSearches = Array.from({ length: 15 }, (_, i) => ({
        query: `Search ${i}`,
        timestamp: Date.now()
      }))

      const updated = saveToRecentSearches('New Search', recentSearches)

      expect(updated).toHaveLength(10)
      expect(updated[0].query).toBe('New Search')
    })
  })

  describe('clearRecentSearches', () => {
    it('should clear recent searches from localStorage', () => {
      clearRecentSearches()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('skillscout_recent_searches')
    })
  })

  describe('performVectorSearch', () => {
    it('should return error when search term is empty', async () => {
      const result = await performVectorSearch('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Search term is required')
    })

    it('should return error when search term is not a string', async () => {
      const result = await performVectorSearch(null)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Search term is required')
    })
  })

  describe('searchWithFallback', () => {
    it('should return error when search term is empty', async () => {
      const result = await searchWithFallback('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Search term is required')
    })
  })
})

// Export for manual testing
export const testSearchController = {
  getSearchSuggestions,
  saveToRecentSearches,
  clearRecentSearches
}
