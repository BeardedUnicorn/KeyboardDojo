import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import LessonSummary from '@/components/curriculum/LessonSummary';

// Create mock shortcut data with required properties
const mockShortcuts = [
  {
    id: 'save',
    name: 'Save File',
    description: 'Save the current file',
    category: 'File Operations',
    shortcutWindows: 'Ctrl+S',
    shortcutMac: 'Cmd+S',
  },
  {
    id: 'find',
    name: 'Find in File',
    description: 'Search for text within the current file',
    category: 'Editing',
    shortcutWindows: 'Ctrl+F',
    shortcutMac: 'Cmd+F',
  },
];

const meta: Meta<typeof LessonSummary> = {
  title: 'Curriculum/LessonSummary',
  component: LessonSummary,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    onNext: { action: 'continue clicked' },
    onReplay: { action: 'replay clicked' },
    onHome: { action: 'home clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof LessonSummary>;

// Perfect performance summary
export const PerfectPerformance: Story = {
  args: {
    title: 'VS Code Navigation Shortcuts',
    description: 'Master essential shortcuts for efficient navigation in VS Code',
    performance: {
      lessonId: 'lesson-1',
      completed: true,
      correctAnswers: 5,
      totalQuestions: 5,
      timeSpent: 180, // 3 minutes
      xpEarned: 200,
      gemsEarned: 25,
      stars: 3,
      shortcutsMastered: [
        mockShortcuts[0],
        mockShortcuts[1],
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Summary showing perfect performance with all questions answered correctly and maximum stars earned.',
      },
    },
  },
};

// Good performance summary
export const GoodPerformance: Story = {
  args: {
    title: 'VS Code Editing Shortcuts',
    description: 'Learn powerful shortcuts for editing code in VS Code',
    performance: {
      lessonId: 'lesson-2',
      completed: true,
      correctAnswers: 4,
      totalQuestions: 5,
      timeSpent: 250, // 4:10 minutes
      xpEarned: 150,
      gemsEarned: 15,
      stars: 2,
      shortcutsMastered: [
        mockShortcuts[0],
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Summary showing good but not perfect performance with most questions answered correctly.',
      },
    },
  },
};

// Average performance summary
export const AveragePerformance: Story = {
  args: {
    title: 'IntelliJ IDEA Shortcuts',
    description: 'Master essential shortcuts for IntelliJ IDEA',
    performance: {
      lessonId: 'lesson-3',
      completed: true,
      correctAnswers: 3,
      totalQuestions: 6,
      timeSpent: 320, // 5:20 minutes
      xpEarned: 100,
      gemsEarned: 10,
      stars: 1,
      shortcutsMastered: [
        mockShortcuts[0],
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Summary showing average performance with about half the questions answered correctly.',
      },
    },
  },
};

// Minimal performance summary
export const MinimalPerformance: Story = {
  args: {
    title: 'Cursor Advanced Shortcuts',
    description: 'Learn advanced shortcuts for Cursor editor',
    performance: {
      lessonId: 'lesson-4',
      completed: true,
      correctAnswers: 2,
      totalQuestions: 8,
      timeSpent: 420, // 7 minutes
      xpEarned: 50,
      gemsEarned: 5,
      stars: 1,
      shortcutsMastered: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Summary showing minimal performance with few questions answered correctly and no shortcuts mastered.',
      },
    },
  },
}; 