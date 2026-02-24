import type { AuthAccountRecord } from '../../domain/repositories/auth-repository';
import type { Account } from '@prisma/client';

export function toAuthAccountRecord(account: Account): AuthAccountRecord {
  return {
    id: account.id,
    userId: account.userId,
    providerId: account.providerId,
    accountId: account.accountId,
  };
}
