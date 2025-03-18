/**
 * Achievements Service
 *
 * This service manages user achievements, including tracking progress,
 * unlocking achievements, and providing achievement data.
 */

import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';

import { loggerService } from './loggerService';
import { userProgressService } from './userProgressService';

import type { IAchievement as AchievementType } from '@/types/achievements/IAchievement';

// Achievement interface
export type Achievement = AchievementType

// Achievement progress interface
export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  completed: boolean;
  completedDate?: string;
}

// Default achievements
const defaultAchievements: Achievement[] = [
  // Practice achievements
  {
    id: 'practice-1',
    title: 'First Steps',
    description: 'Complete your first practice session',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.COMMON,
    xpReward: 100,
    icon: 'FitnessCenter',
    condition: {
      type: 'practice',
      target: 1,
    },
  },
  {
    id: 'practice-2',
    title: 'Practice Makes Perfect',
    description: 'Complete 10 practice sessions',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 100,
    icon: 'FitnessCenter',
    condition: {
      type: 'practice',
      target: 10,
    },
  },
  {
    id: 'practice-3',
    title: 'Dedicated Learner',
    description: 'Complete 50 practice sessions',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.RARE,
    xpReward: 250,
    icon: 'FitnessCenter',
    condition: {
      type: 'practice',
      target: 50,
    },
  },
  {
    id: 'practice-4',
    title: 'Keyboard Warrior',
    description: 'Complete 100 practice sessions',
    category: AchievementCategory.LESSONS,
    rarity: AchievementRarity.EPIC,
    xpReward: 500,
    icon: 'FitnessCenter',
    condition: {
      type: 'practice',
      target: 100,
    },
  },

  // Streak achievements
  {
    id: 'streak-1',
    title: 'Getting Into Rhythm',
    description: 'Maintain a 3-day practice streak',
    category: AchievementCategory.STREAKS,
    rarity: AchievementRarity.COMMON,
    xpReward: 75,
    icon: 'LocalFireDepartment',
    condition: {
      type: 'streak',
      target: 3,
    },
  },
  {
    id: 'streak-2',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day practice streak',
    category: AchievementCategory.STREAKS,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 100,
    icon: 'LocalFireDepartment',
    condition: {
      type: 'streak',
      target: 7,
    },
  },
  {
    id: 'streak-3',
    title: 'Monthly Master',
    description: 'Maintain a 30-day practice streak',
    category: AchievementCategory.STREAKS,
    rarity: AchievementRarity.RARE,
    xpReward: 500,
    icon: 'LocalFireDepartment',
    condition: {
      type: 'streak',
      target: 30,
    },
  },
  {
    id: 'streak-4',
    title: 'Unstoppable',
    description: 'Maintain a 100-day practice streak',
    category: AchievementCategory.STREAKS,
    rarity: AchievementRarity.LEGENDARY,
    xpReward: 1000,
    icon: 'LocalFireDepartment',
    condition: {
      type: 'streak',
      target: 100,
    },
  },

  // Mastery achievements
  {
    id: 'mastery-1',
    title: 'Module Master',
    description: 'Complete all lessons in a module',
    category: AchievementCategory.MASTERY,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 200,
    icon: 'EmojiEvents',
    condition: {
      type: 'mastery',
      target: 1,
    },
  },
  {
    id: 'mastery-2',
    title: 'Track Champion',
    description: 'Complete all modules in a track',
    category: AchievementCategory.MASTERY,
    rarity: AchievementRarity.EPIC,
    xpReward: 750,
    icon: 'EmojiEvents',
    condition: {
      type: 'mastery',
      target: 1,
    },
  },
  {
    id: 'mastery-3',
    title: 'Mastery Begins',
    description: 'Complete your first mastery challenge',
    category: AchievementCategory.MASTERY,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 150,
    icon: 'EmojiEvents',
    condition: {
      type: 'mastery',
      target: 1,
    },
  },

  // Speed achievements
  {
    id: 'speed-1',
    title: 'Quick Fingers',
    description: 'Execute 10 shortcuts in under 1 second each',
    category: AchievementCategory.SHORTCUTS,
    rarity: AchievementRarity.UNCOMMON,
    xpReward: 150,
    icon: 'Speed',
    condition: {
      type: 'speed',
      target: 10,
    },
  },
  {
    id: 'speed-2',
    title: 'Lightning Hands',
    description: 'Execute 50 shortcuts in under 0.8 seconds each',
    category: AchievementCategory.SHORTCUTS,
    rarity: AchievementRarity.RARE,
    xpReward: 300,
    icon: 'Speed',
    condition: {
      type: 'speed',
      target: 50,
    },
  },

  // Exploration achievements
  {
    id: 'explore-1',
    title: 'Explorer',
    description: 'Visit all sections of the app',
    category: AchievementCategory.GENERAL,
    rarity: AchievementRarity.COMMON,
    xpReward: 100,
    icon: 'Explore',
    condition: {
      type: 'exploration',
      target: 5,
    },
  },
  {
    id: 'explore-2',
    title: 'Secret Finder',
    description: 'Discover a hidden feature',
    category: AchievementCategory.GENERAL,
    rarity: AchievementRarity.RARE,
    xpReward: 250,
    icon: 'Explore',
    secret: true,
    condition: {
      type: 'exploration',
      target: 1,
    },
  },

  // Legendary achievements
  {
    id: 'mastery-4',
    title: 'Keyboard Grandmaster',
    description: 'Complete all mastery challenges with perfect scores',
    category: AchievementCategory.MASTERY,
    rarity: AchievementRarity.LEGENDARY,
    xpReward: 1000,
    icon: 'EmojiEvents',
    condition: {
      type: 'mastery',
      target: 100,
    },
  },
];

