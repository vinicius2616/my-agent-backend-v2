/**
 * Regra de update: não alterar total_installments após criação.
 * Se a transação já é parcelada (existing != null), não permite mudar o valor.
 */
export function canChangeTotalInstallments(
  existingTotalInstallments: number | null,
  newTotalInstallments: number | null
): boolean {
  if (existingTotalInstallments == null) {
    return true;
  }
  return newTotalInstallments === existingTotalInstallments;
}
