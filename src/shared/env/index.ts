import { config } from 'dotenv';
import { resolve } from 'path';
import { envSchema, type Env } from './schema';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;

config({ path: resolve(process.cwd(), envFile) });

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.errors.map((err) => {
      return `${err.path.join('.')}: ${err.message}`;
    });

    console.error('❌ Erro na validação das variáveis de ambiente:');
    console.error(errors.join('\n'));
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
