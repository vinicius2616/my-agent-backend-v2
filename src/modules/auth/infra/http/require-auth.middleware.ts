import type { Request, Response, NextFunction } from 'express';
import type { IAuthRepository } from '../../domain/repositories/auth-repository';
import { getSessionTokenFromRequest } from './get-session-token';
import { UnauthorizedError } from '@shared/errors/app-error';

/**
 * Middleware que resolve a sessão a partir do cookie e define req.userId.
 * Se não houver sessão válida ou usuário não existir, chama next(UnauthorizedError).
 */
export function requireAuth(authRepository: IAuthRepository) {
  const middlewareAsync = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = getSessionTokenFromRequest(req);
    if (!token) {
      next(new UnauthorizedError('Sessão inválida ou expirada.'));
      return;
    }

    const session = await authRepository.findSessionByToken(token);
    if (!session) {
      next(new UnauthorizedError('Sessão inválida ou expirada.'));
      return;
    }

    if (session.expiresAt <= new Date()) {
      next(new UnauthorizedError('Sessão inválida ou expirada.'));
      return;
    }

    const user = await authRepository.findUserById(session.userId);
    if (!user) {
      next(new UnauthorizedError('Sessão inválida ou expirada.'));
      return;
    }

    req.userId = user.id;
    next();
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(middlewareAsync(req, res, next)).catch(next);
  };
}
