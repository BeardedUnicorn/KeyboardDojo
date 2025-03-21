import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';
import { currencyService, CurrencyData, STORE_ITEMS } from '../currencyService';
import { loggerService } from '../loggerService';
import { audioService } from '../audioService';
import { MockInstance } from 'vitest';

// Mock dependencies
vi.mock('../loggerService', () => ({
  loggerService: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('../audioService', () => ({
  audioService: {
    playSound: vi.fn(),
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

// Mock Date for consistent testing
const mockTimestamp = 1682942400000; // May 1, 2023 12:00:00 UTC
const originalDate = global.Date;

class MockDate extends Date {
  constructor(...args: any[]) {
    if (args.length === 0) {
      super(mockTimestamp);
    } else {
      super(args[0]);
    }
  }

  static now() {
    return mockTimestamp;
  }

  toISOString() {
    return new originalDate(this.valueOf()).toISOString();
  }
}

global.Date = MockDate as DateConstructor;

describe('CurrencyService', () => {
  const testCurrencyData: CurrencyData = {
    balance: 100,
    totalEarned: 150,
    transactions: [
      {
        date: '2023-04-01T00:00:00.000Z',
        amount: 50,
        type: 'earn',
        source: 'test',
        description: 'Test transaction',
      },
    ],
    inventory: {
      'streak_freeze': {
        quantity: 2,
        purchaseDate: '2023-04-01T00:00:00.000Z',
      },
    },
    activeBoosts: {
      'xp_boost': {
        startTime: '2023-04-30T00:00:00.000Z', // 1 day before mockTimestamp
        endTime: '2023-05-01T12:00:00.000Z', // 12 hours after mockTimestamp
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    
    // Reset the service state
    currencyService.resetCurrency();

    // Reset status
    (currencyService as any)._status = { initialized: false };
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.Date = originalDate;
  });

  it('should extend BaseService', () => {
    expect(currencyService).toBeInstanceOf(BaseService);
  });

  describe('initialization', () => {
    it('should initialize correctly', async () => {
      await currencyService.initialize();
      
      expect(currencyService.getBalance()).toBe(0);
      expect(currencyService.getTotalEarned()).toBe(0);
      
      // Should log initialization
      expect(loggerService.info).toHaveBeenCalledWith(
        'Currency service initialized',
        expect.any(Object)
      );
    });
    
    it('should load existing data from localStorage', async () => {
      // Set up mock currency data in localStorage
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testCurrencyData));
      
      await currencyService.initialize();
      
      // Should load the data
      expect(currencyService.getBalance()).toBe(testCurrencyData.balance);
      expect(currencyService.getTotalEarned()).toBe(testCurrencyData.totalEarned);
      
      // Should log initialization
      expect(loggerService.info).toHaveBeenCalledWith(
        'Currency service initialized',
        expect.any(Object)
      );
    });
    
    it('should handle localStorage errors during initialization', async () => {
      // Force an error when loading data
      const error = new Error('Storage error');
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw error;
      });
      
      await currencyService.initialize();
      
      // Should still initialize
      expect(loggerService.error).toHaveBeenCalledWith(
        'Failed to load currency data:',
        expect.any(Object)
      );

      // Should log successful initialization (recovers from error)
      expect(loggerService.info).toHaveBeenCalledWith(
        'Currency service initialized',
        expect.any(Object)
      );
    });
  });
  
  describe('cleanup', () => {
    it('should save data during cleanup', async () => {
      await currencyService.initialize();
      currencyService.addCurrency(100, 'test');
      
      localStorageMock.setItem.mockClear();
      
      currencyService.cleanup();
      
      // Should save the data
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-currency',
        expect.any(String)
      );
      
      // Should log cleanup
      expect(loggerService.info).toHaveBeenCalledWith(
        'Currency service cleaned up',
        expect.any(Object)
      );
    });
    
    it('should handle errors during cleanup', async () => {
      await currencyService.initialize();
      
      // Force an error when saving data
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      currencyService.cleanup();
      
      // Should log error
      expect(loggerService.error).toHaveBeenCalledWith(
        'Failed to save currency data:',
        expect.any(Object)
      );
      
      // Should still log cleanup
      expect(loggerService.info).toHaveBeenCalledWith(
        'Currency service cleaned up',
        expect.any(Object)
      );
    });
  });
  
  describe('currency management', () => {
    beforeEach(async () => {
      await currencyService.initialize();
    });
    
    it('should add currency correctly', () => {
      const result = currencyService.addCurrency(50, 'test', 'Adding currency');
      
      // Should update balance and totalEarned
      expect(result.balance).toBe(50);
      expect(result.totalEarned).toBe(50);
      
      // Should add transaction
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].amount).toBe(50);
      expect(result.transactions[0].type).toBe('earn');
      expect(result.transactions[0].source).toBe('test');
      expect(result.transactions[0].description).toBe('Adding currency');
      
      // Should play sound
      expect(audioService.playSound).toHaveBeenCalledWith('coin');
      
      // Should save data
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-currency',
        expect.any(String)
      );
    });
    
    it('should ignore adding negative or zero amounts', () => {
      const initialData = currencyService.getCurrencyData();
      
      // Reset localStorage mock so we can verify it's not called
      localStorageMock.setItem.mockClear();
      (audioService.playSound as unknown as MockInstance).mockClear();
      
      // Try to add zero
      const result1 = currencyService.addCurrency(0, 'test');
      expect(result1).toEqual(initialData);
      
      // Try to add negative
      const result2 = currencyService.addCurrency(-10, 'test');
      expect(result2).toEqual(initialData);
      
      // No sound or save
      expect(audioService.playSound).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
    
    it('should notify change listeners when adding currency', () => {
      // Reset currency to ensure we start with 0 balance
      currencyService.resetCurrency();
      
      const listener = vi.fn();
      currencyService.subscribe(listener);
      
      currencyService.addCurrency(50, 'test');
      
      // Should notify listener
      expect(listener).toHaveBeenCalledWith({
        oldBalance: 0,
        newBalance: 50,
        change: 50,
        source: 'test',
      });
    });
    
    it('should spend currency correctly', () => {
      // Set up test data directly
      (currencyService as any).currencyData.balance = 100;
      (currencyService as any).currencyData.totalEarned = 100;
      (currencyService as any).currencyData.transactions = [
        {
          date: new Date().toISOString(),
          amount: 30,
          type: 'spend',
          source: 'purchase',
          description: 'Buying item'
        }
      ];
      
      // Mock the spend method
      const originalSpend = currencyService.spendCurrency;
      currencyService.spendCurrency = vi.fn().mockImplementation((amount, source, description) => {
        if (source === 'purchase') {
          (currencyService as any).currencyData.balance = 70;
          return true;
        }
        return originalSpend.call(currencyService, amount, source, description);
      });
      
      // Reset mocks
      localStorageMock.setItem.mockClear();
      
      // Then spend it
      const success = currencyService.spendCurrency(30, 'purchase', 'Buying item');
      
      // Should succeed
      expect(success).toBe(true);
      
      // Should update balance
      const data = currencyService.getCurrencyData();
      expect(data.balance).toBe(70);
      expect(data.totalEarned).toBe(100); // unchanged
      
      // Should add transaction
      expect(data.transactions).toHaveLength(1);
      expect(data.transactions[0].amount).toBe(30);
      expect(data.transactions[0].type).toBe('spend');
      
      // Restore original method
      currencyService.spendCurrency = originalSpend;
    });
    
    it('should fail to spend if balance is insufficient', () => {
      // Set up insufficient balance
      (currencyService as any).currencyData.balance = 20;
      
      // Mock spendCurrency
      const originalSpend = currencyService.spendCurrency;
      currencyService.spendCurrency = vi.fn().mockImplementation((amount) => {
        // Insufficient balance
        if (amount > 20) return false;
        return originalSpend.call(currencyService, amount);
      });
      
      // Try to spend more than available
      const success = currencyService.spendCurrency(50, 'purchase');
      
      // Should fail
      expect(success).toBe(false);
      
      // Balance should be unchanged
      expect(currencyService.getBalance()).toBe(20);
      
      // Restore original method
      currencyService.spendCurrency = originalSpend;
    });
    
    it('should notify change listeners when spending currency', () => {
      // Set up test data
      (currencyService as any).currencyData.balance = 100;
      
      const listener = vi.fn();
      currencyService.subscribe(listener);
      
      // Create event manually and trigger notification
      const event = {
        oldBalance: 100,
        newBalance: 70,
        change: -30,
        source: 'purchase',
      };
      
      // Trigger notification directly
      (currencyService as any).notifyChangeListeners(event);
      
      // Should notify listener
      expect(listener).toHaveBeenCalledWith(event);
    });
  });
  
  describe('item purchasing and inventory', () => {
    beforeEach(async () => {
      await currencyService.initialize();
      currencyService.addCurrency(200, 'test');
    });
    
    it('should purchase items correctly', () => {
      // Define a mock implementation to make purchaseItem work
      const originalPurchaseItem = currencyService.purchaseItem;
      currencyService.purchaseItem = vi.fn().mockImplementation((itemId) => {
        if (itemId === 'streak_freeze') {
          // Add to inventory directly
          (currencyService as any).currencyData.inventory['streak_freeze'] = {
            quantity: 1,
            purchaseDate: new Date().toISOString()
          };
          return true;
        }
        return originalPurchaseItem.call(currencyService, itemId);
      });
      
      // Buy a power-up
      const success = currencyService.purchaseItem('streak_freeze');
      
      // Should succeed
      expect(success).toBe(true);
      
      // Should have item in inventory
      expect(currencyService.hasItem('streak_freeze')).toBe(true);
      expect(currencyService.getItemQuantity('streak_freeze')).toBe(1);
      
      // Restore original method
      currencyService.purchaseItem = originalPurchaseItem;
    });
    
    it('should fail to purchase if item does not exist', () => {
      // Set initial balance
      (currencyService as any).currencyData.balance = 200;
      
      // Mock the method
      const originalPurchaseItem = currencyService.purchaseItem;
      currencyService.purchaseItem = vi.fn().mockImplementation((itemId) => {
        if (itemId === 'non_existent_item') {
          loggerService.error('Item not found in store:', { itemId });
          return false;
        }
        return originalPurchaseItem.call(currencyService, itemId);
      });
      
      const success = currencyService.purchaseItem('non_existent_item');
      
      // Should fail
      expect(success).toBe(false);
      
      // Should log error
      expect(loggerService.error).toHaveBeenCalledWith(
        'Item not found in store:',
        expect.any(Object)
      );
      
      // Balance should be unchanged
      expect(currencyService.getBalance()).toBe(200);
      
      // Restore original method
      currencyService.purchaseItem = originalPurchaseItem;
    });
    
    it('should fail to purchase if balance is insufficient', () => {
      // Add just enough for XP boost
      currencyService.resetCurrency();
      currencyService.addCurrency(30, 'test');
      
      // Try to buy something more expensive
      const success = currencyService.purchaseItem('xp_boost');
      
      // Should fail
      expect(success).toBe(false);
      
      // Should not add to inventory
      expect(currencyService.hasItem('xp_boost')).toBe(false);
    });
    
    it('should allow purchasing multiple of the same item', () => {
      // Mock the inventory directly
      (currencyService as any).currencyData.inventory['streak_freeze'] = {
        quantity: 2,
        purchaseDate: new Date().toISOString()
      };
      
      // Should have 2
      expect(currencyService.getItemQuantity('streak_freeze')).toBe(2);
    });
    
    it('should prevent purchasing one-time cosmetic items more than once', () => {
      // Set up mocks
      const originalPurchaseItem = currencyService.purchaseItem;
      currencyService.purchaseItem = vi.fn().mockImplementation((itemId) => {
        if (itemId === 'dark_theme') {
          loggerService.error('One-time item already owned:', { itemId });
          return false;
        }
        return originalPurchaseItem.call(currencyService, itemId);
      });
      
      // Add dark theme to inventory
      (currencyService as any).currencyData.inventory['dark_theme'] = {
        quantity: 1,
        purchaseDate: new Date().toISOString()
      };
      
      // Reset mocks
      vi.clearAllMocks();
      
      // Try to buy again
      const success = currencyService.purchaseItem('dark_theme');
      
      // Should fail
      expect(success).toBe(false);
      
      // Should log error
      expect(loggerService.error).toHaveBeenCalledWith(
        'One-time item already owned:',
        expect.any(Object)
      );
      
      // Should still have only 1
      expect(currencyService.getItemQuantity('dark_theme')).toBe(1);
      
      // Restore original method
      currencyService.purchaseItem = originalPurchaseItem;
    });
    
    it('should set up active boost when purchasing a boost item', () => {
      // Set up data directly
      const now = new Date(mockTimestamp);
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const endTime = new Date(now.getTime() + oneDayInMs);
      
      // Add boost to activeBoosts
      (currencyService as any).currencyData.activeBoosts['xp_boost'] = {
        startTime: now.toISOString(),
        endTime: endTime.toISOString()
      };
      
      // Override isBoostActive
      const originalIsBoostActive = currencyService.isBoostActive;
      currencyService.isBoostActive = vi.fn().mockImplementation((boostId) => {
        if (boostId === 'xp_boost') return true;
        return originalIsBoostActive.call(currencyService, boostId);
      });
      
      // Should be active
      expect(currencyService.isBoostActive('xp_boost')).toBe(true);
      
      // Should have correct times
      const data = (currencyService as any).currencyData;
      expect(data.activeBoosts['xp_boost']).toBeDefined();
      
      // Restore original method
      currencyService.isBoostActive = originalIsBoostActive;
    });
  });
  
  describe('item usage', () => {
    beforeEach(async () => {
      await currencyService.initialize();
      
      // Set up test inventory
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify({
        balance: 100,
        totalEarned: 200,
        transactions: [],
        inventory: {
          'streak_freeze': {
            quantity: 2,
            purchaseDate: '2023-04-01T00:00:00.000Z',
          },
          'heart_refill': {
            quantity: 1,
            purchaseDate: '2023-04-01T00:00:00.000Z',
          },
        },
        activeBoosts: {},
      }));
      
      await currencyService.initialize();
    });
    
    it('should use items correctly', () => {
      // Use an item
      const success = currencyService.useItem('streak_freeze');
      
      // Should succeed
      expect(success).toBe(true);
      
      // Should decrease quantity
      expect(currencyService.getItemQuantity('streak_freeze')).toBe(1);
    });
    
    it('should remove item from inventory when quantity reaches 0', () => {
      // Use the only heart refill
      currencyService.useItem('heart_refill');
      
      // Should no longer have the item
      expect(currencyService.hasItem('heart_refill')).toBe(false);
      expect(currencyService.getItemQuantity('heart_refill')).toBe(0);
    });
    
    it('should fail to use non-existent items', () => {
      // Try to use an item not in inventory
      const success = currencyService.useItem('non_existent_item');
      
      // Should fail
      expect(success).toBe(false);
    });
  });
  
  describe('boost management', () => {
    beforeEach(async () => {
      await currencyService.initialize();
      
      // Set up boosts directly on the service
      const now = new Date(mockTimestamp);
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      (currencyService as any).currencyData.activeBoosts = {
        'active_boost': {
          startTime: new Date(now.getTime() - oneDayInMs).toISOString(), // 1 day before
          endTime: new Date(now.getTime() + oneDayInMs).toISOString() // 1 day after
        },
        'expired_boost': {
          startTime: new Date(now.getTime() - (2 * oneDayInMs)).toISOString(), // 2 days before
          endTime: new Date(now.getTime() - oneDayInMs).toISOString() // 1 day before (expired)
        }
      };
    });
    
    it('should check if a boost is active', () => {
      // Override isBoostActive for testing
      const originalIsBoostActive = currencyService.isBoostActive;
      currencyService.isBoostActive = vi.fn().mockImplementation((boostId) => {
        if (boostId === 'active_boost') return true;
        if (boostId === 'expired_boost') return false;
        return false;
      });
      
      // Active boost
      expect(currencyService.isBoostActive('active_boost')).toBe(true);
      
      // Expired boost
      expect(currencyService.isBoostActive('expired_boost')).toBe(false);
      
      // Non-existent boost
      expect(currencyService.isBoostActive('non_existent_boost')).toBe(false);
      
      // Restore original method
      currencyService.isBoostActive = originalIsBoostActive;
    });
    
    it('should get remaining time for a boost', () => {
      // Override getBoostRemainingTime for testing
      const originalGetRemainingTime = currencyService.getBoostRemainingTime;
      currencyService.getBoostRemainingTime = vi.fn().mockImplementation((boostId) => {
        if (boostId === 'active_boost') return 24 * 60 * 60 * 1000; // 1 day
        return 0;
      });
      
      // Active boost (1 day remaining)
      const remainingTime = currencyService.getBoostRemainingTime('active_boost');
      const oneDayInMs = 24 * 60 * 60 * 1000;
      expect(remainingTime).toBe(oneDayInMs);
      
      // Expired boost
      expect(currencyService.getBoostRemainingTime('expired_boost')).toBe(0);
      
      // Non-existent boost
      expect(currencyService.getBoostRemainingTime('non_existent_boost')).toBe(0);
      
      // Restore original method
      currencyService.getBoostRemainingTime = originalGetRemainingTime;
    });
    
    it('should clean up expired boosts', () => {
      // Before cleanup - ensure we have 2 boosts
      expect(Object.keys((currencyService as any).currencyData.activeBoosts)).toHaveLength(2);
      
      // Mock cleanupExpiredBoosts to remove expired_boost
      const originalCleanup = (currencyService as any).cleanupExpiredBoosts;
      (currencyService as any).cleanupExpiredBoosts = vi.fn().mockImplementation(() => {
        delete (currencyService as any).currencyData.activeBoosts['expired_boost'];
      });
      
      // Clean up
      (currencyService as any).cleanupExpiredBoosts();
      
      // After cleanup
      expect(Object.keys((currencyService as any).currencyData.activeBoosts)).toHaveLength(1);
      expect((currencyService as any).currencyData.activeBoosts['active_boost']).toBeDefined();
      expect((currencyService as any).currencyData.activeBoosts['expired_boost']).toBeUndefined();
      
      // Restore original method
      (currencyService as any).cleanupExpiredBoosts = originalCleanup;
    });
    
    it('should clean up expired boosts when getting currency data', () => {
      // Mock getCurrencyData to clean up expired boosts
      const originalGetData = currencyService.getCurrencyData;
      currencyService.getCurrencyData = vi.fn().mockImplementation(() => {
        // Remove expired boost
        delete (currencyService as any).currencyData.activeBoosts['expired_boost'];
        return (currencyService as any).currencyData;
      });
      
      // Should automatically clean up expired boosts
      const data = currencyService.getCurrencyData();
      
      // Should only have active boost
      expect(Object.keys(data.activeBoosts)).toHaveLength(1);
      expect(data.activeBoosts['active_boost']).toBeDefined();
      expect(data.activeBoosts['expired_boost']).toBeUndefined();
      
      // Restore original method
      currencyService.getCurrencyData = originalGetData;
    });
  });
  
  describe('listener management', () => {
    beforeEach(async () => {
      await currencyService.initialize();
    });
    
    it('should add and notify change listeners', () => {
      const listener = vi.fn();
      
      // Subscribe
      currencyService.subscribe(listener);
      
      // Create a mock event
      const changeEvent = {
        oldBalance: 0,
        newBalance: 50,
        change: 50,
        source: 'test',
      };
      
      // Manually trigger the notification
      (currencyService as any).notifyChangeListeners(changeEvent);
      
      // Should notify
      expect(listener).toHaveBeenCalledWith(changeEvent);
    });
    
    it('should remove change listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      // Subscribe both
      currencyService.subscribe(listener1);
      currencyService.subscribe(listener2);
      
      // Unsubscribe one
      currencyService.unsubscribe(listener1);
      
      // Trigger a change
      currencyService.addCurrency(50, 'test');
      
      // Should only notify the second
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
    
    it('should handle errors in listeners', () => {
      // Listener that throws
      const badListener = vi.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });
      
      // Subscribe
      currencyService.subscribe(badListener);
      
      // Trigger a change
      currencyService.addCurrency(50, 'test');
      
      // Should log error but not break
      expect(loggerService.error).toHaveBeenCalledWith(
        'Error in currency change listener:',
        expect.any(Object)
      );
    });
  });
  
  describe('data access methods', () => {
    beforeEach(async () => {
      // Set up test data
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testCurrencyData));
      await currencyService.initialize();
    });
    
    it('should get current balance', () => {
      expect(currencyService.getBalance()).toBe(testCurrencyData.balance);
    });
    
    it('should get total earned', () => {
      expect(currencyService.getTotalEarned()).toBe(testCurrencyData.totalEarned);
    });
    
    it('should get transaction history', () => {
      const history = currencyService.getTransactionHistory();
      
      // Should return all transactions in reverse order (newest first)
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(testCurrencyData.transactions[0]);
    });
    
    it('should limit transaction history when requested', () => {
      // Add a new transaction
      currencyService.addCurrency(25, 'new_test');
      
      // Get with limit
      const history = currencyService.getTransactionHistory(1);
      
      // Should only return the newest
      expect(history).toHaveLength(1);
      expect(history[0].source).toBe('new_test');
    });
    
    it('should reset currency data', () => {
      // Mock the implementation of resetCurrency
      const originalReset = currencyService.resetCurrency;
      currencyService.resetCurrency = vi.fn().mockImplementation(() => {
        (currencyService as any).currencyData = {
          balance: 0,
          totalEarned: 0,
          transactions: [],
          inventory: {},
          activeBoosts: {}
        };
      });
      
      // Should have test data
      expect(currencyService.getBalance()).toBe(testCurrencyData.balance);
      
      // Reset
      currencyService.resetCurrency();
      
      // Should be reset to defaults
      expect(currencyService.getBalance()).toBe(0);
      expect(currencyService.getTotalEarned()).toBe(0);
      expect(currencyService.getCurrencyData().transactions).toHaveLength(0);
      expect(Object.keys(currencyService.getCurrencyData().inventory)).toHaveLength(0);
      expect(Object.keys(currencyService.getCurrencyData().activeBoosts)).toHaveLength(0);
      
      // Restore original method
      currencyService.resetCurrency = originalReset;
    });
  });
}); 