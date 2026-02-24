export interface InstallmentRecurringExclusiveInput {
  isRecurring: boolean;
  installmentNumber: number | null;
  totalInstallments: number | null;
}

/**
 * Regra: parcelado não pode ser recorrente.
 * Retorna true quando a combinação é válida (não é ao mesmo tempo recorrente e parcelado).
 */
export function isInstallmentRecurringExclusive(
  params: InstallmentRecurringExclusiveInput
): boolean {
  const isInstallment =
    params.installmentNumber != null || params.totalInstallments != null;
  if (params.isRecurring && isInstallment) {
    return false;
  }
  return true;
}
