import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import LevelProgressBar from '../../components/gamification/progress/LevelProgressBar';

// Mock the useXP hook
jest.mock('../../../hooks', () => ({
  useXP: () => ({
    level: 5,
    totalXP: 2500,
    currentLevelXP: 500,
    nextLevelXP: 3000,
    progress: 0.2, // 20% to next level
    levelTitle: 'Keyboard Adept',
    xpHistory: [
      { id: '1', amount: 100, source: 'lesson_complete', date: new Date().toISOString() },
      { id: '2', amount: 50, source: 'shortcut_mastered', date: new Date().toISOString() },
      { id: '3', amount: 25, source: 'daily_login', date: new Date().toISOString() },
    ],
  }),
}));

// Define metadata for the LevelProgressBar stories
const meta = {
  title: 'Gamification/LevelProgressBar',
  component: LevelProgressBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    compact: {
      control: 'boolean',
      description: 'Display in compact mode',
    },
    showTitle: {
      control: 'boolean',
      description: 'Show level title',
    },
    showXP: {
      control: 'boolean',
      description: 'Show XP information',
    },
  },
} satisfies Meta<typeof LevelProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    compact: false,
    showTitle: true,
    showXP: true,
  },
};

// Compact mode
export const Compact: Story = {
  args: {
    compact: true,
    showTitle: false,
    showXP: true,
  },
};

// Without title
export const WithoutTitle: Story = {
  args: {
    compact: false,
    showTitle: false,
    showXP: true,
  },
};

// Without XP
export const WithoutXP: Story = {
  args: {
    compact: false,
    showTitle: true,
    showXP: false,
  },
};

// Minimal
export const Minimal: Story = {
  args: {
    compact: true,
    showTitle: false,
    showXP: false,
  },
};
