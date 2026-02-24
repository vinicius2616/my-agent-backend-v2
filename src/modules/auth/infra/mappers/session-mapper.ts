import type { AuthSessionRecord } from '../../domain/repositories/auth-repository';
import type { Session } from '@prisma/client';

export function toAuthSessionRecord(session: Session): AuthSessionRecord {
  return {
    id: session.id,
    userId: session.userId,
    token: session.token,
    expiresAt: session.expiresAt,
  };
}
