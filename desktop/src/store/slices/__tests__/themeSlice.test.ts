import { configureStore } from '@reduxjs/toolkit';
import { describe, test, expect, vi } from 'vitest';
import themeReducer, {
  toggleTheme,
  setThemeMode,
  selectThemeMode,
} from '../themeSlice';

import type { RootState } from '@/store';
import type { PaletteMode } from '@mui/material';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

// Create a mock store with preloaded state
const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: {
      theme: preloadedState?.theme ?? themeReducer(undefined, { type: 'unknown' }),
    },
  });
};

describe('theme reducer', () => {
  // State tests
  describe('state', () => {
    test('should initialize with correct default state', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        mode: expect.any(String),
        isUserPreference: expect.any(Boolean),
      });
    });

    test('should toggle theme correctly', () => {
      const initialState = { mode: 'light' as PaletteMode, isUserPreference: false };
      const state = themeReducer(initialState, toggleTheme());
      expect(state.mode).toBe('dark');
      expect(state.isUserPreference).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
    });

    test('should set theme mode correctly', () => {
      const initialState = { mode: 'light' as PaletteMode, isUserPreference: false };
      const state = themeReducer(initialState, setThemeMode('dark'));
      expect(state.mode).toBe('dark');
      expect(state.isUserPreference).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
    });
  });

  // Selector tests
  describe('selectors', () => {
    const mockState: RootState = {
      theme: {
        mode: 'dark',
        isUserPreference: true,
      },
    } as unknown as RootState;

    test('selectThemeMode should return current theme mode', () => {
      const result = selectThemeMode(mockState);
      expect(result).toBe('dark');
    });
  });
}); 