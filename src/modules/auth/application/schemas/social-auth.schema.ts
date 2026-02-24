import { z } from 'zod';
import { ALLOWED_AUTH_PROVIDERS } from '../../domain/value-objects';

export const socialAuthSchema = z.object({
  provider: z.enum(ALLOWED_AUTH_PROVIDERS, {
    errorMap: () => ({ message: 'Provedor de autenticação não permitido.' }),
  }),
  providerAccountId: z
    .string()
    .min(1, 'Identificador da conta do provedor é obrigatório'),
  email: z.string().email('E-mail inválido'),
  name: z.string().min(1, 'Nome é obrigatório'),
});

export type SocialAuthSchemaInput = z.infer<typeof socialAuthSchema>;
