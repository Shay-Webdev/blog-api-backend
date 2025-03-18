import { TUser, TPost, TComment } from '../types/types.js';

interface IUserResponse extends Omit<TUser, 'password'> {}
interface IPostResponse extends TPost {}
interface ICommentResponse extends TComment {}

export { IUserResponse, IPostResponse, ICommentResponse };
