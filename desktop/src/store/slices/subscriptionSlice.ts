import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { loggerService } from '@/services';
import { SubscriptionTier } from '@/types/subscriptions/SubscriptionTier';

import type { RootState } from '@/store';
import type { ISubscriptionPlan } from '@/types/subscriptions/ISubscriptionPlan';
import type { ISubscriptionState } from '@/types/subscriptions/ISubscriptionState';

// Default subscription plans
export const SUBSCRIPTION_PLANS: ISubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: SubscriptionTier.FREE,
    price: 0,
    interval: 'month',
    features: [
      'Basic shortcut lessons',
      'Limited hearts (5 max)',
      'Standard regeneration speed',
      'Basic achievements',
    ],
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    tier: SubscriptionTier.PREMIUM,
    price: 4.99,
    interval: 'month',
    features: [
      'All shortcut lessons',
      'Unlimited hearts',
      'Faster heart regeneration',
      'All achievements',
      'No ads',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    tier: SubscriptionTier.PREMIUM,
    price: 49.99,
    interval: 'year',
    features: [
      'All shortcut lessons',
      'Unlimited hearts',
      'Faster heart regeneration',
      'All achievements',
      'No ads',
      '15% discount',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    tier: SubscriptionTier.PRO,
    price: 9.99,
    interval: 'month',
    features: [
      'All Premium features',
      'Advanced analytics',
      'Custom shortcut creation',
      'Priority support',
      'Early access to new features',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    tier: SubscriptionTier.PRO,
    price: 99.99,
    interval: 'year',
    features: [
      'All Premium features',
      'Advanced analytics',
      'Custom shortcut creation',
      'Priority support',
      'Early access to new features',
      '15% discount',
    ],
  },
];

// Define initial state
const initialState: ISubscriptionState = {
  currentTier: SubscriptionTier.FREE,
  activePlan: 'free',
  expiresAt: null,
  paymentMethod: null,
  autoRenew: false,
  isLoading: false,
  error: null,
};

// Create async thunks
export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async (_, { rejectWithValue }) => {
    try {
      // This would typically call subscriptionService.getState()
      // For now, we'll simulate by retrieving from localStorage
      const storedSubscription = localStorage.getItem('user-subscription');
      if (storedSubscription) {
        return JSON.parse(storedSubscription);
      }
      return initialState;
    } catch (error) {
      loggerService.error('Error fetching subscription', error);
      return rejectWithValue('Failed to fetch subscription');
    }
  },
);

export const updateSubscription = createAsyncThunk(
  'subscription/updateSubscription',
  async (
    {
      planId,
      paymentMethod,
      autoRenew,
    }: {
      planId: string;
      paymentMethod: string;
      autoRenew: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      // This would typically call subscriptionService.subscribe()
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);

      if (!plan) {
        return rejectWithValue(`Plan with ID ${planId} not found`);
      }

      // Calculate expiration date (1 month or 1 year from now)
      const now = new Date();
      let expiresAt: number;

      if (plan.interval === 'month') {
        expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).getTime();
      } else {
        expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).getTime();
      }

      const updatedSubscription = {
        currentTier: plan.tier,
        activePlan: planId,
        expiresAt,
        paymentMethod,
        autoRenew,
      };

      // Save to localStorage
      localStorage.setItem('user-subscription', JSON.stringify(updatedSubscription));

      return updatedSubscription;
    } catch (error) {
      loggerService.error('Error updating subscription', error);
      return rejectWithValue('Failed to update subscription');
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      // This would typically call subscriptionService.cancelSubscription()
      const updatedSubscription = {
        currentTier: SubscriptionTier.FREE,
        activePlan: 'free',
        expiresAt: null,
        paymentMethod: null,
        autoRenew: false,
      };

      // Save to localStorage
      localStorage.setItem('user-subscription', JSON.stringify(updatedSubscription));

      return updatedSubscription;
    } catch (error) {
      loggerService.error('Error canceling subscription', error);
      return rejectWithValue('Failed to cancel subscription');
    }
  },
);

// Create the slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        return {
          ...action.payload,
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.currentTier = action.payload.currentTier;
        state.activePlan = action.payload.activePlan;
        state.expiresAt = action.payload.expiresAt;
        state.paymentMethod = action.payload.paymentMethod;
        state.autoRenew = action.payload.autoRenew;
        state.isLoading = false;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.currentTier = action.payload.currentTier;
        state.activePlan = action.payload.activePlan;
        state.expiresAt = action.payload.expiresAt;
        state.paymentMethod = action.payload.paymentMethod;
        state.autoRenew = action.payload.autoRenew;
        state.isLoading = false;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export selectors
export const selectSubscription = (state: RootState) => state.subscription;
export const selectCurrentTier = (state: RootState) => state.subscription.currentTier;
export const selectActivePlan = (state: RootState) => state.subscription.activePlan;
export const selectIsSubscriptionLoading = (state: RootState) => state.subscription.isLoading;
export const selectHasPremium = (state: RootState) =>
  state.subscription.currentTier === SubscriptionTier.PREMIUM ||
  state.subscription.currentTier === SubscriptionTier.PRO;
export const selectHasPro = (state: RootState) =>
  state.subscription.currentTier === SubscriptionTier.PRO;

// Export reducer
export default subscriptionSlice.reducer;
