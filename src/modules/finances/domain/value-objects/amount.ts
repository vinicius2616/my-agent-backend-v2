const DECIMAL_PLACES = 2;
const MAX_ABS = 9_999_999_999.99;

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export class Amount {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new Error('Valor deve ser um número válido.');
    }
    const rounded = roundToTwoDecimals(value);
    if (Math.abs(rounded) > MAX_ABS) {
      throw new Error(
        `Valor deve estar entre -${MAX_ABS} e ${MAX_ABS}.`
      );
    }
    this._value = rounded;
  }

  value(): number {
    return this._value;
  }
}
