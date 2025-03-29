import { TErrorCode, TErrorMessage, TStatusCode } from '../types/types.js';

export class AppError extends Error {
  statusCode: TStatusCode;
  status: string;
  code?: TErrorCode;
  isOperational: boolean;
  constructor(
    message: TErrorMessage,
    statusCode: TStatusCode,
    code?: TErrorCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: TErrorMessage, code: TErrorCode) {
    super(message, 500, code);
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(field: string) {
    super(`Conflict occurred`, 'conflict');
  }
}

export class NotFoundError extends DatabaseError {
  constructor(entity: string) {
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
    code: TErrorCode
  ) {
    super(message, 400, code);
  }
}
