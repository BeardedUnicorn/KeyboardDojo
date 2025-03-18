import type { IAchievement } from '@/types/achievements/IAchievement';

export interface IAchievementProgress {
  achievement: IAchievement;
  progress: number;
  completed: boolean;
  unlockedAt?: string;
}
