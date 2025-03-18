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

export const useAchievementsRedux = () => {
  const dispatch = useAppDispatch();
  const achievements = useAppSelector(selectAchievements);
  const unlockedAchievements = useAppSelector(selectUnlockedAchievements);
  const completedAchievements = useAppSelector(selectCompletedAchievements);
  const isLoading = useAppSelector(selectIsAchievementsLoading);

  // Load achievements on mount
  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

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
    dispatch(refreshAchievements());
    dispatch(fetchAchievements());
  }, [dispatch]);

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
