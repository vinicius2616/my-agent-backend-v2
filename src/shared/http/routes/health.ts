import { Request, Response } from 'express';
import { successResponse } from '@shared/http/response';
import { prisma } from '@shared/database/prisma';

export async function healthHandler(req: Request, res: Response): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json(
      successResponse({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      })
    );
  } catch (error) {
    res.status(503).json(
      successResponse({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      })
    );
  }
}
