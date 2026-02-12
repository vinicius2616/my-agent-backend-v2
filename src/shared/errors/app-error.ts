export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('ERRO_VALIDACAO', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super('RECURSO_NAO_ENCONTRADO', message, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super('NAO_AUTORIZADO', message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super('ACESSO_NEGADO', message, 403);
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Erro interno do servidor') {
    super('ERRO_INTERNO', message, 500);
    this.name = 'InternalServerError';
  }
}
