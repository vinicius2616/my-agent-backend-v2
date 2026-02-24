import { Express } from 'express';
import { createServer, setupErrorHandler } from '@shared/http/server';
import { healthHandler } from '@shared/http/routes/health';
import { createAuthRoutes, requireAuth } from '@modules/auth/infra/http';
import { createFinancesRoutes } from '@modules/finances/infra/http';
import { PrismaAuthRepository } from '@modules/auth/infra/database';

export function setupApp(): Express {
  const app = createServer();

  app.get('/health', healthHandler);
  app.use('/auth', createAuthRoutes());

  const authRepository = new PrismaAuthRepository();
  app.use('/finances', requireAuth(authRepository), createFinancesRoutes());

  setupErrorHandler(app);

  return app;
}
