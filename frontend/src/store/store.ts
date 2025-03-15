import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    // Add more reducers here as the application grows
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {settings: SettingsState, ...}
export type AppDispatch = typeof store.dispatch; 