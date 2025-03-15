import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the interface for the settings state
export interface SettingsState {
  darkMode: boolean;
  soundEnabled: boolean;
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
}

// Define the initial state
const initialState: SettingsState = {
  darkMode: false,
  soundEnabled: true,
  keyboardLayout: 'qwerty',
};

// Create the settings slice
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setKeyboardLayout: (state, action: PayloadAction<'qwerty' | 'dvorak' | 'colemak'>) => {
      state.keyboardLayout = action.payload;
    },
    // Reset all settings to default
    resetSettings: () => initialState,
  },
});

// Export the actions
export const { toggleDarkMode, toggleSound, setKeyboardLayout, resetSettings } = settingsSlice.actions;

// Export the reducer
export default settingsSlice.reducer; 