/**
 * XP Service
 * 
 * This service manages user experience points (XP) and level progression.
 * It handles XP rewards, level calculations, and related functionality.
 */

import { audioService } from './audioService';
import { loggerService } from './loggerService';

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
  MONTHLY_STREAK: 200, // Additional for 30-day streak
  CORRECT_ANSWER: 5, // Per correct answer
  COMBO_BONUS: 2, // Per consecutive correct answer
};

// Interface for XP data
export interface XPData {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpHistory: {
    date: string;
    amount: number;
    source: string;
    description?: string;
  }[];
  levelHistory: {
    date: string;
    level: number;
  }[];
}

// Default XP data
const DEFAULT_XP_DATA: XPData = {
  totalXP: 0,
  level: 1,
  currentLevelXP: 0,
  nextLevelXP: XP_THRESHOLDS[1],
  xpHistory: [],
  levelHistory: [{
    date: new Date().toISOString(),
    level: 1,
  }],
};

// Event for level up
export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  title: string;
}

class XPService {
  private storageKey = 'user-xp';
  private xpData: XPData = DEFAULT_XP_DATA;
  private levelUpListeners: ((event: LevelUpEvent) => void)[] = [];
  private changeListeners: (() => void)[] = [];
  
  constructor() {
    this.loadXPData();
  }
  
