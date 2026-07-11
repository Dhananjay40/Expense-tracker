export interface Transaction {
  id: string;
  category: string;
  title: string;
  amount: number;
  time: string;
  type: 'expense' | 'credit';
}