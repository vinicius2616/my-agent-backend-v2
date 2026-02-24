const MAX_LENGTH = 255;

export class Description {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value?.trim() ?? '';
    if (!trimmed) {
      throw new Error('Descrição é obrigatória.');
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new Error(
        `Descrição deve ter no máximo ${MAX_LENGTH} caracteres.`
      );
    }
    this._value = trimmed;
  }

  value(): string {
    return this._value;
  }
}
