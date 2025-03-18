import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { loggerService } from '@services/loggerService';

import { storageService } from '../../../../shared/src/utils';

import type { RootState } from '@/store';

// Define types
export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  autoSave: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: SettingsState = {
  theme: 'system',
  fontSize: 14,
  autoSave: true,
  showLineNumbers: true,
  showMinimap: true,
  soundEnabled: true,
  soundVolume: 0.5,
  isLoading: false,
  error: null,
};

// Create async thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const theme = await storageService.getItem<string>('theme', 'system');
      const fontSize = await storageService.getItem<number>('fontSize', 14);
      const autoSave = await storageService.getItem<boolean>('autoSave', true);
      const showLineNumbers = await storageService.getItem<boolean>('showLineNumbers', true);
      const showMinimap = await storageService.getItem<boolean>('showMinimap', true);
      const soundEnabled = await storageService.getItem<boolean>('soundEnabled', true);
      const soundVolume = await storageService.getItem<number>('soundVolume', 0.5);

      return {
        theme: theme as 'light' | 'dark' | 'system',
        fontSize,
        autoSave,
        showLineNumbers,
        showMinimap,
        soundEnabled,
        soundVolume,
      };
    } catch (error) {
      loggerService.error('Error fetching settings', error);
      return rejectWithValue('Failed to fetch settings');
    }
  },
);

export const updateTheme = createAsyncThunk(
  'settings/updateTheme',
  async (theme: 'light' | 'dark' | 'system', { rejectWithValue }) => {
    try {
      await storageService.setItem('theme', theme);
      return theme;
    } catch (error) {
      loggerService.error('Error updating theme', error);
      return rejectWithValue('Failed to update theme');
    }
  },
);

export const updateFontSize = createAsyncThunk(
  'settings/updateFontSize',
  async (fontSize: number, { rejectWithValue }) => {
    try {
      await storageService.setItem('fontSize', fontSize);
      return fontSize;
    } catch (error) {
      loggerService.error('Error updating font size', error);
      return rejectWithValue('Failed to update font size');
    }
  },
);

export const updateAutoSave = createAsyncThunk(
  'settings/updateAutoSave',
  async (autoSave: boolean, { rejectWithValue }) => {
    try {
      await storageService.setItem('autoSave', autoSave);
      return autoSave;
    } catch (error) {
      loggerService.error('Error updating auto save', error);
      return rejectWithValue('Failed to update auto save');
    }
  },
);

export const updateShowLineNumbers = createAsyncThunk(
  'settings/updateShowLineNumbers',
  async (showLineNumbers: boolean, { rejectWithValue }) => {
    try {
      await storageService.setItem('showLineNumbers', showLineNumbers);
      return showLineNumbers;
    } catch (error) {
      loggerService.error('Error updating show line numbers', error);
      return rejectWithValue('Failed to update show line numbers');
    }
  },
);

export const updateShowMinimap = createAsyncThunk(
  'settings/updateShowMinimap',
  async (showMinimap: boolean, { rejectWithValue }) => {
    try {
      await storageService.setItem('showMinimap', showMinimap);
      return showMinimap;
    } catch (error) {
      loggerService.error('Error updating show minimap', error);
      return rejectWithValue('Failed to update show minimap');
    }
  },
);

export const updateSoundEnabled = createAsyncThunk(
  'settings/updateSoundEnabled',
  async (soundEnabled: boolean, { rejectWithValue }) => {
    try {
      await storageService.setItem('soundEnabled', soundEnabled);
      return soundEnabled;
    } catch (error) {
      loggerService.error('Error updating sound enabled', error);
      return rejectWithValue('Failed to update sound enabled');
    }
  },
);

export const updateSoundVolume = createAsyncThunk(
  'settings/updateSoundVolume',
  async (soundVolume: number, { rejectWithValue }) => {
    try {
      await storageService.setItem('soundVolume', soundVolume);
      return soundVolume;
    } catch (error) {
      loggerService.error('Error updating sound volume', error);
      return rejectWithValue('Failed to update sound volume');
    }
  },
);

// Create the slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
        state.fontSize = action.payload.fontSize;
        state.autoSave = action.payload.autoSave;
        state.showLineNumbers = action.payload.showLineNumbers;
        state.showMinimap = action.payload.showMinimap;
        state.soundEnabled = action.payload.soundEnabled;
        state.soundVolume = action.payload.soundVolume;
        state.isLoading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update theme
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.theme = action.payload;
      })

      // Update font size
      .addCase(updateFontSize.fulfilled, (state, action) => {
        state.fontSize = action.payload;
      })

      // Update auto save
      .addCase(updateAutoSave.fulfilled, (state, action) => {
        state.autoSave = action.payload;
      })

      // Update show line numbers
      .addCase(updateShowLineNumbers.fulfilled, (state, action) => {
        state.showLineNumbers = action.payload;
      })

      // Update show minimap
      .addCase(updateShowMinimap.fulfilled, (state, action) => {
        state.showMinimap = action.payload;
      })

      // Update sound enabled
      .addCase(updateSoundEnabled.fulfilled, (state, action) => {
        state.soundEnabled = action.payload;
      })

      // Update sound volume
      .addCase(updateSoundVolume.fulfilled, (state, action) => {
        state.soundVolume = action.payload;
      });
  },
});

// Export actions
export const { resetSettings } = settingsSlice.actions;

// Export selectors
export const selectSettings = (state: RootState) => state.settings;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectFontSize = (state: RootState) => state.settings.fontSize;
export const selectAutoSave = (state: RootState) => state.settings.autoSave;
export const selectShowLineNumbers = (state: RootState) => state.settings.showLineNumbers;
export const selectShowMinimap = (state: RootState) => state.settings.showMinimap;
export const selectSoundEnabled = (state: RootState) => state.settings.soundEnabled;
export const selectSoundVolume = (state: RootState) => state.settings.soundVolume;
export const selectIsSettingsLoading = (state: RootState) => state.settings.isLoading;

// Export reducer
export default settingsSlice.reducer;
