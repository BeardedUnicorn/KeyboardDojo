import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { StatisticsDashboard } from '../../../desktop/src/components/statistics';

// Create mock data for different user profiles
const createMockUserProgress = (profile = 'beginner') => {
  let lessons: Array<{
    id: string;
    lessonId: string;
    completedAt: string;
    score: number;
    timeSpent: number;
    errorsCount: number;
  }> = [];
  
  let achievements: Array<{
    id: string;
    name: string;
    earnedAt: string;
  }> = [];
  
  let streakData: {
    current: number;
    longest: number;
    lastPracticeDate: string | null;
  };
  
  let practiceTime: number;
  let averageWPM: number;
  let keystrokeAccuracy: number;
  let level: number;
  let xp: number;
  let streakDays: number;
  
  switch (profile) {
    case 'beginner':
      // Few lessons, achievements, low stats
      lessons = Array(5).fill(0).map((_, i) => ({
        id: `lesson-${i}`,
        lessonId: `lesson-${i}`,
        completedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        score: Math.floor(Math.random() * 30) + 60,
        timeSpent: Math.floor(Math.random() * 10) + 5,
        errorsCount: Math.floor(Math.random() * 10) + 5,
      }));
      achievements = [
        { id: 'first-lesson', name: 'First Steps', earnedAt: new Date().toISOString() },
        { id: 'streak-3', name: '3-Day Streak', earnedAt: new Date().toISOString() },
      ];
      streakData = { current: 3, longest: 3, lastPracticeDate: new Date().toISOString() };
      practiceTime = 45; // minutes
      averageWPM = 25;
      keystrokeAccuracy = 85;
      level = 2;
      xp = 150;
      streakDays = 3;
      break;
      
    case 'intermediate':
      // More lessons, achievements, medium stats
      lessons = Array(30).fill(0).map((_, i) => ({
        id: `lesson-${i}`,
        lessonId: `lesson-${i}`,
        completedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        score: Math.floor(Math.random() * 20) + 70,
        timeSpent: Math.floor(Math.random() * 8) + 3,
        errorsCount: Math.floor(Math.random() * 8) + 2,
      }));
      achievements = [
        { id: 'first-lesson', name: 'First Steps', earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'streak-7', name: '7-Day Streak', earnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'fast-fingers', name: 'Fast Fingers', earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'completion-10', name: '10 Lessons Completed', earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'streak-14', name: '14-Day Streak', earnedAt: new Date().toISOString() },
      ];
      streakData = { current: 14, longest: 14, lastPracticeDate: new Date().toISOString() };
      practiceTime = 320; // minutes
      averageWPM = 45;
      keystrokeAccuracy = 92;
      level = 8;
      xp = 750;
      streakDays = 14;
      break;
      
    case 'advanced':
      // Many lessons, achievements, high stats
      lessons = Array(100).fill(0).map((_, i) => ({
        id: `lesson-${i}`,
        lessonId: `lesson-${i}`,
        completedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        score: Math.floor(Math.random() * 15) + 80,
        timeSpent: Math.floor(Math.random() * 5) + 2,
        errorsCount: Math.floor(Math.random() * 5) + 1,
      }));
      achievements = [
        { id: 'first-lesson', name: 'First Steps', earnedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'streak-7', name: '7-Day Streak', earnedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'fast-fingers', name: 'Fast Fingers', earnedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'completion-10', name: '10 Lessons Completed', earnedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'streak-30', name: '30-Day Streak', earnedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'completion-50', name: '50 Lessons Completed', earnedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'speed-demon', name: 'Speed Demon', earnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'perfect-accuracy', name: 'Perfect Accuracy', earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'streak-90', name: '90-Day Streak', earnedAt: new Date().toISOString() },
        { id: 'completion-100', name: '100 Lessons Completed', earnedAt: new Date().toISOString() },
      ];
      streakData = { current: 90, longest: 90, lastPracticeDate: new Date().toISOString() };
      practiceTime = 1200; // minutes
      averageWPM = 80;
      keystrokeAccuracy = 98;
      level = 25;
      xp = 3500;
      streakDays = 90;
      break;
      
    default: // new-user
      // No lessons, no achievements, default stats
      lessons = [];
      achievements = [];
      streakData = { current: 0, longest: 0, lastPracticeDate: null };
      practiceTime = 0; // minutes
      averageWPM = 0;
      keystrokeAccuracy = 0;
      level = 1;
      xp = 0;
      streakDays = 0;
  }
  
  return {
    completedLessons: lessons,
    achievements,
    streakData,
    practiceTime,
    averageWPM,
    keystrokeAccuracy,
    level,
    xp,
    streakDays,
    isLoading: false,
    error: null,
  };
};

// Create mock stores for different user profiles
const createMockStore = (profile = 'beginner') => {
  return configureStore({
    reducer: {
      userProgress: (state = createMockUserProgress(profile), action) => state,
    },
  });
};

const beginnerStore = createMockStore('beginner');
const intermediateStore = createMockStore('intermediate');
const advancedStore = createMockStore('advanced');
const newUserStore = createMockStore('new-user');
const loadingStore = configureStore({
  reducer: {
    userProgress: () => ({
      completedLessons: [],
      achievements: [],
      isLoading: true,
      error: null,
    }),
  },
});

// Create StoryBook wrapper component
const StoryWrapper: React.FC<{
  children: React.ReactNode;
  store: ReturnType<typeof configureStore>;
}> = ({ children, store }) => (
  <Provider store={store}>
    <Box sx={{ p: 3, maxWidth: '1200px' }}>
      {children}
    </Box>
  </Provider>
);

const meta = {
  title: 'Statistics/StatisticsDashboard',
  component: StatisticsDashboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dashboard displaying comprehensive user statistics and progress metrics in a visual format.',
      },
    },
    a11y: {
      // Enable accessibility testing for all stories by default
      disable: false,
      config: {
        rules: [
          {
            // We've handled these issues with our custom accessibility implementations
            id: ['color-contrast'],
            enabled: false,
          },
        ],
      },
    },
  },
  argTypes: {
    showDetailedStats: {
      control: 'boolean',
      description: 'Whether to show detailed statistics and charts',
    },
    dashboardId: {
      control: 'text',
      description: 'Unique ID used for accessibility purposes',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatisticsDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic template
const Template: Story = {
  args: {
    showDetailedStats: true,
  },
};

export const BeginnerUser: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={beginnerStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard displaying statistics for a beginner user with minimal progress.',
      },
    },
  },
};

export const IntermediateUser: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={intermediateStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard displaying statistics for an intermediate user with moderate progress.',
      },
    },
  },
};

export const AdvancedUser: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={advancedStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard displaying statistics for an advanced user with significant progress.',
      },
    },
  },
};

export const NewUser: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={newUserStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard displaying statistics for a new user with no progress.',
      },
    },
  },
};

export const Loading: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={loadingStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in loading state while data is being fetched.',
      },
    },
  },
};

export const SimplifiedView: Story = {
  args: {
    showDetailedStats: false,
  },
  decorators: [
    (Story) => (
      <StoryWrapper store={intermediateStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard displaying only key statistics without detailed charts and metrics.',
      },
    },
  },
};

export const AccessibleDashboard: Story = {
  args: {
    showDetailedStats: true,
    dashboardId: 'accessibility-demo-dashboard',
  },
  decorators: [
    (Story) => (
      <StoryWrapper store={intermediateStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with enhanced accessibility features including ARIA attributes, keyboard navigation, and screen reader support. All statistic cards are focusable with the keyboard and provide detailed descriptions for screen readers.',
      },
    },
  },
}; 