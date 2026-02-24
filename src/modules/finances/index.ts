export { Transaction, type TransactionProps } from './domain/entities';
export type {
  ITransactionRepository,
  TransactionRecord,
  CreateTransactionData,
  UpdateTransactionData,
} from './domain/repositories';
export {
  isInstallmentRecurringExclusive,
  isAmountGreaterThanZero,
  isDescriptionValid,
  transactionBelongsToUser,
  canChangeTotalInstallments,
  canSetRecurring,
  type InstallmentRecurringExclusiveInput,
} from './domain/rules';
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
