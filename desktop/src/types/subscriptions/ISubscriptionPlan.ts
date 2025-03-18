import type { SubscriptionTier } from '@/types/subscriptions/SubscriptionTier';

export interface ISubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}
