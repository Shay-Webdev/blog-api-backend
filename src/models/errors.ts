export class AppError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
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