// Storage keys
const ACHIEVEMENTS_STORAGE_KEY = 'keyboard-dojo-achievements';

// Achievement service
class AchievementsService {
  private listeners: ((achievements: AchievementProgress[]) => void)[] = [];

  constructor() {
    // Initialize listeners array
    this.listeners = [];
  }

  // Get all achievements with progress
  getAchievements(): AchievementProgress[] {
    try {
      const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);

      if (!savedAchievements) {
        // Initialize achievements with default progress
        const initialAchievements = defaultAchievements.map((achievement) => ({
          achievement,
          progress: 0,
          completed: false,
        }));

        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(initialAchievements));
        return initialAchievements;
      }

      return JSON.parse(savedAchievements);
    } catch (error) {
      loggerService.error('Error getting achievements:', { error });
      return [];
    }
  }

  // Update achievement progress
  updateAchievementProgress(achievementId: string, progress: number): AchievementProgress | null {
    const achievements = this.getAchievements();
    const achievementIndex = achievements.findIndex((a) => a.achievement.id === achievementId);

    if (achievementIndex === -1) {
      return null;
    }

    const achievement = achievements[achievementIndex];
    const wasCompleted = achievement.completed;

    // Update progress
    achievement.progress = Math.max(achievement.progress, progress);

    // Check if completed
    if (!wasCompleted && achievement.progress >= achievement.achievement.condition.target) {
      achievement.completed = true;
      achievement.completedDate = new Date().toISOString();

      // Award XP
      userProgressService.addXP(achievement.achievement.xpReward);
    }

    // Save updated achievements
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));

    // Notify listeners
    this.notifyListeners(achievements);

    return achievement;
  }

  // Check for achievements based on user progress
  checkAchievements(type: AchievementCategory, value: number, metadata?: any): AchievementProgress[] {
    const achievements = this.getAchievements();
    const unlockedAchievements: AchievementProgress[] = [];

    // Filter achievements by type
    const relevantAchievements = achievements.filter(
      (a) => a.achievement.category === type && !a.completed,
    );

    // Check each achievement
    relevantAchievements.forEach((achievement) => {
      // Check if criteria matches
      if (value >= achievement.achievement.condition.target) {
        // Check additional criteria if needed
        let criteriaMatched = true;

        if (achievement.achievement.condition.trackId && metadata?.trackId) {
          criteriaMatched = achievement.achievement.condition.trackId === metadata.trackId;
        }

        if (criteriaMatched) {
          // Update progress and check for completion
          const updated = this.updateAchievementProgress(
            achievement.achievement.id,
            achievement.achievement.condition.target,
          );

          if (updated) {
            unlockedAchievements.push(updated);
          }
        }
      }
    });

    return unlockedAchievements;
  }

  // Add listener for achievement updates
  addListener(callback: (achievements: AchievementProgress[]) => void): void {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback: (achievements: AchievementProgress[]) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners(achievements: AchievementProgress[]): void {
    this.listeners.forEach((listener) => listener(achievements));
  }

  // Reset all achievements (for testing)
  resetAchievements(): void {
    const initialAchievements = defaultAchievements.map((achievement) => ({
      achievement,
      progress: 0,
      completed: false,
    }));

    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(initialAchievements));
    this.notifyListeners(initialAchievements);
  }
}

export const achievementsService = new AchievementsService();
