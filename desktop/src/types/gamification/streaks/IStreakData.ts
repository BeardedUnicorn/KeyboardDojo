import type { IStreakHistoryEntry } from '@/types/gamification/streaks/IStreakHistoryEntry';

export interface IStreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  streakFreezes: number;
  streakHistory: IStreakHistoryEntry[];
}
