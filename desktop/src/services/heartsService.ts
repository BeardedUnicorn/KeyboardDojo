/**
 * Hearts Service
 * 
 * This service manages the hearts/lives system for challenges,
 * including tracking available hearts, regeneration, and usage.
 */

import { storageService } from '../../../shared/src/utils';
import { subscriptionService } from './subscriptionService';

// Configuration for hearts system
const HEARTS_CONFIG = {
  MAX_HEARTS: 5,
  PREMIUM_MAX_HEARTS: 999, // Effectively unlimited for premium users
  REGENERATION_TIME_MS: 30 * 60 * 1000, // 30 minutes
  PREMIUM_REGENERATION_TIME_MS: 15 * 60 * 1000, // 15 minutes for premium users
  STORAGE_KEY: 'hearts-state',
};

// Interface for hearts state
interface HeartsState {
  currentHearts: number;
  maxHearts: number;
  nextRegenerationTime: number | null;
  lastUpdated: number;
}

/**
 * Service to manage hearts/lives system for challenges
 */
class HeartsService {
  private state: HeartsState;
  private regenerationTimer: number | null = null;

  constructor() {
    this.state = {
      currentHearts: HEARTS_CONFIG.MAX_HEARTS,
      maxHearts: HEARTS_CONFIG.MAX_HEARTS,
      nextRegenerationTime: null,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Load hearts state from storage
   */
  private async loadState(): Promise<HeartsState> {
    try {
      const savedState = await storageService.getItem<HeartsState>(
        HEARTS_CONFIG.STORAGE_KEY,
        this.state
      );
      return savedState || this.state;
    } catch (error) {
      console.error('Failed to load hearts state:', error);
      return this.state;
    }
  }

  /**
   * Save hearts state to storage
   */
  private async saveState(): Promise<void> {
    try {
      await storageService.setItem(HEARTS_CONFIG.STORAGE_KEY, this.state);
    } catch (error) {
      console.error('Failed to save hearts state:', error);
    }
  }

  /**
   * Initialize hearts service
   */
  async initialize(): Promise<void> {
    // Initialize subscription service first
    await subscriptionService.initialize();
    
    // Load state
    this.state = await this.loadState();
    
    // Update max hearts based on subscription
    this.updateMaxHearts();
    
    this.updateHeartsBasedOnElapsedTime();
    this.startRegenerationTimer();
    
    // Listen for subscription changes
    subscriptionService.addListener(() => {
      this.updateMaxHearts();
      this.updateHeartsBasedOnElapsedTime();
      this.startRegenerationTimer();
    });
  }

  /**
   * Update max hearts based on subscription status
   */
  private updateMaxHearts(): void {
    const hasPremium = subscriptionService.hasPremiumFeatures();
    this.state.maxHearts = hasPremium ? HEARTS_CONFIG.PREMIUM_MAX_HEARTS : HEARTS_CONFIG.MAX_HEARTS;
    
    // If current hearts is less than max hearts, add one heart as a bonus for premium users
    if (hasPremium && this.state.currentHearts < this.state.maxHearts) {
      this.state.currentHearts = Math.min(this.state.currentHearts + 1, this.state.maxHearts);
    }
    
    this.saveState();
  }

  /**
   * Update hearts based on elapsed time since last update
   */
  private updateHeartsBasedOnElapsedTime(): void {
    const now = Date.now();
    const elapsedTime = now - this.state.lastUpdated;
    const hasPremium = subscriptionService.hasPremiumFeatures();
    const regenerationTime = hasPremium 
      ? HEARTS_CONFIG.PREMIUM_REGENERATION_TIME_MS 
      : HEARTS_CONFIG.REGENERATION_TIME_MS;

    if (this.state.currentHearts < this.state.maxHearts) {
      // Calculate how many hearts should have regenerated
      const heartsToAdd = Math.floor(elapsedTime / regenerationTime);

      if (heartsToAdd > 0) {
        // Add regenerated hearts, but don't exceed max
        this.state.currentHearts = Math.min(
          this.state.currentHearts + heartsToAdd,
          this.state.maxHearts
        );

        // If we still need more hearts, set the next regeneration time
        if (this.state.currentHearts < this.state.maxHearts) {
          const remainingTime = elapsedTime % regenerationTime;
          this.state.nextRegenerationTime = now + (regenerationTime - remainingTime);
        } else {
          this.state.nextRegenerationTime = null;
        }
      } else if (this.state.nextRegenerationTime === null) {
        // If no hearts were added but we're not at max, set next regeneration time
        this.state.nextRegenerationTime = now + regenerationTime;
      }
    }

    this.state.lastUpdated = now;
    this.saveState();
  }

  /**
   * Start timer for heart regeneration
   */
  private startRegenerationTimer(): void {
    // Clear any existing timer
    if (this.regenerationTimer !== null) {
      window.clearTimeout(this.regenerationTimer);
      this.regenerationTimer = null;
    }

    // If we're at max hearts, no need for a timer
    if (this.state.currentHearts >= this.state.maxHearts) {
      return;
    }

    // Calculate time until next heart
    const timeUntilNextHeart = this.getTimeUntilNextHeart();
    
    if (timeUntilNextHeart > 0) {
      this.regenerationTimer = window.setTimeout(() => {
        // Add a heart
        this.state.currentHearts = Math.min(this.state.currentHearts + 1, this.state.maxHearts);
        
        // Update next regeneration time
        const hasPremium = subscriptionService.hasPremiumFeatures();
        const regenerationTime = hasPremium 
          ? HEARTS_CONFIG.PREMIUM_REGENERATION_TIME_MS 
          : HEARTS_CONFIG.REGENERATION_TIME_MS;
        
        if (this.state.currentHearts < this.state.maxHearts) {
          this.state.nextRegenerationTime = Date.now() + regenerationTime;
        } else {
          this.state.nextRegenerationTime = null;
        }
        
        this.state.lastUpdated = Date.now();
        this.saveState();
        
        // Restart timer if needed
        this.startRegenerationTimer();
      }, timeUntilNextHeart);
    }
  }

  /**
   * Use a heart for a challenge
   * @returns Whether the heart was successfully used
   */
  useHeart(): boolean {
    this.updateHeartsBasedOnElapsedTime();
    
    if (this.state.currentHearts <= 0) {
      return false;
    }
    
    this.state.currentHearts -= 1;
    
    // If this is the first heart used, start regeneration
    if (this.state.nextRegenerationTime === null && this.state.currentHearts < this.state.maxHearts) {
      this.state.nextRegenerationTime = Date.now() + HEARTS_CONFIG.REGENERATION_TIME_MS;
      this.startRegenerationTimer();
    }
    
    this.saveState();
    return true;
  }

  /**
   * Add hearts to the user
   * @param amount Number of hearts to add
   */
  addHearts(amount: number): void {
    this.updateHeartsBasedOnElapsedTime();
    
    const newHeartCount = Math.min(this.state.currentHearts + amount, this.state.maxHearts);
    const heartsAdded = newHeartCount - this.state.currentHearts;
    
    this.state.currentHearts = newHeartCount;
    
    // If we reached max hearts, clear regeneration timer
    if (this.state.currentHearts >= this.state.maxHearts) {
      this.state.nextRegenerationTime = null;
      if (this.regenerationTimer !== null) {
        window.clearTimeout(this.regenerationTimer);
        this.regenerationTimer = null;
      }
    }
    
    this.saveState();
  }

  /**
   * Refill all hearts
   */
  refillHearts(): void {
    this.state.currentHearts = this.state.maxHearts;
    this.state.nextRegenerationTime = null;
    
    if (this.regenerationTimer !== null) {
      window.clearTimeout(this.regenerationTimer);
      this.regenerationTimer = null;
    }
    
    this.saveState();
  }

  /**
   * Get current hearts state
   */
  getState(): HeartsState {
    this.updateHeartsBasedOnElapsedTime();
    return { ...this.state };
  }

  /**
   * Get time until next heart in milliseconds
   */
  getTimeUntilNextHeart(): number {
    if (this.state.nextRegenerationTime === null || this.state.currentHearts >= this.state.maxHearts) {
      return 0;
    }
    
    const now = Date.now();
    return Math.max(0, this.state.nextRegenerationTime - now);
  }

  /**
   * Format time until next heart as a string (e.g., "29:59")
   */
  formatTimeUntilNextHeart(): string {
    const timeMs = this.getTimeUntilNextHeart();
    
    if (timeMs <= 0) {
      return '00:00';
    }
    
    const totalSeconds = Math.ceil(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Check if user has unlimited hearts (premium feature)
   */
  hasUnlimitedHearts(): boolean {
    return subscriptionService.hasPremiumFeatures();
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.regenerationTimer !== null) {
      window.clearTimeout(this.regenerationTimer);
      this.regenerationTimer = null;
    }
  }
}

// Export singleton instance
export const heartsService = new HeartsService();
export default heartsService; 