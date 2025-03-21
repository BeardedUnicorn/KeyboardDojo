import { configureStore } from '@reduxjs/toolkit';
import { describe, test, expect, vi } from 'vitest';
import settingsReducer, {
  fetchSettings,
  updateTheme,
  updateFontSize,
  updateAutoSave,
  updateShowLineNumbers,
  updateShowMinimap,
  updateSoundEnabled,
  updateSoundVolume,
  resetSettings,
  selectSettings,
  selectTheme,
  selectFontSize,
  selectAutoSave,
  selectShowLineNumbers,
  selectShowMinimap,
  selectSoundEnabled,
  selectSoundVolume,
  selectIsSettingsLoading,
} from '../settingsSlice';

import type { RootState } from '@/store';
import type { SettingsState } from '../settingsSlice';

// Mock the loggerService
vi.mock('@/services', () => ({
  loggerService: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  },
}));

// Mock the storageService
vi.mock('../../../../../shared/src/utils/storage', () => ({
  storageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Create a mock store with preloaded state
const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: preloadedState?.settings ?? settingsReducer(undefined, { type: 'unknown' }),
    },
  });
};

describe('settings reducer', () => {
  // State tests
  describe('state', () => {
    test('should initialize with correct default state', () => {
      const state = settingsReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        theme: 'system',
        fontSize: 14,
        autoSave: true,
        showLineNumbers: true,
        showMinimap: true,
        soundEnabled: true,
        soundVolume: 0.5,
        isLoading: false,
        error: null,
      });
    });

    test('should handle theme change correctly', () => {
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

      const state = settingsReducer(initialState, updateTheme.fulfilled('dark', '', 'dark'));
      expect(state.theme).toBe('dark');
    });

    test('should handle font size change correctly', () => {
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

      const state = settingsReducer(initialState, updateFontSize.fulfilled(16, '', 16));
      expect(state.fontSize).toBe(16);
    });

    test('should handle auto save change correctly', () => {
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

      const state = settingsReducer(initialState, updateAutoSave.fulfilled(false, '', false));
      expect(state.autoSave).toBe(false);
    });

    test('should handle line numbers visibility change correctly', () => {
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

      const state = settingsReducer(initialState, updateShowLineNumbers.fulfilled(false, '', false));
      expect(state.showLineNumbers).toBe(false);
    });

    test('should handle minimap visibility change correctly', () => {
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

      const state = settingsReducer(initialState, updateShowMinimap.fulfilled(false, '', false));
      expect(state.showMinimap).toBe(false);
    });

    test('should handle sound settings change correctly', () => {
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

      let state = settingsReducer(initialState, updateSoundEnabled.fulfilled(false, '', false));
      expect(state.soundEnabled).toBe(false);

      state = settingsReducer(state, updateSoundVolume.fulfilled(0.8, '', 0.8));
      expect(state.soundVolume).toBe(0.8);
    });

    test('should handle reset settings correctly', () => {
      const initialState: SettingsState = {
        theme: 'dark',
        fontSize: 16,
        autoSave: false,
        showLineNumbers: false,
        showMinimap: false,
        soundEnabled: false,
        soundVolume: 0.8,
        isLoading: false,
        error: null,
      };

      const state = settingsReducer(initialState, resetSettings());
      expect(state).toEqual({
        theme: 'system',
        fontSize: 14,
        autoSave: true,
        showLineNumbers: true,
        showMinimap: true,
        soundEnabled: true,
        soundVolume: 0.5,
        isLoading: false,
        error: null,
      });
    });
  });

  // Thunk tests
  describe('thunks', () => {
    test('fetchSettings pending should set loading state', async () => {
      const store = createMockStore();
      const thunkPromise = store.dispatch(fetchSettings());
      
      expect(store.getState().settings.isLoading).toBe(true);
      expect(store.getState().settings.error).toBe(null);
      
      await thunkPromise;
    });

    test('fetchSettings fulfilled should update state', async () => {
      const mockSettings = {
        theme: 'dark' as const,
        fontSize: 16,
        autoSave: false,
        showLineNumbers: false,
        showMinimap: false,
        soundEnabled: false,
        soundVolume: 0.8,
      };

      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.getItem as any).mockImplementation((key: string, defaultValue: any) => {
        return mockSettings[key as keyof typeof mockSettings] ?? defaultValue;
      });
      
      const store = createMockStore();
      await store.dispatch(fetchSettings());
      
      const state = store.getState().settings;
      expect(state.theme).toBe('dark');
      expect(state.fontSize).toBe(16);
      expect(state.autoSave).toBe(false);
      expect(state.showLineNumbers).toBe(false);
      expect(state.showMinimap).toBe(false);
      expect(state.soundEnabled).toBe(false);
      expect(state.soundVolume).toBe(0.8);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('fetchSettings rejected should set error', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.getItem as any).mockRejectedValue(new Error('Storage error'));
      
      const store = createMockStore();
      await store.dispatch(fetchSettings());
      
      const state = store.getState().settings;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch settings');
    });

    test('updateTheme should save and update theme', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateTheme('dark'));
      
      expect(storageService.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(store.getState().settings.theme).toBe('dark');
    });

    test('updateFontSize should save and update font size', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateFontSize(16));
      
      expect(storageService.setItem).toHaveBeenCalledWith('fontSize', 16);
      expect(store.getState().settings.fontSize).toBe(16);
    });

    test('updateAutoSave should save and update auto save', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateAutoSave(false));
      
      expect(storageService.setItem).toHaveBeenCalledWith('autoSave', false);
      expect(store.getState().settings.autoSave).toBe(false);
    });

    test('updateShowLineNumbers should save and update line numbers visibility', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateShowLineNumbers(false));
      
      expect(storageService.setItem).toHaveBeenCalledWith('showLineNumbers', false);
      expect(store.getState().settings.showLineNumbers).toBe(false);
    });

    test('updateShowMinimap should save and update minimap visibility', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateShowMinimap(false));
      
      expect(storageService.setItem).toHaveBeenCalledWith('showMinimap', false);
      expect(store.getState().settings.showMinimap).toBe(false);
    });

    test('updateSoundEnabled should save and update sound enabled', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateSoundEnabled(false));
      
      expect(storageService.setItem).toHaveBeenCalledWith('soundEnabled', false);
      expect(store.getState().settings.soundEnabled).toBe(false);
    });

    test('updateSoundVolume should save and update sound volume', async () => {
      const { storageService } = await import('../../../../../shared/src/utils/storage');
      (storageService.setItem as any).mockResolvedValue(undefined);
      
      const store = createMockStore();
      await store.dispatch(updateSoundVolume(0.8));
      
      expect(storageService.setItem).toHaveBeenCalledWith('soundVolume', 0.8);
      expect(store.getState().settings.soundVolume).toBe(0.8);
    });
  });

  // Selector tests
  describe('selectors', () => {
    const mockState: RootState = {
      settings: {
        theme: 'dark',
        fontSize: 16,
        autoSave: false,
        showLineNumbers: false,
        showMinimap: false,
        soundEnabled: false,
        soundVolume: 0.8,
        isLoading: false,
        error: null,
      },
    } as unknown as RootState;

    test('selectSettings should return settings state', () => {
      const result = selectSettings(mockState);
      expect(result).toEqual(mockState.settings);
    });

    test('selectTheme should return theme', () => {
      const result = selectTheme(mockState);
      expect(result).toBe('dark');
    });

    test('selectFontSize should return font size', () => {
      const result = selectFontSize(mockState);
      expect(result).toBe(16);
    });

    test('selectAutoSave should return auto save', () => {
      const result = selectAutoSave(mockState);
      expect(result).toBe(false);
    });

    test('selectShowLineNumbers should return line numbers visibility', () => {
      const result = selectShowLineNumbers(mockState);
      expect(result).toBe(false);
    });

    test('selectShowMinimap should return minimap visibility', () => {
      const result = selectShowMinimap(mockState);
      expect(result).toBe(false);
    });

    test('selectSoundEnabled should return sound enabled', () => {
      const result = selectSoundEnabled(mockState);
      expect(result).toBe(false);
    });

    test('selectSoundVolume should return sound volume', () => {
      const result = selectSoundVolume(mockState);
      expect(result).toBe(0.8);
    });

    test('selectIsSettingsLoading should return loading state', () => {
      const result = selectIsSettingsLoading(mockState);
      expect(result).toBe(false);
    });
  });
}); 