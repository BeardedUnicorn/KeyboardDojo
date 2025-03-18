import type { AchievementCategory } from '@/types/achievements/AchievementCategory';
import type { AchievementRarity } from '@/types/achievements/AchievementRarity';

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string; // Material-UI icon name
  xpReward: number;
  condition: {
    type: string;
    target: number;
    trackId?: string;
  };
  secret?: boolean;
}
