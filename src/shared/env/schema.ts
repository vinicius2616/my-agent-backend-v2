import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET é obrigatório').default('dev-secret-change-in-production'),
  BETTER_AUTH_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;
