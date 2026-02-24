import type { AuthUserRecord } from '../../domain/repositories/auth-repository';
import type { User } from '@prisma/client';

export function toAuthUserRecord(user: User): AuthUserRecord {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
