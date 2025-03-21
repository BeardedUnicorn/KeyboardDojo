import { configureStore } from '@reduxjs/toolkit';
import { describe, test, expect, vi } from 'vitest';
import subscriptionReducer, {
  fetchSubscription,
  updateSubscription,
  cancelSubscription,
  selectSubscription,
  selectCurrentTier,
  selectActivePlan,
  selectIsSubscriptionLoading,
  selectHasPremium,
  selectHasPro,
} from '../subscriptionSlice';

import type { RootState } from '@/store';
import type { ISubscriptionState } from '@/types/subscriptions/ISubscriptionState';
import { SubscriptionTier } from '@/types/subscriptions/SubscriptionTier';

// Mock the loggerService
vi.mock('@/services', () => ({
  loggerService: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

// Create a mock store with preloaded state
const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      subscription: subscriptionReducer,
    },
    preloadedState: {
      subscription: preloadedState?.subscription ?? subscriptionReducer(undefined, { type: 'unknown' }),
    },
  });
};

describe('subscription reducer', () => {
  // State tests
  describe('state', () => {
    test('should initialize with correct default state', () => {
      const state = subscriptionReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        currentTier: SubscriptionTier.FREE,
        activePlan: 'free',
        expiresAt: null,
        paymentMethod: null,
        autoRenew: false,
        isLoading: false,
        error: null,
      });
    });
  });

  // Thunk tests
  describe('thunks', () => {
    test('fetchSubscription pending should set loading state', async () => {
      const store = createMockStore();
      const thunkPromise = store.dispatch(fetchSubscription());
      
      expect(store.getState().subscription.isLoading).toBe(true);
      expect(store.getState().subscription.error).toBe(null);
      
      await thunkPromise;
    });

    test('fetchSubscription fulfilled should update state', async () => {
      const mockSubscriptionData = {
        currentTier: SubscriptionTier.PREMIUM,
        activePlan: 'premium-monthly',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        paymentMethod: 'credit_card',
        autoRenew: true,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSubscriptionData));
      
      const store = createMockStore();
      await store.dispatch(fetchSubscription());
      
      const state = store.getState().subscription;
      expect(state.currentTier).toBe(SubscriptionTier.PREMIUM);
      expect(state.activePlan).toBe('premium-monthly');
      expect(state.expiresAt).toBe(mockSubscriptionData.expiresAt);
      expect(state.paymentMethod).toBe('credit_card');
      expect(state.autoRenew).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('fetchSubscription rejected should set error', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const store = createMockStore();
      await store.dispatch(fetchSubscription());
      
      const state = store.getState().subscription;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch subscription');
    });

    test('updateSubscription should update subscription state', async () => {
      const store = createMockStore();
      await store.dispatch(updateSubscription({
        planId: 'premium-monthly',
        paymentMethod: 'credit_card',
        autoRenew: true,
      }));
      
      const state = store.getState().subscription;
      expect(state.currentTier).toBe(SubscriptionTier.PREMIUM);
      expect(state.activePlan).toBe('premium-monthly');
      expect(state.paymentMethod).toBe('credit_card');
      expect(state.autoRenew).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('cancelSubscription should revert to free plan', async () => {
      const store = createMockStore();
      await store.dispatch(cancelSubscription());
      
      const state = store.getState().subscription;
      expect(state.currentTier).toBe(SubscriptionTier.FREE);
      expect(state.activePlan).toBe('free');
      expect(state.paymentMethod).toBe(null);
      expect(state.autoRenew).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  // Selector tests
  describe('selectors', () => {
    const mockState: RootState = {
      subscription: {
        currentTier: SubscriptionTier.PREMIUM,
        activePlan: 'premium-monthly',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        paymentMethod: 'credit_card',
        autoRenew: true,
        isLoading: false,
        error: null,
      },
    } as unknown as RootState;

    test('selectSubscription should return subscription state', () => {
      const result = selectSubscription(mockState);
      expect(result).toEqual(mockState.subscription);
    });

    test('selectCurrentTier should return current subscription tier', () => {
      const result = selectCurrentTier(mockState);
      expect(result).toBe(SubscriptionTier.PREMIUM);
    });

    test('selectActivePlan should return active subscription plan', () => {
      const result = selectActivePlan(mockState);
      expect(result).toBe('premium-monthly');
    });

    test('selectIsSubscriptionLoading should return loading state', () => {
      const result = selectIsSubscriptionLoading(mockState);
      expect(result).toBe(false);
    });

    test('selectHasPremium should return true for premium tier', () => {
      const result = selectHasPremium(mockState);
      expect(result).toBe(true);
    });

    test('selectHasPro should return false for non-pro tier', () => {
      const result = selectHasPro(mockState);
      expect(result).toBe(false);
    });
  });
}); 