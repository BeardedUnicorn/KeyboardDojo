import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { loggerService } from '@services/loggerService';

import type { RootState } from '@/store';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';
import type { ICurriculumState } from '@/types/ICurriculumState';
import type { ApplicationType, IModule, PathNode } from '@/types/progress/ICurriculum';

// Define initial state
const initialState: ICurriculumState = {
  curriculums: [],
  activeCurriculumId: null,
  tracks: [],
  activeTrackId: null,
  modules: [],
  lessons: [],
  paths: [],
  pathNodes: [],
  isLoading: false,
  error: null,
};

// Create async thunks
export const fetchCurriculumData = createAsyncThunk(
  'curriculum/fetchCurriculumData',
  async (_, { rejectWithValue }) => {
    let success = false;
    let result = null;
    
    try {
      // This would typically call curriculumService.getActiveCurriculum()
      // For now, we'll simulate by retrieving from a mock API or local data
      // In a real app, this would fetch from an API or local storage

      // For demonstration purposes, we'll return an empty object
      result = {
        curriculums: [],
        activeCurriculumId: null,
        tracks: [],
        activeTrackId: null,
        modules: [],
        lessons: [],
        paths: [],
        pathNodes: [],
      };
      success = true;
    } catch (error) {
      loggerService.error('Error fetching curriculum data', error);
    }
    
    if (success) {
      return result;
    } else {
      return rejectWithValue('Failed to fetch curriculum data');
    }
  },
);

export const setActiveCurriculum = createAsyncThunk(
  'curriculum/setActiveCurriculum',
  async (curriculumId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const curriculum = state.curriculum.curriculums.find((c) => c.id === curriculumId);

      if (!curriculum) {
        return rejectWithValue(`Curriculum with ID ${curriculumId} not found`);
      }

      return { curriculumId, curriculum };
    } catch (error) {
      loggerService.error('Error setting active curriculum', error);
      return rejectWithValue('Failed to set active curriculum');
    }
  },
);

export const setActiveTrack = createAsyncThunk(
  'curriculum/setActiveTrack',
  async (trackId: ApplicationType, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const track = state.curriculum.tracks.find((t) => t.id === trackId);

      if (!track) {
        return rejectWithValue(`Track with ID ${trackId} not found`);
      }

      return { trackId, track };
    } catch (error) {
      loggerService.error('Error setting active track', error);
      return rejectWithValue('Failed to set active track');
    }
  },
);

export const fetchLessonById = createAsyncThunk(
  'curriculum/fetchLessonById',
  async (lessonId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const lesson = state.curriculum.lessons.find((l) => l.id === lessonId);

      if (!lesson) {
        return rejectWithValue(`Lesson with ID ${lessonId} not found`);
      }

      return lesson;
    } catch (error) {
      loggerService.error('Error fetching lesson', error);
      return rejectWithValue('Failed to fetch lesson');
    }
  },
);

export const fetchModuleById = createAsyncThunk(
  'curriculum/fetchModuleById',
  async (moduleId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const module = state.curriculum.modules.find((m) => m.id === moduleId);

      if (!module) {
        return rejectWithValue(`Module with ID ${moduleId} not found`);
      }

      return module;
    } catch (error) {
      loggerService.error('Error fetching module', error);
      return rejectWithValue('Failed to fetch module');
    }
  },
);

export const fetchPathNodeById = createAsyncThunk(
  'curriculum/fetchPathNodeById',
  async (nodeId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const node = state.curriculum.pathNodes.find((n) => n.id === nodeId);

      if (!node) {
        return rejectWithValue(`Path node with ID ${nodeId} not found`);
      }

      return node;
    } catch (error) {
      loggerService.error('Error fetching path node', error);
      return rejectWithValue('Failed to fetch path node');
    }
  },
);

