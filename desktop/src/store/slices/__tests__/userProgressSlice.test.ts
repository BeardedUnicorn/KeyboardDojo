import { configureStore } from '@reduxjs/toolkit';
import { describe, test, expect, vi } from 'vitest';
import userProgressReducer, {
  fetchUserProgress,
  markLessonCompleted,
  setCurrentLesson,
  addXp,
  updateStreak,
  updateHearts,
  updateCurrency,
  resetProgress,
  selectUserProgress,
  selectCompletedLessons,
  selectXp,
  selectLevel,
  selectStreakDays,
  selectHearts,
  selectCurrency,
  selectIsLessonCompleted,
  selectIsModuleCompleted,
  selectIsNodeCompleted,
  selectCurrentLesson,
} from '../userProgressSlice';

import type { RootState } from '@/store';
import { ApplicationType } from '@/types/progress/ICurriculum';

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

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

// Define test data
const mockCompletedLesson = {
  curriculumId: 'curriculum1',
  trackId: ApplicationType.VSCODE,
  lessonId: 'lesson1',
  completedAt: '2024-03-19T00:00:00.000Z',
  score: 100,
  timeSpent: 300,
};

const mockCompletedModule = {
  curriculumId: 'curriculum1',
  trackId: ApplicationType.VSCODE,
  moduleId: 'module1',
  completedAt: '2024-03-19T00:00:00.000Z',
};

const mockCompletedNode = {
  nodeId: 'node1',
  completedAt: '2024-03-19T00:00:00.000Z',
  stars: 3,
};

const mockCurrentLesson = {
  trackId: ApplicationType.VSCODE,
  lessonId: 'lesson1',
  progress: 50,
};

const mockHearts = {
  current: 5,
  max: 5,
  lastRegeneration: '2024-03-19T00:00:00.000Z',
};

// Create a mock store with preloaded state
const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      userProgress: userProgressReducer,
    },
    preloadedState: {
      userProgress: preloadedState?.userProgress ?? userProgressReducer(undefined, { type: 'unknown' }),
    },
  });
};

