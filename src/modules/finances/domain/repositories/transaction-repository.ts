import type { TransactionCategoryValue } from '../value-objects/transaction-category';
import type { TransactionTypeValue } from '../value-objects/transaction-type';

export interface TransactionRecord {
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
  deletedAt: Date | null;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: TransactionTypeValue;
  category: TransactionCategoryValue;
  isRecurring: boolean;
  installmentNumber: number | null;
  totalInstallments: number | null;
}

export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  type?: TransactionTypeValue;
  category?: TransactionCategoryValue;
  isRecurring?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
}

export interface ITransactionRepository {
  create(userId: string, data: CreateTransactionData): Promise<TransactionRecord>;
  update(
    userId: string,
    id: string,
    data: UpdateTransactionData
  ): Promise<TransactionRecord | null>;
  findById(userId: string, id: string): Promise<TransactionRecord | null>;
  delete(userId: string, id: string): Promise<void>;
}
