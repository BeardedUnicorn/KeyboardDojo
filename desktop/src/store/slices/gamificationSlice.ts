import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { loggerService } from '@services/loggerService';

import type { RootState } from '@/store';
import type { ICurrencyTransaction } from '@/types/gamification/currency/ICurrencyTransaction';
import type { IGamificationState } from '@/types/gamification/IGamificationState';
import type { IStreakHistoryEntry } from '@/types/gamification/streaks/IStreakHistoryEntry';
import type { IXPHistoryEntry } from '@/types/gamification/xp/IXPHistoryEntry';
import type { PayloadAction } from '@reduxjs/toolkit';

// XP thresholds for each level
const XP_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000,
];

// Define initial state
const initialState: IGamificationState = {
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

// Helper function to calculate level based on XP
const calculateLevel = (totalXP: number): number => {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Create async thunks
export const fetchGamificationData = createAsyncThunk(
  'gamification/fetchGamificationData',
  async (_, { rejectWithValue }) => {
    try {
      // This would typically call gamificationService.getData()
      // For now, we'll simulate by retrieving from localStorage
      const storedXP = localStorage.getItem('user-xp');
      const storedHearts = localStorage.getItem('user-hearts');
      const storedCurrency = localStorage.getItem('user-currency');
      const storedStreak = localStorage.getItem('user-streak');

      const data = {
        xp: storedXP ? JSON.parse(storedXP) : initialState.xp,
        hearts: storedHearts ? JSON.parse(storedHearts) : initialState.hearts,
        currency: storedCurrency ? JSON.parse(storedCurrency) : initialState.currency,
        streak: storedStreak ? JSON.parse(storedStreak) : initialState.streak,
      };

      return data;
    } catch (error) {
      loggerService.error('Error fetching gamification data', error);
      return rejectWithValue('Failed to fetch gamification data');
    }
  },
);

// XP Thunks
export const addXP = createAsyncThunk(
  'gamification/addXP',
  async (
    { amount, source, description }: {
      amount: number;
      source: string;
      description?: string;
    },
    { getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;
      const { totalXP, level } = state.gamification.xp;

      const newTotalXP = totalXP + amount;
      const newLevel = calculateLevel(newTotalXP);

      // Check if leveled up
      if (newLevel > level) {
        // Add currency reward for leveling up
        dispatch(addCurrency({ amount: 10, source: 'level_up', description: `Level up to ${newLevel}` }));
      }

      const xpEntry: IXPHistoryEntry = {
        date: new Date().toISOString(),
        amount,
        source,
        description,
      };

      return { newTotalXP, newLevel, xpEntry };
    } catch (error) {
      loggerService.error('Error adding XP', error);
      throw error;
    }
  },
);

// Hearts Thunks
export const useHearts = createAsyncThunk(
  'gamification/useHearts',
  async ({ count }: { count: number; reason: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { current, isPremium } = state.gamification.hearts;

      // Premium users have unlimited hearts
      if (isPremium) {
        return { count: 0 };
      }

      // Check if user has enough hearts
      if (current < count) {
        return rejectWithValue('Not enough hearts');
      }

      return { count };
    } catch (error) {
      loggerService.error('Error using hearts', error);
      return rejectWithValue('Failed to use hearts');
    }
  },
);

export const addHearts = createAsyncThunk(
  'gamification/addHearts',
  async ({ count }: { count: number; reason: string }) => {
    try {
      return { count };
    } catch (error) {
      loggerService.error('Error adding hearts', error);
      throw error;
    }
  },
);

// Currency Thunks
export const addCurrency = createAsyncThunk(
  'gamification/addCurrency',
  async ({ amount, source, description }: { amount: number; source: string; description?: string }) => {
    try {
      const transaction: ICurrencyTransaction = {
        date: new Date().toISOString(),
        amount,
        type: 'earn',
        source,
        description,
      };

      return { amount, transaction };
    } catch (error) {
      loggerService.error('Error adding currency', error);
      throw error;
    }
  },
);

export const spendCurrency = createAsyncThunk(
  'gamification/spendCurrency',
  async (
    { amount, source, description }: {
      amount: number;
      source: string;
      description?: string;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const { balance } = state.gamification.currency;

      // Check if user has enough currency
      if (balance < amount) {
        return rejectWithValue('Not enough currency');
      }

      const transaction: ICurrencyTransaction = {
        date: new Date().toISOString(),
        amount,
        type: 'spend',
        source,
        description,
      };

      return { amount, transaction };
    } catch (error) {
      loggerService.error('Error spending currency', error);
      return rejectWithValue('Failed to spend currency');
    }
  },
);

// Streak Thunks
export const recordPractice = createAsyncThunk(
  'gamification/recordPractice',
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const { currentStreak, lastPracticeDate } = state.gamification.streak;

      const today = new Date().toISOString().split('T')[0];

      // Check if already practiced today
      if (lastPracticeDate === today) {
        return { alreadyPracticed: true };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      // Check if continuing a streak
      const isContinuingStreak = lastPracticeDate === yesterdayString;

      // Calculate new streak
      const newStreak = isContinuingStreak ? currentStreak + 1 : 1;

      // Add streak rewards
      if (newStreak > 0) {
        // Daily streak reward
        dispatch(addXP({ amount: 10, source: 'streak', description: 'Daily streak' }));
        dispatch(addCurrency({ amount: 5, source: 'streak', description: 'Daily streak' }));

        // Weekly streak reward
        if (newStreak % 7 === 0) {
          dispatch(addXP({ amount: 50, source: 'streak', description: 'Weekly streak' }));
          dispatch(addCurrency({ amount: 15, source: 'streak', description: 'Weekly streak' }));
        }

        // Monthly streak reward
        if (newStreak % 30 === 0) {
          dispatch(addXP({ amount: 200, source: 'streak', description: 'Monthly streak' }));
          dispatch(addCurrency({ amount: 50, source: 'streak', description: 'Monthly streak' }));
        }
      }

      const streakEntry: IStreakHistoryEntry = {
        date: today,
        practiced: true,
      };

      return { newStreak, streakEntry };
    } catch (error) {
      loggerService.error('Error recording practice', error);
      throw error;
    }
  },
);

// Create the slice
const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    checkAndRegenerateHearts: (state) => {
      // Skip for premium users
      if (state.hearts.isPremium) {
        state.hearts.current = state.hearts.max;
        return;
      }

      const now = new Date();
      const lastRegeneration = new Date(state.hearts.lastRegeneration);
      const timeDiff = now.getTime() - lastRegeneration.getTime();
      const minutesPassed = Math.floor(timeDiff / (1000 * 60));
      const heartsToAdd = Math.floor(minutesPassed / 30); // 30 minutes per heart

      if (heartsToAdd > 0 && state.hearts.current < state.hearts.max) {
        const newHearts = Math.min(state.hearts.current + heartsToAdd, state.hearts.max);
        state.hearts.current = newHearts;
        state.hearts.lastRegeneration = now.toISOString();

        // Calculate next regeneration time
        if (state.hearts.current < state.hearts.max) {
          const nextRegenTime = new Date(now.getTime() + 30 * 60 * 1000);
          state.hearts.nextRegenerationTime = nextRegenTime.toISOString();
        }
      }
    },
    setPremiumStatus: (state, action: PayloadAction<boolean>) => {
      state.hearts.isPremium = action.payload;
      if (action.payload) {
        state.hearts.current = state.hearts.max;
      }
    },
    resetGamification: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch gamification data
      .addCase(fetchGamificationData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGamificationData.fulfilled, (state, action) => {
        state.xp = action.payload.xp;
        state.hearts = action.payload.hearts;
        state.currency = action.payload.currency;
        state.streak = action.payload.streak;
        state.isLoading = false;
      })
      .addCase(fetchGamificationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // XP
      .addCase(addXP.fulfilled, (state, action) => {
        const { newTotalXP, newLevel, xpEntry } = action.payload;

        // Update XP data
        state.xp.totalXP = newTotalXP;

        // Check if leveled up
        if (newLevel > state.xp.level) {
          state.xp.level = newLevel;
          state.xp.levelHistory.push({
            date: new Date().toISOString(),
            level: newLevel,
          });
        }

        // Update current level XP and next level XP
        const currentLevelThreshold = XP_THRESHOLDS[newLevel - 1] || 0;
        const nextLevelThreshold = XP_THRESHOLDS[newLevel] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1] * 2;

        state.xp.currentLevelXP = newTotalXP - currentLevelThreshold;
        state.xp.nextLevelXP = nextLevelThreshold - currentLevelThreshold;

        // Add to XP history
        state.xp.xpHistory.push(xpEntry);

        // Save to localStorage
        localStorage.setItem('user-xp', JSON.stringify(state.xp));
      })

      // Hearts
      .addCase(useHearts.fulfilled, (state, action) => {
        if (!state.hearts.isPremium) {
          state.hearts.current -= action.payload.count;

          // Update next regeneration time if needed
          if (state.hearts.current < state.hearts.max) {
            const now = new Date();
            const nextRegenTime = new Date(now.getTime() + 30 * 60 * 1000);
            state.hearts.lastRegeneration = now.toISOString();
            state.hearts.nextRegenerationTime = nextRegenTime.toISOString();
          }

          // Save to localStorage
          localStorage.setItem('user-hearts', JSON.stringify(state.hearts));
        }
      })
      .addCase(addHearts.fulfilled, (state, action) => {
        if (!state.hearts.isPremium) {
          const newHearts = Math.min(state.hearts.current + action.payload.count, state.hearts.max);
          state.hearts.current = newHearts;

          // Save to localStorage
          localStorage.setItem('user-hearts', JSON.stringify(state.hearts));
        }
      })

      // Currency
      .addCase(addCurrency.fulfilled, (state, action) => {
        state.currency.balance += action.payload.amount;
        state.currency.totalEarned += action.payload.amount;
        state.currency.transactions.push(action.payload.transaction);

        // Save to localStorage
        localStorage.setItem('user-currency', JSON.stringify(state.currency));
      })
      .addCase(spendCurrency.fulfilled, (state, action) => {
        state.currency.balance -= action.payload.amount;
        state.currency.transactions.push(action.payload.transaction);

        // Save to localStorage
        localStorage.setItem('user-currency', JSON.stringify(state.currency));
      })

      // Streak
      .addCase(recordPractice.fulfilled, (state, action) => {
        if (!action.payload.alreadyPracticed) {
          state.streak.currentStreak = action.payload.newStreak;
          state.streak.lastPracticeDate = new Date().toISOString().split('T')[0];

          // Update longest streak if needed
          if (state.streak.currentStreak > state.streak.longestStreak) {
            state.streak.longestStreak = state.streak.currentStreak;
          }

          // Add to streak history
          state.streak.streakHistory.push(action.payload.streakEntry);

          // Save to localStorage
          localStorage.setItem('user-streak', JSON.stringify(state.streak));
        }
      });
  },
});

// Export actions
export const {
  checkAndRegenerateHearts,
  setPremiumStatus,
  resetGamification,
} = gamificationSlice.actions;

// Export selectors
export const selectGamification = (state: RootState) => state.gamification;
export const selectXP = (state: RootState) => state.gamification.xp;
export const selectLevel = (state: RootState) => state.gamification.xp.level;
export const selectHearts = (state: RootState) => state.gamification.hearts;
export const selectCurrency = (state: RootState) => state.gamification.currency;
export const selectStreak = (state: RootState) => state.gamification.streak;
export const selectCurrentStreak = (state: RootState) => state.gamification.streak.currentStreak;
export const selectLongestStreak = (state: RootState) => state.gamification.streak.longestStreak;
export const selectIsGamificationLoading = (state: RootState) => state.gamification.isLoading;

// Export reducer
export default gamificationSlice.reducer;
