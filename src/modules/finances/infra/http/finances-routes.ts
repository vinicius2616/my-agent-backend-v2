import { Router, Request, Response } from 'express';
import { successResponse } from '@shared/http/response';
import { parseZod } from '@shared/http/zod-parse';
import { asyncHandler } from '@shared/http/async-handler';
import { UnauthorizedError } from '@shared/errors/app-error';
import { createTransactionSchema } from '../../application/schemas/create-transaction.schema';
import { CreateTransactionUseCase } from '../../application/use-cases';
import { PrismaTransactionRepository } from '../database';

export function createFinancesRoutes(): Router {
  const router = Router();
  const transactionRepository = new PrismaTransactionRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);

  router.post(
    '/transactions',
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.userId) {
        throw new UnauthorizedError('Sessão inválida ou expirada.');
      }
      const input = parseZod(createTransactionSchema, req.body);
      const data = await createTransactionUseCase.execute(req.userId, input);
      res.status(201).json(successResponse(data));
    })
  );

  return router;
}
