import { z } from 'zod';
import {
  ALLOWED_TRANSACTION_TYPES,
  ALLOWED_TRANSACTION_CATEGORIES,
} from '../../domain/value-objects';

const DESCRIPTION_MIN = 3;
const DESCRIPTION_MAX = 255;
const AMOUNT_MAX_ABS = 9_999_999_999.99;

const descriptionSchema = z
  .string()
  .min(1, 'Descrição é obrigatória.')
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(
        DESCRIPTION_MIN,
        `Descrição deve ter entre ${DESCRIPTION_MIN} e ${DESCRIPTION_MAX} caracteres.`
      )
      .max(
        DESCRIPTION_MAX,
        `Descrição deve ter entre ${DESCRIPTION_MIN} e ${DESCRIPTION_MAX} caracteres.`
      )
  );

const amountSchema = z
  .number({
    invalid_type_error: 'Valor deve ser um número válido.',
  })
  .refine(
    (n) => !Number.isNaN(n) && Math.abs(n) <= AMOUNT_MAX_ABS,
    `Valor deve estar entre -${AMOUNT_MAX_ABS} e ${AMOUNT_MAX_ABS}.`
  )
  .transform((n) => Math.round(n * 100) / 100);

export const updateTransactionSchema = z
  .object({
    description: descriptionSchema.optional(),
    amount: amountSchema.optional(),
    type: z
      .enum(ALLOWED_TRANSACTION_TYPES, {
        errorMap: () => ({
          message: 'Tipo de transação inválido. Use "entrada" ou "saida".',
        }),
      })
      .optional(),
    category: z
      .enum(ALLOWED_TRANSACTION_CATEGORIES, {
        errorMap: () => ({
          message:
            'Categoria de transação inválida. Use uma das categorias permitidas.',
        }),
      })
      .optional(),
    isRecurring: z.boolean().optional(),
    installmentNumber: z
      .number()
      .int('Número da parcela deve ser um número inteiro.')
      .positive('Número da parcela deve ser maior que zero.')
      .nullable()
      .optional(),
    totalInstallments: z
      .number()
      .int('Total de parcelas deve ser um número inteiro.')
      .positive('Total de parcelas deve ser maior que zero.')
      .nullable()
      .optional(),
  })
  .strict();

export type UpdateTransactionSchemaInput = z.infer<typeof updateTransactionSchema>;
