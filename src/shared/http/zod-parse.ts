import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { ValidationError } from '@shared/errors/app-error';

export function parseZod<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  const err = result.error as ZodError;
  const first = err.errors[0];
  const details: Record<string, unknown> = first
    ? { campo: first.path.join('.') || 'body', erro: first.message }
    : {};
  throw new ValidationError('Dados inválidos', details);
}
