import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { log } from 'console';
import { sendDevError, sendProdError } from '../utils/response.js';
import { Prisma } from '@prisma/client';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error =
    err instanceof AppError ? err : new AppError('Internal server error', 500);

  if (process.env.NODE_ENV == 'development') {
    console.error('development mode: error', error);
    sendDevError(
      res,
      error.message,
      error.statusCode,
      error.stack,
      error,
      error.code
    );
  } else if (process.env.NODE_ENV == 'production') {
    console.error(
      `[${new Date().toISOString()}] ${error.status} ${error.message}`
    );
    sendProdError(res, error.message, error.statusCode, error.code);
  }
};

export { errorHandler };
