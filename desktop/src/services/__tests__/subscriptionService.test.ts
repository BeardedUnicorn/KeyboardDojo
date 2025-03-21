import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

// Mock dependencies properly
const mockStorageService = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

// Create the mock before importing the module
vi.mock('../../../shared/src/utils', () => ({
  storageService: mockStorageService
}), { virtual: true });

vi.mock('../loggerService', () => ({
  loggerService: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

vi.mock('../ServiceFactory', () => ({
  serviceFactory: {
    register: vi.fn()
  }
}));

// Import dependencies and service after mocking
import { subscriptionService, SubscriptionTier, SUBSCRIPTION_PLANS } from '../subscriptionService';
import { loggerService } from '../loggerService';

describe('SubscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset service for testing
    (subscriptionService as any)._status = { initialized: false };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extend BaseService', () => {
    expect(subscriptionService).toBeInstanceOf(BaseService);
  });

  it('should get current subscription state', () => {
    const state = subscriptionService.getState();
    expect(state).toBeDefined();
    expect(state).toHaveProperty('currentTier');
  });

  it('should get available subscription plans', () => {
    const plans = subscriptionService.getPlans();
    expect(plans).toBe(SUBSCRIPTION_PLANS);
    expect(plans.length).toBeGreaterThanOrEqual(3); // Should have at least free, premium, and pro tiers
  });

  it('should get active subscription plan', () => {
    // Set up some internal state
    (subscriptionService as any).state = {
      currentTier: SubscriptionTier.FREE,
      activePlan: null,
      expiresAt: null,
      paymentMethod: null,
      autoRenew: false,
    };
    
    // With no active plan, should return free plan
    expect(subscriptionService.getActivePlan()).toBe(SUBSCRIPTION_PLANS[0]);
    
    // With premium-monthly plan
    (subscriptionService as any).state.activePlan = 'premium-monthly';
    const activePlan = subscriptionService.getActivePlan();
    expect(activePlan?.id).toBe('premium-monthly');
    expect(activePlan?.tier).toBe(SubscriptionTier.PREMIUM);
    
    // With non-existent plan ID
    (subscriptionService as any).state.activePlan = 'non-existent-plan';
    expect(subscriptionService.getActivePlan()).toBeNull();
  });

  it('should subscribe to a plan successfully', async () => {
    // Mock Date.now for consistent expiration calculations
    const mockNow = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Mock storageService.setItem to resolve
    mockStorageService.setItem.mockResolvedValueOnce(undefined);
    
    const result = await subscriptionService.subscribe('premium-monthly', 'test-card', true);
    
    expect(result).toBe(true);
    expect(loggerService.info).toHaveBeenCalledWith(
      'Subscription successful',
      expect.objectContaining({
        planId: 'premium-monthly'
      })
    );
  });

  it('should handle subscription with yearly interval', async () => {
    // Mock Date.now for consistent expiration calculations
    const mockNow = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Mock storageService.setItem to resolve
    mockStorageService.setItem.mockResolvedValueOnce(undefined);
    
    const result = await subscriptionService.subscribe('premium-yearly', 'test-card', true);
    
    expect(result).toBe(true);
    expect((subscriptionService as any).state.expiresAt).toBe(
      mockNow + 365 * 24 * 60 * 60 * 1000 // 365 days from mockNow
    );
  });

  it('should handle subscription with invalid plan ID', async () => {
    const result = await subscriptionService.subscribe('invalid-plan', 'test-card', true);
    
    expect(result).toBe(false);
    expect(loggerService.error).toHaveBeenCalledWith(
      'Failed to subscribe:',
      expect.any(Error),
      expect.objectContaining({
        planId: 'invalid-plan'
      })
    );
  });

  it('should cancel subscription successfully', async () => {
    // Set up existing subscription
    (subscriptionService as any).state = {
      currentTier: SubscriptionTier.PREMIUM,
      activePlan: 'premium-monthly',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      paymentMethod: 'test-card',
      autoRenew: true,
    };
    
    // Mock storageService.setItem to resolve
    mockStorageService.setItem.mockResolvedValueOnce(undefined);
    
    const result = await subscriptionService.cancelSubscription();
    
    expect(result).toBe(true);
    expect((subscriptionService as any).state.autoRenew).toBe(false);
    expect(loggerService.info).toHaveBeenCalledWith(
      'Subscription cancelled',
      expect.objectContaining({
        planId: 'premium-monthly'
      })
    );
  });

  it('should handle cancellation errors', async () => {
    // Create a spy on the internal saveState method to mock the error
    const saveStateSpy = vi.spyOn(subscriptionService as any, 'saveState')
      .mockRejectedValueOnce(new Error('Storage error'));
    
    const result = await subscriptionService.cancelSubscription();
    
    expect(result).toBe(false);
    expect(loggerService.error).toHaveBeenCalledWith(
      'Failed to cancel subscription:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('should check for premium features correctly', () => {
    // Free tier shouldn't have premium features
    (subscriptionService as any).state.currentTier = SubscriptionTier.FREE;
    expect(subscriptionService.hasPremiumFeatures()).toBe(false);
    
    // Premium tier should have premium features
    (subscriptionService as any).state.currentTier = SubscriptionTier.PREMIUM;
    expect(subscriptionService.hasPremiumFeatures()).toBe(true);
    
    // Pro tier should have premium features
    (subscriptionService as any).state.currentTier = SubscriptionTier.PRO;
    expect(subscriptionService.hasPremiumFeatures()).toBe(true);
  });

  it('should check for pro features correctly', () => {
    // Free tier shouldn't have pro features
    (subscriptionService as any).state.currentTier = SubscriptionTier.FREE;
    expect(subscriptionService.hasProFeatures()).toBe(false);
    
    // Premium tier shouldn't have pro features
    (subscriptionService as any).state.currentTier = SubscriptionTier.PREMIUM;
    expect(subscriptionService.hasProFeatures()).toBe(false);
    
    // Pro tier should have pro features
    (subscriptionService as any).state.currentTier = SubscriptionTier.PRO;
    expect(subscriptionService.hasProFeatures()).toBe(true);
  });

  it('should manage listeners correctly', () => {
    // Add a listener
    const listenerMock = vi.fn();
    subscriptionService.addListener(listenerMock);
    
    // Check it was added
    expect((subscriptionService as any).listeners).toContain(listenerMock);
    
    // Notify listeners (directly call private method for testing)
    (subscriptionService as any).notifyListeners();
    
    // Check listener was called with current state
    expect(listenerMock).toHaveBeenCalledWith((subscriptionService as any).state);
    
    // Remove listener
    subscriptionService.removeListener(listenerMock);
    
    // Check it was removed
    expect((subscriptionService as any).listeners).not.toContain(listenerMock);
    
    // Clear listener mock
    listenerMock.mockClear();
    
    // Notify listeners again
    (subscriptionService as any).notifyListeners();
    
    // Check listener was not called
    expect(listenerMock).not.toHaveBeenCalled();
  });

  it('should clean up correctly', () => {
    // Add some listeners
    const listenerMock1 = vi.fn();
    const listenerMock2 = vi.fn();
    (subscriptionService as any).listeners = [listenerMock1, listenerMock2];
    
    // Mock super.cleanup
    const superCleanup = vi.spyOn(BaseService.prototype, 'cleanup').mockImplementation();
    
    subscriptionService.cleanup();
    
    // Check listeners were cleared
    expect((subscriptionService as any).listeners).toEqual([]);
    expect(superCleanup).toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Subscription service cleaned up',
      expect.any(Object)
    );
  });

  it('should handle cleanup errors', () => {
    // Make superCleanup throw
    const mockError = new Error('Cleanup error');
    vi.spyOn(BaseService.prototype, 'cleanup').mockImplementation(() => {
      throw mockError;
    });
    
    // This should not throw
    subscriptionService.cleanup();
    
    expect(loggerService.error).toHaveBeenCalledWith(
      'Error cleaning up subscription service',
      mockError,
      expect.any(Object)
    );
  });

  it('should simulate subscription successfully', async () => {
    // Mock subscribe method
    const subscribeSpy = vi.spyOn(subscriptionService, 'subscribe')
      .mockResolvedValueOnce(true);
    
    const result = await subscriptionService.simulateSubscription(
      SubscriptionTier.PREMIUM,
      'month'
    );
    
    expect(result).toBe(true);
    expect(subscribeSpy).toHaveBeenCalledWith(
      'premium-monthly',
      'demo-card',
      true
    );
  });

  it('should handle simulation errors', async () => {
    // Mock subscribe to throw
    vi.spyOn(subscriptionService, 'subscribe')
      .mockRejectedValueOnce(new Error('Subscribe error'));
    
    // Mock console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    
    const result = await subscriptionService.simulateSubscription(
      SubscriptionTier.PRO,
      'year'
    );
    
    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
}); 