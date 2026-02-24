const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value?.trim() ?? '';
    if (!trimmed) {
      throw new Error('E-mail é obrigatório.');
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new Error('E-mail inválido.');
    }
    this._value = trimmed;
  }

  value(): string {
    return this._value;
  }
}
