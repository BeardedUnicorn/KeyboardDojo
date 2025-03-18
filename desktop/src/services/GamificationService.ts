/**
 * GamificationService
 *
 * A consolidated service that manages all gamification aspects:
 * - Experience Points (XP) and Leveling
 * - Virtual Currency (Key Gems)
 * - Hearts/Lives System
 */

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';

// XP thresholds and rewards from xpService
const XP_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000,
];

const LEVEL_TITLES = [
  'Keyboard Novice', 'Shortcut Apprentice', 'Key Combo Adept',
  'Hotkey Enthusiast', 'Shortcut Specialist', 'Keyboard Tactician',
  'Efficiency Expert', 'Shortcut Virtuoso', 'Keyboard Maestro',
  'Shortcut Sensei', 'Keyboard Wizard', 'Shortcut Grandmaster',
  'Keyboard Sage', 'Shortcut Legend', 'Keyboard Dojo Master',
];

// Consolidated rewards
export const REWARDS = {
  XP: {
    COMPLETE_LESSON: 50,
    PERFECT_LESSON: 25,
    COMPLETE_MODULE: 100,
    COMPLETE_CHALLENGE: 75,
    DAILY_STREAK: 10,
    WEEKLY_STREAK: 50,
    MONTHLY_STREAK: 200,
    CORRECT_ANSWER: 5,
    COMBO_BONUS: 2,
  },
  CURRENCY: {
    DAILY_STREAK: 5,
    WEEKLY_STREAK: 15,
    MONTHLY_STREAK: 50,
    LEVEL_UP: 10,
    ACHIEVEMENT: 20,
    PERFECT_LESSON: 3,
    CHALLENGE_COMPLETE: 5,
  },
};

// Hearts configuration
const HEARTS_CONFIG = {
  REGENERATION_TIME_MINUTES: 30,
  COST_PER_REFILL: 20,
  HEARTS_LOST_ON_FAILURE: 1,
  DEFAULT_MAX_HEARTS: 5,
};

// Interfaces
export interface XPData {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpHistory: XPHistoryEntry[];
  levelHistory: LevelHistoryEntry[];
}

interface XPHistoryEntry {
  date: string;
  amount: number;
  source: string;
  description?: string;
}

interface LevelHistoryEntry {
  date: string;
  level: number;
}

export interface CurrencyData {
  balance: number;
  totalEarned: number;
  transactions: CurrencyTransaction[];
  inventory: { [itemId: string]: number };
}

interface CurrencyTransaction {
  date: string;
  amount: number;
  type: 'earn' | 'spend';
  source: string;
  description?: string;
}

export interface HeartsData {
  current: number;
  max: number;
  lastRegeneration: string;
  nextRegenerationTime: string;
  isPremium: boolean;
}

export interface GamificationData {
  xp: XPData;
  currency: CurrencyData;
  hearts: HeartsData;
}

// Event interfaces
export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  title: string;
}

export interface CurrencyChangeEvent {
  oldBalance: number;
  newBalance: number;
  change: number;
  source: string;
}

export interface HeartsChangeEvent {
  oldHearts: number;
  newHearts: number;
  change: number;
  reason: string;
}

class GamificationService extends BaseService {
  private storageKey = 'gamification-data';
  private data: GamificationData;
  private regenerationTimer: number | null = null;

  // Event listeners
  private levelUpListeners: ((event: LevelUpEvent) => void)[] = [];
  private currencyChangeListeners: ((event: CurrencyChangeEvent) => void)[] = [];
  private heartsChangeListeners: ((event: HeartsChangeEvent) => void)[] = [];

  constructor() {
    super();
    this.data = this.getDefaultData();
  }

  private getDefaultData(): GamificationData {
    const now = new Date().toISOString();
    return {
      xp: {
        totalXP: 0,
        level: 1,
        currentLevelXP: 0,
        nextLevelXP: XP_THRESHOLDS[1],
        xpHistory: [],
        levelHistory: [{ date: now, level: 1 }],
      },
      currency: {
        balance: 0,
        totalEarned: 0,
        transactions: [],
        inventory: {},
      },
      hearts: {
        current: HEARTS_CONFIG.DEFAULT_MAX_HEARTS,
        max: HEARTS_CONFIG.DEFAULT_MAX_HEARTS,
        lastRegeneration: now,
        nextRegenerationTime: new Date(Date.now() + HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000).toISOString(),
        isPremium: false,
      },
    };
  }

