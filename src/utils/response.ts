import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '../types/response.js';

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

const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string
) => {
  res.status(statusCode).json({
    status: 'error',
    message,
    code,
  } as ErrorResponse);
};

export { sendSuccess, sendError };
