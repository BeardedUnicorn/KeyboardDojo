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

// Mock localStorage for the test
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Import after mocking
import { xpService, XPData, LevelUpEvent, XP_REWARDS } from '../xpService';
import { loggerService } from '../loggerService';
import { audioService } from '../audioService';

describe('XPService', () => {
  const mockXPData: XPData = {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: 100,
    xpHistory: [],
    levelHistory: [{
      date: '2023-01-01T00:00:00.000Z',
      level: 1,
    }],
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    
    // Reset XP to defaults
    xpService.resetXP();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should extend BaseService', () => {
    expect(xpService).toBeInstanceOf(BaseService);
  });
  
  it('should initialize and cleanup properly', async () => {
    // Test initialization
    await xpService.initialize();
    expect(loggerService.info).toHaveBeenCalledWith(
      'XP service initialized',
      expect.any(Object)
    );
    
    // Test cleanup
    xpService.cleanup();
    expect(loggerService.info).toHaveBeenCalledWith(
      'XP service cleaned up',
      expect.any(Object)
    );
  });
  
  it('addXP increases experience correctly', () => {
    // Get initial XP
    const initialXP = xpService.getTotalXP();
    
    // Add some XP
    const amountToAdd = 50;
    const updatedData = xpService.addXP(amountToAdd, 'test', 'Test XP gain');
    
    // Check that XP was added correctly
    expect(updatedData.totalXP).toBe(initialXP + amountToAdd);
    expect(xpService.getTotalXP()).toBe(initialXP + amountToAdd);
    
    // Get the latest XP history entry
    const latestEntry = updatedData.xpHistory[updatedData.xpHistory.length - 1];
    
    // Check XP history entry was added correctly
    expect(latestEntry.amount).toBe(amountToAdd);
    expect(latestEntry.source).toBe('test');
    expect(latestEntry.description).toBe('Test XP gain');
  });
  
  it('getLevel returns correct level for XP amount', () => {
    // The initial level with 0 XP should be 1
    let currentLevel = xpService.getLevel();
    expect(currentLevel).toBe(1); // Service starts at level 1
    
    // Test Level 3 (250 XP)
    xpService.resetXP();
    xpService.addXP(250, 'test');
    currentLevel = xpService.getLevel();
    expect(currentLevel).toBe(3);
    
    // Test Level 4 (500 XP)
    xpService.resetXP();
    xpService.addXP(500, 'test');
    currentLevel = xpService.getLevel();
    expect(currentLevel).toBe(4);
  });
  
  it('getXpProgress calculates progress percentage', () => {
    // Reset to defaults
    xpService.resetXP();
    
    // Test at initial progress
    const initialProgress = xpService.getLevelProgress();
    expect(initialProgress).toBeGreaterThanOrEqual(0);
    expect(initialProgress).toBeLessThanOrEqual(100);
    
    // Test progress with some XP
    xpService.resetXP();
    xpService.addXP(50, 'test');
    const midProgress = xpService.getLevelProgress();
    expect(midProgress).toBeGreaterThanOrEqual(0);
    expect(midProgress).toBeLessThanOrEqual(100);
    
    // Test progress after level up
    xpService.resetXP();
    xpService.addXP(250, 'test'); // This should reach level 3
    const afterLevelUpProgress = xpService.getLevelProgress();
    expect(afterLevelUpProgress).toBeGreaterThanOrEqual(0);
    expect(afterLevelUpProgress).toBeLessThanOrEqual(100);
  });
  
  it('getXPForNextLevel returns correct XP needed', () => {
    // Reset XP
    xpService.resetXP();
    
    // Check that getXPForNextLevel returns a positive number
    const xpNeeded = xpService.getXPForNextLevel();
    expect(xpNeeded).toBeGreaterThan(0);
    
    // Add some XP and check that the XP needed is reduced
    const initialXpNeeded = xpService.getXPForNextLevel();
    xpService.addXP(50, 'test');
    const updatedXpNeeded = xpService.getXPForNextLevel();
    expect(updatedXpNeeded).toBeLessThan(initialXpNeeded);
    
    // Level up and check that XP needed is for the next level
    xpService.resetXP();
    xpService.addXP(250, 'test'); // Should be level 3
    const xpNeededForLevel4 = xpService.getXPForNextLevel();
    expect(xpNeededForLevel4).toBeGreaterThan(0);
  });
  
  it('records XP transactions correctly', () => {
    // Reset XP
    xpService.resetXP();
    
    // Start with a clean slate
    const initialData = xpService.getXPData();
    const initialHistoryLength = initialData.xpHistory.length;
    const initialTotalXP = initialData.totalXP;
    
    // Add XP for a single activity
    const updatedData = xpService.addXP(XP_REWARDS.COMPLETE_LESSON, 'lesson', 'Completed Basic Lesson');
    
    // Verify a new history entry was added
    expect(updatedData.xpHistory.length).toBe(initialHistoryLength + 1);
    
    // Verify the new entry has the correct data
    const newEntry = updatedData.xpHistory[updatedData.xpHistory.length - 1];
    expect(newEntry.amount).toBe(XP_REWARDS.COMPLETE_LESSON);
    expect(newEntry.source).toBe('lesson');
    expect(newEntry.description).toBe('Completed Basic Lesson');
    
    // Verify total XP increased
    const expectedIncrease = XP_REWARDS.COMPLETE_LESSON;
    expect(updatedData.totalXP).toBe(initialTotalXP + expectedIncrease);
  });
  
  it('handles level up events correctly', () => {
    // Reset XP
    xpService.resetXP();
    
    // Add a level up listener
    const levelUpListener = vi.fn();
    
    // Use mock implementation to spy on the level up event
    const listenerWithImpl = vi.fn().mockImplementation((event: LevelUpEvent) => {
      // Just to demonstrate we can check event properties
      expect(event).toHaveProperty('oldLevel');
      expect(event).toHaveProperty('newLevel');
      expect(event).toHaveProperty('title');
    });
    
    // Subscribe to level up events
    xpService.subscribeToLevelUp(listenerWithImpl);
    
    // Current level
    const initialLevel = xpService.getLevel();
    
    // Force a level up by adding enough XP
    xpService.addXP(1000, 'test'); // This should trigger at least one level up
    
    // New level should be higher
    const newLevel = xpService.getLevel();
    expect(newLevel).toBeGreaterThan(initialLevel);
    
    // Check listener was called
    expect(listenerWithImpl).toHaveBeenCalled();
    
    // Verify sound effect was played
    expect(audioService.playSound).toHaveBeenCalledWith('levelUp');
  });
  
  it('provides a way to subscribe to XP changes', () => {
    // Reset XP
    xpService.resetXP();
    
    // Add a change listener
    const changeListener = vi.fn();
    xpService.subscribe(changeListener);
    
    // Add XP
    xpService.addXP(50, 'test');
    
    // Check listener was called
    expect(changeListener).toHaveBeenCalled();
    
    // Unsubscribe
    xpService.unsubscribe(changeListener);
    changeListener.mockClear();
    
    // Add more XP
    xpService.addXP(50, 'test');
    
    // Listener should not be called again
    expect(changeListener).not.toHaveBeenCalled();
  });
  
  it('persists XP data to localStorage', () => {
    // Reset XP and clear mock
    xpService.resetXP();
    localStorageMock.setItem.mockClear();
    
    // Keep track of initial total XP
    const initialTotalXP = xpService.getTotalXP();
    
    // Add a specific amount of XP
    const addedXP = 50;
    xpService.addXP(addedXP, 'test');
    
    // Verify data was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // Verify localStorage key
    expect(localStorageMock.setItem.mock.calls[0][0]).toBe('user-xp');
    
    // Get the saved data and verify properties exist
    const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedData).toHaveProperty('totalXP');
    expect(savedData).toHaveProperty('level');
    expect(savedData).toHaveProperty('xpHistory');
    
    // Verify XP increased by the expected amount
    expect(savedData.totalXP).toBe(initialTotalXP + addedXP);
  });
  
  it('loads XP data from localStorage on initialization', async () => {
    // Mock stored XP data
    const storedXPData: XPData = {
      ...mockXPData,
      totalXP: 150,
      level: 2,
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedXPData));
    
    // Reset and initialize
    xpService.resetXP();
    await xpService.initialize();
    
    // Verify data was loaded from localStorage
    expect(xpService.getTotalXP()).toBe(150);
    expect(xpService.getLevel()).toBe(2);
  });
}); 