import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import progressReducer from '../../features/progress/progressSlice';
import lessonsReducer from '../../features/lessons/lessonsSlice';
import { mockLesson, mockPremiumLesson } from './mockLessons';
import { Progress } from '../../api/progressService';
import { Lesson } from '../../api/lessonsService';

// Define interfaces directly
interface ProgressState {
  data: Progress | null;
  progress: any[];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

interface LessonsState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  filteredLessons: Lesson[];
  categories: string[];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

const mockUser = {
  userId: '1',
  email: 'test@example.com',
  name: 'Test User',
  authProvider: 'email',
  isAdmin: false,
  isPremium: false,
  createdAt: Date.now(),
};

const mockAuthState = {
  user: mockUser,
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

export const mockProgress: Progress = {
  userId: '1',
  completedLessons: {
    '1': {
      completedAt: Date.now(),
      score: 90,
      attempts: 1,
      timeSpent: 300,
      shortcuts: {
        'shortcut-1': {
          mastered: true,
          attempts: 5,
          correctAttempts: 4,
          lastAttemptAt: Date.now()
        }
      }
    }
  },
  totalLessonsCompleted: 1,
  streakDays: 3,
  lastActivityDate: Date.now(),
  updatedAt: Date.now()
};

export const mockProgressState: ProgressState = {
  data: mockProgress,
  progress: [],
  isLoading: false,
  loading: false,
  error: null
};

export const mockLessonsState: LessonsState = {
  lessons: [mockLesson],
  currentLesson: mockLesson,
  filteredLessons: [mockLesson],
  categories: ['editor'],
  isLoading: false,
  loading: false,
  error: null
};

export const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      progress: progressReducer,
      lessons: lessonsReducer,
    },
    preloadedState: {
      auth: mockAuthState,
      progress: mockProgressState,
      lessons: mockLessonsState,
      ...preloadedState,
    },
  });
};