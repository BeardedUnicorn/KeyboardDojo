import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AchievementNotification from '../../components/gamification/achievements/AchievementNotification';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';

// Mock achievements
const mockAchievements = {
  common: {
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
  uncommon: {
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
  rare: {
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
  epic: {
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

// Mock close handler
const handleClose = () => {
  console.log('Achievement notification closed');
};

// Define metadata for the AchievementNotification stories
const meta = {
  title: 'Gamification/AchievementNotification',
  component: AchievementNotification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    achievement: {
      control: 'object',
      description: 'Achievement data object',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when notification is closed',
    },
    autoHideDuration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-hiding',
    },
  },
} satisfies Meta<typeof AchievementNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

// Common achievement notification
export const CommonAchievement: Story = {
  args: {
    achievement: mockAchievements.common,
    onClose: handleClose,
    autoHideDuration: 6000,
  },
};

// Uncommon achievement notification
export const UncommonAchievement: Story = {
  args: {
    achievement: mockAchievements.uncommon,
    onClose: handleClose,
    autoHideDuration: 6000,
  },
};

// Rare achievement notification
export const RareAchievement: Story = {
  args: {
    achievement: mockAchievements.rare,
    onClose: handleClose,
    autoHideDuration: 6000,
  },
};

// Epic achievement notification
export const EpicAchievement: Story = {
  args: {
    achievement: mockAchievements.epic,
    onClose: handleClose,
    autoHideDuration: 6000,
  },
};

// Legendary achievement notification
export const LegendaryAchievement: Story = {
  args: {
    achievement: mockAchievements.legendary,
    onClose: handleClose,
    autoHideDuration: 6000,
  },
};

// Secret achievement notification
export const SecretAchievement: Story = {
  args: {
    achievement: mockAchievements.secret,
    onClose: handleClose,
    autoHideDuration: 6000,
  },
};

// Quick auto-hide
export const QuickAutoHide: Story = {
  args: {
    achievement: mockAchievements.uncommon,
    onClose: handleClose,
    autoHideDuration: 1500,
  },
};
