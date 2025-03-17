/**
 * User Progress Service
 * 
 * This service manages user progress, including XP, levels, streaks,
 * and completed lessons/challenges.
 */

import { ApplicationType, UserProgress } from '../types/curriculum';

// XP thresholds for each level
const XP_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
  10000,  // Level 11
  13000,  // Level 12
  16500,  // Level 13
  20500,  // Level 14
  25000,  // Level 15
];

// Level titles
const LEVEL_TITLES = [
  'Keyboard Novice',      // Level 1
  'Shortcut Apprentice',  // Level 2
  'Key Combo Adept',      // Level 3
  'Hotkey Enthusiast',    // Level 4
  'Shortcut Specialist',  // Level 5
  'Keyboard Tactician',   // Level 6
  'Efficiency Expert',    // Level 7
  'Shortcut Virtuoso',    // Level 8
  'Keyboard Maestro',     // Level 9
  'Shortcut Sensei',      // Level 10
  'Keyboard Wizard',      // Level 11
  'Shortcut Grandmaster', // Level 12
  'Keyboard Sage',        // Level 13
  'Shortcut Legend',      // Level 14
  'Keyboard Dojo Master', // Level 15
];

// XP rewards for different activities
export const XP_REWARDS = {
  COMPLETE_LESSON: 50,
  PERFECT_LESSON: 25, // Additional XP for 100% accuracy
  COMPLETE_MODULE: 100,
  COMPLETE_CHALLENGE: 75,
  DAILY_STREAK: 10, // Per day
  WEEKLY_STREAK: 50, // Additional for 7-day streak
};

class UserProgressService {
  private storageKey = 'userProgress';
  private userProgress: UserProgress | null = null;
  
  constructor() {
    this.loadProgress();
  }
  
