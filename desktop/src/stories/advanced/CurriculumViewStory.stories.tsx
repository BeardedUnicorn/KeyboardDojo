import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Container, Typography, useTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { CurriculumView } from '../../components/curriculum';
import { ApplicationType } from '../../types/progress/ICurriculum';

// Mock curriculum data
const mockCurriculum = {
  tracks: [
    {
      id: 'basics',
      title: 'Keyboard Basics',
      description: 'Learn the fundamentals of efficient keyboard usage',
      icon: 'Keyboard',
      color: 'primary',
      progress: 0.75,
      topics: [
        {
          id: 'typing-fundamentals',
          title: 'Typing Fundamentals',
          description: 'Master proper typing techniques and home row positioning',
          progress: 1.0,
          lessons: [
            {
              id: 'lesson-1',
              title: 'Home Row Position',
              description: 'Learn the proper finger positioning on the home row',
              estimatedTime: 10,
              difficulty: 'beginner',
              status: 'completed',
              progress: 1.0
            },
            {
              id: 'lesson-2',
              title: 'Touch Typing Basics',
              description: 'Learn to type without looking at the keyboard',
              estimatedTime: 15,
              difficulty: 'beginner',
              status: 'completed',
              progress: 1.0
            }
          ]
        },
        {
          id: 'text-navigation',
          title: 'Text Navigation',
          description: 'Navigate through text efficiently using keyboard shortcuts',
          progress: 0.5,
          lessons: [
            {
              id: 'lesson-3',
              title: 'Line Navigation',
              description: 'Learn to navigate to the beginning and end of lines',
              estimatedTime: 10,
              difficulty: 'beginner',
              status: 'completed',
              progress: 1.0
            },
            {
              id: 'lesson-4',
              title: 'Word and Character Navigation',
              description: 'Navigate by words and characters efficiently',
              estimatedTime: 15,
              difficulty: 'intermediate',
              status: 'in-progress',
              progress: 0.5
            },
            {
              id: 'lesson-5',
              title: 'Document Navigation',
              description: 'Navigate through entire documents quickly',
              estimatedTime: 20,
              difficulty: 'intermediate',
              status: 'locked',
              progress: 0
            }
          ]
        }
      ]
    },
    {
      id: 'text-editing',
      title: 'Text Editing',
      description: 'Master advanced text editing techniques',
      icon: 'Edit',
      color: 'secondary',
      progress: 0.25,
      topics: [
        {
          id: 'selection-techniques',
          title: 'Selection Techniques',
          description: 'Efficiently select text using keyboard shortcuts',
          progress: 0.5,
          lessons: [
            {
              id: 'lesson-6',
              title: 'Basic Text Selection',
              description: 'Learn to select lines, words, and characters',
              estimatedTime: 15,
              difficulty: 'beginner',
              status: 'completed',
              progress: 1.0
            },
            {
              id: 'lesson-7',
              title: 'Advanced Selection',
              description: 'Master multiple selection and column selection',
              estimatedTime: 20,
              difficulty: 'intermediate',
              status: 'in-progress',
              progress: 0.3
            }
          ]
        },
        {
          id: 'clipboard-operations',
          title: 'Clipboard Operations',
          description: 'Master copy, cut, and paste operations',
          progress: 0,
          lessons: [
            {
              id: 'lesson-8',
              title: 'Basic Clipboard Operations',
              description: 'Learn to copy, cut, and paste text',
              estimatedTime: 10,
              difficulty: 'beginner',
              status: 'locked',
              progress: 0
            },
            {
              id: 'lesson-9',
              title: 'Clipboard History',
              description: 'Work with clipboard history and multiple items',
              estimatedTime: 15,
              difficulty: 'intermediate',
              status: 'locked',
              progress: 0
            }
          ]
        }
      ]
    },
    {
      id: 'ide-navigation',
      title: 'IDE Navigation',
      description: 'Navigate and control your IDE efficiently',
      icon: 'Code',
      color: 'info',
      progress: 0,
      topics: [
        {
          id: 'window-management',
          title: 'Window Management',
          description: 'Learn to manage editor windows and panes efficiently',
          progress: 0,
          lessons: [
            {
              id: 'lesson-10',
              title: 'Split Editors',
              description: 'Work with multiple editor panes efficiently',
              estimatedTime: 15,
              difficulty: 'intermediate',
              status: 'locked',
              progress: 0
            },
            {
              id: 'lesson-11',
              title: 'Panel Management',
              description: 'Navigate between panels and tool windows',
              estimatedTime: 15,
              difficulty: 'advanced',
              status: 'locked',
              progress: 0
            }
          ]
        }
      ]
    }
  ],
  stats: {
    lessonsCompleted: 3,
    totalLessons: 11,
    currentStreak: 5,
    bestStreak: 7,
    totalPracticeTime: 240 // minutes
  }
};

