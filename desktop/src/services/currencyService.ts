/**
 * Currency Service
 * 
 * This service manages the virtual currency system (Key Gems).
 * It handles earning, spending, and tracking currency.
 */

import { audioService } from './audioService';
import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

// Currency rewards for different activities
export const CURRENCY_REWARDS = {
  DAILY_STREAK: 5,       // Daily login reward
  WEEKLY_STREAK: 15,     // Additional for 7-day streak
  MONTHLY_STREAK: 50,    // Additional for 30-day streak
  LEVEL_UP: 10,          // Reward for leveling up
  ACHIEVEMENT: 20,       // Reward for earning an achievement
  PERFECT_LESSON: 3,     // Reward for completing a lesson with 100% accuracy
  CHALLENGE_COMPLETE: 5, // Reward for completing a challenge
};

// Item types
export interface BaseStoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'power_up' | 'boost' | 'cosmetic';
  icon: string;
}

export interface PowerUpItem extends BaseStoreItem {
  category: 'power_up';
}

export interface BoostItem extends BaseStoreItem {
  category: 'boost';
  duration: number; // Duration in milliseconds
}

export interface CosmeticItem extends BaseStoreItem {
  category: 'cosmetic';
  oneTime: boolean; // Whether the item can only be purchased once
}

export type StoreItem = PowerUpItem | BoostItem | CosmeticItem;

// Items that can be purchased with currency
export const STORE_ITEMS: Record<string, StoreItem> = {
  STREAK_FREEZE: {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Prevents your streak from breaking if you miss a day',
    price: 30,
    category: 'power_up',
    icon: 'AcUnit',
  } as PowerUpItem,
  HEART_REFILL: {
    id: 'heart_refill',
    name: 'Heart Refill',
    description: 'Refill all your hearts immediately',
    price: 20,
    category: 'power_up',
    icon: 'Favorite',
  } as PowerUpItem,
  XP_BOOST: {
    id: 'xp_boost',
    name: 'XP Boost',
    description: 'Earn double XP for the next 24 hours',
    price: 40,
    category: 'boost',
    icon: 'Speed',
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  } as BoostItem,
  DARK_THEME: {
    id: 'dark_theme',
    name: 'Dark IDE Theme',
    description: 'A sleek dark theme for the IDE simulator',
    price: 50,
    category: 'cosmetic',
    icon: 'DarkMode',
    oneTime: true,
  } as CosmeticItem,
  RETRO_THEME: {
    id: 'retro_theme',
    name: 'Retro Terminal Theme',
    description: 'Old-school terminal look for the IDE simulator',
    price: 75,
    category: 'cosmetic',
    icon: 'Terminal',
    oneTime: true,
  } as CosmeticItem,
};

// Interface for currency data
export interface CurrencyData {
  balance: number;
  totalEarned: number;
  transactions: {
    date: string;
    amount: number;
    type: 'earn' | 'spend';
    source: string;
    description?: string;
  }[];
  inventory: {
    [itemId: string]: {
      quantity: number;
      purchaseDate: string;
      expiryDate?: string;
    };
  };
  activeBoosts: {
    [boostId: string]: {
      startTime: string;
      endTime: string;
    };
  };
}

// Default currency data
const DEFAULT_CURRENCY_DATA: CurrencyData = {
  balance: 0,
  totalEarned: 0,
  transactions: [],
  inventory: {},
  activeBoosts: {},
};

// Event for currency changes
export interface CurrencyChangeEvent {
  oldBalance: number;
  newBalance: number;
  change: number;
  source: string;
}

class CurrencyService extends BaseService {
  private storageKey = 'user-currency';
  private currencyData: CurrencyData = DEFAULT_CURRENCY_DATA;
  private changeListeners: ((event: CurrencyChangeEvent) => void)[] = [];
  
  constructor() {
    super();
  }
  
  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    await super.initialize();
    
