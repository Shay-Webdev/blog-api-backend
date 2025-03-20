class AppError extends Error {
  statusCode: number;
  code?: string;
  constructor(message: string, statusCode: number = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

class NotFoundError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 404, code);
  }
}
export { AppError, ValidationError, NotFoundError };
