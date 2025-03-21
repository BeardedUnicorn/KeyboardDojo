/**
 * Test file for the Redux slices index module
 * 
 * This test verifies that the index module exports all the necessary reducers
 * and selectors that other parts of the application depend on.
 */

import { vi } from 'vitest';

// Mock the logger service
vi.mock('@services/loggerService', () => ({
  loggerService: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  useLogger: vi.fn(),
}));

// Mock the services index to avoid initialization issues
vi.mock('@services', () => ({
  loggerService: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock any data dependencies to prevent initialization
vi.mock('@data/paths/index', () => ({
  CursorPath: {},
  VSCodePath: {},
  IntelliJPath: {},
  getPathById: vi.fn(),
}));

// Import the module under test
import * as slicesIndex from '../index';

describe('Redux Slices Index', () => {
  test('should export all reducer functions', () => {
    expect(slicesIndex.userProgressReducer).toBeDefined();
    expect(slicesIndex.themeReducer).toBeDefined();
    expect(slicesIndex.achievementsReducer).toBeDefined();
    expect(slicesIndex.subscriptionReducer).toBeDefined();
    expect(slicesIndex.gamificationReducer).toBeDefined();
    expect(slicesIndex.curriculumReducer).toBeDefined();
    expect(slicesIndex.settingsReducer).toBeDefined();
    expect(slicesIndex.appReducer).toBeDefined();

    // Verify they are all functions
    expect(typeof slicesIndex.userProgressReducer).toBe('function');
    expect(typeof slicesIndex.themeReducer).toBe('function');
    expect(typeof slicesIndex.achievementsReducer).toBe('function');
    expect(typeof slicesIndex.subscriptionReducer).toBe('function');
    expect(typeof slicesIndex.gamificationReducer).toBe('function');
    expect(typeof slicesIndex.curriculumReducer).toBe('function');
    expect(typeof slicesIndex.settingsReducer).toBe('function');
    expect(typeof slicesIndex.appReducer).toBe('function');
  });

  test('should export key action creators from appSlice', () => {
    // Verify that key actions from appSlice are exported
    expect(slicesIndex.setLoading).toBeDefined();
    expect(slicesIndex.setOnlineStatus).toBeDefined();
    expect(slicesIndex.addError).toBeDefined();
    expect(slicesIndex.clearErrors).toBeDefined();
    expect(slicesIndex.addNotification).toBeDefined();
    expect(slicesIndex.markNotificationAsRead).toBeDefined();
    expect(slicesIndex.clearNotifications).toBeDefined();
    expect(slicesIndex.openModal).toBeDefined();
    expect(slicesIndex.closeModal).toBeDefined();
  });

  test('should export key selectors from gamificationSlice', () => {
    // Verify the explicitly renamed exports are defined
    expect(slicesIndex.selectGamification).toBeDefined();
    expect(slicesIndex.selectGamificationXP).toBeDefined();
    expect(slicesIndex.selectGamificationLevel).toBeDefined();
    expect(slicesIndex.selectGamificationHearts).toBeDefined();
    expect(slicesIndex.selectGamificationCurrency).toBeDefined();
    expect(slicesIndex.selectStreak).toBeDefined();
    expect(slicesIndex.selectCurrentStreak).toBeDefined();
    expect(slicesIndex.selectLongestStreak).toBeDefined();
    expect(slicesIndex.selectIsGamificationLoading).toBeDefined();
  });

  test('should export key selectors from userProgressSlice', () => {
    // Verify the explicitly renamed exports are defined
    expect(slicesIndex.selectUserProgress).toBeDefined();
    expect(slicesIndex.selectCompletedLessons).toBeDefined();
    expect(slicesIndex.selectUserXP).toBeDefined();
    expect(slicesIndex.selectUserLevel).toBeDefined();
    expect(slicesIndex.selectStreakDays).toBeDefined();
    expect(slicesIndex.selectUserHearts).toBeDefined();
    expect(slicesIndex.selectUserCurrency).toBeDefined();
    expect(slicesIndex.selectIsLessonCompleted).toBeDefined();
    expect(slicesIndex.selectIsModuleCompleted).toBeDefined();
    expect(slicesIndex.selectIsNodeCompleted).toBeDefined();
    expect(slicesIndex.selectCurrentLesson).toBeDefined();
  });

  test('should export key selectors from achievementsSlice', () => {
    // Verify that the achievementsSlice selectors are exported
    expect(slicesIndex.selectAchievements).toBeDefined();
    expect(slicesIndex.selectUnlockedAchievements).toBeDefined();
    expect(slicesIndex.selectCompletedAchievements).toBeDefined();
    expect(slicesIndex.selectIsAchievementsLoading).toBeDefined();
  });

  test('should export key selectors from themeSlice', () => {
    // Verify that the themeSlice selectors are exported
    expect(slicesIndex.selectThemeMode).toBeDefined();
  });

  test('should export key selectors from settingsSlice', () => {
    // Verify that the settingsSlice selectors are exported
    expect(slicesIndex.selectSettings).toBeDefined();
    expect(slicesIndex.selectTheme).toBeDefined();
    expect(slicesIndex.selectFontSize).toBeDefined();
    expect(slicesIndex.selectAutoSave).toBeDefined();
    expect(slicesIndex.selectShowLineNumbers).toBeDefined();
    expect(slicesIndex.selectShowMinimap).toBeDefined();
    expect(slicesIndex.selectSoundEnabled).toBeDefined();
    expect(slicesIndex.selectSoundVolume).toBeDefined();
    expect(slicesIndex.selectIsSettingsLoading).toBeDefined();
  });
}); 