/**
 * Hearts Service
 * 
 * This service manages the hearts/lives system, including:
 * - Heart consumption when failing lessons
 * - Heart regeneration over time
 * - Heart refills (purchased or from level-ups)
 * - Premium status (unlimited hearts)
 */

import { audioService } from './audioService';
import { BaseService } from './BaseService';
import { currencyService } from './currencyService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

// Interface for hearts data
export interface HeartsData {
  current: number;
  max: number;
  lastRegeneration: string; // ISO date string
  nextRegenerationTime: string; // ISO date string
  isPremium: boolean;
}

// Default hearts data
const DEFAULT_HEARTS_DATA: HeartsData = {
  current: 5,
  max: 5,
  lastRegeneration: new Date().toISOString(),
  nextRegenerationTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
  isPremium: false,
};

// Hearts configuration
export const HEARTS_CONFIG = {
  REGENERATION_TIME_MINUTES: 30, // Time to regenerate one heart (in minutes)
  COST_PER_REFILL: 20, // Currency cost to refill all hearts
  HEARTS_LOST_ON_FAILURE: 1, // Hearts lost when failing a lesson
};

// Interface for hearts change event
export interface HeartsChangeEvent {
  oldHearts: number;
  newHearts: number;
  change: number;
  reason: string;
}

class HeartsService extends BaseService {
  private storageKey = 'user-hearts';
  private heartsData: HeartsData = DEFAULT_HEARTS_DATA;
  private changeListeners: ((event: HeartsChangeEvent) => void)[] = [];
  private regenerationTimer: number | null = null;
  
  constructor() {
    super();
  }
  
  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    await super.initialize();
    
