import type { ILevelHistoryEntry } from '@/types/gamification/ILevelHistoryEntry';
import type { IXPHistoryEntry } from '@/types/gamification/xp/IXPHistoryEntry';

export interface IXPData {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpHistory: IXPHistoryEntry[];
  levelHistory: ILevelHistoryEntry[];
}
