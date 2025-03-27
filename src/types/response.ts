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

interface ErrorResponse {
  status: string;
  message: string;
  code?: string;
  stack?: string;
}
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
export {
  SuccessResponse,
  ErrorResponse,
  ApiResponse,
  IUserResponse,
  IPostResponse,
  ICommentResponse,
};
