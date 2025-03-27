export class AppError extends Error {
  statusCode: number;
  status: string;
  code?: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, code: string = 'DATABASE_ERROR') {
    super(message, 500, code);
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(field: string) {
    super(`${field} already exists`, 'UNIQUE_CONSTRAINT_FAILED');
  }
}

export class NotFoundError extends DatabaseError {
  constructor(entity: string) {
    super(`${entity} not found`, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, 400, code);
  }
}
