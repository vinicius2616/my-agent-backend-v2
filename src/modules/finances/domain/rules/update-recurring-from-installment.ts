/**
 * Regra de update: não transformar transação parcelada em recorrente.
 * Se já é parcelada (totalInstallments != null), não pode setar isRecurring = true.
 */
export function canSetRecurring(
  existingTotalInstallments: number | null,
  newIsRecurring: boolean
): boolean {
  if (existingTotalInstallments != null && newIsRecurring) {
    return false;
  }
  return true;
}
