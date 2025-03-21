# Redux Store Documentation

## Overview

The application uses Redux Toolkit for state management. The store is organized into feature slices, each responsible for a specific domain of the application.

## Store Configuration

The main store is configured in `src/store/index.ts` and includes:

- Redux Toolkit's `configureStore` for setup
- RTK Query for API integration
- Middleware for development, logging, and error tracking
- Type definitions for TypeScript integration

```typescript
// Store configuration excerpt
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
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware, sentryMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});
```

## Core Store Features

### Typed Redux Hooks

The store provides typed versions of Redux hooks for better TypeScript integration:

```typescript
import { useAppDispatch, useAppSelector } from '@store/index';

function MyComponent() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  
  // Type-safe dispatch and state selection
}
```

### Sentry Integration

The store includes Sentry middleware to track Redux actions and state changes for error reporting:

```typescript
import { createSentryMiddleware } from '@utils/sentryRedux';

const sentryMiddleware = createSentryMiddleware({
  // Configuration options
  stateTransformer: (state) => ({
    // Sanitize sensitive data
    ...state,
    user: { ...state.user, email: '[REDACTED]' }
  })
});
```

## Feature Slices

The store is organized into the following feature slices:

### App Slice

Manages application-level state:

- Initialization status
- Version information
- Global messages and notifications
- Modal management
- Network status

### User Progress Slice

Tracks user learning progress:

- Completed lessons and exercises
- Performance metrics
- Learning history
- Streak information

### Theme Slice

Manages UI appearance:

- Light/dark mode
- Color schemes
- Animation preferences

### Achievements Slice

Handles the gamification achievements system:

- Unlocked achievements
- Progress towards locked achievements
- Achievement categories and filters

### Subscription Slice

Manages user subscription information:

- Subscription status
- Plan details
- Payment information
- Premium feature access

### Gamification Slice

Handles game mechanics and rewards:

- XP and level progression
- Currency and rewards
- Streaks and bonuses
- Hearts and energy system

### Curriculum Slice

Manages learning content and structure:

- Available tracks and modules
- Lesson progression
- Content availability and prerequisites
- Recommendation engine data

### Settings Slice

Handles user preferences:

- Application settings
- Learning preferences
- Notification settings
- Keyboard shortcuts and customization

## RTK Query API

The store integrates with RTK Query for data fetching and caching:

```typescript
// API slice excerpt
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token from state
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint definitions
  }),
});
```

## Using Slice Hooks

Each slice provides custom hooks for accessing its state and actions:

```typescript
// Example hooks
import { useUserProgressRedux } from '@hooks/useUserProgressRedux';
import { useGamificationRedux } from '@hooks/useGamificationRedux';
import { useThemeRedux } from '@hooks/useThemeRedux';

function MyComponent() {
  // Access user progress slice
  const { level, xp, actions } = useUserProgressRedux();
  
  // Access gamification slice
  const { achievements, currency } = useGamificationRedux();
  
  // Access theme slice
  const { mode, toggleTheme } = useThemeRedux();
  
  // Use the state and actions
  const handleCompleteLesson = () => {
    actions.completeLesson('lesson-123');
  };
}
```

## Redux Mocking in Storybook

For Storybook integration, the application provides mock stores with predefined states:

```typescript
// Storybook store configuration
import { Provider } from 'react-redux';
import createMockStore from './store';

// Create stores for different scenarios
const defaultStore = createMockStore();
const beginnerStore = createMockStore({
  userProgress: {
    level: 2,
    xp: 450,
    totalLessonsCompleted: 8,
  }
});

// Use in Storybook decorators
const withRedux = (Story, { parameters }) => {
  const store = parameters.storeName === 'beginner' 
    ? beginnerStore 
    : defaultStore;
    
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
```

## Best Practices

1. **Use RTK createSlice for new features**
   ```typescript
   import { createSlice } from '@reduxjs/toolkit';
   
   const myFeatureSlice = createSlice({
     name: 'myFeature',
     initialState,
     reducers: {
       // Reducers with automatic action creators
     }
   });
   ```

2. **Create typed selectors for reusable state access**
   ```typescript
   export const selectUserLevel = (state: RootState) => state.userProgress.level;
   
   // Use with useAppSelector
   const level = useAppSelector(selectUserLevel);
   ```

3. **Prefer createAsyncThunk for async operations**
   ```typescript
   export const fetchUserData = createAsyncThunk(
     'user/fetchUserData',
     async (userId: string, { rejectWithValue }) => {
       try {
         const response = await api.get(`/users/${userId}`);
         return response.data;
       } catch (error) {
         return rejectWithValue(error.response.data);
       }
     }
   );
   ```

4. **Encapsulate complex logic in slice selectors**
   ```typescript
   // Inside slice file
   export const { actions, reducer } = myFeatureSlice;
   export const selectors = {
     getFilteredItems: (state: RootState) => {
       // Complex filtering logic
       return state.myFeature.items.filter(/* ... */);
     }
   };
   ``` 