import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { loggerService } from '@/services';

import type { RootState } from '@/store';
import type { ApplicationType } from '@/types/progress/ICurriculum';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define types
interface CompletedLesson {
  curriculumId: string;
  trackId: ApplicationType;
  lessonId: string;
  completedAt: string;
  score: number;
  timeSpent: number; // in seconds
}

interface CurrentLesson {
  trackId: ApplicationType;
  lessonId: string;
  progress: number; // 0-100
}

interface Hearts {
  current: number;
  max: number;
  lastRegeneration: string;
}

interface CompletedModule {
  curriculumId: string;
  trackId: ApplicationType;
  moduleId: string;
  completedAt: string;
}

interface CompletedNode {
  nodeId: string;
  completedAt: string;
  stars: number; // 1-3 stars based on performance
}

interface UserProgressState {
  completedLessons: CompletedLesson[];
  completedModules: CompletedModule[];
  completedNodes: CompletedNode[];
  currentLessons: CurrentLesson[];
  xp: number;
  level: number;
  streakDays: number;
  lastActivity: string;
  hearts: Hearts;
  currency: number;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: UserProgressState = {
  completedLessons: [],
  completedModules: [],
  completedNodes: [],
  currentLessons: [],
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActivity: new Date().toISOString(),
  hearts: {
    current: 5,
    max: 5,
    lastRegeneration: new Date().toISOString(),
  },
  currency: 0,
  isLoading: false,
  error: null,
};

// Create async thunks
export const fetchUserProgress = createAsyncThunk(
  'userProgress/fetchUserProgress',
  async (_, { rejectWithValue }) => {
    try {
      // This would typically call userProgressService.getProgress()
      // For now, we'll simulate by retrieving from localStorage
      const storedProgress = localStorage.getItem('userProgress');
      if (storedProgress) {
        return JSON.parse(storedProgress);
      }
      return initialState;
    } catch (error) {
      loggerService.error('Error fetching user progress', error);
      return rejectWithValue('Failed to fetch user progress');
    }
  },
);

export const markLessonCompleted = createAsyncThunk(
  'userProgress/markLessonCompleted',
  async (
    {
      curriculumId,
      trackId,
      lessonId,
      score = 100,
      timeSpent = 0,
    }: {
      curriculumId: string;
      trackId: ApplicationType;
      lessonId: string;
      score?: number;
      timeSpent?: number;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      // This would typically call userProgressService.completeLesson()
      const completedLesson: CompletedLesson = {
        curriculumId,
        trackId,
        lessonId,
        completedAt: new Date().toISOString(),
        score,
        timeSpent,
      };

      return completedLesson;
    } catch (error) {
      loggerService.error('Error marking lesson as completed', error);
      return rejectWithValue('Failed to mark lesson as completed');
    }
  },
);

// Create the slice
const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState,
  reducers: {
    setCurrentLesson: (state, action: PayloadAction<CurrentLesson>) => {
      const { trackId, lessonId, progress } = action.payload;
      const existingLessonIndex = state.currentLessons.findIndex(
        (lesson) => lesson.trackId === trackId,
      );

      if (existingLessonIndex !== -1) {
        state.currentLessons[existingLessonIndex] = {
          trackId,
          lessonId,
          progress,
        };
      } else {
        state.currentLessons.push({
          trackId,
          lessonId,
          progress,
        });
      }
    },
    addXp: (state, action: PayloadAction<number>) => {
      state.xp += action.payload;
      // Update level based on XP (simplified version)
      if (state.xp >= 100 && state.level === 1) {
        state.level = 2;
      } else if (state.xp >= 250 && state.level === 2) {
        state.level = 3;
      }
      // Additional level thresholds would be implemented here
    },
    updateStreak: (state) => {
      const today = new Date().toISOString().split('T')[0];
      const lastActivityDate = state.lastActivity.split('T')[0];

      if (lastActivityDate !== today) {
        const lastDate = new Date(lastActivityDate);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          state.streakDays += 1;
        } else if (diffDays > 1) {
          // Streak broken
          state.streakDays = 1;
        }

        state.lastActivity = new Date().toISOString();
      }
    },
    updateHearts: (state, action: PayloadAction<{ current: number }>) => {
      state.hearts.current = action.payload.current;
      if (state.hearts.current > state.hearts.max) {
        state.hearts.current = state.hearts.max;
      }
      state.hearts.lastRegeneration = new Date().toISOString();
    },
    updateCurrency: (state, action: PayloadAction<number>) => {
      state.currency += action.payload;
    },
    resetProgress: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        return {
          ...action.payload,
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markLessonCompleted.fulfilled, (state, action) => {
        state.completedLessons.push(action.payload);
        state.lastActivity = new Date().toISOString();
      });
  },
});

// Export actions
export const {
  setCurrentLesson,
  addXp,
  updateStreak,
  updateHearts,
  updateCurrency,
  resetProgress,
} = userProgressSlice.actions;

// Export selectors
export const selectUserProgress = (state: RootState) => state.userProgress;
export const selectCompletedLessons = (state: RootState) => state.userProgress.completedLessons;
export const selectXp = (state: RootState) => state.userProgress.xp;
export const selectLevel = (state: RootState) => state.userProgress.level;
export const selectStreakDays = (state: RootState) => state.userProgress.streakDays;
export const selectHearts = (state: RootState) => state.userProgress.hearts;
export const selectCurrency = (state: RootState) => state.userProgress.currency;
export const selectIsLessonCompleted = (state: RootState, lessonId: string) =>
  state.userProgress.completedLessons.some((lesson) => lesson.lessonId === lessonId);
export const selectIsModuleCompleted = (
  state: RootState,
  curriculumId: string,
  trackId: ApplicationType,
  moduleId: string,
) =>
  state.userProgress.completedModules.some(
    (module) =>
      module.curriculumId === curriculumId &&
      module.trackId === trackId &&
      module.moduleId === moduleId,
  );
export const selectIsNodeCompleted = (state: RootState, nodeId: string) =>
  state.userProgress.completedNodes.some((node) => node.nodeId === nodeId);
export const selectCurrentLesson = (state: RootState, trackId: ApplicationType) =>
  state.userProgress.currentLessons.find((lesson) => lesson.trackId === trackId) || null;

// Export reducer
export default userProgressSlice.reducer;
