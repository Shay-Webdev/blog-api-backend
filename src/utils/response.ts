import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '../types/response.js';

const sendSuccess = <T>(
  res: Response,
  data: T,
  status: number = 200,
  message?: string,
  meta?: Record<string, any>
) => {
  res.status(status).json({
    success: true,
    data,
    message,
    meta,
  } as SuccessResponse<T>);
};

const sendError = (
  res: Response,
  message: string,
  status: number = 500,
  code?: string
) => {
  res.status(status).json({
    success: false,
    message,
    code,
  } as ErrorResponse);
};

export { sendSuccess, sendError };
