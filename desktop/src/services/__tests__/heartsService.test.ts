import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

// Mock dependencies first
vi.mock('../loggerService', () => ({
  loggerService: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
  }
}));

vi.mock('../ServiceFactory', () => ({
  serviceFactory: {
    register: vi.fn()
  }
}));

vi.mock('../audioService', () => ({
  audioService: {
    playSound: vi.fn()
  }
}));

vi.mock('../currencyService', () => ({
  currencyService: {
    spendCurrency: vi.fn().mockReturnValue(true)
  }
}));

// Mock localStorage for the test
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Date.now() for consistent testing
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

// Import after mocking
import { heartsService, HeartsData, HEARTS_CONFIG, HeartsChangeEvent } from '../heartsService';
import { loggerService } from '../loggerService';
import { audioService } from '../audioService';
import { currencyService } from '../currencyService';

describe('HeartsService', () => {
  const testHeartsData: HeartsData = {
    current: 5,
    max: 5,
    lastRegeneration: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    nextRegenerationTime: null,
    isPremium: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(JSON.stringify(testHeartsData));
    localStorageMock.setItem.mockClear();
    
    // Clear intervals/timeouts
    vi.clearAllTimers();
    
    // Reset hearts to defaults
    heartsService.resetHearts();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
    global.Date = originalDate;
  });
  
  it('should extend BaseService', () => {
    expect(heartsService).toBeInstanceOf(BaseService);
  });
  
  it('should initialize and cleanup properly', async () => {
    // Test initialization
    await heartsService.initialize();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Hearts service initialized',
      expect.any(Object)
    );
    
    // Test cleanup
    heartsService.cleanup();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Hearts service cleaned up',
      expect.any(Object)
    );
  });
  
  it('useHeart decreases hearts correctly', () => {
    // Verify initial hearts
    expect(heartsService.getCurrentHearts()).toBe(5);
    
    // Use one heart
    const success = heartsService.useHearts(1, 'test');
    
    // Should succeed
    expect(success).toBe(true);
    
    // Should decrease hearts
    expect(heartsService.getCurrentHearts()).toBe(4);
    
    // Should play heart loss sound
    expect(audioService.playSound).toHaveBeenCalledWith('heart_lost');
    
    // Should save to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  it('addHeart increases hearts correctly', () => {
    // First use hearts to get below max
    heartsService.useHearts(1, 'test');
    expect(heartsService.getCurrentHearts()).toBe(4);
    
    // Add a heart
    heartsService.addHearts(1, 'test');
    
    // Should increase hearts
    expect(heartsService.getCurrentHearts()).toBe(5);
    
    // Should play heart gain sound
    expect(audioService.playSound).toHaveBeenCalledWith('heart_gain');
    
    // Should save to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  it('getHearts returns current heart count', () => {
    // Should return the current number of hearts
    expect(heartsService.getCurrentHearts()).toBe(5);
  });
  
  it('getMaxHearts returns capacity', () => {
    // Should return the maximum number of hearts
    expect(heartsService.getMaxHearts()).toBe(5);
  });
  
  it('getTimeToNextHeart calculates regeneration time', () => {
    // First use a heart to start regeneration
    heartsService.useHearts(1, 'test');
    
    // Should return time until next heart
    const timeToNext = heartsService.getTimeUntilNextHeart();
    expect(timeToNext).toBeGreaterThan(0);
    expect(timeToNext).toBeLessThanOrEqual(HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000);
  });
  
  it('isRegenerating checks regeneration status', () => {
    // First use a heart to start regeneration
    heartsService.useHearts(1, 'test');
    
    // Should be regenerating (hearts are less than max)
    expect(heartsService.getCurrentHearts()).toBeLessThan(heartsService.getMaxHearts());
    expect(heartsService.getTimeUntilNextHeart()).toBeGreaterThan(0);
  });

  it('refillHearts refills hearts using currency', () => {
    // First use some hearts
    heartsService.useHearts(2, 'test');
    expect(heartsService.getCurrentHearts()).toBe(3);
    
    // Mock currencyService to allow spending
    vi.mocked(currencyService.spendCurrency).mockReturnValueOnce(true);
    
    // Refill hearts
    const success = heartsService.refillHearts();
    
    // Should succeed
    expect(success).toBe(true);
    
    // Should spend currency
    expect(currencyService.spendCurrency).toHaveBeenCalledWith(
      HEARTS_CONFIG.COST_PER_REFILL,
      'heart_refill',
      'Refill all hearts'
    );
    
    // Should refill to max
    expect(heartsService.getCurrentHearts()).toBe(5);
  });
  
  it('notifies subscribers when hearts change', () => {
    // Add a subscriber
    const listener = vi.fn();
    heartsService.subscribe(listener);
    
    // Use a heart
    heartsService.useHearts(1, 'test');
    
    // Should notify the subscriber
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      oldHearts: 5,
      newHearts: 4,
      change: -1,
      reason: 'test'
    }));
    
    // Unsubscribe
    heartsService.unsubscribe(listener);
    listener.mockClear();
    
    // Use another heart
    heartsService.useHearts(1, 'test');
    
    // Should not notify unsubscribed listeners
    expect(listener).not.toHaveBeenCalled();
  });
  
  it('handles premium status correctly', () => {
    // Set to premium
    heartsService.setPremiumStatus(true);
    
    // Should refill hearts
    expect(heartsService.getCurrentHearts()).toBe(5);
    
    // Use hearts should always succeed for premium users
    expect(heartsService.useHearts(2, 'test')).toBe(true);
    
    // Hearts should remain at max
    expect(heartsService.getCurrentHearts()).toBe(5);
  });
  
  it('hasEnoughHearts checks if user has required hearts', () => {
    // Start with default 5 hearts
    expect(heartsService.getCurrentHearts()).toBe(5);
    
    // Check for different amounts
    expect(heartsService.hasEnoughHearts(1)).toBe(true);
    expect(heartsService.hasEnoughHearts(5)).toBe(true);
    expect(heartsService.hasEnoughHearts(6)).toBe(false);
    
    // Premium users always have enough
    heartsService.setPremiumStatus(true);
    expect(heartsService.hasEnoughHearts(100)).toBe(true);
  });

  it('allows setting maximum hearts', () => {
    // Set max hearts to 8
    heartsService.setMaxHearts(8);
    
    // Should update max hearts
    expect(heartsService.getMaxHearts()).toBe(8);
    
    // Should save to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
}); 