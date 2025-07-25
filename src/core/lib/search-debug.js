// Global Instructions Rule Applied!
/**
 * Search Debug Utilities
 * Helper functions to test and debug vector search functionality
 */

import {
  performVectorSearch,
  searchWithFallback,
  diagnoseSearch,
  testSimilarityThresholds,
  diagnoseSearchIndex,
  testRPCFunctions,
  regenerateAllEmbeddings,
  testEmbeddingGeneration
} from './search-controller.js'

/**
 * Test search functionality with comprehensive logging
 * @param {string} searchTerm - Search term to test
 */
export const testSearch = async (searchTerm) => {
  console.log(`🔍 Testing search for: "${searchTerm}"`)
  console.log('='.repeat(50))

  try {
    // Test 1: Basic vector search
    console.log('📊 Test 1: Basic Vector Search')
    const vectorResult = await performVectorSearch(searchTerm)
    console.log('Vector search result:', vectorResult)
    console.log('')

    // Test 2: Search with fallback
    console.log('📊 Test 2: Search with Fallback')
    const fallbackResult = await searchWithFallback(searchTerm)
    console.log('Fallback search result:', fallbackResult)
    console.log('')

    // Test 3: Different thresholds
    console.log('📊 Test 3: Testing Different Thresholds')
    const thresholdResults = await testSimilarityThresholds(searchTerm)
    console.log('Threshold results:', thresholdResults)
    console.log('')

    // Test 4: Comprehensive diagnostic
    console.log('📊 Test 4: Comprehensive Diagnostic')
    const diagnostic = await diagnoseSearch(searchTerm)
    console.log('Diagnostic result:', diagnostic)
    console.log('')

    return {
      vectorResult,
      fallbackResult,
      thresholdResults,
      diagnostic
    }
  } catch (error) {
    console.error('❌ Search test failed:', error)
    return { error: error.message }
  }
}

/**
 * Quick test function for browser console
 * Usage: testSearchQuick('app')
 */
export const testSearchQuick = async (searchTerm) => {
  console.log(`🔍 Quick test for: "${searchTerm}"`)

  const result = await performVectorSearch(searchTerm, { matchThreshold: 0.1 })
  console.log('Result:', result)

  if (result.data.length === 0) {
    console.log('⚠️ No results found. Running diagnostic...')
    const diagnostic = await diagnoseSearch(searchTerm)
    console.log('Diagnostic:', diagnostic)
  }

  return result
}

/**
 * Test search index table status
 */
export const testSearchIndex = async () => {
  console.log('🔍 Testing Search Index Table')
  console.log('='.repeat(50))

  const status = await diagnoseSearchIndex()
  console.log('Search index status:', status)

  return status
}

/**
 * Test with multiple search terms
 * @param {Array} searchTerms - Array of search terms to test
 */
export const testMultipleTerms = async (searchTerms = ['app', 'software', 'developer', 'test']) => {
  console.log('🔍 Testing Multiple Search Terms')
  console.log('='.repeat(50))

  const results = {}

  for (const term of searchTerms) {
    console.log(`\n📊 Testing: "${term}"`)
    results[term] = await performVectorSearch(term, { matchThreshold: 0.1 })
  }

  console.log('All results:', results)
  return results
}

/**
 * Test RPC functions to diagnose vector search issues
 * @param {string} searchTerm - Search term to test
 */
export const testRPC = async (searchTerm) => {
  console.log(`🔍 Testing RPC Functions for: "${searchTerm}"`)
  console.log('='.repeat(50))

  const results = await testRPCFunctions(searchTerm)
  console.log('RPC Test Results:', results)

  return results
}

/**
 * Test embedding generation for a single text
 * @param {string} text - Text to test
 */
export const testEmbedding = async (text) => {
  console.log(`🧪 Testing embedding generation for: "${text}"`)

  const result = await testEmbeddingGeneration(text)
  console.log('Embedding test result:', result)

  return result
}

/**
 * Regenerate all embeddings in the search_index table
 * This fixes the dimension mismatch issue
 */
export const regenerateEmbeddings = async () => {
  console.log('🔄 Starting embedding regeneration...')
  console.log('⚠️ This will update all embeddings in the search_index table')

  const result = await regenerateAllEmbeddings()
  console.log('Regeneration result:', result)

  return result
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.testSearch = testSearch
  window.testSearchQuick = testSearchQuick
  window.testSearchIndex = testSearchIndex
  window.testMultipleTerms = testMultipleTerms
  window.testRPC = testRPC
  window.testEmbedding = testEmbedding
  window.regenerateEmbeddings = regenerateEmbeddings
}
