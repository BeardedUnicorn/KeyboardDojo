import type { SubscriptionTier } from '@/types/subscriptions/SubscriptionTier';

export interface ISubscriptionState {
  currentTier: SubscriptionTier;
  activePlan: string | null;
  expiresAt: number | null;
  paymentMethod: string | null;
  autoRenew: boolean;
  isLoading: boolean;
  error: string | null;
}
