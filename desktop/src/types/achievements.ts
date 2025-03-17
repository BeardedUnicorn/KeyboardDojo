/**
 * Achievement Types
 * 
 * This file defines the types for the achievements system.
 */

export enum AchievementCategory {
  GENERAL = 'general',
  LESSONS = 'lessons',
  SHORTCUTS = 'shortcuts',
  STREAKS = 'streaks',
  MASTERY = 'mastery',
}

export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string; // Material-UI icon name
  xpReward: number;
  condition: {
    type: string;
    target: number;
    trackId?: string;
  };
  secret?: boolean;
}

export interface UserAchievement {
  id: string;
  unlockedAt: string;
  progress: number;
  completed: boolean;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  completed: boolean;
  unlockedAt?: string;
} 