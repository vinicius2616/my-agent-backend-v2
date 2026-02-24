import type {
  IAuthRepository,
  AuthUserRecord,
  AuthSessionRecord,
  AuthAccountRecord,
} from '../../domain/repositories/auth-repository';
import { prisma } from '@shared/database/prisma';
import { toAuthUserRecord, toAuthAccountRecord, toAuthSessionRecord } from '../mappers';

export class PrismaAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user ? toAuthUserRecord(user) : null;
  }

  async findUserById(id: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? toAuthUserRecord(user) : null;
  }

  async findAccountByUserIdAndProvider(
    userId: string,
    providerId: string
  ): Promise<AuthAccountRecord | null> {
    const account = await prisma.account.findFirst({
      where: { userId, providerId },
    });
    return account ? toAuthAccountRecord(account) : null;
  }

  async findAccountByProviderIdAndAccountId(
    providerId: string,
    accountId: string
  ): Promise<AuthAccountRecord | null> {
    const account = await prisma.account.findUnique({
      where: {
        providerId_accountId: { providerId, accountId },
      },
    });
    return account ? toAuthAccountRecord(account) : null;
  }

  async createUser(data: {
    email: string;
    name: string | null;
  }): Promise<AuthUserRecord> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
    return toAuthUserRecord(user);
  }

  async createAccount(data: {
    userId: string;
    providerId: string;
    accountId: string;
  }): Promise<AuthAccountRecord> {
    const account = await prisma.account.create({
      data: {
        userId: data.userId,
        providerId: data.providerId,
        accountId: data.accountId,
      },
    });
    return toAuthAccountRecord(account);
  }

  async createSession(
    _userId: string,
    _token: string,
    _expiresAt: Date
  ): Promise<AuthSessionRecord> {
    throw new Error('createSession ainda não implementado.');
  }

  async findSessionByToken(token: string): Promise<AuthSessionRecord | null> {
    const session = await prisma.session.findUnique({
      where: { token },
    });
    return session ? toAuthSessionRecord(session) : null;
  }

  async deleteSessionByToken(token: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { token },
    });
  }
}
