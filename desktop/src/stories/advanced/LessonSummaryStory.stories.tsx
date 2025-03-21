import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Container, Typography, useTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { LessonSummary } from '../../components/curriculum';
import type { IShortcut } from '../../types/curriculum/IShortcut';

// Mock shortcuts data
const mockShortcuts: IShortcut[] = [
  {
    id: 'ctrl-c',
    name: 'Copy',
    shortcutWindows: 'Ctrl+C',
    shortcutMac: 'Cmd+C',
    shortcutLinux: 'Ctrl+C',
    description: 'Copy selected text or item',
    category: 'BASICS',
    context: 'text-editor'
  },
  {
    id: 'ctrl-v',
    name: 'Paste',
    shortcutWindows: 'Ctrl+V',
    shortcutMac: 'Cmd+V',
    shortcutLinux: 'Ctrl+V',
    description: 'Paste copied text or item',
    category: 'BASICS',
    context: 'text-editor'
  },
  {
    id: 'ctrl-z',
    name: 'Undo',
    shortcutWindows: 'Ctrl+Z',
    shortcutMac: 'Cmd+Z',
    shortcutLinux: 'Ctrl+Z',
    description: 'Undo last action',
    category: 'BASICS',
    context: 'text-editor'
  }
];

// Mock lessons data for curriculum
const mockLessons = [
  {
    id: 'keyboard-shortcuts-101',
    title: 'Essential Keyboard Shortcuts',
    description: 'Learn the most essential keyboard shortcuts',
    difficulty: 'beginner',
    estimatedTime: 20,
    shortcutIds: ['ctrl-c', 'ctrl-v', 'ctrl-z', 'ctrl-y', 'ctrl-a'],
    xpReward: 150,
    content: [],
    quizzes: []
  },
  {
    id: 'text-editing-shortcuts',
    title: 'Text Editing Shortcuts',
    description: 'Improve your text editing speed with these shortcuts',
    difficulty: 'intermediate',
    estimatedTime: 15,
    shortcutIds: ['ctrl-b', 'ctrl-i', 'ctrl-u', 'ctrl-home', 'ctrl-end'],
    xpReward: 200,
    content: [],
    quizzes: []
  },
  {
    id: 'navigation-shortcuts',
    title: 'Navigation Shortcuts',
    description: 'Learn how to navigate efficiently with shortcuts',
    difficulty: 'intermediate',
    estimatedTime: 20,
    shortcutIds: ['alt-tab', 'win-d', 'win-e', 'win-r', 'alt-f4'],
    xpReward: 200,
    content: [],
    quizzes: []
  }
];

// Create a mock Redux store
const createMockStore = () => {
  return configureStore({
    reducer: {
      // Add reducers needed by LessonSummary
      progress: (state = {
        userProgress: {
          level: 3,
          xp: 350,
          streakDays: 5,
          currentXP: 350,
          nextLevelXP: 500,
          totalXP: 1200,
          totalPracticeTime: 240
        },
        isLoading: false
      }) => state,
      curriculum: (state = {
        activeCurriculum: {
          id: 'default-curriculum',
          name: 'Default Curriculum',
          description: 'Default curriculum for Keyboard Dojo',
          version: '1.0.0',
          lessons: mockLessons,
          modules: [
            {
              id: 'module-1',
              title: 'Module 1: Basics',
              description: 'Learn the basics of keyboard shortcuts',
              order: 1,
              category: 'basics',
              difficulty: 'beginner',
              lessons: ['keyboard-shortcuts-101']
            },
            {
              id: 'module-2',
              title: 'Module 2: Intermediate',
              description: 'Intermediate keyboard shortcuts',
              order: 2,
              category: 'intermediate',
              difficulty: 'intermediate',
              lessons: ['text-editing-shortcuts', 'navigation-shortcuts']
            }
          ]
        },
        tracks: [
          {
            id: 'vscode',
            name: 'VS Code',
            description: 'Visual Studio Code shortcuts'
          }
        ],
        isLoading: false,
        error: null
      }) => state,
      user: (state = {
        isLoggedIn: true,
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@keyboarddojo.com'
        }
      }) => state
    }
  });
};

interface LessonSummaryStoryProps {
  performanceLevel: 'perfect' | 'average' | 'low';
  showNextLessons?: boolean;
  showAchievements?: boolean;
  showRecommendations?: boolean;
  animateXP?: boolean;
}

