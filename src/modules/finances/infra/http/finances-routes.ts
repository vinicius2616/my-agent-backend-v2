import { Router, Request, Response } from 'express';
import { successResponse } from '@shared/http/response';
import { parseZod } from '@shared/http/zod-parse';
import { asyncHandler } from '@shared/http/async-handler';
import { UnauthorizedError } from '@shared/errors/app-error';
import { createTransactionSchema } from '../../application/schemas/create-transaction.schema';
import { updateTransactionSchema } from '../../application/schemas/update-transaction.schema';
import { deleteTransactionParamsSchema } from '../../application/schemas/delete-transaction.schema';
import {
  CreateTransactionUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
} from '../../application/use-cases';
import { PrismaTransactionRepository } from '../database';

export function createFinancesRoutes(): Router {
  const router = Router();
  const transactionRepository = new PrismaTransactionRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);
  const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepository);
  const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepository);

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

  router.patch(
    '/transactions/:id',
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.userId) {
        throw new UnauthorizedError('Sessão inválida ou expirada.');
      }
      const id = req.params.id;
      const input = parseZod(updateTransactionSchema, req.body);
      const data = await updateTransactionUseCase.execute(req.userId, id, input);
      res.status(200).json(successResponse(data));
    })
  );

  router.delete(
    '/transactions/:id',
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.userId) {
        throw new UnauthorizedError('Sessão inválida ou expirada.');
      }
      const { id } = parseZod(deleteTransactionParamsSchema, req.params);
      const data = await deleteTransactionUseCase.execute(req.userId, id);
      res.status(200).json(successResponse(data));
    })
  );

  return router;
}
