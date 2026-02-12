import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
});

export type Env = z.infer<typeof envSchema>;