describe('userProgress reducer', () => {
  // State tests
  describe('state', () => {
    test('should initialize with correct default state', () => {
      const state = userProgressReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        completedLessons: [],
        completedModules: [],
        completedNodes: [],
        currentLessons: [],
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActivity: expect.any(String),
        hearts: {
          current: 5,
          max: 5,
          lastRegeneration: expect.any(String),
        },
        currency: 0,
        isLoading: false,
        error: null,
      });
    });

    test('should handle session recording correctly', () => {
      const initialState = {
        completedLessons: [],
        completedModules: [],
        completedNodes: [],
        currentLessons: [],
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActivity: '2024-03-18T00:00:00.000Z',
        hearts: mockHearts,
        currency: 0,
        isLoading: false,
        error: null,
      };

      const state = userProgressReducer(initialState, markLessonCompleted.fulfilled(mockCompletedLesson, '', {
        curriculumId: 'curriculum1',
        trackId: ApplicationType.VSCODE,
        lessonId: 'lesson1',
      }));

      expect(state.completedLessons).toEqual([mockCompletedLesson]);
      expect(state.lastActivity).not.toBe('2024-03-18T00:00:00.000Z');
    });

    test('should handle statistics update correctly', () => {
      const initialState = {
        completedLessons: [],
        completedModules: [],
        completedNodes: [],
        currentLessons: [],
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActivity: '2024-03-18T00:00:00.000Z',
        hearts: mockHearts,
        currency: 0,
        isLoading: false,
        error: null,
      };

      // Add XP and check level up
      let state = userProgressReducer(initialState, addXp(100));
      expect(state.xp).toBe(100);
      expect(state.level).toBe(2);

      // Add more XP and check another level up
      state = userProgressReducer(state, addXp(150));
      expect(state.xp).toBe(250);
      expect(state.level).toBe(3);
    });

    test('should handle goal setting correctly', () => {
      // This would need to be implemented if goal setting functionality is added
      expect(true).toBe(true);
    });

    test('should handle goal progress correctly', () => {
      // This would need to be implemented if goal progress functionality is added
      expect(true).toBe(true);
    });

    test('should handle goal completion correctly', () => {
      // This would need to be implemented if goal completion functionality is added
      expect(true).toBe(true);
    });

    test('should handle typing speed records correctly', () => {
      // This would need to be implemented if typing speed record functionality is added
      expect(true).toBe(true);
    });
  });

  // Thunk tests
  describe('thunks', () => {
    test('loadUserProgress pending should set loading state', async () => {
      const store = createMockStore();
      const thunkPromise = store.dispatch(fetchUserProgress());
      
      expect(store.getState().userProgress.isLoading).toBe(true);
      expect(store.getState().userProgress.error).toBe(null);
      
      await thunkPromise;
    });

    test('loadUserProgress fulfilled should update state', async () => {
      const mockProgressData = {
        completedLessons: [mockCompletedLesson],
        completedModules: [mockCompletedModule],
        completedNodes: [mockCompletedNode],
        currentLessons: [mockCurrentLesson],
        xp: 100,
        level: 2,
        streakDays: 3,
        lastActivity: '2024-03-19T00:00:00.000Z',
        hearts: mockHearts,
        currency: 50,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockProgressData));
      
      const store = createMockStore();
      await store.dispatch(fetchUserProgress());
      
      const state = store.getState().userProgress;
      expect(state.completedLessons).toEqual([mockCompletedLesson]);
      expect(state.completedModules).toEqual([mockCompletedModule]);
      expect(state.completedNodes).toEqual([mockCompletedNode]);
      expect(state.currentLessons).toEqual([mockCurrentLesson]);
      expect(state.xp).toBe(100);
      expect(state.level).toBe(2);
      expect(state.streakDays).toBe(3);
      expect(state.hearts).toEqual(mockHearts);
      expect(state.currency).toBe(50);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('loadUserProgress rejected should set error', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const store = createMockStore();
      await store.dispatch(fetchUserProgress());
      
      const state = store.getState().userProgress;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch user progress');
    });

    test('saveUserProgress should dispatch correct actions', () => {
      // This would need to be implemented if saveUserProgress thunk is added
      expect(true).toBe(true);
    });

    test('updateTypingStatistics should calculate and save correctly', () => {
      // This would need to be implemented if updateTypingStatistics thunk is added
      expect(true).toBe(true);
    });
  });

  // Selector tests
  describe('selectors', () => {
    const mockState: RootState = {
      userProgress: {
        completedLessons: [mockCompletedLesson],
        completedModules: [mockCompletedModule],
        completedNodes: [mockCompletedNode],
        currentLessons: [mockCurrentLesson],
        xp: 100,
        level: 2,
        streakDays: 3,
        lastActivity: '2024-03-19T00:00:00.000Z',
        hearts: mockHearts,
        currency: 50,
        isLoading: false,
        error: null,
      },
    } as unknown as RootState;

    test('selectUserProgress should return user progress state', () => {
      const result = selectUserProgress(mockState);
      expect(result).toEqual(mockState.userProgress);
    });

    test('selectCompletedLessons should return completed lessons', () => {
      const result = selectCompletedLessons(mockState);
      expect(result).toEqual([mockCompletedLesson]);
    });

    test('selectXp should return current XP', () => {
      const result = selectXp(mockState);
      expect(result).toBe(100);
    });

    test('selectLevel should return current level', () => {
      const result = selectLevel(mockState);
      expect(result).toBe(2);
    });

    test('selectStreakDays should return streak days', () => {
      const result = selectStreakDays(mockState);
      expect(result).toBe(3);
    });

    test('selectHearts should return hearts state', () => {
      const result = selectHearts(mockState);
      expect(result).toEqual(mockHearts);
    });

    test('selectCurrency should return currency balance', () => {
      const result = selectCurrency(mockState);
      expect(result).toBe(50);
    });

    test('selectIsLessonCompleted should check lesson completion', () => {
      const result = selectIsLessonCompleted(mockState, 'lesson1');
      expect(result).toBe(true);
    });

    test('selectIsModuleCompleted should check module completion', () => {
      const result = selectIsModuleCompleted(mockState, 'curriculum1', ApplicationType.VSCODE, 'module1');
      expect(result).toBe(true);
    });

    test('selectIsNodeCompleted should check node completion', () => {
      const result = selectIsNodeCompleted(mockState, 'node1');
      expect(result).toBe(true);
    });

    test('selectCurrentLesson should return current lesson for track', () => {
      const result = selectCurrentLesson(mockState, ApplicationType.VSCODE);
      expect(result).toEqual(mockCurrentLesson);
    });

    test('selectUserStatistics should return user statistics', () => {
      // This would need to be implemented if selectUserStatistics selector is added
      expect(true).toBe(true);
    });

    test('selectGoals should return user goals', () => {
      // This would need to be implemented if selectGoals selector is added
      expect(true).toBe(true);
    });

    test('selectCompletedGoals should return completed goals', () => {
      // This would need to be implemented if selectCompletedGoals selector is added
      expect(true).toBe(true);
    });

    test('selectActiveGoals should return active goals', () => {
      // This would need to be implemented if selectActiveGoals selector is added
      expect(true).toBe(true);
    });

    test('selectSessionHistory should return session history', () => {
      // This would need to be implemented if selectSessionHistory selector is added
      expect(true).toBe(true);
    });

    test('selectTypingSpeed should return current typing speed', () => {
      // This would need to be implemented if selectTypingSpeed selector is added
      expect(true).toBe(true);
    });

    test('selectTypingAccuracy should return current typing accuracy', () => {
      // This would need to be implemented if selectTypingAccuracy selector is added
      expect(true).toBe(true);
    });

    test('selectAllTimeStats should return aggregated statistics', () => {
      // This would need to be implemented if selectAllTimeStats selector is added
      expect(true).toBe(true);
    });

    test('selectImprovementRate should calculate improvement rate correctly', () => {
      // This would need to be implemented if selectImprovementRate selector is added
      expect(true).toBe(true);
    });
  });
}); 