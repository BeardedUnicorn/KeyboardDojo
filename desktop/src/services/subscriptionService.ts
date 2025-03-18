import { storageService } from '../../../shared/src/utils';

import { loggerService } from './loggerService';

// Subscription tiers
export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro'
}

// Subscription plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

// Subscription state
export interface SubscriptionState {
  currentTier: SubscriptionTier;
  activePlan: string | null;
  expiresAt: number | null;
  paymentMethod: string | null;
  autoRenew: boolean;
}

// Default subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
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
      'No ads',
      'Exclusive themes',
      'Advanced statistics',
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
      'No ads',
      'Exclusive themes',
      'Advanced statistics',
      '2 months free',
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
      'Custom shortcut lessons',
      'Priority support',
      'Team progress tracking',
      'Export progress reports',
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
      'Custom shortcut lessons',
      'Priority support',
      'Team progress tracking',
      'Export progress reports',
      '2 months free',
    ],
  },
];

// Storage key
const SUBSCRIPTION_STORAGE_KEY = 'keyboard-dojo-subscription';

/**
 * Service to manage user subscriptions
 */
class SubscriptionService {
  private state: SubscriptionState;
  private listeners: ((state: SubscriptionState) => void)[] = [];

  constructor() {
    this.state = {
      currentTier: SubscriptionTier.FREE,
      activePlan: null,
      expiresAt: null,
      paymentMethod: null,
      autoRenew: false,
    };
  }

  /**
   * Initialize subscription service
   */
  async initialize(): Promise<void> {
    try {
      // Load subscription state from storage
      const savedState = await storageService.getItem<SubscriptionState>(SUBSCRIPTION_STORAGE_KEY);
      
      if (!savedState) {
        // Initialize with default state
        this.state = {
          currentTier: SubscriptionTier.FREE,
          activePlan: null,
          expiresAt: null,
          paymentMethod: null,
          autoRenew: false,
        };
        await this.saveState();
      } else {
        this.state = savedState;
      }
    } catch (error) {
      loggerService.error('Failed to initialize subscription service:', error, { component: 'SubscriptionService' });
    }
  }

  /**
   * Save subscription state
   */
  private async saveState(): Promise<void> {
    try {
      await storageService.setItem(SUBSCRIPTION_STORAGE_KEY, this.state);
      this.notifyListeners();
    } catch (error) {
      loggerService.error('Failed to save subscription state:', error, { component: 'SubscriptionService' });
    }
  }

  /**
   * Get current subscription state
   */
  getState(): SubscriptionState {
    return { ...this.state };
  }

  /**
   * Get available subscription plans
   */
  getPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  /**
   * Get active subscription plan
   */
  getActivePlan(): SubscriptionPlan | null {
    if (!this.state.activePlan) {
      return SUBSCRIPTION_PLANS[0]; // Free plan
    }
    
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === this.state.activePlan) || null;
  }

  /**
   * Subscribe to a plan
   * @param planId Plan ID to subscribe to
   * @param paymentMethod Payment method to use
   * @param autoRenew Whether to auto-renew the subscription
   */
  async subscribe(planId: string, paymentMethod: string, autoRenew: boolean): Promise<boolean> {
    try {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
      
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }
      
      // In a real implementation, this would call a payment API
      // For now, we'll simulate a successful subscription
      
      // Calculate expiration date
      const now = Date.now();
      const expiresAt = plan.interval === 'month'
        ? now + 30 * 24 * 60 * 60 * 1000 // 30 days
        : now + 365 * 24 * 60 * 60 * 1000; // 365 days
      
      this.state = {
        currentTier: plan.tier,
        activePlan: plan.id,
        expiresAt,
        paymentMethod,
        autoRenew,
      };
      
      await this.saveState();
      
      loggerService.info('Subscription successful', { 
        component: 'SubscriptionService',
        planId,
        tier: plan.tier,
        expiresAt: new Date(expiresAt).toISOString(),
      });
      
      return true;
    } catch (error) {
      loggerService.error('Failed to subscribe:', error, { 
        component: 'SubscriptionService',
        planId,
      });
      return false;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<boolean> {
    try {
      // In a real implementation, this would call a payment API
      // For now, we'll simulate a successful cancellation
      
      this.state = {
        ...this.state,
        autoRenew: false,
      };
      
      await this.saveState();
      
      loggerService.info('Subscription cancelled', { 
        component: 'SubscriptionService',
        planId: this.state.activePlan,
      });
      
      return true;
    } catch (error) {
      loggerService.error('Failed to cancel subscription:', error, { component: 'SubscriptionService' });
      return false;
    }
  }

  /**
   * Check if user has premium features
   */
  hasPremiumFeatures(): boolean {
    return this.state.currentTier !== SubscriptionTier.FREE;
  }

  /**
   * Check if user has pro features
   */
  hasProFeatures(): boolean {
    return this.state.currentTier === SubscriptionTier.PRO;
  }

  /**
   * Add listener for subscription state changes
   */
  addListener(callback: (state: SubscriptionState) => void): void {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback: (state: SubscriptionState) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.listeners = [];
  }

  /**
   * For demo purposes: simulate a subscription
   */
  async simulateSubscription(tier: SubscriptionTier, interval: 'month' | 'year'): Promise<boolean> {
    try {
      const planId = tier === SubscriptionTier.PREMIUM
        ? (interval === 'month' ? 'premium-monthly' : 'premium-yearly')
        : (interval === 'month' ? 'pro-monthly' : 'pro-yearly');
      
      return await this.subscribe(planId, 'demo-card', true);
    } catch (error) {
      console.error('Failed to simulate subscription:', error);
      return false;
    }
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService; 
