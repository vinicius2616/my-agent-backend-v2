/**
 * Regra: valor da transação deve ser maior que zero.
 */
export function isAmountGreaterThanZero(amount: number): boolean {
  return amount > 0;
}
