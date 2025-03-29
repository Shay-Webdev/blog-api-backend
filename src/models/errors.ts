import { TErrorCode, TErrorMessage, TStatusCode } from '../types/types.js';

export class AppError extends Error {
  statusCode: TStatusCode;
  status: string;
  code?: TErrorCode;
  isOperational: boolean;
  errorSource?: unknown;
  constructor(
    message: TErrorMessage,
    statusCode: TStatusCode,
    code?: TErrorCode,
    errorSource?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.code = code;
    this.isOperational = true;
    this.errorSource = errorSource;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: TErrorMessage, code: TErrorCode, errorSource?: unknown) {
    super(message, 500, code, errorSource);
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(field: string) {
    super(`Conflict occurred`, 'conflict');
  }
}

export class NotFoundError extends DatabaseError {
  constructor() {
    super(`Resource or Route not found`, 'not_found');
  }
}

export class ValidationError extends AppError {
  constructor(
    message: Extract<
      TErrorMessage,
      | 'Invalid request body'
      | 'Missing input'
      | 'Invalid input'
      | 'Request too large'
    >,
    code: TErrorCode,
    errorSource?: unknown
  ) {
    super(message, 400, code, errorSource);
  }
}
