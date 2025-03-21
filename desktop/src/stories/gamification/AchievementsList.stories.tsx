import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AchievementsList from '../../components/gamification/achievements/AchievementsList';
import { TestWrapper } from '../.storybook-test-setup';

// Mock achievements data for testing
const mockAchievements = [
  {
    id: 'streak_3',
    name: 'Streaker',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    rarity: 'common',
    icon: 'streak',
    progress: 100,
    total: 100,
    completed: true,
    unlockedAt: '2023-12-05',
  },
  {
    id: 'shortcut_10',
    name: 'Shortcut Master',
    description: 'Use 10 different keyboard shortcuts',
    category: 'shortcuts',
    rarity: 'uncommon',
    icon: 'keyboard',
    progress: 8,
    total: 10,
    completed: false,
  },
  {
    id: 'exercise_20',
    name: 'Exercise Enthusiast',
    description: 'Complete 20 exercises',
    category: 'exercises',
    rarity: 'rare',
    icon: 'exercise',
    progress: 12,
    total: 20,
    completed: false,
  },
  {
    id: 'secret_1',
    name: '???',
    description: 'Secret achievement',
    category: 'secret',
    rarity: 'legendary',
    icon: 'secret',
    progress: 0,
    total: 1,
    completed: false,
    secret: true,
  },
];

// Full gamification data mock
const fullGamificationData = {
  level: 5,
  xp: 1250,
  totalXp: 2500,
  nextLevelXP: 2500,
  xpForNextLevel: 1000,
  currency: 500,
  balance: 500,
  achievements: mockAchievements,
  currentStreak: 7,
  maxStreak: 10,
  hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
  streakDays: [true, true, true, true, true, false, false],
  streakFreeze: true,
  isLoading: false,
  progress: 0.5,
};

const meta: Meta<typeof AchievementsList> = {
  title: 'Gamification/AchievementsList',
  component: AchievementsList,
  decorators: [
    (Story) => (
      <TestWrapper>
        <Story />
      </TestWrapper>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    category: {
      control: 'select',
      options: ['', 'streak', 'shortcuts', 'exercises', 'secret'],
      description: 'Filter by achievement category',
    },
    rarity: {
      control: 'select',
      options: ['', 'common', 'uncommon', 'rare', 'legendary'],
      description: 'Filter by achievement rarity',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show achievement progress',
    },
    showRarity: {
      control: 'boolean',
      description: 'Show achievement rarity',
    },
    showDescription: {
      control: 'boolean',
      description: 'Show achievement description',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of achievement items',
    },
    showSecrets: {
      control: 'boolean',
      description: 'Show secret achievements',
    },
  },
  args: {
    showProgress: true,
    showRarity: true,
    showDescription: true,
    size: 'medium',
    showSecrets: true,
  },
};

export default meta;
type Story = StoryObj<typeof AchievementsList>;

export const Default: Story = {};

export const FilteredByCategory: Story = {
  args: {
    category: 'streak',
  },
};

export const FilteredByRarity: Story = {
  args: {
    rarity: 'rare',
  },
};

export const WithoutProgress: Story = {
  args: {
    showProgress: false,
  },
};

export const SmallSize: Story = {
  args: {
    size: 'small',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'large',
  },
};

export const HiddenSecrets: Story = {
  args: {
    showSecrets: false,
  },
};
