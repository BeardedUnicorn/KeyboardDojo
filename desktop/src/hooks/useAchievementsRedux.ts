import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchAchievements,
  awardAchievement,
  refreshAchievements,
  selectAchievements,
  selectUnlockedAchievements,
  selectCompletedAchievements,
  selectIsAchievementsLoading,
} from '@store/slices';
import { selectIsInitialized } from '@store/slices/appSlice';

export const useAchievementsRedux = () => {
  const dispatch = useAppDispatch();
  const achievements = useAppSelector(selectAchievements);
  const unlockedAchievements = useAppSelector(selectUnlockedAchievements);
  const completedAchievements = useAppSelector(selectCompletedAchievements);
  const isLoading = useAppSelector(selectIsAchievementsLoading);
  const isAppInitialized = useAppSelector(selectIsInitialized);

  // Load achievements on mount, but only after app is initialized
  useEffect(() => {
    if (isAppInitialized) {
      dispatch(fetchAchievements());
    }
  }, [dispatch, isAppInitialized]);

  // Award an achievement
  const awardAchievementHandler = useCallback(
    (achievementId: string) => {
      dispatch(awardAchievement(achievementId));
    },
    [dispatch],
  );

  // Check if user has an achievement
  const hasAchievement = useCallback(
    (achievementId: string) => {
      return unlockedAchievements.some((achievement) => achievement.id === achievementId);
    },
    [unlockedAchievements],
  );

  // Refresh achievements
  const refreshAchievementsHandler = useCallback(() => {
    if (isAppInitialized) {
      dispatch(refreshAchievements());
      dispatch(fetchAchievements());
    }
  }, [dispatch, isAppInitialized]);

  return {
    achievements,
    unlockedAchievements,
    completedAchievements,
    awardAchievement: awardAchievementHandler,
    hasAchievement,
    refreshAchievements: refreshAchievementsHandler,
    isLoading,
  };
};
