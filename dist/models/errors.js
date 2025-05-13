export class AppError extends Error {
    statusCode;
    status;
    code;
    isOperational;
    errorSource;
    constructor(message, statusCode, code, errorSource) {
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
    constructor(message, code, errorSource) {
        super(message, 500, code, errorSource);
    }
}
export class UniqueConstraintError extends DatabaseError {
    constructor(field) {
        super(`Conflict occurred`, 'conflict');
    }
}
export class NotFoundError extends DatabaseError {
    constructor() {
        super(`Resource or Route not found`, 'not_found');
    }
}
export class ValidationError extends AppError {
    constructor(message, code, errorSource) {
        super(message, 400, code, errorSource);
    }
}
//# sourceMappingURL=errors.js.map