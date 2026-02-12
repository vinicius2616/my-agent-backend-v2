import { Express } from 'express';
import { createServer, setupErrorHandler } from '@shared/http/server';
import { healthHandler } from '@shared/http/routes/health';

export function setupApp(): Express {
  const app = createServer();

  app.get('/health', healthHandler);

  setupErrorHandler(app);

  return app;
}
