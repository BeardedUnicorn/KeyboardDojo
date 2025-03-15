import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import {
  getUserProgress,
  updateLessonProgress,
  updateShortcutProgress,
  Progress,
  LessonCompletion,
  ShortcutProgress,
} from '../../api/progressService';

// Types
interface ProgressState {
  data: Progress | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProgressState = {
  data: null,
  isLoading: false,
  error: null,
};

// Thunks
export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async (_, { rejectWithValue }) => {
    try {
      const progress = await getUserProgress();
      return progress;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user progress');
    }
  }
);

export const saveUserLessonProgress = createAsyncThunk(
  'progress/saveLessonProgress',
  async (
    { lessonId, data }: { lessonId: string; data: Partial<LessonCompletion> },
    { rejectWithValue }
  ) => {
    try {
      const progress = await updateLessonProgress(lessonId, data);
      return progress;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update lesson progress');
    }
  }
);

export const saveUserShortcutProgress = createAsyncThunk(
  'progress/saveShortcutProgress',
  async (
    {
      lessonId,
      shortcutId,
      data,
    }: { lessonId: string; shortcutId: string; data: Partial<ShortcutProgress> },
    { rejectWithValue }
  ) => {
    try {
      const progress = await updateShortcutProgress(lessonId, shortcutId, data);
      return progress;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update shortcut progress');
    }
  }
);

// Slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action: PayloadAction<Progress>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch user progress';
      })
      
      // Save lesson progress
      .addCase(saveUserLessonProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveUserLessonProgress.fulfilled, (state, action: PayloadAction<Progress>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(saveUserLessonProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to update lesson progress';
      })
      
      // Save shortcut progress
      .addCase(saveUserShortcutProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveUserShortcutProgress.fulfilled, (state, action: PayloadAction<Progress>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(saveUserShortcutProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to update shortcut progress';
      });
  },
});

// Actions
export const { clearProgressError } = progressSlice.actions;

// Selectors
export const selectProgress = (state: RootState) => state.progress.data;
export const selectProgressLoading = (state: RootState) => state.progress.isLoading;
export const selectProgressError = (state: RootState) => state.progress.error;

// Helper selectors
export const selectLessonProgress = (state: RootState, lessonId: string) => 
  state.progress.data?.completedLessons[lessonId] || null;

export const selectShortcutProgress = (state: RootState, lessonId: string, shortcutId: string) => 
  state.progress.data?.completedLessons[lessonId]?.shortcuts[shortcutId] || null;

export const selectStreakDays = (state: RootState) => 
  state.progress.data?.streakDays || 0;

export const selectTotalLessonsCompleted = (state: RootState) => 
  state.progress.data?.totalLessonsCompleted || 0;

export default progressSlice.reducer; 