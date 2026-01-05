export interface ExceptionParams {
  message: string;
}

export abstract class ExceptionsAdapter {
  abstract badRequest(params: ExceptionParams): void;
  abstract conflict(params: ExceptionParams): void;
  abstract internalServerError(params: ExceptionParams): void;
  abstract forbidden(params?: ExceptionParams): void;
  abstract unauthorized(params?: ExceptionParams): void;
  abstract notFound(params?: ExceptionParams): void;
}
