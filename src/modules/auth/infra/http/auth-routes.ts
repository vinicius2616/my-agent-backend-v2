import { Router, Request, Response } from 'express';
import { successResponse } from '@shared/http/response';
import { parseZod } from '@shared/http/zod-parse';
import { asyncHandler } from '@shared/http/async-handler';
import { registerSchema } from '../../application/schemas/register.schema';
import { loginSchema } from '../../application/schemas/login.schema';
import { socialAuthSchema } from '../../application/schemas/social-auth.schema';
import { getSessionSchema } from '../../application/schemas/session.schema';
import { logoutSchema } from '../../application/schemas/logout.schema';
import {
  RegisterUseCase,
  LoginUseCase,
  SocialAuthUseCase,
  GetSessionUseCase,
  LogoutUseCase,
} from '../../application/use-cases';
import { PrismaAuthRepository } from '../database';
import { BetterAuthProviderService, BetterAuthSessionService } from '../auth';
import { getSessionTokenFromRequest } from './get-session-token';

export function createAuthRoutes(): Router {
  const router = Router();
  const authRepository = new PrismaAuthRepository();

  router.post(
    '/register',
    asyncHandler(async (req: Request, res: Response) => {
      const input = parseZod(registerSchema, req.body);
      const authProvider = new BetterAuthProviderService(req, res);
      const registerUseCase = new RegisterUseCase(authRepository, authProvider);
      const data = await registerUseCase.execute(input);
      res.status(201).json(successResponse(data));
    })
  );

  router.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
      const input = parseZod(loginSchema, req.body);
      const authProvider = new BetterAuthProviderService(req, res);
      const loginUseCase = new LoginUseCase(authProvider);
      const data = await loginUseCase.execute(input);
      res.json(successResponse(data));
    })
  );

  router.post(
    '/social',
    asyncHandler(async (req: Request, res: Response) => {
      const input = parseZod(socialAuthSchema, req.body);
      const socialAuthUseCase = new SocialAuthUseCase(authRepository);
      const data = await socialAuthUseCase.execute(input);
      res.json(successResponse(data));
    })
  );

  router.get(
    '/session',
    asyncHandler(async (req: Request, res: Response) => {
      parseZod(getSessionSchema, req.body ?? {});
      const sessionToken = getSessionTokenFromRequest(req);
      const getSessionUseCase = new GetSessionUseCase(authRepository);
      const data = await getSessionUseCase.execute({ sessionToken });
      res.json(successResponse(data));
    })
  );

  router.post(
    '/logout',
    asyncHandler(async (req: Request, res: Response) => {
      parseZod(logoutSchema, req.body ?? {});
      const sessionToken = getSessionTokenFromRequest(req);
      const authSessionService = new BetterAuthSessionService(req, res);
      const logoutUseCase = new LogoutUseCase(authSessionService);
      const data = await logoutUseCase.execute({ sessionToken });
      res.json(successResponse(data));
    })
  );

  return router;
}
