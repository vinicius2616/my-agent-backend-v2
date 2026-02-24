import { Express } from 'express';
import { createServer, setupErrorHandler } from '@shared/http/server';
import { healthHandler } from '@shared/http/routes/health';
import { createAuthRoutes } from '@modules/auth/infra/http';

export function setupApp(): Express {
  const app = createServer();

  app.get('/health', healthHandler);
  app.use('/auth', createAuthRoutes());

  setupErrorHandler(app);

  return app;
}