  async initialize(): Promise<void> {
    await super.initialize();
    this.loadData();
    this.startHeartRegeneration();
    this.setupVisibilityListener();
  }

  cleanup(): void {
    this.stopHeartRegeneration();
    super.cleanup();
  }

  // Data management
  private loadData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        this.data = JSON.parse(savedData);
      }
    } catch (error) {
      loggerService.error('Failed to load gamification data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      loggerService.error('Failed to save gamification data:', error);
    }
  }

  // XP Methods
  addXP(amount: number, source: string, description?: string): void {
    const oldLevel = this.data.xp.level;
    this.data.xp.totalXP += amount;

    // Update XP history
    this.data.xp.xpHistory.push({
      date: new Date().toISOString(),
      amount,
      source,
      description,
    });

    // Update level
    const newLevel = this.calculateLevel(this.data.xp.totalXP);
    if (newLevel !== oldLevel) {
      this.handleLevelUp(oldLevel, newLevel);
    }

    this.updateXPData();
    this.saveData();
  }

  private calculateLevel(totalXP: number): number {
    let level = 1;
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
      if (totalXP >= XP_THRESHOLDS[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    return level;
  }

  private handleLevelUp(oldLevel: number, newLevel: number): void {
    this.data.xp.level = newLevel;
    this.data.xp.levelHistory.push({
      date: new Date().toISOString(),
      level: newLevel,
    });

    // Award currency for leveling up
    this.addCurrency(REWARDS.CURRENCY.LEVEL_UP, 'level_up');

    // Notify listeners
    const event: LevelUpEvent = {
      oldLevel,
      newLevel,
      title: LEVEL_TITLES[newLevel - 1],
    };
    this.levelUpListeners.forEach((listener) => listener(event));
  }

  private updateXPData(): void {
    const currentLevel = this.data.xp.level;
    const currentLevelThreshold = XP_THRESHOLDS[currentLevel - 1] || 0;
    const nextLevelThreshold = XP_THRESHOLDS[currentLevel] || currentLevelThreshold;

    this.data.xp.currentLevelXP = this.data.xp.totalXP - currentLevelThreshold;
    this.data.xp.nextLevelXP = nextLevelThreshold - currentLevelThreshold;
  }

  // Currency Methods
  addCurrency(amount: number, source: string, description?: string): void {
    const oldBalance = this.data.currency.balance;
    this.data.currency.balance += amount;
    this.data.currency.totalEarned += amount;

    this.data.currency.transactions.push({
      date: new Date().toISOString(),
      amount,
      type: 'earn',
      source,
      description,
    });

    const event: CurrencyChangeEvent = {
      oldBalance,
      newBalance: this.data.currency.balance,
      change: amount,
      source,
    };
    this.currencyChangeListeners.forEach((listener) => listener(event));

    this.saveData();
  }

  spendCurrency(amount: number, source: string, description?: string): boolean {
    if (this.data.currency.balance < amount) {
      return false;
    }

    const oldBalance = this.data.currency.balance;
    this.data.currency.balance -= amount;

    this.data.currency.transactions.push({
      date: new Date().toISOString(),
      amount: -amount,
      type: 'spend',
      source,
      description,
    });

    const event: CurrencyChangeEvent = {
      oldBalance,
      newBalance: this.data.currency.balance,
      change: -amount,
      source,
    };
    this.currencyChangeListeners.forEach((listener) => listener(event));

    this.saveData();
    return true;
  }

  // Hearts Methods
  private startHeartRegeneration(): void {
    if (this.regenerationTimer !== null) {
      window.clearInterval(this.regenerationTimer);
    }

    this.regenerationTimer = window.setInterval(() => {
      this.checkAndRegenerateHearts();
    }, 60000); // Check every minute
  }

  private stopHeartRegeneration(): void {
    if (this.regenerationTimer !== null) {
      window.clearInterval(this.regenerationTimer);
      this.regenerationTimer = null;
    }
  }

  private setupVisibilityListener(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkAndRegenerateHearts();
        }
      });
    }
  }

  private checkAndRegenerateHearts(): void {
    if (this.data.hearts.current >= this.data.hearts.max) {
      return;
    }

    const now = new Date();
    const lastRegen = new Date(this.data.hearts.lastRegeneration);
    const minutesSinceLastRegen = Math.floor((now.getTime() - lastRegen.getTime()) / (1000 * 60));

    if (minutesSinceLastRegen >= HEARTS_CONFIG.REGENERATION_TIME_MINUTES) {
      const heartsToAdd = Math.min(
        Math.floor(minutesSinceLastRegen / HEARTS_CONFIG.REGENERATION_TIME_MINUTES),
        this.data.hearts.max - this.data.hearts.current,
      );

      if (heartsToAdd > 0) {
        this.addHearts(heartsToAdd, 'regeneration');
        this.data.hearts.lastRegeneration = now.toISOString();
        this.data.hearts.nextRegenerationTime = new Date(
          now.getTime() + HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000,
        ).toISOString();
        this.saveData();
      }
    }
  }

  loseHeart(reason: string): boolean {
    if (this.data.hearts.isPremium) {
      return true;
    }

    if (this.data.hearts.current <= 0) {
      return false;
    }

    const oldHearts = this.data.hearts.current;
    this.data.hearts.current -= HEARTS_CONFIG.HEARTS_LOST_ON_FAILURE;

    const event: HeartsChangeEvent = {
      oldHearts,
      newHearts: this.data.hearts.current,
      change: -HEARTS_CONFIG.HEARTS_LOST_ON_FAILURE,
      reason,
    };
    this.heartsChangeListeners.forEach((listener) => listener(event));

    this.saveData();
    return true;
  }

  addHearts(amount: number, reason: string): void {
    const oldHearts = this.data.hearts.current;
    this.data.hearts.current = Math.min(
      this.data.hearts.current + amount,
      this.data.hearts.max,
    );

    const event: HeartsChangeEvent = {
      oldHearts,
      newHearts: this.data.hearts.current,
      change: this.data.hearts.current - oldHearts,
      reason,
    };
    this.heartsChangeListeners.forEach((listener) => listener(event));

    this.saveData();
  }

  // Event Subscription Methods
  subscribeLevelUp(listener: (event: LevelUpEvent) => void): void {
    this.levelUpListeners.push(listener);
  }

  unsubscribeLevelUp(listener: (event: LevelUpEvent) => void): void {
    this.levelUpListeners = this.levelUpListeners.filter((l) => l !== listener);
  }

  subscribeCurrencyChange(listener: (event: CurrencyChangeEvent) => void): void {
    this.currencyChangeListeners.push(listener);
  }

  unsubscribeCurrencyChange(listener: (event: CurrencyChangeEvent) => void): void {
    this.currencyChangeListeners = this.currencyChangeListeners.filter((l) => l !== listener);
  }

  subscribeHeartsChange(listener: (event: HeartsChangeEvent) => void): void {
    this.heartsChangeListeners.push(listener);
  }

  unsubscribeHeartsChange(listener: (event: HeartsChangeEvent) => void): void {
    this.heartsChangeListeners = this.heartsChangeListeners.filter((l) => l !== listener);
  }

  // Getters
  getData(): GamificationData {
    return { ...this.data };
  }

  getXPData(): XPData {
    return { ...this.data.xp };
  }

  getCurrencyData(): CurrencyData {
    return { ...this.data.currency };
  }

  getHeartsData(): HeartsData {
    return { ...this.data.hearts };
  }

  getLevelTitle(): string {
    return LEVEL_TITLES[this.data.xp.level - 1];
  }

  getLevelProgress(): number {
    const currentLevelThreshold = XP_THRESHOLDS[this.data.xp.level - 1] || 0;
    const nextLevelThreshold = XP_THRESHOLDS[this.data.xp.level] || currentLevelThreshold;
    const xpForCurrentLevel = this.data.xp.totalXP - currentLevelThreshold;
    const xpRequiredForNextLevel = nextLevelThreshold - currentLevelThreshold;

    return Math.min(100, Math.floor((xpForCurrentLevel / xpRequiredForNextLevel) * 100));
  }
}

export const gamificationService = new GamificationService();
