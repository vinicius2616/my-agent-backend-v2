const MIN_LENGTH = 3;
const MAX_LENGTH = 255;

/**
 * Regra: descrição válida — obrigatória, 3–255 caracteres, não apenas espaços.
 */
export function isDescriptionValid(description: string): boolean {
  const trimmed = description?.trim() ?? '';
  if (!trimmed) {
    return false;
  }
  return trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH;
}
