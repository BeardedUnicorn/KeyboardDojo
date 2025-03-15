import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import {
  getUserSubscription,
  createCheckoutSession,
  cancelSubscription,
  Subscription,
  SubscriptionPlan,
} from '../../api/subscriptionService';

// Types
interface SubscriptionState {
  subscription: Subscription | null;
  isPremium: boolean;
  checkoutUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: SubscriptionState = {
  subscription: null,
  isPremium: false,
  checkoutUrl: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserSubscription = createAsyncThunk(
  'subscription/fetchUserSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserSubscription();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch subscription');
    }
  }
);

export const createStripeCheckoutSession = createAsyncThunk(
  'subscription/createCheckoutSession',
  async (
    {
      plan,
      successUrl,
      cancelUrl,
    }: {
      plan: SubscriptionPlan;
      successUrl: string;
      cancelUrl: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await createCheckoutSession(plan, successUrl, cancelUrl);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create checkout session');
    }
  }
);

export const cancelUserSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (
    { immediateCancel = false }: { immediateCancel?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await cancelSubscription(immediateCancel);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to cancel subscription');
    }
  }
);

// Subscription slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    resetCheckoutUrl: (state) => {
      state.checkoutUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user subscription
      .addCase(fetchUserSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.isPremium = action.payload.isPremium;
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch subscription';
      })
      
      // Create checkout session
      .addCase(createStripeCheckoutSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.checkoutUrl = null;
      })
      .addCase(createStripeCheckoutSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checkoutUrl = action.payload.url;
      })
      .addCase(createStripeCheckoutSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to create checkout session';
      })
      
      // Cancel subscription
      .addCase(cancelUserSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelUserSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        
        // Update isPremium status based on the new subscription status
        state.isPremium = action.payload.subscription.status === 'active' || 
                          action.payload.subscription.status === 'trialing';
      })
      .addCase(cancelUserSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to cancel subscription';
      });
  },
});

// Actions
export const { clearSubscriptionError, resetCheckoutUrl } = subscriptionSlice.actions;

// Selectors
export const selectSubscription = (state: RootState) => state.subscription.subscription;
export const selectIsPremium = (state: RootState) => state.subscription.isPremium;
export const selectCheckoutUrl = (state: RootState) => state.subscription.checkoutUrl;
export const selectSubscriptionLoading = (state: RootState) => state.subscription.isLoading;
export const selectSubscriptionError = (state: RootState) => state.subscription.error;

export default subscriptionSlice.reducer; 