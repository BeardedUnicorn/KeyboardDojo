import { getToken } from './authService';

export enum SubscriptionPlan {
  MONTHLY = 'price_monthly',
  ANNUAL = 'price_annual',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  TRIALING = 'trialing',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  isPremium: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get the current user's subscription
 */
export const getUserSubscription = async (): Promise<SubscriptionResponse> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required to fetch subscription');
  }
  
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch subscription');
  }

  return await response.json();
};

/**
 * Create a checkout session for subscription
 */
export const createCheckoutSession = async (
  plan: SubscriptionPlan,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string }> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required to create checkout session');
  }
  
  const response = await fetch(`${API_BASE_URL}/subscriptions/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan,
      successUrl,
      cancelUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return await response.json();
};

/**
 * Cancel the current subscription
 */
export const cancelSubscription = async (
  immediateCancel: boolean = false
): Promise<{ subscription: Subscription; message: string }> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required to cancel subscription');
  }
  
  const response = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      immediateCancel,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel subscription');
  }

  return await response.json();
};

/**
 * Get formatted subscription plan name
 */
export const getPlanDisplayName = (plan?: SubscriptionPlan): string => {
  switch (plan) {
    case SubscriptionPlan.MONTHLY:
      return 'Monthly Plan';
    case SubscriptionPlan.ANNUAL:
      return 'Annual Plan (Save 20%)';
    default:
      return 'Unknown Plan';
  }
};

/**
 * Get formatted subscription status
 */
export const getStatusDisplayName = (status?: SubscriptionStatus): string => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return 'Active';
    case SubscriptionStatus.CANCELLED:
      return 'Cancelled';
    case SubscriptionStatus.PAST_DUE:
      return 'Past Due';
    case SubscriptionStatus.UNPAID:
      return 'Unpaid';
    case SubscriptionStatus.TRIALING:
      return 'Trial';
    case SubscriptionStatus.INCOMPLETE:
      return 'Incomplete';
    case SubscriptionStatus.INCOMPLETE_EXPIRED:
      return 'Expired';
    default:
      return 'Unknown';
  }
};

/**
 * Format date from timestamp
 */
export const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'N/A';
  
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}; 