import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptionService, SubscriptionState, SubscriptionTier, SubscriptionPlan } from '../services/subscriptionService';

// Context type
interface SubscriptionContextType {
  isLoading: boolean;
  state: SubscriptionState;
  plans: SubscriptionPlan[];
  activePlan: SubscriptionPlan | null;
  hasPremium: boolean;
  hasPro: boolean;
  subscribe: (planId: string, paymentMethod: string, autoRenew: boolean) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  simulateSubscription: (tier: SubscriptionTier, interval: 'month' | 'year') => Promise<boolean>;
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  isLoading: true,
  state: {
    currentTier: SubscriptionTier.FREE,
    activePlan: null,
    expiresAt: null,
    paymentMethod: null,
    autoRenew: false
  },
  plans: [],
  activePlan: null,
  hasPremium: false,
  hasPro: false,
  subscribe: async () => false,
  cancelSubscription: async () => false,
  simulateSubscription: async () => false
});

// Provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<SubscriptionState>(subscriptionService.getState());
  const [plans] = useState<SubscriptionPlan[]>(subscriptionService.getPlans());
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(subscriptionService.getActivePlan());

  // Initialize subscription service
  useEffect(() => {
    const initSubscription = async () => {
      await subscriptionService.initialize();
      setState(subscriptionService.getState());
      setActivePlan(subscriptionService.getActivePlan());
      setIsLoading(false);
    };

    initSubscription();

    // Add listener for subscription changes
    const handleSubscriptionChange = (newState: SubscriptionState) => {
      setState(newState);
      setActivePlan(subscriptionService.getActivePlan());
    };

    subscriptionService.addListener(handleSubscriptionChange);

    // Cleanup
    return () => {
      subscriptionService.removeListener(handleSubscriptionChange);
    };
  }, []);

  // Subscribe to a plan
  const subscribe = async (planId: string, paymentMethod: string, autoRenew: boolean) => {
    const result = await subscriptionService.subscribe(planId, paymentMethod, autoRenew);
    return result;
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    const result = await subscriptionService.cancelSubscription();
    return result;
  };

  // Simulate subscription (for demo purposes)
  const simulateSubscription = async (tier: SubscriptionTier, interval: 'month' | 'year') => {
    const result = await subscriptionService.simulateSubscription(tier, interval);
    return result;
  };

  // Check premium and pro status
  const hasPremium = subscriptionService.hasPremiumFeatures();
  const hasPro = subscriptionService.hasProFeatures();

  // Context value
  const value: SubscriptionContextType = {
    isLoading,
    state,
    plans,
    activePlan,
    hasPremium,
    hasPro,
    subscribe,
    cancelSubscription,
    simulateSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook for using the subscription context
export const useSubscription = () => useContext(SubscriptionContext);

export default SubscriptionContext; 