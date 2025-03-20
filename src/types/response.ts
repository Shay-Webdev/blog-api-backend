import { TUser, TPost, TComment } from '../types/types.js';

interface IUserResponse extends Omit<TUser, 'password'> {}
interface IPostResponse extends TPost {}
interface ICommentResponse extends TComment {}

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

interface ErrorResponse {
  success: false;
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
