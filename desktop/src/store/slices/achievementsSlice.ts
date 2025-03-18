import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { loggerService } from '@/services';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';

import type { RootState } from '@/store';
import type { IAchievement as AchievementType } from '@/types/achievements/IAchievement';
import type { IAchievementsState } from '@/types/achievements/IAchievementsState';
import type { IAchievementWithProgress } from '@/types/achievements/IAchievementWithProgress';

// Define available achievements
const availableAchievements: AchievementType[] = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎓',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.COMMON,
    xpReward: 10,
    condition: {
      type: 'lesson_complete',
      target: 1,
    },
  },
  {
    id: 'complete_lesson',
    title: 'Quick Learner',
    description: 'Complete 5 lessons',
    icon: '📚',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.COMMON,
    xpReward: 25,
    condition: {
      type: 'lesson_complete',
      target: 5,
    },
  },
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: AchievementCategory.STREAKS,
    rarity: AchievementRarity.COMMON,
    xpReward: 15,
    condition: {
      type: 'streak_days',
      target: 3,
    },
  },
  {
    id: 'streak_7',
    title: 'Consistency is Key',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: AchievementCategory.STREAKS,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 30,
    condition: {
      type: 'streak_days',
      target: 7,
    },
  },
  {
    id: 'perfect_score',
    title: 'Perfectionist',
    description: 'Get a perfect score on a lesson',
    icon: '⭐',
    category: AchievementCategory.MASTERY,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 20,
    condition: {
      type: 'perfect_score',
      target: 1,
    },
  },
];

// Define initial state
const initialState: IAchievementsState = {
  achievements: availableAchievements,
  unlockedAchievements: [],
  completedAchievements: [],
  isLoading: false,
  error: null,
};

// Create async thunks
export const fetchAchievements = createAsyncThunk(
  'achievements/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      // This would typically call achievementsService.getAchievements()
      // For now, we'll simulate by retrieving from localStorage
      const storedAchievements = localStorage.getItem('achievements');
      if (storedAchievements) {
        return JSON.parse(storedAchievements);
      }
      return {
        achievements: availableAchievements,
        unlockedAchievements: [],
        completedAchievements: [],
      };
    } catch (error) {
      loggerService.error('Error fetching achievements', error);
      return rejectWithValue('Failed to fetch achievements');
    }
  },
);

export const awardAchievement = createAsyncThunk(
  'achievements/awardAchievement',
  async (achievementId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const achievement = state.achievements.achievements.find((a) => a.id === achievementId);

      if (!achievement) {
        return rejectWithValue(`Achievement with ID ${achievementId} not found`);
      }

      // Create an AchievementWithProgress object
      const achievementProgress: IAchievementWithProgress = {
        achievement,
        completed: true,
        completedDate: new Date().toISOString(),
        progress: 100,
      };

      return achievementProgress;
    } catch (error) {
      loggerService.error('Error awarding achievement', error);
      return rejectWithValue('Failed to award achievement');
    }
  },
);

// Create the slice
const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    refreshAchievements: (state) => {
      // This is a placeholder for a more complex refresh logic
      // In a real app, this would trigger the fetchAchievements thunk
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload.achievements;
        state.unlockedAchievements = action.payload.unlockedAchievements;
        state.completedAchievements = action.payload.completedAchievements;
        state.isLoading = false;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(awardAchievement.fulfilled, (state, action) => {
        const updatedAchievement = action.payload;

        // Update the achievement in the achievements array
        const achievementIndex = state.achievements.findIndex((a) => a.id === updatedAchievement.achievement.id);
        if (achievementIndex !== -1) {
          state.achievements[achievementIndex] = updatedAchievement.achievement;
        }

        // Add to unlockedAchievements if not already there
        if (!state.unlockedAchievements.some((a) => a.id === updatedAchievement.achievement.id)) {
          state.unlockedAchievements.push(updatedAchievement.achievement);
        }

        // Add to completedAchievements if not already there
        if (!state.completedAchievements.some((a) => a.achievement.id === updatedAchievement.achievement.id)) {
          state.completedAchievements.push(updatedAchievement);
        }

        // Save to localStorage (this would be handled by a middleware in a real app)
        localStorage.setItem('achievements', JSON.stringify({
          achievements: state.achievements,
          unlockedAchievements: state.unlockedAchievements,
          completedAchievements: state.completedAchievements,
        }));
      });
  },
});

// Export actions
export const { refreshAchievements } = achievementsSlice.actions;

// Export selectors
export const selectAchievements = (state: RootState) => state.achievements.achievements;
export const selectUnlockedAchievements = (state: RootState) => state.achievements.unlockedAchievements;
export const selectCompletedAchievements = (state: RootState) => state.achievements.completedAchievements;
export const selectIsAchievementsLoading = (state: RootState) => state.achievements.isLoading;
export const selectHasAchievement = (state: RootState, achievementId: string) =>
  state.achievements.unlockedAchievements.some((achievement) => achievement.id === achievementId);

// Export reducer
export default achievementsSlice.reducer;
