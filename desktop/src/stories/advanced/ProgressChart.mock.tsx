/**
 * ProgressChart.mock.tsx
 * 
 * Mock data and wrapper component for the CurriculumProgressChart to ensure
 * consistent test data and rendering environments.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, CircularProgress } from '@mui/material';
import type { IApplicationTrack } from '../../types/progress/ICurriculum';

// Extend Window interface to include our global mock properties
declare global {
  interface Window {
    curriculum?: {
      tracks: IApplicationTrack[];
      activeCurriculum: {
        id: string;
        tracks: IApplicationTrack[];
        metadata: any;
        paths: any[];
        lessons: any[];
      };
    };
    userProgress?: {
      userId: string;
      xp: number;
      level: number;
      streakDays: number;
      currentStreak: number;
      lastActivity: string;
      achievements: any[];
      completedLessons: Record<string, boolean>;
      completedModules: Record<string, boolean>;
      trackProgress: Record<string, any>;
    };
  }
}

// Setup function to ensure the global mocks are available
export const setupProgressChartGlobals = () => {
  // Use the global mock data from setup-test-environment.js
  if (typeof window === 'undefined') {
    return;
  }

  // Initialize window.curriculum if it doesn't exist
  if (!window.curriculum) {
    window.curriculum = {
      tracks: [],
      activeCurriculum: {
        id: 'mock-curriculum',
        tracks: [],
        metadata: {},
        paths: [],
        lessons: []
      }
    };
  }

  // Ensure the tracks array is populated in activeCurriculum
  if (window.curriculum.activeCurriculum) {
    window.curriculum.activeCurriculum.tracks = window.curriculum.tracks || [];
  }

  // Initialize window.userProgress if it doesn't exist
  if (!window.userProgress) {
    window.userProgress = {
      userId: 'user123',
      xp: 500,
      level: 3,
      streakDays: 5,
      currentStreak: 5,
      lastActivity: new Date().toISOString(),
      achievements: [],
      completedLessons: {},
      completedModules: {},
      trackProgress: {}
    };
  }
};

// Create a mock store using the global mock data
const createMockStore = (loading = false, noData = false) => {
  // Create a default user progress object with required fields
  const defaultUserProgress = {
    userId: 'user123',
    xp: 500,
    level: 3,
    streakDays: 5,
    currentStreak: 5,
    lastActivity: new Date().toISOString(),
    completedLessons: {},
    completedModules: {},
    trackProgress: {},
  };

  return configureStore({
    reducer: {
      app: () => ({
        isInitialized: true,
        isLoading: false,
        error: null,
        theme: 'light',
        messages: [],
        version: '1.0.0'
      }),
      curriculum: () => ({
        tracks: noData ? [] : window.curriculum?.tracks || [],
        activeCurriculum: noData ? null : window.curriculum?.activeCurriculum,
        currentCurriculum: noData ? null : window.curriculum?.activeCurriculum,
        isLoading: loading,
        error: null
      }),
      progress: () => ({
        userProgress: noData ? null : (window.userProgress || defaultUserProgress),
        isLoading: loading,
        error: null
      }),
      user: () => ({
        isAuthenticated: true,
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          preferences: {
            theme: 'light'
          },
          achievements: []
        },
        isLoading: false,
        error: null
      })
    }
  });
};

// Theme provider for consistent styling
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Wrapper component to provide all the necessary context
export const ProgressChartWrapper: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  noData?: boolean;
}> = ({ children, loading = false, noData = false }) => {
  const store = createMockStore(loading, noData);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </ThemeProvider>
    </Provider>
  );
}; 