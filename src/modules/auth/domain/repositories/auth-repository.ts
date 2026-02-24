export interface AuthUserRecord {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthSessionRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface AuthAccountRecord {
  id: string;
  userId: string;
  providerId: string;
  accountId: string;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;
  findUserById(id: string): Promise<AuthUserRecord | null>;
  findAccountByUserIdAndProvider(
    userId: string,
    providerId: string
  ): Promise<AuthAccountRecord | null>;
  findAccountByProviderIdAndAccountId(
    providerId: string,
    accountId: string
  ): Promise<AuthAccountRecord | null>;
  createUser(data: { email: string; name: string | null }): Promise<AuthUserRecord>;
  createAccount(data: {
    userId: string;
    providerId: string;
    accountId: string;
  }): Promise<AuthAccountRecord>;
  createSession(userId: string, token: string, expiresAt: Date): Promise<AuthSessionRecord>;
  findSessionByToken(token: string): Promise<AuthSessionRecord | null>;
  deleteSessionByToken(token: string): Promise<void>;
}
