import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@shared/database/prisma';
import { env } from '@shared/env';

const baseURL = env.BETTER_AUTH_URL ?? `http://localhost:${env.PORT}`;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL,
});
