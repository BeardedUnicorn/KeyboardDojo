// User progress tracking

import type { ApplicationType } from '@/types/progress/ICurriculum';

export interface IUserProgress {
  userId: string;
  completedLessons: {
    lessonId: string;
    completedAt: string;
    score: number;
    timeSpent: number; // in seconds
  }[];
  completedModules: {
    moduleId: string;
    completedAt: string;
  }[];
  completedNodes: {
    nodeId: string;
    completedAt: string;
    stars: number; // 1-3 stars based on performance
  }[];
  currentLessons: {
    trackId: ApplicationType;
    lessonId: string;
    progress: number; // 0-100
  }[];
  xp: number;
  level: number;
  streakDays: number;
  lastActivity: string;
  hearts: {
    current: number;
    max: number;
    lastRegeneration: string;
  };
  currency: number;
}
