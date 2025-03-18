// Currency types
export interface ICurrencyTransaction {
  date: string;
  amount: number;
  type: 'earn' | 'spend';
  source: string;
  description?: string;
}