  /**
   * Load user progress from local storage
   */
  private loadProgress(): void {
    try {
      const savedProgress = localStorage.getItem(this.storageKey);
      if (savedProgress) {
        this.userProgress = JSON.parse(savedProgress);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  }
  
  /**
   * Save user progress to local storage
   */
  private saveProgress(): void {
    if (this.userProgress) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.userProgress));
      } catch (error) {
        console.error('Failed to save user progress:', error);
      }
    }
  }
  
  /**
   * Initialize user progress if not already initialized
   */
  initializeProgress(userId: string): UserProgress {
    if (!this.userProgress) {
      this.userProgress = {
        userId,
        completedLessons: [],
        completedModules: [],
        currentLessons: [],
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActivity: new Date().toISOString(),
      };
      this.saveProgress();
    }
    
    return this.userProgress;
  }
  
  /**
   * Get user progress
   * @returns User progress, or null if not initialized
   */
  getProgress(): UserProgress | null {
    return this.userProgress;
  }
  
  /**
   * Add XP to user progress
   * @param xp Amount of XP to add
   * @returns Updated user progress
   */
  addXP(xp: number): UserProgress | null {
    if (!this.userProgress) return null;
    
    // Add XP
    this.userProgress.xp += xp;
    
    // Update level based on XP
    this.updateLevel();
    
    // Save progress
    this.saveProgress();
    
    return this.userProgress;
  }
  
  /**
   * Update user level based on current XP
   */
  private updateLevel(): void {
    if (!this.userProgress) return;
    
    // Find the highest level threshold that is less than or equal to the user's XP
    let newLevel = 1;
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
      if (this.userProgress.xp >= XP_THRESHOLDS[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }
    
    // Check if user leveled up
    if (newLevel > this.userProgress.level) {
      const oldLevel = this.userProgress.level;
      this.userProgress.level = newLevel;
      
      // In a real app, this would trigger a level-up event/animation
      console.log(`Level up! ${oldLevel} -> ${newLevel}`);
    }
  }
  
  /**
   * Get the XP required for the next level
   * @returns XP required for the next level, or null if at max level
   */
  getNextLevelXP(): number | null {
    if (!this.userProgress) return null;
    
    const currentLevel = this.userProgress.level;
    if (currentLevel >= XP_THRESHOLDS.length) {
      return null; // Max level reached
    }
    
    return XP_THRESHOLDS[currentLevel];
  }
  
  /**
   * Get the title for the current level
   * @returns Level title
   */
  getLevelTitle(): string | null {
    if (!this.userProgress) return null;
    
    const level = Math.min(this.userProgress.level, LEVEL_TITLES.length) - 1;
    return LEVEL_TITLES[level];
  }
  
  /**
   * Get the progress percentage towards the next level
   * @returns Progress percentage (0-100)
   */
  getLevelProgress(): number | null {
    if (!this.userProgress) return null;
    
    const currentLevel = this.userProgress.level;
    if (currentLevel >= XP_THRESHOLDS.length) {
      return 100; // Max level reached
    }
    
    const currentLevelXP = XP_THRESHOLDS[currentLevel - 1] || 0;
    const nextLevelXP = XP_THRESHOLDS[currentLevel];
    const xpForCurrentLevel = this.userProgress.xp - currentLevelXP;
    const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(100, Math.floor((xpForCurrentLevel / xpRequiredForNextLevel) * 100));
  }
  
  /**
   * Update user streak
   * @returns Updated user progress
   */
  updateStreak(): UserProgress | null {
    if (!this.userProgress) return null;
    
    const lastActivityDate = new Date(this.userProgress.lastActivity);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset date parts to compare only dates, not times
    lastActivityDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    // Check if the last activity was yesterday
    if (lastActivityDate.getTime() === yesterday.getTime()) {
      // Increment streak
      this.userProgress.streakDays += 1;
      
      // Add streak XP
      this.addXP(XP_REWARDS.DAILY_STREAK);
      
      // Check for weekly streak
      if (this.userProgress.streakDays % 7 === 0) {
        this.addXP(XP_REWARDS.WEEKLY_STREAK);
      }
    } 
    // Check if the last activity was today (no change to streak)
    else if (lastActivityDate.getTime() === today.getTime()) {
      // No change to streak
    }
    // Otherwise, reset streak (gap in activity)
    else {
      this.userProgress.streakDays = 1;
    }
    
    // Update last activity
    this.userProgress.lastActivity = today.toISOString();
    
    // Save progress
    this.saveProgress();
    
    return this.userProgress;
  }
  
  /**
   * Complete a lesson
   * @param trackId The track ID
   * @param moduleId The module ID
   * @param lessonId The lesson ID
   * @param score The score (0-100)
   * @param timeSpent Time spent in seconds
   * @returns Updated user progress
   */
  completeLesson(
    trackId: ApplicationType,
    moduleId: string,
    lessonId: string,
    score: number,
    timeSpent: number
  ): UserProgress | null {
    if (!this.userProgress) return null;
    
    // Check if the lesson is already completed
    const existingCompletionIndex = this.userProgress.completedLessons.findIndex(
      cl => cl.lessonId === lessonId
    );
    
    // Calculate XP earned (based on score and lesson XP reward)
    const baseXP = XP_REWARDS.COMPLETE_LESSON;
    const scoreMultiplier = score / 100;
    let xpEarned = Math.round(baseXP * scoreMultiplier);
    
    // Bonus XP for perfect score
    if (score === 100) {
      xpEarned += XP_REWARDS.PERFECT_LESSON;
    }
    
    if (existingCompletionIndex >= 0) {
      // Update existing completion
      this.userProgress.completedLessons[existingCompletionIndex] = {
        lessonId,
        completedAt: new Date().toISOString(),
        score,
        timeSpent,
      };
    } else {
      // Add new completion
      this.userProgress.completedLessons.push({
        lessonId,
        completedAt: new Date().toISOString(),
        score,
        timeSpent,
      });
      
      // Add XP
      this.addXP(xpEarned);
    }
    
    // Update current lessons
    const currentLessonIndex = this.userProgress.currentLessons.findIndex(
      cl => cl.trackId === trackId && cl.lessonId === lessonId
    );
    
    if (currentLessonIndex >= 0) {
      // Update existing current lesson
      this.userProgress.currentLessons[currentLessonIndex].progress = 100;
    } else {
      // Add new current lesson
      this.userProgress.currentLessons.push({
        trackId,
        lessonId,
        progress: 100,
      });
    }
    
    // Update streak
    this.updateStreak();
    
    // Save progress
    this.saveProgress();
    
    return this.userProgress;
  }
  
  /**
   * Complete a module
   * @param trackId The track ID
   * @param moduleId The module ID
   * @returns Updated user progress
   */
  completeModule(trackId: ApplicationType, moduleId: string): UserProgress | null {
    if (!this.userProgress) return null;
    
    // Check if the module is already completed
    const moduleCompleted = this.userProgress.completedModules.some(cm => cm.moduleId === moduleId);
    
    if (!moduleCompleted) {
      // Add completed module
      this.userProgress.completedModules.push({
        moduleId,
        completedAt: new Date().toISOString(),
      });
      
      // Add XP
      this.addXP(XP_REWARDS.COMPLETE_MODULE);
      
      // Update streak
      this.updateStreak();
    }
    
    // Save progress
    this.saveProgress();
    
    return this.userProgress;
  }
  
  /**
   * Complete a mastery challenge
   * @param trackId The track ID
   * @param challengeId The challenge ID
   * @param score The score (0-100)
   * @returns Updated user progress
   */
  completeChallenge(trackId: ApplicationType, challengeId: string, score: number): UserProgress | null {
    if (!this.userProgress) return null;
    
    // In a real app, this would track completed challenges
    console.log(`Challenge completed: ${challengeId} with score ${score}`);
    
    // Calculate XP earned (based on score and challenge XP reward)
    const baseXP = XP_REWARDS.COMPLETE_CHALLENGE;
    const scoreMultiplier = score / 100;
    const xpEarned = Math.round(baseXP * scoreMultiplier);
    
    // Add XP
    this.addXP(xpEarned);
    
    // Update streak
    this.updateStreak();
    
    // Save progress
    this.saveProgress();
    
    return this.userProgress;
  }
  
  /**
   * Reset user progress (for testing)
   */
  resetProgress(): void {
    this.userProgress = null;
    localStorage.removeItem(this.storageKey);
  }
}

// Export a singleton instance
export const userProgressService = new UserProgressService(); 