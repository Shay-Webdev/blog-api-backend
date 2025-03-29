import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { log } from 'console';
import { sendDevError, sendProdError } from '../utils/response.js';
import { Prisma } from '@prisma/client';

const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV == 'development') {
    console.error('development mode: error', error);
    if (error.isOperational) {
      sendDevError(
        res,
        error.message,
        error.statusCode,
        error.stack,
        error,
        error.code
      );
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        stack: error.stack,
        error,
      });
    }
  } else if (process.env.NODE_ENV == 'production') {
    console.error(
      `[${new Date().toISOString()}], status:${error.status}, statusCode:${
        error.statusCode
      }, message: ${error.message}`
    );
    if (error.isOperational) {
      sendProdError(res, error.message, error.statusCode, error.code);
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }
};

export { errorHandler };
