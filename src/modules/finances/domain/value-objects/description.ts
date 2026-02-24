const MIN_LENGTH = 3;
const MAX_LENGTH = 255;

export class Description {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value?.trim() ?? '';
    if (!trimmed) {
      throw new Error('Descrição é obrigatória.');
    }
    if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
      throw new Error(
        `Descrição deve ter entre ${MIN_LENGTH} e ${MAX_LENGTH} caracteres.`
      );
    }
    this._value = trimmed;
  }

  value(): string {
    return this._value;
  }
}
