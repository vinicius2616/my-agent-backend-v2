export const ALLOWED_TRANSACTION_CATEGORIES = [
  'alimentacao',
  'moradia',
  'transporte',
  'lazer',
  'saude',
  'educacao',
  'salario',
  'investimentos',
  'outros',
] as const;
export type TransactionCategoryValue =
  (typeof ALLOWED_TRANSACTION_CATEGORIES)[number];

export class TransactionCategory {
  private readonly _value: TransactionCategoryValue;

  constructor(value: string) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (
      !ALLOWED_TRANSACTION_CATEGORIES.includes(
        normalized as TransactionCategoryValue
      )
    ) {
      throw new Error(
        'Categoria de transação inválida. Use uma das categorias permitidas.'
      );
    }
    this._value = normalized as TransactionCategoryValue;
  }

  value(): TransactionCategoryValue {
    return this._value;
  }
}
