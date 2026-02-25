import { z } from 'zod';

export const deleteTransactionParamsSchema = z.object({
  id: z.string().uuid('ID inválido.'),
});

export type DeleteTransactionParamsSchemaInput = z.infer<
  typeof deleteTransactionParamsSchema
>;