    try {
      // Load currency data
      this.loadCurrencyData();
      
      loggerService.info('Currency service initialized', { 
        component: 'CurrencyService',
      });
      
      this._status.initialized = true;
    } catch (error) {
      loggerService.error('Failed to initialize currency service', error, { 
        component: 'CurrencyService',
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
      // Save any unsaved currency data
      this.saveCurrencyData();
      
      loggerService.info('Currency service cleaned up', { 
        component: 'CurrencyService',
      });
      
      super.cleanup();
    } catch (error) {
      loggerService.error('Error cleaning up currency service', error, { 
        component: 'CurrencyService',
      });
      // Don't throw
    }
  }
  
  /**
   * Load currency data from localStorage
   */
  private loadCurrencyData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        this.currencyData = JSON.parse(savedData);
      }
    } catch (error) {
      loggerService.error('Failed to load currency data:', { error });
    }
  }
  
  /**
   * Save currency data to localStorage
   */
  private saveCurrencyData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currencyData));
    } catch (error) {
      loggerService.error('Failed to save currency data:', { error });
    }
  }
  
  /**
   * Add currency to the user's account
   * @param amount Amount of currency to add
   * @param source Source of the currency (e.g., 'streak', 'level_up', 'achievement')
   * @param description Optional description of the reward
   * @returns Updated currency data
   */
  addCurrency(amount: number, source: string, description?: string): CurrencyData {
    if (amount <= 0) {
      return this.currencyData;
    }
    
    const oldBalance = this.currencyData.balance;
    
    // Add currency
    this.currencyData.balance += amount;
    this.currencyData.totalEarned += amount;
    
    // Add to transaction history
    this.currencyData.transactions.push({
      date: new Date().toISOString(),
      amount,
      type: 'earn',
      source,
      description,
    });
    
    // Save data
    this.saveCurrencyData();
    
    // Play coin sound
    audioService.playSound('coin');
    
    // Notify listeners
    this.notifyChangeListeners({
      oldBalance,
      newBalance: this.currencyData.balance,
      change: amount,
      source,
    });
    
    return this.currencyData;
  }
  
  /**
   * Spend currency from the user's account
   * @param amount Amount of currency to spend
   * @param source Reason for spending (e.g., 'item_purchase', 'boost_activation')
   * @param description Optional description of the purchase
   * @returns Whether the transaction was successful
   */
  spendCurrency(amount: number, source: string, description?: string): boolean {
    if (amount <= 0) {
      return true; // Nothing to spend
    }
    
    if (this.currencyData.balance < amount) {
      return false; // Not enough currency
    }
    
    const oldBalance = this.currencyData.balance;
    
    // Deduct currency
    this.currencyData.balance -= amount;
    
    // Add to transaction history
    this.currencyData.transactions.push({
      date: new Date().toISOString(),
      amount: -amount,
      type: 'spend',
      source,
      description,
    });
    
    // Save data
    this.saveCurrencyData();
    
    // Notify listeners
    this.notifyChangeListeners({
      oldBalance,
      newBalance: this.currencyData.balance,
      change: -amount,
      source,
    });
    
    return true;
  }
  
  /**
   * Purchase an item from the store
   * @param itemId ID of the item to purchase
   * @returns Whether the purchase was successful
   */
  purchaseItem(itemId: string): boolean {
    const item = STORE_ITEMS[itemId];
    if (!item) {
      loggerService.error('Item not found in store:', { itemId });
      return false;
    }
    
    // Check if one-time item is already owned
    if (item.category === 'cosmetic' && (item as CosmeticItem).oneTime && this.hasItem(itemId)) {
      loggerService.error('One-time item already owned:', { itemId });
      return false;
    }
    
    // Try to spend currency
    const success = this.spendCurrency(
      item.price, 
      'item_purchase', 
      `Purchased ${item.name}`,
    );
    
    if (!success) {
      return false;
    }
    
    // Add item to inventory
    if (!this.currencyData.inventory[itemId]) {
      this.currencyData.inventory[itemId] = {
        quantity: 0,
        purchaseDate: new Date().toISOString(),
      };
    }
    
    this.currencyData.inventory[itemId].quantity += 1;
    
    // If it's a boost with duration, set expiry
    if (item.category === 'boost') {
      const boostItem = item as BoostItem;
      const now = new Date();
      const endTime = new Date(now.getTime() + boostItem.duration);
      
      this.currencyData.activeBoosts[itemId] = {
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
      };
    }
    
    // Save data
    this.saveCurrencyData();
    
    // Play purchase sound
    audioService.playSound('purchase');
    
    return true;
  }
  
  /**
   * Use an item from the inventory
   * @param itemId ID of the item to use
   * @returns Whether the item was used successfully
   */
  useItem(itemId: string): boolean {
    // Check if item exists in inventory
    if (!this.hasItem(itemId)) {
      return false;
    }
    
    // Reduce quantity
    this.currencyData.inventory[itemId].quantity -= 1;
    
    // If quantity is 0, remove from inventory
    if (this.currencyData.inventory[itemId].quantity <= 0) {
      delete this.currencyData.inventory[itemId];
    }
    
    // Save data
    this.saveCurrencyData();
    
    return true;
  }
  
  /**
   * Check if user has a specific item
   * @param itemId ID of the item to check
   * @returns Whether the user has the item
   */
  hasItem(itemId: string): boolean {
    return (
      this.currencyData.inventory[itemId] !== undefined &&
      this.currencyData.inventory[itemId].quantity > 0
    );
  }
  
  /**
   * Get the quantity of a specific item
   * @param itemId ID of the item to check
   * @returns Quantity of the item
   */
  getItemQuantity(itemId: string): number {
    if (!this.hasItem(itemId)) {
      return 0;
    }
    
    return this.currencyData.inventory[itemId].quantity;
  }
  
  /**
   * Check if a boost is active
   * @param boostId ID of the boost to check
   * @returns Whether the boost is active
   */
  isBoostActive(boostId: string): boolean {
    const boost = this.currencyData.activeBoosts[boostId];
    if (!boost) {
      return false;
    }
    
    const now = new Date();
    const endTime = new Date(boost.endTime);
    
    return now < endTime;
  }
  
  /**
   * Get the remaining time for a boost
   * @param boostId ID of the boost to check
   * @returns Remaining time in milliseconds, or 0 if not active
   */
  getBoostRemainingTime(boostId: string): number {
    const boost = this.currencyData.activeBoosts[boostId];
    if (!boost) {
      return 0;
    }
    
    const now = new Date();
    const endTime = new Date(boost.endTime);
    
    if (now >= endTime) {
      return 0;
    }
    
    return endTime.getTime() - now.getTime();
  }
  
  /**
   * Clean up expired boosts
   */
  cleanupExpiredBoosts(): void {
    const now = new Date();
    let hasChanges = false;
    
    Object.keys(this.currencyData.activeBoosts).forEach((boostId) => {
      const boost = this.currencyData.activeBoosts[boostId];
      const endTime = new Date(boost.endTime);
      
      if (now >= endTime) {
        delete this.currencyData.activeBoosts[boostId];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      this.saveCurrencyData();
    }
  }
  
  /**
   * Notify change listeners
   */
  private notifyChangeListeners(event: CurrencyChangeEvent): void {
    this.changeListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        loggerService.error('Error in currency change listener:', { error });
      }
    });
  }
  
  /**
   * Subscribe to currency changes
   * @param listener Function to call when currency changes
   */
  subscribe(listener: (event: CurrencyChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }
  
  /**
   * Unsubscribe from currency changes
   * @param listener Function to remove from listeners
   */
  unsubscribe(listener: (event: CurrencyChangeEvent) => void): void {
    this.changeListeners = this.changeListeners.filter((l) => l !== listener);
  }
  
  /**
   * Get the current currency data
   * @returns Current currency data
   */
  getCurrencyData(): CurrencyData {
    // Clean up expired boosts before returning data
    this.cleanupExpiredBoosts();
    return this.currencyData;
  }
  
  /**
   * Get the current balance
   * @returns Current balance
   */
  getBalance(): number {
    return this.currencyData.balance;
  }
  
  /**
   * Get the total earned currency
   * @returns Total earned currency
   */
  getTotalEarned(): number {
    return this.currencyData.totalEarned;
  }
  
  /**
   * Get transaction history
   * @param limit Optional limit on number of transactions to return
   * @returns Transaction history
   */
  getTransactionHistory(limit?: number): CurrencyData['transactions'] {
    const transactions = [...this.currencyData.transactions].reverse();
    
    if (limit && limit > 0) {
      return transactions.slice(0, limit);
    }
    
    return transactions;
  }
  
  /**
   * Reset currency data (for testing or admin purposes)
   */
  resetCurrency(): void {
    this.currencyData = DEFAULT_CURRENCY_DATA;
    this.saveCurrencyData();
  }
}

// Create and export a singleton instance
export const currencyService = new CurrencyService(); 

// Register with ServiceFactory
serviceFactory.register('currencyService', currencyService);

export default currencyService; 
