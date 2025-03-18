import React, { createContext, useContext, useState, useEffect } from 'react';

import type { ReactNode , FC } from 'react';

interface SubscriptionContextType {
  hasPremium: boolean;
  isPremiumLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [hasPremium, setHasPremium] = useState(false);
  const [isPremiumLoading, setIsPremiumLoading] = useState(true);

  // Load subscription from localStorage on mount
  useEffect(() => {
    const loadSubscription = () => {
      try {
        setIsPremiumLoading(true);
        const savedSubscription = localStorage.getItem('user-subscription');

        if (savedSubscription) {
          const subscription = JSON.parse(savedSubscription);
          setHasPremium(subscription.hasPremium || false);
        }
      } catch (error) {
        console.error('Failed to load subscription:', error);
      } finally {
        setIsPremiumLoading(false);
      }
    };

    loadSubscription();

    // Simulate loading delay
    setTimeout(() => {
      setIsPremiumLoading(false);
    }, 1000);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        hasPremium,
        isPremiumLoading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
