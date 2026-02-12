import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/app-error';
import { errorResponse } from '@shared/http/response';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      errorResponse(err.code, err.message, err.details)
    );
    return;
  }

  console.error('Erro não tratado:', err);

  res.status(500).json(
    errorResponse(
      'ERRO_INTERNO',
      'Erro interno do servidor',
      process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
    )
  );
}
