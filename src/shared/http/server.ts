import express, { Express } from 'express';
import { errorHandler } from './middleware/error-handler';

export function createServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
}

export function setupErrorHandler(app: Express): void {
  app.use(errorHandler);
}