// Create mock store with curriculum data
const createMockStore = () => {
  return configureStore({
    reducer: {
      curriculum: () => ({ 
        curriculum: mockCurriculum,
        activeCurriculum: mockCurriculum,
        currentCurriculum: mockCurriculum,
        isLoading: false,
        error: null,
        tracks: mockCurriculum.tracks,
        topics: mockCurriculum.tracks.flatMap(track => track.topics || []),
        lessons: mockCurriculum.tracks.flatMap(track => 
          track.topics?.flatMap(topic => topic.lessons || []) || []
        ),
        currentView: 'tracks',
        selectedTrack: null,
        selectedTopic: null,
        selectedLesson: null,
      }),
      progress: () => ({
        userProgress: {
          level: 3,
          xp: 350,
          streakDays: 5,
          totalLessonsCompleted: 12,
          achievements: [],
          lessonProgress: {},
          completedLessons: [],
          currentLessons: []
        },
        isLoading: false,
        error: null
      }),
      user: () => ({
        isAuthenticated: true,
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          achievements: [],
          preferences: {
            theme: 'light'
          }
        },
        isLoading: false,
        error: null
      }),
      app: () => ({
        isInitialized: true,
        isLoading: false,
        error: null,
        theme: 'light',
        messages: [],
        version: '1.0.0'
      })
    }
  });
};

interface CurriculumViewStoryProps {
  showAchievements?: boolean;
  showStats?: boolean;
}

const CurriculumViewStory: React.FC<CurriculumViewStoryProps> = ({
  showAchievements = true,
  showStats = true
}) => {
  const theme = useTheme();
  const [store] = useState(() => createMockStore());

  return (
    <Provider store={store}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper
          }}
        >
          <Typography variant="h4" gutterBottom>
            Keyboard Mastery Curriculum
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Explore our curriculum and lessons to master keyboard efficiency.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <CurriculumView 
              onSelectLesson={(trackId, moduleId, lessonId) => {
                console.log(`Lesson selected: ${lessonId} in module ${moduleId} of track ${trackId}`);
              }}
              onSelectChallenge={(trackId, challengeId) => {
                console.log(`Challenge selected: ${challengeId} in track ${trackId}`);
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Provider>
  );
};

const meta: Meta<typeof CurriculumViewStory> = {
  title: 'Advanced/Curriculum/CurriculumView',
  component: CurriculumViewStory,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'This story showcases the CurriculumView component, which displays the learning curriculum with different tracks, topics, and lessons.',
      },
    },
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
  argTypes: {
    showAchievements: {
      control: 'boolean',
      description: 'Whether to show achievements section',
      defaultValue: true,
    },
    showStats: {
      control: 'boolean',
      description: 'Whether to show statistics section',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TracksView: Story = {
  args: {
    showAchievements: true,
    showStats: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const TopicsView: Story = {
  args: {
    showAchievements: true,
    showStats: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const LessonsView: Story = {
  args: {
    showAchievements: true,
    showStats: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const NoAchievementsOrStats: Story = {
  args: {
    showAchievements: false,
    showStats: false
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
}; 