export { Transaction, type TransactionProps } from './domain/entities';
export type {
  ITransactionRepository,
  TransactionRecord,
  CreateTransactionData,
  UpdateTransactionData,
} from './domain/repositories';
export {
  Amount,
  Description,
  TransactionType,
  TransactionCategory,
  ALLOWED_TRANSACTION_TYPES,
  ALLOWED_TRANSACTION_CATEGORIES,
  type TransactionTypeValue,
  type TransactionCategoryValue,
} from './domain/value-objects';
