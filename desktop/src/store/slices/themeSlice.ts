import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { PaletteMode } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the theme state interface
interface ThemeState {
  mode: PaletteMode;
  // Track if the theme was explicitly set by user
  isUserPreference: boolean;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): { mode: PaletteMode; isUserPreference: boolean } => {
  try {
    const savedTheme = localStorage.getItem('theme-mode');
    // If theme is explicitly saved in localStorage, respect it
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return { 
        mode: savedTheme as PaletteMode, 
        isUserPreference: true, 
      };
    }
    
    // No user preference, use system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { 
      mode: prefersDarkMode ? 'dark' : 'light',
      isUserPreference: false, 
    };
  } catch (error) {
    console.error('Failed to load theme:', error);
    // Default to light theme if there's an error
    return { 
      mode: 'light', 
      isUserPreference: false, 
    };
  }
};

// Define initial state
const initialState: ThemeState = {
  mode: getInitialTheme().mode,
  isUserPreference: getInitialTheme().isUserPreference,
};

// Create the theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.isUserPreference = true;
      // Save to localStorage
      localStorage.setItem('theme-mode', state.mode);
    },
    setThemeMode: (state, action: PayloadAction<PaletteMode>) => {
      state.mode = action.payload;
      state.isUserPreference = true;
      // Save to localStorage
      localStorage.setItem('theme-mode', state.mode);
    },
    // New action to follow system preference
    useSystemTheme: (state) => {
      try {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.mode = prefersDarkMode ? 'dark' : 'light';
        state.isUserPreference = false;
        // Remove from localStorage to allow system preference to take over
        localStorage.removeItem('theme-mode');
      } catch (error) {
        console.error('Failed to get system theme preference:', error);
      }
    },
  },
});

// Export actions
export const { toggleTheme, setThemeMode, useSystemTheme } = themeSlice.actions;

// Export selectors
export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectIsUserPreference = (state: RootState) => state.theme.isUserPreference;

// Export reducer
export default themeSlice.reducer;
