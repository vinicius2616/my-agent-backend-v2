import type { TransactionCategoryValue } from '../../domain/value-objects/transaction-category';
import type { TransactionTypeValue } from '../../domain/value-objects/transaction-type';

export interface TransactionOutput {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionTypeValue;
  category: TransactionCategoryValue;
  isRecurring: boolean;
  installmentNumber: number | null;
  totalInstallments: number | null;
  createdAt: Date;
  updatedAt: Date;
}
