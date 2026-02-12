export interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: Record<string, unknown>;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): SuccessResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta,
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>,
  meta?: Record<string, unknown>
): ErrorResponse {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    meta,
  };
}
