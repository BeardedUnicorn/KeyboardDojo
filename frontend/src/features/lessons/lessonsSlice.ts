import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { getAllLessons, getLessonById, getLessonsByCategory, Lesson } from '../../api/lessonsService';

// Types
interface LessonsState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  filteredLessons: Lesson[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: LessonsState = {
  lessons: [],
  currentLesson: null,
  filteredLessons: [],
  categories: [],
  isLoading: false,
  error: null,
};

// Thunks
export const fetchAllLessons = createAsyncThunk(
  'lessons/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const lessons = await getAllLessons();
      return lessons;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lessons');
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchById',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const lesson = await getLessonById(lessonId);
      return lesson;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lesson');
    }
  }
);

export const fetchLessonsByCategory = createAsyncThunk(
  'lessons/fetchByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const lessons = await getLessonsByCategory(category);
      return { category, lessons };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : `Failed to fetch ${category} lessons`);
    }
  }
);

// Slice
const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setCurrentLesson: (state, action: PayloadAction<Lesson | null>) => {
      state.currentLesson = action.payload;
    },
    filterLessonsByCategory: (state, action: PayloadAction<string>) => {
      if (action.payload === 'all') {
        state.filteredLessons = state.lessons;
      } else {
        state.filteredLessons = state.lessons.filter(
          lesson => lesson.category === action.payload
        );
      }
    },
    clearLessonsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all lessons
      .addCase(fetchAllLessons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllLessons.fulfilled, (state, action: PayloadAction<Lesson[]>) => {
        state.isLoading = false;
        state.lessons = action.payload;
        state.filteredLessons = action.payload;
        
        // Extract unique categories
        const categories = new Set<string>();
        action.payload.forEach(lesson => categories.add(lesson.category));
        state.categories = Array.from(categories);
      })
      .addCase(fetchAllLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch lessons';
      })
      
      // Fetch lesson by ID
      .addCase(fetchLessonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action: PayloadAction<Lesson>) => {
        state.isLoading = false;
        state.currentLesson = action.payload;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch lesson';
      })
      
      // Fetch lessons by category
      .addCase(fetchLessonsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByCategory.fulfilled, (state, action: PayloadAction<{ category: string; lessons: Lesson[] }>) => {
        state.isLoading = false;
        state.filteredLessons = action.payload.lessons;
      })
      .addCase(fetchLessonsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch lessons by category';
      });
  },
});

// Actions
export const { setCurrentLesson, filterLessonsByCategory, clearLessonsError } = lessonsSlice.actions;

// Selectors
export const selectAllLessons = (state: RootState) => state.lessons.lessons;
export const selectFilteredLessons = (state: RootState) => state.lessons.filteredLessons;
export const selectCurrentLesson = (state: RootState) => state.lessons.currentLesson;
export const selectCategories = (state: RootState) => state.lessons.categories;
export const selectLessonsLoading = (state: RootState) => state.lessons.isLoading;
export const selectLessonsError = (state: RootState) => state.lessons.error;

export default lessonsSlice.reducer; 