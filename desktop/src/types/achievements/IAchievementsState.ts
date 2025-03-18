import type { IAchievement as AchievementType } from '@/types/achievements/IAchievement';
import type { IAchievementWithProgress } from '@store/slices';

export interface IAchievementsState {
  achievements: AchievementType[];
  unlockedAchievements: AchievementType[];
  completedAchievements: IAchievementWithProgress[];
  isLoading: boolean;
  error: string | null;
}
