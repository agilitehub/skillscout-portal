// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './slices/profileSlice'

/**
 * Redux store configuration with Redux Toolkit
 * Centralized state management for the application
 */
export const store = configureStore({
  reducer: {
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

// Export types for TypeScript support (if needed in the future)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store