const LessonSummaryStory: React.FC<LessonSummaryStoryProps> = ({
  performanceLevel = 'perfect',
  showNextLessons = true,
  showAchievements = true,
  showRecommendations = true,
  animateXP = true
}) => {
  const theme = useTheme();
  const [store] = React.useState(() => createMockStore());

  // Get results based on performance level
  const getResults = () => {
    const lesson = mockLessons[0];
    
    switch (performanceLevel) {
      case 'perfect':
        return {
          lessonId: lesson.id,
          title: lesson.title,
          description: lesson.description,
          completed: true,
          correctAnswers: 10,
          totalQuestions: 10,
          score: 100,
          maxScore: 100,
          timeSpent: 240, // 4 minutes
          expectedTime: 300, // 5 minutes
          completion: 1.0,
          xpEarned: lesson.xpReward,
          gemsEarned: 25,
          stars: 3,
          shortcutsMastered: mockShortcuts
        };
      case 'average':
        return {
          lessonId: lesson.id,
          title: lesson.title,
          description: lesson.description,
          completed: true,
          correctAnswers: 7,
          totalQuestions: 10,
          score: 70,
          maxScore: 100,
          timeSpent: 300, // 5 minutes
          expectedTime: 300, // 5 minutes
          completion: 1.0,
          xpEarned: Math.floor(lesson.xpReward * 0.7),
          gemsEarned: 15,
          stars: 2,
          shortcutsMastered: mockShortcuts.slice(0, 2)
        };
      case 'low':
        return {
          lessonId: lesson.id,
          title: lesson.title,
          description: lesson.description,
          completed: true,
          correctAnswers: 4,
          totalQuestions: 10,
          score: 40,
          maxScore: 100,
          timeSpent: 360, // 6 minutes
          expectedTime: 300, // 5 minutes
          completion: 0.8,
          xpEarned: Math.floor(lesson.xpReward * 0.4),
          gemsEarned: 5,
          stars: 1,
          shortcutsMastered: mockShortcuts.slice(0, 1)
        };
      default:
        return {
          lessonId: lesson.id,
          title: lesson.title,
          description: lesson.description,
          completed: true,
          correctAnswers: 10,
          totalQuestions: 10,
          score: 100,
          maxScore: 100,
          timeSpent: 240,
          expectedTime: 300,
          completion: 1.0,
          xpEarned: lesson.xpReward,
          gemsEarned: 25,
          stars: 3,
          shortcutsMastered: mockShortcuts
        };
    }
  };

  const results = getResults();

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
            Lesson Summary
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Review your performance and progress from the completed lesson.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <LessonSummary
              title={results.title}
              description={results.description}
              performance={{
                lessonId: results.lessonId,
                completed: results.completed,
                correctAnswers: results.correctAnswers,
                totalQuestions: results.totalQuestions,
                timeSpent: results.timeSpent,
                xpEarned: results.xpEarned,
                gemsEarned: results.gemsEarned,
                stars: results.stars,
                shortcutsMastered: results.shortcutsMastered,
              }}
              onNext={() => console.log('Next lesson')}
              onReplay={() => console.log('Replay lesson')}
              onHome={() => console.log('Go to home')}
            />
          </Box>
        </Paper>
      </Container>
    </Provider>
  );
};

const meta: Meta<typeof LessonSummaryStory> = {
  title: 'Advanced/Curriculum/LessonSummary',
  component: LessonSummaryStory,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Lesson summary component that shows performance after completing a lesson.',
      },
    },
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
  argTypes: {
    performanceLevel: {
      control: 'select',
      options: ['perfect', 'average', 'low'],
      description: 'Performance level to display',
      defaultValue: 'perfect',
    },
    showNextLessons: {
      control: 'boolean',
      description: 'Whether to show next lessons section',
      defaultValue: true,
    },
    showAchievements: {
      control: 'boolean',
      description: 'Whether to show achievements section',
      defaultValue: true,
    },
    showRecommendations: {
      control: 'boolean',
      description: 'Whether to show recommendations section',
      defaultValue: true,
    },
    animateXP: {
      control: 'boolean',
      description: 'Whether to animate XP gain',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to render with args
const renderStory = (args: LessonSummaryStoryProps) => <LessonSummaryStory {...args} />;

export const Perfect: Story = {
  args: {
    performanceLevel: 'perfect',
    showNextLessons: true,
    showAchievements: true,
    showRecommendations: true,
    animateXP: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const Average: Story = {
  args: {
    performanceLevel: 'average',
    showNextLessons: true,
    showAchievements: true,
    showRecommendations: true,
    animateXP: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const Low: Story = {
  args: {
    performanceLevel: 'low',
    showNextLessons: true,
    showAchievements: true,
    showRecommendations: true,
    animateXP: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const NoAnimations: Story = {
  args: {
    performanceLevel: 'perfect',
    showNextLessons: true,
    showAchievements: true,
    showRecommendations: true,
    animateXP: false
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const MinimalUI: Story = {
  args: {
    performanceLevel: 'average',
    showNextLessons: false,
    showAchievements: false,
    showRecommendations: false,
    animateXP: false
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
}; 