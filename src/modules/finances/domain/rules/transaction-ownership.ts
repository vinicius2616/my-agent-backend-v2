/**
 * Regra: transação pertence ao usuário do contexto (ownership).
 */
export function transactionBelongsToUser(
  transactionUserId: string,
  requestUserId: string
): boolean {
  return transactionUserId === requestUserId;
}
