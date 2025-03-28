import { Response } from 'express';
import {
  DevErrorResponse,
  ProdErrorResponse,
  SuccessResponse,
} from '../types/response.js';
import { error } from 'console';
import { AppError } from '../models/errors.js';

const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
  meta?: Record<string, unknown>
) => {
  res.status(statusCode).json({
    status: 'success',
    data,
    message,
    meta,
  } as SuccessResponse<T>);
};

const sendDevError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  stack: string | undefined,
  error: AppError,
  code?: string
) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    stack,
    error,
    code,
  } as DevErrorResponse);
};
const sendProdError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string
) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    code,
  } as ProdErrorResponse);
};

export { sendSuccess, sendDevError, sendProdError };