// Create the slice
const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState,
  reducers: {
    resetCurriculum: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch curriculum data
      .addCase(fetchCurriculumData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumData.fulfilled, (state, action) => {
        state.curriculums = action.payload.curriculums;
        state.activeCurriculumId = action.payload.activeCurriculumId;
        state.tracks = action.payload.tracks;
        state.activeTrackId = action.payload.activeTrackId;
        state.modules = action.payload.modules;
        state.lessons = action.payload.lessons;
        state.paths = action.payload.paths;
        state.pathNodes = action.payload.pathNodes;
        state.isLoading = false;
      })
      .addCase(fetchCurriculumData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Set active curriculum
      .addCase(setActiveCurriculum.fulfilled, (state, action) => {
        state.activeCurriculumId = action.payload.curriculumId;
        // Update tracks, modules, lessons, paths, and pathNodes based on the active curriculum
        const curriculum = action.payload.curriculum;
        state.tracks = curriculum.tracks;
        state.paths = curriculum.paths;

        // Extract modules, lessons, and pathNodes from the curriculum
        const modules: IModule[] = [];
        const lessons: ILesson[] = [];
        const pathNodes: PathNode[] = [];

        // Extract modules and lessons from tracks
        curriculum.tracks.forEach((track) => {
          modules.push(...track.modules);
          track.modules.forEach((module) => {
            lessons.push(...module.lessons);
          });
        });

        // Extract pathNodes from paths
        curriculum.paths.forEach((path) => {
          pathNodes.push(...path.nodes);
        });

        state.modules = modules;
        state.lessons = lessons;
        state.pathNodes = pathNodes;
      })

      // Set active track
      .addCase(setActiveTrack.fulfilled, (state, action) => {
        state.activeTrackId = action.payload.trackId;
      });
  },
});

// Export actions
export const { resetCurriculum } = curriculumSlice.actions;

// Export selectors
export const selectCurriculum = (state: RootState) => state.curriculum;
export const selectCurriculums = (state: RootState) => state.curriculum.curriculums;
export const selectActiveCurriculumId = (state: RootState) => state.curriculum.activeCurriculumId;
export const selectTracks = (state: RootState) => state.curriculum.tracks;
export const selectActiveTrackId = (state: RootState) => state.curriculum.activeTrackId;
export const selectModules = (state: RootState) => state.curriculum.modules;
export const selectLessons = (state: RootState) => state.curriculum.lessons;
export const selectPaths = (state: RootState) => state.curriculum.paths;
export const selectPathNodes = (state: RootState) => state.curriculum.pathNodes;
export const selectIsCurriculumLoading = (state: RootState) => state.curriculum.isLoading;

// Additional selectors for filtering
export const selectModulesByTrack = (state: RootState, trackId: ApplicationType) =>
  state.curriculum.modules.filter((module) =>
    state.curriculum.tracks.find((track) => track.id === trackId)?.modules.some((m) => m.id === module.id),
  );

export const selectLessonsByModule = (state: RootState, moduleId: string) =>
  state.curriculum.lessons.filter((lesson) =>
    state.curriculum.modules.find((module) => module.id === moduleId)?.lessons.some((l) => l.id === lesson.id),
  );

export const selectLessonsByDifficulty = (state: RootState, difficulty: DifficultyLevel) =>
  state.curriculum.lessons.filter((lesson) => lesson.difficulty === difficulty);

export const selectModulesByCategory = (state: RootState, category: ShortcutCategory) =>
  state.curriculum.modules.filter((module) => module.category === category);

export const selectPathsByTrack = (state: RootState, trackId: ApplicationType) =>
  state.curriculum.paths.filter((path) => path.trackId === trackId);

export const selectPathNodesByPath = (state: RootState, pathId: string) =>
  state.curriculum.pathNodes.filter((node) =>
    state.curriculum.paths.find((path) => path.id === pathId)?.nodes.some((n) => n.id === node.id),
  );

// Export reducer
export default curriculumSlice.reducer;
