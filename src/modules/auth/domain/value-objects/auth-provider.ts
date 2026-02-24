export const ALLOWED_AUTH_PROVIDERS = ['google'] as const;
export type AuthProviderValue = (typeof ALLOWED_AUTH_PROVIDERS)[number];

export class AuthProvider {
  private readonly _value: AuthProviderValue;

  constructor(value: string) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (!ALLOWED_AUTH_PROVIDERS.includes(normalized as AuthProviderValue)) {
      throw new Error('Provedor de autenticação não permitido.');
    }
    this._value = normalized as AuthProviderValue;
  }

  value(): AuthProviderValue {
    return this._value;
  }
}