  /**
   * Load XP data from localStorage
   */
  private loadXPData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        this.xpData = JSON.parse(savedData);
      }
    } catch (error) {
      loggerService.error('Failed to load XP data:', { error });
    }
  }
  
  /**
   * Save XP data to localStorage
   */
  private saveXPData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.xpData));
    } catch (error) {
      loggerService.error('Failed to save XP data:', { error });
    }
  }
  
  /**
   * Add XP to the user's account
   * @param amount Amount of XP to add
   * @param source Source of the XP (e.g., 'lesson', 'streak', 'challenge')
   * @param description Optional description of the XP reward
   * @returns Updated XP data
   */
  addXP(amount: number, source: string, description?: string): XPData {
    if (amount <= 0) {
      return this.xpData;
    }
    
    const oldLevel = this.xpData.level;
    
    // Add XP
    this.xpData.totalXP += amount;
    
    // Add to XP history
    this.xpData.xpHistory.push({
      date: new Date().toISOString(),
      amount,
      source,
      description,
    });
    
    // Update level
    this.updateLevel(oldLevel);
    
    // Save data
    this.saveXPData();
    
    // Notify change listeners
    this.notifyChangeListeners();
    
    return this.xpData;
  }
  
  /**
   * Update user level based on total XP
   * @param oldLevel Previous level for comparison
   */
  private updateLevel(oldLevel: number): void {
    // Find the highest level threshold that is less than or equal to the user's XP
    let newLevel = 1;
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
      if (this.xpData.totalXP >= XP_THRESHOLDS[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }
    
    // Check if user leveled up
    if (newLevel > oldLevel) {
      this.xpData.level = newLevel;
      
      // Calculate XP for current level
      const currentLevelThreshold = XP_THRESHOLDS[newLevel - 1] || 0;
      const nextLevelThreshold = XP_THRESHOLDS[newLevel] || XP_THRESHOLDS[newLevel - 1] + 1000;
      
      this.xpData.currentLevelXP = this.xpData.totalXP - currentLevelThreshold;
      this.xpData.nextLevelXP = nextLevelThreshold;
      
      // Add to level history
      this.xpData.levelHistory.push({
        date: new Date().toISOString(),
        level: newLevel,
      });
      
      // Play level up sound
      audioService.playSound('levelUp');
      
      // Notify listeners
      this.notifyLevelUp(oldLevel, newLevel);
    } else {
      // Just update current level XP
      const currentLevelThreshold = XP_THRESHOLDS[newLevel - 1] || 0;
      this.xpData.currentLevelXP = this.xpData.totalXP - currentLevelThreshold;
    }
  }
  
  /**
   * Notify level up listeners
   * @param oldLevel Previous level
   * @param newLevel New level
   */
  private notifyLevelUp(oldLevel: number, newLevel: number): void {
    const event: LevelUpEvent = {
      oldLevel,
      newLevel,
      title: this.getLevelTitle(newLevel),
    };
    
    this.levelUpListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        loggerService.error('Error in level up listener:', { error });
      }
    });
  }
  
  /**
   * Add a level up listener
   * @param listener Function to call when user levels up
   * @returns Function to remove the listener
   */
  onLevelUp(listener: (event: LevelUpEvent) => void): () => void {
    this.levelUpListeners.push(listener);
    
    // Return function to remove listener
    return () => {
      this.levelUpListeners = this.levelUpListeners.filter((l) => l !== listener);
    };
  }
  
  /**
   * Get the current XP data
   * @returns Current XP data
   */
  getXPData(): XPData {
    return this.xpData;
  }
  
  /**
   * Get the current level
   * @returns Current level
   */
  getLevel(): number {
    return this.xpData.level;
  }
  
  /**
   * Get the total XP
   * @returns Total XP
   */
  getTotalXP(): number {
    return this.xpData.totalXP;
  }
  
  /**
   * Get the title for a specific level
   * @param level Level to get title for (defaults to current level)
   * @returns Level title
   */
  getLevelTitle(level?: number): string {
    const targetLevel = level || this.xpData.level;
    const index = Math.min(targetLevel - 1, LEVEL_TITLES.length - 1);
    return LEVEL_TITLES[index];
  }
  
  /**
   * Get the progress percentage towards the next level
   * @returns Progress percentage (0-100)
   */
  getLevelProgress(): number {
    if (this.xpData.level >= XP_THRESHOLDS.length) {
      return 100; // Max level reached
    }
    
    const currentLevelXP = this.xpData.currentLevelXP;
    const xpForNextLevel = this.xpData.nextLevelXP - XP_THRESHOLDS[this.xpData.level - 1];
    
    return Math.min(100, Math.floor((currentLevelXP / xpForNextLevel) * 100));
  }
  
  /**
   * Get XP needed for the next level
   * @returns XP needed for the next level
   */
  getXPForNextLevel(): number {
    if (this.xpData.level >= XP_THRESHOLDS.length) {
      return 0; // Max level reached
    }
    
    return this.xpData.nextLevelXP - this.xpData.totalXP;
  }
  
  /**
   * Get XP history for a specific date range
   * @param startDate Start date (ISO string)
   * @param endDate End date (ISO string)
   * @returns XP history entries in the date range
   */
  getXPHistory(startDate: string, endDate: string): XPData['xpHistory'] {
    return this.xpData.xpHistory.filter(
      (entry) => entry.date >= startDate && entry.date <= endDate,
    );
  }
  
  /**
   * Get XP earned today
   * @returns XP earned today
   */
  getXPToday(): number {
    const today = new Date().toISOString().split('T')[0];
    
    return this.xpData.xpHistory
      .filter((entry) => entry.date.startsWith(today))
      .reduce((total, entry) => total + entry.amount, 0);
  }
  
  /**
   * Reset XP data (for testing or admin purposes)
   */
  resetXP(): void {
    this.xpData = DEFAULT_XP_DATA;
    this.saveXPData();
  }
  
  /**
   * Notify change listeners
   */
  private notifyChangeListeners(): void {
    this.changeListeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        loggerService.error('Error in XP change listener:', { error });
      }
    });
  }
  
  /**
   * Subscribe to XP data changes
   * @param listener Function to call when XP data changes
   */
  subscribe(listener: () => void): void {
    this.changeListeners.push(listener);
  }
  
  /**
   * Unsubscribe from XP data changes
   * @param listener Function to remove from listeners
   */
  unsubscribe(listener: () => void): void {
    this.changeListeners = this.changeListeners.filter((l) => l !== listener);
  }
  
  /**
   * Subscribe to level up events
   * @param listener Function to call when user levels up
   */
  subscribeToLevelUp(listener: (newLevel: number) => void): void {
    this.onLevelUp((event) => listener(event.newLevel));
  }
  
  /**
   * Unsubscribe from level up events
   * @param listener Function to remove from listeners
   */
  unsubscribeFromLevelUp(listener: (newLevel: number) => void): void {
    // Since we're wrapping the listener in onLevelUp, we can't directly remove it
    // This is a limitation of the current implementation
    loggerService.warn('unsubscribeFromLevelUp is not fully implemented');
  }
}

// Create and export a singleton instance
export const xpService = new XPService(); 
