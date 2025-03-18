import { TUser, TPost, TComment } from './types.js';

interface IUserRequestBody extends Omit<TUser, 'id' | 'isAuthor'> {}
interface IPostRequestBody extends TPost {}
interface ICommentRequestBody extends TComment {}

export { IUserRequestBody, IPostRequestBody, ICommentRequestBody };
