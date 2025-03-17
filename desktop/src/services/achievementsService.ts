/**
 * Achievements Service
 * 
 * This service manages user achievements, including tracking progress,
 * unlocking achievements, and providing achievement data.
 */

import { userProgressService } from './userProgressService';

// Achievement types
export type AchievementCategory = 'practice' | 'streak' | 'mastery' | 'speed' | 'exploration';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Achievement interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  heartsReward?: number;
  icon?: string;
  secret?: boolean;
  criteria: {
    type: 'practice' | 'streak' | 'mastery' | 'speed' | 'exploration';
    value: number;
    trackId?: string;
    moduleId?: string;
  };
}

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
    category: 'practice',
    rarity: 'common',
    xpReward: 50,
    heartsReward: 1,
    criteria: {
      type: 'practice',
      value: 1
    }
  },
  {
    id: 'practice-10',
    title: 'Practice Makes Perfect',
    description: 'Complete 10 practice sessions',
    category: 'practice',
    rarity: 'uncommon',
    xpReward: 100,
    criteria: {
      type: 'practice',
      value: 10
    }
  },
  {
    id: 'practice-50',
    title: 'Dedicated Learner',
    description: 'Complete 50 practice sessions',
    category: 'practice',
    rarity: 'rare',
    xpReward: 250,
    criteria: {
      type: 'practice',
      value: 50
    }
  },
  {
    id: 'practice-100',
    title: 'Keyboard Warrior',
    description: 'Complete 100 practice sessions',
    category: 'practice',
    rarity: 'epic',
    xpReward: 500,
    criteria: {
      type: 'practice',
      value: 100
    }
  },
  
  // Streak achievements
  {
    id: 'streak-3',
    title: 'Getting Into Rhythm',
    description: 'Maintain a 3-day practice streak',
    category: 'streak',
    rarity: 'common',
    xpReward: 75,
    criteria: {
      type: 'streak',
      value: 3
    }
  },
  {
    id: 'streak-7',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day practice streak',
    category: 'streak',
    rarity: 'uncommon',
    xpReward: 100,
    heartsReward: 2,
    criteria: {
      type: 'streak',
      value: 7
    }
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day practice streak',
    category: 'streak',
    rarity: 'rare',
    xpReward: 500,
    criteria: {
      type: 'streak',
      value: 30
    }
  },
  {
    id: 'streak-100',
    title: 'Unstoppable',
    description: 'Maintain a 100-day practice streak',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    criteria: {
      type: 'streak',
      value: 100
    }
  },
  
  // Mastery achievements
  {
    id: 'mastery-module-1',
    title: 'Module Master',
    description: 'Complete all lessons in a module',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 200,
    criteria: {
      type: 'mastery',
      value: 1
    }
  },
  {
    id: 'mastery-track-1',
    title: 'Track Champion',
    description: 'Complete all modules in a track',
    category: 'mastery',
    rarity: 'epic',
    xpReward: 750,
    criteria: {
      type: 'mastery',
      value: 1
    }
  },
  {
    id: 'mastery-1',
    title: 'Mastery Begins',
    description: 'Complete your first mastery challenge',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 150,
    heartsReward: 1,
    criteria: {
      type: 'mastery',
      value: 1
    }
  },
  
  // Speed achievements
  {
    id: 'speed-shortcut-10',
    title: 'Quick Fingers',
    description: 'Execute 10 shortcuts in under 1 second each',
    category: 'speed',
    rarity: 'uncommon',
    xpReward: 150,
    criteria: {
      type: 'speed',
      value: 10
    }
  },
  {
    id: 'speed-shortcut-50',
    title: 'Lightning Hands',
    description: 'Execute 50 shortcuts in under 0.8 seconds each',
    category: 'speed',
    rarity: 'rare',
    xpReward: 300,
    criteria: {
      type: 'speed',
      value: 50
    }
  },
  
  // Exploration achievements
  {
    id: 'exploration-all-sections',
    title: 'Explorer',
    description: 'Visit all sections of the app',
    category: 'exploration',
    rarity: 'common',
    xpReward: 100,
    criteria: {
      type: 'exploration',
      value: 5
    }
  },
  {
    id: 'exploration-secret',
    title: 'Secret Finder',
    description: 'Discover a hidden feature',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 250,
    secret: true,
    criteria: {
      type: 'exploration',
      value: 1
    }
  },
  
  // Legendary achievements
  {
    id: 'legendary-1',
    title: 'Keyboard Grandmaster',
    description: 'Complete all mastery challenges with perfect scores',
    category: 'mastery',
    rarity: 'legendary',
    xpReward: 1000,
    heartsReward: 5,
    criteria: {
      type: 'mastery',
      value: 100
    }
  }
];

// Storage keys
const ACHIEVEMENTS_STORAGE_KEY = 'keyboard-dojo-achievements';
const ACHIEVEMENT_LISTENERS_KEY = 'achievement-listeners';

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
        const initialAchievements = defaultAchievements.map(achievement => ({
          achievement,
          progress: 0,
          completed: false
        }));
        
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(initialAchievements));
        return initialAchievements;
      }
      
      return JSON.parse(savedAchievements);
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }
  
  // Update achievement progress
  updateAchievementProgress(achievementId: string, progress: number): AchievementProgress | null {
    const achievements = this.getAchievements();
    const achievementIndex = achievements.findIndex(a => a.achievement.id === achievementId);
    
    if (achievementIndex === -1) {
      return null;
    }
    
    const achievement = achievements[achievementIndex];
    const wasCompleted = achievement.completed;
    
    // Update progress
    achievement.progress = Math.max(achievement.progress, progress);
    
    // Check if completed
    if (!wasCompleted && achievement.progress >= achievement.achievement.criteria.value) {
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
      a => a.achievement.criteria.type === type && !a.completed
    );
    
    // Check each achievement
    relevantAchievements.forEach(achievement => {
      // Check if criteria matches
      if (value >= achievement.achievement.criteria.value) {
        // Check additional criteria if needed
        let criteriaMatched = true;
        
        if (achievement.achievement.criteria.trackId && metadata?.trackId) {
          criteriaMatched = achievement.achievement.criteria.trackId === metadata.trackId;
        }
        
        if (achievement.achievement.criteria.moduleId && metadata?.moduleId) {
          criteriaMatched = criteriaMatched && achievement.achievement.criteria.moduleId === metadata.moduleId;
        }
        
        if (criteriaMatched) {
          // Update achievement
          const updated = this.updateAchievementProgress(
            achievement.achievement.id, 
            achievement.achievement.criteria.value
          );
          
          if (updated && updated.completed) {
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
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
  
  // Notify all listeners
  private notifyListeners(achievements: AchievementProgress[]): void {
    this.listeners.forEach(listener => listener(achievements));
  }
  
  // Reset all achievements (for testing)
  resetAchievements(): void {
    const initialAchievements = defaultAchievements.map(achievement => ({
      achievement,
      progress: 0,
      completed: false
    }));
    
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(initialAchievements));
    this.notifyListeners(initialAchievements);
  }
}

export const achievementsService = new AchievementsService(); 