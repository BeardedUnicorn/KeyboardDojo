import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchSubscription,
  updateSubscription,
  cancelSubscription,
  selectSubscription,
  selectCurrentTier,
  selectActivePlan,
  selectIsSubscriptionLoading,
  selectHasPremium,
  selectHasPro,
  SUBSCRIPTION_PLANS,
} from '@store/slices';

export const useSubscriptionRedux = () => {
  const dispatch = useAppDispatch();
  const subscription = useAppSelector(selectSubscription);
  const currentTier = useAppSelector(selectCurrentTier);
  const activePlan = useAppSelector(selectActivePlan);
  const isLoading = useAppSelector(selectIsSubscriptionLoading);
  const hasPremium = useAppSelector(selectHasPremium);
  const hasPro = useAppSelector(selectHasPro);

  // Load subscription on mount
  useEffect(() => {
    dispatch(fetchSubscription());
  }, [dispatch]);

  // Update subscription
  const updateSubscriptionHandler = useCallback(
    (planId: string, paymentMethod: string, autoRenew: boolean) => {
      dispatch(
        updateSubscription({
          planId,
          paymentMethod,
          autoRenew,
        }),
      );
    },
    [dispatch],
  );

  // Cancel subscription
  const cancelSubscriptionHandler = useCallback(() => {
    dispatch(cancelSubscription());
  }, [dispatch]);

  // Get available plans
  const getAvailablePlans = useCallback(() => {
    return SUBSCRIPTION_PLANS;
  }, []);

  // Get active plan details
  const getActivePlan = useCallback(() => {
    if (!activePlan) return null;
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === activePlan) || null;
  }, [activePlan]);

  return {
    subscription,
    currentTier,
    activePlan,
    isLoading,
    hasPremium,
    hasPro,
    updateSubscription: updateSubscriptionHandler,
    cancelSubscription: cancelSubscriptionHandler,
    getAvailablePlans,
    getActivePlan,
    isPremiumLoading: isLoading, // For compatibility with old context
  };
};
