import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';
import { gamificationService } from '../GamificationService';
import { loggerService } from '../loggerService';

// Mock the logger service
vi.mock('../loggerService', () => ({
  loggerService: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Date and Date.now for consistent testing
const mockTimestamp = 1682942400000; // May 1, 2023 12:00:00 UTC
const mockDate = new Date(mockTimestamp);
vi.spyOn(global.Date, 'now').mockImplementation(() => mockTimestamp);
vi.useFakeTimers().setSystemTime(mockTimestamp);

// Create proper mocks for setInterval and clearInterval
const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

const setIntervalMock = vi.fn().mockImplementation(() => 123);
const clearIntervalMock = vi.fn();

window.setInterval = setIntervalMock as unknown as typeof window.setInterval;
window.clearInterval = clearIntervalMock as unknown as typeof window.clearInterval;

describe('GamificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

    // Reset the service to its initial state
    (gamificationService as any).data = (gamificationService as any).getDefaultData();
    (gamificationService as any).regenerationTimer = null;
    (gamificationService as any).levelUpListeners = [];
    (gamificationService as any).currencyChangeListeners = [];
    (gamificationService as any).heartsChangeListeners = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extend BaseService', () => {
    expect(gamificationService).toBeInstanceOf(BaseService);
  });

  describe('initialization', () => {
    it('should initialize correctly', async () => {
      // Mock document visibility API
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
      const visibilityChangeListeners: Array<EventListener> = [];
      vi.spyOn(document, 'addEventListener').mockImplementation((event, listener) => {
        if (event === 'visibilitychange') {
          visibilityChangeListeners.push(listener as EventListener);
        }
      });
      
      await gamificationService.initialize();
      
      // Should load data from localStorage
      expect(localStorageMock.getItem).toHaveBeenCalledWith('gamification-data');
      
      // Should start heart regeneration
      expect(window.setInterval).toHaveBeenCalled();
      
      // Should set up visibility listener
      expect(document.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });
    
    it('should load existing data from localStorage', async () => {
      const mockData = {
        xp: {
          totalXP: 500,
          level: 3,
          currentLevelXP: 250,
          nextLevelXP: 500,
          xpHistory: [],
          levelHistory: [],
        },
        currency: {
          balance: 100,
          totalEarned: 150,
          transactions: [],
          inventory: {},
        },
        hearts: {
          current: 4,
          max: 5,
          lastRegeneration: mockDate.toISOString(),
          nextRegenerationTime: mockDate.toISOString(),
          isPremium: false,
        },
      };
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockData));
      
      await gamificationService.initialize();
      
      // Data should be loaded
      expect(gamificationService.getData()).toEqual(mockData);
    });
    
    it('should handle localStorage errors', async () => {
      // Simulate a localStorage error
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      await gamificationService.initialize();
      
      // Should log the error
      expect(loggerService.error).toHaveBeenCalledWith(
        'Failed to load gamification data:',
        expect.any(Error)
      );
      
      // Should use default data
      expect(gamificationService.getXPData().totalXP).toBe(0);
    });
  });
  
  describe('cleanup', () => {
    it('should stop heart regeneration', () => {
      // Set regeneration timer
      (gamificationService as any).regenerationTimer = 123;
      
      gamificationService.cleanup();
      
      // Should clear the interval
      expect(window.clearInterval).toHaveBeenCalledWith(123);
      expect((gamificationService as any).regenerationTimer).toBeNull();
    });
  });
  
  describe('XP Management', () => {
    it('should add XP correctly', () => {
      gamificationService.addXP(50, 'lesson_completion', 'Completed Lesson 1');
      
      const xpData = gamificationService.getXPData();
      expect(xpData.totalXP).toBe(50);
      expect(xpData.xpHistory).toHaveLength(1);
      expect(xpData.xpHistory[0].amount).toBe(50);
      expect(xpData.xpHistory[0].source).toBe('lesson_completion');
      expect(xpData.xpHistory[0].description).toBe('Completed Lesson 1');
      
      // Should save data
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('should calculate level based on XP thresholds', () => {
      // Level 1: 0-99 XP
      gamificationService.addXP(50, 'test');
      expect(gamificationService.getXPData().level).toBe(1);
      
      // Level 2: 100-249 XP
      gamificationService.addXP(50, 'test');
      expect(gamificationService.getXPData().level).toBe(2);
      
      // Still Level 2
      gamificationService.addXP(49, 'test');
      expect(gamificationService.getXPData().level).toBe(2);
      
      // Level 3: 250-499 XP
      gamificationService.addXP(101, 'test'); // Total: 250 (50+50+49+101)
      expect(gamificationService.getXPData().level).toBe(3);
    });
    
    it('should fire level up event when gaining a level', () => {
      const mockListener = vi.fn();
      gamificationService.subscribeLevelUp(mockListener);
      
      // Add XP to get to level 2 (100 XP)
      gamificationService.addXP(100, 'test');
      
      expect(mockListener).toHaveBeenCalledWith({
        oldLevel: 1,
        newLevel: 2,
        title: expect.any(String),
      });
      
      // Should add level-up reward currency
      const currencyData = gamificationService.getCurrencyData();
      expect(currencyData.balance).toBeGreaterThan(0);
    });
    
    it('should update XP data correctly', () => {
      // Add 150 XP (level 2, which is 100-249 XP)
      gamificationService.addXP(150, 'test');
      
      const xpData = gamificationService.getXPData();
      expect(xpData.level).toBe(2);
      expect(xpData.currentLevelXP).toBe(50); // 150 - 100 (level 2 threshold)
      expect(xpData.nextLevelXP).toBe(150); // 250 - 100 (level 3 threshold - level 2 threshold)
    });
    
    it('should calculate level progress correctly', () => {
      // Add 50 XP (level 1, which is 0-99 XP)
      gamificationService.addXP(50, 'test');
      
      // 50/100 = 50%
      expect(gamificationService.getLevelProgress()).toBe(50);
      
      // Add 100 more XP (level 2, which is 100-249 XP)
      gamificationService.addXP(100, 'test');
      
      // (150-100)/(250-100) = 50/150 = 33%
      expect(gamificationService.getLevelProgress()).toBe(33);
    });
    
    it('should get the correct level title', () => {
      expect(gamificationService.getLevelTitle()).toBe('Keyboard Novice');
      
      // Level 2
      gamificationService.addXP(100, 'test');
      expect(gamificationService.getLevelTitle()).toBe('Shortcut Apprentice');
      
      // Level 3
      gamificationService.addXP(150, 'test');
      expect(gamificationService.getLevelTitle()).toBe('Key Combo Adept');
    });
  });
  
  describe('Currency Management', () => {
    it('should add currency correctly', () => {
      gamificationService.addCurrency(50, 'achievement', 'First perfect score');
      
      const currencyData = gamificationService.getCurrencyData();
      expect(currencyData.balance).toBe(50);
      expect(currencyData.totalEarned).toBe(50);
      expect(currencyData.transactions).toHaveLength(1);
      expect(currencyData.transactions[0].amount).toBe(50);
      expect(currencyData.transactions[0].type).toBe('earn');
      expect(currencyData.transactions[0].source).toBe('achievement');
      
      // Should save data
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('should fire currency change event', () => {
      const mockListener = vi.fn();
      gamificationService.subscribeCurrencyChange(mockListener);
      
      gamificationService.addCurrency(25, 'daily_bonus');
      
      expect(mockListener).toHaveBeenCalledWith({
        oldBalance: 0,
        newBalance: 25,
        change: 25,
        source: 'daily_bonus',
      });
    });
    
    it('should spend currency correctly when sufficient funds', () => {
      // Add currency first
      gamificationService.addCurrency(100, 'test');
      
      // Spend 50
      const result = gamificationService.spendCurrency(50, 'purchase', 'Hearts refill');
      
      expect(result).toBe(true);
      
      const currencyData = gamificationService.getCurrencyData();
      expect(currencyData.balance).toBe(50);
      expect(currencyData.transactions).toHaveLength(2);
      expect(currencyData.transactions[1].amount).toBe(-50);
      expect(currencyData.transactions[1].type).toBe('spend');
      
      // Should save data
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('should return false when trying to spend more currency than available', () => {
      // Add 50 currency
      gamificationService.addCurrency(50, 'test');
      
      // Try to spend 100
      const result = gamificationService.spendCurrency(100, 'purchase');
      
      expect(result).toBe(false);
      
      // Balance should remain unchanged
      const currencyData = gamificationService.getCurrencyData();
      expect(currencyData.balance).toBe(50);
    });
    
    it('should fire currency change event when spending', () => {
      const mockListener = vi.fn();
      gamificationService.subscribeCurrencyChange(mockListener);
      
      // Add currency first
      gamificationService.addCurrency(100, 'test');
      mockListener.mockClear(); // Clear the add event
      
      // Spend 75
      gamificationService.spendCurrency(75, 'purchase');
      
      expect(mockListener).toHaveBeenCalledWith({
        oldBalance: 100,
        newBalance: 25,
        change: -75,
        source: 'purchase',
      });
    });
  });
  
  describe('Hearts Management', () => {
    it('should lose hearts correctly', () => {
      const result = gamificationService.loseHeart('wrong_answer');
      
      expect(result).toBe(true);
      
      const heartsData = gamificationService.getHeartsData();
      expect(heartsData.current).toBe(4); // Default is 5, lose 1
      
      // Should save data
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('should fire hearts change event when losing hearts', () => {
      const mockListener = vi.fn();
      gamificationService.subscribeHeartsChange(mockListener);
      
      gamificationService.loseHeart('wrong_answer');
      
      expect(mockListener).toHaveBeenCalledWith({
        oldHearts: 5,
        newHearts: 4,
        change: -1,
        reason: 'wrong_answer',
      });
    });
    
    it('should return false when trying to lose hearts with none remaining', () => {
      // Set current hearts to 0
      (gamificationService as any).data.hearts.current = 0;
      
      const result = gamificationService.loseHeart('wrong_answer');
      
      expect(result).toBe(false);
      
      // Hearts should remain 0
      const heartsData = gamificationService.getHeartsData();
      expect(heartsData.current).toBe(0);
    });
    
    it('should not lose hearts when premium', () => {
      // Set premium
      (gamificationService as any).data.hearts.isPremium = true;
      
      const result = gamificationService.loseHeart('wrong_answer');
      
      expect(result).toBe(true);
      
      // Hearts should remain at 5
      const heartsData = gamificationService.getHeartsData();
      expect(heartsData.current).toBe(5);
    });
    
    it('should add hearts correctly', () => {
      // First lose some hearts
      gamificationService.loseHeart('wrong_answer');
      gamificationService.loseHeart('wrong_answer');
      
      // Now add hearts
      gamificationService.addHearts(1, 'purchase');
      
      const heartsData = gamificationService.getHeartsData();
      expect(heartsData.current).toBe(4); // 5 - 2 + 1
      
      // Should save data
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('should not exceed max hearts when adding hearts', () => {
      // Add hearts when already at max
      gamificationService.addHearts(3, 'purchase');
      
      const heartsData = gamificationService.getHeartsData();
      expect(heartsData.current).toBe(5); // Max is 5
    });
    
    it('should fire hearts change event when adding hearts', () => {
      const mockListener = vi.fn();
      gamificationService.subscribeHeartsChange(mockListener);
      
      // First lose some hearts
      gamificationService.loseHeart('wrong_answer');
      mockListener.mockClear(); // Clear the lose event
      
      // Now add hearts
      gamificationService.addHearts(1, 'purchase');
      
      expect(mockListener).toHaveBeenCalledWith({
        oldHearts: 4,
        newHearts: 5,
        change: 1,
        reason: 'purchase',
      });
    });
    
    it('should check and regenerate hearts', () => {
      // Lose some hearts
      gamificationService.loseHeart('wrong_answer');
      
      // Set last regeneration to 31 minutes ago
      const thirtyOneMinutesAgo = new Date();
      thirtyOneMinutesAgo.setMinutes(thirtyOneMinutesAgo.getMinutes() - 31);
      (gamificationService as any).data.hearts.lastRegeneration = thirtyOneMinutesAgo.toISOString();
      
      // Check regeneration
      (gamificationService as any).checkAndRegenerateHearts();
      
      // Should have regenerated 1 heart
      const heartsData = gamificationService.getHeartsData();
      expect(heartsData.current).toBe(5);
      
      // Should update last regeneration time
      expect(heartsData.lastRegeneration).toBe(mockDate.toISOString());
    });
  });
  
  describe('Event Subscription', () => {
    it('should subscribe and unsubscribe to level up events', () => {
      const mockListener = vi.fn();
      
      gamificationService.subscribeLevelUp(mockListener);
      
      // Add XP to level up
      gamificationService.addXP(100, 'test');
      
      expect(mockListener).toHaveBeenCalled();
      
      // Unsubscribe
      gamificationService.unsubscribeLevelUp(mockListener);
      mockListener.mockClear();
      
      // Add more XP to level up again
      gamificationService.addXP(150, 'test');
      
      // Listener should not be called
      expect(mockListener).not.toHaveBeenCalled();
    });
    
    it('should subscribe and unsubscribe to currency change events', () => {
      const mockListener = vi.fn();
      
      gamificationService.subscribeCurrencyChange(mockListener);
      
      // Add currency
      gamificationService.addCurrency(50, 'test');
      
      expect(mockListener).toHaveBeenCalled();
      
      // Unsubscribe
      gamificationService.unsubscribeCurrencyChange(mockListener);
      mockListener.mockClear();
      
      // Add more currency
      gamificationService.addCurrency(25, 'test');
      
      // Listener should not be called
      expect(mockListener).not.toHaveBeenCalled();
    });
    
    it('should subscribe and unsubscribe to hearts change events', () => {
      const mockListener = vi.fn();
      
      gamificationService.subscribeHeartsChange(mockListener);
      
      // Lose heart
      gamificationService.loseHeart('test');
      
      expect(mockListener).toHaveBeenCalled();
      
      // Unsubscribe
      gamificationService.unsubscribeHeartsChange(mockListener);
      mockListener.mockClear();
      
      // Lose another heart
      gamificationService.loseHeart('test');
      
      // Listener should not be called
      expect(mockListener).not.toHaveBeenCalled();
    });
  });
  
  describe('Data Management', () => {
    it('should get data correctly', () => {
      // Add some data
      gamificationService.addXP(100, 'test');
      gamificationService.addCurrency(50, 'test');
      gamificationService.loseHeart('test');
      
      // Get the current balance
      const balanceBefore = gamificationService.getCurrencyData().balance;
      
      // Add more currency
      gamificationService.addCurrency(30, 'level_up');
      
      const data = gamificationService.getData();
      
      expect(data.xp.totalXP).toBe(100);
      expect(data.currency.balance).toBe(balanceBefore + 30);
      expect(data.hearts.current).toBe(4);
    });
    
    it('should get XP data correctly', () => {
      gamificationService.addXP(150, 'test');
      
      const xpData = gamificationService.getXPData();
      
      expect(xpData.totalXP).toBe(150);
      expect(xpData.level).toBe(2);
      expect(xpData.currentLevelXP).toBe(50);
      expect(xpData.nextLevelXP).toBe(150);
    });
    
    it('should get currency data correctly', () => {
      gamificationService.addCurrency(75, 'test');
      gamificationService.spendCurrency(25, 'test');
      
      const currencyData = gamificationService.getCurrencyData();
      
      expect(currencyData.balance).toBe(50);
      expect(currencyData.totalEarned).toBe(75);
      expect(currencyData.transactions).toHaveLength(2);
    });
    
    it('should get hearts data correctly', () => {
      gamificationService.loseHeart('test');
      
      const heartsData = gamificationService.getHeartsData();
      
      expect(heartsData.current).toBe(4);
      expect(heartsData.max).toBe(5);
      expect(heartsData.isPremium).toBe(false);
    });
  });
}); 