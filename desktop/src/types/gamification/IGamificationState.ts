// Combined gamification state
import type { ICurrencyData } from '@/types/gamification/currency/ICurrencyData';
import type { IHeartsData } from '@/types/gamification/hearts/IHeartsData';
import type { IStreakData } from '@/types/gamification/streaks/IStreakData';
import type { IXPData } from '@/types/gamification/xp/IXPData';

export interface IGamificationState {
  xp: IXPData;
  hearts: IHeartsData;
  currency: ICurrencyData;
  streak: IStreakData;
  isLoading: boolean;
  error: string | null;
}
