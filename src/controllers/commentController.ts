import * as db from '../models/queries.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { sendSuccess } from '../utils/response.js';
import { TComment, TPost, TUser } from '../types/types.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const getAllComments = asyncHandler(async function (
  req: Request<{}, {}, Omit<TUser, 'password'>>,
  res: Response,
  next: NextFunction
) {
  const comments = await db.getAllComments();
  if (!comments) {
    throw new AppError('Resource or Route not found', 404, 'not_found');
  }
  sendSuccess(res, comments, 200, 'Comments fetched successfully');
});

const createComment = asyncHandler(async function (
  req: Request<{}, {}, Pick<TComment, 'content' | 'postId' | 'userId'>>,
  res: Response<TComment>,
  next: NextFunction
) {
  const comment = req.body;
  const parsedComment: Pick<TComment, 'content' | 'postId' | 'userId'> = {
    content: comment.content,
    postId: Number(comment.postId),
    userId: Number(comment.userId),
  };

  const user = await db.getUserById(parsedComment.userId);
  if (!user) {
    throw new AppError('Resource or Route not found', 404, 'not_found');
  }
  const post = await db.getPostById(parsedComment.postId);
  if (!post) {
    throw new AppError('Resource or Route not found', 404, 'not_found');
  }
  const createdComment = await db.createCommentByPostId(parsedComment);
  sendSuccess(res, createdComment, 201, 'Comment created successfully');
});
export { getAllComments, createComment };
