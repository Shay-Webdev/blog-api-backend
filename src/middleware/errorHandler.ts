import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { log } from 'console';
import { sendError } from '../utils/response.js';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error =
    err instanceof AppError ? err : new AppError('Internal server error', 500);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    console.error(
      `[${new Date().toISOString()}] ${error.statusCode} ${error.message}`
    );
  }

  sendError(res, error.message, error.statusCode, error.code);
};

export { errorHandler };
