import { SubscriptionPlan, SubscriptionStatus } from '../../api/subscriptionService';

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

export interface SubscriptionState {
  subscription: Subscription | null;
  isPremium: boolean;
  loading: boolean;
  error: string | null;
  checkoutUrl: string | null;
} 