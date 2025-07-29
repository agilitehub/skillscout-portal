# Enhanced Search Functionality

## Overview

The search functionality in the Header component has been enhanced to use vector search with OpenAI embeddings and Supabase's vector search capabilities. This provides semantic search across questionnaires, questionnaire questions, job descriptions, and job opportunities.

## Features

### Vector Search

- **Semantic Search**: Uses OpenAI embeddings to understand search intent
- **Fallback to Text Search**: If vector search fails, falls back to traditional text search
- **Debounced Input**: Prevents excessive API calls with 300ms debounce
- **Loading States**: Visual feedback during search operations

### Search Categories

- **Questionnaires**: Technical and behavioral questionnaires
- **Questionnaire Questions**: Individual questions within questionnaires
- **Job Descriptions**: Detailed job postings
- **Job Opportunities**: Job listings and opportunities

### User Experience

- **Recent Searches**: Automatically saves and displays recent search terms
- **Popular Searches**: Predefined popular search terms
- **Smart Navigation**: Clicking results navigates to the appropriate page
- **Dark Mode Support**: Fully compatible with theme switching

## Technical Implementation

### Search Controller (`src/core/lib/search-controller.js`)

#### Key Functions:

- `performVectorSearch()`: Performs semantic search using embeddings
- `searchWithFallback()`: Vector search with text search fallback
- `getSearchSuggestions()`: Returns recent and popular searches
- `saveToRecentSearches()`: Manages search history
- `clearRecentSearches()`: Clears search history

#### Vector Search Process:

1. Generate embedding for search term using OpenAI API
2. Query Supabase `search_index` table using `match_search_index` function
3. Categorize and format results for UI display
4. Fall back to text search if vector search fails

### Database Schema

The search functionality relies on the `search_index` table:

```sql
create table public.search_index (
  id uuid not null default gen_random_uuid(),
  source_table text not null,
  source_id uuid not null,
  title text null,
  content text null,
  metadata jsonb null,
  embedding public.vector null,
  constraint search_index_pkey primary key (id)
);
```

### Vector Search Function

```sql
create or replace function match_search_index (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  source_table text,
  source_id uuid,
  title text,
  content text,
  similarity float,
  metadata jsonb
)
```

## Environment Variables Required

```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

## Usage

### In Header Component

The search functionality is automatically available in the header when a user is logged in. Users can:

1. **Type to Search**: Start typing to trigger semantic search
2. **View Suggestions**: See recent and popular searches when input is empty
3. **Click Results**: Navigate directly to the selected item
4. **Clear History**: Remove recent searches if needed

### Search Options

The search supports various options:

```javascript
const searchResults = await searchWithFallback(searchTerm, {
  matchThreshold: 0.6, // Similarity threshold (0-1)
  matchCount: 20, // Maximum results to return
      sourceTables: ['questionnaires', 'job_descriptions'], // Filter by source
  userId: 'user-uuid' // Filter by user (if implemented)
})
```

## Performance Considerations

### Debouncing

- Search input is debounced by 300ms to prevent excessive API calls
- Reduces OpenAI API usage and improves performance

### Caching

- Recent searches are cached in localStorage
- Popular searches are predefined to reduce API calls

### Error Handling

- Graceful fallback from vector search to text search
- Comprehensive error logging for debugging
- User-friendly error messages

## Testing

A test suite is included in `search-controller.test.js` to verify:

- Search suggestion generation
- Recent search management
- Error handling for invalid inputs
- Vector search validation

## Future Enhancements

### Potential Improvements:

1. **Search Analytics**: Track popular searches and user behavior
2. **Advanced Filtering**: Filter by date, category, or other metadata
3. **Search Suggestions**: AI-powered search suggestions
4. **Search History**: Detailed search history with timestamps
5. **Batch Operations**: Bulk search operations for admin users

### Performance Optimizations:

1. **Embedding Caching**: Cache common search embeddings
2. **Index Optimization**: Optimize vector index performance
3. **CDN Integration**: Cache search results for popular queries
4. **Real-time Updates**: WebSocket integration for live search updates

## Troubleshooting

### Common Issues:

1. **No Search Results**

   - Check if `search_index` table has data
   - Verify OpenAI API key is valid
   - Check Supabase connection

2. **Slow Search Performance**

   - Verify vector index is properly created
   - Check OpenAI API response times
   - Monitor Supabase query performance

3. **Search Not Working**
   - Verify all environment variables are set
   - Check browser console for errors
   - Ensure Supabase RLS policies allow search

### Debug Mode:

Enable debug logging by adding to browser console:

```javascript
localStorage.setItem('skillscout_debug_search', 'true')
```

## Security Considerations

1. **API Key Protection**: OpenAI API key is client-side (consider server-side implementation)
2. **Rate Limiting**: Implement rate limiting for search API calls
3. **Input Validation**: All search inputs are validated and sanitized
4. **RLS Policies**: Ensure proper Row Level Security on search_index table

## Contributing

When modifying the search functionality:

1. Update tests in `search-controller.test.js`
2. Document changes in this README
3. Test with various search terms and edge cases
4. Verify performance impact of changes
5. Update environment variable documentation
