export const ALLOWED_TRANSACTION_TYPES = ['entrada', 'saida'] as const;
export type TransactionTypeValue = (typeof ALLOWED_TRANSACTION_TYPES)[number];

export class TransactionType {
  private readonly _value: TransactionTypeValue;

  constructor(value: string) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (!ALLOWED_TRANSACTION_TYPES.includes(normalized as TransactionTypeValue)) {
      throw new Error('Tipo de transação inválido. Use "entrada" ou "saida".');
    }
    this._value = normalized as TransactionTypeValue;
  }

  value(): TransactionTypeValue {
    return this._value;
  }
}
