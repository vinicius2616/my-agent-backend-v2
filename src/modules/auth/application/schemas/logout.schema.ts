import { z } from 'zod';

export const logoutSchema = z.object({}).strict();

export type LogoutSchemaInput = z.infer<typeof logoutSchema>;
