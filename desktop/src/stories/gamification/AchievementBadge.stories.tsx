import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AchievementBadge from '../../components/gamification/achievements/AchievementBadge';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';

// Mock achievement data
const mockAchievements = {
  beginner: {
    id: 'beginner_achievement',
    title: 'First Steps',
    description: 'Complete your first lesson',
    category: AchievementCategory.LESSONS,
    xpReward: 100,
    rarity: AchievementRarity.COMMON,
    secret: false,
    icon: 'School',
    condition: {
      type: 'lessons_completed',
      target: 1,
    },
  },
  intermediate: {
    id: 'streak_achievement',
    title: 'On Fire',
    description: 'Maintain a 7-day streak',
    category: AchievementCategory.STREAKS,
    xpReward: 250,
    rarity: AchievementRarity.UNCOMMON,
    secret: false,
    icon: 'LocalFireDepartment',
    condition: {
      type: 'daily_streak',
      target: 7,
    },
  },
  advanced: {
    id: 'shortcut_master',
    title: 'Shortcut Wizard',
    description: 'Master 50 keyboard shortcuts',
    category: AchievementCategory.SHORTCUTS,
    xpReward: 500,
    rarity: AchievementRarity.RARE,
    secret: false,
    icon: 'Speed',
    condition: {
      type: 'shortcuts_mastered',
      target: 50,
    },
  },
  expert: {
    id: 'keyboard_ninja',
    title: 'Keyboard Ninja',
    description: 'Complete all expert-level challenges',
    category: AchievementCategory.MASTERY,
    xpReward: 1000,
    rarity: AchievementRarity.EPIC,
    secret: false,
    icon: 'EmojiEvents',
    condition: {
      type: 'expert_challenges_completed',
      target: 10,
    },
  },
  legendary: {
    id: 'legendary_achievement',
    title: 'Legendary Status',
    description: 'Achieve the impossible',
    category: AchievementCategory.GENERAL,
    xpReward: 2000,
    rarity: AchievementRarity.LEGENDARY,
    secret: false,
    icon: 'Explore',
    condition: {
      type: 'all_achievements',
      target: 50,
    },
  },
  secret: {
    id: 'secret_achievement',
    title: 'Hidden Talent',
    description: 'Find the secret shortcut combination',
    category: AchievementCategory.SHORTCUTS,
    xpReward: 750,
    rarity: AchievementRarity.RARE,
    secret: true,
    icon: 'Lock',
    condition: {
      type: 'secret_shortcut',
      target: 1,
      trackId: 'secret_combo',
    },
  },
};

// Define metadata for the AchievementBadge stories
const meta = {
  title: 'Gamification/AchievementBadge',
  component: AchievementBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    achievement: {
      control: 'object',
      description: 'Achievement data object',
    },
    completed: {
      control: 'boolean',
      description: 'Whether the achievement is completed',
    },
    showRarity: {
      control: 'boolean',
      description: 'Whether to display the rarity chip',
    },
    showDescription: {
      control: 'boolean',
      description: 'Whether to display the achievement description',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the achievement badge',
    },
  },
} satisfies Meta<typeof AchievementBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    achievement: mockAchievements.intermediate,
    completed: true,
    showRarity: true,
    showDescription: true,
    size: 'medium',
  },
};

// Small size badge
export const SmallBadge: Story = {
  args: {
    achievement: mockAchievements.beginner,
    completed: true,
    showRarity: true,
    showDescription: false,
    size: 'small',
  },
};

// Large size badge
export const LargeBadge: Story = {
  args: {
    achievement: mockAchievements.expert,
    completed: true,
    showRarity: true,
    showDescription: true,
    size: 'large',
  },
};

// Uncompleted achievement
export const Uncompleted: Story = {
  args: {
    achievement: mockAchievements.advanced,
    completed: false,
    showRarity: true,
    showDescription: true,
    size: 'medium',
  },
};

// Secret achievement (completed)
export const SecretAchievementCompleted: Story = {
  args: {
    achievement: mockAchievements.secret,
    completed: true,
    showRarity: true,
    showDescription: true,
    size: 'medium',
  },
};

// Secret achievement (uncompleted)
export const SecretAchievementUncompleted: Story = {
  args: {
    achievement: mockAchievements.secret,
    completed: false,
    showRarity: true,
    showDescription: true,
    size: 'medium',
  },
};

// Legendary achievement
export const LegendaryAchievement: Story = {
  args: {
    achievement: mockAchievements.legendary,
    completed: true,
    showRarity: true,
    showDescription: true,
    size: 'medium',
  },
};

// Without rarity
export const WithoutRarity: Story = {
  args: {
    achievement: mockAchievements.intermediate,
    completed: true,
    showRarity: false,
    showDescription: true,
    size: 'medium',
  },
};
