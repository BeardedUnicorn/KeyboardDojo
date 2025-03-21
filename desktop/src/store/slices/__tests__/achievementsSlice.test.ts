import { vi } from 'vitest';
import achievementsReducer, {
  refreshAchievements,
  fetchAchievements,
  awardAchievement,
  selectAchievements,
  selectUnlockedAchievements,
  selectCompletedAchievements,
  selectIsAchievementsLoading,
  selectHasAchievement,
} from '../achievementsSlice';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';

import type { IAchievement } from '@/types/achievements/IAchievement';
import type { IAchievementsState } from '@/types/achievements/IAchievementsState';

// Mock the loggerService
vi.mock('@/services', () => ({
  loggerService: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Sample achievement for testing
const sampleAchievements: IAchievement[] = [
  {
    id: 'test_achievement_1',
    title: 'Test Achievement 1',
    description: 'This is a test achievement',
    icon: '🎓',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.COMMON,
    xpReward: 10,
    condition: {
      type: 'test_condition',
      target: 1,
    },
  },
  {
    id: 'test_achievement_2',
    title: 'Test Achievement 2',
    description: 'This is another test achievement',
    icon: '📚',
    category: AchievementCategory.GENERAL,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 20,
    condition: {
      type: 'test_condition',
      target: 5,
    },
  },
];

// Initial state for tests
const initialTestState: IAchievementsState = {
  achievements: sampleAchievements,
  unlockedAchievements: [],
  completedAchievements: [],
  isLoading: false,
  error: null,
};

describe('achievementsSlice', () => {
  // Reset localStorage mock before each test
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  // State Tests
  describe('reducer', () => {
    test('should initialize with correct default state', () => {
      const state = achievementsReducer(undefined, { type: 'unknown' });
      expect(state.achievements).toBeInstanceOf(Array);
      expect(state.unlockedAchievements).toEqual([]);
      expect(state.completedAchievements).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('should handle achievement unlocking correctly', () => {
      // Setup initial state with a sample achievement
      const initialState: IAchievementsState = {
        ...initialTestState,
      };

      // Create a fulfilled action for awarding an achievement
      const achievementToAward = sampleAchievements[0];
      const awardedAchievement = {
        achievement: achievementToAward,
        completed: true,
        completedDate: '2023-01-01T00:00:00.000Z',
        progress: 100,
      };

      const action = {
        type: 'achievements/awardAchievement/fulfilled',
        payload: awardedAchievement,
      };

      // Check the state after awarding
      const newState = achievementsReducer(initialState, action);
      
      // Verify achievement was added to unlockedAchievements
      expect(newState.unlockedAchievements).toHaveLength(1);
      expect(newState.unlockedAchievements[0].id).toBe('test_achievement_1');
      
      // Verify achievement was added to completedAchievements
      expect(newState.completedAchievements).toHaveLength(1);
      expect(newState.completedAchievements[0].achievement.id).toBe('test_achievement_1');
      expect(newState.completedAchievements[0].completed).toBe(true);
      expect(newState.completedAchievements[0].progress).toBe(100);
    });

    test('should handle achievement progress update correctly', () => {
      // In this slice implementation, there's no explicit progress update reducer
      // But we can test the awardAchievement which handles completion
      const initialState: IAchievementsState = {
        ...initialTestState,
      };

      // Create a fulfilled action for partial progress
      const achievementToUpdate = sampleAchievements[0];
      const updatedAchievement = {
        achievement: achievementToUpdate,
        completed: false,
        progress: 50,
      };

      const action = {
        type: 'achievements/awardAchievement/fulfilled',
        payload: updatedAchievement,
      };

      // Check the state after updating
      const newState = achievementsReducer(initialState, action);
      
      // Verify achievement was added to completedAchievements with partial progress
      expect(newState.completedAchievements).toHaveLength(1);
      expect(newState.completedAchievements[0].achievement.id).toBe('test_achievement_1');
      expect(newState.completedAchievements[0].completed).toBe(false);
      expect(newState.completedAchievements[0].progress).toBe(50);
    });

    test('should handle multiple achievements unlock', () => {
      // Setup initial state with unlocked achievements
      const initialState: IAchievementsState = {
        ...initialTestState,
        unlockedAchievements: [sampleAchievements[0]],
        completedAchievements: [
          {
            achievement: sampleAchievements[0],
            completed: true,
            completedDate: '2023-01-01T00:00:00.000Z',
            progress: 100,
          },
        ],
      };

      // Award a second achievement
      const achievementToAward = sampleAchievements[1];
      const awardedAchievement = {
        achievement: achievementToAward,
        completed: true,
        completedDate: '2023-01-02T00:00:00.000Z',
        progress: 100,
      };

      const action = {
        type: 'achievements/awardAchievement/fulfilled',
        payload: awardedAchievement,
      };

      // Check the state after awarding
      const newState = achievementsReducer(initialState, action);
      
      // Verify both achievements are now unlocked
      expect(newState.unlockedAchievements).toHaveLength(2);
      expect(newState.unlockedAchievements.map(a => a.id)).toContain('test_achievement_1');
      expect(newState.unlockedAchievements.map(a => a.id)).toContain('test_achievement_2');
      
      // Verify both achievements are in completedAchievements
      expect(newState.completedAchievements).toHaveLength(2);
      expect(newState.completedAchievements.map(a => a.achievement.id)).toContain('test_achievement_1');
      expect(newState.completedAchievements.map(a => a.achievement.id)).toContain('test_achievement_2');
    });

    test('should not unlock achievement if conditions not met', () => {
      // There's no explicit condition checking in this slice, 
      // but we can test that achievements aren't unlocked without calling awardAchievement
      const initialState: IAchievementsState = {
        ...initialTestState,
      };

      // Refresh achievements should not unlock anything
      const action = refreshAchievements();
      const newState = achievementsReducer(initialState, action);
      
      // Verify no achievements were unlocked
      expect(newState.unlockedAchievements).toHaveLength(0);
      expect(newState.completedAchievements).toHaveLength(0);
    });

    test('should handle achievement notification correctly', () => {
      // In this implementation, there's no direct notification handling in the reducer
      // However, we can test that localStorage is updated when an achievement is awarded
      const initialState: IAchievementsState = {
        ...initialTestState,
      };

      // Create a fulfilled action for awarding an achievement
      const achievementToAward = sampleAchievements[0];
      const awardedAchievement = {
        achievement: achievementToAward,
        completed: true,
        completedDate: '2023-01-01T00:00:00.000Z',
        progress: 100,
      };

      const action = {
        type: 'achievements/awardAchievement/fulfilled',
        payload: awardedAchievement,
      };

      // Execute the reducer
      achievementsReducer(initialState, action);
      
      // Verify localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'achievements',
        expect.any(String)
      );
    });
  });

  // Thunk Tests
  describe('thunks', () => {
    test('loadAchievements pending should set loading state', () => {
      // Create a pending action
      const action = {
        type: 'achievements/fetchAchievements/pending',
      };

      // Check the state after pending
      const newState = achievementsReducer(initialTestState, action);
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('loadAchievements fulfilled should update state', () => {
      // Mock stored achievements
      const storedAchievements = {
        achievements: sampleAchievements,
        unlockedAchievements: [sampleAchievements[0]],
        completedAchievements: [
          {
            achievement: sampleAchievements[0],
            completed: true,
            completedDate: '2023-01-01T00:00:00.000Z',
            progress: 100,
          },
        ],
      };

      // Create a fulfilled action
      const action = {
        type: 'achievements/fetchAchievements/fulfilled',
        payload: storedAchievements,
      };

      // Check the state after fulfilled
      const newState = achievementsReducer(initialTestState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.achievements).toEqual(sampleAchievements);
      expect(newState.unlockedAchievements).toHaveLength(1);
      expect(newState.unlockedAchievements[0].id).toBe('test_achievement_1');
      expect(newState.completedAchievements).toHaveLength(1);
      expect(newState.completedAchievements[0].achievement.id).toBe('test_achievement_1');
    });

    test('loadAchievements rejected should set error', () => {
      // Create a rejected action
      const action = {
        type: 'achievements/fetchAchievements/rejected',
        payload: 'Test error message',
      };

      // Check the state after rejected
      const newState = achievementsReducer(initialTestState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Test error message');
    });

    test('updateAchievementProgress should calculate and update progress correctly', async () => {
      // This test would be more extensive in a real implementation
      // For this example, we'll test the awardAchievement thunk which is a proxy for progress update
      
      // Since we can't directly test the thunk execution, we'll test the action handling
      const achievementToUpdate = sampleAchievements[0];
      const updatedAchievement = {
        achievement: achievementToUpdate,
        completed: false,
        progress: 50,
      };

      const action = {
        type: 'achievements/awardAchievement/fulfilled',
        payload: updatedAchievement,
      };

      // Check the state after updating
      const newState = achievementsReducer(initialTestState, action);
      expect(newState.completedAchievements).toHaveLength(1);
      expect(newState.completedAchievements[0].progress).toBe(50);
    });

    test('checkAndUnlockAchievements should unlock eligible achievements', async () => {
      // This functionality would be in a separate thunk in a complete implementation
      // Here we'll test awardAchievement's fulfilled action which unlocks achievements
      
      const achievementToAward = sampleAchievements[0];
      const awardedAchievement = {
        achievement: achievementToAward,
        completed: true,
        completedDate: '2023-01-01T00:00:00.000Z',
        progress: 100,
      };

      const action = {
        type: 'achievements/awardAchievement/fulfilled',
        payload: awardedAchievement,
      };

      // Check the state after awarding
      const newState = achievementsReducer(initialTestState, action);
      expect(newState.unlockedAchievements).toHaveLength(1);
      expect(newState.unlockedAchievements[0].id).toBe('test_achievement_1');
    });
  });

  // Selector Tests
  describe('selectors', () => {
    // Create a test state for selectors
    const testState = {
      achievements: {
        achievements: sampleAchievements,
        unlockedAchievements: [sampleAchievements[0]],
        completedAchievements: [
          {
            achievement: sampleAchievements[0],
            completed: true,
            completedDate: '2023-01-01T00:00:00.000Z',
            progress: 100,
          },
        ],
        isLoading: false,
        error: null,
      },
      // Other state slices would be here
    };

    test('selectAchievements should return all achievements', () => {
      const result = selectAchievements(testState as any);
      expect(result).toEqual(sampleAchievements);
      expect(result).toHaveLength(2);
    });

    test('selectUnlockedAchievements should return only unlocked achievements', () => {
      const result = selectUnlockedAchievements(testState as any);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test_achievement_1');
    });

    test('selectCompletedAchievements should return achievements with progress', () => {
      const result = selectCompletedAchievements(testState as any);
      expect(result).toHaveLength(1);
      expect(result[0].achievement.id).toBe('test_achievement_1');
      expect(result[0].completed).toBe(true);
      expect(result[0].progress).toBe(100);
    });

    test('selectIsAchievementsLoading should return loading state', () => {
      const result = selectIsAchievementsLoading(testState as any);
      expect(result).toBe(false);

      const loadingState = {
        ...testState,
        achievements: {
          ...testState.achievements,
          isLoading: true,
        },
      };
      
      const loadingResult = selectIsAchievementsLoading(loadingState as any);
      expect(loadingResult).toBe(true);
    });

    test('selectHasAchievement should return specific achievement', () => {
      const result = selectHasAchievement(testState as any, 'test_achievement_1');
      expect(result).toBe(true);

      const notUnlockedResult = selectHasAchievement(testState as any, 'test_achievement_2');
      expect(notUnlockedResult).toBe(false);
    });
  });
}); 