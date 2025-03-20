import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const status = err.status || 'error';
  res.status(statusCode).json({ status, message });
};

export { errorHandler };