    try {
      // Load hearts data
      this.loadHeartsData();
      this.checkAndRegenerateHearts();
      this.startRegenerationTimer();
      
      // Check for heart regeneration when the window becomes visible again
      if (typeof window !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            this.checkAndRegenerateHearts();
          }
        });
      }
      
      loggerService.info('Hearts service initialized', { 
        component: 'HeartsService',
      });
      
      this._status.initialized = true;
    } catch (error) {
      loggerService.error('Failed to initialize hearts service', error, { 
        component: 'HeartsService',
      });
      
      this._status.error = error instanceof Error ? error : new Error(String(error));
      this._status.initialized = false;
      
      // Rethrow the error to properly signal initialization failure
      throw error;
    }
  }

  /**
   * Clean up the service
   */
  cleanup(): void {
    try {
      // Save any unsaved hearts data
      this.saveHeartsData();
      
      // Clear the regeneration timer
      if (this.regenerationTimer !== null) {
        clearTimeout(this.regenerationTimer);
        this.regenerationTimer = null;
      }
      
      // Remove event listeners
      if (typeof window !== 'undefined') {
        document.removeEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            this.checkAndRegenerateHearts();
          }
        });
      }
      
      loggerService.info('Hearts service cleaned up', { 
        component: 'HeartsService',
      });
      
      super.cleanup();
    } catch (error) {
      loggerService.error('Error cleaning up hearts service', error, { 
        component: 'HeartsService',
      });
      // Don't throw
    }
  }
  
  /**
   * Load hearts data from localStorage
   */
  private loadHeartsData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        this.heartsData = JSON.parse(savedData);
      }
    } catch (error) {
      loggerService.error('Failed to load hearts data:', { error });
    }
  }
  
  /**
   * Save hearts data to localStorage
   */
  private saveHeartsData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.heartsData));
    } catch (error) {
      loggerService.error('Failed to save hearts data:', { error });
    }
  }
  
  /**
   * Start the heart regeneration timer
   */
  private startRegenerationTimer(): void {
    // Clear any existing timer
    if (this.regenerationTimer !== null) {
      window.clearInterval(this.regenerationTimer);
    }
    
    // Check for heart regeneration every minute
    this.regenerationTimer = window.setInterval(() => {
      this.checkAndRegenerateHearts();
    }, 60 * 1000); // Check every minute
  }
  
  /**
   * Check and regenerate hearts if needed
   */
  private checkAndRegenerateHearts(): void {
    // Premium users always have max hearts
    if (this.heartsData.isPremium) {
      if (this.heartsData.current < this.heartsData.max) {
        this.setHearts(this.heartsData.max, 'premium');
      }
      return;
    }
    
    // Skip if already at max hearts
    if (this.heartsData.current >= this.heartsData.max) {
      return;
    }
    
    const now = new Date();
    const nextRegenTime = new Date(this.heartsData.nextRegenerationTime);
    
    // Check if it's time to regenerate a heart
    if (now >= nextRegenTime) {
      // Calculate how many hearts to regenerate based on time passed
      const timeSinceLastRegen = now.getTime() - nextRegenTime.getTime();
      const additionalHeartsToRegen = Math.floor(
        timeSinceLastRegen / (HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000),
      ) + 1; // +1 for the scheduled regeneration
      
      const heartsToAdd = Math.min(
        additionalHeartsToRegen,
        this.heartsData.max - this.heartsData.current,
      );
      
      if (heartsToAdd > 0) {
        // Add hearts
        const oldHearts = this.heartsData.current;
        this.heartsData.current = Math.min(this.heartsData.max, this.heartsData.current + heartsToAdd);
        
        // Update last regeneration time
        this.heartsData.lastRegeneration = now.toISOString();
        
        // Calculate next regeneration time
        if (this.heartsData.current < this.heartsData.max) {
          this.heartsData.nextRegenerationTime = new Date(
            now.getTime() + HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000,
          ).toISOString();
        }
        
        // Save changes
        this.saveHeartsData();
        
        // Notify listeners
        this.notifyChangeListeners({
          oldHearts,
          newHearts: this.heartsData.current,
          change: heartsToAdd,
          reason: 'regeneration',
        });
        
        // Play heart regeneration sound
        audioService.playSound('heart_regenerate');
      }
    }
  }
  
  /**
   * Use hearts (e.g., when failing a lesson)
   * @param count Number of hearts to use
   * @param reason Reason for using hearts
   * @returns Whether hearts were successfully used
   */
  useHearts(count: number = HEARTS_CONFIG.HEARTS_LOST_ON_FAILURE, reason: string = 'lesson_failure'): boolean {
    // Premium users don't lose hearts
    if (this.heartsData.isPremium) {
      return true;
    }
    
    // Check if user has enough hearts
    if (this.heartsData.current < count) {
      return false;
    }
    
    // Use hearts
    const oldHearts = this.heartsData.current;
    this.heartsData.current -= count;
    
    // If this is the first heart used (going from max to max-1),
    // start the regeneration timer
    if (oldHearts === this.heartsData.max) {
      const now = new Date();
      this.heartsData.lastRegeneration = now.toISOString();
      this.heartsData.nextRegenerationTime = new Date(
        now.getTime() + HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000,
      ).toISOString();
    }
    
    // Save changes
    this.saveHeartsData();
    
    // Notify listeners
    this.notifyChangeListeners({
      oldHearts,
      newHearts: this.heartsData.current,
      change: -count,
      reason,
    });
    
    // Play heart loss sound
    audioService.playSound('heart_lost');
    
    return true;
  }
  
  /**
   * Add hearts (e.g., from level-up rewards or purchases)
   * @param count Number of hearts to add
   * @param reason Reason for adding hearts
   * @returns Updated hearts data
   */
  addHearts(count: number, reason: string = 'reward'): HeartsData {
    // Skip for premium users (they always have max hearts)
    if (this.heartsData.isPremium) {
      return this.heartsData;
    }
    
    // Add hearts
    const oldHearts = this.heartsData.current;
    this.heartsData.current = Math.min(this.heartsData.max, this.heartsData.current + count);
    
    // If we're now at max hearts, clear the regeneration timer
    if (this.heartsData.current === this.heartsData.max) {
      this.heartsData.nextRegenerationTime = '';
    }
    
    // Save changes
    this.saveHeartsData();
    
    // Only notify if hearts actually changed
    if (oldHearts !== this.heartsData.current) {
      // Notify listeners
      this.notifyChangeListeners({
        oldHearts,
        newHearts: this.heartsData.current,
        change: this.heartsData.current - oldHearts,
        reason,
      });
      
      // Play heart gain sound
      audioService.playSound('heart_gain');
    }
    
    return this.heartsData;
  }
  
  /**
   * Refill all hearts (using currency)
   * @returns Whether the refill was successful
   */
  refillHearts(): boolean {
    // Skip for premium users
    if (this.heartsData.isPremium) {
      return true;
    }
    
    // Skip if already at max hearts
    if (this.heartsData.current >= this.heartsData.max) {
      return false;
    }
    
    // Try to spend currency
    const success = currencyService.spendCurrency(
      HEARTS_CONFIG.COST_PER_REFILL,
      'heart_refill',
      'Refill all hearts',
    );
    
    if (success) {
      // Calculate hearts to add
      const heartsToAdd = this.heartsData.max - this.heartsData.current;
      
      // Add hearts
      this.addHearts(heartsToAdd, 'purchase');
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Set premium status (unlimited hearts)
   * @param isPremium Whether the user has premium status
   */
  setPremiumStatus(isPremium: boolean): void {
    this.heartsData.isPremium = isPremium;
    
    // If becoming premium, refill hearts
    if (isPremium && this.heartsData.current < this.heartsData.max) {
      this.setHearts(this.heartsData.max, 'premium_upgrade');
    }
    
    // Save changes
    this.saveHeartsData();
  }
  
  /**
   * Set the current number of hearts
   * @param hearts Number of hearts
   * @param reason Reason for setting hearts
   */
  private setHearts(hearts: number, reason: string): void {
    const oldHearts = this.heartsData.current;
    this.heartsData.current = Math.min(this.heartsData.max, Math.max(0, hearts));
    
    // Save changes
    this.saveHeartsData();
    
    // Notify listeners if hearts changed
    if (oldHearts !== this.heartsData.current) {
      this.notifyChangeListeners({
        oldHearts,
        newHearts: this.heartsData.current,
        change: this.heartsData.current - oldHearts,
        reason,
      });
    }
  }
  
  /**
   * Set the maximum number of hearts
   * @param max Maximum number of hearts
   */
  setMaxHearts(max: number): void {
    if (max < 1) return; // Minimum of 1 heart
    
    this.heartsData.max = max;
    
    // Ensure current hearts don't exceed max
    if (this.heartsData.current > max) {
      this.heartsData.current = max;
    }
    
    // Save changes
    this.saveHeartsData();
  }
  
  /**
   * Get the current hearts data
   * @returns Hearts data
   */
  getHeartsData(): HeartsData {
    // Ensure we have the latest data
    this.checkAndRegenerateHearts();
    return this.heartsData;
  }
  
  /**
   * Get the current number of hearts
   * @returns Current hearts
   */
  getCurrentHearts(): number {
    // Ensure we have the latest data
    this.checkAndRegenerateHearts();
    return this.heartsData.current;
  }
  
  /**
   * Get the maximum number of hearts
   * @returns Maximum hearts
   */
  getMaxHearts(): number {
    return this.heartsData.max;
  }
  
  /**
   * Get the time until the next heart regenerates
   * @returns Time in milliseconds until next heart, or 0 if at max hearts
   */
  getTimeUntilNextHeart(): number {
    // Premium users or users at max hearts don't need to wait
    if (this.heartsData.isPremium || this.heartsData.current >= this.heartsData.max) {
      return 0;
    }
    
    const now = new Date();
    const nextRegenTime = new Date(this.heartsData.nextRegenerationTime);
    
    return Math.max(0, nextRegenTime.getTime() - now.getTime());
  }
  
  /**
   * Check if the user has enough hearts for an activity
   * @param required Number of hearts required
   * @returns Whether the user has enough hearts
   */
  hasEnoughHearts(required: number = 1): boolean {
    // Premium users always have enough hearts
    if (this.heartsData.isPremium) {
      return true;
    }
    
    // Ensure we have the latest data
    this.checkAndRegenerateHearts();
    
    return this.heartsData.current >= required;
  }
  
  /**
   * Subscribe to heart change events
   * @param listener Function to call when hearts change
   */
  subscribe(listener: (event: HeartsChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }
  
  /**
   * Unsubscribe from heart change events
   * @param listener Function to remove from listeners
   */
  unsubscribe(listener: (event: HeartsChangeEvent) => void): void {
    this.changeListeners = this.changeListeners.filter((l) => l !== listener);
  }
  
  /**
   * Notify all listeners of a heart change
   * @param event Heart change event
   */
  private notifyChangeListeners(event: HeartsChangeEvent): void {
    this.changeListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        loggerService.error('Error in hearts change listener:', { error });
      }
    });
  }
  
  /**
   * Reset hearts data (for testing)
   */
  resetHearts(): void {
    this.heartsData = { ...DEFAULT_HEARTS_DATA };
    this.saveHeartsData();
  }
}

// Export a singleton instance
export const heartsService = new HeartsService(); 

// Register with ServiceFactory
serviceFactory.register('heartsService', heartsService);

export default heartsService; 
