import type { ICurrencyTransaction } from '@/types/gamification/currency/ICurrencyTransaction';

export interface ICurrencyData {
  balance: number;
  totalEarned: number;
  transactions: ICurrencyTransaction[];
  inventory: { [itemId: string]: number };
}
