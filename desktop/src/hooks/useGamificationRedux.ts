import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchGamificationData,
  addXP,
  useHearts as spendHearts,
  addHearts,
  addCurrency,
  spendCurrency,
  recordPractice,
  checkAndRegenerateHearts,
  setPremiumStatus,
  resetGamification,
  selectGamification,
  selectXP,
  selectLevel,
  selectHearts,
  selectCurrency,
  selectStreak,
  selectCurrentStreak,
  selectLongestStreak,
  selectIsGamificationLoading,
} from '@slices/gamificationSlice';

export const useGamificationRedux = () => {
  const dispatch = useAppDispatch();
  const gamification = useAppSelector(selectGamification);
  const xp = useAppSelector(selectXP);
  const level = useAppSelector(selectLevel);
  const hearts = useAppSelector(selectHearts);
  const currency = useAppSelector(selectCurrency);
  const streak = useAppSelector(selectStreak);
  const currentStreak = useAppSelector(selectCurrentStreak);
  const longestStreak = useAppSelector(selectLongestStreak);
  const isLoading = useAppSelector(selectIsGamificationLoading);

  // Load gamification data on mount
  useEffect(() => {
    dispatch(fetchGamificationData());
  }, [dispatch]);

  // Check and regenerate hearts periodically
  useEffect(() => {
    const checkHeartsInterval = setInterval(() => {
      dispatch(checkAndRegenerateHearts());
    }, 60000); // Check every minute

    // Initial check
    dispatch(checkAndRegenerateHearts());

    return () => {
      clearInterval(checkHeartsInterval);
    };
  }, [dispatch]);

  // XP methods
  const addXpHandler = useCallback(
    (amount: number, source: string, description?: string) => {
      dispatch(addXP({ amount, source, description }));
    },
    [dispatch],
  );

  // Hearts methods
  const spendHeartsHandler = useCallback(
    (count: number, reason: string) => {
      return dispatch(spendHearts({ count, reason }));
    },
    [dispatch],
  );

  const addHeartsHandler = useCallback(
    (count: number, reason: string) => {
      dispatch(addHearts({ count, reason }));
    },
    [dispatch],
  );

  const setPremiumStatusHandler = useCallback(
    (isPremium: boolean) => {
      dispatch(setPremiumStatus(isPremium));
    },
    [dispatch],
  );

  // Currency methods
  const addCurrencyHandler = useCallback(
    (amount: number, source: string, description?: string) => {
      dispatch(addCurrency({ amount, source, description }));
    },
    [dispatch],
  );

  const spendCurrencyHandler = useCallback(
    (amount: number, source: string, description?: string) => {
      return dispatch(spendCurrency({ amount, source, description }));
    },
    [dispatch],
  );

  // Streak methods
  const recordPracticeHandler = useCallback(() => {
    dispatch(recordPractice());
  }, [dispatch]);

  // Reset
  const resetHandler = useCallback(() => {
    dispatch(resetGamification());
  }, [dispatch]);

  // Getters
  const getXP = useCallback(() => xp.totalXP, [xp.totalXP]);
  const getLevel = useCallback(() => level, [level]);
  const getLevelProgress = useCallback(
    () => (xp.currentLevelXP / xp.nextLevelXP) * 100,
    [xp.currentLevelXP, xp.nextLevelXP],
  );
  const getHearts = useCallback(
    () => ({ current: hearts.current, max: hearts.max }),
    [hearts.current, hearts.max],
  );
  const getCurrency = useCallback(() => currency.balance, [currency.balance]);
  const getCurrentStreak = useCallback(() => currentStreak, [currentStreak]);
  const getLongestStreak = useCallback(() => longestStreak, [longestStreak]);

  return {
    // State
    gamification,
    xp,
    level,
    hearts,
    currency,
    streak,
    isLoading,

    // XP methods
    addXp: addXpHandler,

    // Hearts methods
    useHearts: spendHeartsHandler,
    addHearts: addHeartsHandler,
    setPremiumStatus: setPremiumStatusHandler,

    // Currency methods
    addCurrency: addCurrencyHandler,
    spendCurrency: spendCurrencyHandler,

    // Streak methods
    recordPractice: recordPracticeHandler,

    // Reset
    reset: resetHandler,

    // Getters
    getXP,
    getLevel,
    getLevelProgress,
    getHearts,
    getCurrency,
    getCurrentStreak,
    getLongestStreak,
  };
};
