import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchUserProgress,
  markLessonCompleted,
  addXp,
  updateStreak,
  updateHearts,
  updateCurrency,
  resetProgress,
  selectUserProgress,
} from '@slices/userProgressSlice';

import type { ApplicationType } from '@/types/progress/ICurriculum';

export const useUserProgressRedux = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(selectUserProgress);
  const isLoading = progress.isLoading;
  const error = progress.error;

  // Load user progress on mount
  useEffect(() => {
    dispatch(fetchUserProgress());
  }, [dispatch]);

  // Mark a lesson as completed
  const markLessonCompletedHandler = useCallback(
    (
      curriculumId: string,
      trackId: ApplicationType,
      lessonId: string,
      score?: number,
      timeSpent?: number,
    ) => {
      dispatch(
        markLessonCompleted({
          curriculumId,
          trackId,
          lessonId,
          score,
          timeSpent,
        }),
      );
    },
    [dispatch],
  );

  // Check if a lesson is completed
  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return progress.completedLessons.some((lesson) => lesson.lessonId === lessonId);
    },
    [progress.completedLessons],
  );

  // Check if a module is completed
  const isModuleCompleted = useCallback(
    (curriculumId: string, trackId: ApplicationType, moduleId: string) => {
      return progress.completedModules.some(
        (module) =>
          module.curriculumId === curriculumId &&
          module.trackId === trackId &&
          module.moduleId === moduleId,
      );
    },
    [progress.completedModules],
  );

  // Check if a node is completed
  const isNodeCompleted = useCallback(
    (nodeId: string) => {
      return progress.completedNodes.some((node) => node.nodeId === nodeId);
    },
    [progress.completedNodes],
  );

  // Get current lesson for a track
  const getCurrentLesson = useCallback(
    (trackId: ApplicationType) => {
      return progress.currentLessons.find((lesson) => lesson.trackId === trackId) || null;
    },
    [progress.currentLessons],
  );

  // Get XP
  const getXP = useCallback(() => {
    return progress.xp;
  }, [progress.xp]);

  // Get level
  const getLevel = useCallback(() => {
    return progress.level;
  }, [progress.level]);

  // Get streak days
  const getStreakDays = useCallback(() => {
    return progress.streakDays;
  }, [progress.streakDays]);

  // Get hearts
  const getHearts = useCallback(() => {
    return { current: progress.hearts.current, max: progress.hearts.max };
  }, [progress.hearts]);

  // Get currency
  const getCurrency = useCallback(() => {
    return progress.currency;
  }, [progress.currency]);

  // Refresh progress
  const refreshProgress = useCallback(() => {
    dispatch(fetchUserProgress());
  }, [dispatch]);

  // Add XP
  const addXpHandler = useCallback(
    (amount: number) => {
      dispatch(addXp(amount));
    },
    [dispatch],
  );

  // Update streak
  const updateStreakHandler = useCallback(() => {
    dispatch(updateStreak());
  }, [dispatch]);

  // Update hearts
  const updateHeartsHandler = useCallback(
    (current: number) => {
      dispatch(updateHearts({ current }));
    },
    [dispatch],
  );

  // Update currency
  const updateCurrencyHandler = useCallback(
    (amount: number) => {
      dispatch(updateCurrency(amount));
    },
    [dispatch],
  );

  // Reset progress
  const resetProgressHandler = useCallback(() => {
    dispatch(resetProgress());
  }, [dispatch]);

  return {
    progress,
    isLoading,
    error,
    markLessonCompleted: markLessonCompletedHandler,
    isLessonCompleted,
    isModuleCompleted,
    isNodeCompleted,
    getCurrentLesson,
    getXP,
    getLevel,
    getStreakDays,
    getHearts,
    getCurrency,
    refreshProgress,
    addXp: addXpHandler,
    updateStreak: updateStreakHandler,
    updateHearts: updateHeartsHandler,
    updateCurrency: updateCurrencyHandler,
    resetProgress: resetProgressHandler,
  };
};
