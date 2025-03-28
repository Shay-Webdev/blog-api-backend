import { AppError } from '../models/errors.js';
import { TUser, TPost, TComment } from '../types/types.js';

interface IUserResponse extends Omit<TUser, 'password'> {}
interface IPostResponse extends TPost {}
interface ICommentResponse extends TComment {}

interface SuccessResponse<T> {
  status: string;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

interface DevErrorResponse {
  status: number;
  message: string;
  stack?: string;
  error: AppError;
  code?: string;
}

interface ProdErrorResponse {
  status: number;
  message: string;
  code?: string;
}
type ApiResponse<T> = SuccessResponse<T> | DevErrorResponse | ProdErrorResponse;
export {
  SuccessResponse,
  DevErrorResponse,
  ProdErrorResponse,
  ApiResponse,
  IUserResponse,
  IPostResponse,
  ICommentResponse,
};
