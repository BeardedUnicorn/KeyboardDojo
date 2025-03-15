import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../features/settings/settingsSlice';
import authReducer from '../features/auth/authSlice';
import lessonsReducer from '../features/lessons/lessonsSlice';
import progressReducer from '../features/progress/progressSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    lessons: lessonsReducer,
    progress: progressReducer,
    // Add more reducers here as the application grows
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {settings: SettingsState, auth: AuthState, lessons: LessonsState, progress: ProgressState}
export type AppDispatch = typeof store.dispatch; 