function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return d;
  }
  throw new Error('Data de lançamento inválida.');
}

export class LaunchDate {
  private readonly _value: Date;

  constructor(value: unknown) {
    if (value === null || value === undefined) {
      throw new Error('Data de lançamento é obrigatória.');
    }
    const date = toDate(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Data de lançamento inválida.');
    }
    this._value = date;
  }

  value(): Date {
    return this._value;
  }
}
