import type { IAchievement as AchievementType } from '@/types/achievements/IAchievement';

export interface IAchievementWithProgress {
  achievement: AchievementType;
  completed: boolean;
  completedDate?: string;
  progress?: number;
}
