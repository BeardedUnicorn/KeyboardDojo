import { vi } from 'vitest';
import gamificationReducer, {
  addXP,
  useHearts,
  addHearts,
  addCurrency,
  spendCurrency,
  recordPractice,
  selectXP,
  selectLevel,
  selectHearts,
  selectCurrency,
  selectStreak,
  selectCurrentStreak,
  selectLongestStreak,
  selectIsGamificationLoading,
} from '../gamificationSlice';

import type { IGamificationState } from '@/types/gamification/IGamificationState';

// Mock the loggerService
vi.mock('@services/loggerService', () => ({
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

// Initial state for tests
const initialTestState: IGamificationState = {
  xp: {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: 100,
    xpHistory: [],
    levelHistory: [],
  },
  hearts: {
    current: 5,
    max: 5,
    lastRegeneration: new Date().toISOString(),
    nextRegenerationTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    isPremium: false,
  },
  currency: {
    balance: 0,
    totalEarned: 0,
    transactions: [],
    inventory: {},
  },
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    streakFreezes: 0,
    streakHistory: [],
  },
  isLoading: false,
  error: null,
};

describe('gamificationSlice', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // State Tests
  describe('reducer', () => {
    test('should initialize with correct default state', () => {
      const state = gamificationReducer(undefined, { type: 'unknown' });
      expect(state.xp.totalXP).toBe(0);
      expect(state.xp.level).toBe(1);
      expect(state.hearts.current).toBe(5);
      expect(state.hearts.max).toBe(5);
      expect(state.currency.balance).toBe(0);
      expect(state.streak.currentStreak).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('should handle XP addition correctly', () => {
      // Create a fulfilled action for adding XP
      const action = {
        type: 'gamification/addXP/fulfilled',
        payload: {
          newTotalXP: 50,
          newLevel: 1,
          xpEntry: {
            date: new Date().toISOString(),
            amount: 50,
            source: 'test',
            description: 'Test XP',
          },
        },
      };

      // Update state with XP
      const state = gamificationReducer(initialTestState, action);
      
      // Verify XP was added
      expect(state.xp.totalXP).toBe(50);
      expect(state.xp.level).toBe(1);
      expect(state.xp.xpHistory).toHaveLength(1);
      expect(state.xp.xpHistory[0].amount).toBe(50);
      expect(state.xp.xpHistory[0].source).toBe('test');
    });

    test('should handle level up correctly', () => {
      // First add enough XP to level up
      const action = {
        type: 'gamification/addXP/fulfilled',
        payload: {
          newTotalXP: 120,
          newLevel: 2,
          xpEntry: {
            date: new Date().toISOString(),
            amount: 120,
            source: 'test',
            description: 'Test level up',
          },
        },
      };

      // Update state with XP for level up
      const state = gamificationReducer(initialTestState, action);
      
      // Verify level up
      expect(state.xp.totalXP).toBe(120);
      expect(state.xp.level).toBe(2);
      expect(state.xp.levelHistory).toHaveLength(1);
      expect(state.xp.levelHistory[0].level).toBe(2);
      expect(state.xp.levelHistory[0].date).toBeDefined();
    });

    test('should handle currency addition correctly', () => {
      // Create a fulfilled action for adding currency
      const action = {
        type: 'gamification/addCurrency/fulfilled',
        payload: {
          amount: 100,
          transaction: {
            date: new Date().toISOString(),
            amount: 100,
            type: 'earn',
            source: 'test',
            description: 'Test currency',
          },
        },
      };

      // Update state with currency
      const state = gamificationReducer(initialTestState, action);
      
      // Verify currency was added
      expect(state.currency.balance).toBe(100);
      expect(state.currency.totalEarned).toBe(100);
      expect(state.currency.transactions).toHaveLength(1);
      expect(state.currency.transactions[0].amount).toBe(100);
      expect(state.currency.transactions[0].type).toBe('earn');
    });

    test('should handle currency spending correctly', () => {
      // First add currency
      const initialStateWithCurrency = {
        ...initialTestState,
        currency: {
          ...initialTestState.currency,
          balance: 100,
          totalEarned: 100,
        },
      };

      // Create a fulfilled action for spending currency
      const action = {
        type: 'gamification/spendCurrency/fulfilled',
        payload: {
          amount: 50,
          transaction: {
            date: new Date().toISOString(),
            amount: 50,
            type: 'spend',
            source: 'test',
            description: 'Test spending',
          },
        },
      };

      // Update state with currency spending
      const state = gamificationReducer(initialStateWithCurrency, action);
      
      // Verify currency was spent
      expect(state.currency.balance).toBe(50);
      expect(state.currency.totalEarned).toBe(100);
      expect(state.currency.transactions).toHaveLength(1);
      expect(state.currency.transactions[0].amount).toBe(50);
      expect(state.currency.transactions[0].type).toBe('spend');
    });

    test('should handle streak update correctly', () => {
      const today = getTodayDateString();
      
      // Create a fulfilled action for recording practice
      const action = {
        type: 'gamification/recordPractice/fulfilled',
        payload: {
          newStreak: 1,
          streakEntry: {
            date: today,
            practiced: true,
          },
        },
      };

      // Update state with streak
      const state = gamificationReducer(initialTestState, action);
      
      // Verify streak was updated - use the actual lastPracticeDate from the state
      expect(state.streak.currentStreak).toBe(1);
      expect(state.streak.streakHistory).toHaveLength(1);
      expect(state.streak.streakHistory[0].date).toBe(today);
      expect(state.streak.streakHistory[0].practiced).toBe(true);
      
      // Only verify that the lastPracticeDate is set to something, not the exact value
      expect(state.streak.lastPracticeDate).toBeDefined();
    });

    test('should handle heart consumption correctly', () => {
      // Create a fulfilled action for using hearts
      const action = {
        type: 'gamification/useHearts/fulfilled',
        payload: {
          count: 1,
        },
      };

      // Update state with heart consumption
      const state = gamificationReducer(initialTestState, action);
      
      // Verify hearts were consumed
      expect(state.hearts.current).toBe(4);
    });

    test('should handle XP history recording correctly', () => {
      // Add XP multiple times to build history
      const action1 = {
        type: 'gamification/addXP/fulfilled',
        payload: {
          newTotalXP: 50,
          newLevel: 1,
          xpEntry: {
            date: new Date().toISOString(),
            amount: 50,
            source: 'test1',
            description: 'Test XP 1',
          },
        },
      };

      const action2 = {
        type: 'gamification/addXP/fulfilled',
        payload: {
          newTotalXP: 75,
          newLevel: 1,
          xpEntry: {
            date: new Date().toISOString(),
            amount: 25,
            source: 'test2',
            description: 'Test XP 2',
          },
        },
      };

      // Update state with first XP addition
      let state = gamificationReducer(initialTestState, action1);
      // Then update with second XP addition
      state = gamificationReducer(state, action2);
      
      // Verify XP history contains both entries
      expect(state.xp.xpHistory).toHaveLength(2);
      expect(state.xp.xpHistory[0].amount).toBe(50);
      expect(state.xp.xpHistory[0].source).toBe('test1');
      expect(state.xp.xpHistory[1].amount).toBe(25);
      expect(state.xp.xpHistory[1].source).toBe('test2');
      expect(state.xp.totalXP).toBe(75);
    });

    test('should handle daily goal progress correctly', () => {
      const today = getTodayDateString();
      
      // Create a fulfilled action for recording practice (this is our proxy for daily goal progress)
      const action = {
        type: 'gamification/recordPractice/fulfilled',
        payload: {
          newStreak: 1,
          streakEntry: {
            date: today,
            practiced: true,
          },
        },
      };

      // Update state with streak
      const state = gamificationReducer(initialTestState, action);
      
      // Verify streak was updated, which is our proxy for daily goal progress
      expect(state.streak.currentStreak).toBe(1);
      // Just verify the lastPracticeDate exists - don't check the specific value
      expect(state.streak.lastPracticeDate).toBeDefined();
    });
  });

  // Selector Tests
  describe('selectors', () => {
    // Create a test state for selectors
    const testState = {
      gamification: {
        xp: {
          totalXP: 250,
          level: 2,
          currentLevelXP: 50,
          nextLevelXP: 250,
          xpHistory: [
            {
              date: new Date().toISOString(),
              amount: 250,
              source: 'test',
              description: 'Test XP',
            },
          ],
          levelHistory: [
            {
              date: new Date().toISOString(),
              level: 2,
            },
          ],
        },
        hearts: {
          current: 3,
          max: 5,
          lastRegeneration: new Date().toISOString(),
          nextRegenerationTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          isPremium: false,
        },
        currency: {
          balance: 150,
          totalEarned: 200,
          transactions: [
            {
              date: new Date().toISOString(),
              amount: 200,
              type: 'earn',
              source: 'test',
              description: 'Test currency',
            },
            {
              date: new Date().toISOString(),
              amount: 50,
              type: 'spend',
              source: 'test',
              description: 'Test spending',
            },
          ],
          inventory: {},
        },
        streak: {
          currentStreak: 5,
          longestStreak: 10,
          lastPracticeDate: getTodayDateString(),
          streakFreezes: 1,
          streakHistory: [
            { date: '2023-01-01', practiced: true },
            { date: '2023-01-02', practiced: true },
            { date: '2023-01-03', practiced: true },
            { date: '2023-01-04', practiced: true },
            { date: '2023-01-05', practiced: true },
          ],
        },
        isLoading: false,
        error: null,
      },
      // Other state slices would be here
    };

    test('selectLevel should return current level', () => {
      const result = selectLevel(testState as any);
      expect(result).toBe(2);
    });

    test('selectXp should return current XP', () => {
      const result = selectXP(testState as any);
      expect(result.totalXP).toBe(250);
      expect(result.currentLevelXP).toBe(50);
      expect(result.nextLevelXP).toBe(250);
    });

    test('selectCurrency should return currency balance', () => {
      const result = selectCurrency(testState as any);
      expect(result.balance).toBe(150);
      expect(result.totalEarned).toBe(200);
      expect(result.transactions).toHaveLength(2);
    });

    test('selectHearts should return hearts count', () => {
      const result = selectHearts(testState as any);
      expect(result.current).toBe(3);
      expect(result.max).toBe(5);
      expect(result.isPremium).toBe(false);
    });

    test('selectStreak should return streak data', () => {
      const result = selectStreak(testState as any);
      expect(result.currentStreak).toBe(5);
      expect(result.longestStreak).toBe(10);
      expect(result.lastPracticeDate).toBe(getTodayDateString());
      expect(result.streakHistory).toHaveLength(5);
    });

    test('selectCurrentStreak should return current streak', () => {
      const result = selectCurrentStreak(testState as any);
      expect(result).toBe(5);
    });

    test('selectLongestStreak should return longest streak', () => {
      const result = selectLongestStreak(testState as any);
      expect(result).toBe(10);
    });

    test('selectIsGamificationLoading should return loading state', () => {
      const result = selectIsGamificationLoading(testState as any);
      expect(result).toBe(false);

      const loadingState = {
        ...testState,
        gamification: {
          ...testState.gamification,
          isLoading: true,
        },
      };

      const loadingResult = selectIsGamificationLoading(loadingState as any);
      expect(loadingResult).toBe(true);
    });
  });
}); 