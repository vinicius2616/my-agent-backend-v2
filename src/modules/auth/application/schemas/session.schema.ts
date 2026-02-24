import { z } from 'zod';

export const getSessionSchema = z.object({}).strict();

export type GetSessionSchemaInput = z.infer<typeof getSessionSchema>;
