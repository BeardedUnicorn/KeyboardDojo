import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { PaletteMode } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the theme state interface
interface ThemeState {
  mode: PaletteMode;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): PaletteMode => {
  try {
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme as PaletteMode;
    }
    // Check system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? 'dark' : 'light';
  } catch (error) {
    console.error('Failed to load theme:', error);
    return 'light'; // Default to light theme if there's an error
  }
};

// Define initial state
const initialState: ThemeState = {
  mode: getInitialTheme(),
};

// Create the theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save to localStorage
      localStorage.setItem('theme-mode', state.mode);
    },
    setThemeMode: (state, action: PayloadAction<PaletteMode>) => {
      state.mode = action.payload;
      // Save to localStorage
      localStorage.setItem('theme-mode', state.mode);
    },
  },
});

// Export actions
export const { toggleTheme, setThemeMode } = themeSlice.actions;

// Export selectors
export const selectThemeMode = (state: RootState) => state.theme.mode;

// Export reducer
export default themeSlice.reducer;
