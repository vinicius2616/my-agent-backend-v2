import type { TransactionCategoryValue } from '../../domain/value-objects/transaction-category';
import type { TransactionTypeValue } from '../../domain/value-objects/transaction-type';
import type { TransactionOutput } from './transaction-output.dto';

export interface UpdateTransactionInput {
  description?: string;
  amount?: number;
  type?: TransactionTypeValue;
  category?: TransactionCategoryValue;
  isRecurring?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  launchDate?: Date;
}

export interface UpdateTransactionOutput {
  message: string;
  transaction: TransactionOutput;
}
