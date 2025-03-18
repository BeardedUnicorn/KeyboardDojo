import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';

import { testReducer } from '@components/SentryReduxTest';
import {
  userProgressReducer,
  themeReducer,
  achievementsReducer,
  subscriptionReducer,
  gamificationReducer,
  curriculumReducer,
  settingsReducer,
  appReducer,
} from '@slices/index';
import { createSentryMiddleware } from '@utils/sentryRedux';

import { api } from './api';

import type { TypedUseSelectorHook } from 'react-redux';

// Create Sentry middleware
const sentryMiddleware = createSentryMiddleware();

// Create the store with middleware
export const store = configureStore({
  reducer: {
    // API reducer
    [api.reducerPath]: api.reducer,
    // Feature reducers
    userProgress: userProgressReducer,
    theme: themeReducer,
    achievements: achievementsReducer,
    subscription: subscriptionReducer,
    gamification: gamificationReducer,
    curriculum: curriculumReducer,
    settings: settingsReducer,
    app: appReducer,
    // Test reducer for Sentry integration testing
    test: testReducer,
  },
  // Adding middleware for development tools
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware, sentryMiddleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export the store as default
export default store; 
