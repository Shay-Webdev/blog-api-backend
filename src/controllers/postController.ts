import * as db from '../models/queries.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.js';
import { sendSuccess } from '../utils/response.js';
import { TPost, TUser } from '../types/types.js';

async function getAllPosts(
  req: Request<{}, {}, Omit<TUser, 'password'>>,
  res: Response,
  next: NextFunction
) {
  const userId: number = req.body.id;
  const posts = await db.getAllPosts(userId);
  if (!posts) {
    throw new AppError('No posts found', 404);
  }
  sendSuccess(res, posts, 200, 'Posts fetched successfully');
}

async function createPost(
  req: Request<{}, {}, Pick<TPost, 'title' | 'content' | 'authorId'>>,
  res: Response<TPost>,
  next: NextFunction
) {
  const post = req.body;
  const createdPost = await db.createPostByAuthorId(post);
  sendSuccess(res, createdPost, 201, 'Post created successfully');
}
export { getAllPosts, createPost };
