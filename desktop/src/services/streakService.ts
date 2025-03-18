/**
 * Streak Service
 * 
 * This service manages user streaks, including daily practice tracking,
 * streak freezes, and streak-related rewards.
 */

import { audioService } from './audioService';
import { loggerService } from './loggerService';

// Interface for streak data
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  streakFreezes: number;
  streakHistory: {
    date: string;
    practiced: boolean;
    frozenStreak?: boolean;
  }[];
}

// Default streak data
const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  streakFreezes: 0,
  streakHistory: [],
};

class StreakService {
  private storageKey = 'user-streak';
  private streakData: StreakData = DEFAULT_STREAK_DATA;
  
  constructor() {
    this.loadStreakData();
    this.checkAndUpdateStreak();
  }
  
  /**
   * Load streak data from localStorage
   */
  private loadStreakData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        this.streakData = JSON.parse(savedData);
      }
    } catch (error) {
      loggerService.error('Error loading streak data:', { error });
    }
  }
  
  /**
   * Save streak data to localStorage
   */
  private saveStreakData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.streakData));
    } catch (error) {
      loggerService.error('Error saving streak data:', { error });
    }
  }
  
  /**
   * Check and update streak based on current date
   */
  private checkAndUpdateStreak(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (!this.streakData.lastPracticeDate) {
      // First time user, no need to update streak
      return;
    }
    
    const lastPracticeDate = new Date(this.streakData.lastPracticeDate);
    lastPracticeDate.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const daysSinceLastPractice = Math.floor(
      (today.getTime() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    
    if (daysSinceLastPractice === 0) {
      // Already practiced today, no need to update
      return;
    } else if (daysSinceLastPractice === 1) {
      // Practiced yesterday, streak continues
      return;
    } else if (daysSinceLastPractice === 2 && this.streakData.streakFreezes > 0) {
      // Missed one day but has streak freeze
      this.useStreakFreeze(yesterday.toISOString().split('T')[0]);
    } else {
      // Streak broken
      this.resetStreak();
    }
  }
  
  /**
   * Record a practice session for today
   * @returns Updated streak data
   */
  recordPractice(): StreakData {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if already practiced today
    if (this.streakData.lastPracticeDate === today) {
      return this.streakData;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if this is a continuation of a streak
    if (
      this.streakData.lastPracticeDate === yesterdayStr || 
      this.streakData.currentStreak === 0
    ) {
      // Increment streak
      this.streakData.currentStreak += 1;
      
      // Update longest streak if needed
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak;
      }
      
      // Play streak sound
      audioService.playSound('streak');
    } else {
      // Start a new streak
      this.streakData.currentStreak = 1;
    }
    
    // Update last practice date
    this.streakData.lastPracticeDate = today;
    
    // Add to streak history
    this.streakData.streakHistory.push({
      date: today,
      practiced: true,
    });
    
    // Save updated data
    this.saveStreakData();
    
    return this.streakData;
  }
  
  /**
   * Reset the current streak
   */
  private resetStreak(): void {
    this.streakData.currentStreak = 0;
    this.saveStreakData();
  }
  
  /**
   * Use a streak freeze to maintain streak
   * @param date The date to apply the streak freeze
   */
  private useStreakFreeze(date: string): void {
    if (this.streakData.streakFreezes <= 0) {
      return;
    }
    
    // Decrement streak freezes
    this.streakData.streakFreezes -= 1;
    
    // Add to streak history
    this.streakData.streakHistory.push({
      date,
      practiced: false,
      frozenStreak: true,
    });
    
    // Save updated data
    this.saveStreakData();
  }
  
  /**
   * Add streak freezes to the user's account
   * @param count Number of streak freezes to add
   * @returns Updated streak data
   */
  addStreakFreezes(count: number): StreakData {
    this.streakData.streakFreezes += count;
    this.saveStreakData();
    return this.streakData;
  }
  
  /**
   * Get the current streak data
   * @returns Current streak data
   */
  getStreakData(): StreakData {
    return this.streakData;
  }
  
  /**
   * Get the current streak count
   * @returns Current streak count
   */
  getCurrentStreak(): number {
    return this.streakData.currentStreak;
  }
  
  /**
   * Get the longest streak count
   * @returns Longest streak count
   */
  getLongestStreak(): number {
    return this.streakData.longestStreak;
  }
  
  /**
   * Get the number of available streak freezes
   * @returns Number of streak freezes
   */
  getStreakFreezes(): number {
    return this.streakData.streakFreezes;
  }
  
  /**
   * Check if the user has practiced today
   * @returns True if practiced today, false otherwise
   */
  hasPracticedToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.streakData.lastPracticeDate === today;
  }
  
  /**
   * Get streak history for a specific month
   * @param year Year (e.g., 2023)
   * @param month Month (1-12)
   * @returns Array of streak history entries for the month
   */
  getMonthlyStreakHistory(year: number, month: number): StreakData['streakHistory'] {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    return this.streakData.streakHistory.filter(
      (entry) => entry.date >= startDate && entry.date <= endDate,
    );
  }
}

// Create and export a singleton instance
export const streakService = new StreakService(); 
